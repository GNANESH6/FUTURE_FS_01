import app from "./app.js";
import { connectDB } from "./config/db.js";
const PORT = process.env.PORT || 5000;

// Validate GitHub Token
if (!process.env.GITHUB_TOKEN) {
  console.warn("⚠️  WARNING: GITHUB_TOKEN is not set in environment variables. GitHub stats feature may hit rate limits or fail.");
} else {
  console.log("✅ GITHUB_TOKEN is available.");
}

connectDB();
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
