import express from "express";
import {
  createCustomRequest,
  getAdminCustomRequests,
  updateCustomRequestStatus,
} from "../controllers/customRequestController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", optionalAuth, createCustomRequest);
router.get("/", protect, admin, getAdminCustomRequests);
router.put("/:id", protect, admin, updateCustomRequestStatus);

export default router;
