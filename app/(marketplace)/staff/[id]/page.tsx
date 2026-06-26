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
      <Link href="/staff" className="mb-8 inline-flex items-center gap-1.5 text-xs font-bold text-[#86868b] transition-colors hover:text-[#1d1d1f]">
        Back to Staff
      </Link>

      <div className="clay-panel-strong p-6">
        <div className="mb-6 flex items-center gap-5">
          <div className="clay-pop flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-[#1d1d1f]">{member.full_name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black tracking-[-0.02em] text-[#1d1d1f]">{member.full_name}</h1>
              {member.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#bfe8cb] bg-[#eaf7ee] px-2.5 py-0.5 text-xs font-black text-[#248a42]">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-semibold text-[#6e6e73]">{member.role_title || member.department}</p>
            <p className="text-xs font-medium text-[#86868b]">{member.locality}, {member.city}</p>
            {member.is_available && (
              <span className="mt-2 inline-block rounded-full border border-[#ffd5bf] bg-[#fff1e8] px-2.5 py-0.5 text-xs font-black text-[#c94d12]">
                Available for hire
              </span>
            )}
          </div>
        </div>

        <div className="clay-inset mb-6 grid grid-cols-2 gap-4 p-5 sm:grid-cols-3">
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
              <p className="mb-0.5 text-[10px] font-bold text-[#86868b]">{label}</p>
              <p className="text-sm font-semibold text-[#1d1d1f]">{value}</p>
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
