import cors from "cors";

const allowedOrigins = [
  "https://gnanesh-portfolio-delta.vercel.app",
  "https://admin-gnanesh.vercel.app",
  "http://localhost:5173",
  "http://localhost:5175"

];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman, server-to-server

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

export default cors(corsOptions);
