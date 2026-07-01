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
      className="bg-white border border-gray-200/60 sticky top-20 space-y-6 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
    >
      <div className="flex items-center justify-between pb-1 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-900">Filters</span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-semibold transition-colors hover:opacity-80"
            style={{ color: "#e05523" }}
          >
            Clear all
          </button>
        )}
      </div>

      {groups.map((group) => {
        const active = searchParams.get(group.key);
        return (
          <div key={group.key} className="space-y-2">
            <p
              className="text-[10px] font-bold uppercase tracking-wider text-gray-400"
            >
              {group.label}
            </p>
            <div className="space-y-1">
              {group.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(group.key, opt.value)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors hover:bg-gray-50"
                  style={
                    active === opt.value
                      ? {
                          background: "rgba(224,85,35,0.08)",
                          color: "#e05523",
                        }
                      : {
                          color: "#4b5563",
                        }
                  }
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors"
                    style={{
                      background: active === opt.value
                        ? "#e05523"
                        : "#d1d5db",
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
