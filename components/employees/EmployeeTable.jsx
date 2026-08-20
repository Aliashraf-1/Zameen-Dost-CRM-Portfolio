"use client";

import { useMemo, useState, useCallback, useReducer } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Mail,
  Phone,
  Briefcase,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  AlertCircle,
  Calendar,
} from "lucide-react";
import PaySalaryModal from "./PaySalaryModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { useEmployees } from "@/context/EmployeeContext";

// Reducer for table state
const tableReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_DEPARTMENT":
      return { ...state, department: action.payload };
    case "RESET_FILTERS":
      return { search: "", status: "All", department: "All" };
    default:
      return state;
  }
};

export default function EmployeeTable({ employees = [], onDelete }) {
  // Use reducer for filter state
  const [filterState, dispatch] = useReducer(tableReducer, {
    search: "",
    status: "All",
    department: "All",
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { paySalary, getEmployeeSalaryStatus } = useEmployees();

  // Memoized filtered employees
  const filteredEmployees = useMemo(() => {
    const { search, status, department } = filterState;
    const searchValue = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchValue) ||
        employee.email.toLowerCase().includes(searchValue) ||
        employee.phone.includes(searchValue) ||
        employee.designation.toLowerCase().includes(searchValue);

      const matchesStatus = status === "All" || employee.status === status;
      const matchesDepartment =
        department === "All" || employee.department === department;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, filterState]);

  // Memoized status badge renderer
  const getStatusBadge = useCallback((status) => {
    const variants = {
      Active: {
        class: "bg-emerald-500/10 text-emerald-400",
        icon: <CheckCircle2 size={14} />,
      },
      Inactive: {
        class: "bg-red-500/10 text-red-400",
        icon: <XCircle size={14} />,
      },
      "On Leave": {
        class: "bg-amber-500/10 text-amber-400",
        icon: <Clock size={14} />,
      },
    };
    return variants[status] || variants.Inactive;
  }, []);

  // Handle filter changes with useCallback
  const handleSearchChange = useCallback((e) => {
    dispatch({ type: "SET_SEARCH", payload: e.target.value });
  }, []);

  const handleStatusChange = useCallback((e) => {
    dispatch({ type: "SET_STATUS", payload: e.target.value });
  }, []);

  const handleDepartmentChange = useCallback((e) => {
    dispatch({ type: "SET_DEPARTMENT", payload: e.target.value });
  }, []);

  // Handle pay salary
  const handlePayClick = useCallback((employee) => {
    setSelectedEmployee(employee);
    setShowPayModal(true);
  }, []);

  const handlePaySalary = useCallback(async (employeeId, amount) => {
    try {
      const result = await paySalary(employeeId, amount);
      console.log("Salary payment recorded:", {
        employeeId,
        amount,
        timestamp: result.timestamp,
        month: result.month,
        status: result.status,
      });
      return result;
    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    }
  }, [paySalary]);

  // Handle delete
  const handleDeleteClick = useCallback((employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedEmployee) return;
    
    setDeleteLoading(true);
    try {
      await onDelete(selectedEmployee.id);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteLoading(false);
    }
  }, [selectedEmployee, onDelete]);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  }, []);

  // Memoized salary status calculation
  const getSalaryStatusDisplay = useCallback((employee) => {
    const salaryStatus = getEmployeeSalaryStatus(employee.id);
    
    const statusConfig = {
      Paid: {
        class: "bg-emerald-500/10 text-emerald-400",
        icon: <CheckCircle2 size={14} />,
      },
      Partial: {
        class: "bg-amber-500/10 text-amber-400",
        icon: <Clock size={14} />,
      },
      Pending: {
        class: "bg-red-500/10 text-red-400",
        icon: <AlertCircle size={14} />,
      },
    };

    const config = statusConfig[salaryStatus.status] || statusConfig.Pending;

    return {
      ...salaryStatus,
      ...config,
    };
  }, [getEmployeeSalaryStatus]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {/* Header */}
        <div className="border-b border-slate-800 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Employees</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your workforce and track attendance.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={filterState.search}
                  onChange={handleSearchChange}
                  placeholder="Search employees..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500 sm:w-64"
                />
              </div>

              <select
                value={filterState.status}
                onChange={handleStatusChange}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>

              <select
                value={filterState.department}
                onChange={handleDepartmentChange}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
              >
                <option value="All">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Security">Security</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1350px]">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Employee
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Designation
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Department
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Salary
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Salary Status
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => {
                const statusBadge = getStatusBadge(employee.status);
                const salaryStatus = getSalaryStatusDisplay(employee);

                return (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-800/70 transition hover:bg-slate-950/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/10 text-indigo-400">
                          {employee.image ? (
                            <img
                              src={employee.image}
                              alt={employee.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            {employee.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {employee.designation}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-slate-400">
                        {employee.department}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-slate-300">{employee.phone}</span>
                        <span className="text-xs text-slate-500">
                          {employee.cnic}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-emerald-400">
                        Rs. {employee.salary.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${salaryStatus.class}`}
                        >
                          {salaryStatus.icon}
                          {salaryStatus.status}
                        </span>
                        
                        {salaryStatus.amount > 0 && (
                          <span className="text-xs text-slate-500">
                            Paid: Rs. {salaryStatus.amount.toLocaleString()}
                          </span>
                        )}
                        
                        {salaryStatus.remaining > 0 && salaryStatus.status !== "Paid" && (
                          <span className="text-xs text-amber-400">
                            Remaining: Rs. {salaryStatus.remaining.toLocaleString()}
                          </span>
                        )}

                        {salaryStatus.paidAt && (
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(salaryStatus.paidAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${statusBadge.class}`}
                      >
                        {statusBadge.icon}
                        {employee.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/employees/${employee.id}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                      title="View employee"
                    >
                      <Eye size={17} />
                    </Link>

                        <Link
                          href={`/dashboard/employees/edit/${employee.id}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                          title="Edit employee"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          onClick={() => handlePayClick(employee)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                          title="Pay salary"
                        >
                          <Wallet size={17} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(employee)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                          title="Delete employee"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm font-medium">No employees found</p>
              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pay Salary Modal */}
      {showPayModal && selectedEmployee && (
        <PaySalaryModal
          employee={selectedEmployee}
          onClose={() => {
            setShowPayModal(false);
            setSelectedEmployee(null);
          }}
          onPay={handlePaySalary}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployee && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
          title="Delete Employee"
          message="Are you sure you want to delete this employee? This action cannot be undone and will remove all associated records."
          itemName={`${selectedEmployee.name} (${selectedEmployee.designation})`}
          loading={deleteLoading}
        />
      )}
    </>
  );
}