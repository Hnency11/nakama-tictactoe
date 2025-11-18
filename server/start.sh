#!/bin/sh
set -e

# Run Nakama migrations
/nakama/nakama migrate up --database.address "$DATABASE_URL"

# Start Nakama server
exec /nakama/nakama \
  --database.address "$DATABASE_URL" \
  --console.username "$CONSOLE_USERNAME" \
  --console.password "$CONSOLE_PASSWORD" \
  --console.signing_key "$CONSOLE_SIGNING_KEY" \
  --session.encryption_key "$SESSION_ENCRYPTION_KEY" \
  --session.refresh_encryption_key "$SESSION_REFRESH_ENCRYPTION_KEY"
