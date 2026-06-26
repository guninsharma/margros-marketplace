import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ContactReveal from "@/components/ContactReveal";
import { BadgeCheck } from "lucide-react";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: vendor }, { data: { user } }] = await Promise.all([
    supabase.from("vendors").select("*").eq("id", id).single(),
    supabase.auth.getUser(),
  ]);

  if (!vendor) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link href="/vendors" className="mb-8 inline-flex items-center gap-1.5 text-xs font-bold text-[#86868b] transition-colors hover:text-[#1d1d1f]">
        Back to Vendors
      </Link>

      <div className="clay-panel-strong overflow-hidden">
        <div className="clay-inset flex h-40 w-full items-center justify-center">
          <span className="clay-pop flex h-24 w-24 items-center justify-center rounded-[28px] text-6xl font-black text-white">
            {vendor.business_name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-[-0.02em] text-[#1d1d1f]">{vendor.business_name}</h1>
              <p className="mt-1 text-sm font-semibold text-[#6e6e73]">{vendor.category} · {vendor.locality}, {vendor.city}</p>
              {vendor.contact_person_name && (
                <p className="mt-1 text-xs font-medium text-[#86868b]">Contact: {vendor.contact_person_name}</p>
              )}
            </div>
            {vendor.is_verified && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#bfe8cb] bg-[#eaf7ee] px-3 py-1 text-xs font-black text-[#248a42]">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="clay-inset rounded-full px-3 py-1.5 text-sm font-bold text-[#6e6e73]">
              {vendor.category_group}
            </span>
            <span className="clay-inset rounded-full px-3 py-1.5 text-sm font-bold text-[#c94d12]">
              {vendor.category}
            </span>
          </div>

          {vendor.description && (
            <div className="clay-inset mb-6 p-5">
              <p className="text-sm leading-relaxed text-[#6e6e73]">{vendor.description}</p>
            </div>
          )}

          <ContactReveal
            listingType="vendor"
            listingId={vendor.id}
            phone={vendor.phone}
            email={vendor.email}
            whatsapp={vendor.whatsapp}
            isAuthenticated={!!user}
          />
        </div>
      </div>
    </div>
  );
}
