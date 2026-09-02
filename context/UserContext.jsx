"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { users as initialUsers } from "@/data/users";

const UserContext = createContext(null);
const STORAGE_KEY = "bms-users";

function getInitialData() {
  if (typeof window === "undefined") return initialUsers;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to load users:", error);
  }
  return initialUsers;
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState(getInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // ✅ Add new user
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: userData.status || "active",
      permissions: userData.permissions || [],
    };
    setUsers([...users, newUser]);
    return newUser;
  };

  // ✅ Update user
  const updateUser = (userId, updates) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, ...updates, updatedAt: new Date().toISOString() }
          : user
      )
    );
  };

  // ✅ Delete user
  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  // ✅ Get user by ID
  const getUserById = (userId) => {
    return users.find((user) => user.id === userId);
  };

  // ✅ Get users by role
  const getUsersByRole = (role) => {
    return users.filter((user) => user.role === role);
  };

  // ✅ Get user by employee ID
  const getUserByEmployeeId = (employeeId) => {
    return users.find((user) => user.employeeId === employeeId);
  };

  // ✅ Get all active users
  const getActiveUsers = () => {
    return users.filter((user) => user.status === "active");
  };

  const value = useMemo(
    () => ({
      users,
      setUsers,
      addUser,
      updateUser,
      deleteUser,
      getUserById,
      getUsersByRole,
      getUserByEmployeeId,
      getActiveUsers,
    }),
    [users]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used inside UserProvider");
  }
  return context;
};