"use client";

import { Suspense, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from "@/components/ui/text-reveal-card";
import { FloatingDock } from "@/components/ui/floating-dock";
import { FloatingNav } from "@/components/ui/floating-navbar";
import {
  IconBuildingStore,
  IconUsers,
  IconBriefcase,
  IconStar,
  IconMapPin,
} from "@tabler/icons-react";

/* ─── Section wrapper ─── */
function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-[#ede8e2]">{title}</h2>
        <p className="mt-1 text-sm text-[#ede8e2]/40">{description}</p>
        <div className="mt-3 h-px w-full bg-[#ede8e2]/[0.06]" />
      </div>
      {children}
    </div>
  );
}

/* ─── GlowingEffect demo ─── */
function GlowingEffectDemo() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {["Verified Restaurant", "Available Staff", "Active Vendor"].map((label, i) => (
        <div key={label}
          className="relative cursor-default rounded-xl border border-[#ede8e2]/[0.08] bg-[#131210] p-5">
          <GlowingEffect spread={30} glow={false} disabled={false} proximity={80} inactiveZone={0.2} />
          <div className={`mb-3 h-10 w-10 rounded-lg bg-gradient-to-br ${
            i === 0 ? "from-orange-800 to-stone-900" :
            i === 1 ? "from-amber-700 to-orange-900" :
            "from-emerald-800 to-stone-900"
          }`} />
          <p className="font-semibold text-[#ede8e2]">{label}</p>
          <p className="mt-0.5 text-xs text-[#ede8e2]/35">Hover to see glow effect</p>
          <span className="mt-2 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">✓ Verified</span>
        </div>
      ))}
    </div>
  );
}

/* ─── PlaceholdersAndVanishInput demo ─── */
function SearchInputDemo() {
  return (
    <div className="max-w-lg">
      <Suspense fallback={<div className="h-12 w-full rounded-full bg-white/[0.03]" />}>
        <PlaceholdersAndVanishInput
          placeholders={[
            "Search restaurants by name…",
            "Find in Koramangala…",
            "Italian, Chinese, South Indian…",
            "Fine dining in Indiranagar…",
          ]}
          onChange={() => {}}
          onSubmit={(e) => e.preventDefault()}
        />
      </Suspense>
      <p className="mt-3 text-xs text-[#ede8e2]/30">
        Cycles through placeholders · Text vanishes on submit
      </p>
    </div>
  );
}

/* ─── TextRevealCard demo ─── */
function TextRevealDemo() {
  return (
    <div className="max-w-md">
      <TextRevealCard
        text="Hover to reveal contact"
        revealText="+91 98765 43210"
        className="border-[#ede8e2]/[0.08] bg-[#131210]"
      >
        <TextRevealCardTitle className="text-[#ede8e2]">
          Contact Reveal
        </TextRevealCardTitle>
        <TextRevealCardDescription className="text-[#ede8e2]/40">
          Slide to reveal blurred contact info
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}

/* ─── FloatingDock demo ─── */
function FloatingDockDemo() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="relative flex h-24 w-full items-end justify-center">
        <FloatingDock
          items={[
            { title: "Restaurants", href: "/restaurants", icon: <IconBuildingStore className="h-5 w-5 text-[#ede8e2]/70" /> },
            { title: "Staff", href: "/staff", icon: <IconUsers className="h-5 w-5 text-[#ede8e2]/70" /> },
            { title: "Vendors", href: "/vendors", icon: <IconBriefcase className="h-5 w-5 text-[#ede8e2]/70" /> },
          ]}
        />
      </div>
      <p className="text-xs text-[#ede8e2]/30">Hover icons to see magnification · Used as mobile bottom nav</p>
    </div>
  );
}

