"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  href,
  trend,
}) {
  const content = (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className="mt-2 flex items-end gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
            {trend && (
              <div
                className={`flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-xs font-medium ${
                  trend.positive !== undefined
                    ? trend.positive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {trend.positive !== undefined ? (
                  trend.positive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )
                ) : null}
                {trend.value}%
              </div>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition group-hover:scale-110 group-hover:bg-indigo-500/20">
          <Icon size={22} />
        </div>
      </div>

      {trend && trend.label && (
        <div className="mt-3 flex items-center gap-1 border-t border-slate-800 pt-3 text-xs text-slate-500">
          <span className="text-slate-400">↳</span>
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}