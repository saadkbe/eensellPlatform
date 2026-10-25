// ===========================================================
// 60-Day Challenge — single source of truth for the offer.
// Change the price here (e.g. 697 -> 679) and every sales-page
// mention plus the /pending payment instructions update together.
// ===========================================================

export const CHALLENGE_OFFER = {
  /** One-time price in Moroccan dirhams. */
  priceMad: 697,
  currency: "MAD",

  /**
   * Verified enrollment flow: Clerk sign-up -> /dashboard -> (PENDING) /pending
   * -> manual payment verification -> activation -> /onboarding.
   * Do not point CTAs anywhere else.
   */
  enrollHref: "/sign-up",
  signInHref: "/sign-in",

  /** Founder VSL hosted on Bunny.net Stream. */
  founderVideo: {
    bunnyEmbedUrl: "https://player.mediadelivery.net/embed/788633/d68cddec-b596-4832-a1f1-bad57cbefde0?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
    // Existing founder thumbnail from /public (genuine photo of the founder).
    poster: "/images/confident_thumbnail.jpg",
    posterWidth: 1376,
    posterHeight: 768,
  },

  /**
   * Display student count
   */
  activeStudentsDisplay: "+650",

  /**
   * Number of training modules advertised.
   * NOTE: at audit time only 4 modules (8 lessons) were published in the DB.
   * Confirm all 9 are live before publishing, or lower this number.
   */
  modulesCount: 9,

  /** Payment methods shown on /pending (manual verification). */
  paymentMethods: ["CIH Bank", "Wafacash", "Cash Plus"],

  contact: {
    email: "contact@eensell.com",
    whatsappDisplay: "+212 666 065 608",
    whatsappHref: "https://wa.me/212666065608",
  },
} as const;

/** "697 MAD" */
export const CHALLENGE_PRICE_LABEL = `${CHALLENGE_OFFER.priceMad} ${CHALLENGE_OFFER.currency}`;
