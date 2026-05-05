import express from "express";
import {
  registerUser,
  loginUser,
  getMyProfile,
  getAllUsers,
  toggleUserActive,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMyProfile);

// Admin routes
router.get("/", protect, admin, getAllUsers);
router.put("/:id/toggle-active", protect, admin, toggleUserActive);

export default router;