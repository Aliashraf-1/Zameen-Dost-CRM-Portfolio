"use client";

import { useState, useMemo } from "react";
import { Plus, CalendarCheck, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEmployees } from "@/context/EmployeeContext";
import EmployeeStats from "@/components/employees/EmployeeStats";
import EmployeeTable from "@/components/employees/EmployeeTable";
import AttendanceModal from "@/components/employees/AttendanceModal";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function EmployeesPage() {
  const { employees, setEmployees } = useEmployees();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [department, setDepartment] = useState("All");
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeSelect, setShowEmployeeSelect] = useState(false);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchValue = search.toLowerCase().trim();
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
  }, [employees, search, status, department]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  const handleAttendanceSave = (employeeId, attendanceData) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        return {
          ...emp,
          attendance: [...(emp.attendance || []), attendanceData],
        };
      })
    );
    setShowAttendanceModal(false);
    setSelectedEmployee(null);
    setShowEmployeeSelect(false);
  };

  const openAttendanceModal = (employee) => {
    setSelectedEmployee(employee);
    setShowAttendanceModal(true);
    setShowEmployeeSelect(false);
  };

  const toggleEmployeeSelect = () => {
    setShowEmployeeSelect(!showEmployeeSelect);
  };

  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeSelect(false);
    setShowAttendanceModal(true);
  };
    
  return (
    <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">Human Resources</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Employees
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Manage employees, track attendance, and process salaries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* ✅ Mark Attendance Button with Dropdown */}
            <div className="relative">
              <button
                onClick={toggleEmployeeSelect}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
              >
                <CalendarCheck size={17} />
                Mark Attendance
                <ChevronDown size={16} className={`transition-transform duration-200 ${showEmployeeSelect ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showEmployeeSelect && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmployeeSelect(false)}
                  />
                  
                  <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl">
                    <div className="max-h-64 overflow-y-auto p-2">
                      <div className="px-3 py-2 text-xs font-medium text-slate-400 border-b border-slate-700">
                        Select Employee
                      </div>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <button
                            key={employee.id}
                            onClick={() => selectEmployee(employee)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-medium text-indigo-400">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium">{employee.name}</p>
                              <p className="text-xs text-slate-500">{employee.designation}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-sm text-slate-500">
                          No employees found
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              href="/dashboard/employees/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <Plus size={17} />
              Add Employee
            </Link>
          </div>
        </div>

        <EmployeeStats employees={filteredEmployees} />

        <div className="mt-6">
          <EmployeeTable
            employees={filteredEmployees}
            onDelete={handleDelete}
            onMarkAttendance={openAttendanceModal}
          />
        </div>

        {/* ✅ Attendance Modal */}
        {showAttendanceModal && selectedEmployee && (
          <AttendanceModal
            employee={selectedEmployee}
            onClose={() => {
              setShowAttendanceModal(false);
              setSelectedEmployee(null);
              setShowEmployeeSelect(false);
            }}
            onSave={(attendanceData) => 
              handleAttendanceSave(selectedEmployee.id, attendanceData)
            }
          />
        )}
      </div>
    </ProtectedRoute>
  );
}