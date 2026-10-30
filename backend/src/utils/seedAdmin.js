import bcrypt from "bcryptjs";
import User from "../models/User.js";
export async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@civic.local").toLowerCase();
  const exists = await User.findOne({ email });
  if (!exists) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ChangeMe123!", 12);
    await User.create({ name: process.env.ADMIN_NAME || "Municipal Admin", email, password, role: "admin" });
    console.log(`Seeded municipal admin: ${email}`);
  }
}
