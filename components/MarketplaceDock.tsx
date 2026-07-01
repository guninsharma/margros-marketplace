"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBuildingStore,
  IconUsers,
  IconBriefcase,
} from "@tabler/icons-react";

export default function MarketplaceDock() {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:hidden">
      <FloatingDock
        mobileClassName="p-1"
        items={[
          {
            title: "Restaurants",
            href: "/restaurants",
            icon: <IconBuildingStore className="h-5 w-5" style={{ color: "#e05523" }} />,
          },
          {
            title: "Staff",
            href: "/staff",
            icon: <IconUsers className="h-5 w-5" style={{ color: "#e05523" }} />,
          },
          {
            title: "Vendors",
            href: "/vendors",
            icon: <IconBriefcase className="h-5 w-5" style={{ color: "#e05523" }} />,
          },
        ]}
      />
    </div>
  );
}

