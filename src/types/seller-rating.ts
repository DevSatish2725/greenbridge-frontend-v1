export const SELLER_RATING_TAGS = {
  FRESH_PRODUCE: "FRESH_PRODUCE",
  FAIR_PRICE: "FAIR_PRICE",
  GOOD_BEHAVIOR: "GOOD_BEHAVIOR",
  GOOD_COMMUNICATION: "GOOD_COMMUNICATION",
  QUANTITY_AVAILABLE: "QUANTITY_AVAILABLE",

  PRICE_DIFFERENT: "PRICE_DIFFERENT",
  STOCK_UNAVAILABLE: "STOCK_UNAVAILABLE",
  QUALITY_ISSUE: "QUALITY_ISSUE",
} as const;

export type SellerRatingTag =
  (typeof SELLER_RATING_TAGS)[keyof typeof SELLER_RATING_TAGS];

export interface MySellerRating {
  _id: string;
  rating: number;
  tags: SellerRatingTag[];
  createdAt: string;
  updatedAt: string;
}

export interface SellerRatingStatus {
  hasRated: boolean;
  canRate: boolean;
  eligibleAt: string | null;
  reason?: "CONTACT_REQUIRED" | "WAITING_PERIOD";
  rating: MySellerRating | null;
}

export interface SellerRatingSummary {
  averageRating: number;
  ratingCount: number;
  tagCounts: Record<SellerRatingTag, number>;
}
