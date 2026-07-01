import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Suspense } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/restaurants");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      {/* Subtle background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(224,85,35,0.02),transparent_60%)]" />

      <div className="w-full max-w-[360px] rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Margros"
            width={130}
            height={50}
            className="h-11 w-auto object-contain"
            priority
          />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 text-center">Welcome back</h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Sign in to reveal contacts and connect with listings
        </p>

        {error && (
          <div
            className="mb-5 rounded-xl px-4 py-3 text-xs font-semibold text-center"
            style={{
              background: "rgba(220,38,38,0.05)",
              border: "1px solid rgba(220,38,38,0.15)",
              color: "#dc2626",
            }}
          >
            Authentication failed — please try again.
          </div>
        )}

        <Suspense
          fallback={
            <div
              className="h-12 w-full rounded-full animate-pulse bg-gray-100"
            />
          }
        >
          <GoogleSignInButton />
        </Suspense>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            secure &bull; direct access
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <p className="text-center text-[11px] text-gray-400">
          By continuing you agree to{" "}
          <a
            href="https://margros.in/legal"
            target="_blank"
            className="underline transition-colors text-gray-500 hover:text-gray-900"
          >
            Terms of Service
          </a>
        </p>
      </div>

      <p className="mt-8 text-xs font-semibold text-gray-400">
        Margros Marketplace &bull; Bengaluru&apos;s Hospitality Network
      </p>
    </div>
  );
}
