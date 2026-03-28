import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-blue-500/30">
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ShieldAlert className="w-5 h-5 text-blue-500" />
          <span className="font-bold tracking-tighter text-sm text-white">AiSOC // RETURN</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <main className="max-w-3xl mx-auto pt-32 pb-24 px-6 md:px-0">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-bold tracking-widest uppercase border rounded-full border-blue-500/30 bg-blue-500/10 text-blue-400">
            Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="space-y-8 prose prose-invert prose-blue max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using AiSOC ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Description of Service</h2>
            <p className="leading-relaxed">
              AiSOC is an advanced threat visualization and intelligence platform that processes user-uploaded JSON security logs. The "Pro" tier provides unlimited file processing and real-time streaming capabilities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. User Responsibilities & Data Security</h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree not to upload logs containing Personally Identifiable Information (PII) or classified government data unless heavily anonymized. You retain ownership of all data uploaded to the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Subscription and Payments</h2>
            <p className="leading-relaxed">
              Premium features require a paid subscription processed via Stripe. Subscriptions are billed on a recurring basis. You may cancel your subscription at any time, but we do not provide refunds for partial billing periods.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Limitation of Liability</h2>
            <p className="leading-relaxed">
              AiSOC is an analysis tool and does not guarantee the prevention of cyberattacks. IN NO EVENT SHALL AISOC CONCEPTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Termination</h2>
            <p className="leading-relaxed">
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
