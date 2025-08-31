import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
import path from "path";

// Make sure the path points to the .env in backend folder
dotenv.config({ path: path.join(process.cwd(), ".env") });

console.log("MONGO_URL:", process.env.MONGO_URL); // should print your URI

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    try {
      await User.collection.dropIndex("username_1");
      console.log("Old username index dropped");
    } catch (err) {
      console.log("Index may not exist or already dropped:", err.message);
    }

    await User.syncIndexes();
    console.log("Indexes synced");

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

fixIndexes();
