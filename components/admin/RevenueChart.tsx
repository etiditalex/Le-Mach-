"use client";

import { useState } from "react";
import { CalendarDays, TrendingDown, TrendingUp } from "lucide-react";
import { formatKsh } from "@/lib/admin-display";
import { adminCardClass } from "@/components/admin/admin-styles";

export type RevenuePoint = {
  key: string;
  label: string;
  paidKes: number;
};

function niceMax(value: number) {
  if (value <= 0) return 4;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const fraction = value / exp;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * exp;
}

function axisLabel(n: number) {
  if (n >= 1_000_000) {
    const scaled = n / 1_000_000;
    return `${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}M`;
  }
  if (n >= 1000) {
    const scaled = n / 1000;
    return `${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}K`;
  }
  return `${Math.round(n)}`;
}

function formatDay(key: string) {
  const date = new Date(`${key}T12:00:00+03:00`);
  if (Number.isNaN(date.getTime())) return key;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(date);
}

export default function RevenueChart({
  points,
  totalKes,
  change,
}: {
  points: RevenuePoint[];
  totalKes: number;
  change: number | null;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 560;
  const height = 214;
  const padL = 42;
  const padR = 10;
  const padT = 14;
  const padB = 28;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const series = points.length > 0 ? points : [{ key: "", label: "", paidKes: 0 }];
  const maxValue = Math.max(...series.map((point) => point.paidKes), 0);
  const ceiling = niceMax(maxValue);
  const slot = plotW / series.length;
  const barW = Math.min(32, slot * 0.48);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  const changeUp = change != null && change > 0;
  const changeDown = change != null && change < 0;

  return (
    <section className={`${adminCardClass} p-5 sm:p-6`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900">Paid revenue</h2>
          <p className="mt-0.5 text-xs text-gray-500">Room service and room bookings marked paid</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
          Last 7 days
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <p className="text-[28px] font-semibold leading-none tracking-tight text-gray-900 tabular-nums sm:text-[32px]">
          {formatKsh(totalKes)}
        </p>
        {change != null && (
          <p
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              changeUp ? "text-emerald-600" : changeDown ? "text-red-600" : "text-gray-500"
            }`}
          >
            {changeUp ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            ) : changeDown ? (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            ) : null}
            {Math.round(Math.abs(change))}% from the previous 7 days
          </p>
        )}
      </div>

      <div className="relative mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-labelledby="paid-revenue-chart-title">
          <title id="paid-revenue-chart-title">Paid revenue for the last 7 days</title>
          {ticks.map((tick) => {
            const y = padT + plotH - tick * plotH;
            const value = ceiling * tick;
            return (
              <g key={tick}>
                <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#E6E8EE" strokeDasharray="4 4" />
                <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">
                  {axisLabel(value)}
                </text>
              </g>
            );
          })}
          {series.map((point, index) => {
            const x = padL + slot * index + (slot - barW) / 2;
            const barH = point.paidKes > 0 ? Math.max(4, (point.paidKes / ceiling) * plotH) : 0;
            const y = padT + plotH - barH;
            const active = hover === index;
            return (
              <g key={`${point.key}-${index}`}>
                {active && (
                  <rect
                    x={padL + slot * index + slot * 0.12}
                    y={padT}
                    width={slot * 0.76}
                    height={plotH}
                    rx="12"
                    fill="#F3F4F6"
                  />
                )}
                {barH > 0 && <rect x={x} y={y} width={barW} height={barH} rx="7" fill={active ? "#FF4D6D" : "#E31837"} />}
                <text x={padL + slot * index + slot / 2} y={height - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF">
                  {point.label}
                </text>
                <rect
                  x={padL + slot * index}
                  y={padT}
                  width={slot}
                  height={plotH + 18}
                  fill="transparent"
                  className="focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
                  tabIndex={0}
                  role="button"
                  aria-label={`${formatDay(point.key)}, revenue ${formatKsh(point.paidKes)}`}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover((current) => (current === index ? null : current))}
                  onFocus={() => setHover(index)}
                  onBlur={() => setHover((current) => (current === index ? null : current))}
                />
              </g>
            );
          })}
        </svg>

        {hover != null && series[hover] && (
          <div
            className="pointer-events-none absolute z-10 w-max max-w-[180px] rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg"
            style={{
              left: `${((padL + slot * hover + slot / 2) / width) * 100}%`,
              top: 0,
              transform: hover >= series.length - 2 ? "translateX(-88%)" : hover === 0 ? "translateX(-12%)" : "translateX(-50%)",
            }}
          >
            <p className="text-[11px] text-gray-500">{formatDay(series[hover].key)}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-800">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
              Revenue: {formatKsh(series[hover].paidKes)}
            </p>
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Paid revenue by day</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Paid revenue</th>
          </tr>
        </thead>
        <tbody>
          {series.map((point) => (
            <tr key={point.key || point.label}>
              <td>{formatDay(point.key)}</td>
              <td>{formatKsh(point.paidKes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
