import type { InventoryDetailsProps } from "@/types/inventory.types";
import InventoryItemCard from "./InventoryItemCard";
import InventoryStatusBadge from "./InventoryStatusBadge";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useTranslations } from "next-intl";

export default function InventoryDetails({
  inventory,
  onEdit,
  onPublish,
  isPublishing,
  publishError,
}: InventoryDetailsProps) {
  const t = useTranslations("SellerInventory");
  const canEdit =
    inventory.status === "DRAFT" || inventory.status === "PUBLISHED";
  const publishErrorMessage = publishError
    ? getErrorMessage(publishError)
    : null;
  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e7d8b9] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-[#17201a]">
              {t("inventory")}
            </h2>

            <InventoryStatusBadge status={inventory.status} />
          </div>

          <p className="mt-2 text-sm text-[#536157]">
            {inventory.items.length === 1
              ? t("vegetableListedToday", { count: 1 })
              : t("vegetablesListedToday", { count: inventory.items.length })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl border border-[#159447] px-4 py-2 text-sm font-bold text-[#159447] transition hover:bg-[#edf8ef]"
            >
              {t("editInventory")}
            </button>
          )}

          {inventory.status === "DRAFT" && (
            <button
              type="button"
              onClick={onPublish}
              disabled={isPublishing}
              className="h-11 rounded-xl bg-[#159447] px-5 text-sm font-bold text-white hover:bg-[#107a3a]"
            >
              {isPublishing ? t("publishing") : t("publishInventory")}
            </button>
          )}
        </div>
      </div>

      {publishErrorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-red-700">
            {publishErrorMessage}
          </p>

          <p className="mt-1 text-xs text-red-600">
            {t("editBeforePublishing")}
          </p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {inventory.items.map((item) => (
          <InventoryItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
