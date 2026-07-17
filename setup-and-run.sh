#!/bin/bash
# KamPare — Quick Setup Script (macOS / Linux)
# Run: bash setup-and-run.sh

set -e

echo ""
echo "====================================================="
echo "  KamPare — Compare Smart. Save More."
echo "====================================================="
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "[ERROR] Node.js not found. Install from https://nodejs.org"
  exit 1
fi

echo "[1/4] Installing backend dependencies..."
cd backend
npm install

echo ""
echo "[2/4] Copying .env file..."
[ ! -f .env ] && cp .env.example .env

echo ""
echo "[3/4] Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "[4/4] Starting servers..."
echo ""
echo " Backend:  http://localhost:5000"
echo " Frontend: http://localhost:3000"
echo ""

# Start backend in background
cd ../backend && npm run dev &
BACKEND_PID=$!

# Give it a moment
sleep 3

# Start frontend (opens browser automatically via CRA)
cd ../frontend && npm start

# Cleanup on Ctrl+C
trap "kill $BACKEND_PID 2>/dev/null" EXIT
