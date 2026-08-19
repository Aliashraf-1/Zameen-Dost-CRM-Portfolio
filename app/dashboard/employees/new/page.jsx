import EmployeeForm from "@/components/employees/EmployeeForm";

export default function NewEmployeePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-indigo-400">Human Resources</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Add New Employee
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Add a new employee to the system.
        </p>
      </div>

      <EmployeeForm mode="create" />
    </div>
  );
}