import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-200 bg-white shadow-sm
        transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
        dark:border-slate-700 dark:bg-slate-800/60
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
