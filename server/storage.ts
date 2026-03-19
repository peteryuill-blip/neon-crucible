/**
 * storage.ts — Cloudflare R2 storage helpers
 *
 * Replaces the Manus Forge API storage proxy with direct Cloudflare R2 access
 * using the AWS S3-compatible API. The public interface (storagePut / storageGet)
 * is identical to the previous implementation so no call-site changes are needed.
 *
 * Required environment variables:
 *   R2_ACCOUNT_ID       — Cloudflare account ID
 *   R2_ACCESS_KEY_ID    — R2 API token key ID
 *   R2_SECRET_ACCESS_KEY — R2 API token secret
 *   R2_BUCKET_NAME      — R2 bucket name (e.g. "neon-crucible-assets")
 *   R2_PUBLIC_URL       — Public base URL for the bucket
 *                         (e.g. "https://pub-xxx.r2.dev" or custom domain)
 *
 * Cloudflare R2 setup:
 *   1. Create a bucket in the Cloudflare dashboard
 *   2. Enable "Public access" on the bucket (or use a custom domain)
 *   3. Create an R2 API token with "Object Read & Write" permissions
 *   4. Set the five env vars above
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

// ─── S3 client (lazily initialised) ─────────────────────────────────────────

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;

  const { r2AccountId, r2AccessKeyId, r2SecretAccessKey } = ENV;

  if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
    throw new Error(
      "R2 credentials missing: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
    );
  }

  _client = new S3Client({
    region: "auto",
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  return _client;
}

function getBucketName(): string {
  const name = ENV.r2BucketName;
  if (!name) throw new Error("R2_BUCKET_NAME environment variable is not set");
  return name;
}

function getPublicUrl(): string {
  const url = ENV.r2PublicUrl;
  if (!url) throw new Error("R2_PUBLIC_URL environment variable is not set");
  return url.replace(/\/+$/, "");
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Upload bytes to R2 and return the public URL.
 * The R2 bucket must have public access enabled for the URL to be directly accessible.
 *
 * @param relKey      Object key (path within the bucket), e.g. "works/abc123.jpg"
 * @param data        File content as Buffer, Uint8Array, or string
 * @param contentType MIME type, defaults to "application/octet-stream"
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getClient();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  const body: Buffer =
    typeof data === "string"
      ? Buffer.from(data, "utf-8")
      : Buffer.from(data as Uint8Array);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  const url = `${getPublicUrl()}/${key}`;
  return { key, url };
}

/**
 * Generate a presigned GET URL for a private object, or return the public URL
 * if the bucket is publicly accessible.
 *
 * @param relKey      Object key (path within the bucket)
 * @param expiresIn   Presigned URL expiry in seconds (default 3600 = 1 hour)
 */
export async function storageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const client = getClient();
  const bucket = getBucketName();
  const key = normalizeKey(relKey);

  // If a public URL is configured, return it directly (no signing needed)
  if (ENV.r2PublicUrl) {
    return { key, url: `${getPublicUrl()}/${key}` };
  }

  // Fallback: generate a presigned URL for private buckets
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(client, command, { expiresIn });
  return { key, url };
}
