import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

schema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Admin", schema);
