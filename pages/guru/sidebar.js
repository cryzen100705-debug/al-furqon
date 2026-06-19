"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUserGraduate,
  FaBookOpen,
  FaCalendarAlt,
  FaClipboardList,
  FaSignOutAlt,
  FaChevronRight,
  FaQuran,
  FaExclamationTriangle,
  FaChalkboardTeacher,
  FaMosque,
  FaUserTie,
  FaBullhorn,
  FaPenFancy,
  FaLeaf,
} from "react-icons/fa";

export default function SidebarGuru({
  open,
  setOpen,
  collapsed,
  setCollapsed,
}) {
  const router = useRouter();
  const pathname = router.pathname;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menu = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/guru/dashboard",
        icon: <FaHome />,
        desc: "Ruang kerja guru",
      },
      {
        name: "Jadwal",
        href: "/guru/jadwal",
        icon: <FaCalendarAlt />,
        desc: "Jadwal mengajar",
      },
      {
        name: "Santri",
        href: "/guru/santri",
        icon: <FaUserGraduate />,
        desc: "Daftar santri",
      },
      {
        name: "Nilai",
        href: "/guru/nilai",
        icon: <FaClipboardList />,
        desc: "Input nilai",
      },
      {
        name: "Materi",
        href: "/guru/materi",
        icon: <FaBookOpen />,
        desc: "Bahan ajar",
      },
      {
        name: "Informasi",
        href: "/guru/pemberitahuan",
        icon: <FaBullhorn />,
        desc: "Info pesantren",
      },
    ],
    []
  );

  const isActiveMenu = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-emerald-100 bg-[#FFFDF4]/95 px-4 text-emerald-950 shadow-sm backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white">
            <FaChalkboardTeacher />
          </div>

          <div>
            <h1 className="text-sm font-black leading-tight">Guru Al-Furqon</h1>
            <p className="text-[10px] font-bold text-emerald-600">
              Academic Workspace
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden
          border-r border-emerald-100 bg-[#FFFDF4] text-emerald-950 shadow-xl
          transition-all duration-300
          ${collapsed ? "md:w-[92px]" : "md:w-[272px]"}
          w-[286px]
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-20 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="absolute -right-24 bottom-24 h-60 w-60 rounded-full bg-amber-200/60 blur-3xl" />
        </div>

        {/* BRAND */}
        <div
          className={`relative z-10 flex h-[78px] shrink-0 items-center border-b border-emerald-100 ${
            collapsed ? "justify-center px-3" : "justify-between px-4"
          }`}
        >
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white p-1 shadow-md">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="h-full w-full rounded-2xl object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[16px] font-black text-emerald-950">
                  Guru Room
                </h1>
                <p className="truncate text-[11px] font-bold text-emerald-600">
                  Pondok Pesantren Al-Furqon
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
              collapsed
                ? "bg-emerald-700 text-white"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <FaBars />
          </button>
        </div>

        {/* PROFILE */}
        <div
          className={`relative z-10 border-b border-emerald-100 px-3 py-4 ${
            collapsed ? "flex justify-center" : ""
          }`}
        >
          {!collapsed ? (
            <div className="rounded-[26px] bg-gradient-to-br from-emerald-700 to-emerald-900 p-4 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-xl text-emerald-950">
                  <FaUserTie />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black">Guru Pesantren</p>
                  <p className="truncate text-[11px] font-semibold text-emerald-100">
                    Pembimbing Santri
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <p className="text-[11px] font-bold text-emerald-50">
                  Ruang belajar aktif
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              <FaUserTie />
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="sidebar-scroll relative z-10 flex-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <div className="mb-3 flex items-center justify-between px-3">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-600">
                Menu Guru
              </p>
              <FaLeaf className="text-emerald-500" />
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
                  className={`group flex items-center rounded-[22px] px-3 py-3 transition ${
                    collapsed ? "justify-center" : "justify-between"
                  } ${
                    active
                      ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                      : "text-emerald-900 hover:bg-emerald-50"
                  }`}
                >
                  <div
                    className={`flex min-w-0 items-center ${
                      collapsed ? "justify-center" : "gap-3"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        active
                          ? "bg-white/15 text-amber-300"
                          : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200"
                      }`}
                    >
                      {item.icon}
                    </div>

                    {!collapsed && (
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">
                          {item.name}
                        </p>
                        <p
                          className={`mt-0.5 truncate text-[10.5px] font-semibold ${
                            active ? "text-emerald-100" : "text-emerald-600"
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {!collapsed && (
                    <FaChevronRight
                      className={`text-xs transition ${
                        active
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {!collapsed && (
            <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-emerald-950">
                  <FaQuran />
                </div>

                <div>
                  <p className="text-sm font-black text-emerald-950">
                    Catatan Guru
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-emerald-700">
                    Mengajar bukan hanya menyampaikan ilmu, tetapi juga
                    membimbing adab santri.
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* FOOTER */}
        <div className="relative z-10 border-t border-emerald-100 p-3">
          {!collapsed && (
            <div className="mb-3 rounded-[22px] bg-emerald-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                  <FaMosque />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-emerald-950">
                    Academic System
                  </p>
                  <p className="truncate text-[11px] text-emerald-600">
                    Guru workspace
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center justify-center gap-3 rounded-[22px] bg-red-500 py-3 font-black text-white shadow-lg transition hover:bg-red-600"
          >
            <FaSignOutAlt />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* LogoUT MODAL */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 transition ${
          showLogoutModal ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          onClick={() => setShowLogoutModal(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-lg"
        />

        <div
          className={`relative w-full max-w-md overflow-hidden rounded-[34px] bg-white shadow-2xl transition ${
            showLogoutModal ? "scale-100" : "scale-90"
          }`}
        >
          <div className="bg-red-500 p-8 text-center text-white">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/15 text-4xl">
              <FaExclamationTriangle />
            </div>

            <h2 className="mt-5 text-3xl font-black">Logout?</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm text-red-50">
              Anda yakin ingin keluar dari dashboard guru?
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="h-12 rounded-2xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="h-12 rounded-2xl bg-red-500 font-black text-white hover:bg-red-600"
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
          background: rgba(5, 150, 105, 0.35);
          border-radius: 999px;
        }
      `}</style>
    </>
  );
}