"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

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
  onSearch: (location: ManualLocation) => void;

  onClear?: () => void;
}

export default function LocationSearchBar({
  onSearch,
  onClear,
}: LocationSearchBarProps) {
  const [selectedState, setSelectedState] = useState<StateOption | null>(null);

  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictOption | null>(null);

  const [selectedVillage, setSelectedVillage] = useState<VillageOption | null>(
    null,
  );

  const [districtSearch, setDistrictSearch] = useState("");

  const [villageSearch, setVillageSearch] = useState("");

  const [activeLocation, setActiveLocation] = useState<ManualLocation | null>(
    null,
  );

  const debouncedDistrictSearch = useDebounce(districtSearch, 300);

  const debouncedVillageSearch = useDebounce(villageSearch, 300);

  // -------------------------
  // States
  // -------------------------

  const statesQuery = useQuery({
    queryKey: ["locations", "states"],

    queryFn: locationService.getStates,

    staleTime: 1000 * 60 * 60,
  });

  // -------------------------
  // District server search
  // -------------------------

  const districtsQuery = useQuery({
    queryKey: [
      "locations",
      "districts",
      selectedState?._id,
      debouncedDistrictSearch,
    ],

    queryFn: () =>
      locationService.searchDistricts({
        stateId: selectedState!._id,

        search: debouncedDistrictSearch,

        limit: 20,
      }),

    enabled:
      Boolean(selectedState) && debouncedDistrictSearch.trim().length >= 2,

    staleTime: 1000 * 60 * 10,
  });

  // -------------------------
  // Village server search
  // -------------------------

  const villagesQuery = useQuery({
    queryKey: [
      "locations",
      "villages",
      selectedDistrict?._id,
      debouncedVillageSearch,
    ],

    queryFn: () =>
      locationService.searchVillages({
        districtId: selectedDistrict!._id,

        search: debouncedVillageSearch,

        limit: 20,
      }),

    enabled:
      Boolean(selectedDistrict) && debouncedVillageSearch.trim().length >= 2,

    staleTime: 1000 * 60 * 10,
  });

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

  const handleSearch = () => {
    if (!selectedState) {
      return;
    }

    const location: ManualLocation = {
      stateId: selectedState._id,

      stateName: selectedState.name,

      ...(selectedDistrict && {
        districtId: selectedDistrict._id,

        districtName: selectedDistrict.name,
      }),

      ...(selectedVillage && {
        villageId: selectedVillage._id,

        villageName: selectedVillage.name,
      }),
    };

    setActiveLocation(location);

    onSearch(location);
  };

  const handleClear = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);

    setDistrictSearch("");
    setVillageSearch("");

    setActiveLocation(null);

    onClear?.();
  };

  return (
    <section className="mt-6">
      {!selectedState ? (
        <p
          className="
                mt-1
                text-sm
                text-text-secondary
              "
        >
          Select at least a state to start searching.
        </p>
      ) : null}
      <div
        className="
          grid
          grid-cols-1
          gap-4

          md:grid-cols-2

          xl:grid-cols-[1fr_1fr_1fr_auto]
          xl:items-end
        "
      >
        {/* State */}

        <SearchableLocationField
          label="State"
          placeholder="Search state..."
          options={statesQuery.data ?? []}
          value={selectedState}
          isLoading={statesQuery.isLoading}
          localSearch
          onSelect={handleStateSelect}
        />

        {/* District */}

        <SearchableLocationField
          label="District"
          placeholder={
            selectedState ? "Search district..." : "Select state first"
          }
          value={selectedDistrict}
          options={districtsQuery.data ?? []}
          disabled={!selectedState}
          isLoading={districtsQuery.isFetching}
          minimumSearchLength={2}
          onSearchChange={setDistrictSearch}
          onSelect={handleDistrictSelect}
        />

        {/* Village */}

        <SearchableLocationField
          label="Village / Area"
          placeholder={
            selectedDistrict
              ? "Search village or area..."
              : "Select district first"
          }
          value={selectedVillage}
          options={villagesQuery.data ?? []}
          disabled={!selectedDistrict}
          isLoading={villagesQuery.isFetching}
          minimumSearchLength={2}
          onSearchChange={setVillageSearch}
          onSelect={setSelectedVillage}
        />

        {/* Search */}

        <button
          type="button"
          disabled={!selectedState}
          onClick={handleSearch}
          className="
            flex
            h-12
            min-w-48
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-6
            text-sm
            font-bold
            text-white
            transition

            hover:bg-primary-hover

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <span className="text-lg">⌖</span>
          Search Sellers
        </button>
      </div>

      {/* Active location */}

      {activeLocation && (
        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            border-t
            border-primary/10
            pt-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              text-sm
              text-text-secondary
            "
          >
            <span
              className="
                font-bold
                text-primary
              "
            >
              ●
            </span>

            <span>Searching in:</span>

            <span
              className="
                font-semibold
                text-text-primary
              "
            >
              {activeLocation.stateName}
            </span>

            {activeLocation.districtName && (
              <>
                <span className="text-text-muted">›</span>

                <span
                  className="
                    font-semibold
                    text-text-primary
                  "
                >
                  {activeLocation.districtName}
                </span>
              </>
            )}

            {activeLocation.villageName && (
              <>
                <span className="text-text-muted">›</span>

                <span
                  className="
                    font-semibold
                    text-text-primary
                  "
                >
                  {activeLocation.villageName}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="
              flex
              items-center
              gap-2
              self-start
              text-sm
              font-medium
              text-text-secondary
              transition

              hover:text-error

              sm:self-auto
            "
          >
            Clear Location
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}
    </section>
  );
}
