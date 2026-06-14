import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import publicRoutes from "./routes/publicRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import pendaftaranRoutes from "./routes/pendaftaranRoutes.js";
import santriRoutes from "./routes/santriRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminGuruRoutes from "./routes/adminGuruRoutes.js";
import adminKelasRoutes from "./routes/adminKelasRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import guruRoutes from "./routes/guruRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   CONFIG
========================================================= */

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

/* =========================================================
   CORS
========================================================= */

const corsOptions = {
  origin(origin, callback) {
    // Izinkan request tanpa origin:
    // contoh: Postman, browser direct access, Render health check
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS BLOCKED ORIGIN:", origin);
    return callback(new Error(`CORS tidak mengizinkan origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =========================================================
   STATIC FILES
========================================================= */

app.use("/docs", express.static(path.join(__dirname, "public", "docs")));

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Express.js Al-Furqon aktif",
    health: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Express.js Al-Furqon aktif",
    environment: process.env.NODE_ENV || "development",
    frontend: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedOrigins,
  });
});

/* =========================================================
   ROUTES
========================================================= */

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pendaftaran", pendaftaranRoutes);
app.use("/api/santri", santriRoutes);

app.use("/api/admin", adminGuruRoutes);
app.use("/api/admin", adminKelasRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/owner", ownerRoutes);
app.use("/api/guru", guruRoutes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
    method: req.method,
    path: req.originalUrl,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  if (err.message?.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak oleh CORS.",
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server.",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log("=====================================");
  console.log("Backend Express.js Al-Furqon aktif");
  console.log(`PORT      : ${PORT}`);
  console.log(`NODE_ENV  : ${process.env.NODE_ENV || "development"}`);
  console.log(`Frontend  : ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  console.log("Allowed Origins:");
  allowedOrigins.forEach((origin) => console.log(`- ${origin}`));
  console.log("Endpoints:");
  console.log("- GET /");
  console.log("- GET /api/health");
  console.log("- GET /api/home");
  console.log("- GET /api/program");
  console.log("- GET /api/pendidikan");
  console.log("- GET /api/fasilitas");
  console.log("- /api/auth");
  console.log("- /api/pendaftaran");
  console.log("- /api/santri");
  console.log("- /api/admin");
  console.log("- /api/owner");
  console.log("- /api/guru");
  console.log("=====================================");
});