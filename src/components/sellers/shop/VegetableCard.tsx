import Image from "next/image";
import { BarChart3, Package } from "lucide-react";

interface VegetableCardProps {
  vegetable: {
    itemId: string;
    vegetableName: string;
    image?: string;
    imageUrl?: string;
    sellerPrice: number;
    marketPrice?: number;
    unit: string;
    availableQty: number;
  };
}

export default function VegetableCard({
  vegetable,
}: VegetableCardProps) {
  const unit = vegetable.unit.toLowerCase();

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-[#E1EAE3]
        bg-white
        shadow-[0_2px_8px_rgba(0,0,0,0.05)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-primary/20
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
      "
    >
      {/* Mobile horizontal / Desktop vertical */}
      <div className="flex h-full sm:block">

        {/* Vegetable image */}
        <div
          className="
            relative
            h-36
            w-36
            shrink-0
            overflow-hidden
            bg-white
            sm:aspect-[16/10]
            sm:h-auto
            sm:w-full
          "
        >
          {vegetable.imageUrl ? (
            <Image
              src={vegetable.imageUrl}
              alt={vegetable.vegetableName}
              fill
              sizes="
                (max-width: 639px) 144px,
                (max-width: 1024px) 50vw,
                33vw
              "
              className="
                object-contain
                p-2
                transition-transform
                duration-300
                group-hover:scale-[1.03]
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                text-5xl
              "
            >
              🥬
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            justify-center
            p-3.5
            sm:p-4
          "
        >
          {/* Vegetable name */}
          <h3
            title={vegetable.vegetableName}
            className="
              truncate
              text-base
              font-bold
              leading-tight
              text-text-primary
              sm:text-lg
            "
          >
            {vegetable.vegetableName}
          </h3>

          {/* Seller price */}
          <div className="mt-1.5 flex items-baseline">
            <span
              className="
                text-xl
                font-extrabold
                leading-none
                text-primary
                sm:text-2xl
              "
            >
              ₹{vegetable.sellerPrice}
            </span>

            <span
              className="
                ml-0.5
                text-xs
                font-medium
                text-text-secondary
                sm:text-sm
              "
            >
              /{unit}
            </span>
          </div>

          {/* Available quantity */}
          <div
            className="
              mt-3
              flex
              items-center
              gap-2.5
              rounded-xl
              bg-primary-light
              px-2.5
              py-2
              sm:mt-4
            "
          >
            {/* Package icon */}
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-primary
              "
            >
              <Package
                className="h-4 w-4"
                strokeWidth={2}
              />
            </div>

            <span
              className="
                truncate
                text-xs
                font-medium
                text-text-secondary
                sm:text-sm
              "
            >
              <span className="font-semibold text-text-primary">
                {vegetable.availableQty} {unit}
              </span>{" "}
              available
            </span>
          </div>

          {/* Optional market price */}
          {vegetable.marketPrice !== undefined && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-1.5
                px-1
                text-[11px]
                text-text-secondary
                sm:text-xs
              "
            >
              <BarChart3
                className="
                  h-3.5
                  w-3.5
                  shrink-0
                  text-text-muted
                "
              />

              <span>
                Market price{" "}
                <span className="font-medium text-text-primary">
                  ₹{vegetable.marketPrice}/{unit}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}