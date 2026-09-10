import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

interface VegetableCardProps {
  vegetable: {
    id: string;
    name: string;
    availableQty: number;
    unit: string;
    price: number;
    marketPrice: number;
    negotiable: boolean;
  };
}

export default function VegetableCard({
  vegetable,
}: VegetableCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {vegetable.name}
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            {vegetable.availableQty} {vegetable.unit} available
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-primary">
            ₹{vegetable.price}
          </p>

          <p className="text-sm text-text-muted">
            per {vegetable.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {vegetable.negotiable ? (
          <Badge variant="negotiable">
            Negotiable
          </Badge>
        ) : (
          <Badge variant="warning">
            Fixed price
          </Badge>
        )}

        <p className="text-sm text-text-secondary">
          Market price ₹{vegetable.marketPrice}/{vegetable.unit}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {vegetable.negotiable && (
          <button
            type="button"
            className="
              min-h-12 rounded-lg
              border border-primary
              px-4
              font-semibold text-primary
              transition-colors
              hover:bg-primary-light
            "
          >
            Negotiate
          </button>
        )}

        <button
          type="button"
          className={`
            min-h-12 rounded-lg
            bg-primary
            px-4
            font-semibold text-white
            transition-colors
            hover:bg-primary-hover
            ${vegetable.negotiable ? "" : "col-span-2"}
          `}
        >
          Buy
        </button>
      </div>
    </Card>
  );
}