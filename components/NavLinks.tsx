"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/restaurants", label: "Restaurants" },
  { href: "/staff", label: "Staff" },
  { href: "/vendors", label: "Vendors" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
            style={{
              color: active ? "#e05523" : "#4b5563",
              background: active ? "rgba(224,85,35,0.08)" : "transparent",
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
