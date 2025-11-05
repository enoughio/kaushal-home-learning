import { PrismaClient } from "@/generated/prisma";

declare global {
  // Prevent multiple instances in development
  // To ensures hot reloads don't create multiple clients
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ["query", "info", "warn", "error"], // optional logging
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
