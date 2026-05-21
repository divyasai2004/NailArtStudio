import express from "express";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  validateCoupon,
} from "../controllers/couponController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/validate", protect, validateCoupon);
router.post("/", protect, admin, createCoupon);
router.get("/", protect, admin, getAllCoupons);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

export default router;
