import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const DEFAULT_ADMIN_EMAIL =
  process.env.DEFAULT_ADMIN_EMAIL || "admin@nailartstudio.com";
export const DEFAULT_ADMIN_PASSWORD =
  process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";
export const DEFAULT_ADMIN_NAME =
  process.env.DEFAULT_ADMIN_NAME || "NailArt Admin";

export const ensureDefaultAdminUser = async () => {
  const email = DEFAULT_ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });

  if (!existing) {
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);
    await User.create({
      name: DEFAULT_ADMIN_NAME,
      email,
      password,
      isAdmin: true,
      isActive: true,
    });
    return { created: true, email };
  }

  if (!existing.isAdmin) {
    existing.isAdmin = true;
    await existing.save();
  }

  return { created: false, email };
};
