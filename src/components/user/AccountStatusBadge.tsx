import { AccountStatusBadgeProps } from "@/types/profile.types";

export default function AccountStatusBadge({
  status,
}: AccountStatusBadgeProps) {
  const styles =
    status === "ACTIVE"
      ? "bg-primary-light text-primary"
      : status === "SUSPENDED"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-600";

  const label = status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-bold
        ${styles}
      `}
    >
      <span
        className={`
          mr-2
          h-2
          w-2
          rounded-full
          ${
            status === "ACTIVE"
              ? "bg-primary"
              : status ===
                  "SUSPENDED"
                ? "bg-amber-500"
                : "bg-red-500"
          }
        `}
      />

      {label}
    </span>
  );
}