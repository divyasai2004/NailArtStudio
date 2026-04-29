import express from "express";
import {
  createOrder,
  // createRazorpayOrder,
  // verifyRazorpayPaymentAndCreateOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
// Razorpay temporarily disabled in local flow (kept for later enablement)
// router.post("/payment/razorpay/order", protect, createRazorpayOrder);
// router.post("/payment/razorpay/verify", protect, verifyRazorpayPaymentAndCreateOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);

router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;
