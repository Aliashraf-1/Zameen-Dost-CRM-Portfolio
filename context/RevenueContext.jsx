"use client";

import { createContext, useContext, useMemo, useState } from "react";

const RevenueContext = createContext(null);

const STORAGE_KEY = "bms-revenue";

function getInitialData() {
  if (typeof window === "undefined") {
    return {
      income: [],
      expenses: [],
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load revenue data:", error);
  }

  return {
    income: [],
    expenses: [],
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
  };
}

export function RevenueProvider({ children }) {
  const [revenueData, setRevenueData] = useState(getInitialData);

  // Save to localStorage
  useState(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(revenueData));
  }, [revenueData]);

  const addIncome = (income) => {
    const newIncome = {
      ...income,
      id: income.id || `income-${Date.now()}`,
      createdAt: income.createdAt || new Date().toISOString(),
    };

    setRevenueData((prev) => {
      const updatedIncome = [...prev.income, newIncome];
      const totalRevenue = updatedIncome.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      const totalExpenses = prev.expenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      return {
        ...prev,
        income: updatedIncome,
        totalRevenue,
        netProfit: totalRevenue - totalExpenses,
      };
    });
  };

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: expense.id || `expense-${Date.now()}`,
      createdAt: expense.createdAt || new Date().toISOString(),
    };

    setRevenueData((prev) => {
      const updatedExpenses = [...prev.expenses, newExpense];
      const totalExpenses = updatedExpenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      const totalRevenue = prev.income.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      return {
        ...prev,
        expenses: updatedExpenses,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
      };
    });
  };

  const getExpensesByMonth = (month) => {
    return revenueData.expenses.filter((exp) => {
      const expMonth = exp.createdAt?.slice(0, 7);
      return expMonth === month;
    });
  };

  const getIncomeByMonth = (month) => {
    return revenueData.income.filter((inc) => {
      const incMonth = inc.createdAt?.slice(0, 7);
      return incMonth === month;
    });
  };

  const value = useMemo(
    () => ({
      revenueData,
      addIncome,
      addExpense,
      getExpensesByMonth,
      getIncomeByMonth,
    }),
    [revenueData]
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