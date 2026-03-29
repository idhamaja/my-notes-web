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

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CONNECT DB (WAJIB SELALU JALAN)
connectDB();

// ✅ CORS FIX (JANGAN pakai true)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-notes-web-blond.vercel.app"],
    credentials: true,
  }),
);

// Middleware
app.use(express.json());
app.use(rateLimiter);

// Logging (optional tapi bagus)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ TEST ROUTE (debug)
app.get("/api/test", (req, res) => {
  res.send("API is working 🚀");
});

// Routes
app.use("/api/notes", noteRoutes);

// Serve frontend (optional, kalau satu repo)
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../frontend/dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ✅ LOCAL ONLY (JANGAN jalan di Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server running on port:", PORT);
  });
}

// ✅ EXPORT for Vercel
export default app;
