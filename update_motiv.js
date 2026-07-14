const fs = require('fs');

function updateMotiv() {
  const path = './src/lib/translations.ts';
  let content = fs.readFileSync(path, 'utf8');

  const replacements = [
    ['بعد 5 سنوات من الآن..', 'بعد شهرين من الآن..'],
    ['Dans 5 ans..', 'Dans 2 mois..'],
    ['5 years from now..', '2 months from now..']
  ];

  for (const [oldText, newText] of replacements) {
    content = content.replace(new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
  }

  fs.writeFileSync(path, content, 'utf8');
}

updateMotiv();
console.log('Motiv section updated.');
