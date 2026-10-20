import { prisma } from "@/lib/db";

function readLimit(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/** Max prompts one user can send in a rolling 24 hours. */
export const USER_DAILY_MESSAGE_LIMIT = readLimit("CHAT_USER_DAILY_LIMIT", 5);

/** Max prompts all users combined can send in a rolling 24 hours (protects against many sign-ups). */
export const GLOBAL_DAILY_MESSAGE_LIMIT = readLimit("CHAT_GLOBAL_DAILY_LIMIT", 200);

/** Max length (characters) of a single prompt. */
export const MAX_MESSAGE_CHARS = readLimit("CHAT_MAX_MESSAGE_CHARS", 4000);

/** Max tokens the model may generate per reply. */
export const MAX_OUTPUT_TOKENS = readLimit("CHAT_MAX_OUTPUT_TOKENS", 1000);

/** How many recent messages are sent to the model as context. */
export const MAX_HISTORY_MESSAGES = readLimit("CHAT_MAX_HISTORY_MESSAGES", 20);

/**
 * Checks the per-user and global 24h prompt limits.
 * Each USER message row in the database counts as one prompt.
 *
 * @returns An error message when a limit is reached, otherwise null.
 */
export async function checkMessageLimits(userId: string) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [userCount, globalCount] = await Promise.all([
    prisma.message.count({
      where: {
        role: "USER",
        createdAt: { gte: since },
        conversation: { userId },
      },
    }),
    prisma.message.count({
      where: { role: "USER", createdAt: { gte: since } },
    }),
  ]);

  if (userCount >= USER_DAILY_MESSAGE_LIMIT) {
    return `You've reached your limit of ${USER_DAILY_MESSAGE_LIMIT} messages per 24 hours. Please try again later.`;
  }

  if (globalCount >= GLOBAL_DAILY_MESSAGE_LIMIT) {
    return "The app has reached its daily usage limit. Please try again tomorrow.";
  }

  return null;
}
