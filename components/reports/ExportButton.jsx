"use client";

import { Printer, FileDown } from "lucide-react";

export default function ExportButton({ onPrint, onExportPDF }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onPrint}
        className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <Printer size={16} />
        Print
      </button>
      <button
        onClick={onExportPDF}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        <FileDown size={16} />
        Export PDF
      </button>
    </div>
  );
}