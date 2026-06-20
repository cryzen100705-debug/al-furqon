"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const usePembayaran = () => {
  const [data, setData] = useState([]);
  const [santri, setSantri] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  const getSession = () => {
    try {
      return JSON.parse(localStorage.getItem("session"));
    } catch {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const session = getSession();

      if (!session?.user?.id) {
        setData([]);
        setSantri(null);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/santri/pembayaran/${session.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response backend bukan JSON:", text);

        throw new Error(
          "Backend tidak mengembalikan JSON. Pastikan backend Express aktif."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data pembayaran.");
      }

      setSantri(result.santri || null);
      setData(result.data || []);
    } catch (err) {
      console.error("FETCH PEMBAYARAN ERROR:", err.message);
      setSantri(null);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const bayar = async ({ item, metode, file, nominal_bayar }) => {
    try {
      const session = getSession();

      if (!session?.user?.id) {
        alert("Session tidak ditemukan. Silakan login ulang.");
        return;
      }

      if (!item?.id) {
        alert("Data tagihan tidak valid.");
        return;
      }

      if (!metode) {
        alert("Pilih metode pembayaran terlebih dahulu.");
        return;
      }

      if (!nominal_bayar || Number(nominal_bayar) <= 0) {
  alert("Masukkan nominal cicilan terlebih dahulu.");
  return;
}

      if (!file) {
        alert("Upload bukti pembayaran terlebih dahulu.");
        return;
      }

      setUploadingId(item.id);

      const formData = new FormData();
formData.append("user_id", session.user.id);
formData.append("metode", metode);
formData.append("nominal_bayar", nominal_bayar);
formData.append("bukti", file);

const response = await fetch(
  `${API_URL}/api/santri/pembayaran/${item.id}/konfirmasi`,
  {
    method: "POST",
    body: formData,
  }
);

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response backend bukan JSON:", text);

        throw new Error(
          "Backend tidak mengembalikan JSON. Pastikan backend Express aktif."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengirim pembayaran.");
      }

      alert(result.message || "Pembayaran berhasil dikirim.");

      await fetchData();
    } catch (err) {
      console.error("PEMBAYARAN ERROR:", err.message);
      alert(err.message || "Gagal mengirim pembayaran.");
    } finally {
      setUploadingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    uploadingId,
    bayar,
    santri,
    refresh: fetchData,
  };
};