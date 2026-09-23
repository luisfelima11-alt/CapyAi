const fs = require('fs');
const path = require('path');
const { extractBalanced } = require('./_extract.js');
const root = path.join(__dirname, '..');

const learnPath = path.join(root, 'learn.html');
const lessonsPath = path.join(root, 'lessons.html');

let learnHtml = fs.readFileSync(learnPath, 'utf8');
let lessonsHtml = fs.readFileSync(lessonsPath, 'utf8');

function replaceConst(src, name, newArrOrObj) {
  const marker = 'const ' + name + ' = ';
  const start = src.indexOf(marker);
  const openIdx = start + marker.length;
  const raw = extractBalanced(src, name);
  const endIdx = openIdx + raw.length;
  const newCode = JSON.stringify(newArrOrObj, null, 2);
  return src.slice(0, openIdx) + newCode + src.slice(endIdx);
}

// ---- Load current state ----
const TRAIL = new Function('return ' + extractBalanced(learnHtml, 'TRAIL'))();
const CHAPTERS = new Function('return ' + extractBalanced(learnHtml, 'CHAPTERS'))();
const JADSON_LESSONS = new Function('return ' + extractBalanced(lessonsHtml, 'JADSON_LESSONS'))();
const TRAIL_GAMES = new Function('return ' + extractBalanced(lessonsHtml, 'TRAIL_GAMES'))();

// ---- New lesson 101: Academic English & Essay Writing ----
const lesson101Trail = {
  id: 101,
  emoji: '📝',
  title: 'Academic English & Essay Writing',
  chapter: 22,
  game: 'fill_blank_game.html',
  xp: 320
};

const lesson101Full = {
  id: 101,
  title: 'Academic English & Essay Writing',
  emoji: '📝',
  verbs: ['To Argue', 'To Analyze', 'To Conclude', 'To Support'],
  vocab: [
    { en: 'Thesis statement', pt: 'Tese central do texto' },
    { en: 'Argument', pt: 'Argumento' },
    { en: 'Counterargument', pt: 'Contra-argumento' },
    { en: 'Evidence', pt: 'Evidência' },
    { en: 'Citation', pt: 'Citação' },
    { en: 'To paraphrase', pt: 'Parafrasear' },
    { en: 'Plagiarism', pt: 'Plágio' },
    { en: 'Peer review', pt: 'Revisão por pares' },
    { en: 'Literature review', pt: 'Revisão de literatura' },
    { en: 'Hypothesis', pt: 'Hipótese' },
    { en: 'Methodology', pt: 'Metodologia' },
    { en: 'Findings', pt: 'Resultados (de pesquisa)' },
    { en: 'Conclusion', pt: 'Conclusão' },
    { en: 'Abstract', pt: 'Resumo (de artigo)' },
    { en: 'Bibliography', pt: 'Bibliografia' },
    { en: 'Academic integrity', pt: 'Integridade acadêmica' },
    { en: 'Draft', pt: 'Rascunho' },
    { en: 'Outline', pt: 'Esquema/roteiro do texto' },
    { en: 'Coherence', pt: 'Coerência' },
    { en: 'Cohesion', pt: 'Coesão' },
    { en: 'Perspective', pt: 'Ponto de vista' },
    { en: 'Rebuttal', pt: 'Refutação' },
    { en: 'To substantiate', pt: 'Fundamentar, comprovar' },
    { en: 'Furthermore', pt: 'Além disso' },
    { en: 'Nevertheless', pt: 'Não obstante, apesar disso' },
    { en: 'Consequently', pt: 'Consequentemente' },
    { en: 'In contrast', pt: 'Em contrapartida' },
    { en: 'To sum up', pt: 'Em resumo' },
    { en: 'Empirical evidence', pt: 'Evidência empírica' },
    { en: 'Scholarly source', pt: 'Fonte acadêmica' }
  ],
  expressions: [
    { expr: 'This essay argues that stricter regulation is necessary', meaning: 'Este ensaio argumenta que uma regulamentação mais rígida é necessária', example: 'This essay argues that stricter regulation is necessary.' },
    { expr: 'Furthermore, the evidence suggests a clear correlation', meaning: 'Além disso, a evidência sugere uma correlação clara', example: 'Furthermore, the evidence suggests a clear correlation.' },
    { expr: 'On the other hand, one could argue that costs outweigh benefits', meaning: 'Por outro lado, poder-se-ia argumentar que os custos superam os benefícios', example: 'On the other hand, one could argue that costs outweigh benefits.' },
    { expr: 'In conclusion, it is clear that further research is needed', meaning: 'Em conclusão, é evidente que mais pesquisa é necessária', example: 'In conclusion, it is clear that further research is needed.' }
  ],
  sentences: [
    'This essay argues that stricter regulation is necessary.',
    'Furthermore, the evidence suggests a clear correlation.',
    'On the other hand, one could argue that costs outweigh benefits.',
    'Nevertheless, the data remains inconclusive.',
    'Consequently, policymakers should act with caution.',
    'In contrast to previous studies, these findings show a different pattern.',
    'To sum up, the argument rests on three main pieces of evidence.',
    'In conclusion, it is clear that further research is needed.'
  ],
  grammar: {
    title: 'Linking Words & Cohesive Devices (Escrita Acadêmica)',
    rules: [
      'Para adicionar ideias em registro formal, use "furthermore" ou "moreover" em vez de "also": Furthermore, the evidence suggests...',
      'Para contrastar ideias formalmente, use "nevertheless", "however" ou "in contrast" em vez de "but": Nevertheless, the data remains inconclusive.',
      'Para indicar causa e efeito em textos acadêmicos, use "consequently" ou "therefore" em vez de "so": Consequently, policymakers should act.',
      'Textos acadêmicos evitam contrações (don\'t → do not) e preferem nominalizações (to argue → the argument) para soar mais formais.'
    ],
    table: {
      headers: ['Conector', 'Função', 'Exemplo', 'Observação'],
      rows: [
        ['Furthermore / Moreover', 'adição formal', 'Furthermore, the data confirms...', 'mais formal que "also"'],
        ['Nevertheless / However', 'contraste formal', 'Nevertheless, results varied.', 'mais formal que "but"'],
        ['Consequently / Therefore', 'causa e efeito', 'Consequently, action is needed.', 'mais formal que "so"'],
        ['In contrast / On the other hand', 'comparação de pontos de vista', 'In contrast, other studies disagree.', 'usado para contrapor argumentos']
      ]
    }
  },
  quiz: [
    { q: '___, the evidence suggests a clear correlation.', a: 'Furthermore', opts: ['Furthermore', 'But', 'So', 'Because'] },
    { q: '___, the data remains inconclusive.', a: 'Nevertheless', opts: ['Nevertheless', 'And', 'So', 'Also'] },
    { q: '___, policymakers should act with caution.', a: 'Consequently', opts: ['Consequently', 'But', 'Or', 'Also'] },
    { q: 'A academic writing usually avoids using ___.', a: 'contractions', opts: ['contractions', 'citations', 'evidence', 'conclusions'] },
    { q: 'To sum up the argument, we write: "___, the argument rests on three points."', a: 'To sum up', opts: ['To sum up', 'By the way', 'Anyway', 'So then'] }
  ],
  speak: [
    'This essay argues that stricter regulation is necessary.',
    'Furthermore, the evidence suggests a clear correlation.',
    'Nevertheless, the data remains inconclusive.',
    'Consequently, policymakers should act with caution.',
    'In conclusion, it is clear that further research is needed.'
  ]
};

