"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function RatingStars({
  value,
  onChange,
  readonly = false,
  size = 26,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() =>
              !readonly &&
              onChange?.(star)
            }
            className={
              readonly
                ? "cursor-default"
                : "cursor-pointer transition-transform hover:scale-110"
            }
            aria-label={`${star} star rating`}
          >
            <Star
              size={size}
              className={
                star <= value
                  ? "fill-[#efa536] text-[#efa536]"
                  : "text-[#d8d8d8]"
              }
            />
          </button>
        ),
      )}
    </div>
  );
}