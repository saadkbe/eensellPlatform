"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileCode,
  Terminal,
  Activity,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Clock,
  Compass,
  MessageSquare,
  FileSpreadsheet,
  Brain,
  KeyRound,
  Filter,
  Mail,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Language } from "@/lib/translations";
import { toast } from "sonner";

interface LocalizedString {
  en: string;
  fr: string;
  ar: string;
}

interface LocalizedList {
  en: string[];
  fr: string[];
  ar: string[];
}

interface DocTopic {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  errorCode?: string;
  symptoms: LocalizedString;
  rootCause: LocalizedString;
  solution: LocalizedList;
  codeSnippet?: string;
  makeLink?: string;
}

interface DocModule {
  id: string;
  number: string;
  category: LocalizedString;
  title: LocalizedString;
  shortTitle: LocalizedString;
  description: LocalizedString;
  icon: any;
  badge?: LocalizedString;
  makeDocsUrl: string;
  topics: DocTopic[];
}

const UI_TEXT: Record<
  Language,
  {
    heroBadge: string;
    moduleCount: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    clear: string;
    modulesDirectory: string;
    guidesCount: string;
    realtimeBadge: string;
    modulePrefix: string;
    officialGuide: string;
    symptoms: string;
    rootCause: string;
    prescribedSolution: string;
    configReference: string;
    copied: string;
    copy: string;
    openOfficial: string;
    previous: string;
    next: string;
    firstModule: string;
    endOfLibrary: string;
    needHelp: string;
    needHelpSub: string;
    communityBtn: string;
    liveCallsBtn: string;
    selectModuleMobile: string;
    noResultsTitle: string;
    noResultsDesc: string;
    resetSearch: string;
  }
> = {
  en: {
    heroBadge: "Eensell Documentation Library • Make.com Technical SOPs",
    moduleCount: "7 Production Modules",
    heroTitle: "Automation Knowledge & Troubleshooting Library",
    heroSubtitle:
      "Select any module from the documentation index on the left to inspect detailed configuration steps, error codes, and verified Make.com blueprints.",
    searchPlaceholder:
      "Search all guides & error codes (e.g. Gmail OAuth, WhatsApp Token, 429, Break)...",
    clear: "Clear",
    modulesDirectory: "Modules Directory",
    guidesCount: "7 Guides",
    realtimeBadge: "Real-time blueprints verified with Make.com v2.4",
    modulePrefix: "MODULE",
    officialGuide: "Make.com Official Guide",
    symptoms: "Symptoms",
    rootCause: "Root Cause",
    prescribedSolution: "Prescribed Solution",
    configReference: "Configuration / Parameters Reference",
    copied: "Copied!",
    copy: "Copy",
    openOfficial: "Open official Make.com documentation",
    previous: "Previous",
    next: "Next",
    firstModule: "First Module",
    endOfLibrary: "End of Library",
    needHelp: "Need help debugging a complex scenario?",
    needHelpSub:
      "Share your Make blueprint JSON in the community or join the next live session for line-by-line review.",
    communityBtn: "Community",
    liveCallsBtn: "Live Calls",
    selectModuleMobile: "Select Module:",
    noResultsTitle: "No matching guides found",
    noResultsDesc:
      "Try searching for keywords like 'Gmail', 'WhatsApp', 'Break', 'Quota', or clear the search filter.",
    resetSearch: "Reset Search",
  },
  fr: {
    heroBadge: "Bibliothèque de Documentation Eensell • SOPs Techniques Make.com",
    moduleCount: "7 Modules de Production",
    heroTitle: "Base de Connaissances & Résolution des Erreurs d'Automatisation",
    heroSubtitle:
      "Sélectionnez un module dans l'index à gauche pour consulter les étapes de configuration détaillées, les codes d'erreur et les architectures Make.com vérifiées.",
    searchPlaceholder:
      "Rechercher un guide ou code d'erreur (ex. Gmail OAuth, WhatsApp Token, 429, Break)...",
    clear: "Effacer",
    modulesDirectory: "Index des Modules",
    guidesCount: "7 Guides",
    realtimeBadge: "Architectures vérifiées et conformes avec Make.com v2.4",
    modulePrefix: "MODULE",
    officialGuide: "Guide Officiel Make.com",
    symptoms: "Symptômes",
    rootCause: "Cause Racine",
    prescribedSolution: "Solution Recommandée",
    configReference: "Référence de Configuration / Paramètres",
    copied: "Copié !",
    copy: "Copier",
    openOfficial: "Consulter la documentation officielle sur Make.com",
    previous: "Précédent",
    next: "Suivant",
    firstModule: "Premier Module",
    endOfLibrary: "Fin de la Bibliothèque",
    needHelp: "Besoin d'aide pour débugger un scénario complexe ?",
    needHelpSub:
      "Partagez le JSON de votre blueprint Make dans la communauté ou rejoignez la session live pour une revue détaillée.",
    communityBtn: "Communauté",
    liveCallsBtn: "Sessions Live",
    selectModuleMobile: "Sélectionner un Module :",
    noResultsTitle: "Aucun guide correspondant trouvé",
    noResultsDesc:
      "Essayez des mots-clés comme 'Gmail', 'WhatsApp', 'Break', 'Quota', ou réinitialisez la recherche.",
    resetSearch: "Réinitialiser la recherche",
  },
  ar: {
    heroBadge: "مكتبة توثيق إنسيل • الإجراءات الفنية المعتمدة لـ Make.com",
    moduleCount: "7 وحدات تطبيقية",
    heroTitle: "مكتبة التوثيق وحلول مشاكل الأتمتة والذكاء الاصطناعي",
    heroSubtitle:
      "اختر أي وحدة من فهرس التوثيق على الجانب للاطلاع على خطوات الربط الدقيقة، معاني رموز الأخطاء، ونماذج العمل المعتمدة في Make.com.",
    searchPlaceholder:
      "ابحث في الأدلة ورموز الأخطاء (مثل Gmail OAuth, WhatsApp Token, 429, Break)...",
    clear: "مسح",
    modulesDirectory: "فهرس الوحدات",
    guidesCount: "7 أدلة شاملة",
    realtimeBadge: "مخططات مجربة ومطابقة لآخر إصدار من Make.com v2.4",
    modulePrefix: "الوحدة",
    officialGuide: "الدليل الرسمي من Make.com",
    symptoms: "الأعراض والمؤشرات",
    rootCause: "السبب الجذري للمشكلة",
    prescribedSolution: "الحل الإجرائي المعتمد",
    configReference: "إعدادات الربط والبيانات المطلوبة",
    copied: "تم النسخ!",
    copy: "نسخ",
    openOfficial: "فتح صفحة التوثيق الرسمية في Make.com",
    previous: "الوحدة السابقة",
    next: "الوحدة التالية",
    firstModule: "الوحدة الأولى",
    endOfLibrary: "نهاية المكتبة",
    needHelp: "هل تواجه خطأ برمجياً غير متوقع في السيناريو؟",
    needHelpSub:
      "شارك ملف السيناريو JSON في مجتمع إنسيل أو احضر الجلسة المباشرة الأسبوعية لمراجعتها وحلها خطوة بخطوة.",
    communityBtn: "المجتمع",
    liveCallsBtn: "الجلسات المباشرة",
    selectModuleMobile: "اختر الوحدة:",
    noResultsTitle: "لم يتم العثور على نتائج مطابقة",
    noResultsDesc:
      "جرب البحث باستخدام كلمات دلالية مثل 'Gmail', 'WhatsApp', 'Break', 'Quota' أو امسح شريط البحث.",
    resetSearch: "إعادة تعيين البحث",
  },
};

