const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database query successful:', result);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n🔍 Troubleshooting P1001 Error:');
      console.log('1. Check if Supabase project is active');
      console.log('2. Verify connection string is correct');
      console.log('3. Check if your IP is whitelisted in Supabase');
      console.log('4. Ensure database is not paused');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
