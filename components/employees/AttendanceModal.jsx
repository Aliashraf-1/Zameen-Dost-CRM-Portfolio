"use client";

import { useState, useEffect } from "react";
import { X, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import ModalPortal from "@/components/common/ModalPortal";

export default function AttendanceModal({ employee, onClose, onSave }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState("Present");
  const [checkIn, setCheckIn] = useState("09:00");
  const [checkOut, setCheckOut] = useState("17:00");
  const [lateMinutes, setLateMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [leaveDeduction, setLeaveDeduction] = useState(employee?.attendanceSettings?.leaveDeduction || 500);
  const [lateDeduction, setLateDeduction] = useState(employee?.attendanceSettings?.lateDeduction || 10);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Close on outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        date,
        status,
        checkIn: status === "Present" ? checkIn : null,
        checkOut: status === "Present" ? checkOut : null,
        lateMinutes: status === "Present" ? lateMinutes : 0,
        leaveDeduction,
        lateDeduction,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        {/* Modal - Viewport ke center mein */}
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Mark Attendance</h2>
                <p className="text-xs text-slate-500">{employee?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (e.target.value === "Present") {
                    setCheckIn("09:00");
                    setCheckOut("17:00");
                  } else {
                    setCheckIn(null);
                    setCheckOut(null);
                    setLateMinutes(0);
                  }
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
            </div>

            {/* Check In/Out */}
            {status === "Present" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Check In
                  </label>
                  <input
                    type="time"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Check Out
                  </label>
                  <input
                    type="time"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Late Minutes */}
            {status === "Present" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Late Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  value={lateMinutes}
                  onChange={(e) => setLateMinutes(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
            )}

            {/* Deduction Settings - For Leave */}
            {status === "Leave" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Leave Deduction (Rs.)
                  <span className="ml-2 text-xs text-slate-500">per day</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={leaveDeduction}
                  onChange={(e) => setLeaveDeduction(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  placeholder="Enter leave deduction amount"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Default: Rs. {employee?.attendanceSettings?.leaveDeduction || 500}
                </p>
              </div>
            )}

            {/* Deduction Settings - For Late */}
            {status === "Present" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Late Deduction (Rs. per minute)
                </label>
                <input
                  type="number"
                  min="0"
                  value={lateDeduction}
                  onChange={(e) => setLateDeduction(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  placeholder="Enter late deduction per minute"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Default: Rs. {employee?.attendanceSettings?.lateDeduction || 10}/min
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
              >
                <CheckCircle2 size={17} />
                {loading ? "Saving..." : "Save Attendance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}