import axiosInstance from "@/lib/axios";
import {
  CreateInventoryPayload,
  Inventory,
  UpdateInventoryPayload,
  UpdatePublishedInventoryPayload,
} from "@/types/inventory.types";

export const inventoryService = {
  async getTodayInventory(): Promise<Inventory> {
    const response = await axiosInstance.get("/seller/inventory/today");

    return response.data.data;
  },

  async createFreshInventory(
    payload: CreateInventoryPayload,
  ): Promise<Inventory> {
    const response = await axiosInstance.post(
      "/seller/inventory/create/FRESH",
      payload,
    );

    return response.data.data;
  },

  async copyYesterdayInventory(): Promise<Inventory> {
    const response = await axiosInstance.post("/seller/inventory/create/COPY");

    return response.data.data;
  },

  async publishInventory(inventoryId: string): Promise<Inventory> {
    const response = await axiosInstance.patch(
      `/seller/inventory/publish/${inventoryId}`,
    );

    return response.data.data;
  },

  async updateDraftInventory(
    inventoryId: string,
    payload: UpdateInventoryPayload,
  ): Promise<Inventory> {
    const response = await axiosInstance.patch(
      `/seller/inventory/draft/${inventoryId}`,
      payload,
    );

    return response.data.data;
  },

  async updatePublishedInventory(
    inventoryId: string,
    payload: UpdatePublishedInventoryPayload,
  ): Promise<Inventory> {
    const response = await axiosInstance.patch(
      `/seller/inventory/published/${inventoryId}`,
      payload,
    );

    return response.data.data;
  },
};
