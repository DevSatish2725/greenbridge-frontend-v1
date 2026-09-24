"use client";

import { useState } from "react";
import {
  CheckCircle2,
  LocateFixed,
  MapPin,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";

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
  isManualSelected,
  onLocationChange,
  onChooseLocation,
  handleManualLocationClose,
}: LocationSelectorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("FindSellers");

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
      {/* Heading */}
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg bg-accent-light
            text-accent
          "
        >
          <MapPin size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-text-primary">
            {t("subtitle")}
          </h2>

          <p className="text-xs text-text-secondary">
            {t("location.description")}
          </p>
        </div>
      </div>

      {/* Location options */}
      <div className="grid grid-cols-1 gap-2">
        {/* Current location */}
        <button
          type="button"
          disabled={isLocating}
          onClick={() => {
            handleUseCurrentLocation();
            handleManualLocationClose();
          }}
          className="
            flex min-h-14 items-center gap-3
            rounded-xl
            bg-primary
            px-4 py-2.5
            text-left text-white
            transition-colors
            hover:bg-primary-hover
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <LocateFixed size={21} className="shrink-0" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5">
              {isLocating
                ? t("location.currentLocation.gettingLocation")
                : t("location.currentLocation.title")}
            </p>

            <p className="text-xs leading-4 text-white/80">
              {t("location.currentLocation.description")}
            </p>
          </div>

          {isCurrentLocation && (
            <CheckCircle2 size={19} className="shrink-0" />
          )}
        </button>

        {/* Manual location */}
        <button
          type="button"
          onClick={() => {
            onChooseLocation();
            setIsCurrentLocation(false);
          }}
          className="
            flex min-h-14 items-center gap-3
            rounded-xl
            border border-accent
            bg-surface
            px-4 py-2.5
            text-left
            transition-colors
            hover:bg-accent-light
          "
        >
          <Search size={21} className="shrink-0 text-accent" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5 text-accent">
              {t("location.manual.title")}
            </p>

            <p className="text-xs leading-4 text-text-secondary">
              {t("location.manual.description")}
            </p>
          </div>

          {isManualSelected && (
            <CheckCircle2
              size={19}
              className="shrink-0 text-accent"
            />
          )}
        </button>
      </div>

      {/* Geolocation error */}
      {error && (
        <p
          role="alert"
          className="mt-2 text-xs text-error"
        >
          {error}
        </p>
      )}
    </section>
  );
}