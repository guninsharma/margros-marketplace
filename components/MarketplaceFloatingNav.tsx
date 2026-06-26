"use client";

import { FloatingNav } from "@/components/ui/floating-navbar";
import {
  IconBuildingStore,
  IconUsers,
  IconBriefcase,
} from "@tabler/icons-react";

export default function MarketplaceFloatingNav() {
  return (
    <FloatingNav
      navItems={[
        {
          name: "Restaurants",
          link: "/restaurants",
          icon: <IconBuildingStore className="h-4 w-4" />,
        },
        {
          name: "Staff",
          link: "/staff",
          icon: <IconUsers className="h-4 w-4" />,
        },
        {
          name: "Vendors",
          link: "/vendors",
          icon: <IconBriefcase className="h-4 w-4" />,
        },
      ]}
    />
  );
}
