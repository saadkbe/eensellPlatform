"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { sendContactEmail } from "@/actions/email.actions";
import { toast } from "sonner";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await sendContactEmail(formData.name, formData.email, formData.message);
      
      if (result.success) {
        toast.success("Message sent successfully! We will get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 relative flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-6xl mx-auto px-6 py-32 md:py-40">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
              Have a question, need support, or want to partner with us? We'd love to hear from you. Send us a message and our team will respond shortly.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-zinc-200/60 shadow-xl flex items-start space-x-6"
            >
              <div className="bg-[#FF6B4A]/10 p-4 rounded-2xl">
                <Mail className="w-8 h-8 text-[#FF6B4A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Email Us</h3>
                <p className="text-zinc-500 mb-2">Our friendly team is here to help.</p>
                <a href="mailto:contact@eensell.com" className="text-[#FF6B4A] font-semibold hover:underline">
                  contact@eensell.com
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-3xl border border-zinc-200/60 shadow-xl flex items-start space-x-6"
            >
              <div className="bg-[#FF6B4A]/10 p-4 rounded-2xl">
                <Phone className="w-8 h-8 text-[#FF6B4A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">WhatsApp Support</h3>
                <p className="text-zinc-500 mb-2">Fastest way to get answers.</p>
                <a href="https://wa.me/212666065608" target="_blank" rel="noopener noreferrer" className="text-[#FF6B4A] font-semibold hover:underline">
                  +212 666 065 608
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl border border-zinc-200/60 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-zinc-900">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50 focus:border-[#FF6B4A] transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-zinc-900">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50 focus:border-[#FF6B4A] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-zinc-900">Message</label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50 focus:border-[#FF6B4A] transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-[#FF6B4A] hover:bg-[#E85A3B] text-white rounded-xl shadow-[0_8px_16px_-6px_rgba(255,107,74,0.4)] transition-all"
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
