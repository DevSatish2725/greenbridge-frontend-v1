export const BUSINESS_TYPES = {
  INDIVIDUAL_FARMER: "INDIVIDUAL_FARMER",
  FPO: "FPO",
  TRADER: "TRADER",
  WHOLESALER: "WHOLESALER",
} as const;

export type BusinessType =
  (typeof BUSINESS_TYPES)[keyof typeof BUSINESS_TYPES];

export const BUSINESS_TYPE_OPTIONS = [
  {
    value: BUSINESS_TYPES.INDIVIDUAL_FARMER,
    label: "Individual Farmer",
    hindiLabel: "व्यक्तिगत किसान",
    description:
      "I grow and sell my own produce",
  },
  {
    value: BUSINESS_TYPES.FPO,
    label: "FPO",
    hindiLabel: "किसान उत्पादक संगठन",
    description:
      "Farmer Producer Organisation",
  },
  {
    value: BUSINESS_TYPES.TRADER,
    label: "Trader",
    hindiLabel: "व्यापारी",
    description:
      "I buy and sell produce",
  },
  {
    value: BUSINESS_TYPES.WHOLESALER,
    label: "Wholesaler",
    hindiLabel: "थोक विक्रेता",
    description:
      "I sell produce in bulk",
  },
] as const;

export const LANGUAGE_OPTIONS = [
  {
    value: "HI",
    label: "हिंदी",
  },
  {
    value: "EN",
    label: "English",
  },
] as const;