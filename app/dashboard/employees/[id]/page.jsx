"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useEmployees } from "@/context/EmployeeContext";
import EmployeeDetails from "@/components/employees/EmployeeDetails";

export default function EmployeeDetailsPage() {
  const params = useParams();
  const { employees, setEmployees, paySalary } = useEmployees();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const found = employees.find((item) => item.id === Number(params.id));
      if (found) {
        setEmployee(found);
      }
      setLoading(false);
    }
  }, [params.id, employees]);

  const handlePaySalary = async (employeeId, amount) => {
    try {
      await paySalary(employeeId, amount);
      // Update local employee state
      const updated = employees.find((emp) => emp.id === employeeId);
      if (updated) {
        setEmployee(updated);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    }
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const handleAttendanceUpdate = (employeeId, attendanceData) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        return {
          ...emp,
          attendance: [...(emp.attendance || []), attendanceData],
        };
      })
    );
    // Update current employee
    const updated = employees.find((emp) => emp.id === employeeId);
    if (updated) {
      setEmployee(updated);
    }
  };

  const handleTaskUpdate = (taskData) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employee.id) return emp;
        const tasks = emp.tasks || [];
        const existingIndex = tasks.findIndex((t) => t.id === taskData.id);
        let updatedTasks;
        if (existingIndex !== -1) {
          updatedTasks = tasks.map((t) => (t.id === taskData.id ? taskData : t));
        } else {
          updatedTasks = [...tasks, taskData];
        }
        return {
          ...emp,
          tasks: updatedTasks,
        };
      })
    );
    // Update current employee
    const updated = employees.find((emp) => emp.id === employee.id);
    if (updated) {
      setEmployee(updated);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading employee details...</div>
      </div>
    );
  }

  if (!employee) {
    notFound();
  }

  return (
    <EmployeeDetails
      employee={employee}
      onPaySalary={handlePaySalary}
      onDelete={handleDelete}
      onAttendanceUpdate={handleAttendanceUpdate}
      onTaskUpdate={handleTaskUpdate}
    />
  );
}