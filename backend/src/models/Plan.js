import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    priceMonthly: { type: Number, required: true },
    priceYearly: { type: Number, required: true },
    features: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
