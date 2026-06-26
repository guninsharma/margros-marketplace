"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import ContactReveal from "@/components/ContactReveal";
import type { Tables } from "@/lib/types/database.types";
import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";

type Restaurant = Tables<"restaurants">;

interface Props {
  restaurants: Restaurant[];
  isAuthenticated: boolean;
}

function InitialAvatar({ name, large }: { name: string; large?: boolean }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-[inherit]"
      style={{ background: "linear-gradient(135deg, #e05523 0%, #c44a1c 100%)" }}
    >
      <span className={`font-bold text-white ${large ? "text-5xl" : "text-xl"}`}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export default function RestaurantGrid({ restaurants, isAuthenticated }: Props) {
  const [active, setActive] = useState<Restaurant | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setActive(null); }
    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  if (!restaurants.length) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <p className="text-base font-bold text-white">No restaurants found</p>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
          Try changing the area, cuisine, or verified filters.
        </p>
      </div>
    );
  }

  return (
    <MotionConfig transition={{ duration: 0.14, ease: "easeOut" }}>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-10"
            style={{ background: "rgba(0,0,0,0.60)", backdropFilter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-4">
            <motion.button
              key="close-btn"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white transition-colors lg:hidden"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              ✕
            </motion.button>

            <motion.div
              layoutId={`rest-card-${active.id}-${id}`}
              ref={ref}
              className="relative w-full max-w-[560px] overflow-hidden rounded-2xl"
              style={{
                background: "rgba(10, 22, 7, 0.92)",
                backdropFilter: "blur(32px) saturate(1.8)",
                WebkitBackdropFilter: "blur(32px) saturate(1.8)",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              <div className="h-52 w-full rounded-none">
                <InitialAvatar name={active.name} large />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.02em] text-white">
                      {active.name}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>
                      {active.locality}, {active.city}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {active.is_verified && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: "rgba(56,158,41,0.18)",
                          border: "1px solid rgba(56,158,41,0.30)",
                          color: "#5dd44a",
                        }}
                      >
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                    {active.rating && (
                      <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "#e05523" }}>
                        <Star className="h-3.5 w-3.5 fill-current" /> {active.rating}
                        {active.review_count && (
                          <span className="ml-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            ({active.review_count})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {(active.category || (active.cuisine_type && active.cuisine_type.length > 0)) && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {active.category && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        {active.category}
                      </span>
                    )}
                    {active.cuisine_type?.map((c) => (
                      <span
                        key={c}
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: "rgba(224,85,35,0.14)",
                          border: "1px solid rgba(224,85,35,0.25)",
                          color: "#e05523",
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {active.google_maps_url && (
                  <a
                    href={active.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    style={{ color: "rgba(255,255,255,0.40)" }}
                  >
                    <MapPin className="h-3.5 w-3.5" style={{ color: "#389e29" }} />
                    View on Google Maps
                  </a>
                )}

                <ContactReveal
                  listingType="restaurant"
                  listingId={active.id}
                  phone={active.phone}
                  email={active.email}
                  isAuthenticated={isAuthenticated}
                />

                <div className="mt-5 flex justify-between">
                  <Link
                    href={`/restaurants/${active.id}`}
                    className="text-xs font-semibold transition-colors"
                    style={{ color: "rgba(255,255,255,0.30)" }}
                  >
                    View full page
                  </Link>
                  <button
                    onClick={() => setActive(null)}
                    className="hidden rounded-full px-4 py-1.5 text-xs font-semibold transition-colors lg:block"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.50)",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List — transition-colors only, never transition-all (breaks layoutId animation) */}
      <ul className="space-y-2">
        {restaurants.map((r) => (
          <motion.li
            layoutId={`rest-card-${r.id}-${id}`}
            key={`rest-card-${r.id}-${id}`}
            onClick={() => setActive(r)}
            className="group relative cursor-pointer rounded-2xl px-4 py-4 transition-colors sm:px-5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-xl">
                <InitialAvatar name={r.name} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <h3
                    className="text-[15px] font-bold text-white [overflow:hidden] [text-overflow:ellipsis] [white-space:nowrap]"
                  >
                    {r.name}
                  </h3>
                  {r.is_verified && <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: "#389e29" }} />}
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                  {r.locality}{r.category && ` · ${r.category}`}
                </p>
                {r.cuisine_type && r.cuisine_type.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.cuisine_type.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: "rgba(224,85,35,0.12)",
                          color: "#e05523",
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-2 flex shrink-0 flex-col items-end gap-2">
                {r.rating && (
                  <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: "#e05523" }}>
                    <Star className="h-3.5 w-3.5 fill-current" /> {r.rating}
                  </span>
                )}
                <span
                  className="text-[10px] font-semibold opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  View
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </MotionConfig>
  );
}
