"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEmployees } from "@/context/EmployeeContext";
import EmployeeStats from "@/components/employees/EmployeeStats";
import EmployeeTable from "@/components/employees/EmployeeTable";
// import EmployeeFilters from "@/components/employees/EmployeeFilters";

export default function EmployeesPage() {
  const { employees, setEmployees } = useEmployees();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [department, setDepartment] = useState("All");

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

  return (
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

        <Link
          href="/dashboard/employees/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
        >
          <Plus size={17} />
          Add Employee
        </Link>
      </div>

      <EmployeeStats employees={filteredEmployees} />

      <div className="mt-6">
        {/* <EmployeeFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          department={department}
          setDepartment={setDepartment}
        /> */}
        <EmployeeTable
          employees={filteredEmployees}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

