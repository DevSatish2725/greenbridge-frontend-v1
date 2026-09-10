export interface SendOtpPayload {
  mobileNumber: string;
}

export interface VerifyOtpPayload {
  mobileNumber: string;
  otp: string;
}

export interface RegisterPayload {
  fullName: string;
  registrationToken: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  mobileNumber: string;
  isPhoneVerified: boolean;
  sellerProfile: {sellerId: string} | null
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export type VerifyOtpData =
  | {
      action: "LOGIN";
      user: AuthUser;
      accessToken: string;
    }
  | {
      action: "REGISTER";
      mobileNumber: string;
      registrationToken: string;
    };

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: VerifyOtpData;
}

export interface RegisterResponse {
  success: boolean;
  message: string;

  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export interface VerifyLoginOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface VerifyRegistrationOtpResponse {
  success: boolean;
  message: string;
  data: {
    mobileNumber: string;
    registrationToken: string;
  };
}
