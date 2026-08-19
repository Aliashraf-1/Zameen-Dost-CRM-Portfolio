import { notFound } from "next/navigation";
import { employees } from "@/data/employees";
import EmployeeForm from "@/components/employees/EmployeeForm";

export default async function EditEmployeePage({ params }) {
  const { id } = await params;
  const employee = employees.find((item) => item.id === Number(id));

  if (!employee) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-indigo-400">Human Resources</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Edit Employee
        </h1>
        <p className="mt-2 text-sm text-slate-500">Update employee information.</p>
      </div>

      <EmployeeForm initialData={employee} mode="edit" />
    </div>
  );
}