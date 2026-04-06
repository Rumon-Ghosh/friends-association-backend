import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

async function main() {
  try {
    if (!config.mongo_url) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(config.mongo_url as string);
    console.log("🔥 Connected to MongoDB successfully");

    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

main();
