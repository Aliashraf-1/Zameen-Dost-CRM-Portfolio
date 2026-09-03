"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { revenueAPI } from "@/lib/api";

const RevenueContext = createContext(null);

export function RevenueProvider({ children }) {
  const [revenueData, setRevenueData] = useState({
    income: [],
    expenses: [],
    securities: [],
    includeSecurities: false,
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load revenue from API
  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    try {
      setLoading(true);
      const response = await revenueAPI.get();
      setRevenueData(response.data.data);
      setError(null);
    } catch (error) {
      console.error("❌ Failed to load revenue:", error);
      setError(error.response?.data?.message || "Failed to load revenue");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle securities
  const toggleSecurities = async () => {
    try {
      const response = await revenueAPI.toggleSecurities();
      setRevenueData(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to toggle securities:", error);
      throw error;
    }
  };

  // ✅ Add income with better error handling
  const addIncome = async (incomeData) => {
    try {
      console.log("💰 Adding income:", incomeData);
      const response = await revenueAPI.addIncome(incomeData);
      setRevenueData(response.data.data);
      console.log("✅ Income added successfully:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to add income:", error);
      console.error("Error details:", error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Add expense with better error handling
  const addExpense = async (expenseData) => {
    try {
      console.log("💸 Adding expense:", expenseData);
      const response = await revenueAPI.addExpense(expenseData);
      setRevenueData(response.data.data);
      console.log("✅ Expense added successfully:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to add expense:", error);
      console.error("Error details:", error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Add security
  const addSecurity = async (securityData) => {
    try {
      console.log("🔒 Adding security:", securityData);
      const response = await revenueAPI.addSecurity(securityData);
      setRevenueData(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Failed to add security:", error);
      throw error;
    }
  };

  // ✅ Get transactions
  const getTransactions = async () => {
    try {
      const response = await revenueAPI.getTransactions();
      return response.data.data || [];
    } catch (error) {
      console.error("❌ Failed to get transactions:", error);
      return [];
    }
  };

  // ✅ Get revenue stats
  const getRevenueStats = () => {
    const totalIncome = (revenueData.income || []).reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = (revenueData.expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);
    const securitiesTotal = (revenueData.securities || [])
      .filter(s => s.status === "Held")
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    const totalRevenue = revenueData.includeSecurities ? totalIncome + securitiesTotal : totalIncome;
    const netProfit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      baseRevenue: totalIncome,
      securitiesTotal,
      netProfit,
      includeSecurities: revenueData.includeSecurities || false,
    };
  };

  // ✅ Reset revenue data
  const resetRevenue = async () => {
    try {
      await loadRevenue();
    } catch (error) {
      console.error("❌ Failed to reset revenue:", error);
    }
  };

  const value = useMemo(
    () => ({
      revenueData,
      setRevenueData,
      loading,
      error,
      loadRevenue,
      toggleSecurities,
      addIncome,
      addExpense,
      addSecurity,
      getTransactions,
      getRevenueStats,
      resetRevenue,
    }),
    [revenueData, loading, error]
  );

  return <RevenueContext.Provider value={value}>{children}</RevenueContext.Provider>;
}

export function useRevenue() {
  const context = useContext(RevenueContext);
  if (!context) {
    throw new Error("useRevenue must be used inside RevenueProvider");
  }
  return context;
}