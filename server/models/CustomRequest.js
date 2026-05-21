import mongoose from "mongoose";

const customRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    shape: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    measurements: {
      type: String, // Only provided if size is 'Custom'
      default: "",
    },
    length: {
      type: String,
      required: true,
    },
    baseColor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    referenceImage: {
      type: String, // URL
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Completed", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const CustomRequest = mongoose.model("CustomRequest", customRequestSchema);

export default CustomRequest;
