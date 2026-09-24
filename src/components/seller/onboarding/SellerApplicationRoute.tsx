import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const SellerApplicationRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const { user, isLoading } = useAuth();

  const sellerProfile = user?.sellerProfile;

  const isPending = sellerProfile?.verificationStatus === "PENDING";

  const isVerified = sellerProfile?.verificationStatus === "VERIFIED";

  const isRejected = sellerProfile?.verificationStatus === "REJECTED";

  const shouldRedirectToDashboard = isPending || isVerified;

  const canApply = !sellerProfile || isRejected;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/login?returnTo=${encodeURIComponent("/become-seller")}`);

      return;
    }

    if (shouldRedirectToDashboard) {
      router.replace("/seller/dashboard");
    }
  }, [isLoading, user, shouldRedirectToDashboard, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  if (shouldRedirectToDashboard) {
    return null;
  }
  return children;
};
