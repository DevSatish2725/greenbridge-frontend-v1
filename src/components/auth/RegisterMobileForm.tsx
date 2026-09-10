"use client";

import { FormEvent, useState } from "react";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";

export default function RegisterMobileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");

  const returnTo = searchParams.get("returnTo") || "/sellers";

  const sendOtpMutation = useMutation({
    mutationFn: authService.sendRegistrationOtp,

    onSuccess: () => {
      const params = new URLSearchParams({
        mobileNumber,
        returnTo,
      });

      router.push(
        `/register/verify-otp?${params.toString()}`,
      );
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "OTP भेजने में समस्या हुई।",
        );

        return;
      }

      setError("Something went wrong.");
    },
  });

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanedMobileNumber =
      mobileNumber.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanedMobileNumber)) {
      setError(
        "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।",
      );

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
      <div>
        <Input
          id="mobileNumber"
          label="मोबाइल नंबर · Mobile number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="9876543210"
          maxLength={10}
          value={mobileNumber}
          error={error}
          disabled={sendOtpMutation.isPending}
          onChange={(event) => {
            const value = event.target.value
              .replace(/\D/g, "")
              .slice(0, 10);

            setMobileNumber(value);
            setError("");
          }}
        />
      </div>

      <p className="mt-3 text-sm leading-6 text-text-secondary">
        हम आपके मोबाइल नंबर को सत्यापित करने के लिए OTP भेजेंगे।
      </p>

      <Button
        type="submit"
        fullWidth
        className="mt-6"
        disabled={sendOtpMutation.isPending}
      >
        {sendOtpMutation.isPending
          ? "OTP भेज रहे हैं..."
          : "OTP भेजें · Send OTP"}
      </Button>
    </form>
  );
}