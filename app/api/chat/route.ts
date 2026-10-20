import {
  loadChatMessages,
  saveChatMessages,
} from "@/features/ai/actions/chat-store";
import { Conversation } from "./../../../lib/generated/prisma/browser";
import { requireUser } from "@/features/auth/action/require-user";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  convertToModelMessages,
  createIdGenerator,
  createUIMessageStream,
  createUIMessageStreamResponse,
  isTextUIPart,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { getChatModel } from "@/features/ai/utils/model";
import {
  checkMessageLimits,
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGE_CHARS,
  MAX_OUTPUT_TOKENS,
} from "@/features/ai/utils/usage-limits";

/**
 * POST /api/chat — Streams an AI assistant reply for a conversation.
 *
 * Validates auth and ownership, persists the user message, then streams the
 * assistant response via the AI SDK. Final messages are saved when the stream ends.
 */

export async function POST(req: Request) {
  await auth.protect();

  const { message, id }: { message: UIMessage; id: string } = await req.json();

  if (!message || !id) {
    return new Response("Missing message or conversation id", { status: 400 });
  }

  // require user
  const user = await requireUser();

  // retreive the conversation from db
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: user.id },
  });

  if (!conversation) {
    return new Response("Conversation not found", { status: 404 });
  }

  //get all previous messages from DB
  const previousMessages = await loadChatMessages(id);

  //check  if message already exists in DB if yes then skip else save
  const alreadySaved = previousMessages.some(
    (storedMessage) => storedMessage.id === message.id,
  );

  // only allow re-sending the latest unanswered message, so a saved prompt
  // can't be replayed to get free replies outside the usage limit
  if (alreadySaved && previousMessages.at(-1)?.id !== message.id) {
    return new Response("This message has already been answered.", {
      status: 409,
    });
  }

  if (!alreadySaved) {
    if (message.role !== "user") {
      return new Response("Only user messages can be sent.", { status: 400 });
    }

    const text = message.parts
      .filter(isTextUIPart)
      .map((part) => part.text)
      .join("");

    if (text.length > MAX_MESSAGE_CHARS) {
      return new Response(
        `Message is too long. Please keep it under ${MAX_MESSAGE_CHARS} characters.`,
        { status: 413 },
      );
    }

    const limitError = await checkMessageLimits(user.id);
    if (limitError) {
      return new Response(limitError, { status: 429 });
    }
  }

  //if message is not saved in DB then save it otherswie use previous messages
  const messages = alreadySaved
    ? previousMessages
    : [...previousMessages, message];

  if (!alreadySaved) {
    await saveChatMessages(id, [message]);
  }

  const result = streamText({
    model: getChatModel(conversation.model),
    system:
      conversation.systemPrompt ?? "You are ChaiGpt , a helpful assistant",
    // cap context and reply size to keep per-request cost bounded
    messages: await convertToModelMessages(
      messages.slice(-MAX_HISTORY_MESSAGES),
    ),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  });

  result.consumeStream();

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
      onEnd: async ({ messages: finalMessages }) => {
        try {
          await saveChatMessages(id, finalMessages, { updateTitle: false });
        } catch (error) {
          console.error(error);
        }
      },
    }),
  });
}
