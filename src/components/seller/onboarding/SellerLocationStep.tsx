"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, LocateFixed, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import SearchableLocationField from "@/components/location/SearchableLocationField";

import { locationService } from "@/services/location.service";

import type { SellerOnboardingForm } from "./BecameSellerForm";

interface Option {
  id: string;
  name: string;
}

interface Props {
  form: SellerOnboardingForm;

  setForm: React.Dispatch<React.SetStateAction<SellerOnboardingForm>>;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
  isSellerProfile: boolean;
}

export default function SellerLocationStep({
  form,
  setForm,
  isSubmitting,
  onBack,
  onSubmit,
  isSellerProfile,
}: Props) {
  const [stateSearch, setStateSearch] = useState(form.state?.name ?? "");

  const [districtSearch, setDistrictSearch] = useState(
    form.district?.name ?? "",
  );

  const [villageSearch, setVillageSearch] = useState(form.village?.name ?? "");

  const [geoLoading, setGeoLoading] = useState(false);

  const [geoError, setGeoError] = useState("");

  const { data: states = [], isLoading: statesLoading } = useQuery({
    queryKey: ["locations", "states"],

    queryFn: () => locationService.getStates(),

    staleTime: 1000 * 60 * 30,
  });

  const debouncedDistrictSearch = districtSearch.trim();

  const debouncedVillageSearch = villageSearch.trim();

  const { data: districts = [], isLoading: districtsLoading } = useQuery({
    queryKey: [
      "locations",
      "districts",
      form.state?.id,
      debouncedDistrictSearch,
    ],

    queryFn: () => {
      if (!form.state) {
        return Promise.resolve([]);
      }

      return locationService.searchDistricts({
        stateId: form.state.id,
        search: debouncedDistrictSearch,
      });
    },

    enabled: Boolean(form.state) && debouncedDistrictSearch.length >= 1,
  });

  const { data: villages = [], isLoading: villagesLoading } = useQuery({
    queryKey: [
      "locations",
      "villages",
      form.district?.id,
      debouncedVillageSearch,
    ],

    queryFn: () => {
      if (!form.district) {
        return Promise.resolve([]);
      }

      return locationService.searchVillages({
        districtId: form.district.id,
        search: debouncedVillageSearch,
      });
    },

    enabled: Boolean(form.district) && debouncedVillageSearch.length >= 2,
  });

  const filteredStates = useMemo(() => {
    const search = stateSearch.trim().toLowerCase();

    if (!search) {
      return states;
    }

    return states.filter((state: Option) =>
      state.name.toLowerCase().includes(search),
    );
  }, [states, stateSearch]);

  const handleStateSelect = (state: Option) => {
    setForm((previous) => ({
      ...previous,
      state,
      district: null,
      village: null,
    }));

    setStateSearch(state.name);

    setDistrictSearch("");
    setVillageSearch("");
  };

  const handleDistrictSelect = (district: Option) => {
    setForm((previous) => ({
      ...previous,

      district,

      village: null,
    }));

    setDistrictSearch(district.name);

    setVillageSearch("");
  };

  const handleVillageSelect = (village: Option) => {
    setForm((previous) => ({
      ...previous,
      village,
    }));

    setVillageSearch(village.name);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Location is not supported in this browser.");

      return;
    }

    setGeoLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,

          geoLocation: {
            latitude: position.coords.latitude,

            longitude: position.coords.longitude,
          },
        }));

        setGeoLoading(false);
      },

      (error) => {
        setGeoLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setGeoError("Location permission was denied.");

          return;
        }

        setGeoError("Unable to get your current location.");
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const isValid =
    Boolean(form.state) &&
    Boolean(form.district) &&
    Boolean(form.village) &&
    /^\d{6}$/.test(form.pincode.trim());

  return (
    <>
      <div>
        <h2
          className="
            text-2xl
            font-extrabold
            text-[#17201a]
          "
        >
          Where do you sell from?
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-[#536157]
          "
        >
          Add your location so nearby buyers can discover you.
        </p>
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="
          mt-6
          flex
          min-h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-[#159447]
          bg-[#edf8ef]
          px-4
          font-semibold
          text-[#159447]
          transition
          hover:bg-[#dff3e5]
        "
      >
        {form.geoLocation ? (
          <Check className="h-5 w-5" />
        ) : (
          <LocateFixed className="h-5 w-5" />
        )}

        {form.geoLocation ? "Current location added" : "Use Current Location"}
      </button>

      <div
        className="
          my-6
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            h-px
            flex-1
            bg-[#e1e5e2]
          "
        />

        <span
          className="
            text-xs
            font-medium
            text-[#7a857d]
          "
        >
          Location details
        </span>

        <div
          className="
            h-px
            flex-1
            bg-[#e1e5e2]
          "
        />
      </div>
      <div className="space-y-5">
        <SearchableLocationField
          label="State *"
          placeholder="Search state"
          value={form.state}
          // search={stateSearch}
          options={filteredStates}
          onSearchChange={setStateSearch}
          onSelect={handleStateSelect}
          isLoading={statesLoading}
          localSearch
        />

        <SearchableLocationField
          label="District *"
          placeholder={form.state ? "Search district" : "Select state first"}
          value={form.district}
          // search={districtSearch}
          options={districts}
          onSearchChange={setDistrictSearch}
          onSelect={handleDistrictSelect}
          disabled={!form.state}
          isLoading={districtsLoading}
          minimumSearchLength={1}
        />

        <SearchableLocationField
          label="Village *"
          placeholder={
            form.district ? "Search village" : "Select district first"
          }
          value={form.village}
          // search={villageSearch}
          options={villages}
          onSearchChange={setVillageSearch}
          onSelect={handleVillageSelect}
          disabled={!form.district}
          isLoading={villagesLoading}
          minimumSearchLength={2}
        />
        <div>
          <label
            className="
              mb-2
              block
              text-sm
              font-bold
              text-[#17201a]
            "
          >
            Pincode
          </label>
          <div className="relative">
            <MapPin
              className="
                absolute
                left-4
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-[#7a857d]
              "
            />
            <input
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 6);

                setForm((previous) => ({
                  ...previous,
                  pincode: value,
                }));
              }}
              placeholder="Enter 6-digit pincode"
              className="
               h-12
                w-full
                rounded-xl
                border
                border-[#d9dedb]
                bg-white
                pl-12
                pr-4
                text-sm
                outline-none
                transition
                focus:border-[#159447]
                focus:ring-2
                focus:ring-[#159447]/10
            "
            />
          </div>
        </div>
      </div>
      <div
        className="
          mt-7
          flex
          gap-3
        "
      >
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="
            flex
            h-12
            flex-1
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#d9dedb]
            bg-white
            font-semibold
            text-[#536157]
            transition
            hover:bg-[#f6f8f6]
          "
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="
            flex
            h-12
            flex-2
            items-center
            justify-center
            rounded-xl
            bg-[#159447]
            px-5
            font-bold
            text-white
            transition
            hover:bg-[#107a3a]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting
            ? "Applying..."
            : isSellerProfile
              ? "Re-apply for Seller"
              : "Apply for Seller"}
        </button>
      </div>
    </>
  );
}
