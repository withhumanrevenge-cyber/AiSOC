import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="space-y-8 prose prose-invert prose-blue max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect information to provide better services to all our users. Information we collect includes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> We use Clerk for authentication, storing email addresses and profile data necessary for account creation.</li>
              <li><strong>Payment Information:</strong> Processed securely via Stripe. We do not store raw credit card details on our servers.</li>
              <li><strong>Log Data:</strong> Security logs uploaded (e.g. JSON files) for visualization. These are temporarily processed and not retained permanently unless requested.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Third-Party Integrations</h2>
            <p className="leading-relaxed">
              We use the Groq AI API for analyzing your security logs. Summaries and log statistics sent to Groq are subject to their own data privacy regulations. We strongly advise stripping PII before uploading datasets. Stripe and Clerk manage your financial and identity data respectively.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. How We Use Your Data</h2>
            <p className="leading-relaxed">
              Data is strictly used to render threat topologies, execute AI analysis, and manage your billing lifecycle. We do not sell your personal data or uploaded threat feeds to third-party data brokers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Security</h2>
            <p className="leading-relaxed">
              As a SOC visualization tool, security is our DNA. Your data is encrypted in transit using industry-standard protocols. However, no method of transmission over the Internet, or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Data Deletion Requests</h2>
            <p className="leading-relaxed">
              You can request full deletion of your account and metadata at any time by contacting support. Upon termination, all active sessions and Stripe subscriptions will be cancelled.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
