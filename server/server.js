import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  ensureDefaultAdminUser,
} from "./utils/ensureAdminUser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  // "RAZORPAY_KEY_ID",
  // "RAZORPAY_KEY_SECRET",
];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
}

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const adminSeedResult = await ensureDefaultAdminUser();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (adminSeedResult.created) {
        console.log(
          `Default admin created: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`
        );
      } else {
        console.log(`Default admin ready: ${DEFAULT_ADMIN_EMAIL}`);
      }
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

startServer();