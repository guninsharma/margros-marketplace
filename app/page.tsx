import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const categories = [
  {
    href: "/restaurants",
    title: "Restaurants",
    kicker: "Discover",
    description: "Verified restaurants by area, cuisine, category, and rating.",
    icon: Store,
  },
  {
    href: "/staff",
    title: "Staff",
    kicker: "Hire",
    description: "Chefs, service teams, kitchen staff, and hospitality operators.",
    icon: Users,
  },
  {
    href: "/vendors",
    title: "Vendors",
    kicker: "Source",
    description: "Equipment, produce, packaging, hygiene, and operations suppliers.",
    icon: BriefcaseBusiness,
  },
];

const neighborhoods = ["Koramangala", "Indiranagar", "Jayanagar", "Whitefield", "MG Road", "HSR Layout"];

export default async function Home() {
  const supabase = await createClient();

  const [
    { count: restaurantCount },
    { count: staffCount },
    { count: vendorCount },
    { data: featuredRestaurants },
  ] = await Promise.all([
    supabase.from("restaurants").select("*", { count: "exact", head: true }),
    supabase.from("staff").select("*", { count: "exact", head: true }),
    supabase.from("vendors").select("*", { count: "exact", head: true }),
    supabase
      .from("restaurants")
      .select("id,name,locality,category,rating,is_verified,cuisine_type")
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(5),
  ]);

  const stats = [
    { label: "Restaurants", value: restaurantCount ?? 0 },
    { label: "Staff profiles", value: staffCount ?? 0 },
    { label: "Vendor leads", value: vendorCount ?? 0 },
  ];

  return (
    <main className="clay-page min-h-screen text-[#1d1d1f]">
      <header className="sticky top-0 z-40 bg-[#f4efe9]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Margros"
              width={120}
              height={47}
              priority
              className="h-9 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <span className="hidden text-xs font-semibold text-[#6e6e73] sm:inline">Marketplace</span>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-semibold text-[#6e6e73] md:flex">
            <Link href="/restaurants" className="transition-colors hover:text-[#1d1d1f]">Restaurants</Link>
            <Link href="/staff" className="transition-colors hover:text-[#1d1d1f]">Staff</Link>
            <Link href="/vendors" className="transition-colors hover:text-[#1d1d1f]">Vendors</Link>
          </nav>

          <Link
            href="/login"
            className="clay-pill rounded-full bg-[#fffaf3] px-4 py-1.5 text-xs font-bold text-[#1d1d1f] transition-transform hover:-translate-y-0.5"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="relative isolate overflow-hidden px-5 pb-20 pt-14 text-center sm:px-8 lg:pb-28">
        <div className="absolute inset-x-0 top-20 -z-10 mx-auto h-[420px] max-w-5xl rounded-full bg-[radial-gradient(circle_at_center,rgba(243,107,33,0.2),rgba(53,184,90,0.14)_40%,transparent_72%)] blur-3xl" />

        <p className="clay-pill mx-auto inline-flex items-center gap-2 rounded-full bg-[#fffaf3] px-3 py-1.5 text-xs font-bold text-[#6e6e73]">
          <ShieldCheck className="h-4 w-4 text-[#45d06c]" />
          Verified hospitality network for Bengaluru
        </p>

        <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#1d1d1f] sm:text-7xl lg:text-[5.7rem]">
          Margros Marketplace.
          <span className="block text-[#8b7868]">The city&apos;s service layer.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 tracking-[-0.01em] text-[#6e6e73]">
          Restaurants, people, and suppliers in one verified directory built for operators who need a reliable answer fast.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/restaurants"
            className="clay-pop inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Explore marketplace
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/vendors?verified=true"
            className="clay-pill inline-flex items-center gap-2 rounded-full bg-[#fffaf3] px-6 py-3 text-sm font-bold text-[#1d1d1f] transition-transform hover:-translate-y-0.5"
          >
            Verified vendors
            <BadgeCheck className="h-4 w-4 text-[#45d06c]" />
          </Link>
        </div>

        <div className="clay-panel-strong mx-auto mt-14 max-w-5xl p-3">
          <div className="relative overflow-hidden rounded-[22px] px-5 py-8 sm:px-10">
            <div className="absolute inset-x-10 bottom-0 h-40 bg-[radial-gradient(ellipse_at_center,rgba(243,107,33,0.32),rgba(53,184,90,0.18)_42%,transparent_72%)] blur-2xl" />
            <div className="relative mx-auto grid max-w-4xl gap-3 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="clay-inset p-5 text-left text-[#1d1d1f]">
                <p className="text-xs font-bold text-[#6e6e73]">Today&apos;s search</p>
                <h2 className="mt-10 text-4xl font-semibold leading-[1.02] tracking-[-0.04em]">
                  Chef. Vendor. Restaurant.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6e6e73]">
                  Three directories, one verified operating layer.
                </p>
              </div>
              <div className="clay-inset space-y-3 p-4 text-left">
                {(featuredRestaurants ?? []).slice(0, 3).map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurants/${restaurant.id}`}
                    className="clay-panel flex items-center gap-3 px-4 py-3 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="clay-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white">
                      {restaurant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#1d1d1f]">{restaurant.name}</p>
                        {restaurant.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#45d06c]" />}
                      </div>
                      <p className="truncate text-xs font-medium text-[#6e6e73]">
                        {restaurant.locality}{restaurant.category ? ` · ${restaurant.category}` : ""}
                      </p>
                    </div>
                    {restaurant.rating && (
                      <span className="clay-inset rounded-full px-2 py-1 text-xs font-bold text-[#c94d12]">
                        {restaurant.rating}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative mx-auto mt-3 grid max-w-4xl gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="clay-inset px-4 py-4">
                  <p className="text-2xl font-semibold tracking-[-0.02em]">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#6e6e73]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-5 text-[#1d1d1f] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {categories.map(({ href, title, kicker, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="clay-panel group min-h-[360px] overflow-hidden p-7 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="clay-inset rounded-full px-3 py-1 text-xs font-bold text-[#6e6e73]">{kicker}</span>
                <Icon className="h-5 w-5 text-[#f36b21]" />
              </div>
              <h2 className="mt-14 text-4xl font-semibold tracking-[-0.035em]">{title}</h2>
              <p className="mt-3 max-w-sm text-base leading-7 text-[#6e6e73]">{description}</p>
              <span className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-[#f36b21]">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="mt-12 h-28 rounded-[24px] bg-[radial-gradient(circle_at_50%_0%,rgba(243,107,33,0.24),rgba(53,184,90,0.16),transparent_72%)]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-5 text-[#1d1d1f] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="clay-panel p-7 sm:p-10">
            <div className="flex items-center gap-2 text-sm font-bold text-[#248a42]">
              <Sparkles className="h-4 w-4" />
              Live verified matches
            </div>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
              Scan the market like a product catalog.
            </h2>
            <div className="mt-8 space-y-2">
              {(featuredRestaurants ?? []).map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="clay-inset flex items-center gap-3 px-4 py-3 transition-transform hover:-translate-y-0.5"
                >
                  <div className="clay-pop flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white">
                    {restaurant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold">{restaurant.name}</p>
                      {restaurant.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#35b85a]" />}
                    </div>
                    <p className="truncate text-xs font-semibold text-[#6e6e73]">
                      {restaurant.locality}{restaurant.category ? ` · ${restaurant.category}` : ""}
                    </p>
                  </div>
                  {restaurant.rating && (
                    <span className="clay-panel rounded-full px-2 py-1 text-xs font-bold text-[#f36b21]">
                      {restaurant.rating}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="clay-panel-strong p-7 text-[#1d1d1f] sm:p-10">
            <Search className="h-7 w-7 text-[#f36b21]" />
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.035em]">
              Search by area. Filter by trust.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#6e6e73]">
              Use locality, cuisine, category, availability, and verified-only filters to get from need to contact in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {neighborhoods.map((name) => (
                <Link
                  key={name}
                  href={`/restaurants?locality=${encodeURIComponent(name)}`}
                  className="clay-pill inline-flex items-center gap-1.5 rounded-full bg-[#fffaf3] px-3 py-2 text-xs font-bold text-[#6e6e73] transition-transform hover:-translate-y-0.5"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#45d06c]" />
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
