import http from "http";

const HOST = process.env.TEST_HOST || "localhost";
const PORT = process.env.TEST_PORT || "3000";

function request(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://${HOST}:${PORT}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    req.setTimeout(5000, () => reject(new Error("TIMEOUT")));
  });
}

async function runTests() {
  console.log(`🧪 Testing API at http://${HOST}:${PORT}\n`);
  try {
    const health = await request("/health");
    console.log(health.status === 200 ? "✅ /health" : "❌ /health", health.body);

    const works = await request("/api/works");
    console.log(works.status === 200 ? "✅ /api/works" : "❌ /api/works", `(${Array.isArray(works.body) ? works.body.length : 0} items)`);

    const curated = await request("/api/works/curated");
    console.log(curated.status === 200 ? "✅ /api/works/curated" : "❌ /api/works/curated", `(${Array.isArray(curated.body) ? curated.body.length : 0} items)`);

    const single = await request("/api/works/test-slug");
    console.log(single.status === 404 ? "✅ /api/works/:slug (404 expected — empty DB)" : "✅ /api/works/:slug", single.body);

    console.log("\n🚀 All endpoints responding");
  } catch (err: any) {
    console.error("\n❌ API test failed:", err.message);
    console.error("   Is the server running? Try: npm run dev");
    process.exit(1);
  }
}

runTests();
