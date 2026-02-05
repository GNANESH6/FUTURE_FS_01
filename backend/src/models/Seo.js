import mongoose from "mongoose";

export default mongoose.model(
  "Seo",
  new mongoose.Schema({
    title: String,
    description: String,
    keywords: [String]
  })
);
