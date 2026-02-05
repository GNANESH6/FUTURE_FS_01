import mongoose from "mongoose";

export default mongoose.model("Skill", new mongoose.Schema({
  name: String,
  level: String
}));
