import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function formatTanggalIndo(tgl) {
  if (!tgl) return '';
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const [year, month, day] = tgl.split('-');
  if (!year || !month || !day) return tgl;
  return `${parseInt(day)} ${bulan[parseInt(month) - 1]} ${year}`;
}

export function exportParticipantsToExcel(participants, filename = 'Daftar Peserta Welcoming College 2025.xlsx') {
  if (!participants || participants.length === 0) return;
  // Tentukan urutan kolom yang diinginkan
  const columns = [
    'Nama',
    'Email',
    'Jenis Kelamin',
    'Tanggal Lahir',
    'Asal Sekolah',
    'No HP',
    'Alamat',
    // Tambahkan kolom lain jika ada
  ];
  // Format data dan tanggal lahir
  const data = participants.map(p => {
    const row = {};
    columns.forEach(col => {
      if (col === 'Tanggal Lahir') {
        row[col] = formatTanggalIndo(p['Tanggal Lahir'] || p['birth_date']);
      } else {
        row[col] = p[col] || p[col.toLowerCase().replace(/ /g, '_')] || '';
      }
    });
    return row;
  });
  // Buat worksheet dan tambahkan header
  const ws = XLSX.utils.json_to_sheet(data, { header: columns });
  // Auto width kolom
  const colWidths = columns.map(col => {
    const maxLen = Math.max(
      col.length,
      ...data.map(row => (row[col] ? String(row[col]).length : 0))
    );
    return { wch: maxLen + 2 };
  });
  ws['!cols'] = colWidths;
  // Buat workbook dan simpan file
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar Peserta');
  XLSX.writeFile(wb, filename);
}

export function exportParticipantsToPDF(participants, columns, filename = 'Daftar Peserta Welcoming College 2025.pdf') {
  const doc = new jsPDF({ orientation: 'landscape' });
  // Judul dan nama tabel hanya di halaman pertama
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text('Daftar Peserta Youth Welcoming College 2025', pageWidth / 2, 18, { align: 'center' });
  // Format tanggal lahir sebelum export
  const data = participants.map(p => ({
    ...p,
    'Tanggal Lahir': formatTanggalIndo(p['Tanggal Lahir'] || p['birth_date'])
  }));
  autoTable(doc, {
    startY: 36,
    head: [columns],
    body: data.map(row => columns.map(col => row[col])),
    styles: {
      lineWidth: 0.5,
      lineColor: [44, 62, 80],
      cellPadding: 3,
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
      cellWidth: 'auto',
      minCellHeight: 8,
      fillColor: [255, 255, 255],
      textColor: [44, 62, 80],
    },
    headStyles: {
      fillColor: [236, 240, 241],
      textColor: [44, 62, 80],
      fontStyle: 'bold',
      lineWidth: 0.5,
    },
    tableLineWidth: 0.5,
    tableLineColor: [44, 62, 80],
    theme: 'grid',
    didDrawPage: () => {
      // Hanya halaman pertama, judul besar
      if (doc.getCurrentPageInfo().pageNumber === 1) {
        doc.setFontSize(18);
        doc.text('Daftar Peserta Youth Welcoming College 2025', pageWidth / 2, 18, { align: 'center' });
      }
    },
  });
  // Footer hanya di halaman terakhir
  const pageCount = doc.getNumberOfPages();
  doc.setPage(pageCount);
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(11);
  doc.text('Presented by Youth Multiply', pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.save(filename);
}
