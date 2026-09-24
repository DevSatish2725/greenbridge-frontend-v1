export default function InventoryStatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "PUBLISHED"
      ? "bg-[#edf8ef] text-[#159447]"
      : status === "DRAFT"
        ? "bg-[#fff3dc] text-[#d97706]"
        : "bg-gray-100 text-gray-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles}`}
    >
      {status === "PUBLISHED"
        ? "Published"
        : status === "DRAFT"
          ? "Draft"
          : "Archived"}
    </span>
  );
}