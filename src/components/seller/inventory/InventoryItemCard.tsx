import type {
  InventoryItem,
} from "@/types/inventory.types";
import { useTranslations } from "next-intl";

export default function InventoryItemCard({
  item,
}: {
  item: InventoryItem;
  }) {
  const t = useTranslations("SellerInventory");
  return (
    <article className="rounded-2xl border border-[#e7d8b9] bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#7a857d]">
            {t("vegetable")}
          </p>

          <h3 className="mt-1 font-bold text-[#17201a]">
            {item.vegetableId.name}  
          </h3>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#536157]">
            <span>
              {t("price")}: ₹{item.sellerPrice}/
              {item.unit}
            </span>

            <span>
              {t("available")}:{" "}
              {item.availableQty}{" "}
              {item.unit}
            </span>

            <span>
              {t("market")}: ₹{item.marketPrice}/
              {item.unit}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}