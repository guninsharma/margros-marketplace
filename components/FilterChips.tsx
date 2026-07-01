"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterChipsProps {
  groups: FilterGroup[];
}

export default function FilterChips({ groups }: FilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key);
    if (current === value) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters = groups.some((g) => searchParams.get(g.key));

  return (
    <div className="flex flex-wrap items-center gap-3">
      {groups.map((group) => {
        const active = searchParams.get(group.key);
        return (
          <div key={group.key} className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-semibold text-gray-400"
            >
              {group.label}:
            </span>
            {group.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(group.key, opt.value)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                style={
                  active === opt.value
                    ? {
                        background: "rgba(224,85,35,0.08)",
                        border: "1px solid rgba(224,85,35,0.25)",
                        color: "#e05523",
                      }
                    : {
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        color: "#4b5563",
                      }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        );
      })}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="rounded-full px-3 py-1 text-xs font-bold transition-all"
          style={{
            background: "rgba(220,38,38,0.05)",
            border: "1px solid rgba(220,38,38,0.15)",
            color: "#dc2626",
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
