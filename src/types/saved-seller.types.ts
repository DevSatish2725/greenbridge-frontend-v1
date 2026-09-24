export type SellerAvailabilityStatus =
  | "AVAILABLE"
  | "NO_INVENTORY"
  | "SELLER_UNAVAILABLE";

export type SellerVerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface SavedSellerLocation {
  village: string;
  district: string;
  state: string;
  pincode: string;
}

export interface SavedSellerVegetable {
  id: string;
  name: string;
}

export interface SavedSeller {
  savedSellerId: string;

  sellerProfileId: string;

  name: string;

  location: SavedSellerLocation | null;

  verificationStatus:
    | SellerVerificationStatus
    | null;

  availabilityStatus:
    SellerAvailabilityStatus;

  averageRating: number;

  ratingCount: number;

  availableVegetables:
    SavedSellerVegetable[];

  savedAt: string;
}

export interface SavedSellerCardProps {
  seller: SavedSeller;

  isRemoving: boolean;

  onRemove: (
    sellerProfileId: string,
  ) => void;
}