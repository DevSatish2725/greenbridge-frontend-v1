"use client";

import { useState } from "react";
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import MarketplaceHeader from "@/components/layout/MarketPlaceHeader";

import LocationSelector from "@/components/location/LocationSelector";
import LocationSearchBar from "@/components/location/LocationSearchBar";

import SellerCard from "@/components/sellers/SellerCard";
import CallSellerCard from "@/components/sellers/CallSellerCard";
import GuestCallModal from "@/components/sellers/GuestCallModal";

import { VegetableMultiSelect } from "@/components/ui/VegetableMultiSelect";

import { sellerService } from "@/services/seller.service";
import { vegetableService } from "@/services/vegetable.service";
import { savedSellerService } from "@/services/saved-seller.service";

import { buildSellerParams } from "@/utils/buildSellerParams";

import { useSaveSeller } from "@/hooks/useSaveSeller";
import { useAuth } from "@/providers/AuthProvider";

import type {
  SearchLocation,
  ManualLocation,
  VillageOption,
  DistrictOption,
  StateOption,
} from "@/types/location.types";

import type { SellerCardProps, SellerResponse } from "@/types/seller.types";

import type { VegetableResponse } from "@/types/vegetable.types";
import { useDebounce } from "@/hooks/useDebounce";

interface CurrentLocation {
  latitude: number;
  longitude: number;
}