/* ─── FloatingNavbar demo ─── */
function FloatingNavDemo() {
  return (
    <div className="relative h-20 w-full overflow-hidden rounded-xl border border-[#ede8e2]/[0.06] bg-[#0f0d0b]">
      <div className="absolute inset-x-0 top-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 rounded-full border border-[#ede8e2]/[0.10] bg-[#131210]/90 px-5 py-2.5 backdrop-blur-md"
        >
          {["Restaurants", "Staff", "Vendors"].map((item) => (
            <span key={item} className="text-sm text-[#ede8e2]/60 hover:text-[#d4913a] cursor-pointer transition-colors">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
      <p className="absolute bottom-3 inset-x-0 text-center text-[10px] text-[#ede8e2]/20">
        FloatingNav — appears when scrolling up · component: ui/floating-navbar.tsx
      </p>
    </div>
  );
}

/* ─── Expandable Card demo ─── */
const DEMO_CARDS = [
  { id: "1", name: "The Permit Room", locality: "Indiranagar", category: "Bar & Restaurant", rating: 4.8, cuisine: ["Cocktails", "Modern Indian"], verified: true },
  { id: "2", name: "Truffles", locality: "Koramangala", category: "Casual Dining", rating: 4.5, cuisine: ["Burgers", "Steaks"], verified: true },
  { id: "3", name: "Corner House", locality: "Jayanagar", category: "Desserts", rating: 4.6, cuisine: ["Ice Cream", "Waffles"], verified: false },
];

function ExpandableCardDemo() {
  const [active, setActive] = useState<typeof DEMO_CARDS[0] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const palettes = ["from-orange-800 to-stone-900", "from-amber-700 to-orange-900", "from-red-900 to-rose-950"];

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 bg-black/75 backdrop-blur-sm" />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-4">
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#ede8e2]/10 text-[#ede8e2] hover:bg-[#ede8e2]/20 transition-all">
              ✕
            </motion.button>
            <motion.div layoutId={`demo-card-${active.id}-${id}`} ref={ref}
              className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-[#ede8e2]/[0.08] bg-[#131210]">
              <motion.div layoutId={`demo-img-${active.id}-${id}`}
                className="flex h-44 w-full items-center justify-center bg-gradient-to-br"
                style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
              >
                <div className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${palettes[parseInt(active.id) - 1]}`}>
                  <span className="text-5xl font-black text-white/60">{active.name.charAt(0)}</span>
                </div>
              </motion.div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <motion.h3 layoutId={`demo-title-${active.id}-${id}`} className="font-display text-xl font-bold text-[#ede8e2]">
                      {active.name}
                    </motion.h3>
                    <motion.p layoutId={`demo-sub-${active.id}-${id}`} className="mt-1 text-sm text-[#ede8e2]/45">
                      {active.locality} · {active.category}
                    </motion.p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {active.verified && (
                      <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400">✓ Verified</span>
                    )}
                    <span className="text-sm font-semibold text-[#d4913a]">★ {active.rating}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {active.cuisine.map((c) => (
                    <span key={c} className="rounded-full border border-[#d4913a]/30 bg-[#d4913a]/10 px-3 py-1 text-xs text-[#d4913a]">{c}</span>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <p className="text-xs text-[#ede8e2]/25">Contact hidden — sign in to reveal</p>
                  <button onClick={() => setActive(null)}
                    className="hidden rounded-full border border-[#ede8e2]/[0.08] px-4 py-1.5 text-xs text-[#ede8e2]/40 hover:text-[#ede8e2]/80 transition-colors lg:block">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ul className="space-y-1.5">
        {DEMO_CARDS.map((card, i) => (
          <motion.li
            layoutId={`demo-card-${card.id}-${id}`}
            key={`demo-card-${card.id}-${id}`}
            onClick={() => setActive(card)}
            className="group relative cursor-pointer rounded-xl border border-[#ede8e2]/[0.06] bg-[#131210] px-5 py-4 transition-colors hover:border-[#d4913a]/20 hover:bg-[#161310]"
          >
            {card.verified && <GlowingEffect spread={30} glow={false} disabled={false} proximity={60} inactiveZone={0.2} />}
            <div className="flex items-center gap-4">
              <motion.div layoutId={`demo-img-${card.id}-${id}`} className="h-14 w-14 shrink-0 rounded-lg">
                <div className={`flex h-full w-full items-center justify-center rounded-[inherit] bg-gradient-to-br ${palettes[i]}`}>
                  <span className="text-2xl font-bold text-white/70">{card.name.charAt(0)}</span>
                </div>
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <motion.h3 layoutId={`demo-title-${card.id}-${id}`} className="text-[15px] font-semibold text-[#ede8e2] [overflow:hidden] [text-overflow:ellipsis] [white-space:nowrap]">
                    {card.name}
                  </motion.h3>
                  {card.verified && <span className="shrink-0 text-[10px] text-green-400">✓</span>}
                </div>
                <motion.p layoutId={`demo-sub-${card.id}-${id}`} className="text-xs text-[#ede8e2]/40">
                  {card.locality} · {card.category}
                </motion.p>
              </div>
              <div className="ml-2 flex shrink-0 flex-col items-end gap-2">
                <span className="text-sm font-semibold text-[#d4913a]">★ {card.rating}</span>
                <span className="text-[10px] text-[#ede8e2]/15 opacity-0 transition-opacity group-hover:opacity-100">View →</span>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[#ede8e2]/30">Click any card to expand · Esc or click outside to dismiss</p>
    </>
  );
}

/* ─── Page ─── */
export default function ShowcasePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-12">
        <p className="mb-2 text-xs text-[#d4913a]">Aceternity UI · 5 components</p>
        <h1 className="font-display text-[2.8rem] font-black leading-[1.0] tracking-[-0.03em] text-[#ede8e2]">
          Component Showcase
        </h1>
        <p className="mt-3 max-w-md text-sm text-[#ede8e2]/40">
          All Aceternity UI components installed in this project. Each is live and interactive.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "GlowingEffect",
            "PlaceholdersAndVanishInput",
            "TextRevealCard",
            "FloatingDock",
            "FloatingNavbar",
            "Expandable Cards (pattern)",
          ].map((name) => (
            <span key={name}
              className="rounded-full border border-[#d4913a]/20 bg-[#d4913a]/[0.07] px-3 py-1 text-xs text-[#d4913a]/80">
              {name}
            </span>
          ))}
        </div>
      </div>

      <Section title="GlowingEffect" description="Mouse-proximity border glow for verified/featured cards · ui/glowing-effect.tsx">
        <GlowingEffectDemo />
      </Section>

      <Section title="PlaceholdersAndVanishInput" description="Cycling placeholder search input with vanish animation on submit · ui/placeholders-and-vanish-input.tsx">
        <SearchInputDemo />
      </Section>

      <Section title="TextRevealCard" description="Hover-to-reveal text with a scrub mask effect · ui/text-reveal-card.tsx">
        <TextRevealDemo />
      </Section>

      <Section title="FloatingDock" description="Magnifying icon dock for navigation · ui/floating-dock.tsx · shown as mobile nav in this app">
        <FloatingDockDemo />
      </Section>

      <Section title="FloatingNavbar" description="Scroll-triggered floating nav that appears on scroll-up · ui/floating-navbar.tsx · available but not active in this app">
        <FloatingNavDemo />
      </Section>

      <Section title="Expandable Cards (pattern)" description="layoutId-based card-to-modal expand animation · from Aceternity's expandable-card-demo · used in Restaurants, Staff, Vendors">
        <ExpandableCardDemo />
      </Section>
    </div>
  );
}
