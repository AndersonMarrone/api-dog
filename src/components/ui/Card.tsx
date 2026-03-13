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
        rounded-2xl border border-primary-200/60 bg-white shadow-lg
        dark:border-primary-800 dark:bg-primary-950/50
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
