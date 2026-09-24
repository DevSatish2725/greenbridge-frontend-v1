"use client";

import { useLocale } from "next-intl";

import { useRouter } from "next/navigation";

import type { Locale } from "@/i18n/config";
import Dropdown from "../ui/Dropdown";
import { languages } from "@/constants/common.constants";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { setClientLanguage } from "@/utils/language.utils";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();

  const userMutation = useMutation({
    mutationKey: ["user-language"],
    mutationFn: profileService.updateProfile,
    onSuccess: (response) => {
      setClientLanguage(response.preferredLanguage as Locale);
      router.refresh();
    },
  });

  const changeLanguage = (newLocale: Locale) => {
    if (newLocale === locale) {
      return;
    }

    if (user) {
      userMutation.mutate({ preferredLanguage: newLocale });
    }
    setClientLanguage(newLocale);
    router.refresh();
  };

  return (
    <Dropdown
      value={locale}
      options={languages}
      onChange={(value) => changeLanguage(value as Locale)}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
    />
  );
}
