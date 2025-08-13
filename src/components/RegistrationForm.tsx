import React, { useState, useRef, useEffect } from 'react';
import Form from '@/components/form/Form';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import DatePicker from '@/components/form/date-picker';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/ui/modal';


export default function RegistrationForm() {
  const [form, setForm] = useState({
    name: '',
    place: '',
    birth_date: '',
    kampus: '',
    jurusan: '',
    angkatan: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal(false);
  const [modalMessage, setModalMessage] = useState('');
  const [countdown, setCountdown] = useState(10);
  const modalTimeout = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    }
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for date picker (flatpickr returns date string in YYYY-MM-DD)
  const handleDateChange = (selectedDates: Date[], dateStr: string) => {
    setForm((prev) => ({ ...prev, birth_date: dateStr }));
  };

  // const handlePhoneChange = (val: string) => {
  //   setForm({ ...form, phone: val });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal mendaftar.');
      setModalMessage(result.message || 'Pendaftaran berhasil!');
      openModal();
      // Dispatch event for admin dashboard/table refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('participant-added'));
      }
      if (modalTimeout.current) clearTimeout(modalTimeout.current);
      modalTimeout.current = setTimeout(() => {
        closeModal();
        setForm({ name: '', place: '', birth_date: '', kampus: '', jurusan: '', angkatan: '', phone: '' });
      }, 10000);
    } catch (err: unknown) {
      if (err instanceof Error) setModalMessage(err.message);
      else setModalMessage('Terjadi kesalahan.');
      openModal();
      if (modalTimeout.current) clearTimeout(modalTimeout.current);
      modalTimeout.current = setTimeout(() => {
        closeModal();
        setForm({ name: '', place: '', birth_date: '', kampus: '', jurusan: '', angkatan: '', phone: '' });
      }, 10000);
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal is closed manually
  const handleModalClose = () => {
    closeModal();
    setForm({ name: '', place: '', birth_date: '', kampus: '', jurusan: '', angkatan: '', phone: '' });
  };

  return (
    <div className="flex-1 p-8 flex flex-col justify-center">
      <h3 className="text-xl font-semibold mb-6 text-center">Pendaftaran</h3>
  <Form onSubmit={handleSubmit} className="flex flex-col gap-4 text-lg md:text-xl">
        <div>
          <Label htmlFor="name" className="text-lg md:text-xl font-semibold">
            Nama Lengkap
            <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span>
          </Label>
          <Input name="name" id="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="place" className="text-lg md:text-xl font-semibold">Tempat Lahir <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
            <Input name="place" id="place" placeholder="Tempat Lahir" value={form.place} onChange={handleChange} />
          </div>
          <div className="flex-1">
            <Label htmlFor="birth_date" className="text-lg md:text-xl font-semibold">Tanggal Lahir <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
            <DatePicker
              id="birth_date"
              placeholder="YYYY-MM-DD"
              value={form.birth_date}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="kampus" className="text-lg md:text-xl font-semibold">Kampus <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
          <Input name="kampus" id="kampus" placeholder="Nama Kampus" value={form.kampus} onChange={handleChange} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="jurusan" className="text-lg md:text-xl font-semibold">Jurusan <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
            <Input name="jurusan" id="jurusan" placeholder="Jurusan" value={form.jurusan} onChange={handleChange} />
          </div>
          <div className="flex-1">
            <Label htmlFor="angkatan" className="text-lg md:text-xl font-semibold">Angkatan <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
            <Input name="angkatan" id="angkatan" placeholder="Angkatan" value={form.angkatan} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label htmlFor="phone" className="text-lg md:text-xl font-semibold">
            Nomor HP
            <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span>
          </Label>
          <Input name="phone" id="phone" type="text" placeholder="Nomor HP" value={form.phone} onChange={handleChange} />
        </div>
        <button type="submit" className="py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2 transition-colors" disabled={loading}>
          {loading ? 'Mengirim...' : 'Daftar Sekarang'}
        </button>
        <div className="text-sm md:text-base text-red-500 mt-2">* wajib diisi</div>
  <Modal isOpen={isOpen} onClose={handleModalClose} className="w-[90vw] max-w-[500px] md:w-1/2">
          <div className="p-6 text-center">
            <div className="text-2xl font-bold mb-2">{modalMessage}</div>
            <div className="text-gray-500 text-sm">Pop up ini akan tertutup otomatis dalam <span className="font-bold text-blue-600">{countdown}</span> detik.</div>
          </div>
        </Modal>
      </Form>
    </div>
  );
}
