!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/../.." && pwd)"
API_PID=""
WEB_PID=""
DB_FILE="$ROOT/packages/shared/data.db"

cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$WEB_PID" ] && kill "$WEB_PID" 2>/dev/null && echo "  Stopped frontend (PID $WEB_PID)"
  [ -n "$API_PID" ] && kill "$API_PID" 2>/dev/null && echo "  Stopped API (PID $API_PID)"
  rm -f "$DB_FILE"
  echo "  Cleaned up database"
  echo "Done."
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# ── 1. Build duck-iam ────────────────────────────────────────────
echo "Building @gentleduck/iam..."
cd "$REPO_ROOT/packages/duck-iam" && bun run build --silent 2>/dev/null

# ── 2. Seed database ────────────────────────────────────────────
echo "Seeding database..."
rm -f "$DB_FILE"
cd "$ROOT/packages/shared" && bun run src/seed.ts

# ── 3. Start API ────────────────────────────────────────────────
echo ""
echo "Starting API on http://localhost:3001 ..."
cd "$ROOT/packages/api" && bun src/main.ts &
API_PID=$!
sleep 2

# ── 4. Start frontend ──────────────────────────────────────────
echo "Starting frontend on http://localhost:3000 ..."
cd "$ROOT/packages/web" && bun --bun next dev --port 3003 &
WEB_PID=$!

echo ""
echo "════════════════════════════════════════════════"
echo "  API:      http://localhost:3001"
echo "  Frontend: http://localhost:3000"
echo ""
echo "  Users: alice (viewer), bob (editor), charlie (admin)"
echo ""
echo "  Press Ctrl+C to stop everything"
echo "════════════════════════════════════════════════"
echo ""

wait
