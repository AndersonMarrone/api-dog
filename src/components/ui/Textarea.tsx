import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-primary-800 dark:text-primary-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full rounded-xl border bg-white px-4 py-2.5 text-primary-900
            placeholder:text-primary-400
            focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
            dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-100
            disabled:opacity-60 min-h-[100px]
            ${error ? "border-amber-500" : "border-primary-300"}
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

Textarea.displayName = "Textarea";
