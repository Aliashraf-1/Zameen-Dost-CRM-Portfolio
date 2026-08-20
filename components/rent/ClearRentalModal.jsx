"use client";

import { useMemo, useState } from "react";
import {
  X,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";

import { useBuildings } from "@/context/BuildingContext";
import { useRevenue } from "@/context/RevenueContext";

export default function ClearRentalModal({
  buildingId,
  room,
  onClose,
}) {
  const { clearRental } = useBuildings();
  const { addIncome, addExpense } = useRevenue();

  const securityHeld = Number(
    room?.initialPayment?.securityReceived || 0
  );

  const [returnAmount, setReturnAmount] = useState(securityHeld);
  const [forfeitAmount, setForfeitAmount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => Number(returnAmount || 0) + Number(forfeitAmount || 0),
    [returnAmount, forfeitAmount]
  );

  const handleReturnChange = (e) => {
    const value = Number(e.target.value || 0);
    setReturnAmount(value);
    setForfeitAmount(Math.max(securityHeld - value, 0));
    setError("");
  };

  const handleForfeitChange = (e) => {
    const value = Number(e.target.value || 0);
    setForfeitAmount(value);
    setReturnAmount(Math.max(securityHeld - value, 0));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (total !== securityHeld) {
      setError(
        "Return and forfeit amounts must equal the security held."
      );
      return;
    }

    if (!remarks.trim()) {
      setError("Please add remarks for this transaction.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const now = new Date().toISOString();
      const transactionId = `clear-${Date.now()}`;

      // 1. Clear rental in building context
      const result = clearRental(buildingId, room.id, {
        returnAmount,
        forfeitAmount,
        remarks: remarks.trim(),
        clearedAt: now,
      });

      // 2. Add forfeited amount as income in revenue
      if (forfeitAmount > 0) {
        addIncome({
          id: `${transactionId}-forfeit`,
          type: "Security Forfeited",
          category: "Security Income",
          description: `Security forfeited from ${room?.tenant?.name} - Unit ${room?.unitNo}`,
          amount: forfeitAmount,
          source: "Security",
          buildingId: buildingId,
          unitId: room.id,
          unitNo: room?.unitNo,
          tenantName: room?.tenant?.name,
          remarks: remarks.trim(),
          status: "Received",
          receivedAt: now,
          createdAt: now,
        });
      }

      // 3. Add returned amount as expense in revenue (security returned)
      if (returnAmount > 0) {
        addExpense({
          id: `${transactionId}-return`,
          type: "Security Returned",
          category: "Security Refund",
          description: `Security returned to ${room?.tenant?.name} - Unit ${room?.unitNo}`,
          amount: returnAmount,
          source: "Security",
          buildingId: buildingId,
          unitId: room.id,
          unitNo: room?.unitNo,
          tenantName: room?.tenant?.name,
          remarks: remarks.trim(),
          status: "Paid",
          paidAt: now,
          createdAt: now,
        });
      }

      // 4. Add transaction record
      const transaction = {
        id: transactionId,
        type: "Rental Clearance",
        buildingId: buildingId,
        unitId: room.id,
        unitNo: room?.unitNo,
        tenantName: room?.tenant?.name,
        securityHeld: securityHeld,
        returnAmount: returnAmount,
        forfeitAmount: forfeitAmount,
        remarks: remarks.trim(),
        clearedAt: now,
        createdAt: now,
      };

      console.log("Rental Cleared:", transaction);

      onClose();
    } catch (error) {
      setError(error.message || "Unable to clear rental.");
      console.error("Clear rental error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header - Fixed */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Clear Rental</h2>
              <p className="text-xs text-slate-500">Unit {room?.unitNo}</p>
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

        <form onSubmit={handleSubmit} className="p-5">
          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Customer */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs text-slate-500">Customer</p>
                <p className="mt-1 font-medium">{room?.tenant?.name}</p>
                <p className="text-xs text-slate-500">
                  {room?.unitNo} • {room?.type}
                </p>
              </div>

              {/* Security Held */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Security Held</span>
                  <span className="text-xl font-bold text-emerald-400">
                    Rs. {securityHeld.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Return Amount */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <RotateCcw size={15} />
                  Security Returned
                </label>
                <input
                  type="number"
                  min="0"
                  max={securityHeld}
                  value={returnAmount}
                  onChange={handleReturnChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-slate-600">
                  Amount to return to customer
                </p>
              </div>

              {/* Forfeit Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Security Forfeited
                </label>
                <input
                  type="number"
                  min="0"
                  max={securityHeld}
                  value={forfeitAmount}
                  onChange={handleForfeitChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-amber-400">
                  Forfeited amount will be added to revenue
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Remarks */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <FileText size={15} />
                  Remarks *
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    setError("");
                  }}
                  placeholder="Add remarks about the rental clearance..."
                  rows="4"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-slate-600">
                  e.g., Security returned due to rental ending, damage deductions, etc.
                </p>
              </div>

              {/* Validation */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Settlement</span>
                  <span
                    className={`text-sm font-semibold ${
                      total === securityHeld ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    Rs. {total.toLocaleString()} / {securityHeld.toLocaleString()}
                  </span>
                </div>
                {total === securityHeld && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 size={14} />
                    Settlement amount matches security held
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons - Full Width */}
          <div className="mt-6 flex gap-3 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || total !== securityHeld}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
            >
              <CheckCircle2 size={17} />
              {loading ? "Clearing..." : "Clear Rental"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}