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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="glass-strong w-full max-w-[360px] rounded-3xl p-8">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Margros"
            width={130}
            height={50}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        <h1 className="mb-1 text-2xl font-bold text-white">Welcome back</h1>
        <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>
          Sign in to reveal contacts and connect with listings
        </p>

        {error && (
          <div
            className="mb-5 rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "rgba(252,165,165,1)",
            }}
          >
            Authentication failed — please try again.
          </div>
        )}

        <Suspense
          fallback={
            <div
              className="h-12 w-full rounded-full"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
          }
        >
          <GoogleSignInButton />
        </Suspense>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.10)" }} />
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            secure · no spam
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.10)" }} />
        </div>

        <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.20)" }}>
          By continuing you agree to{" "}
          <a
            href="https://margros.in/legal"
            target="_blank"
            className="underline transition-colors"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            Terms of Service
          </a>
        </p>
      </div>

      <p className="mt-8 text-xs" style={{ color: "rgba(255,255,255,0.20)" }}>
        Margros Marketplace · Bengaluru&apos;s Hospitality Network
      </p>
    </div>
  );
}
