"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { securities as initialSecurities } from "@/data/index";

const RevenueContext = createContext(null);
const STORAGE_KEY = "bms-revenue";

// ✅ Dummy Income Data
const dummyIncome = [
  {
    id: "income-1",
    type: "Income",
    transactionType: "Income",
    category: "Rent",
    description: "Rent payment from Muhammad Ahmed - Unit 101",
    amount: 25000,
    source: "Rent",
    buildingId: 1,
    unitId: 101,
    unitNo: "101",
    tenantName: "Muhammad Ahmed",
    status: "Received",
    createdAt: "2026-08-01T10:30:00.000Z",
  },
  {
    id: "income-2",
    type: "Income",
    transactionType: "Income",
    category: "Rent",
    description: "Rent payment from Usman Khan - Unit 201",
    amount: 22000,
    source: "Rent",
    buildingId: 2,
    unitId: 201,
    unitNo: "201",
    tenantName: "Usman Khan",
    status: "Received",
    createdAt: "2026-08-20T09:45:00.000Z",
  },
  {
    id: "income-3",
    type: "Income",
    transactionType: "Income",
    category: "Rent",
    description: "Rent payment from Hassan Ali - Unit 301",
    amount: 35000,
    source: "Rent",
    buildingId: 3,
    unitId: 301,
    unitNo: "301",
    tenantName: "Hassan Ali",
    status: "Received",
    createdAt: "2026-08-01T12:20:00.000Z",
  },
  {
    id: "income-4",
    type: "Income",
    transactionType: "Income",
    category: "Rent",
    description: "Rent payment from Ahmed Khan - Desk 104",
    amount: 4000,
    source: "Rent",
    buildingId: 1,
    unitId: 104,
    unitNo: "104",
    tenantName: "Ahmed Khan",
    status: "Received",
    createdAt: "2026-08-19T10:30:00.000Z",
  },
];

// ✅ Dummy Expense Data
const dummyExpenses = [
  {
    id: "expense-1",
    type: "Expense",
    transactionType: "Expense",
    category: "Salary",
    description: "Salary payment to Ahmed Hassan (Property Manager)",
    amount: 85000,
    paidTo: "Ahmed Hassan",
    employeeId: 1,
    employeeName: "Ahmed Hassan",
    status: "Paid",
    createdAt: "2026-08-30T10:00:00.000Z",
  },
  {
    id: "expense-2",
    type: "Expense",
    transactionType: "Expense",
    category: "Salary",
    description: "Salary payment to Sara Khan (Accountant)",
    amount: 70000,
    paidTo: "Sara Khan",
    employeeId: 2,
    employeeName: "Sara Khan",
    status: "Paid",
    createdAt: "2026-08-30T10:00:00.000Z",
  },
  {
    id: "expense-3",
    type: "Expense",
    transactionType: "Expense",
    category: "Electricity Bill",
    description: "Electricity bill for Building #01",
    amount: 15000,
    paidTo: "WAPDA",
    status: "Paid",
    createdAt: "2026-08-25T10:00:00.000Z",
  },
  {
    id: "expense-4",
    type: "Expense",
    transactionType: "Expense",
    category: "Internet Bill",
    description: "Internet bill for Building #02",
    amount: 5000,
    paidTo: "PTCL",
    status: "Paid",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "expense-5",
    type: "Expense",
    transactionType: "Expense",
    category: "Maintenance",
    description: "AC repair - Building #01",
    amount: 8000,
    paidTo: "Technician",
    status: "Paid",
    createdAt: "2026-08-15T10:00:00.000Z",
  },
];

function getInitialData() {
  if (typeof window === "undefined") {
    return {
      income: dummyIncome,
      expenses: dummyExpenses,
      securities: initialSecurities,
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      includeSecurities: false,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.income && parsed.income.length === 0) {
        parsed.income = dummyIncome;
      }
      if (parsed.expenses && parsed.expenses.length === 0) {
        parsed.expenses = dummyExpenses;
      }
      if (parsed.securities && parsed.securities.length === 0) {
        parsed.securities = initialSecurities;
      }
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load revenue data:", error);
  }

  return {
    income: dummyIncome,
    expenses: dummyExpenses,
    securities: initialSecurities,
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    includeSecurities: false,
  };
}

