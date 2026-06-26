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
    <div className="flex flex-wrap items-center gap-2">
      {groups.map((group) => {
        const active = searchParams.get(group.key);
        return (
          <div key={group.key} className="flex flex-wrap items-center gap-1.5">
            <span
              className="text-xs font-semibold"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {group.label}:
            </span>
            {group.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(group.key, opt.value)}
                className="rounded-full px-3 py-1.5 text-xs font-bold transition-all"
                style={
                  active === opt.value
                    ? {
                        background: "rgba(224,85,35,0.20)",
                        border: "1px solid rgba(224,85,35,0.40)",
                        color: "#e05523",
                      }
                    : {
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.55)",
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
          className="rounded-full px-3 py-1.5 text-xs font-bold transition-all"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.20)",
            color: "rgba(252,165,165,0.90)",
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
