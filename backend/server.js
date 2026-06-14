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

const normalizeOrigin = (origin = "") => {
  return String(origin).trim().replace(/\/$/, "");
};

const envAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean)
  : [];

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL ? normalizeOrigin(process.env.FRONTEND_URL) : null,
  process.env.VERCEL_URL
    ? normalizeOrigin(`https://${process.env.VERCEL_URL}`)
    : null,
  ...envAllowedOrigins,
]
  .filter(Boolean)
  .filter((origin, index, array) => array.indexOf(origin) === index);

/* =========================================================
   CORS
========================================================= */

const isVercelPreview = (origin = "") => {
  return origin.endsWith(".vercel.app") && origin.includes("al-furqon");
};

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(cleanOrigin) || isVercelPreview(cleanOrigin)) {
      return callback(null, true);
    }

    console.log("CORS BLOCKED ORIGIN:", cleanOrigin);
    return callback(new Error(`CORS tidak mengizinkan origin: ${cleanOrigin}`));
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
    requestOrigin: req.headers.origin || null,
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
      origin: req.headers.origin || null,
      allowedOrigins,
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