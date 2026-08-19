"use client";

import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const [greeting, setGreeting] = useState("");
  const [date, setDate] = useState("");

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
  }, []);

  return (
    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 text-sm font-medium text-indigo-400">
          {greeting}
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, Admin 
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Here&apos;s what&apos;s happening with your properties today.
        </p>
      </div>

      <p className="text-sm text-slate-500">
        {date}
      </p>
    </div>
  );
}