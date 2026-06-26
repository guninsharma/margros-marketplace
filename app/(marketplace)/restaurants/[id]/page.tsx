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
      <Link href="/restaurants" className="mb-8 inline-flex items-center gap-1.5 text-xs font-bold text-[#86868b] transition-colors hover:text-[#1d1d1f]">
        Back to Restaurants
      </Link>

      <div className="clay-panel-strong overflow-hidden">
        <div className="clay-inset flex h-52 w-full items-center justify-center">
          <span className="text-7xl font-semibold text-[#c94d12]">{restaurant.name.charAt(0)}</span>
        </div>

        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-[-0.02em] text-[#1d1d1f]">{restaurant.name}</h1>
              <p className="mt-1 text-sm font-semibold text-[#6e6e73]">{restaurant.locality}, {restaurant.city}</p>
              {restaurant.full_address && (
                <p className="mt-1 text-xs font-medium text-[#86868b]">{restaurant.full_address}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {restaurant.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#bfe8cb] bg-[#eaf7ee] px-3 py-1 text-xs font-black text-[#248a42]">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
              {restaurant.rating && (
                <span className="inline-flex items-center gap-1 text-base font-black text-[#c94d12]">
                  <Star className="h-4 w-4 fill-current" /> {restaurant.rating}
                  {restaurant.review_count && (
                    <span className="text-xs font-semibold text-[#86868b]">({restaurant.review_count})</span>
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {restaurant.category && (
              <span className="clay-inset rounded-full px-3 py-1.5 text-sm font-bold text-[#6e6e73]">
                {restaurant.category}
              </span>
            )}
            {restaurant.cuisine_type?.map((c) => (
              <span key={c} className="clay-inset rounded-full px-3 py-1.5 text-sm font-bold text-[#c94d12]">
                {c}
              </span>
            ))}
          </div>

          {restaurant.google_maps_url && (
            <a href={restaurant.google_maps_url} target="_blank" rel="noopener noreferrer"
              className="clay-inset mb-6 flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#6e6e73] transition-transform hover:-translate-y-0.5 hover:text-[#1d1d1f]">
              <MapPin className="h-4 w-4 text-[#35b85a]" />
              <span>View on Google Maps</span>
              <span className="ml-auto text-[#86868b]">↗</span>
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
