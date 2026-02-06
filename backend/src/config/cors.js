import cors from "cors";

const corsOptions = {
  origin: [
    "https://gnanesh-portfolio-delta.vercel.app",
    "https://admin-gnanesh.vercel.app"
  ],
  credentials: true
};

export default cors(corsOptions);
