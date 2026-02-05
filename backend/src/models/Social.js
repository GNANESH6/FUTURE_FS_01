import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Social", socialSchema);
