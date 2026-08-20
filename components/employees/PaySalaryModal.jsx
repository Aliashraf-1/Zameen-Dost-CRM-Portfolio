"use client";

import { useState } from "react";
import {
  X,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";

export default function PaySalaryModal({
  employee,
  onClose,
  onPay,
}) {
  const [amount, setAmount] = useState(employee.salary || 0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const monthlySalary = Number(employee.salary || 0);
  const maxAmount = monthlySalary;

  // Check current month payment status
  const history = employee.salaryHistory || [];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentPayment = history.find((h) => h.month === currentMonth);
  
  const isFullyPaid = currentPayment?.status === "Paid" && currentPayment?.amount >= monthlySalary;
  const isPartiallyPaid = currentPayment?.status === "Partial";
  const remainingAmount = isPartiallyPaid ? monthlySalary - (currentPayment?.amount || 0) : monthlySalary;
  const paidAmount = currentPayment?.amount || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payAmount = Number(amount);
    
    if (!payAmount || payAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (payAmount > remainingAmount) {
      setError(`Amount cannot exceed remaining salary (Rs. ${remainingAmount.toLocaleString()})`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await onPay(employee.id, payAmount);
      console.log("Payment recorded:", {
        employee: employee.name,
        amount: payAmount,
        timestamp: result.timestamp,
        month: result.month,
        status: result.status,
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setError(error.message || "Failed to process payment. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Pay Salary</h2>
              <p className="text-xs text-slate-500">{employee.name}</p>
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
          {/* Employee Info */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Employee</p>
                <p className="mt-1 font-medium">{employee.name}</p>
                <p className="text-xs text-slate-500">{employee.designation}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Monthly Salary</p>
                <p className="mt-1 text-lg font-bold text-emerald-400">
                  Rs. {monthlySalary.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Current Month Status */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Current Month</span>
                <span className="text-xs font-medium text-slate-300">
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Status</span>
                {isFullyPaid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    <CheckCircle2 size={14} />
                    Fully Paid
                  </span>
                ) : isPartiallyPaid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                    <Clock size={14} />
                    Partial ({paidAmount.toLocaleString()})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                    <AlertCircle size={14} />
                    Pending
                  </span>
                )}
              </div>

              {paidAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Already Paid</span>
                  <span className="text-xs font-medium text-emerald-400">
                    Rs. {paidAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {remainingAmount > 0 && !isFullyPaid && (
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-xs text-slate-500">Remaining</span>
                  <span className="text-sm font-bold text-amber-400">
                    Rs. {remainingAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          {!isFullyPaid && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Payment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  Rs.
                </span>
                <input
                  type="number"
                  min="1"
                  max={remainingAmount}
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500"
                  placeholder="Enter amount"
                />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Max: Rs. {remainingAmount.toLocaleString()}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 size={17} />
                Salary payment recorded successfully!
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                {new Date().toLocaleString()}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            {!isFullyPaid && (
              <button
                type="submit"
                disabled={loading || success || amount === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
              >
                <Wallet size={17} />
                {loading ? "Processing..." : "Pay Salary"}
              </button>
            )}
            {isFullyPaid && (
              <button
                type="button"
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <CheckCircle2 size={17} />
                Already Paid
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}