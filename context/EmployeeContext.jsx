"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { employees as initialEmployees } from "@/data/employees";
import { useRevenue } from "./RevenueContext";

const EmployeeContext = createContext(null);

const STORAGE_KEY = "bms-employees";

function getInitialData() {
  if (typeof window === "undefined") {
    return initialEmployees;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load employee data:", error);
  }

  return initialEmployees;
}

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(getInitialData);
  const { addExpense } = useRevenue();

  // Save to localStorage
  useState(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const paySalary = (employeeId, amount) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }

    const monthlySalary = Number(employee.salary || 0);
    const payAmount = Number(amount);

    if (payAmount <= 0 || payAmount > monthlySalary) {
      throw new Error("Invalid payment amount");
    }

    const history = employee.salaryHistory || [];
    const currentMonth = new Date().toISOString().slice(0, 7);
    const now = new Date();
    const timestamp = now.toISOString();

    // Check if already paid this month
    const existingPaymentIndex = history.findIndex(
      (h) => h.month === currentMonth && h.status !== "Pending"
    );

    let newHistory = [...history];
    let status = "Paid";

    if (existingPaymentIndex !== -1) {
      // Update existing payment
      const existing = history[existingPaymentIndex];
      const totalPaid = (existing.amount || 0) + payAmount;
      status = totalPaid >= monthlySalary ? "Paid" : "Partial";

      newHistory[existingPaymentIndex] = {
        ...existing,
        amount: totalPaid,
        status: status,
        paidAt: timestamp,
        updatedAt: timestamp,
      };
    } else {
      // New payment
      status = payAmount >= monthlySalary ? "Paid" : "Partial";
      newHistory.push({
        id: Date.now(),
        month: currentMonth,
        amount: payAmount,
        status: status,
        paidAt: timestamp,
        createdAt: timestamp,
      });
    }

    // Update employee
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        if (emp.id !== employeeId) return emp;
        return {
          ...emp,
          salaryHistory: newHistory,
        };
      })
    );

    // Add expense to revenue with timestamp
    addExpense({
      id: `salary-${Date.now()}`,
      type: "Salary",
      category: "Employee Salary",
      description: `Salary payment to ${employee.name} (${employee.designation})`,
      amount: payAmount,
      employeeId: employeeId,
      employeeName: employee.name,
      month: currentMonth,
      status: status,
      paidAt: timestamp,
      createdAt: timestamp,
    });

    return {
      employeeId,
      amount: payAmount,
      status,
      timestamp,
      month: currentMonth,
    };
  };

  const getEmployeeSalaryStatus = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return { status: "Pending", amount: 0, remaining: 0 };

    const history = employee.salaryHistory || [];
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlySalary = Number(employee.salary || 0);

    const currentMonthPayment = history.find(
      (h) => h.month === currentMonth
    );

    if (!currentMonthPayment) {
      return {
        status: "Pending",
        amount: 0,
        remaining: monthlySalary,
        paidAt: null,
      };
    }

    const paidAmount = Number(currentMonthPayment.amount || 0);
    const remaining = Math.max(monthlySalary - paidAmount, 0);

    return {
      status: currentMonthPayment.status || (paidAmount >= monthlySalary ? "Paid" : "Partial"),
      amount: paidAmount,
      remaining: remaining,
      paidAt: currentMonthPayment.paidAt || currentMonthPayment.createdAt || null,
    };
  };

  const value = useMemo(
    () => ({
      employees,
      setEmployees,
      paySalary,
      getEmployeeSalaryStatus,
    }),
    [employees]
  );

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used inside EmployeeProvider");
  }
  return context;
}