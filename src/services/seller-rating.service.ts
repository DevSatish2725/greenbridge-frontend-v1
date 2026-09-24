import { SellerRatingTag } from "@/types/seller-rating";
import axiosInstance from "@/lib/axios";
import { SellerRatingStatus, SellerRatingSummary } from "@/types/seller-rating";

export const sellerRatingService = {
  getMyRatingStatus: async (sellerId: string): Promise<SellerRatingStatus> => {
    const response = await axiosInstance.get(`/sellers/${sellerId}/ratings/me`);

    return response.data.data;
  },

  getRatingSummary: async (sellerId: string): Promise<SellerRatingSummary> => {
    const response = await axiosInstance.get(
      `/sellers/${sellerId}/ratings/summary`,
    );

    return response.data.data;
  },

  createRating: async ({
    sellerId,
    rating,
    tags,
  }: {
    sellerId: string;
    rating: number;
    tags: SellerRatingTag[];
  }) => {
    const response = await axiosInstance.post(`/sellers/${sellerId}/ratings`, {
      rating,
      tags,
    });

    return response.data.data;
  },

  updateRating: async ({
    sellerId,
    rating,
    tags,
  }: {
    sellerId: string;
    rating: number;
    tags: SellerRatingTag[];
  }) => {
    const response = await axiosInstance.patch(
      `/sellers/${sellerId}/ratings/me`,
      {
        rating,
        tags,
      },
    );

    return response.data.data;
  },
};
