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
      style={{ background: "rgba(224, 85, 35, 0.06)" }}
    >
      <span className={`font-bold text-[#e05523] ${large ? "text-5xl" : "text-xl"}`}>
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
        <p className="text-base font-bold text-gray-900">No restaurants found</p>
        <p className="mt-1 text-sm text-gray-500">
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
            style={{ background: "rgba(17, 24, 39, 0.30)", backdropFilter: "blur(4px)" }}
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
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-gray-700 transition-colors lg:hidden bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
            >
              ✕
            </motion.button>

            <motion.div
              layoutId={`rest-card-${active.id}-${id}`}
              ref={ref}
              className="relative w-full max-w-[560px] overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-xl"
            >
              <div className="h-52 w-full rounded-none">
                <InitialAvatar name={active.name} large />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.02em] text-gray-900">
                      {active.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {active.locality}, {active.city}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {active.is_verified && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: "rgba(22, 163, 74, 0.08)",
                          border: "1px solid rgba(22, 163, 74, 0.20)",
                          color: "#16a34a",
                        }}
                      >
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                    {active.rating && (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-[#e05523]">
                        <Star className="h-3.5 w-3.5 fill-current" /> {active.rating}
                        {active.review_count && (
                          <span className="ml-1 text-xs text-gray-400">
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
                      <span className="rounded-full bg-gray-50 border border-gray-200/60 px-3 py-1 text-xs font-semibold text-gray-500">
                        {active.category}
                      </span>
                    )}
                    {active.cuisine_type?.map((c) => (
                      <span
                        key={c}
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: "rgba(224,85,35,0.08)",
                          border: "1px solid rgba(224,85,35,0.20)",
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
                    className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#16a34a]" />
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
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    View full page
                  </Link>
                  <button
                    onClick={() => setActive(null)}
                    className="hidden rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors lg:block"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid - responsive, neat card design */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <motion.div
            layoutId={`rest-card-${r.id}-${id}`}
            key={`rest-card-${r.id}-${id}`}
            onClick={() => setActive(r)}
            className="group cursor-pointer rounded-2xl border border-gray-200/70 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden">
                  <InitialAvatar name={r.name} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {r.name}
                    </h3>
                    {r.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#16a34a]" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {r.locality}{r.category && ` · ${r.category}`}
                  </p>
                </div>
              </div>

              {r.cuisine_type && r.cuisine_type.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {r.cuisine_type.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        background: "rgba(224,85,35,0.08)",
                        color: "#e05523",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between">
              {r.rating ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#e05523]">
                  ★ {r.rating}
                </span>
              ) : (
                <span className="text-xs text-gray-300">-</span>
              )}
              <span className="text-[10px] font-semibold text-gray-400 group-hover:text-[#e05523] transition-colors">
                View Details
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </MotionConfig>
  );
}
