import Link from "next/link";

import RegisterMobileForm from "@/components/auth/RegisterMobileForm";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("Register");
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <div
            className="
              mx-auto flex h-12 w-12 items-center
              justify-center rounded-xl
              bg-primary text-2xl
            "
            aria-hidden="true"
          >
            🌿
          </div>

          <p className="mt-3 text-sm font-bold text-primary">
            GreenBridge Marketplace
          </p>

          <h1 className="mt-7 text-2xl font-bold text-text-primary">
            {t("title")}
          </h1>
        </div>

        <div className="mt-7">
          <RegisterMobileForm />
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          {t("alreadyHaveAccount")}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </main>
  );
}
