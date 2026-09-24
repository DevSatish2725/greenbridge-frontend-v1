// src/app/(auth)/login/verify-otp/page.tsx

import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { useTranslations } from "next-intl";

export default function LoginVerifyOtpPage() {
  const t = useTranslations("Login");
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-center text-2xl font-bold">
          {t("login")} OTP सत्यापित करें
        </h1>

        <div className="mt-7">
          <VerifyOtpForm mode="login" />
        </div>
      </div>
    </main>
  );
}