import { useTranslations } from "next-intl";

export default function InventoryError() {
  const t = useTranslations("SellerInventory");
  const tc = useTranslations("Common");

  return (
    <section className="mt-8 rounded-2xl border border-red-200 bg-white p-6">
      <h2 className="font-bold text-[#17201a]">{t("unableToLoadInventory")}</h2>

      <p className="mt-2 text-sm text-red-600">{tc("pleaseTryAgain")}</p>
    </section>
  );
}