export default function SellersPage() {
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(
    null,
  );

  const [showManualLocationSelector, setShowManualLocationSelector] =
    useState(false);

  const [callSellerId, setCallSellerId] = useState<string | null>(null);

  const [selectedSeller, setSelectedSeller] = useState<{
    sellerId: string;
    sellerName: string;
  } | null>(null);

  const [selectedVegetableIds, setSelectedVegetableIds] = useState<string[]>(
    [],
  );

  const [appliedVegetableIds, setAppliedVegetableIds] = useState<string[]>([]);

  const [activeLocation, setActiveLocation] = useState<ManualLocation | null>(
    null,
  );

  const [manualLocationClear, setManualLocationClear] = useState(false);
  const [selectedState, setSelectedState] = useState<StateOption | null>(null);

  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictOption | null>(null);

  const [selectedVillage, setSelectedVillage] = useState<VillageOption | null>(
    null,
  );

  const [districtSearch, setDistrictSearch] = useState("");
  const [villageSearch, setVillageSearch] = useState("");

  const debouncedDistrictSearch = useDebounce(districtSearch, 300);

  const debouncedVillageSearch = useDebounce(villageSearch, 300);

  const router = useRouter();
  const t = useTranslations("FindSellers");

  const { user } = useAuth();

  const { saveSeller, removeSeller, isProcessing } = useSaveSeller();

  const returnTo =
    `/sellers?sellerId=${selectedSeller?.sellerId}` + `&action=call`;

  // ------------------------------------------------
  // Location
  // ------------------------------------------------

  console.log("manual location", showManualLocationSelector);

  const handleClearManualLocation = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setDistrictSearch("");
    setVillageSearch("");
    setActiveLocation(null);
  };

  const handleLocationChange = (location: CurrentLocation) => {
    setSearchLocation({
      mode: "CURRENT",
      latitude: location.latitude,
      longitude: location.longitude,
    });

    // Current location and manual selector are
    // mutually exclusive.
    // setShowManualLocationSelector(false);
  };

  const handleChooseLocation = () => {
    setShowManualLocationSelector(true);
  };

  const handleManualLocationClose = () => {
    setShowManualLocationSelector(false);
  };

  const handleSellerSearch = () => {
    if (selectedState) {
      setSearchLocation({
        mode: "MANUAL",
        state: selectedState.name,

        ...(selectedDistrict?.name && {
          district: selectedDistrict.name,
        }),

        ...(selectedVillage?.name && {
          village: selectedVillage.name,
        }),
      });

      const activeLocationDetails = {
        stateId: selectedState.id,
        stateName: selectedState.name,

        districtId: selectedDistrict?.id,
        districtName: selectedDistrict?.name,

        villageId: selectedVillage?.id,
        villageName: selectedVillage?.name,
      };

      setActiveLocation(activeLocationDetails);
    }

    handleApplyVegetables(selectedVegetableIds);
  };

  const handleStateSelect = (state: StateOption) => {
    setSelectedState(state);
    setSelectedDistrict(null);
    setSelectedVillage(null);

    setDistrictSearch("");
    setVillageSearch("");
  };

  const handleDistrictSelect = (district: DistrictOption) => {
    setSelectedDistrict(district);

    setSelectedVillage(null);
    setVillageSearch("");
  };

  const handleVillageSelect = (village: VillageOption) => {
    setSelectedVillage(village);
  };

  const handleDistrictSearch = (district: string) => {
    setDistrictSearch(district);
  };

  const handleVillageSearch = (village: string) => {
    setVillageSearch(village);
  };

  // ------------------------------------------------
  // Vegetable filter
  // ------------------------------------------------

  const handleApplyVegetables = (vegetableIds: string[]) => {
    setAppliedVegetableIds(vegetableIds);
  };

  // ------------------------------------------------
  // Seller contact
  // ------------------------------------------------

  const getCallSellerId = (sellerId: string) => {
    setCallSellerId(sellerId);
  };

  const guestCallModalOpen = (sellerId: string, sellerName: string) => {
    setSelectedSeller({
      sellerId,
      sellerName,
    });
  };

  const guestCallModalClose = () => {
    setSelectedSeller(null);
  };

  // ------------------------------------------------
  // Seller contact query
  // ------------------------------------------------

  const callSellerData = useQuery({
    queryKey: ["callSeller", callSellerId],

    queryFn: async () => {
      if (!callSellerId) {
        throw new Error("Seller id is required to get details.");
      }

      return sellerService.getCallSeller(callSellerId);
    },

    enabled: Boolean(callSellerId),
  });

  // ------------------------------------------------
  // Vegetables
  // ------------------------------------------------

  const { data: vegetables = [], isLoading: isVegetablesLoading } = useQuery<
    VegetableResponse[]
  >({
    queryKey: ["vegetables"],
    queryFn: vegetableService.getVegetables,
  });

  // ------------------------------------------------
  // Saved sellers
  // ------------------------------------------------

  const savedSellersQuery = useQuery({
    queryKey: ["saved-sellers"],
    queryFn: savedSellerService.getSavedSellers,

    // Don't request authenticated saved sellers
    // when the visitor is a guest.
    enabled: Boolean(user),
  });

  const savedSellerIds = new Set(
    savedSellersQuery.data?.map((seller) => seller.sellerProfileId) ?? [],
  );

  // ------------------------------------------------
  // Seller discovery
  // ------------------------------------------------

  console.log("appliedVegetableIds", appliedVegetableIds);

  const sellerQuery = useInfiniteQuery<
    SellerResponse,
    Error,
    InfiniteData<SellerResponse>,
    readonly unknown[],
    string | undefined
  >({
    queryKey: ["sellers", searchLocation, appliedVegetableIds],

    initialPageParam: undefined,

    queryFn: ({ pageParam }) => {
      const params = buildSellerParams({
        searchLocation,
        vegetableIds: appliedVegetableIds,
        cursor: pageParam,
      });

      return sellerService.getSellers(params);
    },

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
  });

  const sellers = sellerQuery.data?.pages.flatMap((page) => page.data) ?? [];

  // ------------------------------------------------
  // Save / unsave
  // ------------------------------------------------

  const handleSaveToggle = (sellerId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const isSaved = savedSellerIds.has(sellerId);

    if (isSaved) {
      removeSeller(sellerId);
      return;
    }

    saveSeller(sellerId);
  };

  return (
    <main className="min-h-screen bg-background">
      <div
        className="
        mx-auto w-full
        max-w-7xl
        px-4 py-4
        sm:px-6
        lg:px-8
      "
      >
        {/* <section className="mt-3">
          <h1
            className="
            text-2xl font-bold
            leading-tight
            text-text-primary
            sm:text-3xl
          "
          >
            {t("title")}
          </h1>

          <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>
        </section> */}

        {/* =====================================================
          DESKTOP:
          LEFT FILTERS + RIGHT SELLERS

          MOBILE:
          FILTERS ABOVE SELLERS
      ====================================================== */}

        <div
          className="
          mt-5
          grid grid-cols-1
          gap-5
          lg:grid-cols-[340px_minmax(0,1fr)]
          lg:items-start
        "
        >
          {/* =================================================
            LEFT SIDE — FILTERS
        ================================================= */}

          <aside
            className="
    rounded-2xl
    border border-border
    bg-surface

    lg:sticky
    lg:top-5
    lg:max-h-[calc(100vh-2.5rem)]
  "
          >
            <div className="p-4">
              {/* =============================================
        LOCATION
    ============================================== */}
              {!showManualLocationSelector && (
                <LocationSelector
                  location=""
                  onLocationChange={handleLocationChange}
                  onChooseLocation={handleChooseLocation}
                  handleManualLocationClose={handleManualLocationClose}
                  isManualSelected={showManualLocationSelector}
                />
              )}

              {/* =============================================
        MANUAL LOCATION

        When expanded, sidebar can scroll instead
        of increasing the page height.
    ============================================== */}

              {showManualLocationSelector && (
                <div
                  className="relative lg:h-[calc(100vh-22rem)]
    lg:overflow-y-auto
    [&::-webkit-scrollbar]:w-1.
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-border border"
                >
                  <span
                    className="absolute t-0 right-0 border z-20"
                    onClick={() => {
                      console.log("close clicked");
                      setShowManualLocationSelector(false);
                    }}
                  >
                    <X />
                  </span>
                  <LocationSearchBar
                    handleStateSelect={handleStateSelect}
                    handleDistrictSelect={handleDistrictSelect}
                    handleVillageSelect={handleVillageSelect}
                    handleDistrictSearch={handleDistrictSearch}
                    handleVillageSearch={handleVillageSearch}
                    selectedState={selectedState}
                    selectedDistrict={selectedDistrict}
                    selectedVillage={selectedVillage}
                    villageSearch={villageSearch}
                    districtSearch={districtSearch}
                  />
                </div>
              )}

              {/* =============================================
        VEGETABLE FILTER
    ============================================== */}

              <div className="mt-4 border-t border-border pt-4">
                <div className="mb-2">
                  <h2 className="text-sm font-bold text-text-primary">
                    {t("vegetables.title")}
                  </h2>

                  <p className="mt-0.5 text-xs leading-5 text-text-secondary">
                    {t("vegetables.description")}
                  </p>
                </div>

                <VegetableMultiSelect
                  vegetables={vegetables}
                  selectedIds={selectedVegetableIds}
                  placeholder={t("vegetables.placeholder")}
                  onChange={setSelectedVegetableIds}
                  disabled={isVegetablesLoading}
                />

                {/* Apply filter */}
                <button
                  type="button"
                  onClick={handleSellerSearch}
                  className="
          mt-3
          flex h-11 w-full
          items-center justify-center
          gap-2
          rounded-xl
          bg-primary
          px-5
          text-sm
          font-bold
          text-white
          transition
          hover:bg-primary-hover
        "
                >
                  <Search size={17} />

                  {t("vegetables.searchSellers")}
                </button>
              </div>
            </div>
          </aside>

          {/* =================================================
            RIGHT SIDE — SELLER RESULTS
        ================================================= */}

          <section className="min-w-0">
            {/* ---------------------------------------------
              RESULT HEADER
          ---------------------------------------------- */}

            <MarketplaceHeader />

            {/* Active manual location */}
            {activeLocation && (
              <div
                className="
            mt-3 flex flex-col gap-2
            border-t border-border
            pt-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
              >
                <div
                  className="
              flex flex-wrap items-center
              gap-1.5 text-xs
              text-text-secondary
            "
                >
                  <span className="font-bold text-primary">●</span>

                  <span>{t("searchingIn")}</span>

                  <span className="font-semibold text-text-primary">
                    {activeLocation.stateName}
                  </span>

                  {activeLocation.districtName && (
                    <>
                      <span className="text-text-muted">›</span>

                      <span className="font-semibold text-text-primary">
                        {activeLocation.districtName}
                      </span>
                    </>
                  )}

                  {activeLocation.villageName && (
                    <>
                      <span className="text-text-muted">›</span>

                      <span className="font-semibold text-text-primary">
                        {activeLocation.villageName}
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleClearManualLocation}
                  className="
              flex items-center gap-1
              self-start
              text-xs font-medium
              text-text-secondary
              transition
              hover:text-error
              sm:self-auto
            "
                >
                  {t("location.clearLocation")}

                  <X size={14} />
                </button>
              </div>
            )}

            <div
              className="
              mb-3
              flex min-h-8
              items-center
              justify-between
              gap-3
            "
            >
              {/* Loading */}
              {sellerQuery.isLoading && (
                <p className="text-sm text-text-secondary">
                  {t("findingNearbySellers")}
                </p>
              )}

              {/* Seller count */}
              {!sellerQuery.isLoading &&
                !sellerQuery.isError &&
                sellers.length > 0 && (
                  <div>
                    <h2
                      className="
                      text-lg font-bold
                      text-text-primary
                    "
                    >
                      {t("results.sellerCount", {
                        count: sellers.length,
                      })}
                    </h2>

                    <p
                      className="
                      mt-0.5
                      text-xs
                      text-text-secondary
                    "
                    >
                      {t("results.trustedSellers")}
                    </p>
                  </div>
                )}
            </div>

            {/* ---------------------------------------------
              ERROR STATE
          ---------------------------------------------- */}

            {sellerQuery.isError && (
              <div
                className="
                rounded-xl
                border border-error/20
                bg-error/5
                px-4 py-3
              "
              >
                <p
                  className="
                  text-sm
                  font-medium
                  text-error
                "
                >
                  {t("unableToLoadSellers")}
                </p>
              </div>
            )}

            {/* ---------------------------------------------
              EMPTY STATE
          ---------------------------------------------- */}

            {!sellerQuery.isLoading &&
              !sellerQuery.isError &&
              sellers.length === 0 && (
                <div
                  className="
                  flex min-h-[180px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border border-border
                  bg-surface
                  px-6
                  text-center
                "
                >
                  <div
                    className="
                    flex h-11 w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-primary-light
                    text-primary
                  "
                  >
                    <Search size={20} />
                  </div>

                  <h3
                    className="
                    mt-3
                    font-bold
                    text-text-primary
                  "
                  >
                    {t("results.noSellersNearby")}
                  </h3>

                  <p
                    className="
                    mt-1
                    max-w-sm
                    text-sm
                    text-text-secondary
                  "
                  >
                    {t("results.tryDifferentLocation")}
                  </p>
                </div>
              )}

            {/* ---------------------------------------------
              SELLER LIST
          ---------------------------------------------- */}

            {sellers.length > 0 && (
              <div className="space-y-3">
                {sellers.map((seller: SellerCardProps) => (
                  <SellerCard
                    key={seller.sellerId}
                    seller={seller}
                    isProcessing={isProcessing}
                    isSaved={savedSellerIds.has(seller.sellerId)}
                    getCallSellerId={getCallSellerId}
                    guestCallModalOpen={guestCallModalOpen}
                    handleSaveToggle={handleSaveToggle}
                    isLoading={
                      callSellerId === seller.sellerId &&
                      callSellerData.isFetching
                    }
                  />
                ))}
              </div>
            )}

            {/* ---------------------------------------------
              LOAD MORE
          ---------------------------------------------- */}

            {sellerQuery.hasNextPage && (
              <div
                className="
                mt-5
                flex
                justify-center
              "
              >
                <button
                  type="button"
                  disabled={sellerQuery.isFetchingNextPage}
                  onClick={() => sellerQuery.fetchNextPage()}
                  className="
                  rounded-xl
                  border border-primary
                  bg-surface
                  px-6 py-2.5
                  text-sm
                  font-semibold
                  text-primary
                  transition
                  hover:bg-primary-light
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                >
                  {sellerQuery.isFetchingNextPage
                    ? t("loadingMore")
                    : t("loadMore")}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* =====================================================
          CALL SELLER MODAL
      ====================================================== */}

        {callSellerId && (
          <CallSellerCard
            sellerName={callSellerData.data?.data.fullName}
            mobileNumber={callSellerData.data?.data.mobileNumber}
            onClose={() => setCallSellerId(null)}
          />
        )}

        {/* =====================================================
          GUEST LOGIN MODAL
      ====================================================== */}

        {selectedSeller && (
          <GuestCallModal
            sellerName={selectedSeller.sellerName}
            onClose={guestCallModalClose}
            onLogin={() => {
              router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
            }}
          />
        )}
      </div>
    </main>
  );
}
