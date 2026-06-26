import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import StaffGrid from "@/components/StaffGrid";
import SearchInput from "@/components/SearchInput";
import FilterChips from "@/components/FilterChips";
import SidebarFilters from "@/components/SidebarFilters";

export const metadata = { title: "Staff — Margros Marketplace" };

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; department?: string; locality?: string; type?: string; available?: string; verified?: string }>;
}) {
  const params = await searchParams;
  const { q, department, locality, type, available, verified } = params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from("staff")
    .select("*")
    .order("is_verified", { ascending: false });

  if (q) query = query.ilike("full_name", `%${q}%`);
  if (department) query = query.eq("department", department);
  if (locality) query = query.eq("locality", locality);
  if (type) query = query.eq("type", type);
  if (available === "true") query = query.eq("is_available", true);
  if (verified === "true") query = query.eq("is_verified", true);

  const { data: staff } = await query.limit(60);

  const { data: deptRows } = await supabase.from("staff").select("department").order("department");
  const departments = [...new Set(deptRows?.map((r) => r.department).filter(Boolean))];

  const { data: localityRows } = await supabase.from("staff").select("locality").order("locality");
  const localities = [...new Set(localityRows?.map((r) => r.locality).filter(Boolean))];

  const { data: typeRows } = await supabase.from("staff").select("type").order("type");
  const types = [...new Set(typeRows?.map((r) => r.type).filter(Boolean))];

  const filterGroups = [
    { key: "department", label: "Dept", options: departments.map((d) => ({ label: d!, value: d! })) },
    { key: "locality", label: "Area", options: localities.map((l) => ({ label: l!, value: l! })) },
    { key: "type", label: "Type", options: types.map((t) => ({ label: t!, value: t! })) },
    { key: "available", label: "Status", options: [{ label: "Available only", value: "true" }] },
    { key: "verified", label: "Quality", options: [{ label: "Verified only", value: "true" }] },
  ].filter((g) => g.options.length > 0);

  const count = staff?.length ?? 0;

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
                background: "rgba(224,85,35,0.16)",
                border: "1px solid rgba(224,85,35,0.25)",
                color: "#e05523",
              }}
            >
              Available hospitality talent
            </div>
            <h1
              className="text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Hospitality Staff
            </h1>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {count} profile{count !== 1 ? "s" : ""} in Bengaluru
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
                  "Search staff by name...",
                  "Find chefs in Koramangala...",
                  "Head waiter with 5 years experience...",
                  "Kitchen staff available immediately...",
                  "F&B manager for fine dining...",
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

          <StaffGrid staff={staff ?? []} isAuthenticated={!!user} />
        </div>
      </div>
    </div>
  );
}
