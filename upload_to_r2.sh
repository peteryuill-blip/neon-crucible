#!/bin/bash

# ===================== CONFIG =====================
FOLDER="/storage/emulated/0/NEON/T_1000_optimized"
BUCKET="neonwebsite"
PREFIX="Crucible/"
ACCOUNT_ID="ee59ee5cb7da30e22c2451223113cff8"
ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"

# Your R2 credentials (set these!)
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_HERE"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY_HERE"
# =================================================

echo "=== Cloudflare R2 Upload Script ==="
echo "Source folder : $FOLDER"
echo "Target        : \( {BUCKET}/ \){PREFIX}"
echo "Endpoint      : $ENDPOINT"
echo "==================================="

# Check if credentials are set
if [[ "$AWS_ACCESS_KEY_ID" == "YOUR_ACCESS_KEY_HERE" ]]; then
    echo "❌ Please edit the script and put your R2 Access Key ID and Secret Access Key!"
    exit 1
fi

cd "$FOLDER" || { echo "❌ Cannot access folder!"; exit 1; }

# Find all image files
shopt -s nullglob
files=(*.jpg *.jpeg *.png *.gif *.webp *.JPG *.JPEG *.PNG *.GIF *.WEBP)

if [ ${#files[@]} -eq 0 ]; then
    echo "❌ No image files found in the folder!"
    exit 1
fi

echo "Found ${#files[@]} image files. Starting upload..."

count=0
for file in "${files[@]}"; do
    ((count++))
    echo "[\( count/ \){#files[@]}] Uploading: $file"
    
    aws s3 cp "\( file" "s3:// \){BUCKET}/\( {PREFIX} \){file}" \
        --endpoint-url "$ENDPOINT" \
        --acl public-read \
        --no-progress || echo "⚠️ Failed: $file"
done

echo "==================================="
echo "✅ Upload finished! $count files processed."
echo "Files are available at: https://\( {BUCKET}.r2.cloudflarestorage.com/ \){PREFIX}"
