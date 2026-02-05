import mongoose from "mongoose";

export default mongoose.model(
  "Education",
  new mongoose.Schema({
    degree: String,
    institute: String,
    year: String
  }, { timestamps: true })
);
