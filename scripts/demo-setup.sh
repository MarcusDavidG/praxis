#!/bin/bash

# Praxis Demo Setup Script
# This script populates your backend with demo data

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Praxis Demo Setup ===${NC}\n"

# Check if BACKEND_URL is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Backend URL required${NC}"
  echo "Usage: ./demo-setup.sh https://your-backend-url.railway.app"
  exit 1
fi

BACKEND_URL=$1

echo -e "${BLUE}Backend URL:${NC} $BACKEND_URL\n"

# Test backend health
echo -e "${BLUE}[1/3] Testing backend health...${NC}"
HEALTH=$(curl -s "$BACKEND_URL/health")
echo "$HEALTH"

if echo "$HEALTH" | grep -q '"status":"ok"'; then
  echo -e "${GREEN}✓ Backend is healthy!${NC}\n"
else
  echo -e "${RED}✗ Backend is not responding correctly${NC}"
  exit 1
fi

# Sync markets
echo -e "${BLUE}[2/3] Syncing markets from Polymarket...${NC}"
echo "This may take 30-60 seconds..."

SYNC_RESULT=$(curl -s -X POST "$BACKEND_URL/api/markets/sync?limit=50")
echo "$SYNC_RESULT"

if echo "$SYNC_RESULT" | grep -q 'synced'; then
  echo -e "${GREEN}✓ Markets synced successfully!${NC}\n"
else
  echo -e "${RED}✗ Market sync may have failed${NC}"
  echo -e "Response: $SYNC_RESULT\n"
fi

# Get market count
echo -e "${BLUE}[3/3] Verifying market data...${NC}"
MARKETS=$(curl -s "$BACKEND_URL/api/markets?limit=5")
MARKET_COUNT=$(echo "$MARKETS" | grep -o '"id"' | wc -l)

echo -e "Found ${GREEN}$MARKET_COUNT${NC} markets in database\n"

# Summary
echo -e "${GREEN}=== Demo Setup Complete! ===${NC}\n"
echo "Next steps:"
echo "1. Visit: https://praxismarket.vercel.app"
echo "2. Connect your wallet"
echo "3. Browse markets and explore features"
echo ""
echo "To sync your personal Polymarket data:"
echo "  - You'll need to authenticate first (connect wallet)"
echo "  - Then call: POST $BACKEND_URL/api/positions/sync/{your-wallet}"
echo ""
