import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.sendStatus(401);

  const ok = await bcrypt.compare(req.body.password, admin.password);
  if (!ok) return res.sendStatus(401);

  res.json({ token: signToken(admin._id) });
};

export const register = async (req, res) => {
  const admin = await Admin.create(req.body);
  res.json(admin);
};
