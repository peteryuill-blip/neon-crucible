import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
});

async function run() {
  console.log("Attempting to write to neonwebsite/works/crucible/test.txt...");
  try {
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME, // "neonwebsite"
      Key: "works/crucible/test.txt",     // The "sub-folder" path
      Body: "Folder test successful!"
    }));
    console.log("✅ SUCCESS: Your token works, but ONLY for this specific folder!");
    console.log("If this succeeded, your image script needs to be updated to use this exact folder path.");
  } catch (err) {
    console.error("❌ FAILED:", err.name, "-", err.message);
    if (err.$metadata?.httpStatusCode === 403) {
      console.error("\n--- CONCLUSION ---");
      console.error("Even with the folder path, Cloudflare says NO.");
      console.error("This is 100% a Token Permission issue in your Cloudflare Dashboard.");
    }
  }
}
run();
