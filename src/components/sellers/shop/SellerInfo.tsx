import {
  Languages,
  Leaf,
  Sprout,
  Truck,
} from "lucide-react";

interface SellerInfoProps {
  businessType?: string;
  farmingSince?: string;
  languages?: string[];
  delivery?: string;
}

export default function SellerInfo({
  businessType,
  farmingSince,
  languages,
  delivery,
}: SellerInfoProps) {
  return (
    <section
      className="
        rounded-xl
        border border-border
        bg-white
        p-4
        shadow-sm
      "
    >
      <h2
        className="
          text-lg
          font-bold
          text-text-primary
        "
      >
        About the Seller
      </h2>

      <p
        className="
          mt-2
          text-sm
          leading-6
          text-text-secondary
        "
      >
        Fresh vegetables directly from
        the seller. Contact the seller
        for quantity, price and pickup
        or delivery details.
      </p>

      <div className="mt-4 space-y-3">
        <InfoRow
          icon={<Sprout />}
          label="Farm Type"
          value={
            businessType ??
            "Individual Farmer"
          }
        />

        <InfoRow
          icon={<Leaf />}
          label="Farming Since"
          value={farmingSince ?? "—"}
        />

        <InfoRow
          icon={<Languages />}
          label="Languages"
          value={
            languages?.join(", ") ??
            "—"
          }
        />

        <InfoRow
          icon={<Truck />}
          label="Delivery"
          value={
            delivery ??
            "Discuss with seller"
          }
        />
      </div>

      <div
        className="
          mt-5
          rounded-xl
          bg-primary-light
          p-4
        "
      >
        <p
          className="
            font-bold
            text-primary
          "
        >
          Fresh Food. Stronger
          Communities.
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-text-secondary
          "
        >
          Support local farmers and
          strengthen nearby farming
          communities.
        </p>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        grid
        grid-cols-[20px_110px_1fr]
        items-start
        gap-2
        text-sm
      "
    >
      <div
        className="
          [&>svg]:h-4
          [&>svg]:w-4
          [&>svg]:text-primary
        "
      >
        {icon}
      </div>

      <span className="text-text-secondary">
        {label}
      </span>

      <span
        className="
          font-medium
          text-text-primary
        "
      >
        {value}
      </span>
    </div>
  );
}