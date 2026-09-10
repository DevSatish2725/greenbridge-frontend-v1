import axiosInstance from "@/lib/axios";
import { SellerShopData, SellerShopResponse } from "@/types/seller-shop.types";

import type {
  SellerResponse,
  SellerSearchParams,
} from "@/types/seller.types";

export const sellerService = {
  async getSellers(params: SellerSearchParams): Promise<SellerResponse> {
    const response = await axiosInstance.get<SellerResponse>(
      "/sellers",
      {
        params,
      },
    );

    return response.data;
  },

  async getCallSeller(sellerId: string) {
    const response = await axiosInstance.get(`/sellers/${sellerId}`);
    return response.data;
  },

   async getSellerShop(
    sellerId: string,
  ): Promise<SellerShopData> {
    const response =
      await axiosInstance.get<SellerShopResponse>(
        `/sellers/${sellerId}/shop`,
      );

    return response.data.data;
  },
   
  async applyForSeller(payload) {
    const response = await axiosInstance.post("/seller/apply", payload);
    return response.data
   }
};
