import { useEffect, useMemo, useState } from "react";
import SidebarGuru from "./sidebar";
import {
  FaUserCheck,
  FaUserTimes,
  FaPaperPlane,
  FaSearch,
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function KelulusanGuruPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [user, setUser] = useState(null);
  const [guru, setGuru] = useState(null);
  const [santriList, setSantriList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedGuru = localStorage.getItem("guru");

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedGuru) setGuru(JSON.parse(savedGuru));
    } catch (error) {
      console.error("Gagal membaca session:", error);
    }
  }, []);

  useEffect(() => {
    if (!guru?.id && !user?.id) return;

    const fetchSantriWaliKelas = async () => {
      try {
        setLoading(true);

        const userId = user?.id;

const res = await fetch(`${API_URL}/api/guru/kelulusan/${userId}`, {
  headers: {
    "x-user-id": userId,
  },
});
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Gagal mengambil data santri.");
        }

        const mapped = (result.data || []).map((item) => ({
          ...item,
          status_kelulusan: item.status_kelulusan || "",
          catatan_guru: item.catatan_guru || "",
        }));

        setSantriList(mapped);
      } catch (error) {
        console.error("FETCH KELULUSAN ERROR:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSantriWaliKelas();
  }, [guru?.id, user?.id]);

  const filteredSantri = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return santriList;

    return santriList.filter((item) => {
      return (
        String(item.nama || "").toLowerCase().includes(keyword) ||
        String(item.nis || "").toLowerCase().includes(keyword) ||
        String(item.kelas_nama || "").toLowerCase().includes(keyword)
      );
    });
  }, [search, santriList]);

  const updateStatus = (santriId, status) => {
    setSantriList((prev) =>
      prev.map((item) =>
        item.id === santriId
          ? {
              ...item,
              status_kelulusan: status,
            }
          : item
      )
    );
  };

  const updateCatatan = (santriId, value) => {
    setSantriList((prev) =>
      prev.map((item) =>
        item.id === santriId
          ? {
              ...item,
              catatan_guru: value,
            }
          : item
      )
    );
  };

  const handleSubmitKelulusan = async () => {
    try {
      const belumDinilai = santriList.filter(
        (item) => !item.status_kelulusan
      );

      if (belumDinilai.length > 0) {
        alert("Masih ada santri yang belum ditentukan lulus/tidak lulus.");
        return;
      }

      const yakin = confirm(
        "Kirim data kelulusan santri ke admin untuk diverifikasi?"
      );

      if (!yakin) return;

      setSubmitting(true);

      const userId = user?.id;

const payload = {
  user_id: userId,
  data: santriList.map((item) => ({
    santri_id: item.id,
    kelas_id: item.kelas_id,
    status_kelulusan: item.status_kelulusan,
    catatan_guru: item.catatan_guru || "",
  })),
};
      const res = await fetch(`${API_URL}/api/guru/kelulusan/submit`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-user-id": userId,
  },
  body: JSON.stringify(payload),
});
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengirim data kelulusan.");
      }

      alert("Data kelulusan berhasil dikirim ke admin untuk diverifikasi.");
    } catch (error) {
      console.error("SUBMIT KELULUSAN ERROR:", error);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalLulus = santriList.filter(
    (item) => item.status_kelulusan === "lulus"
  ).length;

  const totalTidakLulus = santriList.filter(
    (item) => item.status_kelulusan === "tidak_lulus"
  ).length;

  const totalBelumDinilai = santriList.filter(
    (item) => !item.status_kelulusan
  ).length;

  return (
  <main className="min-h-screen overflow-x-hidden bg-[#F7F4E8] text-emerald-950">
    <SidebarGuru
      open={sidebarOpen}
      setOpen={setSidebarOpen}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
    />

    <section
      className={`
        min-h-screen w-full overflow-x-hidden transition-all duration-300
        pt-16 md:pt-0
        ${
          collapsed
            ? "md:ml-[92px] md:w-[calc(100%-92px)]"
            : "md:ml-[272px] md:w-[calc(100%-272px)]"
        }
      `}
    >
      <div className="mx-auto w-full max-w-none px-4 pb-10 pt-6 sm:px-5 lg:px-7">
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">
                  Wali Kelas
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                  Validasi Kelulusan Santri
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100">
                  Guru wali kelas dapat menentukan santri yang layak lulus atau
                  belum layak lulus. Setelah dikirim, data akan masuk ke admin
                  untuk proses verifikasi.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmitKelulusan}
                disabled={submitting || loading || santriList.length === 0}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-amber-300 px-5 py-3 font-black text-emerald-950 shadow-lg transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaPaperPlane />
                {submitting ? "Mengirim..." : "Kirim ke Admin"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <FaClipboardCheck />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-600">
                    Belum Dinilai
                  </p>
                  <h2 className="text-2xl font-black">{totalBelumDinilai}</h2>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <FaCheckCircle />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-600">Lulus</p>
                  <h2 className="text-2xl font-black">{totalLulus}</h2>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <FaTimesCircle />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-600">
                    Tidak Lulus
                  </p>
                  <h2 className="text-2xl font-black">{totalTidakLulus}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] bg-white p-4 shadow-sm">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama santri, NIS, atau kelas..."
                className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-12 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[30px] bg-white shadow-sm">
            {loading ? (
              <div className="p-8 text-center font-bold text-emerald-700">
                Mengambil data santri...
              </div>
            ) : filteredSantri.length === 0 ? (
              <div className="p-8 text-center font-bold text-emerald-700">
                Data santri belum tersedia.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1350px] border-collapse">
                  <thead>
  <tr className="bg-emerald-800 text-left text-xs uppercase tracking-wider text-white">
    <th className="px-5 py-4">Santri</th>
    <th className="px-5 py-4">NIS</th>
    <th className="px-5 py-4">Kelas</th>
    <th className="px-5 py-4">Status Guru</th>
    <th className="px-5 py-4">Status Admin</th>
    <th className="px-5 py-4">Catatan Guru</th>
  </tr>
</thead>
<tbody>
  {filteredSantri.map((item) => {
    const statusAdmin = item.status_verifikasi || "belum_dikirim";
    const isLocked =
      statusAdmin === "pending" ||
      statusAdmin === "disetujui" ||
      statusAdmin === "ditolak";

    return (
      <tr
        key={item.id}
        className="border-b border-emerald-50 align-top"
      >
        {/* SANTRI */}
        <td className="px-5 py-5">
          <div className="min-w-[180px]">
            <p className="font-black text-emerald-950">
              {item.nama || "-"}
            </p>

            <p className="mt-1 text-xs font-semibold text-emerald-600">
              ID: {item.id}
            </p>
          </div>
        </td>

        {/* NIS */}
        <td className="px-5 py-5">
          <p className="min-w-[120px] text-sm font-black text-emerald-800">
            {item.nis || item.nisn || "-"}
          </p>
        </td>

        {/* KELAS */}
        <td className="px-5 py-5">
          <p className="min-w-[130px] text-sm font-black text-emerald-800">
            {item.kelas_nama || "-"}
          </p>
        </td>

        {/* STATUS GURU */}
        <td className="px-5 py-5">
          <div className="flex min-w-[210px] flex-wrap gap-2">
            <button
              type="button"
              disabled={isLocked}
              onClick={() => updateStatus(item.id, "lulus")}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                item.status_kelulusan === "lulus"
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              <FaUserCheck />
              Lulus
            </button>

            <button
              type="button"
              disabled={isLocked}
              onClick={() => updateStatus(item.id, "tidak_lulus")}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                item.status_kelulusan === "tidak_lulus"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              <FaUserTimes />
              Tidak Lulus
            </button>
          </div>

          {isLocked && (
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Data sudah dikirim, menunggu proses admin.
            </p>
          )}
        </td>

        {/* STATUS ADMIN */}
        <td className="px-5 py-5">
          <div className="min-w-[170px]">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-black ${
                statusAdmin === "disetujui"
                  ? "bg-green-100 text-green-700"
                  : statusAdmin === "ditolak"
                  ? "bg-red-100 text-red-700"
                  : statusAdmin === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {statusAdmin === "disetujui"
                ? "Disetujui Admin"
                : statusAdmin === "ditolak"
                ? "Ditolak Admin"
                : statusAdmin === "pending"
                ? "Menunggu Admin"
                : "Belum Dikirim"}
            </span>

            {item.catatan_admin && (
              <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-slate-500">
                Catatan admin: {item.catatan_admin}
              </p>
            )}
          </div>
        </td>

        {/* CATATAN GURU */}
        <td className="px-5 py-5">
          <textarea
            value={item.catatan_guru || ""}
            disabled={isLocked}
            onChange={(e) => updateCatatan(item.id, e.target.value)}
            placeholder="Catatan wali kelas..."
            className="min-h-[76px] w-[260px] rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          />
        </td>
      </tr>
    );
  })}
</tbody>
                
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}