"use client";

import { useState, useEffect, useMemo } from "react";
import {
  X,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Briefcase,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";
import ModalPortal from "@/components/common/ModalPortal";

export default function PaySalaryModal({
  employee,
  onClose,
  onPay,
}) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [applyDeductions, setApplyDeductions] = useState(true);

  const monthlySalary = Number(employee.salary || 0);

  // ✅ Calculate deductions for current month with 30 minutes grace time
  const deductions = useMemo(() => {
    const attendance = employee.attendance || [];
    const tasks = employee.tasks || [];
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Filter current month attendance
    const currentMonthAttendance = attendance.filter(a => a.date?.startsWith(currentMonth));
    
    // Count leaves (excluding Fridays)
    const leaves = currentMonthAttendance.filter(a => a.status === "Leave").length;
    
    // Count absent (excluding Fridays)
    const absent = currentMonthAttendance.filter(a => a.status === "Absent").length;
    
    // ✅ Calculate late minutes with 30 minutes grace time
    const totalLateMinutes = currentMonthAttendance.reduce((sum, a) => {
      const lateMins = a.lateMinutes || 0;
      // ✅ Grace time: 30 minutes free
      const chargeableLate = Math.max(lateMins - 30, 0);
      return sum + chargeableLate;
    }, 0);
    
    // Count failed tasks
    const failedTasks = tasks.filter(t => t.status === "Failed").length;
    
    // Get deduction rates
    const leaveDeduction = employee.attendanceSettings?.leaveDeduction || 500;
    const lateDeduction = employee.attendanceSettings?.lateDeduction || 10;
    const taskFailureDeduction = employee.attendanceSettings?.taskFailureDeduction || 1000;
    
    // Get failed tasks with custom deductions
    const failedTasksWithDeduction = tasks.filter(t => t.status === "Failed" && t.failureDeduction);
    const customTaskDeductions = failedTasksWithDeduction.reduce(
      (sum, t) => sum + (t.failureDeduction || 0), 0
    );
    
    const totalTaskDeduction = customTaskDeductions > 0 ? customTaskDeductions : (failedTasks * taskFailureDeduction);
    
    // ✅ Count leaves (excluding Fridays) - 1 free leave per month allowed
    const chargeableLeaves = Math.max(leaves - 1, 0); // 1 leave free per month
    
    const totalDeduction = (chargeableLeaves * leaveDeduction) + (totalLateMinutes * lateDeduction) + totalTaskDeduction;
    
    // ✅ Calculate grace time used (free minutes)
    const totalLateMinutesWithGrace = currentMonthAttendance.reduce((sum, a) => sum + (a.lateMinutes || 0), 0);
    const freeLateMinutes = Math.min(totalLateMinutesWithGrace, 30 * currentMonthAttendance.filter(a => a.lateMinutes > 0).length || 0);
    const chargeableLateMinutes = Math.max(totalLateMinutesWithGrace - freeLateMinutes, 0);
    
    return {
      leaves,
      chargeableLeaves,
      freeLeaves: Math.min(leaves, 1),
      absent,
      totalLateMinutes: chargeableLateMinutes,
      freeLateMinutes,
      failedTasks,
      leaveDeduction,
      lateDeduction,
      taskFailureDeduction,
      totalDeduction,
      leaveAmount: chargeableLeaves * leaveDeduction,
      lateAmount: chargeableLateMinutes * lateDeduction,
      taskAmount: totalTaskDeduction,
      customTaskDeductions: failedTasksWithDeduction,
    };
  }, [employee]);

  // ✅ Final amount after deductions
  const finalAmount = applyDeductions ? Math.max(monthlySalary - deductions.totalDeduction, 0) : monthlySalary;

  // ✅ Set initial amount to final amount
  useEffect(() => {
    setAmount(finalAmount);
  }, [finalAmount]);

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

    const payAmount = Number(amount);
    
    if (!payAmount || payAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (payAmount > monthlySalary) {
      setError(`Amount cannot exceed monthly salary (Rs. ${monthlySalary.toLocaleString()})`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await onPay(employee.id, payAmount, applyDeductions ? deductions : null);
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

  // Check current month payment status
  const history = employee.salaryHistory || [];
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentPayment = history.find((h) => h.month === currentMonth);
  
  const isFullyPaid = currentPayment?.status === "Paid" && currentPayment?.amount >= monthlySalary;
  const isPartiallyPaid = currentPayment?.status === "Partial";
  const remainingAmount = isPartiallyPaid ? monthlySalary - (currentPayment?.amount || 0) : monthlySalary;
  const paidAmount = currentPayment?.amount || 0;

  return (
    <ModalPortal>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-5">
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

            {/* ✅ Deductions Section */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-amber-400">Deductions</span>
                <label className="flex items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    checked={applyDeductions}
                    onChange={(e) => setApplyDeductions(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                  />
                  Apply Deductions
                </label>
              </div>

              {applyDeductions && (
                <div className="space-y-2 text-sm">
                  {/* Free Leave */}
                  {deductions.freeLeaves > 0 && (
                    <div className="flex items-center justify-between text-green-400">
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={14} />
                        Free Leave ({deductions.freeLeaves} allowed)
                      </span>
                      <span>Rs. 0</span>
                    </div>
                  )}

                  {/* Chargeable Leaves */}
                  {deductions.chargeableLeaves > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Calendar size={14} />
                        Leaves ({deductions.chargeableLeaves} × Rs. {deductions.leaveDeduction})
                      </span>
                      <span className="text-red-400">- Rs. {deductions.leaveAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Absent */}
                  {deductions.absent > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Clock size={14} />
                        Absent ({deductions.absent} days)
                      </span>
                      <span className="text-red-400">- Rs. {(deductions.absent * deductions.leaveDeduction).toLocaleString()}</span>
                    </div>
                  )}

                  {/* Late with Grace Time */}
                  {deductions.totalLateMinutes > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Clock size={14} />
                        Late ({deductions.totalLateMinutes} min charged × Rs. {deductions.lateDeduction})
                        {deductions.freeLateMinutes > 0 && (
                          <span className="text-xs text-green-400">({deductions.freeLateMinutes} min grace)</span>
                        )}
                      </span>
                      <span className="text-red-400">- Rs. {deductions.lateAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Task Failure */}
                  {deductions.failedTasks > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Briefcase size={14} />
                        Task Failure ({deductions.failedTasks} tasks)
                      </span>
                      <span className="text-red-400">- Rs. {deductions.taskAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Custom Task Deductions */}
                  {deductions.customTaskDeductions?.map((task, index) => (
                    <div key={index} className="flex items-center justify-between pl-6 text-xs">
                      <span className="text-slate-500">└ {task.title}</span>
                      <span className="text-red-400">- Rs. {task.failureDeduction.toLocaleString()}</span>
                    </div>
                  ))}

                  {/* Total Deductions */}
                  {deductions.totalDeduction > 0 && (
                    <div className="border-t border-amber-500/20 pt-2 mt-2 flex items-center justify-between font-semibold">
                      <span className="text-amber-400 flex items-center gap-2">
                        <TrendingDown size={14} />
                        Total Deductions
                      </span>
                      <span className="text-amber-400">- Rs. {deductions.totalDeduction.toLocaleString()}</span>
                    </div>
                  )}

                  {deductions.totalDeduction === 0 && (
                    <p className="text-xs text-slate-500">No deductions for this month</p>
                  )}
                </div>
              )}
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

                {/* ✅ Remaining Amount - Uper */}
                {remainingAmount > 0 && !isFullyPaid && (
                  <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                    <span className="text-xs text-slate-500">Remaining Salary</span>
                    <span className="text-sm font-bold text-amber-400">
                      Rs. {remainingAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* ✅ Final Amount - Nichay */}
                {applyDeductions && deductions.totalDeduction > 0 && (
                  <div className="flex items-center justify-between border-t border-emerald-500/20 pt-2">
                    <span className="text-xs text-slate-500">Final Amount (After Deductions)</span>
                    <span className="text-sm font-bold text-emerald-400">
                      Rs. {finalAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                {paidAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Already Paid</span>
                    <span className="text-xs font-medium text-emerald-400">
                      Rs. {paidAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Amount Input - Auto-filled with final amount */}
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
                    max={monthlySalary}
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setError("");
                    }}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Monthly Salary: Rs. {monthlySalary.toLocaleString()}</span>
                  <span className="text-emerald-400">Final Amount: Rs. {finalAmount.toLocaleString()}</span>
                </div>
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
    </ModalPortal>
  );
}