import axiosInstance from "@/lib/axios";

import { UpdateProfilePayload, UserProfile } from "@/types/profile.types";

import { ApiResponse } from "@/lib/axios";

export const profileService = {
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const response = await axiosInstance.patch<ApiResponse<UserProfile>>(
      "/users/me",
      payload,
    );

    return response.data.data;
  },
};
