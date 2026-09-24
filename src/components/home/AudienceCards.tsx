"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AudienceCards() {
  const router = useRouter();
  const t = useTranslations("Home.audience");

  const buyerBenefits = [
    t("buyer.points.nearby"),
    t("buyer.points.availability"),
    t("buyer.points.compare"),
    t("buyer.points.contact"),
  ];

  const sellerBenefits = [
    t("seller.points.availability"),
    t("seller.points.prices"),
    t("seller.points.discovered"),
    t("seller.points.reputation"),
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        <AudienceCard
          title={t("buyer.title")}
          subtitle={t("buyer.subtitle")}
          benefits={buyerBenefits}
          button={t("buyer.button")}
          onClick={() => router.push("/sellers")}
          image="/images/home/buyer-illustration.webp"
          variant="buyer"
        />

        <AudienceCard
          title={t("seller.title")}
          subtitle={t("seller.subtitle")}
          benefits={sellerBenefits}
          button={t("seller.button")}
          onClick={() => router.push("/become-seller")}
          image="/images/home/seller-illustration.webp"
          variant="seller"
        />
      </div>
    </section>
  );
}

interface AudienceCardProps {
  title: string;
  subtitle: string;
  benefits: string[];
  button: string;
  image: string;
  variant: "buyer" | "seller";
  onClick: () => void;
}

function AudienceCard({
  title,
  subtitle,
  benefits,
  button,
  image,
  variant,
  onClick,
}: AudienceCardProps) {
  const buyer = variant === "buyer";

  return (
    <article
      className={`
        relative min-h-61.25 overflow-hidden rounded-2xl border
        sm:min-h-65
        ${
          buyer
            ? "border-[#cfe7d5] bg-[#eef8ef]"
            : "border-[#ead3a5] bg-[#fff3dc]"
        }
      `}
    >
      {/* Background image */}
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-left"
      />

      {/* 
        Soft overlay behind text.
        Keeps the illustration visible while making translated text readable.
      */}
      <div
        className={`
          absolute inset-0 z-1
          ${
            buyer
              ? "bg-linear-to-l from-[#eef8ef]/98 via-[#eef8ef]/90 to-transparent"
              : "bg-linear-to-l from-[#fff6e6]/98 via-[#fff6e6]/90 to-transparent"
          }
        `}
      />

      {/* Content */}
      <div className="relative z-10 min-h-61,25 px-5 py-5 sm:min-h-65 sm:px-6">
        <div className="ml-auto flex w-[52%] flex-col">
          <h2 className="text-xl font-extrabold leading-tight text-[#17201a] sm:text-2xl">
            {title}
          </h2>

          <p
            className={`mt-1 text-sm font-semibold ${
              buyer ? "text-[#159447]" : "text-accent"
            }`}
          >
            {subtitle}
          </p>

          <div className="mt-4 space-y-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-2 text-[13px] leading-5 text-[#26332a]"
              >
                <CheckCircle2
                  size={15}
                  className={`mt-0.5 shrink-0 ${
                    buyer ? "text-[#159447]" : "text-accent"
                  }`}
                />

                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onClick}
            className={`
              mt-4 inline-flex min-h-10 w-fit items-center
              justify-center gap-2 rounded-lg px-5
              text-sm font-semibold text-white
              shadow-sm transition
              ${
                buyer
                  ? "bg-[#159447] hover:bg-[#107a3a]"
                  : "bg-accent hover:bg-[#744b00]"
              }
            `}
          >
            {button}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
