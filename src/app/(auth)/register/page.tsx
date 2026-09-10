import Link from "next/link";

import RegisterMobileForm from "@/components/auth/RegisterMobileForm";

export default function RegisterPage() {
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
            अपना खाता बनाएं
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Create your GreenBridge account
          </p>
        </div>

        <div className="mt-7">
          <RegisterMobileForm />
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          पहले से खाता है?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            लॉगिन करें · Login
          </Link>
        </p>
      </div>
    </main>
  );
}
