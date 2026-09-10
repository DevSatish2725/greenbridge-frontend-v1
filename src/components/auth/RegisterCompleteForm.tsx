"use client";

import { FormEvent, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import axios from "axios";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessTokenSetter, getUserProfile } = useAuth();

  const registrationToken = searchParams.get("registrationToken") ?? "";

  const returnTo = searchParams.get("returnTo") || "/sellers";

  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const registerMutation = useMutation({
    mutationFn: authService.completeRegistration,

    onSuccess: async (response) => {
      accessTokenSetter(response.data.accessToken);
      await getUserProfile();
      router.replace(returnTo);
    },

    onError: (error) => {
      console.log("register error", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "खाता बनाने में समस्या हुई।");

        return;
      }

      setError("Something went wrong.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = fullName.trim();

    if (name.length < 2) {
      setError("कृपया अपना नाम दर्ज करें।");
      return;
    }

    if (!registrationToken) {
      setError("Registration session expired. Please verify your phone again.");

      return;
    }

    setError("");

    registerMutation.mutate({
      fullName: name,
      registrationToken,
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
        id="fullName"
        label="पूरा नाम · Full name"
        type="text"
        autoComplete="name"
        placeholder="अपना नाम दर्ज करें"
        value={fullName}
        error={error}
        disabled={registerMutation.isPending}
        onChange={(event) => {
          setFullName(event.target.value);
          setError("");
        }}
      />

      <Button
        type="submit"
        fullWidth
        className="mt-6"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending
          ? "खाता बना रहे हैं..."
          : "जारी रखें · Continue"}
      </Button>
    </form>
  );
}
