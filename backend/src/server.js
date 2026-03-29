import express from "express";
import noteRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import path from "path";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
dotenv.config(); // 🔥 HARUS PALING ATAS

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Optional: fix CSP issue (basic)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
  );
  next();
});

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "https://my-notes-web-blond.vercel.app", // port React kamu
    }),
  );
}

//middleware
app.use(express.json());

app.use(rateLimiter);

app.use((req, res, next) => {
  console.log(`Request method: ${req.method} | Request URL: ${req.url}`);
  next();
});

app.use("/api/notes", noteRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT: Boss!!!", PORT);
  });
});
