"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

interface VerifiedSellerRouteProps {
  children: React.ReactNode;
}

export default function VerifiedSellerRoute({
  children,
}: VerifiedSellerRouteProps) {
  const router = useRouter();

  const {
    user,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(
        "/login",
      );
      return;
    }

    if (!user.sellerProfile) {
      router.replace(
        "/become-seller",
      );
      return;
    }

    if (
      user.sellerProfile
        .verificationStatus !==
      "VERIFIED"
    ) {
      router.replace(
        "/seller/dashboard",
      );
    }
  }, [
    user,
    isLoading,
    router,
  ]);

  if (isLoading) {
    return null;
  }

  if (
    !user?.sellerProfile ||
    user.sellerProfile
      .verificationStatus !==
      "VERIFIED"
  ) {
    return null;
  }

  return children;
}