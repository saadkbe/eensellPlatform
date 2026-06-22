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
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">1. Strict No Refund Policy</h2>
              <p>
                Due to the nature of Eensell University being a digital educational product, and because your purchase grants you immediate access to our proprietary curriculum, downloadable templates, and exclusive private community, <strong>all sales are final.</strong> We maintain a strict no-refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">2. Why We Don't Offer Refunds</h2>
              <p className="mb-4">
                Unlike physical products, digital content cannot be "returned." Once you have gained access to our platform, you have consumed the value of the intellectual property we have spent years developing. Offering refunds on digital goods exposes us to severe piracy and abuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">3. Acknowledgment</h2>
              <p>
                By completing your purchase and gaining access to Eensell University, you explicitly acknowledge and agree that you waive any right to a refund. Any chargebacks filed through your bank or payment provider will be disputed vigorously using your IP address, activity logs, and this agreed-upon policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">4. Support and Guidance</h2>
              <p>
                If you are struggling with the material or need technical assistance, we are here to help! We want you to succeed. Please reach out to our support team and utilize your 1-on-1 coaching access instead of requesting a refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6">5. Contact Us</h2>
              <p>
                If you have any questions before making a purchase, please contact us via email at <a href="mailto:contact@eensell.com" className="text-[#FF6B4A] hover:underline font-bold">contact@eensell.com</a> or via WhatsApp at <a href="https://wa.me/212666065608" className="text-[#FF6B4A] hover:underline font-bold">+212666065608</a>. We are happy to answer any questions to ensure this program is right for you.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
