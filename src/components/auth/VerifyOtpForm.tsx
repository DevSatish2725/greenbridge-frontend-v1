"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";

import { useAuth } from "@/providers/AuthProvider";

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
      console.log("login result", result);
      if (result.type === "LOGIN") {
        accessTokenSetter(result.response.data.accessToken);
        const currentUser = await getUserProfile();
        console.log("cons 1");
        if (returnTo === "/become-seller") {
          if (currentUser?.sellerProfile) {
            router.replace("/seller/dashboard");
          } else {
            router.replace("/become-seller");
          }

          return;
        }
        console.log("seller profile 1", currentUser?.sellerProfile);

        if (currentUser?.sellerProfile) {
          console.log("seller profile 2", currentUser.sellerProfile);
          router.replace("/seller/dashboard");
          return;
        }
        console.log("normal router");

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
        setError(error.response?.data?.message ?? "OTP सही नहीं है।");

        return;
      }

      setError("Something went wrong.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError("कृपया 6 अंकों का OTP दर्ज करें।");

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
        <p className="text-xs text-text-secondary">OTP भेजा गया</p>

        <p className="mt-1 font-bold text-text-primary">+91 {mobileNumber}</p>
      </div>

      <Input
        id="otp"
        label="OTP"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="6 अंकों का OTP"
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
        {verifyMutation.isPending
          ? "जाँच रहे हैं..."
          : "सत्यापित करें · Verify"}
      </Button>

      <button
        type="button"
        className="
          mt-5 min-h-11 w-full
          text-sm font-semibold text-primary
        "
      >
        OTP दोबारा भेजें · Resend OTP
      </button>
    </form>
  );
}
