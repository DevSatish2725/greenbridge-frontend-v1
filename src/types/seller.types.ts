export interface Vegetable {
  id: string;
  name: string;
  sellerPrice: number;
  unit: string;
  availableQty: number;
  image?: string;
}

export interface SellerCardProps {
  sellerId: string;
  fullName: string;
  isVerified?: boolean;
  distanceInKm?: number;

  location?: {
    village?: string;
    district?: string;
    state?: string;
  };

  reputation?: {
    averageRating?: number;
    totalDeals?: number;
  };

  vegetables: Vegetable[];
}

export interface SellerResponse {
  data: SellerCardProps[];
}

export type getCallSellerId = (sellerId: string) => void;

export interface SellerSearchParams {
  latitude?: number;
  longitude?: number;
  radiusInKm?: number;

  scope?: "state" | "district" | "village";
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
}
