import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LanguageProvider } from "@/components/landing/LanguageProvider";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Eensell University.",
};

export default function PrivacyPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 relative overflow-x-hidden rtl-content flex flex-col">
        <Navbar />
        
        <main className="flex-1 container max-w-4xl mx-auto px-6 py-32 md:py-48">
          <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl border border-zinc-200/60">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tight">🔒 Privacy Policy</h1>
            <p className="text-zinc-500 font-medium mb-12">Last Updated: June 20, 2026</p>

            <div className="space-y-8 text-zinc-600 text-lg leading-relaxed font-medium">
              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">1. Introduction</h2>
                <p>
                  Eensell University respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or join our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">2. Information We Collect</h2>
                <p className="mb-4">We may collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong className="text-zinc-800">Personal Identification Information:</strong> Name, email address, phone number (e.g., WhatsApp at +212666065608 for coaching and support), and account credentials.</li>
                  <li><strong className="text-zinc-800">Transaction Data:</strong> Proof of payment (such as screenshots of bank transfers) and transaction IDs. Note: We do not directly store or process your sensitive credit card information.</li>
                  <li><strong className="text-zinc-800">Usage Data:</strong> Information on how you interact with our website, course modules, and community.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">We use the collected information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>To create, activate, and manage your Eensell University account.</li>
                  <li>To provide customer support and deliver 1-on-1 coaching via WhatsApp.</li>
                  <li>To verify payments and prevent fraudulent transactions.</li>
                  <li>To notify you about new module drops, platform updates, and schedule changes.</li>
                  <li>To improve our website UI and overall user experience.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">4. Data Sharing and Disclosure</h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your data only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong className="text-zinc-800">Service Providers:</strong> With trusted third-party platforms that assist us in operating our website, hosting our courses, or managing communications (e.g., email providers, analytics tools), provided those parties agree to keep this information confidential.</li>
                  <li><strong className="text-zinc-800">Legal Compliance:</strong> When required by law or to protect our legal rights, property, or safety.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">6. Your Data Rights</h2>
                <p>
                  You have the right to access, update, or delete the personal information we hold about you. If you wish to exercise any of these rights, or if you want to request account deletion after completing the curriculum, please contact our support team.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">7. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-black text-zinc-900 mb-4">8. Contact Us</h2>
                <p>
                  For any questions or concerns regarding your privacy, please contact us via email at <a href="mailto:contact@eensell.com" className="text-[#FF6B4A] hover:underline">contact@eensell.com</a> or via WhatsApp at <a href="https://wa.me/212666065608" className="text-[#FF6B4A] hover:underline">+212666065608</a>.
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  );
}
