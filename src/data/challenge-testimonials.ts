// Authentic student video testimonials for the 60-Day Challenge.
// Extracted unchanged from the original /challenge TestimonialsSection
// (src/components/landing/v2/TestimonialsSection.tsx) so both the legacy
// component and the redesigned page render from the same source.
// Do NOT edit, translate, or replace these files with generated media.

export type ChallengeTestimonial = {
  id: number;
  video: string;
  /** Duration in seconds, measured from the MP4 header (display only). */
  durationSeconds: number;
  /** Intrinsic video size (both files are 1920x1080). */
  width: number;
  height: number;
};

export const CHALLENGE_TESTIMONIALS: ChallengeTestimonial[] = [
  {
    id: 1,
    video: "/FEEDBACK1.mp4",
    durationSeconds: 32,
    width: 1920,
    height: 1080,
  },
  {
    id: 2,
    video: "/FEEDBACK2.mp4",
    durationSeconds: 57,
    width: 1920,
    height: 1080,
  },
];
