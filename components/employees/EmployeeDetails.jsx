"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertCircle,
  Trash2,
  Plus,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import EmployeeAttendance from "./EmployeeAttendance";
import EmployeeSalaryHistory from "./EmployeeSalaryHistory";
import EmployeePerformance from "./EmployeePerformance";
import EmployeeTasks from "./EmployeeTasks";
import PaySalaryModal from "./PaySalaryModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import AttendanceModal from "./AttendanceModal";

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

export default function EmployeeDetails({ employee, onPaySalary, onDelete, onAttendanceUpdate, onTaskUpdate }) {
  const router = useRouter();
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getStatusBadge = useCallback((status) => {
    const variants = {
      Active: "bg-emerald-500/10 text-emerald-400",
      Inactive: "bg-red-500/10 text-red-400",
      "On Leave": "bg-amber-500/10 text-amber-400",
    };
    return variants[status] || variants.Inactive;
  }, []);

  const getSalaryStatus = useCallback(() => {
    const history = employee.salaryHistory || [];
    const lastPayment = history[history.length - 1];
    const monthlySalary = Number(employee.salary || 0);

    if (!lastPayment) {
      return {
        status: "Pending",
        class: "bg-red-500/10 text-red-400",
        icon: <AlertCircle size={18} />,
        label: "Pending",
        amount: 0,
        remaining: monthlySalary,
      };
    }

    if (lastPayment.status === "Paid" && lastPayment.amount >= monthlySalary) {
      return {
        status: "Paid",
        class: "bg-emerald-500/10 text-emerald-400",
        icon: <CheckCircle2 size={18} />,
        label: "Fully Paid",
        amount: lastPayment.amount,
        remaining: 0,
      };
    }

    if (lastPayment.status === "Partial") {
      return {
        status: "Partial",
        class: "bg-amber-500/10 text-amber-400",
        icon: <Clock size={18} />,
        label: `Partial (Rs. ${lastPayment.amount.toLocaleString()} paid)`,
        amount: lastPayment.amount,
        remaining: monthlySalary - lastPayment.amount,
      };
    }

    return {
      status: "Pending",
      class: "bg-red-500/10 text-red-400",
      icon: <AlertCircle size={18} />,
      label: "Pending",
      amount: 0,
      remaining: monthlySalary,
    };
  }, [employee]);

  const handleDeleteConfirm = useCallback(async () => {
    setDeleteLoading(true);
    try {
      if (onDelete) {
        await onDelete(employee.id);
        router.push("/dashboard/employees");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  }, [employee, onDelete, router]);

  const handleAttendanceSave = async (attendanceData) => {
    await onAttendanceUpdate(employee.id, attendanceData);
    setShowAttendanceModal(false);
  };

  const salaryStatus = getSalaryStatus();

  return (
    <>
      <div className="mx-auto max-w-[1600px]">
        {/* Back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/employees"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Employees
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAttendanceModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              <Plus size={16} />
              Mark Attendance
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              <Trash2 size={16} />
              Delete Employee
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-500/10 text-indigo-400">
              {employee.image ? (
                <img src={employee.image} alt={employee.name} className="h-full w-full object-cover" />
              ) : (
                <User size={28} />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{employee.name}</h1>
                <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getStatusBadge(employee.status)}`}>
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
            <button
              onClick={() => setShowPayModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <Wallet size={18} />
              Pay Salary
            </button>
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
              <InfoItem icon={Briefcase} label="Designation" value={employee.designation} />
              <InfoItem icon={Calendar} label="Department" value={employee.department} />
              <InfoItem icon={Calendar} label="Joining Date" value={employee.joiningDate} />
              <InfoItem icon={Wallet} label="Monthly Salary" value={`Rs. ${employee.salary.toLocaleString()}`} />
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Salary Status</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${salaryStatus.class}`}>
                    {salaryStatus.icon}
                    {salaryStatus.label}
                  </span>
                </div>
                {salaryStatus.remaining > 0 && (
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Remaining</span>
                    <span className="font-medium text-amber-400">Rs. {salaryStatus.remaining.toLocaleString()}</span>
                  </div>
                )}
                {salaryStatus.amount > 0 && (
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Paid</span>
                    <span className="font-medium text-emerald-400">Rs. {salaryStatus.amount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <InfoItem icon={Clock} label="Status" value={employee.status} />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 font-semibold">Emergency Contact</h2>
            <div className="grid gap-3">
              <InfoItem icon={User} label="Contact Person" value={employee.emergencyName || "Not Set"} />
              <InfoItem icon={Phone} label="Contact Number" value={employee.emergencyContact || "Not Set"} />
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="mt-6">
          <EmployeePerformance employee={employee} />
        </div>

        {/* Tasks Section */}
        <div className="mt-6">
          <EmployeeTasks employee={employee} onTaskUpdate={onTaskUpdate} />
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

      {/* Pay Salary Modal */}
      {showPayModal && (
        <PaySalaryModal
          employee={employee}
          onClose={() => setShowPayModal(false)}
          onPay={onPaySalary}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Employee"
          message="Are you sure you want to delete this employee? This action cannot be undone."
          itemName={`${employee.name} (${employee.designation})`}
          loading={deleteLoading}
        />
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <AttendanceModal
          employee={employee}
          onClose={() => setShowAttendanceModal(false)}
          onSave={handleAttendanceSave}
        />
      )}
    </>
  );
}