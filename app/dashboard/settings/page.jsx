"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import axios from "axios";
import {
  Settings,
  Save,
  RefreshCw,
  Building2,
  Users,
  Wallet,
  Bell,
  Shield,
  FileText,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);

  // ✅ Fetch settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('bms-token')}` }
      });
      setSettings(response.data.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await axios.put('/api/settings', settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bms-token')}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to default?')) return;

    try {
      await axios.post('/api/settings/reset', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bms-token')}` }
      });
      await fetchSettings();
    } catch (error) {
      setError('Failed to reset settings.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  if (!settings) return null;

  const categories = [
    {
      id: 'general',
      label: 'General',
      icon: Settings,
      fields: [
        { key: 'companyName', label: 'Company Name', type: 'text' },
        { key: 'companyAddress', label: 'Company Address', type: 'text' },
        { key: 'companyPhone', label: 'Company Phone', type: 'text' },
        { key: 'companyEmail', label: 'Company Email', type: 'email' },
        { key: 'currency', label: 'Currency', type: 'text' },
        { key: 'dateFormat', label: 'Date Format', type: 'text' },
      ]
    },
    {
      id: 'employee',
      label: 'Employee',
      icon: Users,
      fields: [
        { key: 'defaultLeaveDeduction', label: 'Default Leave Deduction (Rs.)', type: 'number' },
        { key: 'defaultLateDeduction', label: 'Default Late Deduction (Rs./min)', type: 'number' },
        { key: 'defaultTaskFailureDeduction', label: 'Default Task Failure Deduction (Rs.)', type: 'number' },
        { key: 'graceMinutes', label: 'Grace Minutes', type: 'number' },
        { key: 'weeklyOffDay', label: 'Weekly Off Day', type: 'text' },
        { key: 'monthlyPaidLeaves', label: 'Monthly Paid Leaves', type: 'number' },
      ]
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: Wallet,
      fields: [
        { key: 'defaultRentDueDate', label: 'Default Rent Due Date', type: 'number' },
        { key: 'lateRentPenalty', label: 'Late Rent Penalty (Rs.)', type: 'number' },
        { key: 'securityMonths', label: 'Security Months', type: 'number' },
      ]
    },
  ];

  return (
    <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">Administration</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage application settings and configurations.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <RefreshCw size={17} />
              Reset to Default
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        {/* Success/Error */}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-400">
            <CheckCircle2 size={17} />
            Settings saved successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Categories */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const catData = settings[category.id] || {};

            return (
              <div
                key={category.id}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
                    <Icon size={18} />
                  </div>
                  <h2 className="font-semibold">{category.label}</h2>
                </div>

                <div className="space-y-4">
                  {category.fields.map((field) => (
                    <div key={field.key}>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={catData[field.key] || ''}
                        onChange={(e) => {
                          const val = field.type === 'number' ? Number(e.target.value) : e.target.value;
                          handleChange(category.id, field.key, val);
                        }}
                        className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}