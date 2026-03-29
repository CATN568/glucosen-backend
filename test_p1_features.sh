#!/bin/bash

# 🧪 P1 Features - Automated Test Suite
# Tests all P1 feature endpoints

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"
RESULTS_FILE="/tmp/p1_test_results.txt"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

echo "========================================" | tee $RESULTS_FILE
echo "P1 Features - Complete Test Suite" | tee -a $RESULTS_FILE
echo "========================================" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# === SETUP ===
echo -e "${YELLOW}[SETUP] Creating test user...${NC}"

USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "p1test_'$(date +%s)'@test.com",
    "password": "TestP1Features123!",
    "firstName": "P1",
    "lastName": "Tester"
  }')

TOKEN=$(echo $USER_RESPONSE | jq -r '.token' 2>/dev/null || echo "")
USER_ID=$(echo $USER_RESPONSE | jq -r '.user.id' 2>/dev/null || echo "")

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}✗ Failed to create test user${NC}" | tee -a $RESULTS_FILE
  echo "Response: $USER_RESPONSE" | tee -a $RESULTS_FILE
  exit 1
fi

echo -e "${GREEN}✓ Test user created (ID: $USER_ID)${NC}" | tee -a $RESULTS_FILE
echo "  Token: ${TOKEN:0:20}..." | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# === HELPER FUNCTION ===
test_endpoint() {
  local test_num=$1
  local test_name=$2
  local method=$3
  local endpoint=$4
  local data=$5
  local expected_status=$6

  echo -e "${YELLOW}[TEST $test_num] $test_name${NC}"

  if [ -z "$data" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json")
  else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS - HTTP $HTTP_CODE${NC}" | tee -a $RESULTS_FILE
    ((TESTS_PASSED++))
    echo $BODY
    return 0
  else
    echo -e "${RED}✗ FAIL - Expected $expected_status, got $HTTP_CODE${NC}" | tee -a $RESULTS_FILE
    echo "Response: $BODY" | tee -a $RESULTS_FILE
    ((TESTS_FAILED++))
    return 1
  fi
}

# === TEST 1: Glucose Reading ===
echo -e "${YELLOW}=== GLUCOSE TESTS ===${NC}" | tee -a $RESULTS_FILE
test_endpoint "1" "Create Glucose Reading" "POST" "/api/glucose" \
  '{
    "glucoseLevel": 185,
    "readingTime": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "notes": "Test reading"
  }' "201"

GLUCOSE_ID=$(echo $BODY | jq -r '.glucose_reading.id' 2>/dev/null || echo "1")
echo "" | tee -a $RESULTS_FILE

# === TEST 2: Get Glucose Readings ===
test_endpoint "2" "Get Glucose Readings" "GET" "/api/glucose" "" "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 3: Get Glucose Statistics ===
test_endpoint "3" "Get Glucose Statistics" "GET" "/api/glucose/stats" "" "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 4: Create Alert ===
echo -e "${YELLOW}=== ALERTS TESTS ===${NC}" | tee -a $RESULTS_FILE
test_endpoint "4" "Create Alert" "POST" "/api/alerts" \
  '{
    "type": "high_glucose",
    "threshold": 180,
    "condition": "above"
  }' "201"

ALERT_ID=$(echo $BODY | jq -r '.alert.id' 2>/dev/null || echo "1")
echo "" | tee -a $RESULTS_FILE

# === TEST 5: Get Alerts ===
test_endpoint "5" "Get All Alerts" "GET" "/api/alerts" "" "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 6: Get Single Alert ===
test_endpoint "6" "Get Single Alert" "GET" "/api/alerts/$ALERT_ID" "" "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 7: Update Alert ===
test_endpoint "7" "Update Alert" "PUT" "/api/alerts/$ALERT_ID" \
  '{
    "threshold": 175
  }' "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 8: Test Alert Notification ===
test_endpoint "8" "Test Alert Notification" "POST" "/api/alerts/$ALERT_ID/test" "" "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 9: Create Meal ===
echo -e "${YELLOW}=== MEALS TESTS ===${NC}" | tee -a $RESULTS_FILE
test_endpoint "9" "Create Meal" "POST" "/api/meals" \
  '{
    "mealType": "breakfast",
    "mealTime": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "description": "Test meal",
    "carbs": 45,
    "protein": 20,
    "fat": 10,
    "calories": 400
  }' "201"
echo "" | tee -a $RESULTS_FILE

# === TEST 10: Get Meals ===
test_endpoint "10" "Get Meals" "GET" "/api/meals" "" "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 11: Create Exercise ===
echo -e "${YELLOW}=== EXERCISE TESTS ===${NC}" | tee -a $RESULTS_FILE
test_endpoint "11" "Create Exercise" "POST" "/api/exercise" \
  '{
    "activityType": "running",
    "durationMinutes": 30,
    "intensity": "moderate",
    "exerciseTime": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "caloriesBurned": 300
  }' "201"
echo "" | tee -a $RESULTS_FILE

# === TEST 12: Get Exercises ===
test_endpoint "12" "Get Exercises" "GET" "/api/exercise" "" "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 13-15: REPORTS ===
echo -e "${YELLOW}=== REPORTS TESTS ===${NC}" | tee -a $RESULTS_FILE

test_endpoint "13" "Get Summary Report" "GET" "/api/reports/summary?days=1" "" "200"
echo "" | tee -a $RESULTS_FILE

test_endpoint "14" "Get HbA1c Analysis" "GET" "/api/reports/hba1c?days=30" "" "200"
echo "" | tee -a $RESULTS_FILE

test_endpoint "15" "Get Advanced Stats" "GET" "/api/reports/advanced-stats?days=7" "" "200"
echo "" | tee -a $RESULTS_FILE

# === TEST 16: Delete Alert ===
echo -e "${YELLOW}=== CLEANUP TESTS ===${NC}" | tee -a $RESULTS_FILE
test_endpoint "16" "Delete Alert" "DELETE" "/api/alerts/$ALERT_ID" "" "200"
echo "" | tee -a $RESULTS_FILE

# === RESULTS ===
echo "========================================" | tee -a $RESULTS_FILE
echo "TEST RESULTS" | tee -a $RESULTS_FILE
echo "========================================" | tee -a $RESULTS_FILE
echo "Tests Passed: ${GREEN}$TESTS_PASSED${NC}" | tee -a $RESULTS_FILE
echo "Tests Failed: ${RED}$TESTS_FAILED${NC}" | tee -a $RESULTS_FILE
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}" | tee -a $RESULTS_FILE
  exit 0
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}" | tee -a $RESULTS_FILE
  exit 1
fi
