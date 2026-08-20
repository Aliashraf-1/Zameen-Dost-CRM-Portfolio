"use client";

import { useEffect, useState } from "react";
import {  Search, User, Settings, Calendar, Clock } from "lucide-react";

export default function DashboardHeader() {
  const [greeting, setGreeting] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

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

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-6 sm:p-8">
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
                Welcome back, Admin
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

         

          {/* Profile */}
          <button className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 transition hover:border-slate-700 hover:bg-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-medium text-indigo-400">
              A
            </div>
            <span className="hidden text-sm text-slate-300 sm:inline-block">
              Admin
            </span>
            <Settings size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}