"use client";

import { useState, useEffect } from "react";
import { X, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import ModalPortal from "@/components/common/ModalPortal";

export default function TaskModal({ employee, onClose, onSave, task = null }) {
  const isEdit = !!task;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedDate: task?.assignedDate || new Date().toISOString().slice(0, 16),
    dueDate: task?.dueDate || "",
    priority: task?.priority || "Medium",
    status: task?.status || "Pending",
    failureReason: task?.failureReason || "",
    failureDeduction: task?.failureDeduction || employee?.attendanceSettings?.taskFailureDeduction || 1000,
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        ...form,
        id: task?.id || Date.now(),
        assignedDate: new Date(form.assignedDate).toISOString(),
        dueDate: new Date(form.dueDate).toISOString(),
        completedAt: form.status === "Completed" ? new Date().toISOString() : null,
        failureDeduction: form.status === "Failed" ? Number(form.failureDeduction) : 0,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
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
        <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Plus size={20} />
              </div>
              <div>
                <h2 className="font-semibold">{isEdit ? "Edit Task" : "Assign Task"}</h2>
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
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Task Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter task description"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            {/* Assigned Date & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Assigned Date
                </label>
                <input
                  type="datetime-local"
                  name="assignedDate"
                  value={form.assignedDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Failure Reason & Deduction */}
            {form.status === "Failed" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Failure Reason *
                  </label>
                  <input
                    name="failureReason"
                    value={form.failureReason}
                    onChange={handleChange}
                    placeholder="Why did the task fail?"
                    className="w-full rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Task Failure Deduction (Rs.)
                    <span className="ml-2 text-xs text-slate-500">custom amount</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="failureDeduction"
                    value={form.failureDeduction}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                    placeholder="Enter deduction amount"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Default: Rs. {employee?.attendanceSettings?.taskFailureDeduction || 1000}
                  </p>
                </div>
              </>
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
                {loading ? "Saving..." : isEdit ? "Update Task" : "Assign Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}