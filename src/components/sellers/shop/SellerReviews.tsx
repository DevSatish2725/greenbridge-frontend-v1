import {
  Star,
} from "lucide-react";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface SellerReviewsProps {
  reviews: Review[];
  totalReviews: number;
}

export default function SellerReviews({
  reviews,
  totalReviews,
}: SellerReviewsProps) {
  return (
    <section
      id="reviews"
      className="
        rounded-2xl
        border border-border
        bg-white
        p-4
        shadow-sm
        sm:p-5
      "
    >
      <div
        className="
          flex items-center
          justify-between
          gap-3
        "
      >
        <h2
          className="
            text-lg
            font-bold
            text-text-primary
            sm:text-xl
          "
        >
          Customer Reviews
          <span
            className="
              ml-1
              text-sm
              font-medium
              text-text-muted
            "
          >
            ({totalReviews})
          </span>
        </h2>

        {totalReviews > reviews?.length && (
          <button
            type="button"
            className="
              text-sm
              font-semibold
              text-primary
              hover:underline
            "
          >
            View All
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {reviews?.map((review) => (
          <article
            key={review.id}
            className="
              rounded-xl
              border border-border
              p-4
            "
          >
            <div
              className="
                flex items-start
                justify-between
                gap-4
              "
            >
              <div
                className="
                  flex min-w-0
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-accent-light
                    font-bold
                    text-text-primary
                  "
                >
                  {review.reviewerName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-text-primary
                    "
                  >
                    {review.reviewerName}
                  </p>

                  <div className="mt-0.5 flex">
                    {Array.from({
                      length: 5,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        className={`
                          h-4 w-4
                          ${
                            index < review.rating
                              ? "fill-warning text-warning"
                              : "text-border"
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <span
                className="
                  shrink-0
                  text-xs
                  text-text-muted
                "
              >
                {review.createdAt}
              </span>
            </div>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-text-secondary
              "
            >
              {review.comment}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}