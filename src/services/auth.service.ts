import axiosInstance from "@/lib/axios";
import refreshClient from "@/lib/refresh-client";

import type {
  RegisterPayload,
  RegisterResponse,
  SendOtpPayload,
  SendOtpResponse,
  MeResponse,
  RefreshTokenResponse,
  VerifyLoginOtpResponse,
  VerifyRegistrationOtpResponse,
} from "@/types/auth.types";

export const authService = {
  async sendLoginOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
    const response = await axiosInstance.post("/auth/login/send-otp", payload);

    return response.data;
  },

  async verifyLoginOtp(payload: {
    mobileNumber: string;
    otp: string;
  }): Promise<VerifyLoginOtpResponse> {
    const response = await axiosInstance.post<VerifyLoginOtpResponse>(
      "/auth/login",
      payload,
    );

    return response.data;
  },

  async sendRegistrationOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
    const response = await axiosInstance.post(
      "/auth/register/send-otp",
      payload,
    );

    return response.data;
  },

  async verifyRegistrationOtp(payload: {
    mobileNumber: string;
    otp: string;
  }): Promise<VerifyRegistrationOtpResponse> {
    const response = await axiosInstance.post<VerifyRegistrationOtpResponse>(
      "/auth/verify-otp",
      payload,
    );

    return response.data;
  },
  async completeRegistration(data: RegisterPayload): Promise<RegisterResponse> {
    const { fullName, registrationToken } = data;
    const response = await axiosInstance.post(
      "/auth/register",
      { fullName },
      {
        headers: {
          Authorization: `Bearer ${registrationToken}`,
        },
      },
    );

    return response.data;
  },

  async getMe(): Promise<MeResponse> {
    const response = await axiosInstance.get<MeResponse>("/auth/me");

    return response.data;
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await refreshClient.post<RefreshTokenResponse>(
      "/auth/refresh-token",
    );

    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout");
  },
};
