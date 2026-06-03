"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const usePemberitahuanSantri = () => {
  const [santri, setSantri] = useState(null);
  const [data, setData] = useState([]);
  const [readIds, setReadIds] = useState([]);

  const [loading, setLoading] = useState(true);

  const getSession = () => {
    try {
      return JSON.parse(localStorage.getItem("session"));
    } catch {
      return null;
    }
  };

  const fetchPemberitahuan = async () => {
    try {
      setLoading(true);

      const session = getSession();

      if (!session?.user?.id) {
        setSantri(null);
        setData([]);
        setReadIds([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/santri/pemberitahuan/${session.user.id}`,
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
        throw new Error(result.message || "Gagal mengambil pemberitahuan.");
      }

      setSantri(result.santri || null);
      setData(result.data || []);
      setReadIds(result.readIds || []);
    } catch (error) {
      console.error("FETCH PEMBERITAHUAN ERROR:", error.message);
      setSantri(null);
      setData([]);
      setReadIds([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (item) => {
    try {
      const session = getSession();

      if (!session?.user?.id || !item?.id) return;

      const alreadyRead = readIds.includes(item.id);

      if (alreadyRead) return;

const response = await fetch(
  `${API_URL}/api/santri/pemberitahuan/${item.id}/read`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: session.user.id,
    }),
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
        throw new Error(
          result.message || "Gagal menandai pemberitahuan sebagai dibaca."
        );
      }

      setReadIds((prev) => [...prev, item.id]);
    } catch (error) {
      console.error("MARK AS READ ERROR:", error.message);
    }
  };

  useEffect(() => {
    fetchPemberitahuan();
  }, []);

  return {
    santri,
    data,
    readIds,
    loading,
    refresh: fetchPemberitahuan,
    markAsRead,
  };
};