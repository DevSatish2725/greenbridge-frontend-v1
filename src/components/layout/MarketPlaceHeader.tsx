import Link from "next/link";

export default function MarketplaceHeader() {
  return (
    <header className="flex items-center gap-2">
      <Link
        href="/sellers"
        className="flex items-center gap-2"
      >
        <span
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg bg-primary text-xl
          "
          aria-hidden="true"
        >
          🌿
        </span>

        <span className="text-sm font-bold text-primary">
          GreenBridge Marketplace
        </span>
      </Link>
    </header>
  );
}