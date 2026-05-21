import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate,
      usageLimit,
      isActive,
      assignedUsers,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      expiryDate,
      usageLimit: usageLimit || 0,
      isActive: isActive !== undefined ? isActive : true,
      assignedUsers: assignedUsers || [],
    });

    return res.status(201).json(coupon);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create coupon" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
      const existing = await Coupon.findOne({ code: updates.code, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    return res.status(200).json(coupon);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update coupon" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    return res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete coupon" });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).populate("assignedUsers", "name email").sort({ createdAt: -1 });
    return res.status(200).json(coupons);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch coupons" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const userId = req.user._id;

    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });
    if (!coupon.isActive) return res.status(400).json({ message: "This coupon is no longer active" });
    if (new Date(coupon.expiryDate) < new Date()) return res.status(400).json({ message: "This coupon has expired" });
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: "Coupon usage limit reached" });
    if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum order amount of ₹${coupon.minOrderAmount} is required` });
    
    // Check user eligibility
    if (coupon.assignedUsers && coupon.assignedUsers.length > 0) {
      const isEligible = coupon.assignedUsers.some(id => id.toString() === userId.toString());
      if (!isEligible) {
        return res.status(403).json({ message: "You are not eligible to use this coupon" });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    return res.status(200).json({ 
      valid: true, 
      coupon, 
      discountAmount: Number(discountAmount.toFixed(2)) 
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to validate coupon" });
  }
};
