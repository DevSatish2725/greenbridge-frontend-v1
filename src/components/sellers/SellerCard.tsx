import { getCallSellerId, SellerCardProps } from "@/types/seller.types";
import Image from "next/image";
import Link from "next/link";
import CallSellerButton from "../ui/CallSellerButton";

const vegetableEmoji: Record<string, string> = {
  Tomato: "🍅",
  Potato: "🥔",
  Onion: "🧅",
  Carrot: "🥕",
  Cabbage: "🥬",
  Chilli: "🌶️",
  Cucumber: "🥒",
  Eggplant: "🍆",
};

export default function SellerCard({
  seller,
  getCallSellerId,
  isLoading,
  guestCallModalOpen,
}: {
  seller: SellerCardProps;
  getCallSellerId: getCallSellerId;
  isLoading: boolean;
  guestCallModalOpen: (sellerName: string, sellerId: string) => void;
}) {
  const visibleVegetables = seller.vegetables.slice(0, 3);

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
                  ✓ Verified
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

                  <span>📍 {seller.distanceInKm.toFixed(1)} km away</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="shrink-0 text-right">
          {seller.reputation?.averageRating !== undefined && (
            <p
              className="
                text-sm
                font-bold
                text-warning
                sm:text-base
              "
            >
              ★{" "}
              <span className="text-text-primary">
                {seller.reputation.averageRating.toFixed(1)}
              </span>
            </p>
          )}

          {seller.reputation?.totalDeals !== undefined && (
            <p
              className="
                mt-0.5
                text-[10px]
                text-text-muted
                sm:text-xs
              "
            >
              {seller.reputation.totalDeals} deals
            </p>
          )}
        </div>
      </div>

      {/* Available today */}
      <div
        className="
          mt-3
          rounded-xl
          bg-surface-muted
          p-2.5
        "
      >
        <div
          className="
            mb-2
            flex items-center
            justify-between
            gap-2
          "
        >
          <p
            className="
              text-xs
              font-bold
              text-success
              sm:text-sm
            "
          >
            🌱 Available Today
          </p>

          {remainingCount > 0 && (
            <Link
              href={`/sellers/${seller.sellerId}`}
              className="
                rounded-full
                bg-primary-light
                px-2.5
                py-1
                text-[10px]
                font-semibold
                text-success
                transition-colors
                hover:bg-background
                sm:text-xs
              "
            >
              +{remainingCount} more ›
            </Link>
          )}
        </div>

        {/* Vegetables */}
        <div className="grid grid-cols-3 gap-2">
          {visibleVegetables.map((vegetable) => (
            <div
              key={vegetable.id}
              className="
                  flex min-w-0
                  items-center
                  gap-2
                  rounded-lg
                  bg-surface
                  p-2
                  shadow-sm
                "
            >
              {/* Vegetable image */}
              <div
                className="
                    flex h-11 w-11
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-lg
                    text-2xl
                    sm:h-12 sm:w-12
                  "
              >
                {vegetable.image ? (
                  <Image
                    src={vegetable.image}
                    alt={vegetable.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true">
                    {vegetableEmoji[vegetable.name] ?? "🥬"}
                  </span>
                )}
              </div>

              {/* Vegetable information */}
              <div className="min-w-0">
                <p
                  className="
                      truncate
                      text-[11px]
                      font-bold
                      text-text-primary
                      sm:text-xs
                    "
                >
                  {vegetable.name}
                </p>

                <p
                  className="
                      mt-0.5
                      whitespace-nowrap
                      text-xs
                      font-bold
                      text-primary
                      sm:text-sm
                    "
                >
                  ₹{vegetable.sellerPrice}
                  <span
                    className="
                        font-medium
                        text-text-secondary
                      "
                  >
                    /{vegetable.unit.toLowerCase()}
                  </span>
                </p>

                <span
                  className="
                      mt-1
                      inline-block
                      whitespace-nowrap
                      rounded
                      bg-primary-light
                      px-1.5
                      py-0.5
                      text-[8px]
                      font-medium
                      text-success
                      sm:text-[9px]
                    "
                >
                  {vegetable.availableQty} {vegetable.unit.toLowerCase()}{" "}
                  available
                </span>
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
          guestCallModalOpen={() => guestCallModalOpen(seller.sellerId, seller.fullName)}
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
          🏪 View Shop
        </Link>
      </div>
    </article>
  );
}
