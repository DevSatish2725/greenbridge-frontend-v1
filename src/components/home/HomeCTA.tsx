"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HomeCTA() {
  const router = useRouter();
  const t = useTranslations("Home.cta");

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/home/farm-landscape.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* 
        Base overlay:
        slightly softens the highly saturated landscape.
      */}
      <div className="absolute inset-0 bg-[#fff8e9]/30" />

      {/*
        Center glow:
        creates a calm readable area behind the heading,
        description and buttons while preserving the landscape.
      */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(ellipse_at_center,rgba(255,248,233,0.88)_0%,rgba(255,248,233,0.72)_30%,rgba(255,248,233,0.32)_60%,rgba(255,248,233,0.08)_100%)]
        "
      />

      {/*
        Vertical gradient:
        further reduces the bright sky behind the text
        while keeping the fields visible at the bottom.
      */}
      <div
        className="
          absolute inset-0
          bg-linear-to-b
          from-white/35
          via-[#fff8e9]/25
          to-transparent
        "
      />

      {/* CTA content */}
      <div
        className="
          relative z-10 mx-auto flex
          min-h-57.5 max-w-7xl
          items-center justify-center
          px-5 py-8
          sm:px-8
          lg:min-h-62.5
        "
      >
        <div className="max-w-2xl text-center">
          <h2
            className="
              text-2xl font-extrabold
              leading-tight text-[#17201a]
              sm:text-3xl
              lg:text-[2rem]
            "
          >
            {t("title")}
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-[#455249] sm:text-base">
            {t("description")}
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/sellers")}
              className="
                inline-flex min-h-11 min-w-37.5
                items-center justify-center gap-2
                rounded-lg bg-[#159447] px-6
                text-sm font-semibold text-white
                shadow-sm transition
                hover:bg-[#107a3a]
              "
            >
              {t("findSellers")}
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => router.push("/become-seller")}
              className="
                inline-flex min-h-11 min-w-41.25
                items-center justify-center gap-2
                rounded-lg border border-[#159447]
                bg-white/90 px-6
                text-sm font-semibold text-[#159447]
                shadow-sm backdrop-blur-sm
                transition
                hover:bg-[#eef8ef]
              "
            >
              {t("becomeSeller")}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}