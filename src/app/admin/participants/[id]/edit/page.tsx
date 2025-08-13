"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "@/lib/toast";
import { useRouter, useParams } from "next/navigation";

interface Participant {
  id: string;
  name: string;
  place: string;
  birth_date: string;
  kampus: string;
  angkatan: string;
  jurusan: string;
  phone: string;
}

export default function EditParticipantPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    fetch(`${baseUrl}/api/participants/${id}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((res) => res.json())
      .then((data) => {
        setParticipant(data.data || null);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal mengambil data participant");
        setLoading(false);
      });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!participant) return;
    setParticipant({ ...participant, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    console.log('PUT to', `${baseUrl}/api/participants/${id}`, participant);
    // Pastikan birth_date dalam format YYYY-MM-DD
    const payload = { ...participant };
    if (payload.birth_date) {
      // Jika ada T di string, ambil hanya tanggalnya
      payload.birth_date = payload.birth_date.slice(0, 10);
    }
    fetch(`${baseUrl}/api/participants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { data = text; }
        if (!res.ok) {
          console.error('PUT error:', res.status, data);
          const msg = (typeof data === 'object' && (data.error || data.message))
            ? (data.error || data.message)
            : `Gagal menyimpan perubahan: ${res.status}`;
          setTimeout(() => toast.error(msg), 100); // pastikan toast muncul
          setSaving(false);
          return;
        }
        // Jika berhasil, tampilkan toast dan redirect ke dashboard
        if (typeof data === 'object' && data.message) {
          toast.success(data.message);
        } else {
          toast.success('Berhasil menyimpan perubahan');
        }
        setSaving(false);
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1200);
      })
      .catch((err) => {
        setError("Gagal menyimpan perubahan: " + err);
        setSaving(false);
        console.error('PUT fetch error:', err);
      });
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!participant) return <div className="p-8">Data tidak ditemukan</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8 mt-8">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6">Edit Participant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input name="name" value={participant.name || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tempat</label>
          <input name="place" value={participant.place || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tanggal Lahir</label>
          <input name="birth_date" type="date" value={participant.birth_date ? participant.birth_date.slice(0,10) : ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Kampus</label>
          <input name="kampus" value={participant.kampus || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Angkatan</label>
          <input name="angkatan" value={participant.angkatan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Jurusan</label>
          <input name="jurusan" value={participant.jurusan || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input name="phone" value={participant.phone || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-4" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
