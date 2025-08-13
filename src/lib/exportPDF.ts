// Utility to export array of objects to PDF using jsPDF and autoTable
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToPDF(data, columns, filename = 'participants.pdf') {
  const doc = new jsPDF();
  doc.autoTable({ head: [columns], body: data.map(row => columns.map(col => row[col])) });
  doc.save(filename);
}
