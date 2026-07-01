"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

interface SearchInputProps {
  placeholders: string[];
}

export default function SearchInput({ placeholders }: SearchInputProps) {
  const [value, setValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={(e) => setValue(e.target.value)}
      onSubmit={handleSubmit}
    />
  );
}
