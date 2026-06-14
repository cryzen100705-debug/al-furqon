"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaLayerGroup } from "react-icons/fa";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaBullhorn,
  FaMoneyBillWave,
  FaClipboardList,
  FaSignOutAlt,
  FaChevronRight,
  FaExclamationTriangle,
  FaMosque,
  FaQuran,
  FaUserShield,
  FaGem,
  FaChartBar,
  FaChalkboardTeacher,
} from "react-icons/fa";

export default function SidebarAdmin({
  open,
  setOpen,
  collapsed,
  setCollapsed,
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menu = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: <FaHome />,
        desc: "Ringkasan sistem",
      },
      {
        name: "Santri",
        href: "/admin/santri",
        icon: <FaUsers />,
        desc: "Data santri aktif",
      },
      {
  name: "Kelas",
  href: "/admin/kelas",
  icon: <FaLayerGroup />,
  desc: "Data kelas & jadwal",
},
      {
        name: "Data Guru",
        href: "/admin/guru",
        icon: <FaChalkboardTeacher />,
        desc: "Kelola akun guru",
      },
      {
        name: "Pembayaran",
        href: "/admin/pembayaran",
        icon: <FaMoneyBillWave />,
        desc: "Tagihan & transaksi",
      },
      {
        name: "Laporan",
        href: "/admin/laporan",
        icon: <FaChartBar />,
        desc: "Rekap data sistem",
      },
      {
        name: "Verifikasi",
        href: "/admin/verifikasi",
        icon: <FaClipboardList />,
        desc: "Pendaftaran baru",
      },
      {
        name: "Pemberitahuan",
        href: "/admin/pemberitahuan",
        icon: <FaBullhorn />,
        desc: "Informasi santri",
      },
    ],
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isActiveMenu = (href) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#062417]/95 px-4 text-white shadow-xl backdrop-blur-2xl md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-lg">
            <img
              src="/logo.png"
              alt="Logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="h-full w-full rounded-xl object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-black leading-tight">
              Admin Al-Furqon
            </h1>

            <p className="truncate text-[10px] font-semibold text-green-200">
              Sistem Pesantren
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-lg transition hover:bg-white/20 active:scale-95"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-300 md:hidden
          ${open ? "visible opacity-100" : "invisible opacity-0"}
        `}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden
          border-r border-white/10 bg-[#031A13] text-white shadow-2xl shadow-black/30
          transition-all duration-300
          ${collapsed ? "md:w-[92px]" : "md:w-[270px]"}
          w-[285px]
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* BACKGROUND ORNAMENT */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#075236] via-[#062417] to-[#010A07]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.045]" />

          <div className="absolute -left-24 top-16 h-52 w-52 rounded-full bg-green-400/20 blur-3xl" />
          <div className="absolute -right-24 bottom-24 h-56 w-56 rounded-full bg-yellow-300/15 blur-3xl" />

          <div className="absolute left-1/2 top-24 h-32 w-32 -translate-x-1/2 rounded-full border border-yellow-300/10" />
          <div className="absolute left-1/2 top-32 h-20 w-20 -translate-x-1/2 rounded-full border border-white/10" />
        </div>

        {/* BRAND */}
        <div
          className={`
            relative z-10 flex h-[74px] shrink-0 items-center border-b border-white/10
            ${collapsed ? "justify-center px-3" : "justify-between px-3.5"}
          `}
        >
          {!collapsed && (
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-white p-1 shadow-xl shadow-black/20">
                <img
                  src="/logo.png"
                  alt="Logo"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-full w-full rounded-2xl object-contain"
                />
              </div>

              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="truncate text-[15px] font-black leading-tight text-white">
                  Admin Panel
                </h1>

                <p className="truncate text-[10.5px] font-semibold text-green-200">
                  Pondok Pesantren Al-Furqon
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`
              flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl
              border border-white/10 shadow-lg transition-all duration-300
              ${
                collapsed
                  ? "bg-yellow-400 text-green-950 hover:bg-yellow-300"
                  : "bg-white/10 text-white hover:bg-white/20"
              }
            `}
            title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
          >
            <FaBars />
          </button>
        </div>

        {/* PROFILE MINI */}
        <div
          className={`
            relative z-10 shrink-0 border-b border-white/10 px-3 py-3
            ${collapsed ? "flex justify-center" : ""}
          `}
        >
          {!collapsed ? (
            <div className="overflow-hidden rounded-[22px] border border-white/10 bg-white/10 p-3 shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-lg text-green-950 shadow-lg">
                  <FaUserShield />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">
                    Administrator
                  </p>

                  <p className="truncate text-[11px] font-semibold text-green-200">
                    Pengelola Sistem
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-black/20 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />

                <p className="text-[11px] font-semibold text-green-100">
                  Sistem aktif
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-lg text-green-950 shadow-lg">
              <FaUserShield />
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="sidebar-scroll relative z-10 flex-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <div className="mb-3 flex items-center justify-between px-3">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-green-200">
                Main Menu
              </p>

              <FaGem className="text-[11px] text-yellow-300" />
            </div>
          )}

          <div className="space-y-2">
            {menu.map((item) => {
              const active = isActiveMenu(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  title={collapsed ? item.name : ""}
                  className={`
                    group relative flex items-center overflow-hidden rounded-[20px]
                    px-3 py-3 transition-all duration-300
                    ${collapsed ? "justify-center" : "justify-between"}
                    ${
                      active
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-950 shadow-lg shadow-yellow-950/20"
                        : "text-green-50/80 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-green-950/50" />
                  )}

                  <div
                    className={`
                      flex min-w-0 items-center
                      ${collapsed ? "justify-center" : "gap-3"}
                    `}
                  >
                    <div
                      className={`
                        flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-base transition
                        ${
                          active
                            ? "bg-green-950/10 text-green-950"
                            : "bg-white/5 text-green-300 group-hover:bg-white/10 group-hover:text-yellow-300"
                        }
                      `}
                    >
                      {item.icon}
                    </div>

                    {!collapsed && (
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">
                          {item.name}
                        </p>

                        <p
                          className={`
                            mt-0.5 truncate text-[10.5px] font-semibold
                            ${
                              active
                                ? "text-green-950/70"
                                : "text-green-100/45 group-hover:text-green-100/70"
                            }
                          `}
                        >
                          {item.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {!collapsed && (
                    <FaChevronRight
                      className={`
                        text-xs transition-all duration-300
                        ${
                          active
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }
                      `}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {!collapsed && (
            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
                  <FaQuran />
                </div>

                <div>
                  <p className="text-sm font-black text-white">Bismillah</p>

                  <p className="mt-1 text-[11px] leading-relaxed text-green-50/70">
                    Kelola data pesantren dengan amanah, rapi, dan terarah.
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* FOOTER */}
        <div className="relative z-10 shrink-0 border-t border-white/10 p-3">
          {!collapsed && (
            <div className="mb-3 rounded-[20px] border border-white/10 bg-black/20 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-400/15 text-green-300">
                  <FaMosque />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-white">
                    Al-Furqon System
                  </p>

                  <p className="truncate text-[11px] text-green-100/60">
                    Admin management
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className={`
              flex w-full items-center justify-center gap-3 rounded-[20px]
              bg-gradient-to-r from-red-500 to-red-600 py-3
              font-black text-white shadow-lg shadow-red-950/20
              transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]
              ${collapsed ? "px-0" : "px-4"}
            `}
            title={collapsed ? "Logout" : ""}
          >
            <FaSignOutAlt />

            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      <div
        className={`
          fixed inset-0 z-[9999] flex items-center justify-center px-4
          transition-all duration-300
          ${showLogoutModal ? "visible opacity-100" : "invisible opacity-0"}
        `}
      >
        <div
          onClick={() => setShowLogoutModal(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        />

        <div
          className={`
            relative w-full max-w-md overflow-hidden rounded-[34px]
            bg-white shadow-2xl transition-all duration-300
            ${
              showLogoutModal
                ? "translate-y-0 scale-100"
                : "translate-y-5 scale-90"
            }
          `}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4C0519] via-red-600 to-red-500 p-8 text-center text-white">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.08]" />
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-300/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] border border-white/20 bg-white/15 text-4xl shadow-xl backdrop-blur-md">
                <FaExclamationTriangle />
              </div>

              <h2 className="mt-5 text-3xl font-black">Logout?</h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-red-50/90">
                Anda yakin ingin keluar dari dashboard admin pesantren?
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-3xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm leading-relaxed text-slate-600">
                Setelah logout, Anda harus login kembali untuk mengakses sistem
                admin Al-Furqon.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="h-12 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="h-12 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(250, 204, 21, 0.35);
          border-radius: 999px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(250, 204, 21, 0.65);
        }
      `}</style>
    </>
  );
}