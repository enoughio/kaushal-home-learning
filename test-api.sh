#!/bin/bash

# API Testing Script for User Management

API_BASE_URL="http://localhost:3000"
AUTH_TOKEN="your-jwt-token-here"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== User Management API Tests ===${NC}\n"

# Test 1: Get list of users
echo -e "${YELLOW}Test 1: Get Users List${NC}"
curl -s -X GET "$API_BASE_URL/api/admin/users?page=1&limit=20" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"

echo -e "\n${YELLOW}Test 2: Get Single User${NC}"
# Replace 1 with actual user ID
curl -s -X GET "$API_BASE_URL/api/admin/users/1" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"

echo -e "\n${YELLOW}Test 3: Toggle User Status (PUT)${NC}"
# Replace 1 with actual user ID
curl -s -X PUT "$API_BASE_URL/api/admin/users/1" \
  -H "Content-Type: application/json" \
  -b "auth-token=$AUTH_TOKEN" \
  -d '{"status":"inactive"}' | jq '.' || echo "Failed"

echo -e "\n${YELLOW}Test 4: Delete User (DELETE)${NC}"
# Replace 2 with actual user ID to delete
curl -s -X DELETE "$API_BASE_URL/api/admin/users/2" \
  -H "Content-Type: application/json" \
  -b "auth-token=$AUTH_TOKEN" | jq '.' || echo "Failed"

echo -e "\n${YELLOW}Test 5: Error - Invalid User ID${NC}"
curl -s -X GET "$API_BASE_URL/api/admin/users/invalid" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"

echo -e "\n${YELLOW}Test 6: Error - User Not Found${NC}"
curl -s -X GET "$API_BASE_URL/api/admin/users/99999" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"

echo -e "\n${YELLOW}Test 7: Error - Delete Without Auth${NC}"
curl -s -X DELETE "$API_BASE_URL/api/admin/users/1" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed"

echo -e "\n${GREEN}Tests completed!${NC}"
