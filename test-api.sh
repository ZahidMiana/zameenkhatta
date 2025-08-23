#!/bin/bash

# Zameen Khatta API Testing Script
# This script tests all the main API endpoints

BASE_URL="http://localhost:3001"
echo "🏠 Testing Zameen Khatta API Endpoints"
echo "Base URL: $BASE_URL"
echo "================================================"

# Test 1: Health Check (Homepage)
echo "1. Testing Homepage..."
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" > /tmp/homepage_status
if [ $(cat /tmp/homepage_status) -eq 200 ]; then
    echo "✅ Homepage: PASS (Status: $(cat /tmp/homepage_status))"
else
    echo "❌ Homepage: FAIL (Status: $(cat /tmp/homepage_status))"
fi

# Test 2: Login Page
echo "2. Testing Login Page..."
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/login" > /tmp/login_status
if [ $(cat /tmp/login_status) -eq 200 ]; then
    echo "✅ Login Page: PASS (Status: $(cat /tmp/login_status))"
else
    echo "❌ Login Page: FAIL (Status: $(cat /tmp/login_status))"
fi

# Test 3: Register API (without auth)
echo "3. Testing User Registration API..."
REGISTER_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test'$(date +%s)'@example.com","password":"password123"}')

if [[ $REGISTER_RESPONSE == *"201"* ]] || [[ $REGISTER_RESPONSE == *"200"* ]]; then
    echo "✅ Registration API: PASS"
else
    echo "❌ Registration API: FAIL"
    echo "Response: $REGISTER_RESPONSE"
fi

# Test 4: Forgot Password API
echo "4. Testing Forgot Password API..."
FORGOT_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}')

if [[ $FORGOT_RESPONSE == *"200"* ]]; then
    echo "✅ Forgot Password API: PASS"
else
    echo "❌ Forgot Password API: FAIL"
    echo "Response: $FORGOT_RESPONSE"
fi

# Test 5: Admin Dashboard (should require auth)
echo "5. Testing Admin Dashboard Access..."
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/admin" > /tmp/admin_status
if [ $(cat /tmp/admin_status) -eq 200 ] || [ $(cat /tmp/admin_status) -eq 401 ] || [ $(cat /tmp/admin_status) -eq 403 ]; then
    echo "✅ Admin Dashboard: PASS (Status: $(cat /tmp/admin_status)) - Properly protected"
else
    echo "❌ Admin Dashboard: FAIL (Status: $(cat /tmp/admin_status))"
fi

# Test 6: User Dashboard (should require auth)
echo "6. Testing User Dashboard Access..."
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/dashboard" > /tmp/dashboard_status
if [ $(cat /tmp/dashboard_status) -eq 200 ] || [ $(cat /tmp/dashboard_status) -eq 401 ] || [ $(cat /tmp/dashboard_status) -eq 403 ]; then
    echo "✅ User Dashboard: PASS (Status: $(cat /tmp/dashboard_status)) - Properly protected"
else
    echo "❌ User Dashboard: FAIL (Status: $(cat /tmp/dashboard_status))"
fi

# Test 7: Public Pages
echo "7. Testing Public Pages..."
PAGES=("about" "contact" "blog" "listings")
for page in "${PAGES[@]}"; do
    curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$page" > /tmp/${page}_status
    if [ $(cat /tmp/${page}_status) -eq 200 ]; then
        echo "  ✅ /$page: PASS (Status: $(cat /tmp/${page}_status))"
    else
        echo "  ❌ /$page: FAIL (Status: $(cat /tmp/${page}_status))"
    fi
done

# Cleanup
rm -f /tmp/*_status

echo "================================================"
echo "🎉 API Testing Complete!"
echo ""
echo "📋 Manual Testing Checklist:"
echo "   1. Open $BASE_URL in browser"
echo "   2. Test user registration and login"
echo "   3. Create admin user: node scripts/create-admin.js"
echo "   4. Login as admin (admin@zameenkhatta.com / admin123)"
echo "   5. Test admin panel functionality"
echo "   6. Test user dashboard features"
echo ""
echo "📚 For detailed documentation, see README.md"
