import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ContactReveal from "@/components/ContactReveal";
import { BadgeCheck, MapPin, Star } from "lucide-react";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: restaurant }, { data: { user } }] = await Promise.all([
    supabase.from("restaurants").select("*").eq("id", id).single(),
    supabase.auth.getUser(),
  ]);

  if (!restaurant) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link href="/restaurants" className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-900">
        ← Back to Restaurants
      </Link>

      <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-sm">
        <div className="flex h-48 w-full items-center justify-center bg-orange-50/40 border-b border-gray-100">
          <span className="text-7xl font-extrabold text-[#e05523]">{restaurant.name.charAt(0)}</span>
        </div>

        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-gray-900">{restaurant.name}</h1>
              <p className="mt-1 text-sm font-semibold text-gray-500">{restaurant.locality}, {restaurant.city}</p>
              {restaurant.full_address && (
                <p className="mt-1 text-xs font-medium text-gray-400">{restaurant.full_address}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {restaurant.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-0.5 text-xs font-bold text-[#16a34a]">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
              {restaurant.rating && (
                <span className="inline-flex items-center gap-1 text-base font-bold text-[#e05523]">
                  <Star className="h-4 w-4 fill-current" /> {restaurant.rating}
                  {restaurant.review_count && (
                    <span className="text-xs font-semibold text-gray-400">({restaurant.review_count})</span>
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {restaurant.category && (
              <span className="rounded-full bg-gray-50 border border-gray-200/60 px-3 py-1.5 text-xs font-semibold text-gray-500">
                {restaurant.category}
              </span>
            )}
            {restaurant.cuisine_type?.map((c) => (
              <span key={c} className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{
                background: "rgba(224,85,35,0.08)",
                border: "1px solid rgba(224,85,35,0.20)",
                color: "#e05523",
              }}>
                {c}
              </span>
            ))}
          </div>

          {restaurant.google_maps_url && (
            <a href={restaurant.google_maps_url} target="_blank" rel="noopener noreferrer"
              className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200/60 bg-gray-50/50 px-4 py-3.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <MapPin className="h-4 w-4 text-[#16a34a]" />
              <span>View on Google Maps</span>
              <span className="ml-auto text-gray-400">↗</span>
            </a>
          )}

          <ContactReveal
            listingType="restaurant"
            listingId={restaurant.id}
            phone={restaurant.phone}
            email={restaurant.email}
            isAuthenticated={!!user}
          />
        </div>
      </div>
    </div>
  );
}
