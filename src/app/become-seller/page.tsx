"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BecomeSellerForm from "@/components/seller/onboarding/BecameSellerForm";
import { useAuth } from "@/providers/AuthProvider";

function BecomeSellerContent() {
  const router = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    if (user?.sellerProfile) {
      router.replace(
        "/seller/dashboard",
      );
    }
  }, [
    user,
    router,
  ]);

  if (user?.sellerProfile) {
    return null;
  }

  return <BecomeSellerForm />;
}

export default function BecomeSellerPage() {
  return (
    <ProtectedRoute
      redirectTo={`/login?returnTo=${encodeURIComponent(
        "/become-seller",
      )}`}
    >
      <BecomeSellerContent />
    </ProtectedRoute>
  );
}