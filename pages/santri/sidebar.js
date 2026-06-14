"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaCog,
  FaGraduationCap,
  FaBullhorn,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function SidebarSantri({
  open,
  setOpen,
  collapsed,
  setCollapsed,
  santri,
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (santri?.id) {
      fetchUnreadCount(santri);
    }
  }, [santri?.id, pathname]);

  const fetchUnreadCount = async (santriData) => {
    const { data: pemberitahuanData, error: pemberitahuanError } =
      await supabase
        .from("pemberitahuan")
        .select("*")
        .eq("status", "aktif")
        .order("created_at", { ascending: false });

    if (pemberitahuanError) {
      console.error(
        "Gagal mengambil pemberitahuan sidebar:",
        pemberitahuanError.message
      );
      setUnreadCount(0);
      return;
    }

    const targetPemberitahuan = (pemberitahuanData || []).filter((item) => {
      if (item.target_type === "semua") return true;

      if (item.target_type === "jenjang") {
        return item.target_jenjang === santriData.jenjang;
      }

      if (item.target_type === "kelas") {
        return (
          item.target_jenjang === santriData.jenjang &&
          String(item.target_kelas) === String(santriData.kelas)
        );
      }

      if (item.target_type === "santri") {
        return item.target_santri_id === santriData.id;
      }

      return false;
    });

    const { data: dibacaData, error: dibacaError } = await supabase
      .from("pemberitahuan_dibaca")
      .select("pemberitahuan_id")
      .eq("santri_id", santriData.id);

    if (dibacaError) {
      console.error("Gagal mengambil data dibaca sidebar:", dibacaError.message);
      setUnreadCount(targetPemberitahuan.length);
      return;
    }

    const readIds = (dibacaData || []).map((item) => item.pemberitahuan_id);

    const unread = targetPemberitahuan.filter(
      (item) => !readIds.includes(item.id)
    ).length;

    setUnreadCount(unread);
  };

  if (!mounted) return null;

  const menu = [
    {
      name: "Dashboard",
      href: "/santri/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Pembayaran",
      href: "/santri/pembayaran",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "Pemberitahuan",
      href: "/santri/pemberitahuan",
      icon: <FaBullhorn />,
      badge: unreadCount,
    },
      {
    name: "Nilai",
    href: "/santri/nilai",
    icon: <FaGraduationCap />,
  },
    {
      name: "Dokumen",
      href: "/santri/dokumen",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Pengaturan",
      href: "/santri/pengaturan",
      icon: <FaCog />,
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("session");

    router.push("/login");
  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#07150F]/95 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={santri?.foto || "/default-user.png"}
              alt="Foto Santri"
              className="w-10 h-10 rounded-xl object-cover border border-white/20"
            />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#07150F]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-white text-sm font-bold">
              {santri?.nama || "Santri"}
            </h1>

            <p className="text-[10px] text-green-200">
              {santri?.jenjang === "Takhassus"
                ? santri?.jenjang
                : `${santri?.jenjang || ""} ${santri?.kelas || ""}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-40 md:hidden
          bg-black/50 backdrop-blur-sm
          transition-all duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen bg-[#07150F]
          border-r border-white/10
          shadow-2xl
          flex flex-col
          transition-all duration-300 ease-in-out
          w-[280px]
          md:translate-x-0
          ${collapsed ? "md:w-[90px]" : "md:w-[280px]"}
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div
          className={`
            h-20 border-b border-white/10
            flex items-center
            ${collapsed ? "md:justify-center px-2" : "justify-between px-5"}
          `}
        >
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={santri?.foto || "/default-user.png"}
                  alt="Foto Santri"
                  className="w-11 h-11 rounded-2xl object-cover border border-white/20"
                />

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#07150F]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-white font-bold">
                  {santri?.nama || "Santri"}
                </h1>

                <p className="text-xs text-green-300">
                  {santri?.jenjang === "Takhassus"
                    ? santri?.jenjang
                    : `${santri?.jenjang || ""} ${santri?.kelas || ""}`}
                </p>
              </div>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white items-center justify-center"
            >
              <FaBars />
            </button>
          )}
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && !isMobile && (
            <p className="text-green-400 text-xs tracking-widest px-3 mb-4">
              MAIN MENU
            </p>
          )}

          <div className="space-y-2">
            {menu.map((item, i) => {
              const active = pathname === item.href;
              const hasBadge = item.badge && item.badge > 0;

              return (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    group flex items-center
                    rounded-2xl px-4 py-4
                    transition-all duration-300
                    ${
                      collapsed && !isMobile
                        ? "justify-center"
                        : "justify-between"
                    }
                    ${
                      active
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        relative text-lg
                        ${active ? "text-black" : "text-green-400"}
                      `}
                    >
                      {item.icon}

                      {hasBadge && collapsed && !isMobile && (
                        <span className="absolute -top-3 -right-3 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#07150F]">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </div>

                    {(!collapsed || isMobile) && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </div>

                  {(!collapsed || isMobile) && (
                    <div className="flex items-center gap-2">
                      {hasBadge && (
                        <span className="min-w-[26px] h-[26px] px-2 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}

                      <FaChevronRight
                        className={`
                          text-xs transition-all
                          ${
                            active
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }
                        `}
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all"
          >
            <FaSignOutAlt />

            {(!collapsed || isMobile) && "Logout"}
          </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      <div
        className={`
          fixed inset-0 z-[999]
          flex items-center justify-center
          px-4 transition-all duration-300
          ${showLogoutModal ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div
          onClick={() => setShowLogoutModal(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center text-white">
            <FaExclamationTriangle className="mx-auto text-4xl" />

            <h2 className="mt-5 text-3xl font-bold">Logout?</h2>

            <p className="mt-2 text-red-100 text-sm">
              Yakin ingin keluar dari akun santri?
            </p>
          </div>

          <div className="p-6">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="text-sm text-gray-600">
                Anda harus login kembali untuk mengakses dashboard.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}