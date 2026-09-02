"use client";

import { useState, useMemo } from "react";
import { useRevenue } from "@/context/RevenueContext";
import { useAuth } from "@/context/AuthContext";
import { useBuildings } from "@/context/BuildingContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AddIncomeModal from "@/components/revenue/AddIncomeModal";
import TransactionsModal from "@/components/revenue/TransactionsModal";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Printer,
  X,
} from "lucide-react";

// ✅ Reusable Modal for viewing details
function DetailModal({ isOpen, onClose, title, data, renderItem }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="font-semibold">{title}</h2>
              <p className="text-xs text-slate-500">{data?.length || 0} records found</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 max-h-[60vh]">
          {!data || data.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-8">No records found</p>
          ) : (
            <div className="space-y-3">
              {data.map((item, index) => renderItem(item, index))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RevenuePage() {
  const { revenueData, toggleSecurities, getTransactions, addIncome, getRevenueStats } = useRevenue();
  const { user } = useAuth();
  const { buildings } = useBuildings();

  const transactions = getTransactions();
  const stats = getRevenueStats();
  
  const [showSecurities, setShowSecurities] = useState(revenueData.includeSecurities || false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  
  // ✅ Modal states
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [showSecuritiesModal, setShowSecuritiesModal] = useState(false);
  const [showProfitLossModal, setShowProfitLossModal] = useState(false);

  // ✅ Use stats from getRevenueStats
  const totalIncome = stats.baseRevenue || 0;
  const totalExpenses = stats.totalExpenses || 0;
  const totalSecurities = stats.securitiesTotal || 0;
  const totalRevenue = stats.totalRevenue || 0;
  const profit = stats.netProfit || 0;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  // Top 5 recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // ✅ All expenses
  const allExpenses = revenueData.expenses || [];

  // ✅ All securities
  const allSecurities = revenueData.securities || [];

  const handleToggleSecurities = () => {
    setShowSecurities(!showSecurities);
    toggleSecurities();
  };

  const handleAddIncome = async (data) => {
    await addIncome(data);
  };

  // ✅ Open transactions modal
  const handleViewAllTransactions = () => {
    setShowTransactionsModal(true);
  };

  // ✅ Print function for profit/loss report
  const handlePrintProfitLoss = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Profit & Loss Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { text-align: center; color: #1e293b; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e293b; padding-bottom: 20px; }
              .section { margin: 20px 0; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
              .total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #1e293b; padding-top: 10px; margin-top: 10px; }
              .profit { color: #10b981; }
              .loss { color: #ef4444; }
              .securities-info { font-size: 0.9em; color: #64748b; margin-top: 10px; }
              @media print { body { padding: 20px; } .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Profit & Loss Report</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <p>Period: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              <p class="securities-info">${revenueData.includeSecurities ? '✅ Securities Included' : '❌ Securities Excluded'}</p>
            </div>
            <div class="section">
              <h2>Income</h2>
              <div class="row"><span>Total Income</span><span>Rs. ${totalIncome.toLocaleString()}</span></div>
              ${(revenueData.income || []).map(i => 
                `<div class="row" style="padding-left:20px;font-size:0.9em;">
                  <span>${i.category || i.type} - ${i.description || ''}</span>
                  <span>Rs. ${i.amount.toLocaleString()}</span>
                </div>`
              ).join('')}
              ${revenueData.includeSecurities && totalSecurities > 0 ? `
                <div class="row" style="padding-left:20px;font-size:0.9em;color:#f59e0b;">
                  <span>Securities (${allSecurities.filter(s => s.status === "Held").length} held)</span>
                  <span>Rs. ${totalSecurities.toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="row total">
                <span>Total Revenue</span>
                <span class="profit">Rs. ${totalRevenue.toLocaleString()}</span>
              </div>
            </div>
            <div class="section">
              <h2>Expenses</h2>
              <div class="row"><span>Total Expenses</span><span>Rs. ${totalExpenses.toLocaleString()}</span></div>
              ${(revenueData.expenses || []).map(e => 
                `<div class="row" style="padding-left:20px;font-size:0.9em;">
                  <span>${e.category || e.type} - ${e.description || ''}</span>
                  <span>Rs. ${e.amount.toLocaleString()}</span>
                </div>`
              ).join('')}
            </div>
            <div class="section">
              <div class="row total">
                <span>Net Profit / Loss</span>
                <span class="${profit >= 0 ? 'profit' : 'loss'}">${profit >= 0 ? '+' : '-'} Rs. ${Math.abs(profit).toLocaleString()}</span>
              </div>
              <div class="row" style="font-size:0.9em;">
                <span>Profit Margin</span>
                <span>${profitMargin.toFixed(1)}%</span>
              </div>
            </div>
            <div style="text-align:center;margin-top:40px;font-size:0.8em;color:#64748b;">
              Generated by Zameen Dost Marketing BMS
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <ProtectedRoute requiredRoles={["admin", "lead_manager", "moderator", "super_admin"]}>
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">Financial Management</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Revenue</h1>
            <p className="mt-2 text-sm text-slate-500">
              Track income, expenses, securities and profit/loss.
            </p>
          </div>
          <button
            onClick={() => setShowAddIncome(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
          >
            <Plus size={17} />
            Add Income
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Revenue */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <h2 className="mt-2 text-2xl font-bold text-emerald-400">
                  Rs. {totalRevenue.toLocaleString()}
                </h2>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <TrendingUp size={22} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <button
                onClick={handleToggleSecurities}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${
                  showSecurities
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {showSecurities ? (
                  <>
                    <Eye size={12} />
                    Securities Included
                  </>
                ) : (
                  <>
                    <EyeOff size={12} />
                    Securities Excluded
                  </>
                )}
              </button>
              {showSecurities && totalSecurities > 0 && (
                <span className="text-xs text-amber-400">
                  + Rs. {totalSecurities.toLocaleString()} securities
                </span>
              )}
            </div>
          </div>

          {/* Total Expenses */}
          <div 
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 cursor-pointer hover:border-slate-700 transition"
            onClick={() => setShowExpensesModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Expenses</p>
                <h2 className="mt-2 text-2xl font-bold text-red-400">
                  Rs. {totalExpenses.toLocaleString()}
                </h2>
              </div>
              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <TrendingDown size={22} />
              </div>
            </div>
            <button className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition">
              View Details →
            </button>
          </div>

          {/* Securities */}
          <div 
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 cursor-pointer hover:border-slate-700 transition"
            onClick={() => setShowSecuritiesModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Securities Held</p>
                <h2 className="mt-2 text-2xl font-bold text-amber-400">
                  Rs. {totalSecurities.toLocaleString()}
                </h2>
                <p className="text-xs text-slate-500">
                  {allSecurities.filter(s => s.status === "Held").length} held securities
                </p>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                <Wallet size={22} />
              </div>
            </div>
            <button className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition">
              View Securities →
            </button>
          </div>

          {/* Profit/Loss */}
          <div 
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 cursor-pointer hover:border-slate-700 transition"
            onClick={() => setShowProfitLossModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Net Profit/Loss</p>
                <h2 className={`mt-2 text-2xl font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {profit >= 0 ? "+" : "-"} Rs. {Math.abs(profit).toLocaleString()}
                </h2>
                <p className="text-xs text-slate-500">
                  {profitMargin.toFixed(1)}% margin
                </p>
              </div>
              <div className={`rounded-xl p-3 ${profit >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {profit >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
              </div>
            </div>
            <button className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition">
              View Report →
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <p className="text-xs text-slate-500">Latest financial activities</p>
            </div>
            {/* ✅ View All Button - Now Functional */}
            <button
              onClick={handleViewAllTransactions}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-8">No transactions yet</p>
            ) : (
              recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/30 p-3 transition hover:bg-slate-950/50 cursor-pointer"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${
                      tx.type === "Income" 
                        ? "bg-emerald-500/10 text-emerald-400"
                        : tx.type === "Expense"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {tx.type === "Income" ? (
                        <ArrowUpRight size={16} />
                      ) : tx.type === "Expense" ? (
                        <ArrowDownRight size={16} />
                      ) : (
                        <Wallet size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description || tx.type}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}
                      </p>
                      {tx.employeeName && (
                        <p className="text-xs text-slate-500">Employee: {tx.employeeName}</p>
                      )}
                      {tx.unitNo && (
                        <p className="text-xs text-slate-500">Unit: {tx.unitNo}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.type === "Income" ? "text-emerald-400" : tx.type === "Expense" ? "text-red-400" : "text-amber-400"}`}>
                      {tx.type === "Expense" ? "-" : "+"} Rs. {tx.amount.toLocaleString()}
                    </p>
                    {tx.category && (
                      <p className="text-xs text-slate-500">{tx.category}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ✅ Add Income Modal */}
      {showAddIncome && (
        <AddIncomeModal
          onClose={() => setShowAddIncome(false)}
          onSave={handleAddIncome}
        />
      )}

      {/* ✅ Transactions Modal - All Transactions */}
      {showTransactionsModal && (
        <TransactionsModal
          isOpen={showTransactionsModal}
          onClose={() => setShowTransactionsModal(false)}
          transactions={transactions}
        />
      )}

      {/* ✅ Expenses Modal */}
      <DetailModal
        isOpen={showExpensesModal}
        onClose={() => setShowExpensesModal(false)}
        title="Expenses Details"
        data={allExpenses}
        renderItem={(exp, index) => (
          <div key={index} className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-200">{exp.category || exp.type}</p>
                <p className="text-xs text-slate-500">{exp.description || 'No description'}</p>
                <p className="text-xs text-slate-500">Paid to: {exp.paidTo || 'N/A'}</p>
                {exp.employeeName && (
                  <p className="text-xs text-slate-500">Employee: {exp.employeeName}</p>
                )}
                <p className="text-xs text-slate-500">{new Date(exp.createdAt).toLocaleString()}</p>
              </div>
              <p className="font-bold text-red-400">- Rs. {exp.amount.toLocaleString()}</p>
            </div>
          </div>
        )}
      />

      {/* ✅ Securities Modal */}
      <DetailModal
        isOpen={showSecuritiesModal}
        onClose={() => setShowSecuritiesModal(false)}
        title="Securities Details"
        data={allSecurities}
        renderItem={(sec, index) => (
          <div key={index} className="rounded-xl border border-slate-800 bg-slate-950/30 p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-200">{sec.description || 'Security'}</p>
                <p className="text-xs text-slate-500">Tenant: {sec.tenantName || 'N/A'}</p>
                <p className="text-xs text-slate-500">Unit: {sec.unitNo || 'N/A'} - {sec.buildingNo || 'N/A'}</p>
                <p className="text-xs text-slate-500">Status: {sec.status || 'Held'}</p>
                {sec.returnDate && (
                  <p className="text-xs text-slate-500">Returned: {new Date(sec.returnDate).toLocaleDateString()}</p>
                )}
                {sec.remarks && (
                  <p className="text-xs text-slate-500">Remarks: {sec.remarks}</p>
                )}
                <p className="text-xs text-slate-500">{new Date(sec.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-400">+ Rs. {sec.amount.toLocaleString()}</p>
                {sec.returnedAmount && (
                  <p className="text-xs text-slate-500">Returned: Rs. {sec.returnedAmount.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        )}
      />

      {/* ✅ Profit/Loss Report Modal */}
      <DetailModal
        isOpen={showProfitLossModal}
        onClose={() => setShowProfitLossModal(false)}
        title="Profit & Loss Report"
        data={[{ profit, profitMargin, totalRevenue, totalIncome, totalExpenses, totalSecurities }]}
        renderItem={(report, index) => (
          <div key={index} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                <p className="text-xs text-slate-500">Total Revenue</p>
                <p className="text-lg font-bold text-emerald-400">Rs. {report.totalRevenue.toLocaleString()}</p>
                {report.totalSecurities > 0 && (
                  <p className="text-xs text-amber-400">+ Rs. {report.totalSecurities.toLocaleString()} securities</p>
                )}
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center">
                <p className="text-xs text-slate-500">Total Expenses</p>
                <p className="text-lg font-bold text-red-400">Rs. {report.totalExpenses.toLocaleString()}</p>
              </div>
              <div className={`rounded-xl border p-3 text-center ${report.profit >= 0 ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                <p className="text-xs text-slate-500">Net Profit / Loss</p>
                <p className={`text-lg font-bold ${report.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {report.profit >= 0 ? '+' : '-'} Rs. {Math.abs(report.profit).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Margin: {report.profitMargin.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span>Income Details</span>
                <span className="text-xs text-slate-500">({revenueData.income?.length || 0} entries)</span>
              </h4>
              {(revenueData.income || []).map((inc, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-slate-800 pb-1">
                  <span className="text-slate-400">{inc.category || inc.type} - {inc.description || ''}</span>
                  <span className="text-emerald-400">Rs. {inc.amount.toLocaleString()}</span>
                </div>
              ))}
              {revenueData.includeSecurities && totalSecurities > 0 && (
                <div className="flex justify-between text-sm border-b border-amber-500/20 pb-1">
                  <span className="text-amber-400">Securities ({allSecurities.filter(s => s.status === "Held").length} held)</span>
                  <span className="text-amber-400">Rs. {totalSecurities.toLocaleString()}</span>
                </div>
              )}
              
              <h4 className="text-sm font-medium text-slate-300 mt-4 flex items-center gap-2">
                <span>Expense Details</span>
                <span className="text-xs text-slate-500">({revenueData.expenses?.length || 0} entries)</span>
              </h4>
              {(revenueData.expenses || []).map((exp, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-slate-800 pb-1">
                  <span className="text-slate-400">{exp.category || exp.type} - {exp.description || ''}</span>
                  <span className="text-red-400">Rs. {exp.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={handlePrintProfitLoss}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 w-full"
            >
              <Printer size={17} />
              Print Report
            </button>
          </div>
        )}
      />
    </ProtectedRoute>
  );
}