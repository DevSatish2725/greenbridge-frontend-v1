  import {
  SELLER_RATING_TAGS,
  SellerRatingTag,
} from "@/types/seller-rating";

export const RATING_TAG_LABELS: Record<
  SellerRatingTag,
  string
> = {
  [SELLER_RATING_TAGS.FRESH_PRODUCE]:
    "Fresh Produce",

  [SELLER_RATING_TAGS.FAIR_PRICE]:
    "Fair Price",

  [SELLER_RATING_TAGS.GOOD_BEHAVIOR]:
    "Good Behaviour",

  [SELLER_RATING_TAGS.GOOD_COMMUNICATION]:
    "Good Communication",

  [SELLER_RATING_TAGS.QUANTITY_AVAILABLE]:
    "Quantity Available",

  [SELLER_RATING_TAGS.PRICE_DIFFERENT]:
    "Price Different",

  [SELLER_RATING_TAGS.STOCK_UNAVAILABLE]:
    "Stock Unavailable",

  [SELLER_RATING_TAGS.QUALITY_ISSUE]:
    "Quality Issue",
};