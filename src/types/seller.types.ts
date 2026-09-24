export interface Vegetable {
  id: string;
  name: string;
  sellerPrice: number;
  unit: string;
  availableQty: number;
  imageUrl?: string;
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

  averageRating: number;
  ratingCount: number;
  vegetables: Vegetable[];
}

export interface SellerResponse {
  data: SellerCardProps[];
  nextCursor: string;
}

export type getCallSellerId = (sellerId: string) => void;

export interface SellerSearchParams {
  latitude?: number;
  longitude?: number;

  state?: string;
  district?: string;
  village?: string;

  vegetableIds?: string[];

  cursor?: string;
  limit?: number;
}

export type SellerVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface SellerApply {
  businessType: string;
  documents: {
    type: string;
    url: string;
  }[];
  location: {
    stateId: string;
    districtId: string;
    villageId: string;
    pincode: string;
  };
  geoLocation?: {
    type: "Point";
    coordinates: number[];
  };
}
