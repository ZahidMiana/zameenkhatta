#!/bin/bash

echo "🧪 Testing All Features - Comprehensive Test"
echo "==========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_endpoint() {
    local url=$1
    local name=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✅ $name - OK (HTTP: $response)${NC}"
        return 0
    else
        echo -e "${RED}❌ $name - Failed (HTTP: $response)${NC}"
        return 1
    fi
}

test_api_post() {
    local url=$1
    local data=$2
    local name=$3
    local response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
    
    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✅ $name - OK (HTTP: $response)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $name - Response: HTTP $response${NC}"
        return 1
    fi
}

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 3

echo ""
echo "🌐 Testing Page Accessibility:"
echo "--------------------------------"
test_endpoint "http://localhost:3000" "Homepage"
test_endpoint "http://localhost:3000/signin" "Sign In Page"
test_endpoint "http://localhost:3000/register" "Register Page"
test_endpoint "http://localhost:3000/contact" "Contact Page"
test_endpoint "http://localhost:3000/listings" "Listings Page"
test_endpoint "http://localhost:3000/blog" "Blog Page"
test_endpoint "http://localhost:3000/about" "About Page"

echo ""
echo "🏠 Testing Property Details:"
echo "-----------------------------"
# Test property detail pages with sample IDs from the data
test_endpoint "http://localhost:3000/listings/1" "Property Detail #1"
test_endpoint "http://localhost:3000/listings/2" "Property Detail #2"
test_endpoint "http://localhost:3000/listings/3" "Property Detail #3"

echo ""
echo "🔌 Testing API Endpoints:"
echo "--------------------------"
test_endpoint "http://localhost:3000/api/auth/signin" "Auth API"

# Test Contact Form API
echo "📧 Testing Contact Form API..."
contact_data='{"fullName":"Test User","email":"test@example.com","phone":"03001234567","subject":"Test Subject","message":"This is a test message"}'
test_api_post "http://localhost:3000/api/contact" "$contact_data" "Contact Form API"

# Test Newsletter API
echo "📰 Testing Newsletter API..."
newsletter_data='{"email":"newsletter@example.com"}'
test_api_post "http://localhost:3000/api/newsletter" "$newsletter_data" "Newsletter API"

echo ""
echo "🎯 Manual Testing Instructions:"
echo "================================"
echo ""
echo -e "${YELLOW}1. CONTACT FORM TEST:${NC}"
echo "   🌐 Go to: http://localhost:3000/contact"
echo "   📝 Fill out the contact form with:"
echo "      - Name: Your Name"
echo "      - Email: your@email.com"
echo "      - Subject: Test Contact"
echo "      - Message: Testing contact form"
echo "   ✅ Expected: Success message appears"
echo ""
echo -e "${YELLOW}2. NEWSLETTER SUBSCRIPTION TEST:${NC}"
echo "   🌐 Go to: http://localhost:3000 (scroll to bottom)"
echo "   📝 Enter email in newsletter signup"
echo "   ✅ Expected: 'Thank you for subscribing!' message"
echo ""
echo -e "${YELLOW}3. PROPERTY DETAILS TEST:${NC}"
echo "   🌐 Go to: http://localhost:3000/listings"
echo "   🔍 Click 'View Details' on any property"
echo "   ✅ Expected: Detailed property page with:"
echo "      - Image gallery"
echo "      - Property information tabs"
echo "      - Contact agent section"
echo "      - Similar properties"
echo ""
echo -e "${YELLOW}4. ADMIN PANEL TEST:${NC}"
echo "   🌐 Go to: http://localhost:3000/signin"
echo "   🔑 Login with: admin@zameen.com / admin123"
echo "   ✅ Expected: Redirect to admin panel at /admin"
echo ""
echo -e "${GREEN}🎉 All basic tests completed!${NC}"
echo ""
echo "📱 Open your browser and test these features:"
echo "   → Homepage: http://localhost:3000"
echo "   → Contact:  http://localhost:3000/contact"
echo "   → Listings: http://localhost:3000/listings"
echo "   → Admin:    http://localhost:3000/signin (admin@zameen.com/admin123)"
