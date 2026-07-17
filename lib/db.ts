import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// Define a helper type on globalThis to prevent multiple Prisma instances in development
const globalForPrisma = globalThis as unknown as {
  // Store the prisma client instance optionally on the global object
  prisma: PrismaClient | undefined;
};

// Define a helper function to instantiate a new Prisma Client
const createPrismaClient = () => {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Initialize PostgreSQL adapter with the database connection URL
  const adapter = new PrismaPg({ connectionString: url });

  // Create a new Prisma Client instance configured with the adapter
  const prisma = new PrismaClient({ adapter });
  // Return the instantiated Prisma Client
  return prisma;
};

// Export a prisma instance: use existing global client if available, otherwise build a new one
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Save the active instance to the global context in development to prevent connection leaks on hot-reload
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
