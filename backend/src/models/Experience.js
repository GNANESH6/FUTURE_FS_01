import mongoose from "mongoose";

export default mongoose.model(
  "Experience",
  new mongoose.Schema({
    title: String,
    company: String,
    period: String,
    description: String
  }, { timestamps: true })
);
