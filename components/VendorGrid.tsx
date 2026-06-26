"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import ContactReveal from "@/components/ContactReveal";
import type { Tables } from "@/lib/types/database.types";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

type Vendor = Tables<"vendors">;

interface Props {
  vendors: Vendor[];
  isAuthenticated: boolean;
}

function VendorAvatar({ name, large }: { name: string; large?: boolean }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-[inherit]"
      style={{ background: "linear-gradient(135deg, #e05523 0%, #389e29 100%)" }}
    >
      <span className={`font-bold text-white ${large ? "text-5xl" : "text-xl"}`}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export default function VendorGrid({ vendors, isAuthenticated }: Props) {
  const [active, setActive] = useState<Vendor | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setActive(null); }
    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  if (!vendors.length) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <p className="text-base font-bold text-white">No vendors found</p>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
          Try changing category, area, or verified filters.
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
              layoutId={`vendor-card-${active.id}-${id}`}
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
                <VendorAvatar name={active.business_name} large />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.02em] text-white">
                      {active.business_name}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>
                      {active.category} · {active.locality}
                    </p>
                  </div>
                  {active.is_verified && (
                    <span
                      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{
                        background: "rgba(56,158,41,0.18)",
                        border: "1px solid rgba(56,158,41,0.30)",
                        color: "#5dd44a",
                      }}
                    >
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </div>

                {active.description && (
                  <p className="mb-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                    {active.description}
                  </p>
                )}

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {active.category_group && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {active.category_group}
                    </span>
                  )}
                  {active.category && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: "rgba(224,85,35,0.14)",
                        border: "1px solid rgba(224,85,35,0.25)",
                        color: "#e05523",
                      }}
                    >
                      {active.category}
                    </span>
                  )}
                  {active.contact_person_name && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      Contact: {active.contact_person_name}
                    </span>
                  )}
                </div>

                <ContactReveal
                  listingType="vendor"
                  listingId={active.id}
                  phone={active.phone}
                  email={active.email}
                  whatsapp={active.whatsapp}
                  isAuthenticated={isAuthenticated}
                />

                <div className="mt-5 flex justify-between">
                  <Link
                    href={`/vendors/${active.id}`}
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

      <ul className="space-y-2">
        {vendors.map((v) => (
          <motion.li
            layoutId={`vendor-card-${v.id}-${id}`}
            key={`vendor-card-${v.id}-${id}`}
            onClick={() => setActive(v)}
            className="group relative cursor-pointer rounded-2xl px-4 py-4 transition-colors sm:px-5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-xl">
                <VendorAvatar name={v.business_name} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-white [overflow:hidden] [text-overflow:ellipsis] [white-space:nowrap]">
                    {v.business_name}
                  </h3>
                  {v.is_verified && <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: "#389e29" }} />}
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                  {v.category} · {v.locality}
                </p>
                {v.category_group && (
                  <span
                    className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: "rgba(224,85,35,0.12)",
                      color: "#e05523",
                    }}
                  >
                    {v.category_group}
                  </span>
                )}
              </div>

              <div className="ml-2 shrink-0">
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
