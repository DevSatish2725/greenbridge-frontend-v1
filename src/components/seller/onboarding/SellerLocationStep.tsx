"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, LocateFixed, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import SearchableLocationField from "@/components/location/SearchableLocationField";

import { locationService } from "@/services/location.service";

import type { SellerOnboardingForm } from "./BecameSellerForm";

interface Option {
  _id: string;
  name: string;
}

interface Props {
  form: SellerOnboardingForm;

  setForm: React.Dispatch<React.SetStateAction<SellerOnboardingForm>>;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export default function SellerLocationStep({
  form,
  setForm,
  isSubmitting,
  onBack,
  onSubmit,
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
      form.state?._id,
      debouncedDistrictSearch,
    ],

    queryFn: () => {
      if (!form.state) {
        return Promise.resolve([]);
      }

      return locationService.searchDistricts({
        stateId: form.state._id,
        search: debouncedDistrictSearch,
      });
    },

    enabled: Boolean(form.state) && debouncedDistrictSearch.length >= 1,
  });

  const { data: villages = [], isLoading: villagesLoading } = useQuery({
    queryKey: [
      "locations",
      "villages",
      form.district?._id,
      debouncedVillageSearch,
    ],

    queryFn: () => {
      if (!form.district) {
        return Promise.resolve([]);
      }

      return locationService.searchVillages({
        districtId: form.district._id,
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
            flex-[2]
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
          {isSubmitting ? "Creating seller..." : "Become a Seller"}
        </button>
      </div>
    </>
    // <section
    //   className="
    //     rounded-2xl
    //     border border-border
    //     bg-white
    //     p-4
    //     shadow-sm
    //     sm:p-6
    //   "
    // >
    //   <div>
    //     <div
    //       className="
    //         flex
    //         items-center
    //         gap-3
    //       "
    //     >
    //       <div
    //         className="
    //           flex
    //           h-11 w-11
    //           items-center
    //           justify-center
    //           rounded-full
    //           bg-primary-light
    //           text-primary
    //         "
    //       >
    //         <MapPin
    //           className="
    //             h-5 w-5
    //           "
    //         />
    //       </div>

    //       <div>
    //         <h2
    //           className="
    //             text-xl
    //             font-bold
    //             text-text-primary
    //           "
    //         >
    //           Your Location
    //         </h2>

    //         <p
    //           className="
    //             mt-0.5
    //             text-sm
    //             text-text-secondary
    //           "
    //         >
    //           Tell buyers where your produce is available.
    //         </p>
    //       </div>
    //     </div>
    //   </div>

    //   <div
    //     className="
    //       mt-6
    //       space-y-4
    //     "
    //   >
    //     <SearchableLocationField
    //       label="State *"
    //       placeholder="Search state"
    //       value={form.state}
    //       search={stateSearch}
    //       options={filteredStates}
    //       onSearchChange={setStateSearch}
    //       onSelect={handleStateSelect}
    //       isLoading={statesLoading}
    //       localSearch
    //     />

    //     <SearchableLocationField
    //       label="District *"
    //       placeholder={form.state ? "Search district" : "Select state first"}
    //       value={form.district}
    //       search={districtSearch}
    //       options={districts}
    //       onSearchChange={setDistrictSearch}
    //       onSelect={handleDistrictSelect}
    //       disabled={!form.state}
    //       isLoading={districtsLoading}
    //       minimumSearchLength={1}
    //     />

    //     <SearchableLocationField
    //       label="Village *"
    //       placeholder={
    //         form.district ? "Search village" : "Select district first"
    //       }
    //       value={form.village}
    //       search={villageSearch}
    //       options={villages}
    //       onSearchChange={setVillageSearch}
    //       onSelect={handleVillageSelect}
    //       disabled={!form.district}
    //       isLoading={villagesLoading}
    //       minimumSearchLength={2}
    //     />

    //     <div>
    //       <label
    //         htmlFor="pincode"
    //         className="
    //           mb-2
    //           block
    //           text-sm
    //           font-bold
    //           text-text-primary
    //         "
    //       >
    //         Pincode *
    //       </label>

    //       <input
    //         id="pincode"
    //         inputMode="numeric"
    //         maxLength={6}
    //         value={form.pincode}
    //         onChange={(event) => {
    //           const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    //           setForm((previous) => ({
    //             ...previous,
    //             pincode: value,
    //           }));
    //         }}
    //         placeholder="Enter 6-digit pincode"
    //         className="
    //           h-12
    //           w-full
    //           rounded-xl
    //           border
    //           border-border
    //           bg-white
    //           px-3
    //           text-text-primary
    //           outline-none
    //           focus:border-primary
    //           focus:ring-2
    //           focus:ring-primary/10
    //         "
    //       />

    //       {form.pincode && !/^\d{6}$/.test(form.pincode) && (
    //         <p
    //           className="
    //               mt-1
    //               text-xs
    //               text-error
    //             "
    //         >
    //           Enter a valid 6-digit pincode.
    //         </p>
    //       )}
    //     </div>
    //   </div>

    //   <div
    //     className="
    //       mt-6
    //       rounded-xl
    //       border
    //       border-border
    //       bg-surface-muted
    //       p-4
    //     "
    //   >
    //     <div
    //       className="
    //         flex
    //         items-start
    //         gap-3
    //       "
    //     >
    //       <LocateFixed
    //         className="
    //           mt-0.5
    //           h-5 w-5
    //           shrink-0
    //           text-primary
    //         "
    //       />

    //       <div
    //         className="
    //           flex-1
    //         "
    //       >
    //         <p
    //           className="
    //             font-bold
    //             text-text-primary
    //           "
    //         >
    //           Improve nearby discovery
    //         </p>

    //         <p
    //           className="
    //             mt-1
    //             text-sm
    //             text-text-secondary
    //           "
    //         >
    //           Add your current GPS location so nearby buyers can find you more
    //           accurately.
    //         </p>

    //         {form.geoLocation ? (
    //           <div
    //             className="
    //               mt-3
    //               rounded-lg
    //               bg-primary-light
    //               px-3
    //               py-2
    //               text-sm
    //               font-medium
    //               text-primary
    //             "
    //           >
    //             ✓ Current location captured
    //           </div>
    //         ) : (
    //           <button
    //             type="button"
    //             onClick={handleUseCurrentLocation}
    //             disabled={geoLoading}
    //             className="
    //               mt-3
    //               inline-flex
    //               min-h-11
    //               items-center
    //               justify-center
    //               gap-2
    //               rounded-xl
    //               border
    //               border-primary
    //               bg-white
    //               px-4
    //               text-sm
    //               font-bold
    //               text-primary
    //               transition
    //               hover:bg-primary-light
    //               disabled:cursor-not-allowed
    //               disabled:opacity-60
    //             "
    //           >
    //             <LocateFixed
    //               className="
    //                 h-4 w-4
    //               "
    //             />

    //             {geoLoading ? "Getting location..." : "Use Current Location"}
    //           </button>
    //         )}

    //         {geoError && (
    //           <p
    //             className="
    //               mt-2
    //               text-xs
    //               text-error
    //             "
    //           >
    //             {geoError}
    //           </p>
    //         )}
    //       </div>
    //     </div>
    //   </div>

    //   <div
    //     className="
    //       mt-6
    //       flex
    //       flex-col-reverse
    //       gap-3
    //       sm:flex-row
    //       sm:justify-between
    //     "
    //   >
    //     <button
    //       type="button"
    //       onClick={onBack}
    //       className="
    //         inline-flex
    //         h-12
    //         items-center
    //         justify-center
    //         gap-2
    //         rounded-xl
    //         border
    //         border-border
    //         bg-white
    //         px-5
    //         font-bold
    //         text-text-primary
    //         transition
    //         hover:bg-surface-muted
    //       "
    //     >
    //       <ArrowLeft
    //         className="
    //           h-4 w-4
    //         "
    //       />
    //       Back
    //     </button>

    //     <button
    //       type="button"
    //       disabled={!isValid}
    //       onClick={onSubmit}
    //       className="
    //         h-12
    //         rounded-xl
    //         bg-primary
    //         px-6
    //         font-bold
    //         text-white
    //         transition
    //         hover:bg-primary-hover
    //         disabled:cursor-not-allowed
    //         disabled:opacity-50
    //       "
    //     >
    //       Become a Seller
    //     </button>
    //   </div>
    // </section>
  );
}
