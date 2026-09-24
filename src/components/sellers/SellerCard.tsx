import { getCallSellerId, SellerCardProps } from "@/types/seller.types";
import Image from "next/image";
import Link from "next/link";
import CallSellerButton from "../ui/CallSellerButton";
import { Bookmark, Package } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SellerCard({
  seller,
  isProcessing,
  isSaved,
  getCallSellerId,
  isLoading,
  handleSaveToggle,
  guestCallModalOpen,
}: {
  seller: SellerCardProps;
  isProcessing: boolean;
  isSaved?: boolean;
  getCallSellerId: getCallSellerId;
  isLoading: boolean;
  guestCallModalOpen: (sellerName: string, sellerId: string) => void;
  handleSaveToggle: (sellerId: string) => void;
}) {
  const t = useTranslations("FindSellers");
  const visibleVegetables = seller.vegetables.slice(0, 3);

  console.log("visibleVegetables", visibleVegetables);

  const remainingCount = seller.vegetables.length - visibleVegetables.length;

  const locationText = [
    seller.location?.village,
    seller.location?.district,
    seller.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className="
        rounded-2xl
        border border-border
        bg-surface
        p-3
        shadow-sm
        sm:p-4
      "
    >
      {/* Seller top section */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {/* Farmer avatar */}
          <div
            className="
              flex h-12 w-12 shrink-0
              items-center justify-center
              overflow-hidden rounded-xl
              bg-accent-light
              text-2xl
            "
          >
            👨‍🌾
          </div>

          <div className="min-w-0">
            {/* Name + verified */}
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="
                  truncate
                  text-sm
                  font-bold
                  text-text-primary
                  sm:text-base
                "
              >
                {seller.fullName}
              </h2>

              {seller.isVerified && (
                <span
                  className="
                    rounded-full
                    bg-primary
                    px-2 py-0.5
                    text-[10px]
                    font-semibold
                    text-white
                    sm:text-xs
                  "
                >
                  ✓ {t("sellers.verified")}
                </span>
              )}
            </div>

            {/* Location */}
            <div
              className="
                mt-1
                flex flex-wrap
                items-center
                gap-x-2
                gap-y-1
                text-[11px]
                text-text-secondary
                sm:text-xs
              "
            >
              {locationText && (
                <span className="truncate">📍 {locationText}</span>
              )}

              {seller.distanceInKm !== undefined && (
                <>
                  <span className="text-text-muted">•</span>

                  <span>
                    📍{" "}
                    {t("sellers.distanceAway", {
                      distance: seller.distanceInKm.toFixed(1),
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Rating */}
          <div className="shrink-0 text-right">
            {seller.ratingCount > 0 ? (
              <>
                <span className="text-[#efa536]">★</span>

                <span className="font-semibold text-[#17201a]">
                  {seller.averageRating.toFixed(1)}
                </span>

                <span className="text-[#536157]">({seller.ratingCount})</span>
              </>
            ) : (
              <span className="text-[#536157]">
                {t("sellers.noRatingsYet")}
              </span>
            )}
          </div>{" "}
          |
          <button
            type="button"
            onClick={() => handleSaveToggle(seller.sellerId)}
            disabled={isProcessing}
            aria-label={isSaved ? "Remove from saved sellers" : "Save seller"}
            title={isSaved ? "Remove saved seller" : "Save seller"}
            className="
      flex
      h-9
      w-9
      shrink-0
      justify-center
      items-center
      rounded-full
      transition
      hover:bg-primary-light
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
          >
            <Bookmark
              size={20}
              className={
                isSaved ? "fill-primary text-primary" : "text-text-secondary"
              }
            />
          </button>
        </div>
      </div>

      {/* Available today */}
      {/* Available vegetables */}
      <div
        className="
    mt-3
    rounded-xl
    border border-primary/10
    bg-surface-muted
    p-3
  "
      >
        {/* Section header */}
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="
          flex h-7 w-7 shrink-0
          items-center justify-center
          rounded-lg
          bg-primary-light
          text-primary
        "
            >
              <Package className="h-4 w-4" />
            </div>

              <p
                className="
            text-xs
            font-bold
            text-text-primary
            sm:text-sm
          "
              >
                {t("sellers.availableToday")}
              </p>
          </div>

          {remainingCount > 0 && (
            <Link
              href={`/sellers/${seller.sellerId}`}
              className="
          shrink-0
          rounded-full
          bg-primary-light
          px-2.5 py-1.5
          text-[10px]
          font-semibold
          text-success
          transition-colors
          hover:bg-primary/10
          sm:text-xs
        "
            >
              +{t("sellers.more", { count: remainingCount })} ›
            </Link>
          )}
        </div>

        {/* Vegetable preview cards */}
        <div
          className="
      grid
      grid-cols-1
      gap-2
      sm:grid-cols-3
    "
        >
          {visibleVegetables.map((vegetable) => (
            <div
              key={vegetable.id}
              className="
          flex
          min-w-0
          items-center
          gap-2.5
          rounded-xl
          border
          border-border/70
          bg-surface
          p-2
        "
            >
              {/* Vegetable image */}
              <div
                className="
            relative
            h-14 w-14
            shrink-0
            overflow-hidden
            rounded-lg
            bg-white
          "
              >
                {vegetable.imageUrl ? (
                  <Image
                    src={vegetable.imageUrl}
                    alt={vegetable.name}
                    fill
                    sizes="56px"
                    className="
                object-contain
                p-0.5
              "
                  />
                ) : (
                  <div
                    className="
                flex
                h-full w-full
                items-center justify-center
                text-2xl
              "
                  >
                    🥬
                  </div>
                )}
              </div>

              {/* Vegetable information */}
              <div className="min-w-0 flex-1">
                {/* Name */}
                <p
                  title={vegetable.name}
                  className="
              truncate
              text-xs
              font-bold
              leading-tight
              text-text-primary
              sm:text-sm
            "
                >
                  {vegetable.name}
                </p>

                {/* Price */}
                <div className="mt-1 flex items-baseline">
                  <span
                    className="
                text-base
                font-extrabold
                leading-none
                text-primary
                sm:text-lg
              "
                  >
                    ₹{vegetable.sellerPrice}
                  </span>

                  <span
                    className="
                ml-0.5
                text-[10px]
                font-medium
                text-text-secondary
                sm:text-xs
              "
                  >
                    /{vegetable.unit.toLowerCase()}
                  </span>
                </div>

                {/* Quantity */}
                <div
                  className="
              mt-1.5
              flex
              items-center
              gap-1.5
              text-[10px]
              text-text-secondary
              sm:text-[11px]
            "
                >
                  <Package
                    className="
                h-3.5 w-3.5
                shrink-0
                text-primary
              "
                    strokeWidth={2}
                  />

                  <span className="truncate">
                    <span className="font-semibold text-text-primary">
                      {vegetable.availableQty} {vegetable.unit.toLowerCase()}
                    </span>{" "}
                    {t("sellers.available")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <CallSellerButton
          sellerId={seller.sellerId}
          getCallSellerId={getCallSellerId}
          isLoading={isLoading}
          guestCallModalOpen={() =>
            guestCallModalOpen(seller.sellerId, seller.fullName)
          }
        />
        <Link
          href={`/sellers/${seller.sellerId}`}
          className="
            flex min-h-11
            items-center
            justify-center
            gap-2
            rounded-lg
            border border-accent
            bg-surface
            px-3
            text-sm
            font-bold
            text-warning
            transition-colors
            hover:bg-accent-light
          "
        >
          🏪 {t("sellers.viewShop")}
        </Link>
      </div>
    </article>
  );
}
