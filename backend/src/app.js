import express from "express";
import path from "path";
import corsMiddleware from "./config/cors.js";
import "./config/env.js";

import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// ✅ CORS FIRST
app.use(corsMiddleware);
app.options("/*", corsMiddleware);

// ✅ Parsers
app.use(express.json());

// ✅ Static
app.use("/uploads", express.static(path.resolve("uploads")));

// ✅ Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

export default app;
