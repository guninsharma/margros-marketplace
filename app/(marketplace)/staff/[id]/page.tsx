import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ContactReveal from "@/components/ContactReveal";
import { BadgeCheck } from "lucide-react";

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: member }, { data: { user } }] = await Promise.all([
    supabase.from("staff").select("*").eq("id", id).single(),
    supabase.auth.getUser(),
  ]);

  if (!member) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link href="/staff" className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-900">
        ← Back to Staff
      </Link>

      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-orange-50/50">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold text-[#e05523]">{member.full_name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-gray-900">{member.full_name}</h1>
              {member.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-bold text-[#16a34a]">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-500">{member.role_title || member.department}</p>
            <p className="text-xs font-semibold text-gray-400">{member.locality}, {member.city}</p>
            {member.is_available && (
              <span className="mt-2 inline-block rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-[#e05523]">
                Available for hire
              </span>
            )}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 border border-gray-100 p-5 sm:grid-cols-3">
          {[
            { label: "Department", value: member.department },
            { label: "Role", value: member.role_title },
            { label: "Experience", value: member.experience_years ? `${member.experience_years} years` : null },
            { label: "Salary", value: member.salary_expectation ? `₹${member.salary_expectation.toLocaleString()}/mo` : null },
            { label: "Type", value: member.type },
            { label: "Agency", value: member.agency_name },
            { label: "Languages", value: member.languages?.join(", ") },
            { label: "Source", value: member.source_platform },
          ].filter((i) => i.value).map(({ label, value }) => (
            <div key={label}>
              <p className="mb-0.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        <ContactReveal
          listingType="staff"
          listingId={member.id}
          phone={member.mobile}
          isAuthenticated={!!user}
        />
      </div>
    </div>
  );
}
