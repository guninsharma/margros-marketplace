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
      <Link href="/vendors" className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-900">
        ← Back to Vendors
      </Link>

      <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-sm">
        <div className="flex h-40 w-full items-center justify-center bg-orange-50/40 border-b border-gray-100">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-5xl font-extrabold text-[#e05523] shadow-sm border border-gray-100">
            {vendor.business_name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-gray-900">{vendor.business_name}</h1>
              <p className="mt-1 text-sm font-semibold text-gray-500">{vendor.category} · {vendor.locality}, {vendor.city}</p>
              {vendor.contact_person_name && (
                <p className="mt-1 text-xs font-medium text-gray-400">Contact: {vendor.contact_person_name}</p>
              )}
            </div>
            {vendor.is_verified && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-0.5 text-xs font-bold text-[#16a34a]">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-50 border border-gray-200/60 px-3 py-1.5 text-xs font-semibold text-gray-500">
              {vendor.category_group}
            </span>
            <span className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{
              background: "rgba(224,85,35,0.08)",
              border: "1px solid rgba(224,85,35,0.20)",
              color: "#e05523",
            }}>
              {vendor.category}
            </span>
          </div>

          {vendor.description && (
            <div className="mb-6 rounded-xl bg-gray-50 border border-gray-100 p-5">
              <p className="text-sm leading-relaxed text-gray-600">{vendor.description}</p>
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
