import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund policy for Eensell University.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 relative flex flex-col">
      <Navbar />
      
      {/* Premium Hero Header */}
      <div className="relative bg-zinc-900 pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black">
        <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Refund Policy
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
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">1. Merchant of Record & Reseller Notice</h2>
              <p>
                Our order process is conducted by our online reseller and Merchant of Record, <strong>Paddle.com</strong>. Paddle is the Merchant of Record for all our orders. Paddle provides customer service inquiries and handles returns and payments in full compliance with international consumer regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">2. Subscription Cancellation Policy</h2>
              <p className="mb-4">
                You have full control over your recurring subscription. You may cancel your subscription at any time with a single click directly from your account settings or by contacting our support desk.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Upon cancellation, your access remains active until the end of your current paid billing period.</li>
                <li>No further automated renewals or charges will occur after cancellation.</li>
                <li>There are no cancellation fees or lock-in contracts.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">3. Digital Membership & Educational Access Refund Terms</h2>
              <p className="mb-4">
                We take immense pride in the quality of Eensell University, our proprietary AI automation workflows, curriculum, and workspace tools. We want you to be completely satisfied with your educational investment.
              </p>
              <p className="mb-4">
                We offer a <strong>14-day conditional satisfaction guarantee</strong> from the date of initial purchase:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>If you encounter unresolved technical issues that prevent you from accessing the platform, or if the delivered content significantly diverges from our published curriculum specifications, you may request a full refund within 14 days of purchase.</li>
                <li>To prevent abuse, piracy, and mass downloading of our proprietary assets, refund requests are eligible only for accounts that have consumed less than 25% of the coursework and have not mass-downloaded exclusive agency templates.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">4. How to Request a Refund or Support</h2>
              <p className="mb-4">
                If you believe you qualify for a refund or need assistance getting your workspace configured, please reach out to our team:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email our dedicated desk: <a href="mailto:contact@eensell.com" className="text-[#FF6B4A] hover:underline font-bold">contact@eensell.com</a></li>
                <li>Include your order confirmation number, the email used at checkout, and the reason for your request.</li>
                <li>Approved refunds are processed through Paddle and returned to your original payment method (Card, PayPal, Apple Pay, Google Pay) within 3–7 business days depending on your bank.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">5. Contact Information</h2>
              <p>
                For questions regarding billing, subscriptions, or this Refund Policy, please contact us at <a href="mailto:contact@eensell.com" className="text-[#FF6B4A] hover:underline font-bold">contact@eensell.com</a> or via WhatsApp at <a href="https://wa.me/212666065608" className="text-[#FF6B4A] hover:underline font-bold">+212666065608</a>. We respond within 24–48 business hours.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
