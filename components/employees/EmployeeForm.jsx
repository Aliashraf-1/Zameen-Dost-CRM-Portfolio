"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Save,
  X,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  Wallet,
  AlertTriangle,
  Upload,
  Trash2,
} from "lucide-react";

export default function EmployeeForm({
  initialData = null,
  mode = "create",
  onSubmit,
}) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    cnic: initialData?.cnic || "",
    designation: initialData?.designation || "",
    department: initialData?.department || "Operations",
    joiningDate: initialData?.joiningDate || "",
    salary: initialData?.salary || "",
    status: initialData?.status || "Active",
    address: initialData?.address || "",
    emergencyContact: initialData?.emergencyContact || "",
    emergencyName: initialData?.emergencyName || "",
    image: initialData?.image || null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setForm((prev) => ({ ...prev, image: file }));
    e.target.value = "";
  };

  const removeImage = () => {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.salary) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const employeeData = {
        ...form,
        id: initialData?.id || Date.now(),
        salary: Number(form.salary),
        joiningDate: form.joiningDate || new Date().toISOString().split("T")[0],
        attendance: initialData?.attendance || [],
        salaryHistory: initialData?.salaryHistory || [],
      };

      if (onSubmit) {
        await onSubmit(employeeData);
      } else {
        console.log("Employee Data:", employeeData);
        await new Promise((resolve) => setTimeout(resolve, 800));
        router.push("/dashboard/employees");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong while saving the employee.");
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    "Operations",
    "Finance",
    "Maintenance",
    "Security",
    "HR",
    "Marketing",
    "IT",
    "Sales",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900"
    >
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-800 p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <User size={22} />
        </div>
        <div>
          <h2 className="font-semibold">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage employee information and employment details.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Fields */}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Full Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email Address *
          </label>
          <div className="relative">
            <Mail
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="employee@company.com"
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Phone Number *
          </label>
          <div className="relative">
            <Phone
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0300-1234567"
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* CNIC */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            CNIC
          </label>
          <input
            name="cnic"
            value={form.cnic}
            onChange={handleChange}
            placeholder="37405-1234567-1"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />
        </div>

        {/* Designation */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Designation *
          </label>
          <div className="relative">
            <Briefcase
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="e.g. Property Manager"
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Joining Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Joining Date
          </label>
          <div className="relative">
            <Calendar
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-300 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Monthly Salary *
          </label>
          <div className="relative">
            <Wallet
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="number"
              min="0"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="75000"
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Address
          </label>
          <div className="relative">
            <MapPin
              size={17}
              className="absolute left-4 top-4 text-slate-500"
            />
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter full address"
              rows="2"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Emergency Contact Name
          </label>
          <input
            name="emergencyName"
            value={form.emergencyName}
            onChange={handleChange}
            placeholder="Emergency contact person"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Emergency Contact Number
          </label>
          <input
            name="emergencyContact"
            value={form.emergencyContact}
            onChange={handleChange}
            placeholder="0312-7654321"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />
        </div>

        {/* Profile Image */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Profile Picture
            <span className="ml-2 text-xs font-normal text-slate-600">
              Optional
            </span>
          </label>

          {imagePreview ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-lg bg-black/70 p-2 text-white transition hover:bg-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 transition hover:border-indigo-500 hover:bg-indigo-500/5">
              <Upload size={28} className="text-slate-600" />
              <span className="mt-2 text-xs text-slate-500">Upload Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-slate-800 p-6">
        <Link
          href="/dashboard/employees"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <X size={17} />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {loading ? "Saving..." : isEdit ? "Update Employee" : "Save Employee"}
        </button>
      </div>
    </form>
  );
}