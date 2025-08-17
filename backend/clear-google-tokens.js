const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearGoogleTokens() {
  try {
    console.log('Clearing all Google tokens...');
    
    const result = await prisma.googleToken.deleteMany({});
    
    console.log(`Cleared ${result.count} Google tokens successfully.`);
    console.log('Users will need to re-authenticate with Google to get tokens with correct scopes.');
    
  } catch (error) {
    console.error('Error clearing Google tokens:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearGoogleTokens();