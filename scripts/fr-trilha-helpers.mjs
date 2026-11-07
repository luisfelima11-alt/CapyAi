// Monta uma unidade da trilha de francês a partir da forma compacta usada em
// fr-trilha-part3.mjs (213–224) e fr-trilha-part4.mjs (225–242).
//
// Forma compacta:
//   vocab:       'francês|português'
//   expressions: [expressão, significado, exemplo]
//   quiz:        [pergunta, resposta certa, [3 erradas], porquê]
//   grammar:     { title, rules: [[título, explicação], ...], headers, rows }
//
// A resposta certa vai para uma posição que varia de pergunta para pergunta
// (nunca sempre a primeira), de forma determinística: rodar de novo não muda nada.

export function unidade(u) {
  const faltando = ['id', 'num', 'title', 'emoji', 'sub', 'aula', 'block', 'verbs', 'vocab', 'expressions', 'sentences', 'grammar', 'quiz', 'speak']
    .filter(k => u[k] === undefined);
  if (faltando.length) throw new Error(`unidade ${u.id}: faltando ${faltando.join(', ')}`);
  const contagem = { verbs: 5, vocab: 18, expressions: 6, sentences: 10, quiz: 10, speak: 8 };
  for (const [k, n] of Object.entries(contagem)) {
    if (u[k].length !== n) throw new Error(`unidade ${u.id}: ${k} tem ${u[k].length}, precisa de ${n}`);
  }
  if (u.grammar.rules.length !== 3) throw new Error(`unidade ${u.id}: são 3 regras`);
  return {
    id: u.id,
    title: u.title,
    emoji: u.emoji,
    lang: 'fr',
    verbs: u.verbs,
    vocab: u.vocab.map(v => {
      const [en, pt] = v.split('|');
      if (!en || !pt) throw new Error(`unidade ${u.id}: vocab sem "|": ${v}`);
      return { en: en.trim(), pt: pt.trim() };
    }),
    expressions: u.expressions.map(([expr, meaning, example]) => ({ expr, meaning, example })),
    sentences: u.sentences,
    grammar: {
      title: u.grammar.title,
      rules: u.grammar.rules.map(([t, x]) => `<b>${t}:</b> ${x}`),
      table: { headers: u.grammar.headers, rows: u.grammar.rows },
    },
    quiz: u.quiz.map(([q, a, erradas, why], i) => {
      if (erradas.length !== 3) throw new Error(`unidade ${u.id}: pergunta ${i + 1} precisa de 3 erradas`);
      if (erradas.includes(a)) throw new Error(`unidade ${u.id}: pergunta ${i + 1} tem a certa entre as erradas`);
      const opts = [...erradas];
      opts.splice((u.id + i) % 4, 0, a);
      return { q, a, opts, why };
    }),
    speak: u.speak,
  };
}

// Entrada do TRAIL_FR do learn_fr.html.
export function entradaDaTrilha(u) {
  return { id: u.id, num: u.num, block: u.block, emoji: u.emoji, title: u.title, sub: u.sub, aula: u.aula };
}
