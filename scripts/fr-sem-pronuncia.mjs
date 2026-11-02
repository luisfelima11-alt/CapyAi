// Regra do Luis (19/out/2026): o curso de francês NÃO mostra a pronúncia escrita
// ("Bonjour [bon-JUR]"). Este módulo tira isso de tudo que os geradores produzem
// (aulas fr_aula_XX.html e trilha lessons_fr_data.js). Rode os geradores, nunca
// edite os HTML/JS gerados à mão: a pronúncia voltaria na próxima geração.
//
//   node scripts/build-fr-aulas.mjs && node scripts/build-fr-trail.mjs && node scripts/build-lesson-data.js

const COLCHETES = /\s*\[[^\]\[]{1,60}\]/g;

// Frases que eram só pronúncia e precisam de outra redação (trecho original → novo).
const REESCRITAS = [
  ['"OU" tem som de "U" brasileiro: Bonjour = [bon-JUR], vous = [VU], oui = [UÍ].', '"OU" tem som de "U" brasileiro: Bonjour, vous, oui.'],
  ['quase sempre são mudas: Salut = [sa-LÜ], très = [TRÉ].', 'quase sempre são mudas: Salut, très.'],
  ['Sozinhos: six [SIS], dix [DIS]. Antes de consoante, o som final cai: six livres [si LIVR], dix cafés [di ka-FÊ].', 'Sozinhos: six e dix soam o S/X final. Antes de consoante, o som final cai: six livres, dix cafés.'],
  ['"Neuf" [nœf] vira som de V antes de "ans" e "heures": neuf ans [nœ-VÃ].', '"Neuf" vira som de V antes de "ans" e "heures": neuf ans.'],
  ['Não diga [dis ka-FÊ] — antes de consoante é [di ka-FÊ].', 'Antes de consoante o "x" de "dix" não soa: dix cafés, e não "dis cafés".'],
  ['La femme (a esposa/mulher) pronuncia-se [la FAM] (com som de A, mesmo escrita com E!).', 'La femme (a esposa/mulher): o "e" tem som de A, mesmo escrito com E!'],
  ['Le fils (o filho) pronuncia-se [lã FIS] (com o S final bem audível!).', 'Le fils (o filho): o S final é bem audível!'],
  ['La fille (a filha) pronuncia-se [la FÍI] (os dois L têm som de I longo, sem som de L).', 'La fille (a filha): os dois L têm som de I longo, sem som de L.'],
  ['Nunca pronuncie "femme" como [fêm] nem "fille" como [fí-lhe].', 'Nunca pronuncie "femme" com som de "ê" nem "fille" com som de "lhe".'],
  ['Guarde este trio sonoro: femme = [FAM], fils = [FIS], fille = [FÍI]!', 'Guarde este trio sonoro: femme, fils, fille!'],
  ['Mars (março) pronuncia-se o S final bem claro: [MÁRS].', 'Mars (março): o S final é bem claro.'],
  ['Août (agosto) pronuncia-se como uma única sílaba: [ÚT] (o A é mudo e o T final soa!).', 'Août (agosto) pronuncia-se como uma única sílaba (o A é mudo e o T final soa!).'],
  ['Não pronuncie o "A" de "août" — diga apenas [ÚT]!', 'Não pronuncie o "A" de "août": ele é mudo!'],
  ['o E central é mudo: pronuncia-se [sam-DI] em duas sílabas!', 'o E central é mudo: são duas sílabas!'],
  ['Dizer "Tout droit" com T pronunciado — lembre-se: tout droit = [tu DRUÁ], mas à droite = [a DRUÁT] (com T pronunciado)!', 'Dizer "Tout droit" com T pronunciado — lembre-se: em "tout droit" o T é mudo, mas em "à droite" o T é pronunciado!'],
];

