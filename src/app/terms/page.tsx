import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";


export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using Eensell University.",
};

export default function TermsPage() {
  return (

      <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 relative overflow-x-hidden rtl-content flex flex-col">
        <Navbar />
        
        <main className="flex-1 container max-w-4xl mx-auto px-6 py-32 md:py-48">
          <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl border border-zinc-200/60">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tight">Terms of Use (Terms & Conditions)</h1>
            <p className="text-zinc-500 font-medium mb-12">Last Updated: June 20, 2026</p>

            <div className="space-y-8 text-zinc-600 text-lg leading-relaxed font-medium">
              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">1. Introduction</h2>
                <p>
                  Welcome to Eensell University ("we," "our," or "us"). By accessing or using our website and purchasing access to our educational platform, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">2. Product and Access</h2>
                <p className="mb-4">
                  Eensell University provides educational content, digital workflows, AI agency frameworks, and a community platform. We provide training and education; we do not provide software licenses or access to premium third-party tools.
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong className="text-zinc-800">Access:</strong> Membership grants you lifetime access to the educational platform and community for a one-time fee.</li>
                  <li><strong className="text-zinc-800">Account Activation:</strong> Due to our manual payment verification process (e.g., CIH bank transfers), account activation may take a short processing period. Access is granted once payment is fully verified.</li>
                  <li><strong className="text-zinc-800">Account Security:</strong> Your account is for your personal use only. Sharing login credentials, downloading proprietary content for redistribution, or unauthorized sharing of the Mentorclass materials is strictly prohibited and will result in immediate termination of your account without a refund.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">3. Intellectual Property</h2>
                <p>
                  All materials provided inside Eensell University, including but not limited to videos, AI automations, templates, written guides, and scripts, are the exclusive intellectual property of Eensell. You are granted a limited, non-exclusive license to use these materials for your own personal business use. You may not copy, reproduce, redistribute, or sell our content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">4. Earnings Disclaimer & Limitation of Liability</h2>
                <p>
                  Eensell University provides educational resources and frameworks for building an AI agency. We do not guarantee any specific financial results, income, or success. Your results depend entirely on your own effort, execution, and market conditions. We are not liable for any direct, indirect, or consequential loss or damage arising from your use of our platform or business strategies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">5. Strict No Refund Policy</h2>
                <p>
                  Because Eensell University grants immediate access to proprietary digital products, downloadable assets, and exclusive community spaces, all sales are final. We maintain a strict no-refund policy. Once a payment is submitted and access to the platform has been granted, no refunds will be issued under any circumstances.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">6. User Conduct</h2>
                <p>
                  Members are expected to maintain professional and respectful behavior within the community and during 1-on-1 communications. Spamming, harassment, or self-promotion without permission will result in immediate removal from the platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">7. Governing Law</h2>
                <p>
                  These Terms of Use shall be governed by and construed in accordance with the laws of Morocco. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts of Morocco.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">8. Contact</h2>
                <p>
                  If you have any questions regarding these Terms, please contact us via email at <a href="mailto:contact@eensell.com" className="text-[#FF6B4A] hover:underline">contact@eensell.com</a> or via WhatsApp at <a href="https://wa.me/212666065608" className="text-[#FF6B4A] hover:underline">+212666065608</a>.
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>

  );
}
