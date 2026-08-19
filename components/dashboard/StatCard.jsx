import Link from "next/link";

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  href,
}) {
  const content = (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 transition group-hover:bg-indigo-500/20">
          <Icon size={21} />
        </div>
      </div>

      {description && (
        <p className="mt-4 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );

  return href ? (
    <Link href={href}>{content}</Link>
  ) : (
    content
  );
}