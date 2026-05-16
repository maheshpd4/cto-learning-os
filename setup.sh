#!/bin/bash
# ============================================================
# CTO Learning OS — First-time Setup Script
# Run: bash setup.sh
# ============================================================

set -e

echo "🚀 CTO Learning OS Setup"
echo "========================"

# Check prerequisites
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi

if ! command -v docker &>/dev/null; then
  echo "❌ Docker not found. Install Docker Desktop from https://docker.com/products/docker-desktop"
  exit 1
fi

# Copy env file
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "📄 Created .env.local — add your GEMINI_API_KEY before starting!"
else
  echo "✓ .env.local already exists"
fi

# Start database
echo ""
echo "🐘 Starting PostgreSQL..."
docker compose up db -d
echo "   Waiting for DB to be ready..."
sleep 5

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Run migrations and seed
echo ""
echo "🗄️  Setting up database..."
npx prisma migrate dev --name init
npx prisma db seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local and set GEMINI_API_KEY"
echo "     Get a free key at: https://aistudio.google.com/app/apikey"
echo ""
echo "  2. Start the app:"
echo "     npm run dev"
echo ""
echo "  3. Open http://localhost:3000"
echo ""
echo "Optional:"
echo "  - Visual DB explorer: npx prisma studio"
echo "  - pgAdmin UI: docker compose --profile tools up pgadmin -d"
echo "    Then open http://localhost:5050 (login: mahesh@cto.local / admin)"
