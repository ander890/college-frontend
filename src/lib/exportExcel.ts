// Utility to export array of objects to Excel using xlsx
import * as XLSX from 'xlsx';

export function exportToExcel(data: { [key: string]: string | number | undefined }[], filename = 'participants.xlsx') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Participants');
  XLSX.writeFile(wb, filename);
}
