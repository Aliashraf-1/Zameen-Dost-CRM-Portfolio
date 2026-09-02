"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export default function ReportFilters({ 
  period, 
  setPeriod, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate,
  onApply,
}) {
  const periods = [
    { label: "This Week", value: "weekly" },
    { label: "This Month", value: "monthly" },
    { label: "This Year", value: "annual" },
    { label: "Custom", value: "custom" },
  ];

  const handlePeriodChange = (value) => {
    setPeriod(value);
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (value) {
      case "weekly":
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case "monthly":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "annual":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case "custom":
        // Keep current dates
        break;
      default:
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    if (value !== "custom") {
      setEndDate(now.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-300">Period:</span>
          <div className="flex flex-wrap gap-2">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePeriodChange(p.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  period === p.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-xs text-slate-500">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ml-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ml-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        <button
          onClick={onApply}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Apply
        </button>
      </div>
    </div>
  );
}