"use client";

import { useState } from "react";
import {
  Handshake,
  Leaf,
  MapPin,
  PackageOpen,
  Phone,
  Search,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";

type Audience = "buyer" | "seller";

export default function HowGreenBridgeWorks() {
  const [audience, setAudience] = useState<Audience>("buyer");

  const t = useTranslations("Home.howItWorks");

  const buyerSteps = [
    {
      icon: Search,
      title: t("buyer.discover.title"),
      description: t("buyer.discover.description"),
    },
    {
      icon: Leaf,
      title: t("buyer.check.title"),
      description: t("buyer.check.description"),
    },
    {
      icon: UserRound,
      title: t("buyer.login.title"),
      description: t("buyer.login.description"),
    },
    {
      icon: Phone,
      title: t("buyer.contact.title"),
      description: t("buyer.contact.description"),
    },
    {
      icon: Handshake,
      title: t("buyer.deal.title"),
      description: t("buyer.deal.description"),
    },
  ];

  const sellerSteps = [
    {
      icon: UserRound,
      title: t("seller.account.title"),
      description: t("seller.account.description"),
    },
    {
      icon: ShieldCheck,
      title: t("seller.verify.title"),
      description: t("seller.verify.description"),
    },
    {
      icon: PackageOpen,
      title: t("seller.inventory.title"),
      description: t("seller.inventory.description"),
    },
    {
      icon: MapPin,
      title: t("seller.discovered.title"),
      description: t("seller.discovered.description"),
    },
    {
      icon: Star,
      title: t("seller.reputation.title"),
      description: t("seller.reputation.description"),
    },
  ];

  const isBuyer = audience === "buyer";
  const steps = isBuyer ? buyerSteps : sellerSteps;

  return (
    <section className="bg-[#f7faf3] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#17201a] sm:text-4xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-[#536157] sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        {/* Audience tabs */}
        <div className="mx-auto mt-6 flex w-fit rounded-xl border border-[#e1e8dc] bg-white/70 p-1">
          {/* Buyer */}
          <button
            type="button"
            onClick={() => setAudience("buyer")}
            aria-pressed={audience === "buyer"}
            className={`flex min-w-33.75 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              audience === "buyer"
                ? "bg-[#159447] text-white shadow-sm"
                : "text-[#536157] hover:bg-[#eef8ef] hover:text-[#159447]"
            }`}
          >
            <UserRound size={17} />
            {t("buyerTab")}
          </button>

          {/* Seller */}
          <button
            type="button"
            onClick={() => setAudience("seller")}
            aria-pressed={audience === "seller"}
            className={`flex min-w-33.75 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              audience === "seller"
                ? "bg-[#efa536] text-white shadow-sm"
                : "text-[#536157] hover:bg-[#fff3dc] hover:text-[#a96712]"
            }`}
          >
            <Leaf size={17} />
            {t("sellerTab")}
          </button>
        </div>

        {/* Desktop */}
        <div className="relative mt-10 hidden lg:block">
          {/* Connector */}
          <div
            className={`absolute left-[10%] right-[10%] top-8 h-px ${
              isBuyer ? "bg-[#cfe7d5]" : "bg-[#ead3a5]"
            }`}
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-5 gap-5">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <div
                key={`${audience}-${title}`}
                className="text-center"
              >
                {/* Step icon */}
                <div
                  className={`relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full ring-8 ring-[#f7faf3] ${
                    isBuyer
                      ? "bg-[#eef8ef] text-[#159447]"
                      : "bg-[#fff3dc] text-[#c47b18]"
                  }`}
                >
                  <Icon size={27} strokeWidth={1.8} />

                  {/* Step number */}
                  <span
                    className={`absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      isBuyer
                        ? "bg-[#d5f2dc] text-[#107a3a]"
                        : "bg-[#f8dfb3] text-[#8a5515]"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-[#17201a]">
                  {title}
                </h3>

                <p className="mx-auto mt-1.5 max-w-52.5 text-sm leading-5 text-[#536157]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet */}
        <div className="mx-auto mt-9 max-w-xl lg:hidden">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div
              key={`${audience}-${title}`}
              className="relative flex gap-4 pb-7 last:pb-0"
            >
              {/* Vertical connector */}
              {index !== steps.length - 1 && (
                <div
                  className={`absolute bottom-0 left-5.75 top-12 w-px ${
                    isBuyer ? "bg-[#cfe7d5]" : "bg-[#ead3a5]"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  isBuyer
                    ? "bg-[#eef8ef] text-[#159447]"
                    : "bg-[#fff3dc] text-[#c47b18]"
                }`}
              >
                <Icon size={21} strokeWidth={1.8} />

                {/* Step number */}
                <span
                  className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                    isBuyer ? "bg-[#159447]" : "bg-[#efa536]"
                  }`}
                >
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 pt-0.5">
                <h3 className="font-bold text-[#17201a]">
                  {title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-[#536157]">
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