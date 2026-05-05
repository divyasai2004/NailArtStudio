import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";

const roundPrice = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

const razorpayEnabled = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

const razorpayClient = razorpayEnabled
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const calculateTotals = (items = [], shippingPrice = 0, discountAmount = 0) => {
  const itemsPrice = roundPrice(
    items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0)
  );
  const safeShipping = roundPrice(Number(shippingPrice) || 0);
  const safeDiscount = roundPrice(Number(discountAmount) || 0);
  const totalPrice = roundPrice(itemsPrice + safeShipping - safeDiscount);

  return { itemsPrice, shippingPrice: safeShipping, discountAmount: safeDiscount, totalPrice };
};

const validateOrderDraft = ({ products, shippingAddress }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return "Order must contain at least one item";
  }

  if (!shippingAddress?.addressLine1 || !shippingAddress?.city || !shippingAddress?.phone) {
    return "Shipping address is incomplete";
  }

  return null;
};

const getDraftSecret = () => process.env.CHECKOUT_DRAFT_SECRET || process.env.JWT_SECRET;

const signDraft = (payload) =>
  crypto
    .createHmac("sha256", getDraftSecret())
    .update(JSON.stringify(payload))
    .digest("hex");

export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod, shippingPrice, discountAmount } =
      req.body;

    const validationError = validateOrderDraft({ products, shippingAddress });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "For online payment, use /api/orders/payment/razorpay/order",
      });
    }

    const totals = calculateTotals(products, shippingPrice, discountAmount);
    if (totals.totalPrice < 0) {
      return res.status(400).json({ message: "Invalid order total" });
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      shippingAddress,
      itemsPrice: totals.itemsPrice,
      shippingPrice: totals.shippingPrice,
      discountAmount: totals.discountAmount,
      totalPrice: totals.totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "COD_PENDING" : "PENDING",
      orderStatus: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create order" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpayEnabled || !razorpayClient) {
      return res.status(503).json({ message: "Razorpay is temporarily disabled" });
    }

    const { products, shippingAddress, shippingPrice, discountAmount } = req.body;

    const validationError = validateOrderDraft({ products, shippingAddress });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const totals = calculateTotals(products, shippingPrice, discountAmount);
    if (totals.totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid order total" });
    }

    const razorpayOrder = await razorpayClient.orders.create({
      amount: Math.round(totals.totalPrice * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
      },
    });

    const orderDraft = {
      products,
      shippingAddress,
      shippingPrice: totals.shippingPrice,
      discountAmount: totals.discountAmount,
      itemsPrice: totals.itemsPrice,
      totalPrice: totals.totalPrice,
      paymentMethod: "RAZORPAY",
      razorpayOrderId: razorpayOrder.id,
      userId: req.user._id.toString(),
    };

    const draftSignature = signDraft(orderDraft);

    return res.status(200).json({
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
      orderDraft,
      draftSignature,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

export const verifyRazorpayPaymentAndCreateOrder = async (req, res) => {
  try {
    if (!razorpayEnabled) {
      return res.status(503).json({ message: "Razorpay is temporarily disabled" });
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderDraft,
      draftSignature,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing Razorpay payment fields" });
    }

    if (!orderDraft || !draftSignature) {
      return res.status(400).json({ message: "Missing order draft details" });
    }

    const expectedDraftSignature = signDraft(orderDraft);
    if (expectedDraftSignature !== draftSignature) {
      return res.status(400).json({ message: "Invalid checkout draft signature" });
    }

    if (
      orderDraft.userId !== req.user._id.toString() ||
      orderDraft.razorpayOrderId !== razorpayOrderId
    ) {
      return res.status(403).json({ message: "Order draft mismatch" });
    }

    const signatureBody = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedPaymentSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signatureBody)
      .digest("hex");

    if (expectedPaymentSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid Razorpay signature" });
    }

    const existingOrder = await Order.findOne({
      "paymentResult.razorpayPaymentId": razorpayPaymentId,
    });
    if (existingOrder) {
      return res.status(200).json(existingOrder);
    }

    const totals = calculateTotals(
      orderDraft.products,
      orderDraft.shippingPrice,
      orderDraft.discountAmount
    );
    if (totals.totalPrice !== Number(orderDraft.totalPrice)) {
      return res.status(400).json({ message: "Order total verification failed" });
    }

    const order = await Order.create({
      user: req.user._id,
      products: orderDraft.products,
      shippingAddress: orderDraft.shippingAddress,
      itemsPrice: totals.itemsPrice,
      shippingPrice: totals.shippingPrice,
      discountAmount: totals.discountAmount,
      totalPrice: totals.totalPrice,
      paymentMethod: "RAZORPAY",
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
      paymentResult: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        paidAt: new Date(),
        failureReason: "",
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: "Invalid order id" });
  }
};

export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    order.paymentStatus = "PAID";
    order.orderStatus = order.orderStatus === "CANCELLED" ? "CANCELLED" : "CONFIRMED";
    order.paymentResult = {
      ...order.paymentResult,
      razorpayOrderId: razorpayOrderId || order.paymentResult.razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || order.paymentResult.razorpayPaymentId,
      razorpaySignature: razorpaySignature || order.paymentResult.razorpaySignature,
      paidAt: new Date(),
      failureReason: "",
    };

    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update payment status" });
  }
};

export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { orderStatus, paymentStatus } = req.body;

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === "DELIVERED") {
        order.deliveredAt = new Date();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "PAID" && !order.paymentResult?.paidAt) {
        order.paymentResult = {
          ...order.paymentResult,
          paidAt: new Date(),
        };
      }
    }

    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status" });
  }
};