// ---- New lesson 102: Legal English for Everyday Life ----
const lesson102Trail = {
  id: 102,
  emoji: '⚖️',
  title: 'Legal English for Everyday Life',
  chapter: 22,
  game: 'hangman_game.html',
  xp: 325
};

const lesson102Full = {
  id: 102,
  title: 'Legal English for Everyday Life',
  emoji: '⚖️',
  verbs: ['To Sign', 'To Terminate', 'To Comply', 'To Waive'],
  vocab: [
    { en: 'Contract', pt: 'Contrato' },
    { en: 'Clause', pt: 'Cláusula' },
    { en: 'Terms and conditions', pt: 'Termos e condições' },
    { en: 'Liability', pt: 'Responsabilidade legal' },
    { en: 'Breach', pt: 'Quebra (de contrato)' },
    { en: 'Party', pt: 'Parte (envolvida no contrato)' },
    { en: 'Agreement', pt: 'Acordo' },
    { en: 'Lease', pt: 'Contrato de aluguel' },
    { en: 'Tenant', pt: 'Inquilino' },
    { en: 'Landlord', pt: 'Locador' },
    { en: 'Deposit', pt: 'Caução, depósito' },
    { en: 'Notice period', pt: 'Prazo de aviso prévio' },
    { en: 'Termination', pt: 'Rescisão' },
    { en: 'Waiver', pt: 'Renúncia (de direito)' },
    { en: 'Dispute', pt: 'Disputa, litígio' },
    { en: 'Arbitration', pt: 'Arbitragem' },
    { en: 'Jurisdiction', pt: 'Jurisdição' },
    { en: 'Legally binding', pt: 'Juridicamente vinculante' },
    { en: 'Obligation', pt: 'Obrigação' },
    { en: 'Right', pt: 'Direito' },
    { en: 'Entitlement', pt: 'Direito adquirido' },
    { en: 'Compliance', pt: 'Conformidade' },
    { en: 'Violation', pt: 'Violação' },
    { en: 'Fine', pt: 'Multa' },
    { en: 'Lawsuit', pt: 'Processo judicial' },
    { en: 'Plaintiff', pt: 'Autor da ação' },
    { en: 'Defendant', pt: 'Réu' },
    { en: 'Settlement', pt: 'Acordo (para encerrar disputa)' },
    { en: 'Small claims court', pt: 'Juizado de pequenas causas' },
    { en: 'Power of attorney', pt: 'Procuração' }
  ],
  expressions: [
    { expr: 'By signing this, you agree to the terms and conditions', meaning: 'Ao assinar isso, você concorda com os termos e condições', example: 'By signing this, you agree to the terms and conditions.' },
    { expr: "The landlord shall provide 30 days' notice", meaning: 'O locador deverá fornecer um aviso prévio de 30 dias', example: "The landlord shall provide 30 days' notice." },
    { expr: 'You are entitled to a full refund', meaning: 'Você tem direito a um reembolso total', example: 'You are entitled to a full refund.' },
    { expr: 'This contract is legally binding', meaning: 'Este contrato é juridicamente vinculante', example: 'This contract is legally binding.' }
  ],
  sentences: [
    'By signing this, you agree to the terms and conditions.',
    "The landlord shall provide 30 days' notice before termination.",
    'You are entitled to a full refund within 7 days.',
    'This contract is legally binding once both parties sign it.',
    'The tenant must comply with all clauses in the lease.',
    'If either party breaches the agreement, a fine may apply.',
    'The deposit will be refunded within 30 days of moving out.',
    'You may waive this right in writing at any time.'
  ],
  grammar: {
    title: 'Modais de Obrigação (Shall/Must/May) e Voz Passiva em Textos Legais',
    rules: [
      '"Shall" em textos legais expressa obrigação formal, mais forte e formal que "will": The landlord shall provide notice.',
      '"Must" expressa uma obrigação direta e forte: The tenant must comply with the lease.',
      '"May" expressa permissão ou direito (não obrigação): You may waive this right in writing.',
      'Textos legais usam muita voz passiva para focar na ação, não em quem age: "The deposit will be refunded" (em vez de "We will refund the deposit").'
    ],
    table: {
      headers: ['Modal/Estrutura', 'Função', 'Exemplo', 'Observação'],
      rows: [
        ['Shall', 'obrigação formal (contratos)', 'The landlord shall provide notice.', 'comum em contratos, raro na fala'],
        ['Must', 'obrigação forte e direta', 'The tenant must comply.', 'mais usado no dia a dia que "shall"'],
        ['May', 'permissão / direito', 'You may waive this right.', 'não é obrigação, é possibilidade permitida'],
        ['Voz passiva (will be + particípio)', 'foco na ação, não no agente', 'The deposit will be refunded.', 'padrão em textos legais e formais']
      ]
    }
  },
  quiz: [
    { q: 'The landlord ___ provide 30 days\' notice.', a: 'shall', opts: ['shall', 'can', 'like', 'is'] },
    { q: 'The tenant ___ comply with all clauses in the lease.', a: 'must', opts: ['must', 'may', 'is', 'do'] },
    { q: 'You ___ waive this right in writing at any time.', a: 'may', opts: ['may', 'shall', 'do', 'are'] },
    { q: 'The deposit ___ refunded within 30 days. (voz passiva)', a: 'will be', opts: ['will be', 'will', 'is', 'has'] },
    { q: 'By signing this, you ___ to the terms and conditions.', a: 'agree', opts: ['agree', 'agreed', 'agreeing', 'agrees'] }
  ],
  speak: [
    'By signing this, you agree to the terms and conditions.',
    "The landlord shall provide 30 days' notice before termination.",
    'You are entitled to a full refund within 7 days.',
    'This contract is legally binding once both parties sign it.',
    'The deposit will be refunded within 30 days of moving out.'
  ]
};

