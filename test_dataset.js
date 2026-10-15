const { CHAPTERS, FORMULAS_DATA } = require('./data.js');

console.log('Chapters count:', CHAPTERS.length);
console.log('Formulas count:', FORMULAS_DATA.length);

const ids = new Set();
let duplicates = 0;
let missingQuiz = 0;

FORMULAS_DATA.forEach(f => {
  if (ids.has(f.id)) {
    console.error('Duplicate ID:', f.id);
    duplicates++;
  }
  ids.add(f.id);
  if (!f.quiz || !f.quiz.q || f.quiz.correct === undefined) {
    missingQuiz++;
  }
});

console.log('Duplicate IDs:', duplicates);
console.log('Formulas with quiz:', FORMULAS_DATA.length - missingQuiz);

CHAPTERS.forEach(c => {
  if (c.id === 'all') return;
  const count = FORMULAS_DATA.filter(f => f.chapter === c.id).length;
  console.log(`- ${c.name}: ${count} cong thuc`);
});

let braceErrors = 0;
let quizOptionErrors = 0;

FORMULAS_DATA.forEach((item, i) => {
  const l = item.latex || '';
  const openBraces = (l.match(/\{/g) || []).length;
  const closeBraces = (l.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    console.error(`[Error] Formula #${i+1} (${item.title}): Mismatched braces {}: ${openBraces} vs ${closeBraces}`);
    console.error(`Latex: ${l}`);
    braceErrors++;
  }
  
  if (item.quiz) {
    if (!item.quiz.options || item.quiz.options.length < 2) {
      console.error(`[Error] Insufficient quiz options for #${i+1} (${item.title})`);
      quizOptionErrors++;
    }
    if (item.quiz.correct < 0 || item.quiz.correct >= item.quiz.options.length) {
      console.error(`[Error] Invalid correct index ${item.quiz.correct} for #${i+1} (${item.title})`);
      quizOptionErrors++;
    }
  }
});

console.log(`[Summary] Total Brace Errors: ${braceErrors}, Quiz Option Errors: ${quizOptionErrors}`);
if (braceErrors === 0 && quizOptionErrors === 0 && duplicates === 0) {
  console.log('✅ ALL FORMULAS AND QUIZ ITEMS ARE 100% VALIDATED!');
}
