import Link from "next/link";
import type { ReactNode } from "react";
import { adminCardClass } from "@/components/admin/admin-styles";

export function Sparkline({ values, color, label }: { values: number[]; color: string; label: string }) {
  const w = 78;
  const h = 34;
  const series = values.length > 0 ? values : [0];
  const max = Math.max(...series, 1);
  const coords = series.map((v, i) => {
    const x = series.length === 1 ? w / 2 : (i / (series.length - 1)) * (w - 2) + 1;
    const y = h - 4 - (Math.max(0, v) / max) * (h - 10);
    return [x, y] as const;
  });
  const line = coords.map((c) => c.join(",")).join(" ");
  const area = `${line} ${w},${h} 0,${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} className="shrink-0">
      <polygon points={area} fill={color} opacity="0.14" />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MetricCard({
  label,
  value,
  icon,
  iconClassName,
  href,
  spark,
  live = false,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  iconClassName: string;
  href?: string;
  spark?: ReactNode;
  live?: boolean;
}) {
  const className = `${adminCardClass} flex min-h-[138px] flex-col p-4 ${
    href ? "transition-shadow hover:shadow-[0_12px_32px_rgba(16,24,40,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35" : ""
  }`;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${iconClassName}`}>{icon}</span>
        <div className="flex h-10 w-[78px] items-start justify-end">{spark}</div>
      </div>
      <p className="mt-3 text-[26px] font-semibold leading-none tracking-tight text-gray-900 tabular-nums" aria-live={live ? "polite" : undefined}>
        {value}
      </p>
      <p className="mt-2 text-[13px] leading-4 text-gray-500">{label}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}
