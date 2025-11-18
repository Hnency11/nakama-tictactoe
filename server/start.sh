#!/bin/sh
set -e

# Substitute environment variables into template (resolved nakama.yml)
envsubst < /data/nakama.yml.template > /data/nakama.yml
echo '--- BEGIN nakama.yml (resolved) ---'
sed -n '1,200p' /data/nakama.yml
echo '--- END nakama.yml ---'

# Start Nakama in background (absolute path)
# Redirect stdout/stderr to /tmp/nakama.log (optional)
echo "Starting nakama..."
/nakama/nakama --config /data/nakama.yml >> /tmp/nakama.log 2>&1 &

# Wait briefly for Nakama to start listening (simple sleep; adjust if needed)
sleep 3

# Start nginx in foreground using our custom config
echo "Starting nginx..."
nginx -c /etc/nginx/nginx.conf -g 'daemon off;'
