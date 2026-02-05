import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    email: String,
    phone: String
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
