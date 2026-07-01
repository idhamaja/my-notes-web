import express from "express";
import noteRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ CONNECT DB (pakai async biar aman)
await connectDB();

// ✅ CORS FIX (WAJIB tambah options)
const allowedOrigins = [
  "http://localhost:5173",
  "https://my-notes-web-blond.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// 🔥 WAJIB untuk preflight request
app.options("*", cors());

// Middleware
app.use(express.json());

// Debug log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test route
app.get("/api/test", (req, res) => {
  res.send("API is working 🚀");
});

// Routes
app.use("/api/notes", noteRoutes);

// ❌ Jangan listen di Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
}

export default app;
