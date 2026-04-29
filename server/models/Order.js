import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedSize: {
      type: String,
      default: "",
      trim: true,
    },
    selectedShape: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    products: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (val) => Array.isArray(val) && val.length > 0,
        message: "Order must include at least one product",
      },
    },
    shippingAddress: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      addressLine1: { type: String, required: true, trim: true },
      addressLine2: { type: String, default: "", trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true, default: "India" },
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["RAZORPAY", "COD"],
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "COD_PENDING", "COD_CONFIRMED"],
      default: "PENDING",
      index: true,
    },
    paymentResult: {
      razorpayOrderId: { type: String, default: "", trim: true },
      razorpayPaymentId: { type: String, default: "", trim: true },
      razorpaySignature: { type: String, default: "", trim: true },
      paidAt: { type: Date, default: null },
      failureReason: { type: String, default: "", trim: true },
    },
    orderStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
      index: true,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);