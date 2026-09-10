"use client";

import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Package,
  Store,
  UserRound,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/providers/AuthProvider";

export default function SellerDashboardPage() {
  return (
    <ProtectedRoute requireSeller>
      <SellerDashboard />
    </ProtectedRoute>
  );
}

function SellerDashboard() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#fff8e9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="text-sm font-semibold text-[#159447]">
            Seller Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-[#17201a]">
            Good Morning, {user?.fullName} 👋
          </h1>

          <p className="mt-2 text-[#536157]">
            Manage your shop and today&apos;s inventory.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            icon={<Package className="h-6 w-6" />}
            title="Today’s Inventory"
            description="Manage vegetables available for buyers today."
            href="/seller/inventory"
            action="Manage Inventory"
          />

          <DashboardCard
            icon={<Store className="h-6 w-6" />}
            title="My Shop"
            description="See your shop exactly as buyers see it."
            href={`/sellers/${user?.sellerProfile?.sellerId}`}
            action="View My Shop"
          />

          <DashboardCard
            icon={<UserRound className="h-6 w-6" />}
            title="Seller Profile"
            description="Update your business and seller information."
            href="/seller/profile"
            action="Edit Profile"
          />
        </div>

        <section className="mt-8 rounded-2xl border border-[#e7d8b9] bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf8ef] text-[#159447]">
              <MapPin className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#17201a]">
                Keep your inventory updated
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#536157]">
                Buyers discover sellers based on what is available today.
                Update your inventory regularly so buyers see accurate
                vegetables, quantities, and prices.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  action: string;
}

function DashboardCard({
  icon,
  title,
  description,
  href,
  action,
}: DashboardCardProps) {
  return (
    <article className="flex min-h-55 flex-col rounded-2xl border border-[#e7d8b9] bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8ef] text-[#159447]">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-extrabold text-[#17201a]">
        {title}
      </h2>

      <p className="mt-2 flex-1 text-sm leading-6 text-[#536157]">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#159447] px-4 text-sm font-bold text-white transition hover:bg-[#107a3a]"
      >
        {action}

        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}