// test-prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to connect to the database...');
    // Perform a simple query to retrieve the first user (or any other model)
    // If you don't have a User model, replace it with one you have, or a raw query.
    // Example: const result = await prisma.$queryRaw`SELECT 1`;
    const firstUser = await prisma.user.findFirst();

    if (firstUser) {
      console.log('Connection successful! Found user:', firstUser);
    } else {
      // This case is also a success if the table is empty but the query ran.
      console.log('Connection successful! No users found, but the query executed.');
    }
    console.log('Successfully connected to the database and performed a query.');
  } catch (error) {
    console.error('Failed to connect to the database or execute query:', error);
  } finally {
    // It's crucial to disconnect the Prisma Client after the script is done.
    await prisma.$disconnect();
    console.log('Prisma Client disconnected.');
  }
}

main();