import express from "express";
import path from "path";
import corsMiddleware from "./config/cors.js";
import "./config/env.js";

import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();


// ✅ CORS (MUST be first middleware)
app.use(corsMiddleware);

// ✅ Handle preflight requests (important for browser + axios)
app.options("*", corsMiddleware);

// ✅ Body parser
app.use(express.json());


// ✅ Static uploads folder
app.use("/uploads", express.static(path.resolve("uploads")));


// ✅ Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);


export default app;
