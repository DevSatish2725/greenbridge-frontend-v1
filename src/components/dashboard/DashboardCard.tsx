import { DashboardCardProps } from "@/types/dashobord.types";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function DashboardCard({
  icon,
  title,
  description,
  href,
  action,
  disabled,
}: DashboardCardProps) {
  return (
    <article className="flex min-h-55 flex-col rounded-2xl border border-[#e7d8b9] bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8ef] text-[#159447]">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-[#17201a]">{title}</h2>

      <p className="mt-2 flex-1 text-sm leading-6 text-[#536157]">
        {description}
      </p>

      {disabled ? (
        <div
          className="
      mt-5
      inline-flex
      h-11
      cursor-not-allowed
      items-center
      justify-center
      rounded-xl
      bg-gray-100
      px-4
      text-sm
      font-bold
      text-gray-500
    "
        >
          {action}
        </div>
      ) : (
        <Link
          href={href}
          className="
      mt-5
      inline-flex
      h-11
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-[#159447]
      px-4
      text-sm
      font-bold
      text-white
      transition
      hover:bg-[#107a3a]
    "
        >
          {action}

          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}
