"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "bms-auth-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // For now, mock login based on email
      let mockUser = null;
      
      if (email === "admin@bms.com" || email === "ahmed.hassan@bms.com") {
        mockUser = {
          id: 1,
          name: "Ahmed Hassan",
          email: "ahmed.hassan@bms.com",
          role: "admin",
          employeeId: 1,
          permissions: ["all"],
        };
      } else if (email === "sara.khan@bms.com") {
        mockUser = {
          id: 2,
          name: "Sara Khan",
          email: "sara.khan@bms.com",
          role: "lead_manager",
          employeeId: 2,
          permissions: ["manage_leads", "view_tasks", "mark_attendance"],
        };
      } else if (email === "usman.malik@bms.com") {
        mockUser = {
          id: 3,
          name: "Usman Malik",
          email: "usman.malik@bms.com",
          role: "employee",
          employeeId: 3,
          permissions: ["view_tasks", "mark_attendance", "view_attendance"],
        };
      } else {
        // Default employee
        mockUser = {
          id: 1,
          name: "Employee",
          email: email || "employee@bms.com",
          role: "employee",
          employeeId: 1,
          permissions: ["view_tasks", "mark_attendance", "view_attendance"],
        };
      }

      // Save user
      setUser(mockUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      }
      return mockUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === "admin" || user.role === "super_admin") return true;
    if (user.permissions?.includes("all")) return true;
    return user.permissions?.includes(permission) || false;
  };

  // Check if user can manage leads
  const canManageLeads = () => {
    if (!user) return false;
    return user.role === "admin" || user.role === "lead_manager" || user.permissions?.includes("manage_leads");
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      loading,
      hasRole,
      hasPermission,
      canManageLeads,
      isAdmin: user?.role === "admin" || user?.role === "super_admin",
      isLeadManager: user?.role === "lead_manager" || user?.permissions?.includes("manage_leads"),
      isEmployee: user?.role === "employee",
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};