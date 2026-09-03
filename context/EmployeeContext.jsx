"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { employeeAPI } from "@/lib/api";

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load employees from API on mount
  useEffect(() => {
    loadEmployees();
  }, []);

  // ✅ Load employees
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error("Failed to load employees:", error);
      setError(error.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create employee
  const createEmployee = async (employeeData) => {
    try {
      const response = await employeeAPI.create(employeeData);
      const newEmployee = response.data.data;
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (error) {
      console.error("Failed to create employee:", error);
      throw error;
    }
  };

  // ✅ Update employee
  const updateEmployee = async (id, employeeData) => {
    try {
      const response = await employeeAPI.update(id, employeeData);
      const updatedEmployee = response.data.data;
      setEmployees(prev => prev.map(e => e._id === id ? updatedEmployee : e));
      return updatedEmployee;
    } catch (error) {
      console.error("Failed to update employee:", error);
      throw error;
    }
  };

  // ✅ Delete employee
  const deleteEmployee = async (id) => {
    try {
      await employeeAPI.delete(id);
      setEmployees(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      console.error("Failed to delete employee:", error);
      throw error;
    }
  };

  // ✅ Get employee by ID
  const getEmployeeById = (id) => {
    return employees.find(e => e._id === id);
  };

  // ✅ Mark attendance
  const markAttendance = async (employeeId, attendanceData) => {
    try {
      const response = await employeeAPI.markAttendance(employeeId, attendanceData);
      const updatedEmployee = response.data.data;
      setEmployees(prev => prev.map(e => e._id === employeeId ? updatedEmployee : e));
      return updatedEmployee;
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      throw error;
    }
  };

  // ✅ Add task
  const addTask = async (employeeId, taskData) => {
    try {
      const response = await employeeAPI.addTask(employeeId, taskData);
      const updatedEmployee = response.data.data;
      setEmployees(prev => prev.map(e => e._id === employeeId ? updatedEmployee : e));
      return updatedEmployee;
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  };

  // ✅ Update task
  const updateTask = async (employeeId, taskId, taskData) => {
    try {
      const response = await employeeAPI.updateTask(employeeId, taskId, taskData);
      const updatedEmployee = response.data.data;
      setEmployees(prev => prev.map(e => e._id === employeeId ? updatedEmployee : e));
      return updatedEmployee;
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  };

  // ✅ Pay salary
  const paySalary = async (employeeId, salaryData) => {
    try {
      const response = await employeeAPI.paySalary(employeeId, salaryData);
      const updatedEmployee = response.data.data;
      setEmployees(prev => prev.map(e => e._id === employeeId ? updatedEmployee : e));
      return updatedEmployee;
    } catch (error) {
      console.error("Failed to pay salary:", error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      employees,
      setEmployees,
      loading,
      error,
      loadEmployees,
      createEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployeeById,
      markAttendance,
      addTask,
      updateTask,
      paySalary,
    }),
    [employees, loading, error]
  );

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used inside EmployeeProvider");
  }
  return context;
}