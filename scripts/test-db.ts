/**
 * Test MongoDB Atlas connection.
 * Run: npx tsx scripts/test-db.ts
 */
import mongoose from "mongoose";
import { loadEnvLocal } from "./load-env";

async function main() {
  loadEnvLocal();
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("YOUR_PASSWORD") || uri.includes("xxxxx")) {
    console.error("\n❌ MONGODB_URI not configured yet.");
    console.error("   Follow ATLAS_SETUP.md to create Atlas cluster and update .env.local\n");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ Connected successfully!");
    console.log("   Database:", mongoose.connection.name);
    console.log("   Host:", mongoose.connection.host);
    await mongoose.disconnect();
    console.log("✅ Connection test passed.\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Connection failed:", (err as Error).message);
    console.error("   Check ATLAS_SETUP.md troubleshooting section.\n");
    process.exit(1);
  }
}

main();
