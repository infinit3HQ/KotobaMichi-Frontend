#!/bin/sh
set -e

PUBLIC_DIR="/app/.output/public"

if [ -d "$PUBLIC_DIR" ]; then
  cat > "$PUBLIC_DIR/env.js" <<EOF
(function () {
  window.__ENV__ = {
    VITE_API_URL: "${VITE_API_URL:-http://localhost:3001/v1/}"
  };
})();
EOF
  echo "Runtime env generated at $PUBLIC_DIR/env.js" >&2
else
  echo "Public dir not found at $PUBLIC_DIR; skipping env.js generation" >&2
fi

exec node /app/.output/server/index.mjs
