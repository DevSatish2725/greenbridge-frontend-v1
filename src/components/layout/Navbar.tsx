"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Store,
  UserPlus,
  LayoutDashboard,
  LogIn,
  UserRound,
  ChevronDown,
  LogOut,
  Heart,
} from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { NavLink } from "./NavLink";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "../common/LanguageSwitcher";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const t = useTranslations("Navbar");

  const { user, isLoading, logout } = useAuth();

  const isAuthenticated = Boolean(user);

  const isSeller = Boolean(user?.sellerProfile);

  const userName = user?.fullName ?? "";

  const initials = userName
    ? userName
        .split(" ")
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <header
        className="
        sticky
        top-0
        z-40
        border-b
        border-border
        bg-white
      "
      >
        <div
          className="
          mx-auto
          flex
          h-18
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
        >
          <Link
            href="/"
            className="
            text-xl
            font-extrabold
            text-primary
          "
          >
            🌿 GreenBridge
          </Link>

          <div
            className="
            h-10
            w-32
            animate-pulse
            rounded-xl
            bg-surface-muted
          "
          />
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  console.log("navbar user", user);
  const becomeSellerHref = isAuthenticated
    ? "/become-seller"
    : `/login?returnTo=${encodeURIComponent("/become-seller")}`;

  const isRegisterActive =
    pathname === "/register" || pathname.startsWith("/register/");

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-border
          bg-white/95
          backdrop-blur
        "
      >
        <div
          className="
            mx-auto
            flex
            h-18
            w-full
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* Logo */}
          <Link
            href="/"
            className="
              flex
              items-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-primary-light
                text-2xl
              "
            >
              🌿
            </div>

            <div className="leading-tight">
              <p
                className="
                  text-lg
                  font-extrabold
                  text-primary
                  sm:text-xl
                "
              >
                GreenBridge
              </p>

              <p
                className="
                  hidden
                  text-xs
                  font-medium
                  text-text-secondary
                  sm:block
                "
              >
                From Farms to Families
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="
              hidden
              items-center
              gap-2
              lg:flex
            "
          >
            <NavLink href="/sellers" icon={<Store className="h-5 w-5" />}>
              {t("findSellers")}
            </NavLink>

            {isSeller ? (
              <NavLink
                href="/seller/dashboard"
                activePath="/seller"
                icon={<LayoutDashboard className="h-5 w-5" />}
              >
                {t("sellerDashboard")}
              </NavLink>
            ) : (
              <NavLink
                href={becomeSellerHref}
                activePath="/become-seller"
                icon={<UserPlus className="h-5 w-5" />}
              >
                {t("becomeSeller")}
              </NavLink>
            )}

            <LanguageSwitcher />

            <div
              className="
                mx-2
                h-7
                w-px
                bg-border
              "
            />

            {!isAuthenticated ? (
              <>
                <NavLink href="/login" icon={<></>}>
                  {t("login")}
                </NavLink>

                <Link
                  href="/register"
                  aria-current={isRegisterActive ? "page" : undefined}
                  className={`
    inline-flex
    h-11
    items-center
    justify-center
    gap-2
    rounded-xl
    px-5
    text-sm
    font-bold
    transition

    ${
      isRegisterActive
        ? "bg-primary-hover text-white ring-2 ring-primary ring-offset-2"
        : "bg-primary text-white hover:bg-primary-hover"
    }
  `}
                >
                  <UserPlus className="h-4 w-4" />
                  {t("register")}
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((previous) => !previous)}
                  className="
      flex
      h-11
      items-center
      gap-3
      rounded-xl
      px-2
      transition
      hover:bg-surface-muted
    "
                >
                  <span
                    className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        bg-primary-light
        text-sm
        font-bold
        text-primary
      "
                  >
                    {initials}
                  </span>

                  <span
                    className="
        max-w-32
        truncate
        text-sm
        font-semibold
        text-text-primary
      "
                  >
                    {userName}
                  </span>

                  <ChevronDown
                    className={`
        h-4
        w-4
        text-text-muted
        transition-transform

        ${isProfileOpen ? "rotate-180" : ""}
      `}
                  />
                </button>

                {isProfileOpen && (
                  <div
                    className="
        absolute
        right-0
        top-[calc(100%+8px)]
        w-52
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-white
        p-1
        shadow-lg
      "
                  >
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="
          flex
          min-h-11
          items-center
          gap-3
          rounded-lg
          px-3
          text-sm
          font-semibold
          text-text-primary
          hover:bg-surface-muted
        "
                    >
                      <UserRound className="h-4 w-4" />
                      {t("myProfile")}
                    </Link>

                    {isSeller && (
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="
            flex
            min-h-11
            items-center
            gap-3
            rounded-lg
            px-3
            text-sm
            font-semibold
            text-text-primary
            hover:bg-surface-muted
          "
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t("sellerDashboard")}
                      </Link>
                    )}

                    <Link
                      href="/saved-sellers"
                      onClick={() => setIsProfileOpen(false)}
                      className=" flex
          min-h-11
          items-center
          gap-3
          rounded-lg
          px-3
          text-sm
          font-semibold
          text-text-primary
          hover:bg-surface-muted"
                    >
                      <Heart size={17} className="h-4 w-4" />
                      {t("savedSellers")}
                    </Link>

                    <div
                      className="
          my-1
          h-px
          bg-border
        "
                    />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
          flex
          min-h-11
          w-full
          items-center
          gap-3
          rounded-lg
          px-3
          text-left
          text-sm
          font-semibold
          text-error
          hover:bg-red-50
        "
                    >
                      <LogOut className="h-4 w-4" />
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile actions */}
          <div
            className="
              flex
              items-center
              gap-2
              lg:hidden
            "
          >
            {!isAuthenticated && (
              <Link
                href="/register"
                className="
                  hidden
                  h-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary
                  px-4
                  text-sm
                  font-bold
                  text-white
                  sm:inline-flex
                "
              >
                Register
              </Link>
            )}

            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setIsMenuOpen(true)}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-white
                text-text-primary
              "
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            lg:hidden
          "
        >
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMenuOpen(false)}
            className="
              absolute
              inset-0
              bg-black/30
            "
          />

          <aside
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-[88%]
              max-w-sm
              flex-col
              bg-white
              p-5
              shadow-2xl
            "
          >
            {/* Mobile header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-border
                pb-4
              "
            >
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span className="text-2xl">🌿</span>

                <span
                  className="
                    text-xl
                    font-extrabold
                    text-primary
                  "
                >
                  GreenBridge
                </span>
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-text-primary
                  hover:bg-surface-muted
                "
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User */}
            {isAuthenticated && (
              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-primary-light
                  p-3
                "
              >
                <span
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    font-bold
                    text-primary
                  "
                >
                  {initials}
                </span>

                <div>
                  <p
                    className="
                      font-bold
                      text-text-primary
                    "
                  >
                    {userName || "My Account"}
                  </p>

                  <p
                    className="
                      text-xs
                      text-text-secondary
                    "
                  >
                    {isSeller ? "Seller account" : "Buyer account"}
                  </p>
                </div>
              </div>
            )}

            {/* Links */}
            <nav
              className="
                mt-5
                flex
                flex-col
                gap-1
              "
            >
              <MobileNavLink
                href="/sellers"
                icon={<Store className="h-5 w-5" />}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("findSellers")}
              </MobileNavLink>

              {isSeller ? (
                <MobileNavLink
                  href="/seller/dashboard"
                  icon={<LayoutDashboard className="h-5 w-5" />}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("sellerDashboard")}
                </MobileNavLink>
              ) : (
                <MobileNavLink
                  href={becomeSellerHref}
                  icon={<UserPlus className="h-5 w-5" />}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("becomeSeller")}
                </MobileNavLink>
              )}

              <div
                className="
                  my-3
                  h-px
                  bg-border
                "
              />

              {!isAuthenticated ? (
                <>
                  <MobileNavLink
                    href="/login"
                    icon={<LogIn className="h-5 w-5" />}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("login")}
                  </MobileNavLink>

                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="
                      mt-2
                      flex
                      h-12
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-primary
                      px-4
                      font-bold
                      text-white
                    "
                  >
                    <UserPlus className="h-5 w-5" />
                    {t("register")}
                  </Link>
                </>
              ) : (
                <>
                  <MobileNavLink
                    href="/profile"
                    icon={<UserRound className="h-5 w-5" />}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("myProfile")}
                  </MobileNavLink>
                  <MobileNavLink
                    href="/saved-sellers"
                    icon={<Heart className="h-5 w-5" />}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("savedSellers")}
                  </MobileNavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
    flex
    min-h-12
    w-full
    items-center
    gap-3
    rounded-xl
    px-3
    font-semibold
    text-error
    transition
    hover:bg-red-50
  "
                  >
                    <LogOut className="h-5 w-5" />
                    {t("logout")}
                  </button>
                </>
              )}
            </nav>

            <div
              className="
                mt-auto
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
                🌿 Fresh Connections
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-text-secondary
                "
              >
                Stronger Communities
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}

function MobileNavLink({ href, children, icon, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        min-h-12
        items-center
        gap-3
        rounded-xl
        px-3
        font-semibold
        text-text-primary
        transition
        hover:bg-primary-light
        hover:text-primary
      "
    >
      {icon}

      {children}
    </Link>
  );
}
