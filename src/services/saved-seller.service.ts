import axiosInstance from "@/lib/axios";
import { RemoveSavedSellerResponse, SavedSeller, SavedSellersResponse, SaveSellerResponse } from "@/types/saved-seller.types";

export const savedSellerService = {
  saveSeller: async (
    sellerProfileId: string,
  ): Promise<SaveSellerResponse> => {
    const response =
      await axiosInstance.post(
        `/sellers/${sellerProfileId}/save`,
      );

    return response.data;
  },

  removeSavedSeller: async (
    sellerProfileId: string,
  ): Promise<RemoveSavedSellerResponse> => {
    const response =
      await axiosInstance.delete(
        `/sellers/${sellerProfileId}/save`,
      );

    return response.data;
  },

  getSavedSellers: async (): Promise<SavedSeller[]> => {
    const response =
      await axiosInstance.get<SavedSellersResponse>(
        "/sellers/saved",
      );

    return response.data.data;
  },
};