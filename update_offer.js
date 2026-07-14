const fs = require('fs');

function updateTranslations() {
  const path = './src/lib/translations.ts';
  let content = fs.readFileSync(path, 'utf8');

  const replacements = [
    // Arabic
    ['وصول مدى الحياة للمنصة', 'وصول لمدة شهرين للمنصة'],
    ['وصول مدى الحياة للمؤسسين', 'وصول لمدة شهرين للمؤسسين'],
    ['وصول مدى الحياة', 'وصول لمدة شهرين'],
    [
      'الطريق التقليدي لن يجعلك حراً أبداً. انضم إلى الحركة الحصرية للمؤسسين الذين يربحون المال يومياً باستخدام أحدث أدوات الذكاء الاصطناعي.. بدون خبرة سابقة.',
      'الطريق التقليدي لن يجعلك حراً أبداً. انضم إلينا لتتعلم مهارات الذكاء الاصطناعي، تطبيقها، وبناء عرض خدمات متكامل مع استراتيجية تواصل سرية لعام 2026. هدفنا: الانتقال من مبتدئ إلى تحقيق 5000 درهم أو أكثر.'
    ],
    [
      'خزينة أدوات الذكاء الاصطناعي',
      'استراتيجية تواصل سرية 2026'
    ],
    [
      'أفضل الأدوات والملقنات الجاهزة لتسريع العمل وتحقيق الأرباح.',
      'تعلم كيفية جلب العملاء باستخدام تركيبة سرية مجربة لعام 2026 تضمن لك نتائج حقيقية.'
    ],
    [
      'توجيه خطوة بخطوة',
      'من مبتدئ إلى 5000 درهم+'
    ],
    [
      'من الصفر وحتى تحقيق أول دولار لك على الإنترنت. خريطة طريق واضحة.',
      'توجيه خطوة بخطوة لتعلم مهارات الذكاء الاصطناعي وتطبيقها لبيع خدماتك والوصول لأهدافك.'
    ],
    [
      'إذا انضممت الآن كعضو مؤسس، ستحصل على وصول مدى الحياة للمنصة ولجميع التحديثات المستقبلية دون أي رسوم إضافية.',
      'إذا انضممت الآن كعضو مؤسس، ستحصل على وصول لمدة شهرين للمنصة لتعلم وتطبيق المهارات.'
    ],
    [
      'ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي لتقديم خدمات رقمية عالية القيمة، بناء منتجات رقمية، وإيجاد عملاء، كل ذلك بهدف الوصول إلى أول دولار لك على الإنترنت ثم التوسع.',
      'ستتعلم مهارات الذكاء الاصطناعي، كيفية تطبيقها، تقديم عرض خدمات متكامل، والوصول للعملاء بتركيبة تواصل سرية لعام 2026 للوصول إلى 5000 درهم أو أكثر.'
    ],

    // French
    ['Accès à vie à la plateforme', 'Accès de 2 mois à la plateforme'],
    ['Accès à vie pour les fondateurs', 'Accès de 2 mois pour les fondateurs'],
    ['Accès à vie', 'Accès de 2 mois'],
    [
      'Le chemin traditionnel ne vous rendra jamais libre. Rejoignez le mouvement exclusif des fondateurs qui gagnent de l\'argent quotidiennement grâce aux derniers outils d\'IA.. sans expérience préalable.',
      'Le chemin traditionnel ne vous rendra jamais libre. Rejoignez-nous pour apprendre les compétences en IA, les appliquer, créer une offre complète et trouver des clients avec une formule secrète 2026. Objectif: De débutant à 5000 MAD+.'
    ],
    [
      'Arsenal d\'outils d\'IA',
      'Formule secrète de prospection 2026'
    ],
    [
      'Les meilleurs outils et prompts prêts à l\'emploi pour accélérer le travail et générer des revenus.',
      'Apprenez à trouver des clients en utilisant une formule secrète prouvée pour 2026.'
    ],
    [
      'Accompagnement étape par étape',
      'De débutant à 5000 MAD+'
    ],
    [
      'De zéro jusqu\'à votre premier dollar en ligne. Une feuille de route claire.',
      'Accompagnement étape par étape pour apprendre l\'IA, l\'appliquer et vendre vos services pour atteindre vos objectifs.'
    ],
    [
      'Si vous rejoignez maintenant en tant que membre fondateur, vous obtiendrez un accès à vie à la plateforme et à toutes les mises à jour futures sans frais supplémentaires.',
      'Si vous rejoignez maintenant en tant que membre fondateur, vous obtiendrez un accès de 2 mois à la plateforme.'
    ],
    [
      'Vous apprendrez à utiliser les outils d\'IA pour offrir des services numériques à haute valeur, créer des produits numériques et trouver des clients, le tout dans le but de gagner votre premier dollar en ligne puis de vous développer.',
      'Vous apprendrez les compétences en IA, à les appliquer, à créer une offre de services complète, et à prospecter avec une formule secrète 2026 pour atteindre 5000 MAD ou plus.'
    ],

    // English
    ['Lifetime platform access', '2 months platform access'],
    ['Lifetime access for founders', '2 months access for founders'],
    ['Lifetime access', '2 months access'],
    [
      'The traditional path will never make you free. Join the exclusive movement of founders who earn money daily using the latest AI tools.. with no prior experience.',
      'The traditional path will never make you free. Join us to learn AI skills, apply them, build a full service offer, and do client outreach using a secret 2026 formula. Goal: Go from beginner to 5000 MAD+ selling AI services.'
    ],
    [
      'AI tools arsenal',
      'Secret 2026 outreach formula'
    ],
    [
      'The best ready-to-use tools and prompts to accelerate work and generate profits.',
      'Learn how to get clients using a secret outreach formula proven to work in 2026.'
    ],
    [
      'Step-by-step guidance',
      'From beginner to 5000 MAD+'
    ],
    [
      'From zero to your first dollar online. A clear roadmap.',
      'Step-by-step guidance to learn AI, apply it, and sell your services to reach your financial goals.'
    ],
    [
      'If you join now as a founding member, you\'ll get lifetime access to the platform and all future updates at no additional cost.',
      'If you join now as a founding member, you\'ll get 2 months access to the platform.'
    ],
    [
      'You\'ll learn how to use AI tools to provide high-value digital services, build digital products, and find clients, all aimed at earning your first dollar online then scaling up.',
      'You will learn AI skills, how to apply them, make a full service offer, and do client outreach using a secret 2026 formula to reach 5000 MAD or more.'
    ]
  ];

  for (const [oldText, newText] of replacements) {
    content = content.replace(new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
  }

  // Also replace any straggling instances of "lifetime" or "مدى الحياة" in pricing sub
  content = content.replace(/ادفع مرة واحدة اليوم، واحصل على وصول مدى الحياة/g, 'ادفع مرة واحدة اليوم، واحصل على وصول لمدة شهرين');
  content = content.replace(/Payez une seule fois aujourd'hui et obtenez un accès à vie/g, 'Payez une seule fois aujourd\'hui et obtenez un accès de 2 mois');
  content = content.replace(/Pay once today and get lifetime access/g, 'Pay once today and get 2 months access');

  fs.writeFileSync(path, content, 'utf8');
}

function updateHero() {
  const path = './src/components/landing/HeroSection.tsx';
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/Accès à vie pour 200Dh/g, 'Accès de 2 mois pour 200Dh');
  fs.writeFileSync(path, content, 'utf8');
}

updateTranslations();
updateHero();
console.log('Update complete.');
