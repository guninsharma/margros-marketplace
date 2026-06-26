"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import ContactReveal from "@/components/ContactReveal";
import type { Tables } from "@/lib/types/database.types";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

type StaffMember = Tables<"staff">;

interface Props {
  staff: StaffMember[];
  isAuthenticated: boolean;
}

function Avatar({ name, photoUrl, large }: { name: string; photoUrl?: string | null; large?: boolean }) {
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className="h-full w-full rounded-[inherit] object-cover" />;
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-[inherit]"
      style={{ background: "linear-gradient(135deg, #389e29 0%, #2a7a1e 100%)" }}
    >
      <span className={`font-bold text-white ${large ? "text-5xl" : "text-xl"}`}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export default function StaffGrid({ staff, isAuthenticated }: Props) {
  const [active, setActive] = useState<StaffMember | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setActive(null); }
    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  if (!staff.length) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <p className="text-base font-bold text-white">No staff found</p>
        <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
          Try changing department, availability, or area filters.
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
              layoutId={`staff-card-${active.id}-${id}`}
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
                <Avatar name={active.full_name} photoUrl={active.photo_url} large />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.02em] text-white">
                      {active.full_name}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>
                      {active.role_title || active.department} · {active.locality}
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
                    {active.is_available && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: "rgba(224,85,35,0.18)",
                          border: "1px solid rgba(224,85,35,0.28)",
                          color: "#e05523",
                        }}
                      >
                        Available
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="mb-4 grid grid-cols-2 gap-3 rounded-xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {[
                    { label: "Department", value: active.department },
                    { label: "Experience", value: active.experience_years ? `${active.experience_years} yrs` : null },
                    { label: "Salary Exp.", value: active.salary_expectation ? `₹${active.salary_expectation.toLocaleString()}` : null },
                    { label: "Type", value: active.type },
                    { label: "Languages", value: active.languages?.join(", ") },
                    { label: "Agency", value: active.agency_name },
                  ].filter((i) => i.value).map(({ label, value }) => (
                    <div key={label}>
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <ContactReveal
                  listingType="staff"
                  listingId={active.id}
                  phone={active.mobile}
                  isAuthenticated={isAuthenticated}
                />

                <div className="mt-5 flex justify-between">
                  <Link
                    href={`/staff/${active.id}`}
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
        {staff.map((s) => (
          <motion.li
            layoutId={`staff-card-${s.id}-${id}`}
            key={`staff-card-${s.id}-${id}`}
            onClick={() => setActive(s)}
            className="group relative cursor-pointer rounded-2xl px-4 py-4 transition-colors sm:px-5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-full">
                <Avatar name={s.full_name} photoUrl={s.photo_url} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-white [overflow:hidden] [text-overflow:ellipsis] [white-space:nowrap]">
                    {s.full_name}
                  </h3>
                  {s.is_verified && <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: "#389e29" }} />}
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                  {s.role_title || s.department} · {s.locality}
                  {s.experience_years && ` · ${s.experience_years} yrs`}
                </p>
              </div>

              <div className="ml-2 flex shrink-0 flex-col items-end gap-2">
                {s.is_available && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: "rgba(224,85,35,0.12)",
                      color: "#e05523",
                    }}
                  >
                    Available
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
