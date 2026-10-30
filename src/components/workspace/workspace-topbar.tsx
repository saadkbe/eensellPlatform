"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  Sun,
  Moon,
  Menu,
  CheckCheck,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  Users,
  Table2,
  Mail,
  MessageSquare,
  Receipt,
  StickyNote,
  Sliders,
  Globe,
  LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/actions/notification.actions";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Language } from "@/lib/translations";
import { toast } from "sonner";

interface RouteInfo {
  title: { ar: string; fr: string; en: string };
  icon: LucideIcon;
}

const ROUTE_LABELS: Record<string, RouteInfo> = {
  "/workspace": {
    title: { fr: "Vue d'ensemble & Revenus", ar: "لوحة التحكم والإيرادات", en: "Overview & Revenue" },
    icon: LayoutDashboard,
  },
  "/workspace/scraper": {
    title: { fr: "Google Maps Scraper", ar: "استخراج بيانات خرائط جوجل", en: "Google Maps Scraper" },
    icon: MapPin,
  },
  "/workspace/crm": {
    title: { fr: "Clients & CRM", ar: "إدارة العملاء والمبيعات", en: "Clients & CRM" },
    icon: Users,
  },
  "/workspace/sheets": {
    title: { fr: "Tableurs Agence", ar: "جداول بيانات الوكالة", en: "Agency Sheets" },
    icon: Table2,
  },
  "/workspace/drafter": {
    title: { fr: "Rédacteur Cold Email", ar: "صياغة البريد البارد", en: "Cold Email Drafter" },
    icon: Mail,
  },
  "/workspace/whatsapp": {
    title: { fr: "Studio WhatsApp", ar: "استوديو واتساب للمبيعات", en: "WhatsApp Outreach" },
    icon: MessageSquare,
  },
  "/workspace/invoices": {
    title: { fr: "Factures & Contrats", ar: "الفواتير والاشتراكات", en: "Invoices & Billing" },
    icon: Receipt,
  },
  "/workspace/notes": {
    title: { fr: "Notes & Playbooks", ar: "الملاحظات والكتيبات", en: "Notes & Playbooks" },
    icon: StickyNote,
  },
  "/workspace/settings": {
    title: { fr: "Paramètres & Clés API", ar: "الإعدادات ومفاتيح الربط", en: "Settings & API Keys" },
    icon: Settings,
  },
};

