"use client";
import React, { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import AdminParticipantsTable from "@/components/admin/AdminParticipantsTable";


export default function AdminDashboard() {
  const [count, setCount] = useState<number|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchCount = () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      setLoading(true);
      authFetch(`${baseUrl}/api/participants/count`)
        .then((res) => res.json())
        .then((data) => {
          setCount(data.data?.total ?? 0);
          setLoading(false);
        })
        .catch(() => {
          setError("Gagal mengambil data jumlah participant");
          setLoading(false);
        });
    };
    fetchCount();
    window.addEventListener("participant-deleted", fetchCount);
    window.addEventListener("participant-added", fetchCount);
    return () => {
      window.removeEventListener("participant-deleted", fetchCount);
      window.removeEventListener("participant-added", fetchCount);
    };
  }, [mounted]);

  if (!mounted) return null;
  // Render dashboard dan tabel hanya setelah mounted (client-only)
  return (
    <div className="w-full mt-8">
      <h1 className="text-2xl font-bold mb-4 text-left">Dashboard</h1>
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 justify-start">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-start justify-center w-full">
          <span className="text-lg font-semibold text-gray-500 mb-2">Total Peserta</span>
          {loading ? (
            <span className="text-3xl font-bold text-gray-400">Loading...</span>
          ) : error ? (
            <span className="text-red-500 font-semibold">{error}</span>
          ) : (
            <span className="text-4xl font-extrabold text-blue-700">{count}</span>
          )}
        </div>
      </div>
      {mounted && <AdminParticipantsTable />}
    </div>
  );
}
