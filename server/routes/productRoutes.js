import express from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/best-sellers", (req, res, next) => {
  req.query.bestSeller = "true";
  req.query.limit = req.query.limit || "8";
  next();
}, getProducts);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, createProductReview);

// Admin routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;