"use client";

import { useMemo, useState, useEffect } from "react";
import {
  X,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ModalPortal from "@/components/common/ModalPortal";
import { useBuildings } from "@/context/BuildingContext";
import { useRevenue } from "@/context/RevenueContext";

export default function PayRentModal({
  buildingId,
  room,
  onClose,
}) {
  const { payRent } = useBuildings();
  let addIncome;
  try {
    const revenue = useRevenue();
    addIncome = revenue.addIncome;
  } catch (error) {
    addIncome = (data) => console.log("Income would be added:", data);
    console.warn("RevenueProvider not available. Revenue won't be tracked.");
  }

  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [remarks, setRemarks] = useState("");

  const monthlyRent = Number(room?.monthlyRent || 0);
  const amount = useMemo(
    () => monthlyRent * Number(months || 0),
    [monthlyRent, months]
  );

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

    if (!months || months < 1) {
      setError("Please select at least 1 month.");
      return;
    }

    if (!remarks.trim()) {
      setError("Please add remarks for this payment.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const now = new Date().toISOString();
      const transactionId = `rent-${Date.now()}`;

      // Pay rent in building context
      const result = payRent(buildingId, room.id, months, remarks.trim());

      // Add income to revenue
      addIncome({
        id: transactionId,
        type: "Rent",
        category: "Monthly Rent",
        description: `Rent payment from ${room?.tenant?.name} - Unit ${room?.unitNo}`,
        amount: amount,
        source: "Rent",
        buildingId: buildingId,
        unitId: room.id,
        unitNo: room?.unitNo,
        tenantName: room?.tenant?.name,
        months: months,
        remarks: remarks.trim(),
        status: "Received",
        receivedAt: now,
        createdAt: now,
      });

      console.log("Rent paid:", {
        id: transactionId,
        buildingId,
        unitId: room.id,
        unitNo: room?.unitNo,
        tenantName: room?.tenant?.name,
        amount,
        months,
        remarks: remarks.trim(),
        paidAt: now,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setError(error.message || "Unable to process rent payment.");
      console.error("Pay rent error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return null;
  }

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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Wallet size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Pay Rent</h2>
                <p className="text-xs text-slate-500">
                  {room.unitNo} • {room.type}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5">
            {/* Customer */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="mt-1 font-medium">{room.tenant?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{room.tenant?.phone || "No phone"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Building</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">Building #{buildingId}</p>
                </div>
              </div>
            </div>

            {/* Unit Info */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Unit</span>
                <span className="text-sm font-medium text-slate-200">{room.unitNo}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-slate-400">Type</span>
                <span className="text-sm text-slate-300">{room.type}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-slate-400">Purpose</span>
                <span className="text-sm text-slate-300">{room.purpose || "N/A"}</span>
              </div>
            </div>

            {/* Monthly Rent */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Monthly Rent
              </label>
              <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200">
                Rs. {monthlyRent.toLocaleString()}
              </div>
            </div>

            {/* Months */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Months to Pay
              </label>
              <input
                type="number"
                min="1"
                value={months}
                onChange={(e) => {
                  setMonths(Number(e.target.value));
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Number of months to pay rent for
              </p>
            </div>

            {/* Remarks */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                Remarks *
              </label>
              <textarea
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  setError("");
                }}
                placeholder="Add remarks about this rent payment..."
                rows="3"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            {/* Total */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Payment</span>
                <span className="text-xl font-bold text-emerald-400">
                  Rs. {amount.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {months} month{months > 1 ? 's' : ''} × Rs. {monthlyRent.toLocaleString()}
              </p>
            </div>

            <p className="text-xs text-slate-600">
              Payment date and time will be recorded automatically.
            </p>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle2 size={17} />
                  Rent payment recorded successfully!
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
              >
                <Wallet size={17} />
                {loading ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
