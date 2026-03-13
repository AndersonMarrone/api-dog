import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-xl border bg-white px-4 py-2.5 text-slate-900
            placeholder:text-slate-400 transition-colors
            focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20
            dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500
            disabled:opacity-60
            ${error ? "border-red-400 focus:ring-red-400/20" : "border-slate-300"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
