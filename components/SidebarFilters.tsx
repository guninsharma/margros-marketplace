"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterOption { label: string; value: string; }
interface FilterGroup { key: string; label: string; options: FilterOption[]; }

interface Props { groups: FilterGroup[]; }

export default function SidebarFilters({ groups }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const q = searchParams.get("q");
    const fresh = new URLSearchParams();
    if (q) fresh.set("q", q);
    router.push(`${pathname}?${fresh.toString()}`);
  }

  const hasFilters = groups.some((g) => searchParams.get(g.key));

  return (
    <div
      className="glass sticky top-20 space-y-5 rounded-2xl p-4"
    >
      <div className="flex items-center justify-between pb-1">
        <span className="text-sm font-semibold text-white">Filters</span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-semibold transition-colors"
            style={{ color: "#e05523" }}
          >
            Clear all
          </button>
        )}
      </div>

      {groups.map((group) => {
        const active = searchParams.get(group.key);
        return (
          <div key={group.key}>
            <p
              className="mb-2 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.30)" }}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(group.key, opt.value)}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-medium transition-colors"
                  style={
                    active === opt.value
                      ? {
                          background: "rgba(224,85,35,0.15)",
                          color: "#e05523",
                        }
                      : {
                          color: "rgba(255,255,255,0.50)",
                        }
                  }
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors"
                    style={{
                      background: active === opt.value
                        ? "#e05523"
                        : "rgba(255,255,255,0.18)",
                    }}
                  />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
