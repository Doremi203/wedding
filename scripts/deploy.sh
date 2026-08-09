#!/usr/bin/env bash
# Deploy the static export (out/) to the Yandex Object Storage bucket
# provisioned in terraform/. Requires: npm run build already run, aws CLI,
# and storage credentials in the environment (see usage below).
set -euo pipefail

BUCKET="sacred-castle-wedding.ru"
ENDPOINT_URL="https://storage.yandexcloud.net"
OUT_DIR="out"

cd "$(dirname "$0")/.."

if [ ! -d "$OUT_DIR" ]; then
  echo "Error: $OUT_DIR/ not found. Run 'npm run build' first." >&2
  exit 1
fi

if [ -z "${AWS_ACCESS_KEY_ID:-}" ] || [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
  cat >&2 <<'EOF'
Error: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY are not set.

Load them from Terraform outputs, e.g.:
  export AWS_ACCESS_KEY_ID=$(cd terraform && terraform output -raw storage_access_key_id)
  export AWS_SECRET_ACCESS_KEY=$(cd terraform && terraform output -raw storage_secret_access_key)
EOF
  exit 1
fi

# Yandex Object Storage's S3 API doesn't care about region, but aws CLI
# refuses to run without one configured.
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-ru-central1}"

echo "Deploying $OUT_DIR/ to s3://$BUCKET ..."

# 1) Hashed Next.js build assets (_next/static/**) are content-addressed —
#    filenames change whenever content does, so they're safe to cache for a
#    long time. Not deleted here: old chunks are harmless to leave behind
#    and removing them could break pages still cached from a previous deploy.
aws s3 sync "$OUT_DIR/_next/static/" "s3://$BUCKET/_next/static/" \
  --endpoint-url "$ENDPOINT_URL" \
  --cache-control "public, max-age=31536000, immutable"

# 2) Everything else (index.html, robots.txt, public/ images) keeps its
#    filename across deploys, so it must always revalidate.
aws s3 sync "$OUT_DIR/" "s3://$BUCKET" \
  --endpoint-url "$ENDPOINT_URL" \
  --delete \
  --exclude "_next/static/*" \
  --cache-control "public, max-age=0, must-revalidate"

echo "Done. Site: https://$BUCKET/"
