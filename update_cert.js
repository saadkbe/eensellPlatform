const fs = require('fs');

function addCertificateTranslations() {
  const path = './src/lib/translations.ts';
  let content = fs.readFileSync(path, 'utf8');

  const arKeys = `
    // Certificate Section
    cert_title: "شهادة نجاح معتمدة",
    cert_sub: "بعد إتمامك لتحدي الشهرين بنجاح وتحقيق أهدافك، ستحصل على شهادة نجاح مخصصة تثبت خبرتك.",
    cert_feat_1: "تثبت مهارتك في استخدام الذكاء الاصطناعي",
    cert_feat_2: "إضافة قوية لسيرتك الذاتية ومعرض أعمالك",
    cert_feat_3: "تزيد من ثقة العملاء بخدماتك",
`;

  const frKeys = `
    // Certificate Section
    cert_title: "Certificat de Réussite",
    cert_sub: "Après avoir terminé avec succès le défi de 2 mois, vous recevrez un certificat personnalisé attestant de votre expertise.",
    cert_feat_1: "Prouve vos compétences en IA",
    cert_feat_2: "Un atout majeur pour votre CV et portfolio",
    cert_feat_3: "Augmente la confiance de vos clients",
`;

  const enKeys = `
    // Certificate Section
    cert_title: "Official Certificate of Success",
    cert_sub: "After successfully completing the 2-month challenge, you will receive a custom certificate proving your expertise.",
    cert_feat_1: "Proves your AI skills and proficiency",
    cert_feat_2: "A powerful addition to your resume and portfolio",
    cert_feat_3: "Increases client trust in your services",
`;

  // Inject before FAQ Section
  content = content.replace(/\/\/ FAQ\n    faq_title: "الأسئلة",/g, arKeys + '\n    // FAQ\n    faq_title: "الأسئلة",');
  content = content.replace(/\/\/ FAQ\n    faq_title: "Questions",/g, frKeys + '\n    // FAQ\n    faq_title: "Questions",');
  content = content.replace(/\/\/ FAQ\n    faq_title: "Frequently",/g, enKeys + '\n    // FAQ\n    faq_title: "Frequently",');

  fs.writeFileSync(path, content, 'utf8');
}

addCertificateTranslations();
console.log('Translations injected');
