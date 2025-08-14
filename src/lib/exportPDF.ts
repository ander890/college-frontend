// Utility to export array of objects to PDF using jsPDF and autoTable
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import autoTable from 'jspdf-autotable';

export function exportToPDF(
  data: { [key: string]: string | number | undefined }[],
  columns: string[],
  filename = 'participants.pdf'
) {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [columns],
    body: data.map((row) => columns.map((col) => {
      const val = row[col];
      return typeof val === 'string' ? val : val !== undefined ? String(val) : '';
    })),
  });
  doc.save(filename);
}
