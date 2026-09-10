import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          min-h-12
          w-full
          rounded-lg
          border
          bg-surface
          px-4
          text-base
          text-text-primary
          outline-none
          transition-colors
          placeholder:text-text-muted
          ${
            error
              ? "border-error focus:border-error"
              : "border-border focus:border-primary"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}