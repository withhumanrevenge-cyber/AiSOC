"use client";

import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { PricingSection } from "@/components/pricing-section";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export default function PricingPage() {
  const { user } = useUser();
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-x-hidden overflow-y-auto selection:bg-blue-500/30 bg-zinc-950 font-sans pt-32 pb-24">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      {/* Persistent Auth Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
         <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer z-50 relative pointer-events-auto">
           <ShieldAlert className="w-6 h-6 text-blue-500" />
           <span className="font-bold tracking-tighter text-lg text-white">AISOC_INTEL</span>
         </Link>
         <div className="flex items-center gap-4 z-50 relative pointer-events-auto">
           {!user ? (
             <SignInButton mode="modal">
               <button className="px-5 py-2 rounded-full border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors text-xs font-bold tracking-widest uppercase text-white">
                 Operator_Login
               </button>
             </SignInButton>
           ) : (
             <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-blue-500/30" } }} />
           )}
         </div>
      </div>

      <div className="w-full z-20 relative px-4 mx-auto max-w-7xl">
        <PricingSection />
      </div>
    </main>
  );
}
