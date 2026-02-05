import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    filename: String,
    url: String
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
