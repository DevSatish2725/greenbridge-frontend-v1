"use client";

import { FormEvent, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import axios from "axios";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import Dropdown from "../ui/Dropdown";
import { SupportedLanguage } from "@/types/common.types";
import { languages } from "@/constants/common.constants";
import { setClientLanguage } from "@/utils/language.utils";
import { useTranslations } from "next-intl";

export default function RegisterForm() {
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("en");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessTokenSetter, getUserProfile } = useAuth();

  const registrationToken = searchParams.get("registrationToken") ?? "";

  const returnTo = searchParams.get("returnTo") || "/sellers";

  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const t = useTranslations("Register");

  const languageChangeHandler = (language: SupportedLanguage) => {
    setSelectedLanguage(language);
  };

  const registerMutation = useMutation({
    mutationFn: authService.completeRegistration,

    onSuccess: async (response) => {
      accessTokenSetter(response.data.accessToken);
      if (response.data.user.preferredLanguage) {
        setClientLanguage(response.data.user.preferredLanguage);
      }
      await getUserProfile();
      router.refresh();
      router.replace(returnTo);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? t("createAccountError"));
        return;
      }

      setError(t("somethingWentWrong"));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = fullName.trim();

    if (name.length < 2) {
      setError(t("fullNameRequired"));
      return;
    }

    if (!registrationToken) {
      setError(t("registrationSessionExpired"));
      return;
    }

    setError("");

    registerMutation.mutate({
      fullName: name,
      preferredLanguage: selectedLanguage,
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
        label={t("fullName")}
        type="text"
        autoComplete="name"
        placeholder={t("fullNamePlaceholder")}
        value={fullName}
        error={error}
        disabled={registerMutation.isPending}
        onChange={(event) => {
          setFullName(event.target.value);
          setError("");
        }}
      />

      <div className="mt-2">
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t("preferredLanguage")}
        </label>
        <Dropdown
          value={selectedLanguage}
          options={languages}
          onChange={(value) =>
            languageChangeHandler(value as SupportedLanguage)
          }
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        className="mt-6"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? t("creatingAccount") : t("continue")}
      </Button>
    </form>
  );
}
