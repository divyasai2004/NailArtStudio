import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 140,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    shortBenefit: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    whyYouWillLoveIt: {
      type: [String],
      default: [],
    },
    whatYouGet: {
      type: [String],
      default: [],
    },
    sizeGuide: {
      type: String,
      default: "",
      trim: true,
    },
    perfectFor: {
      type: [String],
      default: [],
    },
    shippingPaymentInfo: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Short", "Long", "Bridal", "Custom"],
    },
    sizeOptions: {
      type: [String],
      default: ["XS", "S", "M", "L"],
    },
    shapeOptions: {
      type: [String],
      default: ["Round", "Almond", "Square", "Coffin", "Stiletto"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    trustBadges: {
      type: [String],
      default: ["Cash on Delivery", "Easy Return"],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ isBestSeller: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);