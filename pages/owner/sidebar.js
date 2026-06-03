"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaChartBar,
  FaHistory,
  FaSignOutAlt,
  FaChevronRight,
  FaCrown,
  FaMosque,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function SidebarOwner({
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
        href: "/owner/dashboard",
        icon: <FaHome />,
        desc: "Ringkasan utama",
      },
      {
        name: "Keuangan",
        href: "/owner/keuangan",
        icon: <FaMoneyBillWave />,
        desc: "Monitoring pembayaran",
      },
      {
        name: "Santri",
        href: "/owner/santri",
        icon: <FaUsers />,
        desc: "Monitoring santri",
      },
      {
        name: "Laporan",
        href: "/owner/laporan",
        icon: <FaChartBar />,
        desc: "Rekap data",
      },
      {
        name: "Aktivitas",
        href: "/owner/aktivitas",
        icon: <FaHistory />,
        desc: "Aktivitas admin",
      },
    ],
    []
  );

  const isActive = (href) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.push("/login");
  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#1A1204]/95 px-4 text-white shadow-xl backdrop-blur-2xl md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-lg">
            <FaCrown />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-black leading-tight">
              Owner Al-Furqon
            </h1>

            <p className="truncate text-[10px] font-semibold text-yellow-200">
              Executive Monitoring
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
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
          border-r border-white/10 bg-[#1A1204] text-white shadow-2xl shadow-black/30
          transition-all duration-300

          ${collapsed ? "md:w-[92px]" : "md:w-[270px]"}
          w-[285px]

          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4A3410] via-[#1A1204] to-[#050302]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.05]" />
          <div className="absolute -left-24 top-16 h-52 w-52 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="absolute -right-24 bottom-24 h-56 w-56 rounded-full bg-green-400/10 blur-3xl" />
        </div>

        {/* ================= BRAND / TOP SIDEBAR ================= */}
<div
  className={`
    relative z-10 flex h-[74px] shrink-0 items-center border-b border-white/10
    ${collapsed ? "justify-center px-3" : "justify-between px-3.5"}
  `}
>
  {/* LOGO + TEXT HANYA MUNCUL SAAT SIDEBAR TERBUKA */}
  {!collapsed && (
    <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-white p-1 shadow-xl shadow-black/20">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-full w-full rounded-2xl object-contain"
        />
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <h1 className="truncate text-[15px] font-black leading-tight text-white">
          Owner Panel
        </h1>

        <p className="truncate text-[10.5px] font-semibold text-yellow-200">
          Pondok Pesantren Al-Furqon
        </p>
      </div>
    </div>
  )}

  {/* TOMBOL HAMBURGER */}
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

        {/* PROFILE */}
        <div
          className={`
            relative z-10 shrink-0 border-b border-white/10 px-3 py-3
            ${collapsed ? "flex justify-center" : ""}
          `}
        >
          {!collapsed ? (
            <div className="overflow-hidden rounded-[22px] border border-white/10 bg-white/10 p-3 shadow-lg backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-lg">
                  <FaCrown />
                </div>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-black text-white">
                    Owner
                  </p>

                  <p className="truncate text-[11px] font-semibold text-yellow-200">
                    Executive Access
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-black/20 px-3 py-2">
                <p className="truncate text-[11px] font-semibold text-yellow-100">
                  Monitoring semua data pesantren
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-green-950 shadow-lg">
              <FaCrown />
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="owner-sidebar-scroll relative z-10 flex-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300">
              Owner Menu
            </p>
          )}

          <div className="space-y-2">
            {menu.map((item) => {
              const active = isActive(item.href);

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
                        : "text-yellow-50/80 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
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
                            : "bg-white/5 text-yellow-300 group-hover:bg-white/10"
                        }
                      `}
                    >
                      {item.icon}
                    </div>

                    {!collapsed && (
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="truncate text-sm font-black">
                          {item.name}
                        </p>

                        <p
                          className={`
                            mt-0.5 truncate text-[10.5px] font-semibold
                            ${
                              active
                                ? "text-green-950/70"
                                : "text-yellow-100/45"
                            }
                          `}
                        >
                          {item.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {!collapsed && (
                    <FaChevronRight className="shrink-0 text-xs opacity-0 transition group-hover:opacity-100" />
                  )}
                </Link>
              );
            })}
          </div>

          {!collapsed && (
            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-green-950">
                  <FaMosque />
                </div>

                <p className="text-[11px] leading-relaxed text-yellow-50/75">
                  Owner memantau perkembangan pesantren secara menyeluruh.
                </p>
              </div>
            </div>
          )}
        </nav>

        {/* FOOTER */}
        <div className="relative z-10 shrink-0 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className={`
              flex w-full items-center justify-center gap-3 rounded-[20px]
              bg-gradient-to-r from-red-500 to-red-600 py-3
              font-black text-white shadow-lg transition hover:-translate-y-0.5
              ${collapsed ? "px-0" : "px-4"}
            `}
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

            <div className="relative z-10">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] border border-white/20 bg-white/15 text-4xl shadow-xl backdrop-blur-md">
                <FaExclamationTriangle />
              </div>

              <h2 className="mt-5 text-3xl font-black">Logout?</h2>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-red-50/90">
                Anda yakin ingin keluar dari dashboard owner?
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-3xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm leading-relaxed text-slate-600">
                Setelah logout, Anda harus login kembali untuk mengakses sistem
                owner Al-Furqon.
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
        .owner-sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .owner-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .owner-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(250, 204, 21, 0.35);
          border-radius: 999px;
        }
      `}</style>
    </>
  );
}