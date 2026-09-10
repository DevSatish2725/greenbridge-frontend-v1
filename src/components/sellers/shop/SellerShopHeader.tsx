"use client";

import Image from "next/image";
import {
  Bookmark,
  CheckCircle2,
  Leaf,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";
import CallSellerButton from "@/components/ui/CallSellerButton";

interface SellerShopHeaderProps {
  seller: {
    name: string;
    bannerImage?: string;
    profileImage?: string;
    location: {
      village?: string;
      district?: string;
      state?: string;
      pincode?: string;
    };

    reputation: {
      averageRating: number;
    };
  };

  sellerId: string;
  isLoading: boolean;
  getCallSellerId: (sellerId: string) => void;
  guestCallModalOpen: (sellerId: string, sellerName: string) => void;

  onSave: () => void;
  onWhatsApp: () => void;
}

export default function SellerShopHeader({
  seller,
  sellerId,
  isLoading,
  getCallSellerId,
  guestCallModalOpen,
  onSave,
  onWhatsApp,
}: SellerShopHeaderProps) {
  const locationText = [
    seller?.location?.village,
    seller?.location?.district,
    seller?.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border border-border
        bg-white
        shadow-sm
      "
    >
      {/* Banner */}
      <div
        className="
          relative
          overflow-hidden
          bg-primary-light
          h-28 sm:h-32 lg:h-36
        "
      >
        {seller?.bannerImage ? (
          <Image
            src={seller.bannerImage}
            alt={`${seller.name} farm`}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div
            className="
              flex h-full
              items-center
              justify-center
              bg-linear-to-r
              from-primary-light
              via-[#f8f7dd]
              to-accent-light
            "
          >
            <div className="text-center">
              <Leaf
                className="
                  mx-auto h-9 w-9
                  text-primary
                "
              />

              <p
                className="
                  mt-2
                  text-xl font-bold
                  text-primary
                "
              >
                Fresh Vegetables
              </p>

              <p className="text-sm text-text-secondary">
                Direct from farm to families
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main seller content */}
      <div className="px-4 pb-5 sm:px-6">
        <div
          className="
            flex flex-col
            gap-5

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Seller identity */}
          <div
            className="
              flex items-start
              gap-4
            "
          >
            <div
              className="
                relative
                -mt-10
                h-24 w-24
                shrink-0
                overflow-hidden
                rounded-full
                border-4
                border-white
                bg-primary-light
                shadow-md
                sm:h-28
                sm:w-28
              "
            >
              {seller?.profileImage ? (
                <Image
                  src={seller.profileImage}
                  alt={seller.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="
                    flex h-full
                    items-center
                    justify-center
                    text-4xl
                  "
                >
                  👨‍🌾
                </div>
              )}
            </div>

            <div className="min-w-0 pt-3">
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
                Verified
              </span>
              <div
                className="
                  mt-2
                  flex flex-wrap
                  items-center
                  gap-x-3
                  gap-y-1
                "
              >
                <h1
                  className="
                  text-md
                    font-bold
                    text-text-primary
                  "
                >
                  {seller?.name}
                </h1>

                <div
                  className="
                    flex items-center
                    gap-1
                  "
                >
                  <Star
                    className="
                      h-5 w-5
                      fill-warning
                      text-warning
                    "
                  />

                  <span className="font-bold">
                    {seller?.reputation?.averageRating.toFixed(1)}
                  </span>
                  {/* TODO: Implement total review count */}
                </div>
              </div>

              {locationText && (
                <div
                  className="
                    mt-2
                    flex items-center
                    gap-1.5
                    text-sm
                    text-text-secondary
                  "
                >
                  <MapPin className="h-4 w-4" />
                  <span>{locationText}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="
            mt-5
            grid grid-cols-[auto_1fr_1fr]
            gap-2
          "
        >
          <button
            type="button"
            onClick={onSave}
            className="
              flex min-h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              border border-border
              px-4
              font-semibold
              transition
              hover:bg-surface-muted
            "
          >
            <Bookmark className="h-5 w-5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <CallSellerButton
            sellerId={sellerId}
            isLoading={isLoading}
            getCallSellerId={getCallSellerId}
            guestCallModalOpen={() => guestCallModalOpen(sellerId, seller.name)}
          />
          <button
            type="button"
            onClick={onWhatsApp}
            className="
              flex min-h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              border border-primary
              bg-primary-light
              px-4
              font-bold
              text-primary
              transition
              hover:bg-primary/10
            "
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className="
        flex items-center
        gap-2.5
        rounded-xl
        bg-primary-light
        px-3 py-3
      "
    >
      <div
        className="
          shrink-0
          [&>svg]:h-5
          [&>svg]:w-5
          [&>svg]:text-primary
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-xs font-bold
            text-text-primary
          "
        >
          {value}
        </p>

        <p
          className="
            text-[11px]
            text-text-secondary
          "
        >
          {label}
        </p>
      </div>
    </div>
  );
}
