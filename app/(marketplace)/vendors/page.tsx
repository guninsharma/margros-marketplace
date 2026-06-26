import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import VendorGrid from "@/components/VendorGrid";
import SearchInput from "@/components/SearchInput";
import FilterChips from "@/components/FilterChips";
import SidebarFilters from "@/components/SidebarFilters";

export const metadata = { title: "Vendors — Margros Marketplace" };

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category_group?: string; category?: string; locality?: string; verified?: string }>;
}) {
  const params = await searchParams;
  const { q, category_group, category, locality, verified } = params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("vendors")
    .select("*")
    .order("is_verified", { ascending: false });

  if (q) query = query.ilike("business_name", `%${q}%`);
  if (category_group) query = query.eq("category_group", category_group);
  if (category) query = query.eq("category", category);
  if (locality) query = query.eq("locality", locality);
  if (verified === "true") query = query.eq("is_verified", true);

  const { data: vendors } = await query.limit(60);

  const { data: groupRows } = await supabase.from("vendors").select("category_group").order("category_group");
  const groups = [...new Set(groupRows?.map((r) => r.category_group).filter(Boolean))];

  const { data: catRows } = await supabase.from("vendors").select("category").order("category");
  const categories = [...new Set(catRows?.map((r) => r.category).filter(Boolean))];

  const { data: localityRows } = await supabase.from("vendors").select("locality").order("locality");
  const localities = [...new Set(localityRows?.map((r) => r.locality).filter(Boolean))];

  const filterGroups = [
    { key: "category_group", label: "Group", options: groups.map((g) => ({ label: g!, value: g! })) },
    { key: "category", label: "Category", options: categories.slice(0, 10).map((c) => ({ label: c!, value: c! })) },
    { key: "locality", label: "Area", options: localities.map((l) => ({ label: l!, value: l! })) },
    { key: "verified", label: "Status", options: [{ label: "Verified only", value: "true" }] },
  ].filter((g) => g.options.length > 0);

  const count = vendors?.length ?? 0;

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
              Restaurant supply network
            </div>
            <h1
              className="text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Vendors &amp; Suppliers
            </h1>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {count} vendor{count !== 1 ? "s" : ""} in Bengaluru
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
                  "Search vendors by name...",
                  "Find kitchen equipment suppliers...",
                  "Produce & ingredient vendors...",
                  "Packaging suppliers in Bengaluru...",
                  "Cleaning & hygiene vendors...",
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

          <VendorGrid vendors={vendors ?? []} isAuthenticated={!!user} />
        </div>
      </div>
    </div>
  );
}
