import cors from "cors";

const corsOptions = {
  origin: "https://gnanesh-portfolio-delta.vercel.app",
  credentials: true,
};

export default cors(corsOptions);
