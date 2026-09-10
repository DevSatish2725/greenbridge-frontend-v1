"use client";

import { useState } from "react";
import { MapPin, LocateFixed, Search, CheckCircle2 } from "lucide-react";

export interface CurrentLocation {
  latitude: number;
  longitude: number;
}

interface LocationSelectorProps {
  location?: string;
  isManualSelected: boolean;
  onLocationChange: (location: CurrentLocation) => void;

  onChooseLocation: () => void;
  handleManualLocationClose: () => void;
}

export default function LocationSelector({
  location,
  isManualSelected,
  onLocationChange,
  onChooseLocation,
  handleManualLocationClose,
}: LocationSelectorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isCurrentLocaton, setIsCurrentLocation] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setIsLocating(false);
        setIsCurrentLocation(true);
      },

      (geolocationError) => {
        setIsLocating(false);
        setIsCurrentLocation(false);

        switch (geolocationError.code) {
          case geolocationError.PERMISSION_DENIED:
            setError(
              "Location permission denied. You can choose your location manually.",
            );
            break;

          case geolocationError.POSITION_UNAVAILABLE:
            setError(
              "Current location is unavailable. Please choose your location manually.",
            );
            break;

          case geolocationError.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;

          default:
            setError("Unable to get your current location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  };

  return (
    <section>
      <>
        <div className="mb-4 flex items-center gap-3">
          <div
            className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-full bg-accent-light
              "
            aria-hidden="true"
          >
            📍
          </div>

          <div>
            <h2 className="font-bold text-text-primary">
              Find sellers near you
            </h2>

            <p className="text-sm text-text-secondary">
              Choose how you want to search
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              handleUseCurrentLocation();
              handleManualLocationClose();
            }}
            disabled={isLocating}
            className="
                 flex-1 rounded-lg
                flex
                gap-4
                items-center
                bg-primary
                p-2
                font-semibold text-white
                transition-colors
                hover:bg-primary-hover
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
          >
            <LocateFixed />
            <p className="flex flex-col items-start">
              <span>
                {isLocating ? "Getting location..." : "Use Current Location"}
              </span>
              <span className="text-xs">Find sellers near you</span>
            </p>
            {isCurrentLocaton ? <CheckCircle2 className="ml-auto" /> : null}
          </button>

          <button
            type="button"
            onClick={() => {
              onChooseLocation();
              setIsCurrentLocation(false);
            }}
            className="
                flex-1 rounded-lg
                flex
                items-center
                p-2
                gap-4
                border border-accent
                bg-surface
                font-semibold text-warning
                transition-colors
                hover:bg-accent-light
              "
          >
            <Search />
            <p className="flex flex-col items-start">
              <span>Search Manually</span>
              <span className="text-xs text-left">Choose state, district or village</span>
            </p>
            {isManualSelected ? <CheckCircle2 className="ml-auto" /> : null}
          </button>
        </div>
      </>

      {error && (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      )}
    </section>
  );
}
