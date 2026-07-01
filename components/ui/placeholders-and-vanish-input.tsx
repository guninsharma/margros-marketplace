"use client";

import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAnimation = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2600);
  }, [placeholders.length]);
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  }, [startAnimation]);

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange, startAnimation]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.form?.requestSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) onSubmit(e);
  };

  return (
    <form
      className="relative mx-auto h-12 w-full overflow-hidden rounded-full border border-gray-200 bg-[#fafafa] text-gray-900 transition-all focus-within:border-gray-300 focus-within:bg-white shadow-sm"
      onSubmit={handleSubmit}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) onChange(e);
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className="relative z-10 h-full w-full rounded-full border-none bg-transparent pl-11 pr-28 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
        placeholder={placeholders[currentPlaceholder]}
      />

      <button
        disabled={!value}
        type="submit"
        className="absolute right-1.5 top-1/2 z-20 inline-flex h-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#e05523] px-5 text-xs font-bold text-white transition-colors hover:bg-[#c44a1c] disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
      >
        Search
      </button>
    </form>
  );
}
