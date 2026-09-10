import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  activePath?: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}

export function NavLink({
  href,
  activePath = href,
  children,
  icon,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();

  const active =
    pathname === activePath ||
    pathname.startsWith(
      `${activePath}/`,
    );

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={
        active ? "page" : undefined
      }
      className={`
        inline-flex
        h-11
        items-center
        gap-2
        rounded-xl
        px-4
        text-sm
        font-semibold
        transition

        ${
          active
            ? "bg-primary-light text-primary"
            : "text-text-primary hover:bg-primary-light hover:text-primary"
        }
      `}
    >
      {icon}

      {children}
    </Link>
  );
}