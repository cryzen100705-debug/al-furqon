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

import ownerRoutes from "./routes/ownerRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   CONFIG
========================================================= */

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* =========================================================
   STATIC FILES
========================================================= */

app.use(
  "/docs",
  express.static(path.join(__dirname, "public", "docs"))
);

/* =========================================================
   ROUTES
========================================================= */

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pendaftaran", pendaftaranRoutes);
app.use("/api/santri", santriRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);


/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
    path: req.originalUrl,
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log("=====================================");
  console.log("Backend Express.js Al-Furqon aktif");
  console.log(`URL        : http://localhost:${PORT}`);
  console.log(`Frontend   : ${FRONTEND_URL}`);
  console.log("Endpoints  :");
  console.log(`- http://localhost:${PORT}/api/health`);
  console.log(`- http://localhost:${PORT}/api/home`);
  console.log(`- http://localhost:${PORT}/api/program`);
  console.log(`- http://localhost:${PORT}/api/pendidikan`);
  console.log(`- http://localhost:${PORT}/api/fasilitas`);
  console.log(`- http://localhost:${PORT}/api/pendaftaran`);
  console.log("=====================================");
});