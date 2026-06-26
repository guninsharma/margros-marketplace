import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import MarketplaceDock from "@/components/MarketplaceDock";
import NavLinks from "@/components/NavLinks";

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const initial = (user?.user_metadata?.full_name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(4, 14, 3, 0.70)",
          backdropFilter: "blur(24px) saturate(1.6)",
          WebkitBackdropFilter: "blur(24px) saturate(1.6)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt="Margros"
              width={116}
              height={45}
              className="h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
              style={{ width: "auto" }}
              priority
            />
          </Link>

          <NavLinks />

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden items-center gap-2.5 sm:flex">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: "#e05523" }}
                  >
                    {initial}
                  </div>
                </div>
                <SignOutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                style={{ background: "#e05523" }}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="pb-24 lg:pb-12">{children}</main>

      <MarketplaceDock />
    </div>
  );
}
