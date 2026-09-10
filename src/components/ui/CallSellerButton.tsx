"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

interface CallSellerButtonProps {
  sellerId: string;
  isLoading: boolean;
  getCallSellerId: (sellerId: string) => void;
  guestCallModalOpen: () => void;
}

export default function CallSellerButton({
  sellerId,
  getCallSellerId,
  guestCallModalOpen,
  isLoading: callSellerLoading,
}: CallSellerButtonProps) {
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();

  const handleCall = () => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      guestCallModalOpen()
      return;
    }

    // Next step:
    // fetch protected seller contact API.
    getCallSellerId(sellerId);
    console.log("authenticated, fetch seller contact API");
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleCall}
      className="
        min-h-12 w-full rounded-xl
        bg-primary px-4 font-bold text-white
        hover:bg-primary-hover
        disabled:opacity-60
      "
    >
      {callSellerLoading ? "Getting call details" : "📞 कॉल करें "}
    </button>
  );
}
