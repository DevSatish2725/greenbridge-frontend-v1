"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BecomeSellerForm from "@/components/seller/onboarding/BecameSellerForm";
import { SellerApplicationRoute } from "@/components/seller/onboarding/SellerApplicationRoute";

function BecomeSellerContent() {
  return (
    <SellerApplicationRoute>
      <BecomeSellerForm />
    </SellerApplicationRoute>
  );
}

export default function BecomeSellerPage() {
  return (
    <ProtectedRoute
      redirectTo={`/login?returnTo=${encodeURIComponent("/become-seller")}`}
    >
      <BecomeSellerContent />
    </ProtectedRoute>
  );
}
