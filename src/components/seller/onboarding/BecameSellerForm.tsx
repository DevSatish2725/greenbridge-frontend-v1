"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

import SellerDetailsStep from "./SellerDetailsStep";
import SellerLocationStep from "./SellerLocationStep";

import { sellerService } from "@/services/seller.service";
import { useAuth } from "@/providers/AuthProvider";

export type BusinessType =
  | "INDIVIDUAL_FARMER"
  | "FPO"
  | "TRADER"
  | "WHOLESALER";

export interface LocationOption {
  _id: string;
  name: string;
}

export interface SellerOnboardingForm {
  businessType: BusinessType | "";
  preferredLanguage: string;

  state: LocationOption | null;
  district: LocationOption | null;
  village: LocationOption | null;

  pincode: string;

  geoLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const initialForm: SellerOnboardingForm = {
  businessType: "",
  preferredLanguage: "",

  state: null,
  district: null,
  village: null,

  pincode: "",

  geoLocation: null,
};

export default function BecomeSellerForm() {
  const router = useRouter();

  const { getUserProfile } = useAuth();

  const [step, setStep] =
    useState<1 | 2>(1);

  const [form, setForm] =
    useState<SellerOnboardingForm>(
      initialForm,
    );

  const [error, setError] =
    useState("");

  const applyForSellerMutation =
    useMutation({
      mutationFn: async () => {
        if (
          !form.businessType ||
          !form.preferredLanguage ||
          !form.state ||
          !form.district ||
          !form.village ||
          !form.pincode
        ) {
          throw new Error(
            "Please complete all required fields.",
          );
        }

        const payload = {
          businessType:
            form.businessType,

          // Temporary until document upload/S3
          // is implemented.
          documents: [
            {
              type: "PAN",
              url: "https://pan-card.jpg",
            },
          ],

          preferredLanguage:
            form.preferredLanguage,

          location: {
            state:
              form.state.name,

            district:
              form.district.name,

            village:
              form.village.name,

            pincode:
              form.pincode,
          },

          ...(form.geoLocation
            ? {
                geoLocation: {
                  type: "Point" as const,

                  coordinates: [
                    form.geoLocation
                      .longitude,

                    form.geoLocation
                      .latitude,
                  ] as [
                    number,
                    number,
                  ],
                },
              }
            : {}),
        };

        return sellerService.applyForSeller(
          payload,
        );
      },

      onSuccess: async () => {
        /*
         * SellerProfile has now been created
         * in backend, but AuthProvider still
         * contains the previous user with
         * sellerProfile: null.
         */
        const currentUser =
          await getUserProfile();

        if (
          !currentUser?.sellerProfile
        ) {
          setError(
            "Seller profile created but account could not be refreshed.",
          );

          return;
        }

        router.replace(
          "/seller/dashboard",
        );
      },

      onError: (error) => {
        if (
          axios.isAxiosError(error)
        ) {
          setError(
            error.response?.data
              ?.message ??
              "Something went wrong.",
          );

          return;
        }

        if (
          error instanceof Error
        ) {
          setError(error.message);
          return;
        }

        setError(
          "Something went wrong.",
        );
      },
    });

  const handleContinue = () => {
    setError("");

    if (!form.businessType) {
      setError(
        "Please select your business type.",
      );

      return;
    }

    if (
      !form.preferredLanguage
    ) {
      setError(
        "Please select your preferred language.",
      );

      return;
    }

    setStep(2);
  };

  const handleSubmit = () => {
    setError("");

    if (
      !form.state ||
      !form.district ||
      !form.village
    ) {
      setError(
        "Please select your complete location.",
      );

      return;
    }

    if (
      !/^\d{6}$/.test(
        form.pincode,
      )
    ) {
      setError(
        "Please enter a valid 6 digit pincode.",
      );

      return;
    }

    applyForSellerMutation.mutate();
  };

  return (
    <main
      className="
        min-h-[calc(100vh-72px)]
        bg-[#fffaf0]
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >
        {/* Heading */}
        <div className="text-center">
          <h1
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-[#17201a]
              sm:text-4xl
            "
          >
            Become a Seller
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-[#536157]
              sm:text-base
            "
          >
            Start selling your fresh
            produce to buyers near you
          </p>
        </div>

        {/* Stepper */}
        <SellerStepper
          step={step}
        />

        <div
          className="
            mt-8
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_300px]
          "
        >
          {/* Form */}
          <section
            className="
              rounded-2xl
              border
              border-[#e7d8b9]
              bg-white
              p-5
              shadow-sm
              sm:p-7
            "
          >
            {step === 1 ? (
              <SellerDetailsStep
                form={form}
                setForm={setForm}
                onContinue={
                  handleContinue
                }
              />
            ) : (
              <SellerLocationStep
                form={form}
                setForm={setForm}
                onBack={() =>
                  setStep(1)
                }
                onSubmit={
                  handleSubmit
                }
                isSubmitting={
                  applyForSellerMutation.isPending
                }
              />
            )}

            {error && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-700
                "
              >
                {error}
              </div>
            )}
          </section>

          {/* Benefits */}
          <SellerBenefits />
        </div>
      </div>
    </main>
  );
}

function SellerStepper({
  step,
}: {
  step: 1 | 2;
}) {
  return (
    <div
      className="
        mx-auto
        mt-6
        flex
        max-w-xs
        items-start
        justify-center
      "
    >
      <div className="flex flex-col items-center">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#159447]
            font-bold
            text-white
          "
        >
          1
        </div>

        <span
          className="
            mt-2
            text-xs
            font-semibold
            text-[#159447]
          "
        >
          Seller Details
        </span>
      </div>

      <div
        className={`
          mt-5
          h-[2px]
          w-20
          sm:w-28

          ${
            step === 2
              ? "bg-[#159447]"
              : "bg-[#d9dedb]"
          }
        `}
      />

      <div className="flex flex-col items-center">
        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            font-bold

            ${
              step === 2
                ? "bg-[#159447] text-white"
                : "bg-[#edf0ee] text-[#536157]"
            }
          `}
        >
          2
        </div>

        <span
          className={`
            mt-2
            text-xs
            font-semibold

            ${
              step === 2
                ? "text-[#159447]"
                : "text-[#536157]"
            }
          `}
        >
          Location
        </span>
      </div>
    </div>
  );
}

function SellerBenefits() {
  return (
    <aside
      className="
        self-start
        rounded-2xl
        border
        border-[#e7d8b9]
        bg-white
        p-6
        lg:sticky
        lg:top-24
      "
    >
      <div
        className="
          mb-5
          flex
          h-32
          items-center
          justify-center
          rounded-2xl
          bg-[#edf8ef]
          text-6xl
        "
      >
        👨‍🌾
      </div>

      <h2
        className="
          text-xl
          font-extrabold
          text-[#17201a]
        "
      >
        Why sell on GreenBridge?
      </h2>

      <div
        className="
          mt-5
          space-y-4
        "
      >
        <Benefit>
          🌱 Reach more buyers
        </Benefit>

        <Benefit>
          ₹ Get better price
        </Benefit>

        <Benefit>
          🤝 Connect directly
        </Benefit>

        <Benefit>
          📈 Grow your business
        </Benefit>

        <Benefit>
          ❤️ Support local communities
        </Benefit>
      </div>

      <div
        className="
          mt-6
          rounded-xl
          bg-[#edf8ef]
          p-4
          text-sm
          font-semibold
          leading-6
          text-[#107a3a]
        "
      >
        🌿 Together for a stronger
        farming community
      </div>
    </aside>
  );
}

function Benefit({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        text-sm
        font-medium
        text-[#536157]
      "
    >
      {children}
    </div>
  );
}