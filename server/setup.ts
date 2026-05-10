import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Export it first:");
  console.error("   export DATABASE_URL=mysql://user:pass@host:port/db");
  process.exit(1);
}

async function setup() {
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log("🔌 Connected to MySQL\n");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS works (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(128) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      t_code VARCHAR(16) NOT NULL,
      sovereign_id VARCHAR(32) NOT NULL,
      phase_id INT NOT NULL,
      medium TEXT,
      dimensions VARCHAR(128),
      rating INT DEFAULT 0 NOT NULL,
      disposition VARCHAR(2) DEFAULT 'UN' NOT NULL,
      technical_observation TEXT,
      week_number INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Table 'works' ready");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      open_id VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255),
      name VARCHAR(255),
      avatar VARCHAR(512),
      role VARCHAR(16) DEFAULT 'viewer' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Table 'users' ready");

  const [tables] = await conn.execute("SHOW TABLES");
  console.log("\n📋 Existing tables:");
  (tables as any[]).forEach((t) => console.log(`   • ${Object.values(t)[0]}`));

  await conn.end();
  console.log("\n🚀 Database is ready for Oracle sync");
}

setup().catch((err) => {
  console.error("\n❌ Setup failed:", err.message);
  process.exit(1);
});
