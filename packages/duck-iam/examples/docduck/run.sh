#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/../.." && pwd)"
NEXT_PID=""
HOCUS_PID=""

cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$NEXT_PID" ] && kill "$NEXT_PID" 2>/dev/null && echo "  Stopped Next.js (PID $NEXT_PID)"
  [ -n "$HOCUS_PID" ] && kill "$HOCUS_PID" 2>/dev/null && echo "  Stopped Hocuspocus (PID $HOCUS_PID)"
  echo "Done."
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# ── 0. Check for .env ──────────────────────────────────────────────
if [ ! -f "$ROOT/.env" ]; then
  echo "Creating .env from .env.example..."
  cp "$ROOT/.env.example" "$ROOT/.env"
fi

# ── 1. Build duck-iam ──────────────────────────────────────────────
echo "Building @gentleduck/iam..."
cd "$REPO_ROOT/packages/duck-iam" && bun run build --silent 2>/dev/null

# ── 2. Start PostgreSQL ───────────────────────────────────────────
echo "Starting PostgreSQL via Docker..."
cd "$ROOT" && docker compose up -d

# Wait for Postgres to be ready
echo "Waiting for PostgreSQL..."
until docker compose exec -T postgres pg_isready -U docduck > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is ready."

# ── 3. Seed database ──────────────────────────────────────────────
echo "Seeding database..."
cd "$ROOT" && bun run db:seed

# ── 4. Start Hocuspocus ──────────────────────────────────────────
echo ""
echo "Starting Hocuspocus on ws://localhost:8888 ..."
cd "$ROOT" && bun run dev:hocuspocus &
HOCUS_PID=$!
sleep 1

# ── 5. Start Next.js ─────────────────────────────────────────────
echo "Starting Next.js on http://localhost:3005 ..."
cd "$ROOT" && bun --bun next dev --port 3005 &
NEXT_PID=$!

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Next.js:     http://localhost:3005"
echo "  Hocuspocus:  ws://localhost:8888"
echo "  PostgreSQL:  localhost:5488"
echo ""
echo "  Demo accounts (password: password123):"
echo "    alice@example.com   — owner@acme, viewer@startup"
echo "    bob@example.com     — editor@acme, owner@startup"
echo "    charlie@example.com — viewer@acme"
echo "    diana@example.com   — admin@acme"
echo ""
echo "  Press Ctrl+C to stop everything"
echo "════════════════════════════════════════════════════════════"
echo ""

wait
