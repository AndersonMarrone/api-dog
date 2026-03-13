import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-md",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-200 dark:hover:bg-slate-700",
  outline:
    "border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300",
  ghost:
    "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-md",
};

export function Button({
  variant = "primary",
  children,
  fullWidth,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold
        transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
