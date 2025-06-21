"use client";

import * as React from "react";

interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
  value: number;
  strokeWidth?: number;
}

export function CircularProgress({
  value,
  strokeWidth = 10,
  ...props
}: CircularProgressProps) {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  let colorClass = "stroke-green-500";
  if (value > 40) colorClass = "stroke-yellow-500";
  if (value > 70) colorClass = "stroke-red-500";

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" {...props}>
      <circle
        className="stroke-muted"
        strokeWidth={strokeWidth}
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
      />
      <circle
        className={`transition-[stroke-dashoffset] duration-500 ease-out ${colorClass}`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground font-bold text-3xl"
      >
        {`${Math.round(value)}%`}
      </text>
    </svg>
  );
}
