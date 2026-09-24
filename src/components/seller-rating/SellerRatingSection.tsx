"use client";

import { useState } from "react";

import { Star } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { sellerRatingService } from "@/services/seller-rating.service";

import { RATING_TAG_LABELS } from "@/constants/seller-rating.constants";

import { SellerRatingSummary, SellerRatingTag } from "@/types/seller-rating";

import RatingModal from "./SellerRating.model";
import { API_ERROR } from "@/lib/axios";
import { useTranslations } from "next-intl";

interface SellerRatingSummaryWithOther extends SellerRatingSummary {
  isLoading: boolean;
  isError: boolean;
}

interface SellerRatingSectionProps {
  sellerId: string;
  isLoggedIn: boolean;
  sellerRatingSummary: SellerRatingSummaryWithOther;
}

export default function SellerRatingSection({
  sellerId,
  isLoggedIn,
  sellerRatingSummary,
}: SellerRatingSectionProps) {

  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = useTranslations("SellerShop");

  /**
   * Public rating information.
   * Guest users can also see this.
   */

  /**
   * Private buyer-specific rating state.
   *
   * Don't call this API for guests.
   */
  const ratingStatusQuery = useQuery({
    queryKey: ["seller-rating-me", sellerId],

    queryFn: () => sellerRatingService.getMyRatingStatus(sellerId),

    enabled: isLoggedIn,
  });

  const existingRating = ratingStatusQuery.data?.rating;

  const createMutation = useMutation({
    mutationFn: (payload: { rating: number; tags: SellerRatingTag[] }) =>
      sellerRatingService.createRating({
        sellerId,
        ...payload,
      }),

    onSuccess: async () => {
      toast.success("Rating submitted successfully.");

      setIsModalOpen(false);

      await refreshRatingData();
    },

    onError: (error: API_ERROR) => {
      toast.error(error.response?.data?.message ?? "Unable to submit rating.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { rating: number; tags: SellerRatingTag[] }) =>
      sellerRatingService.updateRating({ sellerId, ...payload }),

    onSuccess: async () => {
      toast.success("Rating updated successfully.");

      setIsModalOpen(false);

      await refreshRatingData();
    },

    onError: (error: API_ERROR) => {
      toast.error(error.response?.data?.message ?? "Unable to update rating.");
    },
  });

  async function refreshRatingData() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["seller-rating-me", sellerId],
      }),

      queryClient.invalidateQueries({
        queryKey: ["seller-rating-summary", sellerId],
      }),

      queryClient.invalidateQueries({
        queryKey: ["sellers"],
      }),
    ]);
  }

  const handleSubmit = (payload: {
    rating: number;
    tags: SellerRatingTag[];
  }) => {
    if (existingRating) {
      updateMutation.mutate(payload);

      return;
    }

    createMutation.mutate(payload);
  };

  const status = ratingStatusQuery.data;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <section className="mt-5 border-t border-[#e7d8b9] pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#17201a]">
              {t("ratingsAndFeedback")}
            </h3>

            <p className="mt-1 text-sm text-[#536157]">
              {t("ratingsDescription")}
            </p>
          </div>

          {sellerRatingSummary.ratingCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-[#fff3dc] px-3 py-2">
              <Star size={18} className="fill-[#efa536] text-[#efa536]" />

              <span className="font-bold text-[#17201a]">
                {sellerRatingSummary.averageRating.toFixed(1)}
              </span>

              <span className="text-sm text-[#536157]">
                ({sellerRatingSummary.ratingCount})
              </span>
            </div>
          )}
        </div>

        {sellerRatingSummary.ratingCount > 0 ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(sellerRatingSummary.tagCounts)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([tag, count]) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#edf8ef] px-3 py-1.5 text-xs font-medium text-[#107a3a]"
                  >
                    {RATING_TAG_LABELS[tag as SellerRatingTag]}
                    {" · "}
                    {count}
                  </span>
                ))}
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-xl bg-white/60 px-4 py-3">
            <p className="text-sm font-medium text-[#17201a]">
              {t("noRatingsYet")}
            </p>
            <p className="mt-1 text-sm text-[#536157]">
              {t("beFirstToShareExperience")}
            </p>
          </div>
        )}

        {isLoggedIn && (
          <div className="mt-5">
            {status?.reason === "CONTACT_REQUIRED" && (
              <div className="rounded-xl border border-[#e7d8b9] bg-white px-4 py-3">
                <p className="text-sm font-medium text-[#17201a]">
                  {t("wantToLeaveRating")}
                </p>

                <p className="mt-1 text-sm text-[#536157]">
                  {t("contactBeforeRating")}
                </p>
              </div>
            )}

            {status?.reason === "WAITING_PERIOD" && (
              <div className="rounded-xl border border-[#e7d8b9] bg-white px-4 py-3">
                <p className="text-sm font-medium text-[#17201a]">
                  Rating will be available soon
                </p>

                <p className="mt-1 text-sm text-[#536157]">
                  You can rate this seller after your contact waiting period is
                  complete.
                </p>

                {status.eligibleAt && (
                  <p className="mt-1 text-xs text-[#536157]">
                    Available after{" "}
                    {new Date(status.eligibleAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {status?.canRate && !status.hasRated && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded-xl bg-[#159447] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#107a3a]"
              >
                Rate this seller
              </button>
            )}

            {status?.hasRated && existingRating && (
              <div className="rounded-xl border border-[#dcebdc] bg-[#edf8ef] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#17201a]">
                      Your rating
                    </p>

                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={17}
                          className={
                            star <= existingRating.rating
                              ? "fill-[#efa536] text-[#efa536]"
                              : "text-[#cfcfcf]"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-semibold text-[#159447] hover:text-[#107a3a]"
                  >
                    Edit
                  </button>
                </div>

                {existingRating.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {existingRating.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white px-2.5 py-1 text-xs text-[#536157]"
                      >
                        {RATING_TAG_LABELS[tag]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <RatingModal
        key={`${existingRating?._id ?? "new"}-${isModalOpen}`}
        open={isModalOpen}
        mode={existingRating ? "EDIT" : "CREATE"}
        initialRating={existingRating?.rating ?? 0}
        initialTags={existingRating?.tags ?? []}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
