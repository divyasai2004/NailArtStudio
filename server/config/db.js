import mongoose from "mongoose";

const validateMongoUri = (uri) => {
  if (!uri) {
    throw new Error("MONGO_URI is missing. Add it to your environment variables.");
  }

  if (!uri.startsWith("mongodb+srv://") && !uri.startsWith("mongodb://")) {
    throw new Error(
      "Invalid MONGO_URI. Use a valid MongoDB connection string starting with mongodb:// or mongodb+srv://"
    );
  }
};

export const connectDB = async (mongoUri) => {
  validateMongoUri(mongoUri);

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB Atlas connected");
};
