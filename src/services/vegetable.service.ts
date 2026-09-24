import axiosInstance from "@/lib/axios";
import { VegetableResponse } from "@/types/vegetable.types";

export const vegetableService = {
  async getVegetables(): Promise<VegetableResponse[]> {
    const response = await axiosInstance.get("/vegetables");

    return response.data.data;
  },
};
