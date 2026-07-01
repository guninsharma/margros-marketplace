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
      style={{ background: "rgba(224, 85, 35, 0.06)" }}
    >
      <span className={`font-bold text-[#e05523] ${large ? "text-5xl" : "text-xl"}`}>
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
        <p className="text-base font-bold text-gray-900">No staff found</p>
        <p className="mt-1 text-sm text-gray-500">
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
              layoutId={`staff-card-${active.id}-${id}`}
              ref={ref}
              className="relative w-full max-w-[560px] overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-xl"
            >
              <div className="h-52 w-full rounded-none">
                <Avatar name={active.full_name} photoUrl={active.photo_url} large />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.02em] text-gray-900">
                      {active.full_name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {active.role_title || active.department} · {active.locality}
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
                    {active.is_available && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: "rgba(224,85,35,0.08)",
                          border: "1px solid rgba(224,85,35,0.20)",
                          color: "#e05523",
                        }}
                      >
                        Available
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl p-4 bg-gray-50 border border-gray-100">
                  {[
                    { label: "Department", value: active.department },
                    { label: "Experience", value: active.experience_years ? `${active.experience_years} yrs` : null },
                    { label: "Salary Exp.", value: active.salary_expectation ? `₹${active.salary_expectation.toLocaleString()}` : null },
                    { label: "Type", value: active.type },
                    { label: "Languages", value: active.languages?.join(", ") },
                    { label: "Agency", value: active.agency_name },
                  ].filter((i) => i.value).map(({ label, value }) => (
                    <div key={label}>
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-gray-850">{value}</p>
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
        {staff.map((s) => (
          <motion.div
            layoutId={`staff-card-${s.id}-${id}`}
            key={`staff-card-${s.id}-${id}`}
            onClick={() => setActive(s)}
            className="group cursor-pointer rounded-2xl border border-gray-200/70 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden">
                  <Avatar name={s.full_name} photoUrl={s.photo_url} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {s.full_name}
                    </h3>
                    {s.is_verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#16a34a]" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {s.role_title || s.department} · {s.locality}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {s.experience_years && (
                  <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-gray-550 border border-gray-100">
                    {s.experience_years} yrs exp
                  </span>
                )}
                {s.type && (
                  <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-gray-550 border border-gray-100">
                    {s.type}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between">
              {s.is_available ? (
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-[#e05523]">
                  Available
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
