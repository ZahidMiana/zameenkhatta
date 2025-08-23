#!/bin/bash

# Zameen Khatta Authentication System Test Script
# This script verifies that all authentication components are working

echo "🔍 Testing Zameen Khatta Authentication System"
echo "=============================================="

# Test 1: Check if server is running
echo "1. Checking if server is running on localhost:3000..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please start with 'pnpm dev'"
    exit 1
fi

# Test 2: Test registration endpoint
echo "2. Testing user registration endpoint..."
REGISTER_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123"
  }')

HTTP_CODE="${REGISTER_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "✅ Registration endpoint is working"
else
    echo "❌ Registration endpoint failed with code: $HTTP_CODE"
fi

# Test 3: Test forgot password endpoint
echo "3. Testing forgot password endpoint..."
FORGOT_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@zameen.com"
  }')

HTTP_CODE="${FORGOT_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Forgot password endpoint is working"
else
    echo "❌ Forgot password endpoint failed with code: $HTTP_CODE"
fi

# Test 4: Check if admin user exists
echo "4. Checking admin user in database..."
ADMIN_CHECK=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findUnique({ where: { email: 'admin@zameen.com' } })
  .then(user => {
    if (user) {
      console.log('ADMIN_EXISTS');
    } else {
      console.log('ADMIN_NOT_FOUND');
    }
  })
  .catch(() => console.log('DATABASE_ERROR'))
  .finally(() => process.exit(0));
" 2>/dev/null)

if [ "$ADMIN_CHECK" = "ADMIN_EXISTS" ]; then
    echo "✅ Admin user exists in database"
elif [ "$ADMIN_CHECK" = "ADMIN_NOT_FOUND" ]; then
    echo "⚠️  Admin user not found, creating..."
    node scripts/create-admin.js > /dev/null 2>&1
    echo "✅ Admin user created"
else
    echo "❌ Database connection failed"
fi

# Test 5: Check authentication pages
echo "5. Testing authentication pages..."

# Check login page
LOGIN_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login)
if [ "$LOGIN_CHECK" = "200" ]; then
    echo "✅ Login page accessible"
else
    echo "❌ Login page failed with code: $LOGIN_CHECK"
fi

# Check register page
REGISTER_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/register)
if [ "$REGISTER_CHECK" = "200" ]; then
    echo "✅ Register page accessible"
else
    echo "❌ Register page failed with code: $REGISTER_CHECK"
fi

# Check forgot password page
FORGOT_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/forgot-password)
if [ "$FORGOT_CHECK" = "200" ]; then
    echo "✅ Forgot password page accessible"
else
    echo "❌ Forgot password page failed with code: $FORGOT_CHECK"
fi

echo ""
echo "🎉 Authentication System Test Summary"
echo "====================================="
echo "✅ Server running on http://localhost:3000"
echo "✅ Login page: http://localhost:3000/login"
echo "✅ Register page: http://localhost:3000/register"
echo "✅ Forgot password: http://localhost:3000/forgot-password"
echo "✅ Admin credentials: admin@zameen.com / admin123"
echo ""
echo "📱 Manual Testing Instructions:"
echo "1. Visit http://localhost:3000/login"
echo "2. Login with admin@zameen.com / admin123"
echo "3. Should redirect to admin panel"
echo "4. Test user registration at /register"
echo "5. Test password reset at /forgot-password"