// Quizzes "como se pronuncia...?" cujas alternativas eram a pronúncia escrita.
// lição → [trecho da pergunta, alternativas (a certa é a primeira)]
const QUIZZES = {
  2: [/dix euros/, ['O X soa como Z', 'O X soa como S', 'O X soa como K', 'O X fica mudo']],
  4: [/femme/, ['O E soa como A', 'O E soa como Ê', 'O E soa como I', 'O E soa como Ô']],
  7: [/août/, ['O A é mudo e o T soa', 'O A soa e o T fica mudo', 'Soam o A, o U e o T', 'Soa como "ôt"']],
  9: [/hiver/, ['O H é mudo e o R final soa', 'O H é mudo e o R final também', 'O H soa como R', 'Termina em som de N']],
};

export function limpaTexto(t) {
  let s = t;
  for (const [de, para] of REESCRITAS) s = s.split(de).join(para);
  // Só mexe em frase que tinha pronúncia: o resto (inclusive o espaço francês antes de ? e !) fica intacto.
  if (!/\[[^\]\[]{1,60}\]/.test(s) && !/ & Pronúncia\b/.test(s) && s === t) return s;
  return s
    .replace(COLCHETES, '')
    .replace(/\s*\(\s*\)/g, '')
    .replace(/ & Pronúncia\b/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/:\s*\./g, '.');
}

export function limpaDeep(x) {
  if (typeof x === 'string') return limpaTexto(x);
  if (Array.isArray(x)) return x.map(limpaDeep);
  if (x && typeof x === 'object') {
    const o = {};
    for (const k of Object.keys(x)) if (k !== 'phon') o[k] = limpaDeep(x[k]);
    return o;
  }
  return x;
}

// Tabela da trilha com uma coluna inteira de pronúncia: a coluna sai.
export function limpaTabela(t) {
  const i = t.headers.findIndex(h => /^Pron[úu]ncia$/i.test(h.trim()));
  if (i < 0) return limpaDeep(t);
  return limpaDeep({ headers: t.headers.filter((_, j) => j !== i), rows: t.rows.map(r => r.filter((_, j) => j !== i)) });
}

export function semPronuncia(lessons) {
  return lessons.map(l => {
    const c = structuredClone(l);
    const qz = QUIZZES[c.num];
    if (qz) {
      const q = c.quiz.find(q => qz[0].test(q.q) && /pronunc|soa/i.test(q.q));
      if (!q) throw new Error(`fr-sem-pronuncia: quiz de pronúncia da lição ${c.num} não encontrado`);
      q.opts = [...qz[1]];
      q.a = qz[1][0];
    }
    return limpaDeep(c);
  });
}

// Confere o resultado: sobrou colchete de pronúncia, resposta fora das alternativas ou alternativa vazia?
export function confere(lessons) {
  const erros = [];
  const walk = (x, onde) => {
    if (typeof x === 'string') { if (/\[[^\]\[]{2,60}\]/.test(x) && !/\[(Auxiliar|Particípio)/.test(x)) erros.push(`${onde}: sobrou colchete: ${x.slice(0, 80)}`); }
    else if (Array.isArray(x)) x.forEach((y, i) => walk(y, `${onde}[${i}]`));
    else if (x && typeof x === 'object') for (const k of Object.keys(x)) { if (k === 'phon') erros.push(`${onde}.phon ainda existe`); walk(x[k], `${onde}.${k}`); }
  };
  lessons.forEach(l => {
    walk(l, `lição ${l.num ?? l.id}`);
    for (const q of l.quiz || []) {
      if (q.opts && !q.opts.includes(q.a)) erros.push(`lição ${l.num ?? l.id}: resposta fora das alternativas: ${q.q.slice(0, 50)}`);
      if (q.opts && q.opts.some(o => !o || !o.trim() || /^\s*\(/.test(o))) erros.push(`lição ${l.num ?? l.id}: alternativa vazia: ${q.q.slice(0, 50)}`);
    }
  });
  return erros;
}
