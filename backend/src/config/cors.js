import cors from "cors";

const allowedOrigins = [
  "https://gnanesh-portfolio-delta.vercel.app",
  "https://admin-gnanesh.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {

    // allow requests without origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

export default cors(corsOptions);
