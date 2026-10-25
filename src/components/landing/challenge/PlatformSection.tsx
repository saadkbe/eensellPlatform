import Image from "next/image";
import { BookOpen, Workflow, CheckSquare, Trophy, Video, MessageCircle, PlayCircle } from "lucide-react";
import { SectionHeading, cardSurface } from "./primitives";
import { LiveCommunityWidget } from "./LiveCommunityWidget";

const PLATFORM_FEATURES = [
  {
    icon: BookOpen,
    title: "Programme dial 60 Yom (9 Modules)",
    desc: "Vidéos over-the-shoulder. Choufni kifach kan-cliki, kan-bni, w kan-deployi étape par étape.",
  },
  {
    icon: Workflow,
    title: "Systemes Wajdin (Fichiers JSON)",
    desc: "Téléchargi les fichiers JSON dial Make.com li kankhdem bihom w importihom direct f compte dyalk.",
  },
  {
    icon: Video,
    title: "Live Troubleshooting",
    desc: "2 d les appels live kol simana bach n7ello lik les workflows li m7bsin en direct f screen share.",
  },
  {
    icon: CheckSquare,
    title: "L'Coffre dial l'Outreach & Scripts",
    desc: "Scripts d l'outreach mtestyin bach t-closi les cliniques w les agences bla ma t7chem.",
  },
  {
    icon: Trophy,
    title: "Leaderboard & XP Progress",
    desc: "Systeme d'homeworks w classement dial drari bach ybqa 3ndek motivation kol nhar.",
  },
  {
    icon: MessageCircle,
    title: "Community VIP 24/7",
    desc: "Accès direct l network dial drari li kay9ado w kaybi3o kol nhar f WhatsApp w Discord.",
  },
];

export function PlatformSection() {
  return (
    <section id="platform" className="relative px-5 py-20 sm:px-6 sm:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Dakhel Eensell University"
          title={
            <>
              Koulchi li ghat7taj bach tbni w tbi3{" "}
              <span className="text-[#D6A15D]">des Systemes d&apos;IA</span>, mjmou3 f blassa we7da.
            </>
          }
          intro="Machi ghir dossier Drive. Eensell University platforme kamla fiha les modules, les workflows téléchargeables, w l'suivi dial les missions."
        />

        {/* Real platform screenshots grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Dashboard Preview */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-white/10 bg-[#0A0D14] p-3 sm:p-4 shadow-2xl overflow-hidden group">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/[0.06]">
                <Image
                  src="/dashboard.png"
                  alt="Interface dyal Dashboard f Eensell University"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h4 className="text-base font-bold text-[#F7F8FA]">
                  Dashboard dyal ttilmid & Leaderboard
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-[#A7AFBE]">
                  Katchouf les modules, les stats dyalk, l&apos;avancement f les leçons, w l&apos;ranking m3a l&apos;groupe.
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Screenshot Preview (Course Modules) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="relative rounded-3xl border border-white/10 bg-[#0A0D14] p-3 sm:p-4 shadow-2xl overflow-hidden group">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/[0.06]">
                <Image
                  src="/images/course_modules.png"
                  alt="Modules d'formation f Eensell University"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="p-4">
                <h4 className="text-base font-bold text-[#F7F8FA]">
                  Modules d&apos;formation & leçons
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-[#A7AFBE]">
                  Chouf l&apos;vidéos over-the-shoulder, t&apos;téléchargi les templates, w 7ett homework dyalk.
                </p>
              </div>
            </div>

            {/* Third smaller card (Live / Google Meet) */}
            <div className="relative rounded-3xl border border-white/10 bg-[#0A0D14] p-5 shadow-2xl flex items-center gap-4">
              <div className="relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border border-white/10">
                <Image
                  src="/images/google_meet.jpg"
                  alt="Live sessions replay"
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#D6A15D]">
                  Replays & Live calls
                </p>
                <h5 className="text-sm font-bold text-[#F7F8FA] mt-0.5">
                  Live Troubleshooting 2 marrat f simana
                </h5>
                <p className="text-xs text-[#A7AFBE] mt-1">
                  Les sessions li fatok m7toutin f l&apos;espace dyalk.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features breakdown grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_FEATURES.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={`${cardSurface} p-6 flex flex-col`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6A15D]/10 text-[#D6A15D] border border-[#D6A15D]/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#F7F8FA]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#A7AFBE] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Visual Widget: Community & Accountability */}
        <LiveCommunityWidget />
      </div>
    </section>
  );
}