const DOC_MODULES: DocModule[] = [
  {
    id: "gmail-google-cloud",
    number: "01",
    category: {
      en: "OAuth & App Connections",
      fr: "Connexions & OAuth 2.0",
      ar: "الربط ومصادقة OAuth 2.0",
    },
    title: {
      en: "Gmail & Google Workspace: Custom Google Cloud Console OAuth App",
      fr: "Gmail & Google Workspace : Application OAuth Google Cloud Console Dédiée",
      ar: "ربط Gmail وGoogle Workspace عبر تطبيق مخصص في Google Cloud Console",
    },
    shortTitle: {
      en: "Gmail Google Cloud OAuth",
      fr: "Gmail OAuth Google Cloud",
      ar: "ربط Gmail عبر Google Cloud",
    },
    description: {
      en: "Bypass Google's strict verification blocks (Error 403: access_denied / 'This app is blocked' / 'Google hasn't verified this app') by registering your own private OAuth 2.0 Client in Google Cloud Platform.",
      fr: "Contournez les blocages de vérification Google (Erreur 403: access_denied / 'Cette application est bloquée') en créant votre propre client OAuth 2.0 dédié sur Google Cloud Platform.",
      ar: "تجاوز حظر الأمان التلقائي من جوجل (خطأ 403: access_denied أو 'هذا التطبيق غير موثق') من خلال تسجيل تطبيق OAuth 2.0 خاص بك داخل منصة Google Cloud Platform.",
    },
    icon: Mail,
    badge: {
      en: "Most Common Roadblock",
      fr: "Problème le plus fréquent",
      ar: "العائق الأكثر شيوعاً",
    },
    makeDocsUrl:
      "https://www.make.com/en/help/tutorials/connecting-to-google-services-using-a-custom-oauth-client",
    topics: [
      {
        id: "gmail-oauth-setup",
        title: {
          en: "Full Step-by-Step Google Cloud Console Setup",
          fr: "Configuration Complète Google Cloud Console Pas-à-Pas",
          ar: "الخطوات الكاملة لإعداد التطبيق في Google Cloud Console",
        },
        description: {
          en: "Register a custom Google Cloud Project and OAuth 2.0 Web Client so Make can read and send emails without shared quota restrictions or permission blocks.",
          fr: "Enregistrez un projet Google Cloud et un client Web OAuth 2.0 afin que Make puisse envoyer des emails sans quota partagé ni restriction de sécurité.",
          ar: "سجل مشروعاً جديداً ومصادقة ويب OAuth 2.0 حتى تتمكن منصة Make من قراءة وإرسال الإيميلات دون تقييد الحصص أو الحظر.",
        },
        errorCode: "GOOGLE OAUTH 403 • ACCESS_DENIED",
        symptoms: {
          en: "Connecting Gmail in Make fails with 'Access blocked: This app has not been verified by Google' or connections disconnect every 7 days.",
          fr: "La connexion Gmail dans Make échoue avec 'Accès bloqué : Cette application n'a pas été validée par Google' ou se déconnecte tous les 7 jours.",
          ar: "فشل ربط حساب Gmail في Make وظهور رسالة 'تم حظر الوصول: لم يتم التحقق من هذا التطبيق بواسطة Google' أو انقطاع الربط كل 7 أيام.",
        },
        rootCause: {
          en: "Google classifies Gmail scopes as 'Restricted Sensitive'. Make's default shared client has global quota caps, requiring users to supply their own Client ID & Secret from Google Cloud Console.",
          fr: "Google classe les autorisations Gmail comme sensibles. Le connecteur public de Make sature ses quotas, nécessitant l'utilisation de vos propres identifiants Client ID & Secret.",
          ar: "تصنف جوجل صلاحيات Gmail كصلاحيات حساسة ومقيدة. التطبيق الافتراضي المشترك لمنصة Make يتجاوز حد الاستخدام الأقصى، مما يتطلب توليد Client ID وSecret خاصين بك.",
        },
        solution: {
          en: [
            "Step 1: Go to console.cloud.google.com and click 'New Project' (e.g. 'Make Agency Automation').",
            "Step 2: In the left sidebar, navigate to 'APIs & Services > Library', search for 'Gmail API', and click 'Enable'. (Also enable Google Sheets API & Google Drive API if needed).",
            "Step 3: Go to 'APIs & Services > OAuth consent screen', select User Type 'External' (or 'Internal' if on Google Workspace), fill in App Name & Support Email, and click Save.",
            "Step 4: Under 'Test Users', click 'Add Users' and input your Gmail address.",
            "Step 5 (CRITICAL TO PREVENT 7-DAY EXPIRY): Click 'Publish App' to transition publishing status from 'Testing' to 'In Production'. (For personal automation apps, Google does not force audit verification).",
            "Step 6: Go to 'APIs & Services > Credentials', click '+ Create Credentials > OAuth client ID', select Application Type 'Web application'.",
            "Step 7: Under 'Authorized redirect URIs', click 'Add URI' and add: https://www.integromat.com/oauth/cb/google-custom AND https://www.make.com/oauth/cb/google-custom",
            "Step 8: In Make, add a Gmail module, click 'Create a connection', check 'Show advanced settings', paste your Client ID and Client Secret, and bypass the warning by clicking 'Advanced > Go to App (unsafe)'.",
          ],
          fr: [
            "Étape 1 : Ouvrez console.cloud.google.com et cliquez sur 'Nouveau projet' (ex. 'Make Agency Automation').",
            "Étape 2 : Dans le menu gauche, allez sur 'API et services > Bibliothèque', cherchez 'Gmail API', et cliquez sur 'Activer'. (Activez aussi Google Sheets API et Drive si nécessaire).",
            "Étape 3 : Allez sur 'Écran de consentement OAuth', choisissez 'Externe', renseignez le nom de l'application et votre email de support, puis enregistrez.",
            "Étape 4 : Dans la section 'Utilisateurs test', cliquez sur 'Ajouter des utilisateurs' et saisissez votre adresse Gmail.",
            "Étape 5 (ESSENTIEL POUR ÉVITER L'EXPIRATION DE 7 JOURS) : Cliquez sur 'Publier l'application' pour passer du statut 'Test' à 'En production'.",
            "Étape 6 : Allez sur 'Identifiants', cliquez sur '+ Créer des identifiants > ID client OAuth', et sélectionnez 'Application Web'.",
            "Étape 7 : Sous 'URI de redirection autorisés', ajoutez : https://www.integromat.com/oauth/cb/google-custom ET https://www.make.com/oauth/cb/google-custom",
            "Étape 8 : Dans Make, ajoutez le module Gmail, cochez 'Afficher les paramètres avancés', collez vos Client ID & Secret, puis validez en cliquant sur 'Paramètres avancés > Accéder à l'application (non sécurisé)'.",
          ],
          ar: [
            "الخطوة 1: ادخل إلى console.cloud.google.com واضغط على 'New Project' وسمه باسم وكالتك.",
            "الخطوة 2: من القائمة الجانبية اختر 'APIs & Services > Library' وابحث عن 'Gmail API' واضغط 'Enable'. (قم بتفعيل Google Sheets أيضاً).",
            "الخطوة 3: انتقل إلى 'OAuth consent screen' واختر 'External'، ثم أدخل اسم التطبيق وإيميل الدعم الفني واضغط Save.",
            "الخطوة 4: في قسم 'Test Users'، اضغط 'Add Users' وأدخل بريدك الإلكتروني الشخصي في Gmail.",
            "الخطوة 5 (مهم جداً لمنع انتهاء الجلسة كل 7 أيام): اضغط على زر 'PUBLISH APP' لتغيير حالة التطبيق من 'Testing' إلى 'In Production'.",
            "الخطوة 6: اذهب إلى 'Credentials' واضغط '+ Create Credentials > OAuth client ID' واختر النوع 'Web application'.",
            "الخطوة 7: في خانة 'Authorized redirect URIs' أضف الرابطين: https://www.integromat.com/oauth/cb/google-custom و https://www.make.com/oauth/cb/google-custom",
            "الخطوة 8: في منصة Make افتح وحدة Gmail واضغط 'Create a connection' وفعل خيار 'Show advanced settings' والصق Client ID وClient Secret.",
          ],
        },
        codeSnippet: `// Authorized Redirect URIs for Google Cloud Console:
https://www.integromat.com/oauth/cb/google-custom
https://www.make.com/oauth/cb/google-custom`,
        makeLink:
          "https://www.make.com/en/help/tutorials/connecting-to-google-services-using-a-custom-oauth-client",
      },
    ],
  },
  {
    id: "whatsapp-meta-token",
    number: "02",
    category: {
      en: "OAuth & App Connections",
      fr: "Connexions & OAuth 2.0",
      ar: "الربط ومصادقة OAuth 2.0",
    },
    title: {
      en: "WhatsApp Cloud API: Meta System User Permanent Token",
      fr: "WhatsApp Cloud API : Jeton Permanent via Meta System User",
      ar: "واجهة واتساب السحابية: استخراج توكن دائم عبر Meta System User",
    },
    shortTitle: {
      en: "WhatsApp System User Token",
      fr: "WhatsApp Token Permanent",
      ar: "توكن واتساب الدائم",
    },
    description: {
      en: "Stop WhatsApp automations from breaking every 24 hours by creating a dedicated Meta System User with a never-expiring access token.",
      fr: "Empêchez vos scénarios WhatsApp de se déconnecter toutes les 24 heures en créant un System User dédié avec un jeton d'accès sans expiration.",
      ar: "تخلص من مشكلة انقطاع اتصال واتساب كل 24 ساعة من خلال إنشاء مستخدم نظام (System User) داخل فيسبوك لتوليد توكن دائم لا ينتهي أبداً.",
    },
    icon: MessageSquare,
    badge: {
      en: "24h Expiry Fix",
      fr: "Résolution Expiration 24h",
      ar: "حل انتهاء صلاحية 24 ساعة",
    },
    makeDocsUrl:
      "https://www.make.com/en/help/apps/communication/whatsapp-business-cloud",
    topics: [
      {
        id: "meta-system-user-setup",
        title: {
          en: "Permanent System User Access Token Blueprint",
          fr: "Génération du Jeton d'Accès Permanent System User",
          ar: "طريقة استخراج توكن وصول دائم عبر مستخدم النظام",
        },
        description: {
          en: "Generate a permanent token with whatsapp_business_messaging and management scopes so scenarios run uninterrupted forever.",
          fr: "Générez un jeton permanent avec les permissions requises pour que vos scénarios s'exécutent en continu sans coupure.",
          ar: "توليد مفتاح وصول بصلاحيات المراسلة وإدارة الأعمال ليعمل السيناريو طوال الوقت دون توقف مفاجئ.",
        },
        errorCode: "META ERROR 190 • TOKEN EXPIRED",
        symptoms: {
          en: "WhatsApp messages send successfully on day 1, but fail on day 2 with 'Authentication failure / Session expired / Error 190'.",
          fr: "Les messages WhatsApp partent le premier jour, puis échouent le lendemain avec 'Échec d'authentification / Session expirée / Error 190'.",
          ar: "إرسال رسائل واتساب ينجح في اليوم الأول فقط، ثم يفشل في اليوم التالي مع رسالة 'Error 190: Session expired'.",
        },
        rootCause: {
          en: "Developers copy the 24-hour temporary access token from Meta App Dashboard > WhatsApp > API Setup instead of generating a permanent token via a System User.",
          fr: "Le développeur copie le jeton temporaire de 24h depuis le tableau de bord Meta au lieu de générer un jeton permanent via les paramètres d'entreprise.",
          ar: "يقوم المستخدم بنسخ التوكن المؤقت (الذي مدته 24 ساعة فقط) من لوحة تحكم مطوري فيسبوك بدلاً من توليد توكن دائم عبر إعدادات الأعمال.",
        },
        solution: {
          en: [
            "Step 1: Open Meta Business Suite Settings at business.facebook.com/settings.",
            "Step 2: Under 'Users', click 'System Users' > 'Add', enter a username (e.g. 'Make-Automation-Admin'), and select Role: 'Admin'.",
            "Step 3: Click 'Add Assets' on your System User. Under 'Apps', select your Meta App and toggle 'Full Control'. Under 'WhatsApp Accounts', select your WABA and grant 'Full Control'.",
            "Step 4: Click 'Generate New Token', select your Meta App, and check permissions: whatsapp_business_messaging, whatsapp_business_management, and business_management.",
            "Step 5: Set Token Expiry to 'Never' and click Generate Token. Immediately copy and store the token safely.",
            "Step 6 (CRITICAL PAYMENT REQUIREMENT): In WhatsApp Business Manager, you MUST add a valid Credit Card under Payment Settings, otherwise Meta will reject outgoing template messages even within the free tier.",
            "Step 7: In Make, add WhatsApp Business Cloud module, click 'Create a connection', and paste your Permanent System User Token along with your Phone Number ID and WABA ID.",
          ],
          fr: [
            "Étape 1 : Ouvrez les Paramètres de Meta Business Suite sur business.facebook.com/settings.",
            "Étape 2 : Sous 'Utilisateurs', cliquez sur 'Utilisateurs système' > 'Ajouter', nommez-le (ex. 'Make-Admin') et choisissez le rôle 'Administrateur'.",
            "Étape 3 : Cliquez sur 'Attribuer des actifs'. Sous 'Applications', sélectionnez votre application Meta et cochez 'Contrôle total'. Sous 'Comptes WhatsApp', attribuez également le contrôle total.",
            "Étape 4 : Cliquez sur 'Générer un nouveau jeton', sélectionnez votre application et cochez : whatsapp_business_messaging, whatsapp_business_management, et business_management.",
            "Étape 5 : Choisissez l'expiration 'Jamais' et générez le jeton. Copiez-le immédiatement.",
            "Étape 6 (OBLIGATION DE PAIEMENT) : Dans le gestionnaire WhatsApp, vous DEVEZ ajouter une carte bancaire valide dans les paramètres de paiement, sinon Meta bloquera l'envoi de templates même pendant les quotas gratuits.",
            "Étape 7 : Dans Make, ajoutez le module WhatsApp Business Cloud, collez votre jeton permanent, votre Phone Number ID et votre WABA ID.",
          ],
          ar: [
            "الخطوة 1: ادخل إلى إعدادات Meta Business Suite عبر الرابط business.facebook.com/settings.",
            "الخطوة 2: من قسم 'Users' اختر 'System Users' واضغط 'Add' وسمه 'Make-Admin' وحدد الدور 'Admin'.",
            "الخطوة 3: اضغط 'Add Assets' وحدد تطبيق فيسبوك وحساب واتساب وفعل خيار 'Full Control'.",
            "الخطوة 4: اضغط 'Generate New Token' وحدد التطبيق وعلم على الصلاحيات الثلاث: whatsapp_business_messaging و whatsapp_business_management و business_management.",
            "الخطوة 5: حدد مدة الصلاحية على 'Never' واضغط توليد وانسخ التوكن فوراً واحفظه.",
            "الخطوة 6 (مهم جداً): يجب إضافة بطاقة بنكية صالحة في إعدادات الدفع بحساب واتساب التجاري، وإلا سترفض ميتا إرسال أي رسالة قالب.",
            "الخطوة 7: في Make اختر وحدة WhatsApp Business Cloud والصق التوكن الدائم مع Phone Number ID و WABA ID.",
          ],
        },
        codeSnippet: `// Required Meta Permissions for System User:
whatsapp_business_messaging
whatsapp_business_management
business_management`,
        makeLink:
          "https://www.make.com/en/help/apps/communication/whatsapp-business-cloud",
      },
    ],
  },
  {
    id: "error-directives",
    number: "03",
    category: {
      en: "Core Reliability",
      fr: "Fiabilité & Robustesse",
      ar: "استقرار الأنظمة ومعالجة الأخطاء",
    },
    title: {
      en: "The 5 Error Handling Directives in Make.com",
      fr: "Les 5 Directives de Gestion d'Erreurs dans Make.com",
      ar: "التوجيهات الخمسة للتعامل مع الأخطاء في Make.com",
    },
    shortTitle: {
      en: "5 Error Handling Directives",
      fr: "5 Directives de Gestion d'Erreurs",
      ar: "توجيهات معالجة الأخطاء (5)",
    },
    description: {
      en: "Master Make's built-in error handling directives to prevent scenarios from crashing, recover from temporary API failures, and maintain atomic data integrity.",
      fr: "Maîtrisez les directives natives de Make pour empêcher vos scénarios de crasher, récupérer automatiquement des pannes API et préserver l'intégrité de vos données.",
      ar: "احترف استخدام توجيهات الأخطاء في Make.com لمنع توقف السيناريوهات، وإعادة المحاولة التلقائية عند تعطل الخوادم وحماية سلامة قواعد البيانات.",
    },
    icon: ShieldAlert,
    badge: {
      en: "Essential Architecture",
      fr: "Architecture Fondamentale",
      ar: "أساسيات الهندسة البرمجية",
    },
    makeDocsUrl:
      "https://www.make.com/en/help/errors/error-handling-directives",
    topics: [
      {
        id: "directive-ignore",
        title: {
          en: "1. Ignore (Skip Failed Bundle)",
          fr: "1. Ignore (Ignorer le Bundle en Échec)",
          ar: "1. Ignore (تجاهل الخطأ ومتابعة التشغيل)",
        },
        description: {
          en: "Tells the scenario to completely disregard the error on this module, discard the failed bundle, and continue processing any subsequent bundles normally. The run concludes with a success status.",
          fr: "Indique au scénario d'ignorer complètement l'erreur, de passer le bundle défaillant et de poursuivre normalement le traitement des bundles suivants.",
          ar: "يوجه النظام لتجاهل الخطأ الواقع في هذه الوحدة وتخطي العنصر الحالي ومواصلة تنفيذ باقي العناصر بنجاح دون إيقاف السيناريو.",
        },
        errorCode: "DIRECTIVE: IGNORE",
        symptoms: {
          en: "An optional enrichment step (like fetching a profile avatar or sending a non-critical notification) fails and stops the entire pipeline.",
          fr: "Une étape optionnelle (comme récupérer la photo de profil ou envoyer un log secondaire) plante et stoppe l'ensemble du scénario.",
          ar: "فشل خطوة ثانوية اختيارية (مثل جلب صورة بروفايل أو إشعار غير أساسي) مما يؤدي لتوقف كامل لعملية تسجيل العميل.",
        },
        rootCause: {
          en: "By default, any unhandled error triggers a Rollback or scenario halt. Using Ignore prevents optional steps from terminating critical customer operations.",
          fr: "Par défaut, toute erreur non gérée interrompt le scénario. La directive Ignore évite qu'une étape facultative n'annule une opération critique.",
          ar: "الوضع الافتراضي في Make هو إيقاف السيناريو بالكامل عند وقوع أي خطأ. يساعد Ignore على عزل الخطوات غير الأساسية.",
        },
        solution: {
          en: [
            "Right-click the failing module in Make and click 'Add error handler'.",
            "Select the 'Ignore' directive from the list.",
            "Best practice: Use only on non-vital modules where missing output data won't crash downstream modules.",
          ],
          fr: [
            "Faites un clic droit sur le module concerné dans Make et cliquez sur 'Add error handler'.",
            "Sélectionnez la directive 'Ignore'.",
            "Bonne pratique : Réservez cette directive aux modules secondaires dont l'absence de résultat n'affecte pas la suite.",
          ],
          ar: [
            "انقر بزر الفأرة الأيمن على الوحدة واختر 'Add error handler'.",
            "اختر التوجيه 'Ignore' من القائمة.",
            "أفضل ممارسة: استعمل هذا التوجيه فقط في الخطوات الاختيارية التي لا تعتمد عليها الوحدات اللاحقة.",
          ],
        },
        makeLink:
          "https://www.make.com/en/help/errors/error-handling-directives#ignore",
      },
      {
        id: "directive-resume",
        title: {
          en: "2. Resume (Substitute Fallback Values)",
          fr: "2. Resume (Remplacement par Valeur de Secours)",
          ar: "2. Resume (استبدال القيمة بقيمة افتراضية)",
        },
        description: {
          en: "Catches the error and substitutes the failed module's output with predefined default values so downstream modules receive valid inputs without crashing.",
          fr: "Intercepte l'erreur et remplace la sortie du module défaillant par des valeurs par défaut afin que les modules suivants continuent de fonctionner.",
          ar: "يلتقط الخطأ ويعوض مخرجات الوحدة بقيم افتراضية محددة مسبقاً، حتى تتلقى الوحدات اللاحقة بيانات صالحة ولا يتوقف السيناريو.",
        },
        errorCode: "DIRECTIVE: RESUME",
        symptoms: {
          en: "A database lookup (e.g., Search Customer) returns an error or 404, causing downstream modules that depend on 'customer.id' to fail.",
          fr: "Une recherche en base de données (ex. Chercher Client) renvoie un 404, provoquant l'échec des modules suivants qui attendent un 'customer.id'.",
          ar: "عملية بحث عن عميل تعود بخطأ 404، مما يتسبب في فشل الوحدات اللاحقة التي تعتمد على رقم العميل أو اسمه.",
        },
        rootCause: {
          en: "Downstream modules require specific variable mappings. If the primary module fails, Resume provides dummy/default fields.",
          fr: "Les modules en aval exigent des variables précises. Si le module échoue, Resume injecte des valeurs de repli (ex. status: 'invité').",
          ar: "تتطلب الوحدات التالية متغيرات معينة. إذا فشلت الوحدة الأولى فإن Resume يوفر قيماً بديلة (مثل: عميل جديد أو غير معروف).",
        },
        solution: {
          en: [
            "Attach an Error Handler route to the module.",
            "Add the 'Resume' directive.",
            "Fill in the expected output fields with sensible defaults or empty strings.",
          ],
          fr: [
            "Ajoutez une branche de gestion d'erreur au module.",
            "Sélectionnez la directive 'Resume'.",
            "Remplissez les champs de sortie attendus avec des valeurs par défaut cohérentes.",
          ],
          ar: [
            "أضف مسار معالجة أخطاء للوحدة.",
            "اختر التوجيه 'Resume'.",
            "أدخل قيماً افتراضية للمتغيرات المتوقعة لضمان استمرار عمل الوحدات التالية بسلاسة.",
          ],
        },
        makeLink:
          "https://www.make.com/en/help/errors/error-handling-directives#resume",
      },
      {
        id: "directive-break",
        title: {
          en: "3. Break (Automatic Retry & Backoff)",
          fr: "3. Break (Réessais Automatiques & File d'Attente)",
          ar: "3. Break (إعادة المحاولة التلقائية مع الفاصل الزمني)",
        },
        description: {
          en: "Halts the current execution of the failed bundle, stores it in Incomplete Executions, and automatically schedules retries using an exponential backoff interval.",
          fr: "Met en pause le bundle défaillant, le stocke dans les exécutions incomplètes et planifie des réessais automatiques avec un intervalle d'attente.",
          ar: "يوقف تنفيذ العنصر المتعثر ويحفظه في قائمة المعالجات المعلقة (Incomplete Executions) ويعيد المحاولة تلقائياً بعد فترة زمنية محددة.",
        },
        errorCode: "DIRECTIVE: BREAK",
        symptoms: {
          en: "Scenario fails due to temporary third-party API downtime, network dropouts, or HTTP 429 Too Many Requests rate limits.",
          fr: "Le scénario échoue en raison d'une panne temporaire du serveur distant ou d'un dépassement de quota (HTTP 429).",
          ar: "فشل السيناريو بسبب تعطل مؤقت في سيرفر الخدمة الخارجية أو تجاوز معدل الطلبات المسموح بها (HTTP 429).",
        },
        rootCause: {
          en: "Temporary server glitches or quota exhaustion that will resolve itself after a brief cool-off period.",
          fr: "Problème transitoire qui se résout généralement après quelques minutes de pause.",
          ar: "مشاكل مؤقتة في الشبكة أو تجاوز مؤقت للكوتا تنتهي بمجرد مرور دقائق معدودة.",
        },
        solution: {
          en: [
            "Attach an Error Handler to the API/HTTP module and select 'Break'.",
            "Set 'Number of attempts' (recommended: 3 to 5 attempts).",
            "Set 'Interval between attempts' (recommended: 5 to 15 minutes).",
            "Enable 'Automatically resolve' so successful retries clear the queue without manual admin intervention.",
          ],
          fr: [
            "Attachez un gestionnaire d'erreur et choisissez 'Break'.",
            "Réglez le nombre de tentatives (recommandé : 3 à 5 tentatives).",
            "Définissez l'intervalle entre les essais (recommandé : 5 à 15 minutes).",
            "Activez 'Automatically resolve' pour nettoyer automatiquement la file après succès.",
          ],
          ar: [
            "أضف معالج أخطاء للوحدة واختر 'Break'.",
            "حدد عدد المحاولات (الموصى به: 3 إلى 5 محاولات).",
            "حدد الفاصل الزمني بين كل محاولة (الموصى به: 5 إلى 15 دقيقة).",
            "فعل خيار 'Automatically resolve' ليتم إتمام العملية تلقائياً عند نجاح المحاولة.",
          ],
        },
        makeLink:
          "https://www.make.com/en/help/errors/error-handling-directives#break",
      },
    ],
  },
  {
    id: "error-types",
    number: "04",
    category: {
      en: "Troubleshooting Matrix",
      fr: "Matrice de Dépannage",
      ar: "مصفوفة حلول الأخطاء الشائعة",
    },
    title: {
      en: "Common Make.com Error Types & HTTP Codes",
      fr: "Types d'Erreurs Fréquents dans Make & Codes HTTP",
      ar: "أشهر أنواع أخطاء Make.com وأكواد HTTP",
    },
    shortTitle: {
      en: "Common Error Types (429, 400)",
      fr: "Erreurs Fréquentes (429, 400)",
      ar: "أنواع الأخطاء الشائعة (429, 400)",
    },
    description: {
      en: "Deep dive into the most common error types in Make scenarios and how to resolve them systematically.",
      fr: "Analyse approfondie des erreurs les plus fréquentes dans les scénarios Make et méthode de résolution systématique.",
      ar: "دليل شامل لأكثر الأخطاء تكراراً في سيناريوهات Make وطرق معالجتها بدقة واحترافية.",
    },
    icon: AlertTriangle,
    badge: {
      en: "Error Reference",
      fr: "Guide des Erreurs",
      ar: "مرجع الأكواد",
    },
    makeDocsUrl: "https://www.make.com/en/help/errors/types-of-errors",
    topics: [
      {
        id: "err-rate-limit",
        title: {
          en: "RateLimitError (HTTP 429 Too Many Requests)",
          fr: "RateLimitError (HTTP 429 Trop de Requêtes)",
          ar: "خطأ تجاوز المعدل RateLimitError (HTTP 429)",
        },
        description: {
          en: "Triggered when your scenario exceeds the maximum number of requests allowed by an external API within a specific time window.",
          fr: "Déclenché lorsque votre scénario dépasse le plafond de requêtes autorisé par une API distante dans un intervalle de temps donné.",
          ar: "يحدث عندما يتجاوز السيناريو الحد الأقصى المسموح به من الطلبات في الدقيقة لدى المنصة الخارجية المستهدفة.",
        },
        errorCode: "HTTP 429 • RateLimitError",
        symptoms: {
          en: "Scenario works on single test runs, but crashes during batch operations or when processing multiple leads concurrently.",
          fr: "Le scénario fonctionne sur un test isolé, mais plante lors des traitements par lots ou lors de l'arrivée simultanée de plusieurs prospects.",
          ar: "يعمل السيناريو بنجاح في التجارب الفردية، لكنه يتوقف فور وصول عدد كبير من العملاء أو معالجة الدفعات المجمعة.",
        },
        rootCause: {
          en: "OpenAI token-per-minute (TPM) limits, Google Sheets 300 requests/min quota, or CRM API thresholds exceeded.",
          fr: "Dépassement du quota OpenAI (TPM/RPM), quota Google Sheets (300 requêtes/min) ou restrictions du CRM.",
          ar: "تجاوز حد الكلمات في الدقيقة لدى OpenAI أو تجاوز حد 300 طلب في الدقيقة في Google Sheets.",
        },
        solution: {
          en: [
            "1. Attach a 'Break' directive to retry after 5 minutes.",
            "2. Add a 'Tools > Sleep' module with a 1000-2000ms delay between consecutive loops.",
            "3. In Scenario Settings, set 'Max number of cycles' or reduce scheduling frequency.",
          ],
          fr: [
            "1. Attachez une directive 'Break' pour réessayer après 5 minutes.",
            "2. Insérez un module 'Tools > Sleep' avec un délai de 1000 à 2000 ms entre chaque cycle.",
            "3. Dans les paramètres du scénario, limitez le nombre maximal de cycles simultanés.",
          ],
          ar: [
            "1. اربط توجيه 'Break' لإعادة المحاولة بعد 5 دقائق.",
            "2. أضف وحدة 'Tools > Sleep' بفاصل زمني من 1 إلى 2 ثانية بين كل دورة تكرار.",
            "3. في إعدادات السيناريو حدد الحد الأقصى للدورات المتزامنة.",
          ],
        },
        makeLink:
          "https://www.make.com/en/help/errors/types-of-errors#ratelimiterror",
      },
    ],
  },
  {
    id: "webhooks-mastery",
    number: "05",
    category: {
      en: "Webhooks & APIs",
      fr: "Webhooks & APIs",
      ar: "خطافات الويب والواجهات البرمجية",
    },
    title: {
      en: "Webhooks, Instant Triggers & Custom Responses",
      fr: "Webhooks, Déclencheurs Instantanés & Réponses Personnalisées",
      ar: "خطافات الويب (Webhooks) والاستجابات الفورية المخصصة",
    },
    shortTitle: {
      en: "Webhooks & Instant Responses",
      fr: "Webhooks & Réponses Instantanées",
      ar: "الويب هوك والاستجابات الفورية",
    },
    description: {
      en: "Configure custom webhooks, enforce strict JSON schemas to block invalid requests, and return custom HTTP 200/400 responses.",
      fr: "Configurez des webhooks personnalisés, appliquez des schémas JSON stricts pour bloquer les requêtes invalides et renvoyez des codes HTTP 200/400 sur mesure.",
      ar: "إعداد خطافات الويب المخصصة وتطبيق التحقق من صحة هياكل JSON لمنع استهلاك العمليات في الطلبات الخاطئة وإرجاع أكواد 200 و400 مخصصة.",
    },
    icon: Zap,
    badge: {
      en: "Webhooks Architecture",
      fr: "Architecture Webhook",
      ar: "هندسة الويب هوك",
    },
    makeDocsUrl: "https://www.make.com/en/help/tools/webhooks",
    topics: [
      {
        id: "webhook-schema-validation",
        title: {
          en: "Custom Webhook Schema Validation (Auto 400 Rejection)",
          fr: "Validation de Schéma Webhook (Rejet Automatique 400)",
          ar: "التحقق التلقائي من بنية بيانات الويب هوك (رفض بكود 400)",
        },
        description: {
          en: "Protect your scenario execution credits by automatically rejecting malformed payloads before execution starts.",
          fr: "Protégez vos crédits d'opérations en rejetant automatiquement les requêtes incomplètes avant même le début du scénario.",
          ar: "وفر استهلاك باقة Make الخاصة بك من خلال الرفض التلقائي لأي إرسال غير مطابق للمواصفات دون احتساب أي عملية تشغيل.",
        },
        errorCode: "DATA STRUCTURE VALIDATION",
        symptoms: {
          en: "Invalid lead submissions, bot spam, or missing phone numbers consuming scenario operations.",
          fr: "Des soumissions incomplètes de formulaires ou des spams de bots consomment vos opérations inutilement.",
          ar: "استمارات عملاء ناقصة أو هجمات سبام تستهلك رصيد العمليات بالسيناريو.",
        },
        rootCause: {
          en: "By default, Custom Webhooks accept any payload and return 200 Accepted regardless of data quality.",
          fr: "Par défaut, un webhook Make accepte n'importe quelle donnée et renvoie un 200 sans vérifier la présence des champs obligatoires.",
          ar: "يقبل الويب هوك في وضعه الافتراضي أي بيانات واردة ويعطي كود 200 دون التحقق من وجود رقم الهاتف أو الاسم.",
        },
        solution: {
          en: [
            "In the Custom Webhook configuration, click 'Add' under 'Data structure'.",
            "Define required fields: name (Text, required), phone (Text, required).",
            "Make will automatically reject non-compliant requests with HTTP 400 Bad Request at zero operation cost.",
          ],
          fr: [
            "Dans la configuration du Webhook personnalisé, cliquez sur 'Add' sous 'Data structure'.",
            "Définissez les champs requis : name (Text, obligatoire), phone (Text, obligatoire).",
            "Make rejettera automatiquement les requêtes incomplètes avec une erreur HTTP 400 sans consommer d'opération.",
          ],
          ar: [
            "في إعدادات الويب هوك، اضغط على 'Add' تحت قسم 'Data structure'.",
            "حدد الحقول الإلزامية مثل: الاسم ورقم الهاتف.",
            "ستقوم Make تلقائياً برفض الطلبات الناقصة بكود HTTP 400 دون خصم أي رصيد تشغيل.",
          ],
        },
        codeSnippet: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "leadName": { "type": "string" },
    "phoneNumber": { "type": "string" },
    "budget": { "type": "number" }
  },
  "required": ["leadName", "phoneNumber"]
}`,
        makeLink: "https://www.make.com/en/help/tools/data-structures",
      },
    ],
  },
  {
    id: "openai-troubleshooting",
    number: "06",
    category: {
      en: "AI Integration",
      fr: "Intelligence Artificielle",
      ar: "تطبيقات الذكاء الاصطناعي",
    },
    title: {
      en: "OpenAI & GPT-4o Troubleshooting in Make.com",
      fr: "Résolution des Erreurs OpenAI & GPT-4o dans Make.com",
      ar: "حل مشاكل ربط OpenAI وGPT-4o في Make.com",
    },
    shortTitle: {
      en: "OpenAI & GPT-4o Troubleshooting",
      fr: "Dépannage OpenAI & GPT-4o",
      ar: "حل مشاكل OpenAI وGPT-4o",
    },
    description: {
      en: "Solve API key invalidations, rate limits, token quotas, and JSON format parsing issues in Make's OpenAI modules.",
      fr: "Résolvez les rejets de clés API, les limites de débit, les quotas de crédits et les erreurs de parsing JSON dans les modules OpenAI.",
      ar: "علاج أخطاء مفاتيح الربط، حدود الكلمات، نفاد الرصيد المالي المسبق، ومشاكل تحليل بيانات JSON الصادرة من نماذج GPT-4o.",
    },
    icon: Brain,
    badge: {
      en: "AI Engineering",
      fr: "Ingénierie IA",
      ar: "هندسة الذكاء الاصطناعي",
    },
    makeDocsUrl:
      "https://www.make.com/en/help/apps/ai/openai--chatgpt--dall-e--whisper-",
    topics: [
      {
        id: "openai-quota-429",
        title: {
          en: "OpenAI 429: You exceeded your current quota",
          fr: "OpenAI 429 : Quota Actuel Dépassé (Crédit Épuisé)",
          ar: "خطأ OpenAI 429: نفاد الرصيد المالي المسبق",
        },
        description: {
          en: "Occurs when your OpenAI platform credit balance is depleted or your organization payment card has failed.",
          fr: "Se produit lorsque le solde prépayé sur la plateforme OpenAI Developer est à 0$ ou que la carte bancaire a été rejetée.",
          ar: "يحدث عندما يصبح رصيدك في منصة مطوري OpenAI مساوياً لصفر أو تفشل عملية شحن الرصيد التلقائي.",
        },
        errorCode: "HTTP 429 • Insufficient Quota",
        symptoms: {
          en: "Scenario fails instantly on the 'Create a Completion' or 'Create a Chat' module.",
          fr: "Le scénario plante immédiatement sur le module OpenAI avec l'erreur 'insufficient_quota'.",
          ar: "توقف السيناريو فور الوصول لوحدة الدردشة أو توليد النصوص مع ظهور خطأ insufficient_quota.",
        },
        rootCause: {
          en: "OpenAI API billing is prepaid and separate from ChatGPT Plus subscriptions. A $0.00 credit balance throws a 429 error.",
          fr: "La facturation de l'API OpenAI est prépayée et totalement distincte de l'abonnement ChatGPT Plus (20$/mois). Un solde à 0$ déclenche ce blocage.",
          ar: "حساب واجهة OpenAI API مسبق الدفع ومنفصل تماماً عن اشتراك ChatGPT Plus الشهري. الرصيد صفر دولار يسبب هذا التوقف.",
        },
        solution: {
          en: [
            "1. Open platform.openai.com/account/billing and add at least $5-$10 in prepaid credit.",
            "2. Enable 'Auto-recharge' so automations never stall when balance dips below $5.",
            "3. Verify your organization limit tier (Tier 1, Tier 2, etc.) for RPM allowances.",
          ],
          fr: [
            "1. Rendez-vous sur platform.openai.com/account/billing et rechargez au moins 5$ à 10$.",
            "2. Activez 'Auto-recharge' pour que votre compte se recharge automatiquement sous le seuil de 5$.",
            "3. Vérifiez le palier de votre organisation (Tier 1, Tier 2) pour connaître votre limite de requêtes par minute.",
          ],
          ar: [
            "1. ادخل إلى platform.openai.com/account/billing واشحن رصيداً بقيمة 5 أو 10 دولارات.",
            "2. فعل خيار 'Auto-recharge' ليتم الشحن التلقائي عند انخفاض الرصيد عن 5 دولارات.",
            "3. تحقق من تصنيف حسابك (Tier 1 أو Tier 2) لمعرفة حد الكلمات المسموح بها في الدقيقة.",
          ],
        },
        makeLink: "https://platform.openai.com/docs/guides/error-codes",
      },
    ],
  },
  {
    id: "sheets-database",
    number: "07",
    category: {
      en: "Data Stores",
      fr: "Bases de Données",
      ar: "قواعد البيانات وجداول البيانات",
    },
    title: {
      en: "Google Sheets Concurrency Locks & Duplicate Prevention",
      fr: "Google Sheets : Verrous de Concurrence & Doublons",
      ar: "جداول بيانات جوجل: منع تداخل العمليات وتكرار الصفوف",
    },
    shortTitle: {
      en: "Google Sheets Concurrency",
      fr: "Concurrence Google Sheets",
      ar: "تزامن جداول بيانات جوجل",
    },
    description: {
      en: "Eliminate duplicate row insertions and race conditions when multiple leads trigger automations simultaneously.",
      fr: "Éliminez les insertions de doublons et les conflits de concurrence lorsque plusieurs leads arrivent simultanément.",
      ar: "حل مشكلة الكتابة فوق الصفوف القديمة وتكرار البيانات عند تسجيل أكثر من عميل في نفس الثانية.",
    },
    icon: FileSpreadsheet,
    badge: {
      en: "Database Consistency",
      fr: "Intégrité des Données",
      ar: "سلامة البيانات",
    },
    makeDocsUrl: "https://www.make.com/en/help/apps/productivity/google-sheets",
    topics: [
      {
        id: "sheets-race-condition",
        title: {
          en: "Race Conditions: Parallel Bundles Overwriting Rows",
          fr: "Conflit de Concurrence : Écrasement des Lignes en Parallèle",
          ar: "تداخل العمليات: الكتابة فوق الصفوف عند التزامن",
        },
        description: {
          en: "When two webhooks trigger at the exact same millisecond, both read the same 'last row' and overwrite each other.",
          fr: "Lorsque deux requêtes arrivent à la même milliseconde, elles lisent la même 'dernière ligne vide' et s'écrasent mutuellement.",
          ar: "عند وصول عميلين في نفس اللحظة، تقرأ كلا العمليتين نفس الصف الفارغ، مما يؤدي لمسح بيانات العميل الأول وتسجيل الثاني مكانه.",
        },
        errorCode: "CONCURRENCY OVERWRITE",
        symptoms: {
          en: "Lead #14 and Lead #15 are saved into Row 42, erasing Lead #14 permanently.",
          fr: "Le client 14 et le client 15 s'enregistrent sur la même ligne 42, effaçant définitivement le client 14.",
          ar: "تسجيل بيانات العميلين رقم 14 و 15 في نفس الصف رقم 42 ومسح بيانات العميل الأول.",
        },
        rootCause: {
          en: "Google Sheets API is non-transactional. Simultaneous queries read the same empty row before the write commit completes.",
          fr: "L'API Google Sheets n'est pas transactionnelle. Les requêtes parallèles lisent la même ligne avant la validation de l'écriture.",
          ar: "واجهة Google Sheets ليست قاعدة بيانات متسلسلة المعاملات، فالعمليات المتزامنة تقرأ نفس السطر قبل اكتمال الحفظ.",
        },
        solution: {
          en: [
            "1. In Make Scenario Settings, set 'Sequential processing' to ON (Max 1 execution at a time).",
            "2. Or use Make Data Store as an atomic mutex lock with unique IDs.",
            "3. For high-volume pipelines (>100 leads/day), migrate from Google Sheets to PostgreSQL (Neon) or Airtable.",
          ],
          fr: [
            "1. Dans les paramètres du scénario Make, activez 'Sequential processing' (1 seule exécution à la fois).",
            "2. Ou utilisez un Make Data Store comme verrou atomique avec des identifiants uniques.",
            "3. Pour les volumes élevés (>100 leads/jour), migrez vers PostgreSQL (Neon) ou Airtable.",
          ],
          ar: [
            "1. في إعدادات السيناريو في Make، فعل خيار 'Sequential processing' لتنفيذ العمليات بالتتابع واحدة تلو الأخرى.",
            "2. أو استخدم Make Data Store لقفل العملية بحسب المعرف الفريد.",
            "3. للأنظمة التي تستقبل أكثر من 100 عميل يومياً، ينصح بالانتقال إلى PostgreSQL (Neon) لضمان الأمان التام.",
          ],
        },
        makeLink:
          "https://www.make.com/en/help/scenarios/scenario-settings#sequential-processing",
      },
    ],
  },
];

export function DocumentationHubClient() {
  const { language, dir, isRTL } = useLanguage();
  const t = UI_TEXT[language] || UI_TEXT.fr;

  const [activeModuleId, setActiveModuleId] = useState<string>(
    DOC_MODULES[0].id
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Active module object
  const activeModuleIndex = DOC_MODULES.findIndex(
    (m) => m.id === activeModuleId
  );
  const activeModule = DOC_MODULES[activeModuleIndex] || DOC_MODULES[0];

  // Filter modules in the sidebar by search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return DOC_MODULES;
    const q = searchQuery.toLowerCase();
    return DOC_MODULES.filter((m) => {
      const title = (m.title[language] || m.title.en).toLowerCase();
      const shortTitle = (m.shortTitle[language] || m.shortTitle.en).toLowerCase();
      const cat = (m.category[language] || m.category.en).toLowerCase();
      const inTopics = m.topics.some((topic) => {
        const tTitle = (topic.title[language] || topic.title.en).toLowerCase();
        const tSymp = (topic.symptoms[language] || topic.symptoms.en).toLowerCase();
        const tCode = (topic.errorCode || "").toLowerCase();
        return tTitle.includes(q) || tSymp.includes(q) || tCode.includes(q);
      });
      return (
        title.includes(q) ||
        shortTitle.includes(q) ||
        cat.includes(q) ||
        inTopics
      );
    });
  }, [searchQuery, language]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    toast.success(t.copied);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const goToNextModule = () => {
    if (activeModuleIndex < DOC_MODULES.length - 1) {
      setActiveModuleId(DOC_MODULES[activeModuleIndex + 1].id);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const goToPrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleId(DOC_MODULES[activeModuleIndex - 1].id);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const ActiveIcon = activeModule.icon;

  return (
    <div
      dir={dir}
      className={`w-full max-w-[1600px] mx-auto space-y-6 pb-20 select-text ${
        isRTL ? "font-sans text-right" : "text-left"
      }`}
    >
      {/* ── Top Header Banner ── */}
      <div className="relative rounded-2xl p-5 sm:p-6 bg-[#111111] dark:bg-[#1E1E1E] text-white border border-[#2E2E2E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {t.heroBadge}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {t.moduleCount}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t.heroTitle}
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full h-10 ${
              isRTL ? "pr-9 pl-14" : "pl-9 pr-14"
            } rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 text-white placeholder-slate-400 text-xs outline-none focus:border-emerald-400 transition-all`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute ${
                isRTL ? "left-2.5" : "right-2.5"
              } top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 bg-white/10 rounded cursor-pointer`}
            >
              {t.clear}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Chapter Picker (< lg) ── */}
      <div className="lg:hidden p-3 rounded-xl bg-[#FAF9F7] dark:bg-[#1E1E1E] border border-[#EDEDEB] dark:border-[#2E2E2E]">
        <label className="text-[11px] font-bold text-[#787774] dark:text-[#9B9A97] uppercase tracking-wider block mb-1.5">
          {t.selectModuleMobile}
        </label>
        <select
          value={activeModuleId}
          onChange={(e) => setActiveModuleId(e.target.value)}
          className="w-full bg-white dark:bg-[#262626] border border-[#EDEDEB] dark:border-[#2E2E2E] rounded-lg px-3 py-2 text-xs font-semibold text-[#111111] dark:text-white outline-none"
        >
          {DOC_MODULES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.number}. {m.title[language] || m.title.en}
            </option>
          ))}
        </select>
      </div>

      {/* ── 2-Column Library Architecture ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT IN-PAGE SIDEBAR (4 cols on lg, sticky on scroll) ── */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-18 space-y-3">
          <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-3.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between px-2.5 py-1 border-b border-[#EDEDEB] dark:border-[#2E2E2E] pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#787774] dark:text-[#9B9A97] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.modulesDirectory}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F2F1EE] dark:bg-[#2A2A2A] text-[#787774] dark:text-[#9B9A97] font-semibold">
                {t.guidesCount}
              </span>
            </div>

            {/* Sidebar Module List */}
            <nav className="space-y-1">
              {filteredModules.map((module) => {
                const Icon = module.icon;
                const isActive = module.id === activeModuleId;

                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModuleId(module.id);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className={`w-full ${
                      isRTL ? "text-right" : "text-left"
                    } p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2.5 group ${
                      isActive
                        ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-xs font-semibold"
                        : "text-[#55534E] dark:text-[#C5C5C4] hover:bg-[#F7F6F3] dark:hover:bg-[#262626] hover:text-[#111111] dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`font-mono text-[11px] font-bold shrink-0 ${
                          isActive
                            ? "text-emerald-400 dark:text-emerald-600"
                            : "text-[#8C8B88] dark:text-[#787774]"
                        }`}
                      >
                        {module.number}
                      </span>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? "text-white dark:text-[#111111] scale-105"
                            : "text-[#787774] dark:text-[#9B9A97] group-hover:text-[#111111] dark:group-hover:text-white"
                        }`}
                      />
                      <span className="text-xs truncate">
                        {module.shortTitle[language] || module.shortTitle.en}
                      </span>
                    </div>

                    {isRTL ? (
                      <ChevronLeft
                        className={`w-3.5 h-3.5 shrink-0 opacity-60 transition-transform ${
                          isActive ? "-translate-x-0.5 opacity-100" : ""
                        }`}
                      />
                    ) : (
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 opacity-60 transition-transform ${
                          isActive ? "translate-x-0.5 opacity-100" : ""
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Helper Badge */}
            <div className="pt-2 border-t border-[#EDEDEB] dark:border-[#2E2E2E] px-2 text-[11px] text-[#787774] dark:text-[#9B9A97] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{t.realtimeBadge}</span>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN CONTENT PANE (8 cols on lg) ── */}
        <main className="lg:col-span-8 space-y-6">
          {/* Active Module Showcase Card */}
          <div className="rounded-3xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#EDEDEB] dark:border-[#2E2E2E] p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDEDEB] dark:border-[#2E2E2E]">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#111111] dark:text-white shrink-0 shadow-2xs">
                  <ActiveIcon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {t.modulePrefix} {activeModule.number}
                    </span>
                    <span className="text-[10px] text-[#787774] dark:text-[#9B9A97]">
                      &bull;{" "}
                      {activeModule.category[language] ||
                        activeModule.category.en}
                    </span>
                    {activeModule.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {activeModule.badge[language] ||
                          activeModule.badge.en}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-[#E6E6E5] tracking-tight mt-0.5">
                    {activeModule.title[language] || activeModule.title.en}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#787774] dark:text-[#9B9A97] mt-1 leading-relaxed">
                    {activeModule.description[language] ||
                      activeModule.description.en}
                  </p>
                </div>
              </div>

              {/* Official Make Link */}
              <a
                href={activeModule.makeDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold bg-[#F7F6F3] dark:bg-[#2A2A2A] hover:bg-[#EDEDEB] dark:hover:bg-[#333333] text-[#37352F] dark:text-[#E6E6E5] border border-[#EDEDEB] dark:border-[#2E2E2E] transition-all shrink-0 w-fit"
              >
                <span>{t.officialGuide}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            {/* In-Depth Topics & Problem Resolutions */}
            <div className="space-y-6">
              {activeModule.topics.map((topic, idx) => (
                <div
                  key={topic.id}
                  id={topic.id}
                  className="rounded-2xl border border-[#EDEDEB] dark:border-[#2E2E2E] bg-[#FAF9F7] dark:bg-[#1A1A1A] p-5 sm:p-6 space-y-4 shadow-2xs hover:border-[#D1D1CE] dark:hover:border-[#3E3E3E] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-[#111111] dark:text-[#E6E6E5] flex items-center gap-2">
                      <span>{topic.title[language] || topic.title.en}</span>
                    </h3>
                    {topic.errorCode && (
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 w-fit">
                        {topic.errorCode}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#55534E] dark:text-[#C5C5C4] leading-relaxed">
                    {topic.description[language] || topic.description.en}
                  </p>

                  {/* 3-Column Diagnostic Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Symptoms */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#222222] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1">
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" />
                        {t.symptoms}
                      </span>
                      <p className="text-[#55534E] dark:text-[#C5C5C4] leading-relaxed">
                        {topic.symptoms[language] || topic.symptoms.en}
                      </p>
                    </div>

                    {/* Root Cause */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#222222] border border-[#EDEDEB] dark:border-[#2E2E2E] space-y-1">
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <Compass className="w-3 h-3" />
                        {t.rootCause}
                      </span>
                      <p className="text-[#55534E] dark:text-[#C5C5C4] leading-relaxed">
                        {topic.rootCause[language] || topic.rootCause.en}
                      </p>
                    </div>

                    {/* Prescribed Solution */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-1.5">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />
                        {t.prescribedSolution}
                      </span>
                      <ul className="space-y-1 text-[#37352F] dark:text-[#E6E6E5] text-[11px] list-disc list-inside leading-relaxed">
                        {(
                          topic.solution[language] || topic.solution.en
                        ).map((sol, sIdx) => (
                          <li key={sIdx}>{sol}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Code Snippet / Configuration Block */}
                  {topic.codeSnippet && (
                    <div
                      dir="ltr"
                      className="relative rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto shadow-inner text-left"
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                        <span>{t.configReference}</span>
                        <button
                          onClick={() =>
                            handleCopyCode(
                              topic.codeSnippet!,
                              `${activeModule.id}-${idx}`
                            )
                          }
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedSnippet === `${activeModule.id}-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>
                            {copiedSnippet === `${activeModule.id}-${idx}`
                              ? t.copied
                              : t.copy}
                          </span>
                        </button>
                      </div>
                      <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">
                        {topic.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Make Link */}
                  {topic.makeLink && (
                    <div className={`pt-1 flex ${isRTL ? "justify-start" : "justify-end"}`}>
                      <a
                        href={topic.makeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>{t.openOfficial}</span>
                        {isRTL ? (
                          <ChevronLeft className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Navigation: Previous / Next Module */}
            <div className="pt-4 border-t border-[#EDEDEB] dark:border-[#2E2E2E] flex items-center justify-between gap-4">
              <button
                onClick={goToPrevModule}
                disabled={activeModuleIndex === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#F7F6F3] dark:bg-[#2A2A2A] hover:bg-[#EDEDEB] dark:hover:bg-[#333333] text-[#37352F] dark:text-[#E6E6E5] border border-[#EDEDEB] dark:border-[#2E2E2E] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                {isRTL ? (
                  <ArrowRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowLeft className="w-3.5 h-3.5" />
                )}
                <span>
                  {activeModuleIndex > 0
                    ? `${t.previous}: ${
                        DOC_MODULES[activeModuleIndex - 1].shortTitle[
                          language
                        ] ||
                        DOC_MODULES[activeModuleIndex - 1].shortTitle.en
                      }`
                    : t.firstModule}
                </span>
              </button>

              <button
                onClick={goToNextModule}
                disabled={activeModuleIndex === DOC_MODULES.length - 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#111111] hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#111111] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
              >
                <span>
                  {activeModuleIndex < DOC_MODULES.length - 1
                    ? `${t.next}: ${
                        DOC_MODULES[activeModuleIndex + 1].shortTitle[
                          language
                        ] ||
                        DOC_MODULES[activeModuleIndex + 1].shortTitle.en
                      }`
                    : t.endOfLibrary}
                </span>
                {isRTL ? (
                  <ArrowLeft className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Community & Support Card */}
          <div className="rounded-2xl p-5 bg-[#FAF9F7] dark:bg-[#1E1E1E] border border-[#EDEDEB] dark:border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#111111] dark:text-[#E6E6E5]">
                {t.needHelp}
              </h4>
              <p className="text-[11px] text-[#787774] dark:text-[#9B9A97]">
                {t.needHelpSub}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/dashboard/community"
                className="h-8 px-3 rounded-lg text-xs font-bold bg-[#111111] hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#111111] flex items-center gap-1.5 transition-all shadow-xs"
              >
                <MessageSquare className="w-3 h-3" />
                <span>{t.communityBtn}</span>
              </Link>
              <Link
                href="/dashboard/live-calls"
                className="h-8 px-3 rounded-lg text-xs font-medium bg-white dark:bg-[#2A2A2A] border border-[#EDEDEB] dark:border-[#2E2E2E] text-[#37352F] dark:text-[#E6E6E5] flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Clock className="w-3 h-3" />
                <span>{t.liveCallsBtn}</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
