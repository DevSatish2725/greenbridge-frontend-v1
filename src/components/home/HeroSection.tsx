"use client";

import {
  ArrowRight,
  IndianRupee,
  Leaf,
  MapPin,
  Phone,
  Search,
  BadgeCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const router = useRouter();
  const t = useTranslations("Home.hero");

  const benefits = [
    {
      icon: MapPin,
      title: t("benefits.local.title"),
      description: t("benefits.local.description"),
    },
    {
      icon: Leaf,
      title: t("benefits.availability.title"),
      description: t("benefits.availability.description"),
    },
    {
      icon: IndianRupee,
      title: t("benefits.prices.title"),
      description: t("benefits.prices.description"),
    },
    {
      icon: Phone,
      title: t("benefits.contact.title"),
      description: t("benefits.contact.description"),
    },
  ];

  return (
    <section className="relative w-full overflow-hidden border-b border-[#e7d8b9]">
      {/* Background image */}
      <Image
        src="/images/home/hero-farmer.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* 
        Desktop:
        Strong light overlay on left for text,
        gradually transparent toward the farmer/image.
      */}
      <div className="absolute inset-0 bg-linear-to-r from-[#f4f9ed] via-[#f4f9ed]/95 to-[#f4f9ed]/15" />

      {/* Extra mobile overlay for readability */}
      <div className="absolute inset-0 bg-[#f4f9ed]/35 lg:hidden" />

      {/* Main content */}
      <div
        className="  relative z-10 mx-auto flex
    w-full max-w-7xl
    items-center
    px-5 py-8
    sm:px-8 sm:py-9
    lg:px-10 lg:py-10"
      >
        <div className="max-w-150">
          {/* Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e8f7eb]/90 px-3 py-1.5 text-sm font-semibold text-[#107a3a]">
            <Leaf size={16} />
            {t("badge")}
          </div>

          {/* Heading */}
          <h1
            className=" max-w-150
      text-3xl font-extrabold
      leading-[1.15]
      tracking-tight
      text-[#17201a]
      sm:text-4xl
      lg:text-[2.8rem]"
          >
            {t("title")}
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-140 text-base leading-6 text-[#455249] lg:text-[17px]">
            {t("description")}
          </p>

          {/* CTA */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/sellers")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#159447] px-6 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#107a3a] hover:shadow-md"
            >
              <Search size={19} />

              {t("findSellers")}

              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => router.push("/become-seller")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#159447] bg-white/90 px-6 font-semibold text-[#159447] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[#edf8ef]"
            >
              <Leaf size={19} />

              {t("becomeSeller")}

              <ArrowRight size={18} />
            </button>
          </div>

          {/* Verification */}
          <div className="mt-4 flex items-center gap-2 text-sm text-[#455249]">
            <BadgeCheck size={18} className="shrink-0 text-[#159447]" />

            {t("verifiedMessage")}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="relative z-20 border-t border-white/50 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-8 lg:grid-cols-4 lg:px-10">
          {benefits.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className={`
          flex items-center gap-2.5 px-2 py-3
          sm:px-4
          ${index > 0 ? "lg:border-l lg:border-[#dce8d9]" : ""}
        `}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e4f5e8] text-[#159447]">
                <Icon size={17} />
              </div>

              <div>
                <p className="text-xs font-bold text-[#17201a]">{title}</p>

                <p className="text-[11px] leading-4 text-[#536157]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
