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
  CheckCircle,
  ThumbsUp,
  Percent,
  Clock,
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

const testimonials = [
  {
    quote: "Margros saved us weeks of sorting through unverified leads. Finding a reliable bakery vendor in Koramangala took less than ten minutes.",
    author: "Aditi Rao",
    role: "Co-Owner, The Daily Roast",
  },
  {
    quote: "We staffed our entire pre-opening kitchen crew through Margros. Vetted profiles meant we could interview immediately with zero agency markup.",
    author: "Chef K. Ramanathan",
    role: "Executive Chef, Spice Trail Group",
  },
  {
    quote: "As a niche supplier, reaching restaurant procurement leads was always hard. Margros gives us high-intent inbound inquiries daily.",
    author: "Vikram Hegde",
    role: "Founder, GreenSource Organic Produce",
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
    { label: "Restaurants onboarded", value: restaurantCount ?? 0 },
    { label: "Staff profiles", value: staffCount ?? 0 },
    { label: "Vendor leads", value: vendorCount ?? 0 },
  ];

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      {/* --- Unified Header --- */}
      <header className="sticky top-0 z-40 border-b border-gray-100" style={{
        background: "rgba(255, 255, 255, 0.80)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}>
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

          <nav className="hidden items-center gap-1 sm:flex text-xs font-semibold text-[#4b5563]">
            <Link href="/restaurants" className="relative rounded-full px-4 py-1.5 transition-colors hover:bg-gray-50 hover:text-black">Restaurants</Link>
            <Link href="/staff" className="relative rounded-full px-4 py-1.5 transition-colors hover:bg-gray-50 hover:text-black">Staff</Link>
            <Link href="/vendors" className="relative rounded-full px-4 py-1.5 transition-colors hover:bg-gray-50 hover:text-black">Vendors</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: "#e05523" }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden px-5 pb-16 pt-16 text-center sm:px-8 lg:pb-24">
        {/* Modern radial highlight */}
        <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-[400px] max-w-5xl rounded-full bg-[radial-gradient(circle_at_center,rgba(224,85,35,0.05),transparent_70%)] blur-3xl" />

        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gray-100 bg-[#fafafa] px-3.5 py-1 text-xs font-semibold text-[#4b5563]">
          <ShieldCheck className="h-4 w-4 text-[#16a34a]" />
          Verified hospitality network for Bengaluru
        </div>

        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#111827] sm:text-7xl lg:text-[5.5rem]">
          Margros Marketplace.
          <span className="block text-[#e05523]">The city&apos;s service layer.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#4b5563]">
          Restaurants, professionals, and suppliers in one verified directory built for operators who need a reliable answer fast.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 rounded-full bg-[#e05523] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#c44a1c] shadow-sm hover:shadow active:scale-[0.98]"
          >
            Explore marketplace
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/vendors?verified=true"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 shadow-sm active:scale-[0.98]"
          >
            Verified vendors
            <BadgeCheck className="h-4 w-4 text-[#16a34a]" />
          </Link>
        </div>

        {/* Floating Panel: Today's Search + Featured List */}
        <div className="mx-auto mt-16 max-w-5xl rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative overflow-hidden rounded-2xl bg-[#fafafa] px-6 py-8 sm:px-10">
            <div className="relative mx-auto grid max-w-4xl gap-6 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-center text-left text-[#111827]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#e05523]">Today&apos;s Search</span>
                <h2 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-[-0.03em]">
                  Chef. Vendor. Restaurant.
                </h2>
                <p className="mt-4 text-sm leading-6 text-[#4b5563]">
                  Three directories, one verified operating layer. Find culinary talent and reliable wholesale partners.
                </p>
              </div>

              <div className="space-y-2.5 text-left">
                {(featuredRestaurants ?? []).slice(0, 3).map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurants/${restaurant.id}`}
                    className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-white p-3.5 transition-all hover:border-gray-200 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-[#e05523]">
                      {restaurant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-[#111827]">{restaurant.name}</p>
                        {restaurant.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#16a34a]" />}
                      </div>
                      <p className="truncate text-xs font-semibold text-[#4b5563]">
                        {restaurant.locality}{restaurant.category ? ` · ${restaurant.category}` : ""}
                      </p>
                    </div>
                    {restaurant.rating && (
                      <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-[#e05523]">
                        ★ {restaurant.rating}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl gap-4 border-t border-gray-200/50 pt-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-3xl font-extrabold text-[#111827]">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#4b5563]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Category Grid Section --- */}
      <section className="bg-[#fafafa] border-y border-gray-100 px-5 py-20 text-[#111827] sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e05523]">Directories</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Browse the Marketplace</h2>
            <p className="mt-3 max-w-2xl mx-auto text-base text-[#4b5563]">
              Choose from our curated networks of restaurants, vetted staff, and industrial supply vendors.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {categories.map(({ href, title, kicker, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-8 transition-all hover:border-gray-200 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-[#4b5563] border border-gray-100">{kicker}</span>
                    <div className="p-2 rounded-xl bg-orange-50/50">
                      <Icon className="h-5 w-5 text-[#e05523]" />
                    </div>
                  </div>
                  <h2 className="mt-12 text-3xl font-extrabold tracking-tight text-[#111827]">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#4b5563]">{description}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-[#e05523]">
                  Explore Directory <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- Why Margros Section (Filled Gap) --- */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e05523]">Platform Standards</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Why operators run on Margros</h2>
            <p className="mt-3 max-w-2xl mx-auto text-base text-[#4b5563]">
              The easiest way to staff, supply, and manage high-volume hospitality properties in Bengaluru.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#16a34a] mb-5">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Vetted Profiles</h3>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                Every single partner, listing, and vendor undergoes validation before appearing in our directory. Trust is non-negotiable.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#e05523] mb-5">
                <ThumbsUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Direct Collaboration</h3>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                Cut out recruitment and agency middlemen. Connect directly with owners, vendors, and professionals.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#e05523] mb-5">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827]">Zero Friction</h3>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">
                Search by neighborhood, filter by category, and access direct WhatsApp or call contacts instantly after authorization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Platform Statistics Section (Filled Gap) --- */}
      <section className="bg-[#fafafa] border-y border-gray-100 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e05523]">Growth & Scale</span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight">The numbers behind Bengaluru&apos;s hospitality infrastructure</h2>
              <p className="mt-4 text-base leading-7 text-[#4b5563]">
                We are building the trust fabric for restaurants, cafes, and vendors in India&apos;s food capital. Margros bridges the gap between premium talent, local suppliers, and restaurant owners.
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <h4 className="text-4xl font-extrabold text-[#111827]">98%</h4>
                  <p className="mt-1 text-xs font-semibold text-[#4b5563]">Verification Rate</p>
                </div>
                <div className="border-l border-gray-200 pl-8">
                  <h4 className="text-4xl font-extrabold text-[#111827]">10k+</h4>
                  <p className="mt-1 text-xs font-semibold text-[#4b5563]">Monthly Connections</p>
                </div>
                <div className="border-l border-gray-200 pl-8">
                  <h4 className="text-4xl font-extrabold text-[#e05523]">100%</h4>
                  <p className="mt-1 text-xs font-semibold text-[#4b5563]">Direct Communication</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <span className="text-xs font-semibold text-[#4b5563]">Average Matching Time</span>
                <p className="mt-3 text-3xl font-extrabold text-[#111827]">48 Hours</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <span className="text-xs font-semibold text-[#4b5563]">Supplier Categories</span>
                <p className="mt-3 text-3xl font-extrabold text-[#111827]">35+</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center col-span-2">
                <span className="text-xs font-semibold text-[#4b5563]">Total Platform Transacted Value (Direct)</span>
                <p className="mt-2 text-2xl font-extrabold text-[#16a34a]">₹0 Commission Charged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Live Verified Matches & Filter Search Split --- */}
      <section className="px-5 py-20 text-[#111827] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-2xl border border-gray-100 bg-white p-7 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16a34a]">
              <Sparkles className="h-4 w-4" />
              Live verified matches
            </div>
            <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
              Scan the market like a product catalog.
            </h2>
            <div className="mt-8 space-y-2.5">
              {(featuredRestaurants ?? []).map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="flex items-center gap-3.5 rounded-xl border border-gray-50 bg-[#fafafa] px-4 py-3.5 transition-all hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-[#e05523]">
                    {restaurant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-[#111827]">{restaurant.name}</p>
                      {restaurant.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#16a34a]" />}
                    </div>
                    <p className="truncate text-xs font-semibold text-[#4b5563]">
                      {restaurant.locality}{restaurant.category ? ` · ${restaurant.category}` : ""}
                    </p>
                  </div>
                  {restaurant.rating && (
                    <span className="rounded-full bg-white border border-gray-100 px-2 py-0.5 text-xs font-bold text-[#e05523]">
                      ★ {restaurant.rating}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-[#fafafa] p-7 text-[#111827] sm:p-10 shadow-sm">
            <div>
              <Search className="h-7 w-7 text-[#e05523]" />
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-[-0.03em]">
                Search by area. Filter by trust.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#4b5563]">
                Use locality, cuisine, category, availability, and verified-only filters to get from need to contact in minutes.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {neighborhoods.map((name) => (
                  <Link
                    key={name}
                    href={`/restaurants?locality=${encodeURIComponent(name)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-xs font-semibold text-[#4b5563] transition-all hover:bg-gray-50 active:scale-[0.97]"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#16a34a]" />
                    {name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t border-gray-200/50">
              <p className="text-xs text-[#4b5563] font-semibold">
                Direct connections to restaurant owners & managers under active contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section (Filled Gap) --- */}
      <section className="bg-[#fafafa] border-t border-gray-100 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#e05523]">Community</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Operated by hospitality builders</h2>
            <p className="mt-3 max-w-2xl mx-auto text-base text-[#4b5563]">
              Read how Bangalore&apos;s leading restauranteurs and suppliers rely on Margros.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between">
                <p className="text-sm leading-6 text-[#4b5563] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm font-bold text-[#111827]">{t.author}</p>
                  <p className="text-xs text-[#4b5563]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Final CTA Section (Filled Gap) --- */}
      <section className="px-5 py-20 sm:px-8 text-center bg-white relative">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[radial-gradient(circle_at_top,rgba(224,85,35,0.06),transparent_60%)] border border-gray-100 px-6 py-12 sm:px-12 sm:py-16 shadow-sm">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#111827]">
            Ready to scale your kitchen operations?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[#4b5563] leading-6">
            Join Bengaluru&apos;s most reliable hospitality sourcing layers today. Sign up for full access to verified listings.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[#e05523] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#c44a1c] shadow-sm hover:shadow"
            >
              Sign up today
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 shadow-sm"
            >
              View live catalog
            </Link>
          </div>
        </div>
      </section>

      {/* --- Footer (Filled Gap) --- */}
      <footer className="border-t border-gray-100 bg-[#fafafa] py-12 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Margros"
              width={100}
              height={38}
              className="h-7 w-auto object-contain opacity-80"
              style={{ width: "auto" }}
            />
            <span className="text-xs text-[#4b5563] font-semibold border-l border-gray-200 pl-3">
              Bengaluru Hospitality Directory
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-[#4b5563]">
            <Link href="/restaurants" className="hover:text-black transition-colors">Restaurants</Link>
            <Link href="/staff" className="hover:text-black transition-colors">Staff Directory</Link>
            <Link href="/vendors" className="hover:text-black transition-colors">Vendor Network</Link>
            <Link href="/login" className="hover:text-black transition-colors">Partner Log In</Link>
          </div>

          <div>
            <p className="text-[11px] text-gray-400 font-medium">
              &copy; {new Date().getFullYear()} Margros. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
