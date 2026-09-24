"use client";

import { useMemo, useState } from "react";

import { Leaf, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import SellerShopHeader from "@/components/sellers/shop/SellerShopHeader";
import VegetableCard from "@/components/sellers/shop/VegetableCard";
import { useQuery } from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import { SellerShopData } from "@/types/seller-shop.types";
import GuestCallModal from "@/components/sellers/GuestCallModal";
import CallSellerCard from "@/components/sellers/CallSellerCard";
import { sellerRatingService } from "@/services/seller-rating.service";
import { useAuth } from "@/providers/AuthProvider";
import SellerRatingSection from "@/components/seller-rating/SellerRatingSection";
import { useSaveSeller } from "@/hooks/useSaveSeller";
import { savedSellerService } from "@/services/saved-seller.service";
import { useTranslations } from "next-intl";
import { VegetableResponse } from "@/types/vegetable.types";

export default function SellerShopPage() {
  const [search, setSearch] = useState("");
  const [callSellerId, setCallSellerId] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<{
    sellerId: string;
    sellerName: string;
  } | null>(null);

  const params = useParams<{
    sellerId: string;
  }>();
  const sellerId = params.sellerId;

  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const t = useTranslations("SellerShop");
  const tc = useTranslations("Common");

  const getCallSellerId = (sellerId: string) => {
    setCallSellerId(sellerId);
  };

  const guestCallModalOpen = (sellerId: string, sellerName: string) => {
    setSelectedSeller({ sellerName, sellerId });
  };

  const guestCallModalClose = () => {
    setSelectedSeller(null);
  };

  const callSellerData = useQuery({
    queryKey: ["callSeller", callSellerId],
    queryFn: async () => {
      if (!callSellerId) {
        throw new Error("Seller id is required to get details.");
      }
      const result = await sellerService.getCallSeller(callSellerId);
      return result;
    },
    enabled: Boolean(callSellerId),
  });

  const {
    data: seller,
    isLoading,
    isError,
  } = useQuery<SellerShopData>({
    queryKey: ["seller-shop", sellerId],

    queryFn: () => sellerService.getSellerShop(sellerId),

    enabled: Boolean(sellerId) && !isAuthLoading,

    staleTime: 1000 * 60 * 2,
  });

  const ratingSummaryQuery = useQuery({
    queryKey: ["seller-rating-summary", sellerId],
    queryFn: () => sellerRatingService.getRatingSummary(sellerId),
  });

  const { saveSeller, removeSeller } = useSaveSeller();

  const savedSellersQuery = useQuery({
    queryKey: ["saved-sellers"],
    queryFn: savedSellerService.getSavedSellers,
  });

  const matchesVegetableSearch = (
    vegetable: VegetableResponse,
    search: string,
  ) => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) {
      return true;
    }

    const searchableValues = [
      vegetable.name,
      vegetable.displayNames?.en,
      vegetable.displayNames?.hi,
      ...(vegetable.searchAliases ?? []),
    ];

    return searchableValues.some((value) =>
      value?.toLocaleLowerCase().includes(query),
    );
  };

  const filteredVegetables = useMemo(() => {
    return seller?.inventory.items.filter((vegetable) => {
      return matchesVegetableSearch(vegetable, search);
    });
  }, [seller?.inventory.items, search]);

  if (isLoading || ratingSummaryQuery.isLoading) {
    return <p>{tc("loading")}</p>;
  }

  if (isError || !seller) {
    return <p>{t("unableToLoadShop")}</p>;
  }

  if (ratingSummaryQuery.isError) {
    return <p>{t("unableToLoadRatingSummary")}</p>;
  }

  const savedSellerIds = new Set(
    savedSellersQuery.data?.map((seller) => seller.sellerProfileId) ?? [],
  );

  const handleSaveToggle = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const isSaved = savedSellerIds.has(sellerId);

    if (isSaved) {
      removeSeller(sellerId);
    } else {
      saveSeller(sellerId);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-10">
      <div
        className="
      mx-auto
      w-full
      max-w-7xl
      px-3
      py-4
      sm:px-5
      lg:px-6
    "
      >
        <div
          className="
        grid
        grid-cols-1
        gap-5

        lg:grid-cols-[420px_minmax(0,1fr)]
        xl:grid-cols-[460px_minmax(0,1fr)]
      "
        >
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <SellerShopHeader
              seller={{
                name: seller.seller.name ?? "",
                location: {
                  ...seller.seller.location,
                },
                isSaved: savedSellerIds.has(sellerId),
                shopOwner: seller.seller.shopOwner,
                sellerRatingSummary: {
                  averageRating: ratingSummaryQuery.data!.averageRating,
                  ratingCount: ratingSummaryQuery.data!.ratingCount,
                  tagCounts: ratingSummaryQuery.data!.tagCounts,
                },
              }}
              sellerId={sellerId}
              isLoading={callSellerData.isFetching}
              getCallSellerId={getCallSellerId}
              guestCallModalOpen={guestCallModalOpen}
              onSave={() => {
                handleSaveToggle();
              }}
              onWhatsApp={() => {
                console.log("whatsapp");
              }}
            />

            {/* Reviews desktop only */}
            <div className="hidden lg:block">
              <SellerRatingSection
                sellerId={sellerId}
                isLoggedIn={Boolean(user)}
                sellerRatingSummary={{
                  averageRating: ratingSummaryQuery.data!.averageRating,
                  ratingCount: ratingSummaryQuery.data!.ratingCount,
                  tagCounts: ratingSummaryQuery.data!.tagCounts,
                  isLoading: ratingSummaryQuery.isLoading,
                  isError: ratingSummaryQuery.isError,
                }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <section id="vegetables">
            <div
              className="
            rounded-2xl
            border border-border
            bg-white
            p-4
            shadow-sm
            sm:p-5
          "
            >
              <div
                className="
              flex
              flex-col
              gap-3

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                  flex h-10 w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-primary-light
                "
                  >
                    <Leaf
                      className="
                    h-5 w-5
                    text-primary
                  "
                    />
                  </div>

                  <div>
                    <h2
                      className="
                    text-xl
                    font-bold
                    text-text-primary
                  "
                    >
                      {t("availableToday")}
                    </h2>

                    <p
                      className="
                    text-sm
                    text-text-secondary
                  "
                    >
                      {seller.inventory.items.length === 1
                        ? t("vegetableAvailableToday", { count: 1 })
                        : t("vegetablesAvailableToday", {
                            count: seller.inventory.items.length,
                          })}
                    </p>
                  </div>
                </div>

                <div
                  className="
                relative
                w-full
                sm:max-w-xs
              "
                >
                  <Search
                    className="
                  absolute
                  left-3
                  top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-text-muted
                "
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("searchInShop")}
                    className="
                  h-11
                  w-full
                  rounded-xl
                  border border-border
                  bg-white
                  pl-10
                  pr-3
                  text-sm
                  outline-none

                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                "
                  />
                </div>
              </div>

              <div
                className="
              mt-4
              grid
              grid-cols-1
              gap-3

              sm:grid-cols-2
              xl:grid-cols-3
            "
              >
                {filteredVegetables?.map((vegetable) => (
                  <VegetableCard key={vegetable.itemId} vegetable={vegetable} />
                ))}
              </div>

              {filteredVegetables?.length === 0 && (
                <div
                  className="
                mt-5
                rounded-xl
                bg-surface-muted
                p-8
                text-center
              "
                >
                  <p className="font-bold text-text-primary">
                    No vegetables found
                  </p>

                  <p
                    className="
                  mt-1
                  text-sm
                  text-text-secondary
                "
                  >
                    Try searching another vegetable.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Reviews mobile/tablet */}
        <div className="mt-5 lg:hidden">
          {/* <SellerReviews
            reviews={seller.reviews}
            totalReviews={seller.reputation.totalReviews}
          /> */}
        </div>
      </div>
      {callSellerId ? (
        <CallSellerCard
          sellerName={callSellerData?.data?.data.fullName}
          mobileNumber={callSellerData?.data?.data.mobileNumber}
          onClose={() => setCallSellerId(null)}
        />
      ) : null}
      {selectedSeller ? (
        <GuestCallModal
          sellerName={selectedSeller.sellerName}
          onClose={guestCallModalClose}
          onLogin={() => {
            router.push(
              `/login?returnTo=${encodeURIComponent(`/sellers/${sellerId}/shop`)}`,
            );
          }}
        />
      ) : null}
    </main>
  );
}
