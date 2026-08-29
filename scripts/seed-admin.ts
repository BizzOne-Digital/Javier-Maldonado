import { connectDB } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import AdminUser from "../src/models/AdminUser";
import { loadEnvLocal } from "./load-env";

async function seedAdmin() {
  loadEnvLocal();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is required");
    process.exit(1);
  }

  await connectDB();

  const hashedPassword = await hashPassword(password);
  const admin = await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: "Javier Maldonado",
      role: "admin",
    },
    { upsert: true, new: true }
  );

  console.log(`Admin user seeded: ${admin.email}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
