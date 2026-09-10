"use client";

import MarketplaceHeader from "@/components/layout/MarketPlaceHeader";
import LocationSelector from "@/components/location/LocationSelector";
import LocationSearchBar from "@/components/location/LocationSearchBar";
import SellerCard from "@/components/sellers/SellerCard";
import { sellerService } from "@/services/seller.service";
import { SearchLocation } from "@/types/location.types";
import { SellerCardProps } from "@/types/seller.types";
import type { ManualLocation } from "@/types/location.types";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CallSellerCard from "@/components/sellers/CallSellerCard";
import GuestCallModal from "@/components/sellers/GuestCallModal";

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

  const router = useRouter();

  const returnTo = `/sellers?sellerId=${selectedSeller?.sellerId}&action=call`;

  const handleLocationChange = (location: CurrentLocation) => {
    setSearchLocation({
      mode: "CURRENT",
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const handleChooseLocation = () => {
    setShowManualLocationSelector((prev) => !prev);
    console.log("Open manual location selector");
  };

  const handleManualLocationClose = () => {
    setShowManualLocationSelector(false);
  };

  const handleManualSearch = (location: ManualLocation) => {
    setSearchLocation({
      mode: "MANUAL",
      state: location.stateName,
      ...(location.districtName && {
        district: location.districtName,
      }),
      ...(location.villageName && {
        village: location.villageName,
      }),
    });
  };

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

  console.log("call seller data", callSellerData?.data);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sellers", searchLocation],

    queryFn: () => {
      if (!searchLocation) {
        return sellerService.getSellers({});
      }

      if (searchLocation.mode === "CURRENT") {
        console.log("Fetching sellers for current location:", searchLocation);
        return sellerService.getSellers({
          latitude: searchLocation.latitude,
          longitude: searchLocation.longitude,
          radiusInKm: 20,
        });
      }

      // Manual village search
      if (searchLocation.village) {
        return sellerService.getSellers({
          scope: "village",
          state: searchLocation.state,
          district: searchLocation.district,
          village: searchLocation.village,
        });
      }

      // Manual district search
      if (searchLocation.district) {
        return sellerService.getSellers({
          scope: "district",
          state: searchLocation.state,
          district: searchLocation.district,
        });
      }

      // Manual state search
      return sellerService.getSellers({
        scope: "state",
        state: searchLocation.state,
      });
    },
  });

  console.log("Sellers data:", data);

  return (
    <main className="min-h-screen bg-background">
      <div
        className="
          mx-auto w-full max-w-3xl
          px-4 py-5
          sm:px-6 sm:py-7
        "
      >
        <MarketplaceHeader />

        {/* Page heading */}
        <section className="mt-4">
          <h1
            className="
              text-2xl font-bold
              leading-tight text-text-primary
              sm:text-3xl
            "
          >
            सब्जी बेचने वालों को खोजें
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Find vegetable sellers near you
          </p>
        </section>

        {/* Location */}
        <div
          className="mt-5  rounded-xl border border-border
        bg-surface p-4"
        >
          <LocationSelector
            location={""}
            onLocationChange={handleLocationChange}
            onChooseLocation={handleChooseLocation}
            handleManualLocationClose={handleManualLocationClose}
            isManualSelected={showManualLocationSelector}
          />
          {showManualLocationSelector ? (
            <LocationSearchBar
              onSearch={handleManualSearch}
              onClear={() => setSearchLocation(null)}
            />
          ) : null}
        </div>

        {/* Result heading */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            {isLoading && <p>Finding nearby sellers...</p>}

            {isError && <p>Unable to load sellers.</p>}

            {data?.data?.length === 0 && (
              <p className="mt-4 text-sm text-text-secondary">
                No sellers found near your location.
              </p>
            )}
            <p className="font-bold text-text-primary">
              {data?.data?.length} विक्रेता मिले · {data?.data?.length} sellers
            </p>
          </div>
          <button
            type="button"
            className="
              min-h-10 rounded-lg
              border border-border
              bg-surface px-3
              text-sm font-semibold
              text-text-primary
            "
          >
            ⚙ फ़िल्टर
          </button>
        </div>

        {/* Sellers */}
        <section className="mt-3 space-y-4">
          {data?.data?.map((seller: SellerCardProps) => (
            <SellerCard
              key={seller.sellerId}
              seller={seller}
              getCallSellerId={getCallSellerId}
              guestCallModalOpen={guestCallModalOpen}
              isLoading={
                callSellerId === seller.sellerId && callSellerData.isFetching
              }
            />
          ))}
        </section>

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
              router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
            }}
          />
        ) : null}

        <footer className="py-7 text-center">
          <p className="text-xs text-text-muted">Trusted sellers</p>
        </footer>
      </div>
    </main>
  );
}
