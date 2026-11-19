export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://www.eensell.com/#organization",
        "name": "Eensell University",
        "url": "https://www.eensell.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.eensell.com/icon-512.png",
          "width": 512,
          "height": 512,
        },
        "description":
          "Premium AI-powered education platform for Moroccan & international entrepreneurs mastering modern digital skills.",
        "sameAs": [
          "https://www.instagram.com/eensell",
          "https://www.youtube.com/@eensell"
        ],
      },
      {
        "@type": "Course",
        "@id": "https://www.eensell.com/#course",
        "name": "Eensell AI & Digital Mastery Program",
        "description":
          "Comprehensive training in modern AI tools, content creation, AI UGC, digital marketing, client acquisition, and online agency operations.",
        "provider": {
          "@id": "https://www.eensell.com/#organization",
        },
        "inLanguage": ["ar", "fr", "en"],
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "courseWorkload": "PT60D",
        },
        "offers": {
          "@type": "Offer",
          "category": "Paid",
          "priceCurrency": "MAD",
          "availability": "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.eensell.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is Eensell University suitable for beginners?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Absolutely. The platform is designed to take you from scratch, step by step, even if you have no prior online work or AI experience.",
            },
          },
          {
            "@type": "Question",
            "name": "How do the live calls work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "We host live interactive calls twice a week to discuss strategy, conduct hands-on workshops, and answer individual student questions directly.",
            },
          },
          {
            "@type": "Question",
            "name": "What skills will I learn in Eensell University?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "You master generative AI tools, prompt engineering, AI UGC video creation, client outreach systems, and high-income digital service delivery.",
            },
          },
          {
            "@type": "Question",
            "name": "Is the program suitable for university and high school students?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. The program is flexible and self-paced with all live calls recorded so you can study alongside school or your job.",
            },
          },
          {
            "@type": "Question",
            "name": "What payment methods are supported in Morocco?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "We support Moroccan local bank transfer (CIH Bank), CashPlus, Wafacash, as well as international cards and PayPal.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
