import express from "express";
import path from "path";
import cors from "./config/cors.js";
import "./config/env.js";

import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// ✅ CORS MUST BE FIRST
app.use(cors);

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options("*", cors);

// ✅ Body parser
app.use(express.json());

// ✅ Static folder
app.use("/uploads", express.static(path.resolve("uploads")));

// ✅ Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Optional test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
