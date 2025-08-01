#!/bin/bash

# Smart Cooking AI - Repository Validation Test Script

echo "🧪 Smart Cooking AI - Repository Test Validation"
echo "=================================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $test_name ... "
    
    result=$(eval $test_command 2>&1)
    
    if [[ $result == *"$expected_result"* ]]; then
        echo -e "${GREEN}✅ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "   Expected: $expected_result"
        echo "   Got: $result"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo "🔍 Step 1: Validating Entity Field Names"
echo "----------------------------------------"

# Test 1: Check User entity has regionPreference field
echo -n "User.regionPreference field exists ... "
if grep -q "regionPreference" "c:/SmartCookingAI_2/backend/src/main/java/com/smartcooking/ai/entity/User.java"; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 2: Check User entity has createdRecipes field
echo -n "User.createdRecipes field exists ... "
if grep -q "createdRecipes" "c:/SmartCookingAI_2/backend/src/main/java/com/smartcooking/ai/entity/User.java"; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 3: Check Recipe entity has author field
echo -n "Recipe.author field exists ... "
if grep -q "private User author" "c:/SmartCookingAI_2/backend/src/main/java/com/smartcooking/ai/entity/Recipe.java"; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo
echo "🔍 Step 2: Validating Repository Queries"
echo "----------------------------------------"

# Test 4: Check findTopRecipeCreators uses correct field
echo -n "findTopRecipeCreators query fixed ... "
if grep -q "u.createdRecipes" "c:/SmartCookingAI_2/backend/src/main/java/com/smartcooking/ai/repository/UserRepository.java"; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 5: Check findActiveUsersByRegion uses correct field
echo -n "findActiveUsersByRegion query fixed ... "
if grep -q "u.regionPreference" "c:/SmartCookingAI_2/backend/src/main/java/com/smartcooking/ai/repository/UserRepository.java"; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 6: Check no deprecated dialect
echo -n "MySQL dialect updated ... "
if grep -q "MySQLDialect" "c:/SmartCookingAI_2/backend/src/main/resources/application.properties" && 
   ! grep -q "MySQL8Dialect" "c:/SmartCookingAI_2/backend/src/main/resources/application.properties"; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 7: Check repository configuration exists
echo -n "Repository configuration created ... "
if [ -f "c:/SmartCookingAI_2/backend/src/main/java/com/smartcooking/ai/config/RepositoryConfiguration.java" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo
echo "🔍 Step 3: Checking for Common Issues"
echo "------------------------------------"

# Test 8: No old field references
echo -n "No 'u.recipes' references ... "
if ! grep -r "u\.recipes" "c:/SmartCookingAI_2/backend/src/" 2>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Found: $(grep -r "u\.recipes" "c:/SmartCookingAI_2/backend/src/" 2>/dev/null)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 9: No old region references
echo -n "No 'u.region' references ... "
if ! grep -r "u\.region[^P]" "c:/SmartCookingAI_2/backend/src/" 2>/dev/null; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "   Found: $(grep -r "u\.region[^P]" "c:/SmartCookingAI_2/backend/src/" 2>/dev/null)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo
echo "📊 Test Results Summary"
echo "======================"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo
    echo -e "${GREEN}🎉 All tests passed! Backend should start successfully.${NC}"
    echo
    echo "🚀 Next steps:"
    echo "   1. cd c:/SmartCookingAI_2/backend"
    echo "   2. ./mvnw spring-boot:run"
    echo "   3. Check: http://localhost:8080/actuator/health"
    echo
else
    echo
    echo -e "${RED}❌ Some tests failed. Please fix the issues above.${NC}"
    echo
fi

echo "📋 Quick Reference:"
echo "   Health Check: curl http://localhost:8080/actuator/health"
echo "   API Base URL: http://localhost:8080/api"
echo "   Frontend URL: http://localhost:3000"
