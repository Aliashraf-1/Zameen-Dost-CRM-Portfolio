"use client";

import { useState } from "react";
import { X, Save, User, Phone, Mail, CreditCard, Building2, Tag } from "lucide-react";
import { LEAD_STATUS, LEAD_TYPES, LEAD_SOURCES } from "@/constants/leadStatus";


import ModalPortal from "@/components/common/ModalPortal";

export default function LeadForm({
  employee,
  onClose,
  onSave,
  initialData = null,
}) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: initialData?.customerName || "",
    customerPhone: initialData?.customerPhone || "",
    customerEmail: initialData?.customerEmail || "",
    customerCNIC: initialData?.customerCNIC || "",
    type: initialData?.type || "Room",
    status: initialData?.status || "New",
    source: initialData?.source || "Referral",
    remarks: initialData?.remarks || "",
    followUpDate: initialData?.followUpDate || "",
    assignedTo: initialData?.assignedTo || employee?._id || employee?.id || null,
    assignedToName: initialData?.assignedToName || employee?.name || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName || !form.customerPhone) {
      setError("Customer name and phone are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Build lead data for backend
      const leadData = {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || "",
        customerCNIC: form.customerCNIC || "",
        type: form.type,
        status: form.status,
        source: form.source,
        remarks: form.remarks || "",
        followUpDate: form.followUpDate || null,
        assignedTo: form.assignedTo,
        assignedToName: form.assignedToName,
      };

      // ✅ If editing, preserve existing fields
      if (isEdit && initialData) {
        leadData.createdBy = initialData.createdBy;
        leadData.createdAt = initialData.createdAt;
        leadData.notes = initialData.notes || [];
        leadData.convertedToUnit = initialData.convertedToUnit || null;
      } else {
        leadData.createdBy = employee?._id || employee?.id || null;
        leadData.createdAt = new Date().toISOString();
        leadData.notes = [];
        leadData.convertedToUnit = null;
      }

      await onSave(leadData);
      onClose();
    } catch (error) {
      console.error("Lead save error:", error);
      setError(error.response?.data?.message || error.message || "Failed to save lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <ModalPortal>
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-semibold">{isEdit ? "Edit Lead" : "Add New Lead"}</h2>
              <p className="text-xs text-slate-500">Enter customer lead information</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Customer Name *</label>
            <div className="relative">
              <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Phone *</label>
              <div className="relative">
                <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  placeholder="0300-1234567"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={handleChange}
                  placeholder="customer@email.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
       

          {/* Type & Source */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Type</label>
              <div className="relative">
                <Building2 size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-300 outline-none focus:border-indigo-500 appearance-none"
                >
                  {LEAD_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Source</label>
              <div className="relative">
                <Tag size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-300 outline-none focus:border-indigo-500 appearance-none"
                >
                  {LEAD_SOURCES.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
            >
              {Object.values(LEAD_STATUS).map((status) => (
                <option key={status.value} value={status.value}>{status.value}</option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows="3"
              placeholder="Add remarks about this lead..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Follow-up Date</label>
            <input
              type="datetime-local"
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
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
              <Save size={17} />
              {loading ? "Saving..." : isEdit ? "Update Lead" : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
}