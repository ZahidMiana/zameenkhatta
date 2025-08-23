#!/bin/bash

echo "🔐 Testing Admin Login and Redirect"
echo "==================================="

# Wait for server to be ready
sleep 2

# Test signin page loads
echo "📄 Testing signin page..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/signin)
if [ "$response" -eq 200 ]; then
    echo "✅ Signin page loads successfully"
else
    echo "❌ Signin page failed to load (HTTP: $response)"
    exit 1
fi

# Test admin page (should redirect or load with auth)
echo "📄 Testing admin page access..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin)
if [ "$response" -eq 200 ]; then
    echo "✅ Admin page accessible"
else
    echo "❌ Admin page failed (HTTP: $response)"
fi

echo ""
echo "🎯 Manual Test Instructions:"
echo "============================="
echo "1. Open browser to: http://localhost:3000/signin"
echo "2. Enter admin credentials:"
echo "   📧 Email: admin@zameen.com"
echo "   🔑 Password: admin123"
echo "3. Click 'Sign In'"
echo "4. Watch the console for redirect logs"
echo "5. Should redirect to: http://localhost:3000/admin"
echo ""
echo "🔍 Debug Tips:"
echo "- Open browser dev tools (F12)"
echo "- Check Console tab for redirect logs"
echo "- Look for 'Admin email detected, redirecting to admin panel...'"
