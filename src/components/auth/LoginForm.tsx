"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";
import { useTranslations } from "use-intl";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileNumber, setMobileNumber] = useState("");

  const [error, setError] = useState("");

  const t = useTranslations("Login");

  const returnTo = searchParams.get("returnTo") || "/sellers";

  const sendOtpMutation = useMutation({
    mutationFn: authService.sendLoginOtp,

    onSuccess: () => {
      const params = new URLSearchParams({
        mobileNumber,
        returnTo,
      });

      router.push(`/login/verify-otp?${params.toString()}`);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? t("sendOtpError"));

        return;
      }

      setError(t("somethingWentWrong"));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedMobileNumber = mobileNumber.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanedMobileNumber)) {
      setError(t("invalidMobileNumber"));

      return;
    }

    setError("");

    sendOtpMutation.mutate({
      mobileNumber: cleanedMobileNumber,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-2xl border border-border
        bg-surface p-5 shadow-sm
      "
    >
      <Input
        id="mobileNumber"
        label={t("mobileNumber")}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="9876543210"
        maxLength={10}
        value={mobileNumber}
        error={error}
        disabled={sendOtpMutation.isPending}
        onChange={(event) => {
          setMobileNumber(event.target.value.replace(/\D/g, ""));
          setError("");
        }}
      />

      <p className="mt-3 text-sm text-text-secondary">{t("otpHint")}</p>

      <Button
        type="submit"
        fullWidth
        className="mt-6"
        disabled={sendOtpMutation.isPending}
      >
        {sendOtpMutation.isPending ? t("sendingOtp") : t("sendOtp")}
      </Button>
    </form>
  );
}
