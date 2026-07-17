"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import type { User } from "@/lib/generated/prisma/client";

// Exports an asynchronous function to handle the user onboarding/sync process.
export async function onBoard() {
  // Retrieves the current authenticated Clerk user session.
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  // Safely extracts the primary email address from the Clerk user data or defaults to null.
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;

  // Performs an upsert operation in the database to either insert or update the user record.
  return prisma.user.upsert({
    // Uses the Clerk user ID as the lookup key to find an existing user.
    where: { clerkId: clerkUser.id },
    // Defines the fields to create if the user does not exist in the database.
    create: {
      clerkId: clerkUser.id,
      email,
      firstname: clerkUser.firstName,
      lastname: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    // Defines the fields to update if the user is already present in the database.
    update: {
      email,
      firstname: clerkUser.firstName,
      lastname: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  });
}
