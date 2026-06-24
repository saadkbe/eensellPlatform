"use client";

import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { LogOut, Copy, Check, Building2, User, CreditCard, Hash, Globe, FileCode2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Navbar } from "@/components/landing/Navbar";
import { toast } from "sonner";

function PendingContent() {
  const { t, language, dir, isRTL } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const whatsappNumber = "212666065608";
  const whatsappMessage = encodeURIComponent(t("pending_whatsapp_message"));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const title = language === "ar" ? "الخطوة 2: تفعيل حسابك" : language === "fr" ? "Étape 2 : Activez votre compte" : "Step 2: Activate Your Account";
  
  const subtitle = language === "ar" 
    ? "قم بتحويل مبلغ 200 درهم الآن لتأمين مقعدك التأسيسي مدى الحياة. سيتم تفعيل حسابك فوراً في أقل من 60 ثانية بعد إرسال وصل الدفع."
    : language === "fr"
    ? "Transférez 200 MAD maintenant pour sécuriser votre place fondatrice à vie. Votre compte sera débloqué en moins de 60 secondes après l'envoi du reçu."
    : "Transfer 200 MAD now to secure your lifetime founder's spot. Your account will be unlocked within 60 seconds of sending the receipt.";

  const whatsappText = language === "ar" ? "إرسال وصل الدفع" : language === "fr" ? "Envoyer le reçu" : "Send Receipt";
  const whatsappSub = language === "ar" ? "دعم مباشر عبر الواتساب • تفعيل في 60 ثانية" : language === "fr" ? "Support direct via WhatsApp • Activation en 60 secondes" : "Direct WhatsApp support • Activation in 60 seconds";

  const bankDetails = [
    { label: language === "ar" ? "البنك" : "Bank", value: "CIH Bank", icon: Building2, colSpan: "col-span-1" },
    { label: language === "ar" ? "الاسم الكامل" : "Name", value: "MONSIEUR SAAD KAABOUCHE", icon: User, colSpan: "col-span-1" },
    { label: language === "ar" ? "رقم الحساب (Compte)" : "Compte", value: "3546303211005900", icon: CreditCard, colSpan: "col-span-1 md:col-span-2" },
    { label: language === "ar" ? "رمز البنك (RIB)" : "RIB", value: "230825354630321100590031", icon: Hash, colSpan: "col-span-1 md:col-span-2" },
    { label: language === "ar" ? "رقم الحساب الدولي (IBAN)" : "IBAN", value: "MA64 2308 2535 4630 3211 0059 0031", icon: Globe, colSpan: "col-span-1 md:col-span-2" },
    { label: language === "ar" ? "رمز السويفت (SWIFT)" : "SWIFT", value: "CIHMMAMC", icon: FileCode2, colSpan: "col-span-1 md:col-span-2" },
  ];

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(value);
    toast.success(language === "ar" ? `تم نسخ ${label} بنجاح!` : `Copied ${label}!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div dir={dir} className={`min-h-screen flex items-center justify-center py-20 md:py-28 bg-background relative overflow-hidden px-4 ${isRTL ? "font-arabic" : ""}`}>
      <Navbar hideLinks={true} />
      
      {/* Premium Background styling matching landing page */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.15] bg-brand pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.1] bg-success pointer-events-none" />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-3xl w-full flex flex-col items-center mt-12"
      >
        {/* Success / Pending Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="mx-auto mb-6 relative"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-[2rem] bg-card border border-success/30 flex items-center justify-center glow-success shadow-2xl relative z-10">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-success" />
          </div>
          {/* Pulsing rings */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] border border-success/40"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight leading-tight text-center"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-muted-foreground text-base sm:text-lg mb-10 leading-relaxed font-medium text-center max-w-xl px-2"
        >
          {subtitle}
        </motion.p>

        {/* Premium Bento Grid Bank Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full bg-card/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 mb-10 border border-border/60 shadow-2xl relative overflow-hidden"
        >
          {/* Gradient accent bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand via-success to-brand opacity-90" />
          
          <div className="mb-8 text-center sm:text-start">
            <h3 className="text-2xl font-black text-foreground mb-2">
              {language === "ar" ? "معلومات الحساب البنكي (CIH Bank)" : "CIH Bank Information"}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {language === "ar" ? "انسخ المعلومات أدناه لإتمام عملية التحويل البنكي بسهولة." : "Copy the details below to complete your bank transfer easily."}
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {bankDetails.map((item, index) => {
              const Icon = item.icon;
              const isCopied = copiedKey === item.value;

              return (
                <div 
                  key={index}
                  className={`bg-background/60 rounded-[1.5rem] p-5 sm:p-6 border border-border/50 hover:border-brand/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${item.colSpan}`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1 w-full">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-brand" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-sm sm:text-base md:text-lg font-black text-foreground tracking-wider break-all select-all">
                        {item.value}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleCopy(item.value, item.label)}
                    variant="ghost"
                    className={`h-11 px-5 rounded-xl font-bold text-xs sm:text-sm shrink-0 flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
                      isCopied 
                        ? "bg-success text-white hover:bg-success hover:text-white" 
                        : "bg-secondary/80 text-foreground hover:bg-brand hover:text-white border border-border/60"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-white animate-scale-in" />
                        <span>{language === "ar" ? "تم النسخ!" : "Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{language === "ar" ? "نسخ" : "Copy"}</span>
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* WhatsApp CTA Button Section */}
          <div className="mt-10 pt-8 border-t border-border/50 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5, type: "spring", bounce: 0.4 }}
              className="w-full max-w-lg mx-auto"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-16 sm:h-[4.5rem] text-lg sm:text-xl font-black bg-[#25D366] hover:bg-[#128C7E] text-white rounded-[1.5rem] shadow-[0_10px_40px_rgba(37,211,102,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(37,211,102,0.4)] flex items-center justify-center gap-3 group animate-pulse-ring"
                style={{ animationDuration: "3s" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform shrink-0">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.826 0 10.564 4.741 10.564 10.564 0 5.824-4.74 10.564-10.564 10.564z" />
                </svg>
                <span>{whatsappText}</span>
              </a>
              <p className="mt-4 text-sm text-muted-foreground font-bold flex items-center justify-center gap-2">
                {whatsappSub}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Sign out button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <SignOutButton>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 text-base font-bold rounded-xl"
            >
              <LogOut className={`w-5 h-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              {t("pending_logout")}
            </Button>
          </SignOutButton>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PendingPage() {
  return <PendingContent />;
}


