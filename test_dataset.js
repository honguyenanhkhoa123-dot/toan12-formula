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

/* ---------------------------------------------------------------------------
   Kiểm tra dấu $ cân bằng và lỗi mất dấu \ trong LaTeX.
   - Số dấu $ lẻ  -> KaTeX không tìm thấy dấu đóng, bỏ qua và để lại LaTeX thô.
   - Thiếu dấu \  -> JS âm thầm biến "\t" thành TAB, "\p" thành "p"... làm hỏng công thức.
   --------------------------------------------------------------------------- */
let mathDelimErrors = 0;
let lostBackslashErrors = 0;

const dollarCount = s => (s.match(/\$/g) || []).length;

const checkMathText = (label, value) => {
  if (typeof value !== 'string' || !value) return;
  if (dollarCount(value) % 2 !== 0) {
    console.error(`[Error] ${label}: số dấu $ lẻ (${dollarCount(value)}) -> KaTeX sẽ để lại LaTeX thô`);
    console.error(`        ${value.slice(0, 140)}`);
    mathDelimErrors++;
  }
  if (/[\t\f\r\v\0]/.test(value)) {
    console.error(`[Error] ${label}: chứa ký tự điều khiển (dấu \\ bị mất khi viết chuỗi LaTeX)`);
    console.error(`        ${JSON.stringify(value.slice(0, 140))}`);
    lostBackslashErrors++;
  }
};

const walkMathText = (node, label) => {
  if (typeof node === 'string') return checkMathText(label, node);
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach((v, i) => walkMathText(v, `${label}[${i}]`));
  Object.keys(node).forEach(k => walkMathText(node[k], `${label}.${k}`));
};

walkMathText(FORMULAS_DATA, 'FORMULAS_DATA');

console.log(`[Summary] Total Brace Errors: ${braceErrors}, Quiz Option Errors: ${quizOptionErrors}, ` +
  `$ lẻ: ${mathDelimErrors}, mất dấu \\: ${lostBackslashErrors}`);
if (braceErrors === 0 && quizOptionErrors === 0 && duplicates === 0 &&
    mathDelimErrors === 0 && lostBackslashErrors === 0) {
  console.log('✅ ALL FORMULAS AND QUIZ ITEMS ARE 100% VALIDATED!');
} else {
  console.error('❌ DỮ LIỆU CÒN LỖI — xem chi tiết ở trên.');
  process.exitCode = 1;
}
