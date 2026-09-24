import { CheckCircle2 } from "lucide-react";

export default function SellerApplicationStatusBadge({
  status,
}: {
  status: string;
}) {
  const label = status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <span
      className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-primary
                    px-2.5 py-1
                    text-xs
                    font-semibold
                    text-white
                  "
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
