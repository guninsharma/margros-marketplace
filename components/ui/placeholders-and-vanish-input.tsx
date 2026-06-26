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
      className="clay-panel relative mx-auto h-14 w-full overflow-hidden rounded-full text-[#130f0c] transition-transform focus-within:-translate-y-0.5"
      onSubmit={handleSubmit}
    >
      <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b6f5e]" />
      <input
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) onChange(e);
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className="relative z-10 h-full w-full rounded-full border-none bg-transparent pl-13 pr-28 text-sm font-semibold text-[#130f0c] outline-none placeholder:text-[#8b6f5e] sm:text-base"
        placeholder={placeholders[currentPlaceholder]}
      />

      <button
        disabled={!value}
        type="submit"
        className="clay-pop absolute right-2 top-1/2 z-20 inline-flex h-10 -translate-y-1/2 items-center justify-center rounded-full px-4 text-xs font-black text-white disabled:bg-[#dfd3c5] disabled:text-[#8b6f5e] disabled:shadow-none"
      >
        Search
      </button>
    </form>
  );
}
