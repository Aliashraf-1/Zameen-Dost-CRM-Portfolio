"use client";

import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  Wallet,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import EmployeeAttendance from "./EmployeeAttendance";
import EmployeeSalaryHistory from "./EmployeeSalaryHistory";

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon size={15} />
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-200">{value || "Not Set"}</p>
    </div>
  );
}

export default function EmployeeDetails({ employee }) {
  const getStatusBadge = (status) => {
    const variants = {
      Active: "bg-emerald-500/10 text-emerald-400",
      Inactive: "bg-red-500/10 text-red-400",
      "On Leave": "bg-amber-500/10 text-amber-400",
    };
    return variants[status] || variants.Inactive;
  };

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Back */}
      <Link
        href="/dashboard/employees"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Employees
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-500/10 text-indigo-400">
            {employee.image ? (
              <img
                src={employee.image}
                alt={employee.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={28} />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {employee.name}
              </h1>
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getStatusBadge(
                  employee.status
                )}`}
              >
                {employee.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {employee.designation} • {employee.department}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/dashboard/employees/edit/${employee.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            Edit Employee
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Personal Information */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 font-semibold">Personal Information</h2>
          <div className="grid gap-3">
            <InfoItem icon={User} label="Full Name" value={employee.name} />
            <InfoItem icon={Mail} label="Email" value={employee.email} />
            <InfoItem icon={Phone} label="Phone" value={employee.phone} />
            <InfoItem icon={ShieldCheck} label="CNIC" value={employee.cnic} />
            <InfoItem icon={MapPin} label="Address" value={employee.address} />
          </div>
        </div>

        {/* Employment Information */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 font-semibold">Employment Information</h2>
          <div className="grid gap-3">
            <InfoItem
              icon={Briefcase}
              label="Designation"
              value={employee.designation}
            />
            <InfoItem icon={Calendar} label="Department" value={employee.department} />
            <InfoItem
              icon={Calendar}
              label="Joining Date"
              value={employee.joiningDate}
            />
            <InfoItem
              icon={Wallet}
              label="Monthly Salary"
              value={`Rs. ${employee.salary.toLocaleString()}`}
            />
            <InfoItem
              icon={Clock}
              label="Status"
              value={employee.status}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 font-semibold">Emergency Contact</h2>
          <div className="grid gap-3">
            <InfoItem
              icon={User}
              label="Contact Person"
              value={employee.emergencyName || "Not Set"}
            />
            <InfoItem
              icon={Phone}
              label="Contact Number"
              value={employee.emergencyContact || "Not Set"}
            />
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="mt-6">
        <EmployeeAttendance attendance={employee.attendance || []} />
      </div>

      {/* Salary History */}
      <div className="mt-6">
        <EmployeeSalaryHistory salaryHistory={employee.salaryHistory || []} />
      </div>
    </div>
  );
}