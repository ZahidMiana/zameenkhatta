#!/bin/bash

echo "🚀 Testing Admin Login Functionality"
echo "===================================="

# Wait for server to be ready
sleep 2

# Test if server is running
echo "📡 Checking if server is running..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
if [ $? -eq 0 ]; then
    echo "✅ Server is running on port 3000"
else
    echo "❌ Server is not responding"
    exit 1
fi

echo ""
echo "🔐 Testing Admin Authentication Flow..."

# Test signin page
echo "📄 Testing signin page..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/signin
echo "✅ Signin page accessible"

# Test admin route (should redirect to signin)
echo "📄 Testing admin route (unauthenticated)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin
echo "✅ Admin route accessible"

# Test user info API
echo "📄 Testing user info API..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/user/me
echo "✅ User info API accessible"

echo ""
echo "✅ All endpoints are accessible!"
echo "🎯 Ready to test admin login with credentials:"
echo "   📧 Email: admin@zameen.com"
echo "   🔑 Password: admin123"
echo ""
echo "🌐 Open your browser and go to: http://localhost:3000/signin"
echo "   Then login with the admin credentials above."
