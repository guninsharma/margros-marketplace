"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Phone, Send, ShieldCheck } from "lucide-react";

interface ContactRevealProps {
  listingType: "restaurant" | "staff" | "vendor";
  listingId: string;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  isAuthenticated: boolean;
}

export default function ContactReveal({
  listingType,
  listingId,
  phone,
  email,
  whatsapp,
  isAuthenticated,
}: ContactRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [logging, setLogging] = useState(false);
  const router = useRouter();

  const hasContact = phone || email || whatsapp;
  if (!hasContact) return null;

  const contacts = [
    phone && { icon: Phone, label: "Phone", value: phone },
    email && { icon: Mail, label: "Email", value: email },
    whatsapp && { icon: Send, label: "WhatsApp", value: whatsapp },
  ].filter(Boolean) as { icon: ComponentType<{ className?: string }>; label: string; value: string }[];

  async function handleReveal() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (revealed) return;
    setLogging(true);
    await fetch("/api/contact-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_type: listingType, listing_id: listingId }),
    });
    setRevealed(true);
    setLogging(false);
  }

  if (!isAuthenticated) {
    return (
      <div
        className="mt-4 rounded-xl p-5"
        style={{
          background: "#fafafa",
          border: "1px solid #e5e7eb",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <LockKeyhole className="h-4 w-4 text-[#e05523]" />
          <p className="text-sm font-bold text-gray-900">Verified contact access</p>
        </div>
        <div className="mb-4 space-y-2.5">
          {contacts.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <c.icon className="h-4 w-4 text-gray-400" />
              <span
                className="select-none text-sm font-semibold text-gray-400"
                style={{ filter: "blur(6px)" }}
              >
                {c.value}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={handleReveal}
          className="w-full rounded-full py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#c44a1c] active:scale-[0.98]"
          style={{ background: "#e05523" }}
        >
          Sign in to reveal contact
        </button>
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded-xl p-5"
      style={{
        background: "#fafafa",
        border: "1px solid #e5e7eb",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#16a34a]" />
          <p className="text-sm font-bold text-gray-900">Contact information</p>
        </div>
        {!revealed && (
          <span className="text-xs font-semibold text-gray-400">
            {logging ? "Logging…" : "Hover to reveal"}
          </span>
        )}
      </div>
      <div
        className="group cursor-pointer space-y-2.5"
        onMouseEnter={handleReveal}
        onClick={handleReveal}
      >
        {contacts.map((c) => (
          <div key={c.label} className="flex items-center gap-3">
            <c.icon className="h-4 w-4 text-[#e05523]" />
            <span
              className="select-all text-sm font-semibold text-gray-800 transition-all duration-300"
              style={{
                filter: revealed ? "none" : "blur(6px)",
                opacity: revealed ? 1 : 0.3,
              }}
            >
              {c.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
