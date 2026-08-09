#!/usr/bin/env bash
# Deploy the static export (out/) to the Yandex Object Storage bucket
# provisioned in terraform/. Requires: npm run build already run, aws CLI.
set -euo pipefail

BUCKET="sacred-castle-wedding.ru"
ENDPOINT_URL="https://storage.yandexcloud.net"
OUT_DIR="out"
PROFILE="${AWS_PROFILE:-wedding-s3}"

cd "$(dirname "$0")/.."

if [ ! -d "$OUT_DIR" ]; then
  echo "Error: $OUT_DIR/ not found. Run 'npm run build' first." >&2
  exit 1
fi

# Prefer credentials already exported in the environment. Otherwise fall
# back to the "wedding-s3" AWS CLI profile (a static key for the
# wedding-storage-admin service account, set up once — see README.md).
# Not sourced from `terraform output`: the state backend itself needs S3
# credentials to read, which would make that a circular bootstrap.
AWS_ARGS=(--endpoint-url "$ENDPOINT_URL")
if [ -n "${AWS_ACCESS_KEY_ID:-}" ] && [ -n "${AWS_SECRET_ACCESS_KEY:-}" ]; then
  : # use env credentials as-is
elif aws configure get aws_access_key_id --profile "$PROFILE" >/dev/null 2>&1; then
  AWS_ARGS+=(--profile "$PROFILE")
else
  cat >&2 <<EOF
Error: no AWS credentials available (checked AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY
env vars and the "$PROFILE" AWS CLI profile).

One-time setup — see README.md "Деплой" for the full command to create a
static key for wedding-storage-admin and store it in this profile.
EOF
  exit 1
fi

export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-ru-central1}"

echo "Deploying $OUT_DIR/ to s3://$BUCKET ..."

# 1) Hashed Next.js build assets (_next/static/**) are content-addressed —
#    filenames change whenever content does, so they're safe to cache for a
#    long time. Not deleted here: old chunks are harmless to leave behind
#    and removing them could break pages still cached from a previous deploy.
aws s3 sync "$OUT_DIR/_next/static/" "s3://$BUCKET/_next/static/" \
  "${AWS_ARGS[@]}" \
  --cache-control "public, max-age=31536000, immutable"

# 2) Everything else (index.html, robots.txt, public/ images) keeps its
#    filename across deploys, so it must always revalidate.
aws s3 sync "$OUT_DIR/" "s3://$BUCKET" \
  "${AWS_ARGS[@]}" \
  --delete \
  --exclude "_next/static/*" \
  --cache-control "public, max-age=0, must-revalidate"

# 3) Static export emits the simplified-mode page as "invitation.html", but the
#    links handed out to guests are "/invitation?n=Имя". Object Storage serves
#    keys literally (no extension fallback), so publish the same document under
#    the extensionless key too. Must run after the --delete sync above, which
#    would otherwise remove it.
aws s3 cp "$OUT_DIR/invitation.html" "s3://$BUCKET/invitation" \
  "${AWS_ARGS[@]}" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public, max-age=0, must-revalidate"

echo "Done. Site: https://$BUCKET/"