const languages: { code: Language; label: string; flag: string; short: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷", short: "FR" },
  { code: "ar", label: "العربية", flag: "🇲🇦", short: "AR" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
];

// Localize notifications strictly into the active toggle language
function localizeNotification(
  notification: { title: string; message: string },
  lang: Language
): { title: string; message: string } {
  const t = (notification.title || "").toLowerCase();
  const m = (notification.message || "").toLowerCase();

  // 1. Welcome / Onboarding
  if (
    t.includes("welcome") ||
    t.includes("bienvenue") ||
    t.includes("مرحبا") ||
    t.includes("مرحباً")
  ) {
    if (lang === "fr") {
      return {
        title: "Bienvenue sur Eensell Workspace OS",
        message:
          "Votre centre de commande d'agence est prêt. Connectez vos clés API dans les Paramètres pour activer les pitchs IA et le scraping Maps.",
      };
    }
    if (lang === "ar") {
      return {
        title: "مرحباً بك في نظام Eensell Workspace",
        message:
          "مركز قيادة وكالتك جاهز. اربط مفاتيح API في الإعدادات لتفعيل العروض بالذكاء الاصطناعي واستخراج البيانات.",
      };
    }
    return {
      title: "Welcome to Eensell Workspace OS",
      message:
        "Your agency command center is ready. Connect your API keys in Settings to activate AI pitches and Maps scraping.",
    };
  }

  // 2. Google Maps Scraper
  if (
    t.includes("maps") ||
    t.includes("scraper") ||
    t.includes("خرائط") ||
    m.includes("maps") ||
    m.includes("scraper")
  ) {
    if (lang === "fr") {
      return {
        title: "Scraper Google Maps Prêt",
        message:
          "Extrayez des numéros de téléphone vérifiés, avis et emails de décideurs dans n'importe quelle ville cible.",
      };
    }
    if (lang === "ar") {
      return {
        title: "أداة سحب بيانات خرائط جوجل جاهزة",
        message:
          "استخرج أرقام هواتف موثقة، تقييمات، وإيميلات صناع القرار في أي مدينة مستهدفة.",
      };
    }
    return {
      title: "Google Maps Scraper Ready",
      message:
        "Extract verified phone numbers, reviews, and decision-maker emails across any Moroccan or international city.",
    };
  }

  // 3. WhatsApp & Outreach
  if (
    t.includes("whatsapp") ||
    t.includes("واتساب") ||
    t.includes("outreach") ||
    m.includes("whatsapp") ||
    m.includes("drafter")
  ) {
    if (lang === "fr") {
      return {
        title: "Studios WhatsApp & Cold Email",
        message:
          "Rédigez des accroches percutantes en Darija et Français avec lancement WhatsApp en 1-clic et synchronisation Gmail.",
      };
    }
    if (lang === "ar") {
      return {
        title: "استوديوهات واتساب والبريد البارد",
        message:
          "قم بصياغة نصوص تواصل فعالة بالدارجة والفرنسية مع فتح واتساب بضغطة زر وتزامن Gmail.",
      };
    }
    return {
      title: "WhatsApp & Cold Email Studios",
      message:
        "Draft tailored hooks in Darija and French with 1-click WhatsApp launch and Gmail sync.",
    };
  }

  // 4. Live Sessions
  if (
    t.includes("live") ||
    t.includes("مباشر") ||
    t.includes("session") ||
    m.includes("live") ||
    m.includes("مباشرة")
  ) {
    if (lang === "fr") {
      return {
        title: "Nouvelle session live programmée",
        message:
          "Une nouvelle session de questions-réponses en direct a été planifiée. Rejoignez la salle depuis l'académie.",
      };
    }
    if (lang === "ar") {
      return {
        title: "جلسة مباشرة جديدة",
        message:
          "تمت جدولة جلسة تدريبية مباشرة جديدة. انضم إلى البث المباشر من خلال صفحة الجلسات.",
      };
    }
    return {
      title: "New Live Session Scheduled",
      message:
        "A new live coaching session has been scheduled. Check the live sessions tab to participate.",
    };
  }

  // 5. Courses & Modules
  if (
    t.includes("module") ||
    t.includes("lesson") ||
    t.includes("cours") ||
    t.includes("درس") ||
    t.includes("وحدة") ||
    t.includes("تحدي")
  ) {
    if (lang === "fr") {
      return {
        title: "Nouveau module de formation disponible",
        message:
          "Un nouveau cours pratique d'acquisition client a été ajouté dans votre espace membre.",
      };
    }
    if (lang === "ar") {
      return {
        title: "محتوى تدريبي جديد متاح",
        message:
          "تمت إضافة درس عملي جديد في مسار استقطاب العملاء داخل حسابك.",
      };
    }
    return {
      title: "New Training Module Available",
      message:
        "A new practical client acquisition lesson has been added to your member portal.",
    };
  }

  // Fallback: If not recognized, keep clean original text
  return notification;
}

function formatRelativeTime(date: Date | string, lang: Language) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (lang === "fr") {
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `Il y a ${diffHrs} h`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return "Hier";
    return `Il y a ${diffDays} j`;
  }

  if (lang === "ar") {
    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} د`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `منذ ${diffHrs} س`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return "أمس";
    return `منذ ${diffDays} ي`;
  }

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

export function WorkspaceTopBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [isOpenLanguage, setIsOpenLanguage] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const languageRef = useRef<HTMLDivElement | null>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsOpenNotifications(false);
      }
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsOpenLanguage(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  const loadNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const [list, count] = await Promise.all([
        getUserNotifications(),
        getUnreadNotificationCount(),
      ]);
      setNotifications(list || []);
      setUnreadCount(count || 0);
    } catch {
      // fallback
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [pathname]);

  const handleMarkAsRead = async (id: string, linkUrl?: string | null) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id);
    } catch {
      // silent
    }

    if (linkUrl) {
      setIsOpenNotifications(false);
      window.location.href = linkUrl;
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsAsRead();
      const successMsg =
        language === "fr"
          ? "Toutes les notifications sont marquées comme lues !"
          : language === "ar"
          ? "تم تعيين جميع الإشعارات كمقروءة!"
          : "All notifications marked as read!";
      toast.success(successMsg);
    } catch {
      toast.error("Erreur de synchronisation");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("eensell-workspace-theme-preference", nextTheme);
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-workspace-sidebar"));
  };

  const currentRoute = ROUTE_LABELS[pathname] || {
    title: { fr: "Eensell Workspace", ar: "مساحة عمل Eensell", en: "Eensell Workspace" },
    icon: LayoutDashboard,
  };
  const RouteIcon = currentRoute.icon;
  const routeTitle =
    currentRoute.title[language] || currentRoute.title.fr;

  const currentLangObj =
    languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 h-14 w-full bg-[#FFFFFF]/95 dark:bg-[#191919]/95 backdrop-blur-md border-b border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between px-4 sm:px-6 transition-colors shadow-2xs">
      {/* ── Left Side: Hamburger (Mobile) + Breadcrumb ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 -ml-1 rounded-md text-[#787774] hover:text-[#111111] dark:hover:text-[#FFFFFF] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5 stroke-[1.8]" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          {/* Black Simple Monochrome Route Icon */}
          <div className="w-6 h-6 rounded-md bg-[#F2F1EE] dark:bg-[#262626] flex items-center justify-center text-[#111111] dark:text-[#E6E6E5] shadow-2xs">
            <RouteIcon className="w-3.5 h-3.5 stroke-[1.8]" />
          </div>
          <span className="font-semibold text-[#111111] dark:text-[#E6E6E5] tracking-tight">
            {routeTitle}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        </div>
      </div>

      {/* ── Right Side: Language Toggle + Notifications + Settings + Theme + Profile ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* ── Language Switcher Dropdown ── */}
        <div className="relative" ref={languageRef}>
          <button
            onClick={() => setIsOpenLanguage((prev) => !prev)}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold text-[#55534E] dark:text-[#C5C5C4] hover:text-[#111111] dark:hover:text-white hover:bg-[#F2F1EE] dark:hover:bg-[#262626] border border-[#EDEDEB] dark:border-[#2E2E2E] transition-all cursor-pointer shadow-2xs"
            title="Changer de langue / Change Language"
          >
            <span>{currentLangObj.flag}</span>
            <span className="font-mono text-[11px] font-bold">{currentLangObj.short}</span>
            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          <AnimatePresence>
            {isOpenLanguage && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className="absolute right-0 mt-2 w-36 rounded-xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-xl p-1 z-50 text-xs"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsOpenLanguage(false);
                      toast.success(
                        l.code === "fr"
                          ? "Langue : Français"
                          : l.code === "ar"
                          ? "اللغة : العربية"
                          : "Language: English"
                      );
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                      language === l.code
                        ? "bg-[#111111] text-white dark:bg-white dark:text-[#111111] font-semibold"
                        : "text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#F7F6F3] dark:hover:bg-[#2A2A2A] hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    <span className="font-mono text-[10px] opacity-75">{l.short}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Functional Notifications Bell ── */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setIsOpenNotifications((prev) => !prev);
              if (!isOpenNotifications) loadNotifications();
            }}
            className="relative p-2 rounded-lg text-[#55534E] dark:text-[#C5C5C4] hover:text-[#111111] dark:hover:text-white hover:bg-[#F2F1EE] dark:hover:bg-[#262626] transition-colors cursor-pointer"
            title={
              language === "fr"
                ? "Notifications"
                : language === "ar"
                ? "الإشعارات"
                : "Notifications"
            }
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover Panel */}
          <AnimatePresence>
            {isOpenNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] shadow-2xl overflow-hidden z-50 text-xs"
              >
                {/* Panel Header */}
                <div className="p-3.5 bg-[#FAF9F7] dark:bg-[#1A1A1A] border-b border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111111] dark:text-[#E6E6E5]">
                      {language === "fr"
                        ? "Notifications"
                        : language === "ar"
                        ? "الإشعارات"
                        : "Notifications"}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                        {unreadCount}{" "}
                        {language === "fr"
                          ? "non lue(s)"
                          : language === "ar"
                          ? "غير مقروء"
                          : "unread"}
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>
                        {language === "fr"
                          ? "Tout marquer comme lu"
                          : language === "ar"
                          ? "تعيين الكل كمقروء"
                          : "Mark all as read"}
                      </span>
                    </button>
                  )}
                </div>

                {/* Notifications List (Strictly in the Toggle Language) */}
                <div className="max-h-80 overflow-y-auto divide-y divide-[#EDEDEB] dark:divide-[#2E2E2E]">
                  {isLoadingNotifications ? (
                    <div className="p-6 text-center text-[#787774] dark:text-[#9B9A97]">
                      {language === "fr"
                        ? "Chargement des notifications..."
                        : language === "ar"
                        ? "جاري تحميل الإشعارات..."
                        : "Loading notifications..."}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-6 text-center text-[#787774] dark:text-[#9B9A97] space-y-1">
                      <p className="font-semibold text-[#111111] dark:text-[#E6E6E5]">
                        {language === "fr"
                          ? "Aucune notification pour le moment"
                          : language === "ar"
                          ? "لا توجد إشعارات حتى الآن"
                          : "No notifications yet"}
                      </p>
                      <p className="text-[11px]">
                        {language === "fr"
                          ? "Les alertes sur vos prospects, mandats et campagnes s'afficheront ici."
                          : language === "ar"
                          ? "ستظهر تنبيهات العملاء المستخرجين والحملات هنا فور توفرها."
                          : "Updates about leads, retainers, and outreach will appear here."}
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const localized = localizeNotification(n, language);
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleMarkAsRead(n.id, n.linkUrl)}
                          className={`p-3.5 transition-colors cursor-pointer flex items-start gap-2.5 ${
                            !n.isRead
                              ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/30"
                              : "hover:bg-[#FAF9F7] dark:hover:bg-[#252525]"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              !n.isRead ? "bg-blue-500" : "bg-transparent"
                            }`}
                          />
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <h4
                                className={`text-xs truncate ${
                                  !n.isRead
                                    ? "font-bold text-[#111111] dark:text-[#E6E6E5]"
                                    : "font-medium text-[#787774] dark:text-[#9B9A97]"
                                }`}
                              >
                                {localized.title}
                              </h4>
                              <span className="text-[10px] text-[#9B9A97] shrink-0 font-mono">
                                {formatRelativeTime(n.createdAt, language)}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#55534E] dark:text-[#B0AFAB] line-clamp-2 leading-relaxed">
                              {localized.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-2.5 bg-[#FAF9F7] dark:bg-[#1A1A1A] border-t border-[#EDEDEB] dark:border-[#2E2E2E] text-center">
                  <Link
                    href="/workspace/settings"
                    onClick={() => setIsOpenNotifications(false)}
                    className="text-[11px] text-[#787774] hover:text-[#111111] dark:hover:text-[#E6E6E5] font-medium"
                  >
                    {language === "fr"
                      ? "Gérer les alertes dans Paramètres →"
                      : language === "ar"
                      ? "إعدادات التنبيهات في لوحة الإعدادات ←"
                      : "Notification preferences in Settings →"}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Settings Button ── */}
        <Link
          href="/workspace/settings"
          className={`p-2 rounded-lg transition-colors ${
            pathname === "/workspace/settings"
              ? "bg-[#EBEAE7] dark:bg-[#2A2A2A] text-[#111111] dark:text-[#FFFFFF]"
              : "text-[#55534E] dark:text-[#C5C5C4] hover:text-[#111111] dark:hover:text-white hover:bg-[#F2F1EE] dark:hover:bg-[#262626]"
          }`}
          title="Workspace Settings & API Keys"
        >
          <Settings className="w-4 h-4 stroke-[1.8]" />
        </Link>

        {/* ── Theme Toggle Button ── */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[#55534E] dark:text-[#C5C5C4] hover:text-[#111111] dark:hover:text-white hover:bg-[#F2F1EE] dark:hover:bg-[#262626] transition-colors cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400 stroke-[1.8]" />
          ) : (
            <Moon className="w-4 h-4 text-[#111111] stroke-[1.8]" />
          )}
        </button>

        {/* ── User Profile Avatar ── */}
        <div className="ml-1 pl-2 border-l border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
