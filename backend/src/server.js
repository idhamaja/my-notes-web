import express from "express";
import noteRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import path from "path";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration for all environments
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || true
        : "http://localhost:5173",
    credentials: true,
  }),
);

// Fix CSP issue
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
  );
  next();
});

// Middleware
app.use(express.json());
app.use(rateLimiter);

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request method: ${req.method} | Request URL: ${req.url}`);
  next();
});

// Routes
app.use("/api/notes", noteRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Only connect to DB and listen if not in Vercel serverless environment
if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log("Server started on PORT:", PORT);
    });
  });
}

// Export for Vercel serverless functions
export default app;
