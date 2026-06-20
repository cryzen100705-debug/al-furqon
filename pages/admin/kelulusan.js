import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaSyncAlt,
  FaHourglassHalf,
  FaExchangeAlt,
  FaUserGraduate,
  FaChevronDown,
  FaChevronRight,
  FaSchool,
} from "react-icons/fa";
import SidebarAdmin from "./sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function BadgeVerifikasi({ status }) {
  const value = String(status || "pending").toLowerCase();

  if (value === "disetujui") {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
        Disetujui
      </span>
    );
  }

  if (value === "ditolak") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
        Ditolak
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
      Pending
    </span>
  );
}

function BadgeKelulusan({ status }) {
  if (status === "lulus") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
        <FaCheckCircle />
        Lulus
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
      <FaTimesCircle />
      Tidak Lulus
    </span>
  );
}

function BadgeKenaikan({ status }) {
  const value = String(status || "belum_diproses").toLowerCase();

  if (value === "naik_kelas") {
    return (
      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
        Naik Kelas
      </span>
    );
  }

  if (value === "tinggal_kelas") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
        Tinggal Kelas
      </span>
    );
  }

  if (value === "lulus_akhir") {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
        Lulus Akhir
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
      Belum Diproses
    </span>
  );
}

export default function AdminKelulusanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [dataKelulusan, setDataKelulusan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [openKelas, setOpenKelas] = useState({});

  const fetchKelulusan = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/admin/kelulusan`, {
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data kelulusan.");
      }

      setDataKelulusan(result.data || []);
    } catch (error) {
      console.error("FETCH ADMIN KELULUSAN ERROR:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKelulusan();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return dataKelulusan.filter((item) => {
      const matchKeyword =
        !keyword ||
        String(item.nama_santri || "").toLowerCase().includes(keyword) ||
        String(item.nis || "").toLowerCase().includes(keyword) ||
        String(item.nama_guru || "").toLowerCase().includes(keyword) ||
        String(item.nama_kelas || "").toLowerCase().includes(keyword) ||
        String(item.status_kenaikan || "").toLowerCase().includes(keyword) ||
        String(item.status_kelulusan || "").toLowerCase().includes(keyword);

      const matchStatus =
        filterStatus === "semua" ||
        String(item.status_verifikasi || "pending").toLowerCase() ===
          filterStatus;

      return matchKeyword && matchStatus;
    });
  }, [dataKelulusan, search, filterStatus]);

  const groupedByKelas = useMemo(() => {
    const map = new Map();

    filteredData.forEach((item) => {
      const kelasId =
        item.kelas?.id ||
        item.kelas_id ||
        item.nama_kelas ||
        item.santri?.kelas ||
        "tanpa-kelas";

      const namaKelas =
        item.nama_kelas ||
        item.kelas?.nama_kelas ||
        item.santri?.kelas ||
        "Tanpa Kelas";

      if (!map.has(kelasId)) {
        map.set(kelasId, {
          id: kelasId,
          nama_kelas: namaKelas,
          jenjang: item.kelas?.jenjang || item.santri?.jenjang || "-",
          tingkat: item.kelas?.tingkat || item.santri?.kelas || "-",
          data: [],
        });
      }

      map.get(kelasId).data.push(item);
    });

    return Array.from(map.values()).sort((a, b) => {
      const jenjangA = String(a.jenjang || "");
      const jenjangB = String(b.jenjang || "");

      if (jenjangA !== jenjangB) {
        return jenjangA.localeCompare(jenjangB);
      }

      return String(a.tingkat || "").localeCompare(String(b.tingkat || ""));
    });
  }, [filteredData]);

  const toggleKelas = (kelasId) => {
    setOpenKelas((prev) => ({
      ...prev,
      [kelasId]: !prev[kelasId],
    }));
  };

  const openAllKelas = () => {
    const next = {};

    groupedByKelas.forEach((kelas) => {
      next[kelas.id] = true;
    });

    setOpenKelas(next);
  };

  const closeAllKelas = () => {
    setOpenKelas({});
  };

  const getAdminId = () => {
    try {
      const adminRaw = localStorage.getItem("user");
      const admin = adminRaw ? JSON.parse(adminRaw) : null;

      return admin?.id || null;
    } catch (error) {
      return null;
    }
  };

  const handleVerifikasi = async (id, status) => {
    try {
      const catatan_admin = prompt(
        status === "disetujui"
          ? "Catatan admin untuk persetujuan:"
          : "Alasan penolakan:"
      );

      if (catatan_admin === null) return;

      const yakin = confirm(
        status === "disetujui"
          ? "Yakin ingin menyetujui kelulusan ini?"
          : "Yakin ingin menolak kelulusan ini?"
      );

      if (!yakin) return;

      setProcessingId(id);

      const res = await fetch(
        `${API_URL}/api/admin/kelulusan/${id}/verifikasi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status_verifikasi: status,
            catatan_admin,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal memverifikasi kelulusan.");
      }

      alert(result.message);
      fetchKelulusan();
    } catch (error) {
      console.error("VERIFIKASI ERROR:", error);
      alert(error.message);
    } finally {
      setProcessingId("");
    }
  };

  const handleProsesKelas = async (id) => {
    try {
      const yakin = confirm(
        "Yakin ingin memproses hasil kelulusan ini ke sistem kelas? Jika lulus, santri akan naik kelas atau lulus akhir. Jika tidak lulus, santri tetap di kelas saat ini."
      );

      if (!yakin) return;

      setProcessingId(id);

      const res = await fetch(
        `${API_URL}/api/admin/kelulusan/${id}/proses-kelas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_user_id: getAdminId(),
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal memproses kelas.");
      }

      alert(result.message);
      fetchKelulusan();
    } catch (error) {
      console.error("PROSES KELAS ERROR:", error);
      alert(error.message);
    } finally {
      setProcessingId("");
    }
  };

  const totalPending = dataKelulusan.filter(
    (item) =>
      String(item.status_verifikasi || "pending").toLowerCase() === "pending"
  ).length;

  const totalDisetujui = dataKelulusan.filter(
    (item) => item.status_verifikasi === "disetujui"
  ).length;

  const totalDitolak = dataKelulusan.filter(
    (item) => item.status_verifikasi === "ditolak"
  ).length;

  const totalBelumDiproses = dataKelulusan.filter(
    (item) =>
      String(item.status_kenaikan || "belum_diproses").toLowerCase() ===
      "belum_diproses"
  ).length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F4E8] text-emerald-950">
      <SidebarAdmin
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
              : "md:ml-[270px] md:w-[calc(100%-270px)]"
          }
        `}
      >
        <div className="mx-auto w-full max-w-none px-4 pb-10 pt-6 sm:px-5 lg:px-7">
          <div className="overflow-hidden rounded-[34px] bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 text-white shadow-xl lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                  Verifikasi Admin
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                  Verifikasi Kelulusan Santri
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-emerald-100">
                  Admin melihat data kelulusan berdasarkan kelas terlebih
                  dahulu. Klik kelas untuk melihat daftar santri di dalamnya.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchKelulusan}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-5 py-3 font-black text-emerald-950 shadow-lg transition hover:bg-yellow-300"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-emerald-600">Total Data</p>
              <h2 className="mt-2 text-3xl font-black">
                {dataKelulusan.length}
              </h2>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-yellow-600">Pending</p>
              <h2 className="mt-2 text-3xl font-black">{totalPending}</h2>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-green-600">Disetujui</p>
              <h2 className="mt-2 text-3xl font-black">{totalDisetujui}</h2>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-red-600">Ditolak</p>
              <h2 className="mt-2 text-3xl font-black">{totalDitolak}</h2>
            </div>

            <div className="rounded-[26px] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-blue-600">Belum Diproses</p>
              <h2 className="mt-2 text-3xl font-black">
                {totalBelumDiproses}
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama santri, NIS, guru, kelas, kelulusan, atau status..."
                  className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 px-12 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                <option value="semua">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-[30px] bg-white p-4 shadow-sm">
            {loading ? (
              <div className="p-8 text-center font-bold text-emerald-700">
                Mengambil data kelulusan...
              </div>
            ) : groupedByKelas.length === 0 ? (
              <div className="p-8 text-center font-bold text-emerald-700">
                Belum ada data kelulusan.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-emerald-950">
                      Daftar Kelulusan Berdasarkan Kelas
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Klik salah satu kelas untuk melihat daftar santri.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={openAllKelas}
                      className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-800"
                    >
                      Buka Semua
                    </button>

                    <button
                      type="button"
                      onClick={closeAllKelas}
                      className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                    >
                      Tutup Semua
                    </button>
                  </div>
                </div>

                {groupedByKelas.map((kelas) => {
                  const isOpen = !!openKelas[kelas.id];

                  const totalSantri = kelas.data.length;

                  const totalPendingKelas = kelas.data.filter(
                    (item) =>
                      String(
                        item.status_verifikasi || "pending"
                      ).toLowerCase() === "pending"
                  ).length;

                  const totalDisetujuiKelas = kelas.data.filter(
                    (item) => item.status_verifikasi === "disetujui"
                  ).length;

                  const totalDitolakKelas = kelas.data.filter(
                    (item) => item.status_verifikasi === "ditolak"
                  ).length;

                  const totalBelumDiprosesKelas = kelas.data.filter(
                    (item) =>
                      String(
                        item.status_kenaikan || "belum_diproses"
                      ).toLowerCase() === "belum_diproses"
                  ).length;

                  return (
                    <div
                      key={kelas.id}
                      className="overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleKelas(kelas.id)}
                        className="flex w-full flex-col gap-4 p-5 text-left transition hover:bg-emerald-50 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-xl text-white">
                            <FaSchool />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-black text-emerald-950">
                                {kelas.nama_kelas}
                              </h3>

                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                                {kelas.jenjang}
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              Total {totalSantri} santri mengajukan kelulusan
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                            Pending {totalPendingKelas}
                          </span>

                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                            Disetujui {totalDisetujuiKelas}
                          </span>

                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                            Ditolak {totalDitolakKelas}
                          </span>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                            Belum Diproses {totalBelumDiprosesKelas}
                          </span>

                          <span className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                          </span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-emerald-100 bg-white">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[1450px] border-collapse">
                              <thead>
                                <tr className="bg-emerald-800 text-left text-xs uppercase tracking-wider text-white">
                                  <th className="px-5 py-4">Santri</th>
                                  <th className="px-5 py-4">Guru/Wali</th>
                                  <th className="px-5 py-4">Kelulusan</th>
                                  <th className="px-5 py-4">Verifikasi</th>
                                  <th className="px-5 py-4">Kenaikan</th>
                                  <th className="px-5 py-4">Catatan</th>
                                  <th className="px-5 py-4">Aksi</th>
                                </tr>
                              </thead>

                              <tbody>
                                {kelas.data.map((item) => {
                                  const statusKenaikan =
                                    item.status_kenaikan || "belum_diproses";

                                  const bisaProsesKelas =
                                    item.status_verifikasi === "disetujui" &&
                                    statusKenaikan === "belum_diproses";

                                  return (
                                    <tr
                                      key={item.id}
                                      className="border-b border-emerald-50 align-top"
                                    >
                                      <td className="px-5 py-4">
                                        <p className="font-black text-emerald-950">
                                          {item.nama_santri ||
                                            item.santri?.nama ||
                                            "-"}
                                        </p>

                                        <p className="mt-1 text-xs font-semibold text-emerald-600">
                                          NIS/NISN: {item.nis || "-"}
                                        </p>
                                      </td>

                                      <td className="px-5 py-4 text-sm font-bold">
                                        {item.nama_guru || "-"}
                                      </td>

                                      <td className="px-5 py-4">
                                        <BadgeKelulusan
                                          status={item.status_kelulusan}
                                        />
                                      </td>

                                      <td className="px-5 py-4">
                                        <BadgeVerifikasi
                                          status={item.status_verifikasi}
                                        />
                                      </td>

                                      <td className="px-5 py-4">
                                        <BadgeKenaikan
                                          status={statusKenaikan}
                                        />

                                        {item.kelas_tujuan?.nama_kelas && (
                                          <p className="mt-2 text-xs font-semibold text-slate-500">
                                            Tujuan:{" "}
                                            {item.kelas_tujuan.nama_kelas}
                                          </p>
                                        )}
                                      </td>

                                      <td className="px-5 py-4">
                                        <div className="max-w-sm space-y-2 text-sm">
                                          <div className="rounded-2xl bg-emerald-50 p-3">
                                            <p className="text-xs font-black text-emerald-700">
                                              Guru
                                            </p>

                                            <p className="mt-1 text-slate-600">
                                              {item.catatan_guru || "-"}
                                            </p>
                                          </div>

                                          {item.catatan_admin && (
                                            <div className="rounded-2xl bg-yellow-50 p-3">
                                              <p className="text-xs font-black text-yellow-700">
                                                Admin
                                              </p>

                                              <p className="mt-1 text-slate-600">
                                                {item.catatan_admin}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </td>

                                      <td className="px-5 py-4">
                                        <div className="flex min-w-[220px] flex-wrap gap-2">
                                          <button
                                            type="button"
                                            disabled={processingId === item.id}
                                            onClick={() =>
                                              handleVerifikasi(
                                                item.id,
                                                "disetujui"
                                              )
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                          >
                                            <FaCheckCircle />
                                            Setujui
                                          </button>

                                          <button
                                            type="button"
                                            disabled={processingId === item.id}
                                            onClick={() =>
                                              handleVerifikasi(
                                                item.id,
                                                "ditolak"
                                              )
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                          >
                                            <FaTimesCircle />
                                            Tolak
                                          </button>

                                          {bisaProsesKelas && (
                                            <button
                                              type="button"
                                              disabled={
                                                processingId === item.id
                                              }
                                              onClick={() =>
                                                handleProsesKelas(item.id)
                                              }
                                              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                              <FaExchangeAlt />
                                              Proses Kelas
                                            </button>
                                          )}

                                          {!bisaProsesKelas &&
                                            item.status_verifikasi ===
                                              "disetujui" && (
                                              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">
                                                <FaUserGraduate />
                                                Sudah diproses
                                              </span>
                                            )}

                                          {item.status_verifikasi !==
                                            "disetujui" && (
                                            <span className="inline-flex items-center gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-xs font-black text-yellow-700">
                                              <FaHourglassHalf />
                                              Menunggu verifikasi
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}