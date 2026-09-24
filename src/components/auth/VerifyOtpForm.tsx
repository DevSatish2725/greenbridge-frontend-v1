"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";

import { useAuth } from "@/providers/AuthProvider";
import { setClientLanguage } from "@/utils/language.utils";
import { useTranslations } from "next-intl";

interface VerifyOtpFormProps {
  mode: "login" | "register";
}

export default function VerifyOtpForm({ mode }: VerifyOtpFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessTokenSetter, getUserProfile } = useAuth();

  const mobileNumber = searchParams.get("mobileNumber") ?? "";

  const returnTo = searchParams.get("returnTo") || "/sellers";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const t = useTranslations("Login");

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (mode === "login") {
        const response = await authService.verifyLoginOtp({
          mobileNumber,
          otp,
        });
        return {
          type: "LOGIN" as const,
          response,
        };
      }

      const response = await authService.verifyRegistrationOtp({
        mobileNumber,
        otp,
      });

      return {
        type: "REGISTER" as const,
        response,
      };
    },

    onSuccess: async (result) => {
      if (result.type === "LOGIN") {
        accessTokenSetter(result.response.data.accessToken);
        if (result.response.data.user.preferredLanguage) {
          setClientLanguage(result.response.data.user.preferredLanguage);
        }
        const currentUser = await getUserProfile();
        router.refresh();
        if (returnTo === "/become-seller") {
          if (currentUser?.sellerProfile) {
            router.replace("/seller/dashboard");
          } else {
            router.replace("/become-seller");
          }

          return;
        }
        if (currentUser?.sellerProfile) {
          router.replace("/seller/dashboard");
          return;
        }
        router.replace(returnTo);
        return;
      }

      const params = new URLSearchParams({
        registrationToken: result.response.data.registrationToken,
        returnTo,
      });

      router.replace(`/register/complete?${params.toString()}`);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? t("invalidOtp"));

        return;
      }

      setError("Something went wrong.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError(t("enterSixDigitOtp"));

      return;
    }

    setError("");

    verifyMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-2xl border border-border
        bg-surface p-5 shadow-sm
      "
    >
      <div className="mb-5 rounded-xl bg-primary-light p-4">
        <p className="text-xs text-text-secondary">{t("otpSent")}</p>

        <p className="mt-1 font-bold text-text-primary">+91 {mobileNumber}</p>
      </div>

      <Input
        id="otp"
        label="OTP"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder={t("sixDigitOtp")}
        maxLength={6}
        value={otp}
        error={error}
        disabled={verifyMutation.isPending}
        onChange={(event) => {
          setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));

          setError("");
        }}
      />

      <Button
        type="submit"
        fullWidth
        className="mt-6"
        disabled={verifyMutation.isPending}
      >
        {verifyMutation.isPending ? t("verifying") : t("verify")}
      </Button>

      <button
        type="button"
        className="
          mt-5 min-h-11 w-full
          text-sm font-semibold text-primary
        "
      >
        {t("resendOtp")}
      </button>
    </form>
  );
}
