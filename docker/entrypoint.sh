#!/bin/sh
set -e

# Generate a runtime environment file for the SPA
cat <<EOF > /usr/share/nginx/html/env.js
(function () {
  window.__ENV__ = {
    VITE_API_URL: "${VITE_API_URL:-http://localhost:3001/v1/}",
    VITE_APP_ENV: "${VITE_APP_ENV:-production}"
  };
})();
EOF

echo "Runtime env generated at /usr/share/nginx/html/env.js" >&2

exec nginx -g 'daemon off;'