export function RevenueProvider({ children }) {
  const [revenueData, setRevenueData] = useState(getInitialData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(revenueData));
      } catch (error) {
        console.error("Failed to save revenue data:", error);
      }
    }
  }, [revenueData]);

  // ✅ Toggle Securities Inclusion - Recalculate totalRevenue
  const toggleSecurities = () => {
    setRevenueData((prev) => {
      const newInclude = !prev.includeSecurities;
      
      // Calculate base revenue from income
      const baseRevenue = (prev.income || []).reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
      );
      
      // Calculate securities total
      const securitiesTotal = (prev.securities || [])
        .filter(s => s.status === "Held")
        .reduce((sum, s) => sum + Number(s.amount || 0), 0);
      
      // If including securities, add to revenue
      const totalRevenue = newInclude ? baseRevenue + securitiesTotal : baseRevenue;
      
      // Calculate expenses
      const totalExpenses = (prev.expenses || []).reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
      );
      
      return {
        ...prev,
        includeSecurities: newInclude,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
      };
    });
  };

  // ✅ Add Income - Update totalRevenue with securities logic
  const addIncome = (income) => {
    const newIncome = {
      ...income,
      id: income.id || `income-${Date.now()}`,
      createdAt: income.createdAt || new Date().toISOString(),
      transactionType: income.transactionType || "Income",
    };

    setRevenueData((prev) => {
      const updatedIncome = [...(prev.income || []), newIncome];
      const baseRevenue = updatedIncome.reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
      );
      
      // Calculate securities total
      const securitiesTotal = (prev.securities || [])
        .filter(s => s.status === "Held")
        .reduce((sum, s) => sum + Number(s.amount || 0), 0);
      
      // If including securities, add to revenue
      const totalRevenue = prev.includeSecurities ? baseRevenue + securitiesTotal : baseRevenue;
      
      const totalExpenses = (prev.expenses || []).reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
      );

      return {
        ...prev,
        income: updatedIncome,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
      };
    });
  };

  // ✅ Add Expense - Update totalRevenue with securities logic
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: expense.id || `expense-${Date.now()}`,
      createdAt: expense.createdAt || new Date().toISOString(),
      transactionType: expense.transactionType || "Expense",
    };

    setRevenueData((prev) => {
      const updatedExpenses = [...(prev.expenses || []), newExpense];
      const totalExpenses = updatedExpenses.reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
      );
      
      // Calculate base revenue
      const baseRevenue = (prev.income || []).reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
      );
      
      // Calculate securities total
      const securitiesTotal = (prev.securities || [])
        .filter(s => s.status === "Held")
        .reduce((sum, s) => sum + Number(s.amount || 0), 0);
      
      const totalRevenue = prev.includeSecurities ? baseRevenue + securitiesTotal : baseRevenue;

      return {
        ...prev,
        expenses: updatedExpenses,
        totalExpenses,
        totalRevenue,
        netProfit: totalRevenue - totalExpenses,
      };
    });
  };

  // ✅ Add Security - Update totalRevenue if securities included
  const addSecurity = (security) => {
    const newSecurity = {
      ...security,
      id: security.id || `security-${Date.now()}`,
      createdAt: security.createdAt || new Date().toISOString(),
      status: security.status || "Held",
    };

    setRevenueData((prev) => {
      const updatedSecurities = [...(prev.securities || []), newSecurity];
      
      // Calculate base revenue
      const baseRevenue = (prev.income || []).reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
      );
      
      // Calculate securities total
      const securitiesTotal = updatedSecurities
        .filter(s => s.status === "Held")
        .reduce((sum, s) => sum + Number(s.amount || 0), 0);
      
      const totalRevenue = prev.includeSecurities ? baseRevenue + securitiesTotal : baseRevenue;
      
      const totalExpenses = (prev.expenses || []).reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
      );

      return {
        ...prev,
        securities: updatedSecurities,
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
      };
    });
  };

  // ✅ Get Securities
  const getSecurities = () => {
    return revenueData.securities || [];
  };

  // ✅ Get Transactions with Securities toggle
  const getTransactions = () => {
    const transactions = [];

    // Add income transactions
    (revenueData.income || []).forEach((inc) => {
      transactions.push({
        ...inc,
        type: "Income",
        date: inc.createdAt,
      });
    });

    // Add expense transactions
    (revenueData.expenses || []).forEach((exp) => {
      transactions.push({
        ...exp,
        type: "Expense",
        date: exp.createdAt,
      });
    });

    // Add securities if included
    if (revenueData.includeSecurities) {
      (revenueData.securities || [])
        .filter(s => s.status === "Held")
        .forEach((sec) => {
          transactions.push({
            ...sec,
            type: "Security",
            date: sec.createdAt,
            amount: sec.amount,
          });
        });
    }

    // Sort by date (newest first)
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // ✅ Get Revenue Stats
  const getRevenueStats = () => {
    const baseRevenue = (revenueData.income || []).reduce(
      (sum, item) => sum + Number(item.amount || 0), 0
    );
    
    const securitiesTotal = (revenueData.securities || [])
      .filter(s => s.status === "Held")
      .reduce((sum, s) => sum + Number(s.amount || 0), 0);
    
    const totalExpenses = (revenueData.expenses || []).reduce(
      (sum, item) => sum + Number(item.amount || 0), 0
    );
    
    const totalRevenue = revenueData.includeSecurities ? baseRevenue + securitiesTotal : baseRevenue;
    
    return {
      totalRevenue,
      totalExpenses,
      baseRevenue,
      securitiesTotal,
      netProfit: totalRevenue - totalExpenses,
      includeSecurities: revenueData.includeSecurities,
    };
  };

  const value = useMemo(
    () => ({
      revenueData,
      setRevenueData,
      toggleSecurities,
      addIncome,
      addExpense,
      addSecurity,
      getSecurities,
      getTransactions,
      getRevenueStats,
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