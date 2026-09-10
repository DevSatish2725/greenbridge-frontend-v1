import Image from "next/image";
import {
  BarChart3,
  Package,
} from "lucide-react";

interface VegetableCardProps {
  vegetable: {
    itemId: string;
    vegetableName: string;
    image?: string;
    sellerPrice: number;
    marketPrice?: number;
    unit: string;
    availableQty: number;
  };
}

export default function VegetableCard({
  vegetable,
}: VegetableCardProps) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border border-border
        bg-white
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      {/* Mobile = horizontal */}
      <div className="flex sm:block">
        <div
          className="
            relative
            h-32 w-36
            shrink-0
            overflow-hidden
            bg-primary-light

            sm:h-auto
            sm:w-full
            sm:aspect-[16/10]
          "
        >
          {vegetable.image ? (
            <Image
              src={vegetable.image}
              alt={vegetable.vegetableName}
              fill
              className="
                object-cover
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex h-full
                items-center
                justify-center
                text-5xl
              "
            >
              🥬
            </div>
          )}
        </div>

        <div
          className="
            flex min-w-0
            flex-1 flex-col
            justify-center
            p-3
            sm:p-4
          "
        >
          <h3
            className="
              truncate
              text-base
              font-bold
              text-text-primary
            "
          >
            {vegetable.vegetableName}
          </h3>

          <div className="mt-1">
            <span
              className="
                text-xl
                font-bold
                text-primary
              "
            >
              ₹{vegetable.sellerPrice}
            </span>

            <span
              className="
                text-sm
                font-medium
                text-text-secondary
              "
            >
              /{vegetable.unit.toLowerCase()}
            </span>
          </div>

          <div
            className="
              mt-3
              space-y-1.5
              text-sm
              text-text-secondary
            "
          >
            <div
              className="
                flex items-center
                gap-2
              "
            >
              <Package
                className="
                  h-4 w-4
                  shrink-0
                  text-primary
                "
              />

              <span>
                {vegetable.availableQty}{" "}
                {vegetable.unit.toLowerCase()} available
              </span>
            </div>

            {vegetable.marketPrice !== undefined && (
              <div
                className="
                  flex items-center
                  gap-2
                "
              >
                <BarChart3
                  className="
                    h-4 w-4
                    shrink-0
                    text-primary
                  "
                />

                <span>
                  Market price: ₹
                  {vegetable.marketPrice}/
                  {vegetable.unit.toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}