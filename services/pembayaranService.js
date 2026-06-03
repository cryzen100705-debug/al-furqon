import { supabase } from "../lib/supabase";

// =====================================================
// GET TAGIHAN SANTRI
// =====================================================
export const getTagihanBySantri = async (
  santriId
) => {
  const { data, error } = await supabase
    .from("tagihan")
    .select(`
      id,
      santri_id,
      jenis,
      nominal,
      deadline,
      status,
      target_type,
      metode,
      tanggal_bayar,
      created_at
    `)
    .eq("santri_id", santriId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "GET TAGIHAN ERROR:",
      error
    );

    return [];
  }

  return data;
};

// =====================================================
// CREATE PEMBAYARAN
// =====================================================
export const createPembayaran =
  async (payload) => {
    const { data, error } =
      await supabase
        .from("pembayaran")
        .insert([payload])
        .select()
        .single();

    if (error) {
      console.error(
        "CREATE PEMBAYARAN ERROR:",
        error
      );

      throw error;
    }

    return data;
  };

// =====================================================
// CEK PEMBAYARAN
// =====================================================
export const checkPembayaran =
  async (tagihanId) => {
    const { data, error } =
      await supabase
        .from("pembayaran")
        .select("*")
        .eq("tagihan_id", tagihanId)
        .maybeSingle();

    if (
      error &&
      error.code !== "PGRST116"
    ) {
      throw error;
    }

    return data;
  };

// =====================================================
// UPLOAD BUKTI TRANSFER
// =====================================================
export const uploadBukti =
  async (file) => {
    if (!file)
      throw new Error(
        "File tidak ditemukan"
      );

    const fileExt =
      file.name.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // UPLOAD
    const { error } =
      await supabase.storage
        .from("bukti-transfer")
        .upload(fileName, file);

    if (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

      throw error;
    }

    // GET URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("bukti-transfer")
      .getPublicUrl(fileName);

    return publicUrl;
  };

// =====================================================
// UPDATE PEMBAYARAN
// =====================================================
export const updatePembayaran =
  async (id, payload) => {
    const { data, error } =
      await supabase
        .from("pembayaran")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(
        "UPDATE PEMBAYARAN ERROR:",
        error
      );

      throw error;
    }

    return data;
  };

// =====================================================
// UPDATE TAGIHAN
// =====================================================
export const updateTagihan =
  async (id, payload) => {
    const { data, error } =
      await supabase
        .from("tagihan")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(
        "UPDATE TAGIHAN ERROR:",
        error
      );

      throw error;
    }

    return data;
  };

// =====================================================
// GET RIWAYAT PEMBAYARAN
// =====================================================
export const getRiwayatPembayaran =
  async (santriId) => {
    const { data, error } =
      await supabase
        .from("pembayaran")
        .select("*")
        .eq("santri_id", santriId)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "GET RIWAYAT ERROR:",
        error
      );

      return [];
    }

    return data;
  };