"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import SearchableLocationField from "./SearchableLocationField";

import { useDebounce } from "@/hooks/useDebounce";
import { locationService } from "@/services/location.service";

import type {
  StateOption,
  DistrictOption,
  VillageOption,
  ManualLocation,
} from "@/types/location.types";

interface LocationSearchBarProps {
  handleStateSelect: (selectedState: StateOption) => void;
  handleDistrictSelect: (selectedDistrict: DistrictOption) => void;
  handleVillageSelect: (selectedVillage: VillageOption) => void;
  handleDistrictSearch: (district: string) => void;
  handleVillageSearch: (village: string) => void;
  selectedState: StateOption | null;
  selectedDistrict: DistrictOption | null;
  selectedVillage: VillageOption | null;
  districtSearch: string;
  villageSearch: string;
}

export default function LocationSearchBar({
  handleStateSelect,
  handleDistrictSelect,
  handleVillageSelect,
  handleDistrictSearch,
  handleVillageSearch,
  selectedState,
  selectedDistrict,
  selectedVillage,
  districtSearch,
  villageSearch,
}: LocationSearchBarProps) {
  const debouncedDistrictSearch = useDebounce(districtSearch, 300);

  const debouncedVillageSearch = useDebounce(villageSearch, 300);

  const t = useTranslations("FindSellers");

  // States
  const statesQuery = useQuery({
    queryKey: ["locations", "states"],
    queryFn: locationService.getStates,
    staleTime: 1000 * 60 * 60,
  });

  // District search
  const districtsQuery = useQuery({
    queryKey: [
      "locations",
      "districts",
      selectedState?.id,
      debouncedDistrictSearch,
    ],

    queryFn: () =>
      locationService.searchDistricts({
        stateId: selectedState!.id,
        search: debouncedDistrictSearch,
        limit: 20,
      }),

    enabled:
      Boolean(selectedState) && debouncedDistrictSearch.trim().length >= 2,

    staleTime: 1000 * 60 * 10,
  });

  // Village search
  const villagesQuery = useQuery({
    queryKey: [
      "locations",
      "villages",
      selectedDistrict?.id,
      debouncedVillageSearch,
    ],

    queryFn: () =>
      locationService.searchVillages({
        districtId: selectedDistrict!.id,
        search: debouncedVillageSearch,
        limit: 20,
      }),

    enabled:
      Boolean(selectedDistrict) && debouncedVillageSearch.trim().length >= 2,

    staleTime: 1000 * 60 * 10,
  });

  const handleSearch = () => {
    if (!selectedState) {
      return;
    }

    const location: ManualLocation = {
      stateId: selectedState.id,
      stateName: selectedState.name,

      ...(selectedDistrict && {
        districtId: selectedDistrict.id,
        districtName: selectedDistrict.name,
      }),

      ...(selectedVillage && {
        villageId: selectedVillage.id,
        villageName: selectedVillage.name,
      }),
    };

    // onSearch(location);
  };

  return (
    <section>
      {!selectedState && (
        <p className="mb-3 text-xs text-text-secondary">
          {t("location.selectStateHint")}
        </p>
      )}

      <div
        className="
          grid grid-cols-1 gap-3
        "
      >
        {/* State */}
        <SearchableLocationField
          key={selectedState?.id ?? "no-state"}
          label={t("location.state")}
          placeholder={t("location.searchState")}
          options={statesQuery.data ?? []}
          value={selectedState}
          isLoading={statesQuery.isLoading}
          localSearch
          onSelect={handleStateSelect}
        />

        {/* District */}
        <SearchableLocationField
          key={selectedDistrict?.id ?? "no-district"}
          label={t("location.district")}
          placeholder={
            selectedState
              ? t("location.searchDistrict")
              : t("location.selectStateFirst")
          }
          value={selectedDistrict}
          options={districtsQuery.data ?? []}
          disabled={!selectedState}
          isLoading={districtsQuery.isFetching}
          minimumSearchLength={2}
          onSearchChange={handleDistrictSearch}
          onSelect={handleDistrictSelect}
        />

        {/* Village */}
        <SearchableLocationField
          key={selectedVillage?.id ?? "no-village"}
          label={t("location.village")}
          placeholder={
            selectedDistrict
              ? t("location.searchVillageOrArea")
              : t("location.selectDistrictFirst")
          }
          value={selectedVillage}
          options={villagesQuery.data ?? []}
          disabled={!selectedDistrict}
          isLoading={villagesQuery.isFetching}
          minimumSearchLength={2}
          onSearchChange={handleVillageSearch}
          onSelect={handleVillageSelect}
        />
      </div>
    </section>
  );
}
