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
} from "lucide-react";
import EmployeeAttendance from "./EmployeeAttendance";
import EmployeeSalaryHistory from "./EmployeeSalaryHistory";
import PaySalaryModal from "./PaySalaryModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

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

export default function EmployeeDetails({ employee, onPaySalary, onDelete }) {
  const router = useRouter();
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            <Trash2 size={16} />
            Delete Employee
          </button>
        </div>

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
            <button
              onClick={() => setShowPayModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <Wallet size={18} />
              Pay Salary
            </button>
          </div>
        </div>

        {/* Stats Grid - Same as before */}
        {/* ... (rest of the component remains same) */}
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
          message="Are you sure you want to delete this employee? This action cannot be undone and will remove all associated records including attendance and salary history."
          itemName={`${employee.name} (${employee.designation})`}
          loading={deleteLoading}
        />
      )}
    </>
  );
}