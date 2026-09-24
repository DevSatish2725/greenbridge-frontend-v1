"use client";

import {
  Building2,
  Package,
  Sprout,
  Store,
  Globe2,
  ArrowRight,
} from "lucide-react";

import type {
  BusinessType,
  SellerOnboardingForm,
} from "./BecameSellerForm";

interface Props {
  form: SellerOnboardingForm;

  setForm: React.Dispatch<
    React.SetStateAction<SellerOnboardingForm>
  >;

  onContinue: () => void;
}

const businessTypes: {
  value: BusinessType;
  title: string;
  hindi: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "INDIVIDUAL_FARMER",
    title: "Individual Farmer",
    hindi: "व्यक्तिगत किसान",
    description:
      "I grow and sell my own produce",
    icon: (
      <Sprout className="h-6 w-6" />
    ),
  },

  {
    value: "FPO",
    title: "FPO",
    hindi: "किसान उत्पादक संगठन",
    description:
      "Farmer Producer Organisation",
    icon: (
      <Building2 className="h-6 w-6" />
    ),
  },

  {
    value: "TRADER",
    title: "Trader",
    hindi: "व्यापारी",
    description:
      "I buy and sell produce",
    icon: (
      <Store className="h-6 w-6" />
    ),
  },

  {
    value: "WHOLESALER",
    title: "Wholesaler",
    hindi: "थोक विक्रेता",
    description:
      "I sell produce in bulk",
    icon: (
      <Package className="h-6 w-6" />
    ),
  },
];

const languages = [
  {
    value: "hi",
    label: "हिंदी (Hindi)",
  },
  {
    value: "en",
    label: "English",
  },
];

export default function SellerDetailsStep({
  form,
  setForm,
  onContinue,
}: Props) {
  const handleBusinessType = (
    businessType: BusinessType,
  ) => {
    setForm((previous) => ({
      ...previous,
      businessType,
    }));
  };

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
          Tell us about yourself
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-[#536157]
          "
        >
          Choose the option that best
          describes your business.
        </p>
      </div>

      <div
        className="
          mt-6
          grid
          gap-4
          sm:grid-cols-2
        "
      >
        {businessTypes.map(
          (business) => {
            const selected =
              form.businessType ===
              business.value;

            return (
              <button
                key={business.value}
                type="button"
                onClick={() =>
                  handleBusinessType(
                    business.value,
                  )
                }
                className={`
                  relative
                  flex
                  min-h-28
                  items-center
                  gap-4
                  rounded-xl
                  border
                  p-4
                  text-left
                  transition

                  ${
                    selected
                      ? "border-[#159447] bg-[#f2fbf4] ring-1 ring-[#159447]"
                      : "border-[#e1e5e2] bg-white hover:border-[#9fcfad]"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full

                    ${
                      selected
                        ? "bg-[#dff3e5] text-[#159447]"
                        : "bg-[#f3f6f4] text-[#536157]"
                    }
                  `}
                >
                  {business.icon}
                </div>

                <div>
                  <p
                    className="
                      font-bold
                      text-[#17201a]
                    "
                  >
                    {business.title}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      text-[#536157]
                    "
                  >
                    {business.hindi}
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-[#7a857d]
                    "
                  >
                    {
                      business.description
                    }
                  </p>
                </div>

                <div
                  className={`
                    absolute
                    right-4
                    top-4
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border

                    ${
                      selected
                        ? "border-[#159447]"
                        : "border-[#aeb8b1]"
                    }
                  `}
                >
                  {selected && (
                    <span
                      className="
                        h-2.5
                        w-2.5
                        rounded-full
                        bg-[#159447]
                      "
                    />
                  )}
                </div>
              </button>
            );
          },
        )}
      </div>

      <div className="mt-6">
        <label
          className="
            mb-2
            block
            text-sm
            font-bold
            text-[#17201a]
          "
        >
          Preferred Language
        </label>

        <div className="relative">
          <Globe2
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              text-[#536157]
            "
          />

          {/* <select
            value={
              form.preferredLanguage
            }
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,

                preferredLanguage:
                  event.target.value,
              }))
            }
            className="
              h-12
              w-full
              appearance-none
              rounded-xl
              border
              border-[#d9dedb]
              bg-white
              pl-12
              pr-4
              text-sm
              font-medium
              text-[#17201a]
              outline-none
              transition
              focus:border-[#159447]
              focus:ring-2
              focus:ring-[#159447]/10
            "
          >
            <option value="">
              Select language
            </option>

            {languages.map(
              (language) => (
                <option
                  key={
                    language.value
                  }
                  value={
                    language.value
                  }
                >
                  {language.label}
                </option>
              ),
            )}
          </select> */}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="
          mt-6
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#159447]
          font-bold
          text-white
          transition
          hover:bg-[#107a3a]
        "
      >
        Continue

        <ArrowRight className="h-5 w-5" />
      </button>
    </>
  );
}