// ---- New chapter 22 ----
const newChapter = {
  id: 22,
  name: 'Academic & Legal English',
  color: 'from-rose-600 to-pink-500',
  icon: '📜',
  lessons: [101, 102]
};

// ---- Assemble ----
TRAIL.push(lesson101Trail, lesson102Trail);
CHAPTERS.push(newChapter);
JADSON_LESSONS.push(lesson101Full, lesson102Full);
TRAIL_GAMES[101] = 'fill_blank_game.html';
TRAIL_GAMES[102] = 'hangman_game.html';

learnHtml = replaceConst(learnHtml, 'TRAIL', TRAIL);
learnHtml = replaceConst(learnHtml, 'CHAPTERS', CHAPTERS);
lessonsHtml = replaceConst(lessonsHtml, 'JADSON_LESSONS', JADSON_LESSONS);
lessonsHtml = replaceConst(lessonsHtml, 'TRAIL_GAMES', TRAIL_GAMES);

fs.writeFileSync(learnPath, learnHtml, 'utf8');
fs.writeFileSync(lessonsPath, lessonsHtml, 'utf8');

console.log('Done. TRAIL length now:', TRAIL.length, '| CHAPTERS length now:', CHAPTERS.length);
console.log('JADSON_LESSONS length now:', JADSON_LESSONS.length, '| TRAIL_GAMES keys now:', Object.keys(TRAIL_GAMES).length);
