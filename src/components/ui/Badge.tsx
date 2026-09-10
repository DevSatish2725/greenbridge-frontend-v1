import type { ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "info"
  | "neutral"
  | "negotiable";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-primary text-white",

  warning: "bg-accent-light text-warning",

  info: "bg-blue-50 text-info",

  neutral: "bg-surface-muted text-text-secondary",

  negotiable: "bg-primary-light text-primary",
};

export default function Badge({
  children,
  variant = "neutral",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        px-3 py-1
        text-sm font-medium
        ${variantStyles[variant]}
      `}
    >
      {children}
    </span>
  );
}