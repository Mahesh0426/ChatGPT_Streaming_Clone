import "dotenv/config";
import { clerkClient } from "@clerk/nextjs/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const email = process.env.TEST_USER_EMAIL?.trim().toLowerCase();
const password = process.env.TEST_USER_PASSWORD;
const firstName = "Mahesh";
const lastName = "Test";
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const databaseUrl = process.env.DATABASE_URL;
let prisma: PrismaClient | undefined;

async function createTestUser() {
  if (!email || !password) {
    throw new Error(
      "Set TEST_USER_EMAIL and TEST_USER_PASSWORD in your local .env file.",
    );
  }

  if (!databaseUrl) {
    throw new Error("Set DATABASE_URL in your local .env file.");
  }

  if (!email.includes("@")) {
    throw new Error("TEST_USER_EMAIL must be a valid email address.");
  }

  if (password.length < 8) {
    throw new Error("TEST_USER_PASSWORD must be at least 8 characters long.");
  }

  if (
    !clerkSecretKey?.startsWith("sk_test_") ||
    !clerkPublishableKey?.startsWith("pk_test_")
  ) {
    throw new Error(
      "Refusing to seed a test user without Clerk test keys (sk_test_ and pk_test_).",
    );
  }

  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
  await prisma.$connect();
  await prisma.user.findFirst({ select: { id: true } });

  const clerk = await clerkClient();
  const { data: matchingUsers } = await clerk.users.getUserList({
    emailAddress: [email],
    limit: 1,
  });

  const existingUser = matchingUsers[0];
  let clerkUser: (typeof matchingUsers)[number];

  if (existingUser) {
    if (existingUser.publicMetadata.testSeed !== true) {
      throw new Error(
        "This email already belongs to a Clerk user not created by this test script. Choose a dedicated test email.",
      );
    }

    // Keep the Clerk password and name in sync with this script on re-runs.
    clerkUser = await clerk.users.updateUser(existingUser.id, {
      password,
      firstName,
      lastName,
    });
  } else {
    clerkUser = await clerk.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      publicMetadata: { testSeed: true },
    });
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? email;

  await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    create: {
      clerkId: clerkUser.id,
      email: primaryEmail,
      firstname: clerkUser.firstName,
      lastname: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    update: {
      email: primaryEmail,
      firstname: clerkUser.firstName,
      lastname: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  });

  console.log(`Test user is ready: ${primaryEmail}`);
}

createTestUser()
  .catch((error: unknown) => {
    console.error("Failed to create or sync the Clerk test user.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });
