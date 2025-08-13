"use client";
import React, { useState, useEffect } from "react";
import { toast } from '@/lib/toast';
import { authFetch } from "@/lib/authFetch";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon } from "@/icons";
import { FiLogOut } from "react-icons/fi";


import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";

export default function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [showConfirm, setShowConfirm] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setLogoutError("");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const res = await fetch(`${baseUrl}/api/logout`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include"
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLogoutError(data?.message || "Logout gagal. Silakan coba lagi.");
        return;
      }
      // Hapus token dari localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
      }
      toast.success("Logout berhasil!");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 700);
    } catch (err) {
      setLogoutError("Logout gagal. Silakan cek koneksi atau coba lagi.");
      console.error("Logout error:", err);
    }
  };

  const { isExpanded, setIsHovered, toggleSidebar } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [isNavbar, setIsNavbar] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch username from backend dengan authFetch agar auto refresh token
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    authFetch(`${baseUrl}/api/admin/profile`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.username) setUsername(data.data.username);
      });
    // Navbar for width < 1280px (mobile & tablet)
    const checkNavbar = () => setIsNavbar(window.innerWidth < 1280);
    checkNavbar();
    window.addEventListener("resize", checkNavbar);
    return () => window.removeEventListener("resize", checkNavbar);
  }, []);
  if (!mounted) return null;

  if (isNavbar) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 flex flex-row items-center justify-between bg-white border-b border-gray-200 shadow-sm px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base sm:text-lg text-gray-700">Admin Panel</span>
          <span className="mx-3 h-6 border-l border-gray-300"></span>
          <span className="text-xs text-gray-500 truncate hidden sm:inline">{username}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline"><ThemeToggleButton /></span>
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200
              ${isActive("/admin/dashboard") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-100 text-gray-700"}`}
          >
            <GridIcon />
            <span className="text-base font-medium">Dashboard</span>
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-2 rounded-lg shadow-md transition-colors"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-xs text-center">
              <div className="mb-4 text-lg font-semibold text-gray-800">Konfirmasi Logout</div>
              <div className="mb-6 text-gray-600">Yakin ingin logout?</div>
              {logoutError && (
                <div className="mb-4 text-red-600 text-sm font-semibold">{logoutError}</div>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Ya, Logout
                </button>
                <button
                  onClick={() => { setShowConfirm(false); setLogoutError(""); }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Desktop: sidebar
  return (
    <aside
      className={`bg-white shadow-xl border border-gray-200 rounded-2xl transition-all duration-300 flex flex-col my-6 ml-6
        ${isExpanded ? 'w-[290px]' : 'w-[90px]'}
        h-[90vh]
      `}
      style={{ minHeight: 'auto' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-2 py-6 px-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {(!mounted || isExpanded) && (
            <span className="block text-xl font-extrabold text-gray-700 tracking-tight text-center transition-all duration-300">Admin Panel</span>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-2 p-2 rounded hover:bg-gray-100 transition-colors"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M7 15l5-5-5-5" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {isExpanded && (
          <span className="text-xs text-gray-500 mt-2 truncate">User: {username}</span>
        )}
      </div>
      <nav className="mt-8 flex-1">
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 group
                ${isActive("/admin/dashboard") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-100 text-gray-700"}
                justify-start`}
            >
              <span className="text-xl">
                <GridIcon />
              </span>
              {mounted && isExpanded && (
                <span className="text-base font-medium transition-all duration-300">Dashboard</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <button
          onClick={() => setShowConfirm(true)}
          className={`w-full flex items-center gap-3 justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg shadow-md transition-colors`}
        >
          <span className="text-xl flex items-center justify-center"><FiLogOut /></span>
          {mounted && isExpanded && (
            <span className="transition-all duration-300">Logout</span>
          )}
        </button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-xs text-center">
            <div className="mb-4 text-lg font-semibold text-gray-800">Konfirmasi Logout</div>
            <div className="mb-6 text-gray-600">Yakin ingin logout?</div>
            {logoutError && (
              <div className="mb-4 text-red-600 text-sm font-semibold">{logoutError}</div>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Ya, Logout
              </button>
              <button
                onClick={() => { setShowConfirm(false); setLogoutError(""); }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
