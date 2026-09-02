"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/context/UserContext";
import { Search, User, Settings, Calendar, Clock, UserPlus, Users, LogOut, ChevronDown } from "lucide-react";
import AddUserModal from "@/components/users/AddUserModal";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const { addUser } = useUsers();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const dropdownRef = useRef(null);

  const canManageUsers = user?.role === "admin" || user?.role === "super_admin";

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }

    setDate(
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date())
    );

    setTime(
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date())
    );
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleAddUser = async (userData) => {
    await addUser(userData);
    setShowAddUserModal(false);
  };

  const handleUsersManagement = () => {
    router.push("/dashboard/users");
    setShowDropdown(false);
  };

  const handleAddUserClick = () => {
    setShowAddUserModal(true);
    setShowDropdown(false);
  };

  return (
    <>
      {/* ✅ Removed overflow-hidden from card */}
      <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-6 sm:p-8">
        {/* Background Decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Side */}
          <div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-indigo-400">{greeting}</p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back, {user?.name || "Admin"}
                </h1>
              </div>
            </div>

            <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <span>Here's what's happening with your properties today.</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:inline-block" />
              <span className="hidden items-center gap-1 text-xs text-slate-500 sm:flex">
                <Clock size={12} />
                {time}
              </span>
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Date */}
            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-400 md:flex">
              <Calendar size={15} />
              <span>{date}</span>
            </div>

            {/* Search */}
            <button className="rounded-xl border border-slate-800 bg-slate-950/50 p-2 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white">
              <Search size={18} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-medium text-indigo-400">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <span className="hidden text-sm text-slate-300 sm:inline-block">
                  {user?.name || "Admin"}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-500 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu - Now not clipped */}
              {showDropdown && (
                <div 
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-700 bg-slate-800 shadow-2xl overflow-hidden"
                  style={{ zIndex: 9999 }}
                >
                  <div className="p-2 space-y-1">
                    {/* User Info */}
                    <div className="px-3 py-2 border-b border-slate-700">
                      <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                      <span className="mt-1 inline-block rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                        {user?.role?.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Add User - Only for Admin */}
                    {canManageUsers && (
                      <button
                        onClick={handleAddUserClick}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
                      >
                        <UserPlus size={16} className="text-indigo-400" />
                        Add User
                      </button>
                    )}

                    {/* Users Management - Only for Admin */}
                    {canManageUsers && (
                      <button
                        onClick={handleUsersManagement}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
                      >
                        <Users size={16} className="text-indigo-400" />
                        Users Management
                      </button>
                    )}

                    {/* Settings */}
                    <button
                      onClick={() => {
                        router.push("/dashboard/settings");
                        setShowDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
                    >
                      <Settings size={16} className="text-slate-400" />
                      Settings
                    </button>

                    {/* Divider */}
                    <div className="border-t border-slate-700 my-1" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSave={handleAddUser}
        />
      )}
    </>
  );
}