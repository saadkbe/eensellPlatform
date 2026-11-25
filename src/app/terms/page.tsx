import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";


export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using Eensell University.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 relative flex flex-col">
      <Navbar />
      
      {/* Premium Hero Header */}
      <div className="relative bg-zinc-900 pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black">
        <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Terms of Use
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium">
            Last Updated: June 20, 2026
          </p>
        </div>
      </div>

      <main className="flex-1 container max-w-4xl mx-auto px-6 py-16 md:py-24 -mt-10 md:-mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl border border-zinc-200/60">
          <div className="space-y-12 text-zinc-600 text-lg leading-relaxed font-medium">
            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">1. Introduction</h2>
              <p>
                Welcome to Eensell University ("we," "our," or "us"). By accessing or using our website and purchasing access to our educational platform, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">2. Product and Access</h2>
              <p className="mb-4">
                Eensell University provides educational content, digital workflows, AI agency frameworks, and a community platform. We provide training and education; we do not provide software licenses or access to premium third-party tools.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-zinc-800">Access:</strong> Membership grants you digital access to the educational platform, workspaces, and curated resources according to your selected tier.</li>
                <li><strong className="text-zinc-800">Instant Activation:</strong> Account access is provisioned automatically upon successful order completion and payment confirmation via our Merchant of Record.</li>
                <li><strong className="text-zinc-800">Account Security:</strong> Your account is for your personal use only. Sharing login credentials, downloading proprietary content for redistribution, or unauthorized sharing of the materials is strictly prohibited and will result in immediate termination of your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">3. Merchant of Record & Billing</h2>
              <p>
                Our order process is conducted by our online reseller and Merchant of Record, <strong>Paddle.com</strong>. Paddle is the Merchant of Record for all our orders. Paddle provides customer service inquiries, collects sales taxes/VAT in compliance with international law, and handles returns and payments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">4. Intellectual Property</h2>
              <p>
                All materials provided inside Eensell University, including but not limited to videos, AI automations, templates, written guides, and scripts, are the exclusive intellectual property of Eensell. You are granted a limited, non-exclusive license to use these materials for your own personal business use. You may not copy, reproduce, redistribute, or sell our content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">5. Earnings Disclaimer & Limitation of Liability</h2>
              <p>
                Eensell University provides educational resources and frameworks for building modern AI workflows and client services. We do not guarantee any specific financial results, income, or success. Your results depend entirely on your own effort, execution, and market conditions. We are not liable for any direct, indirect, or consequential loss or damage arising from your use of our platform or business strategies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">6. Cancellations and Refund Policy</h2>
              <p>
                Subscription memberships can be cancelled at any time directly through your account dashboard. For details on our 14-day conditional satisfaction guarantee on digital access, please consult our full <a href="/refund" className="text-[#FF6B4A] hover:underline font-bold">Refund Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">6. User Conduct</h2>
              <p>
                Members are expected to maintain professional and respectful behavior within the community and during 1-on-1 communications. Spamming, harassment, or self-promotion without permission will result in immediate removal from the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">7. Governing Law</h2>
              <p>
                These Terms of Use shall be governed by and construed in accordance with the laws of Morocco. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of Morocco.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">8. Contact</h2>
              <p>
                If you have any questions regarding these Terms, please contact us via email at <a href="mailto:contact@eensell.com" className="text-[#FF6B4A] hover:underline font-bold">contact@eensell.com</a> or via WhatsApp at <a href="https://wa.me/212666065608" className="text-[#FF6B4A] hover:underline font-bold">+212666065608</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
