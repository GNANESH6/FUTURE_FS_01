import express from "express";
import path from "path";
import corsMiddleware from "./config/cors.js";
import "./config/env.js";

import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(corsMiddleware); // only this

app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

export default app;
