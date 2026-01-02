#!/bin/sh
set -e

node <<'NODE'
const fs = require("fs");

const env = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  NEXT_PUBLIC_APPS_MODE: process.env.NEXT_PUBLIC_APPS_MODE || process.env.APPS_MODE || ""
};

fs.writeFileSync(
  "/app/apps/web/public/runtime-config.js",
  `window.__ENV = ${JSON.stringify(env)};`
);
NODE

cd /app/apps/web
exec node node_modules/next/dist/bin/next start -p 3000
