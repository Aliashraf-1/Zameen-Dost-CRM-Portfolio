import { notFound } from "next/navigation";
import { employees } from "@/data/employees";
import EmployeeDetails from "@/components/employees/EmployeeDetails";

export default async function EmployeeDetailsPage({ params }) {
  // params ko await karo
  const { id } = await params;
  
  const employee = employees.find((item) => item.id === Number(id));

  if (!employee) {
    notFound();
  }

  return <EmployeeDetails employee={employee} />;
}