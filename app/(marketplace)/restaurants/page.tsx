import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import RestaurantGrid from "@/components/RestaurantGrid";
import SearchInput from "@/components/SearchInput";
import FilterChips from "@/components/FilterChips";
import SidebarFilters from "@/components/SidebarFilters";

export const metadata = { title: "Restaurants — Margros Marketplace" };

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; locality?: string; category?: string; cuisine?: string; verified?: string }>;
}) {
  const params = await searchParams;
  const { q, locality, category, cuisine, verified } = params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("restaurants")
    .select("*")
    .order("rating", { ascending: false, nullsFirst: false });

  if (q) query = query.ilike("name", `%${q}%`);
  if (locality) query = query.eq("locality", locality);
  if (category) query = query.eq("category", category);
  if (cuisine) query = query.contains("cuisine_type", [cuisine]);
  if (verified === "true") query = query.eq("is_verified", true);

  const { data: restaurants } = await query.limit(60);

  const { data: localityRows } = await supabase.from("restaurants").select("locality").order("locality");
  const localities = [...new Set(localityRows?.map((r) => r.locality).filter(Boolean))];

  const { data: categoryRows } = await supabase.from("restaurants").select("category").order("category");
  const categories = [...new Set(categoryRows?.map((r) => r.category).filter(Boolean))];

  const { data: cuisineRows } = await supabase.from("restaurants").select("cuisine_type");
  const cuisines = [...new Set(cuisineRows?.flatMap((r) => r.cuisine_type ?? []).filter(Boolean))].sort();

  const filterGroups = [
    { key: "locality", label: "Area", options: localities.map((l) => ({ label: l!, value: l! })) },
    { key: "category", label: "Type", options: categories.map((c) => ({ label: c!, value: c! })) },
    { key: "cuisine", label: "Cuisine", options: cuisines.slice(0, 8).map((c) => ({ label: c, value: c })) },
    { key: "verified", label: "Status", options: [{ label: "Verified only", value: "true" }] },
  ].filter((g) => g.options.length > 0);

  const count = restaurants?.length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
      <div className="flex gap-8">
        {filterGroups.length > 0 && (
          <aside className="hidden w-56 shrink-0 lg:block">
            <Suspense fallback={null}>
              <SidebarFilters groups={filterGroups} />
            </Suspense>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          {/* Page header */}
          <div
            className="mb-6 rounded-2xl p-7"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div
              className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold"
              style={{
                background: "rgba(56,158,41,0.16)",
                border: "1px solid rgba(56,158,41,0.25)",
                color: "#5dd44a",
              }}
            >
              Verified restaurant directory
            </div>
            <h1
              className="text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Restaurants
            </h1>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {count} listing{count !== 1 ? "s" : ""} in Bengaluru
              {q && (
                <>
                  {" "}· searching{" "}
                  <span className="text-white">&ldquo;{q}&rdquo;</span>
                </>
              )}
            </p>
          </div>

          <div className="mb-5">
            <Suspense fallback={
              <div
                className="h-12 w-full rounded-full"
                style={{ background: "rgba(255,255,255,0.07)" }}
              />
            }>
              <SearchInput
                placeholders={[
                  "Search restaurants by name...",
                  "Find in Koramangala...",
                  "Italian, Chinese, South Indian...",
                  "Fine dining in Indiranagar...",
                  "Rooftop restaurants in Bengaluru...",
                ]}
              />
            </Suspense>
          </div>

          {filterGroups.length > 0 && (
            <div className="mb-6 lg:hidden">
              <Suspense fallback={null}>
                <FilterChips groups={filterGroups} />
              </Suspense>
            </div>
          )}

          <RestaurantGrid restaurants={restaurants ?? []} isAuthenticated={!!user} />
        </div>
      </div>
    </div>
  );
}
