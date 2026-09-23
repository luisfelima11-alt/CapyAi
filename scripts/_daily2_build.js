const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function extractBalancedRange(src, name) {
  const marker = 'const ' + name + ' = ';
  const start = src.indexOf(marker);
  if (start === -1) throw new Error('not found: ' + name);
  const openIdx = start + marker.length;
  const openChar = src[openIdx];
  const closeChar = openChar === '[' ? ']' : '}';
  let depth = 0;
  let i = openIdx;
  let inStr = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === openChar) depth++;
    else if (c === closeChar) {
      depth--;
      if (depth === 0) { i++; break; }
    }
  }
  return { code: src.slice(openIdx, i), start: openIdx, end: i };
}

function replaceConst(src, name, newValue) {
  const { start, end } = extractBalancedRange(src, name);
  const newCode = JSON.stringify(newValue, null, 2);
  return src.slice(0, start) + newCode + src.slice(end);
}

// ---------- New content ----------

const CHAPTER_23 = {
  id: 23,
  name: "Boardroom English",
  color: "from-teal-600 to-cyan-500",
  icon: "💼",
  lessons: [103, 104]
};

const TRAIL_103 = {
  id: 103,
  emoji: "🎤",
  title: "Persuasive Business Presentations",
  chapter: 23,
  game: "word_search_game.html",
  xp: 330
};

const TRAIL_104 = {
  id: 104,
  emoji: "🤝",
  title: "Diplomatic Emails & Negotiation Language",
  chapter: 23,
  game: "sound_seekers_game.html",
  xp: 335
};

const LESSON_103 = {
  id: 103,
  title: "Persuasive Business Presentations",
  emoji: "🎤",
  verbs: ["To Persuade", "To Emphasize", "To Highlight", "To Convince"],
  vocab: [
    { en: "Persuasive", pt: "Persuasivo" },
    { en: "Audience", pt: "Plateia, público" },
    { en: "Key takeaway", pt: "Principal conclusão, mensagem central" },
    { en: "Call to action", pt: "Chamada para ação" },
    { en: "Rule of three", pt: "Regra dos três (recurso retórico)" },
    { en: "Rhetorical question", pt: "Pergunta retórica" },
    { en: "Compelling", pt: "Convincente, cativante" },
    { en: "To engage the audience", pt: "Envolver o público" },
    { en: "Body language", pt: "Linguagem corporal" },
    { en: "Eye contact", pt: "Contato visual" },
    { en: "Pitch", pt: "Discurso de apresentação/venda" },
    { en: "Elevator pitch", pt: "Discurso rápido de apresentação" },
    { en: "Value proposition", pt: "Proposta de valor" },
    { en: "Bullet point", pt: "Tópico (em lista)" },
    { en: "Visual aid", pt: "Recurso visual" },
    { en: "To drive the point home", pt: "Deixar o ponto bem claro" },
    { en: "Anecdote", pt: "Anedota, história curta" },
    { en: "Credibility", pt: "Credibilidade" },
    { en: "To build rapport", pt: "Criar conexão, empatia" },
    { en: "Q&A session", pt: "Sessão de perguntas e respostas" },
    { en: "To address concerns", pt: "Tratar/responder preocupações" },
    { en: "Momentum", pt: "Impulso, ritmo" },
    { en: "To wrap up", pt: "Encerrar, finalizar" },
    { en: "Impactful", pt: "Impactante" },
    { en: "Storytelling", pt: "Técnica de contar histórias" },
    { en: "To captivate", pt: "Cativar" },
    { en: "Persuasion technique", pt: "Técnica de persuasão" },
    { en: "To reinforce", pt: "Reforçar" },
    { en: "Stakeholder", pt: "Parte interessada" },
    { en: "To resonate with someone", pt: "Repercutir, conectar com alguém" }
  ],
  expressions: [
    { expr: "It is the data that convinces investors", meaning: "É o dado que convence os investidores", example: "It is the data that convinces investors, not promises." },
    { expr: "What matters most is customer trust", meaning: "O que mais importa é a confiança do cliente", example: "What matters most to our clients is reliability." },
    { expr: "Let's wrap up with a clear call to action", meaning: "Vamos encerrar com uma chamada para ação clara", example: "Let's wrap up with a clear call to action." },
    { expr: "The reason we succeeded is that we listened", meaning: "O motivo do nosso sucesso é que nós escutamos", example: "The reason we succeeded is that we listened to feedback." }
  ],
  sentences: [
    "It is the data that convinces investors, not promises.",
    "What matters most to our clients is reliability.",
    "All we need today is your approval to move forward.",
    "The reason we succeeded is that we listened to feedback.",
    "This pitch highlights three things: speed, quality, and trust.",
    "Let's wrap up with a clear call to action.",
    "A compelling story can build rapport faster than any chart.",
    "What we need now is a decision, not more delays."
  ],
  grammar: {
    title: "Cleft Sentences for Emphasis (Ênfase em Apresentações)",
    rules: [
      "Use \"It + be + [elemento enfatizado] + that/who...\" para destacar uma parte específica da frase: It is the data that convinces investors.",
      "Use \"What + sujeito + verbo + is/was...\" para enfatizar o ponto principal, deixando-o por último: What matters most is customer trust.",
      "Cleft sentences deslocam o foco para o início ou para depois do verbo \"be\", tornando a apresentação mais impactante e persuasiva.",
      "Combine cleft sentences com a \"rule of three\" para reforçar a mensagem central: What we need is speed, clarity, and confidence."
    ],
    table: {
      headers: ["Estrutura", "Função", "Exemplo", "Observação"],
      rows: [
        ["It is/was + X + that...", "enfatiza um elemento específico", "It was the price that convinced them.", "X é o foco da frase"],
        ["What + S + V + is/was...", "enfatiza a ideia principal", "What matters is long-term growth.", "coloca o ponto-chave no final"],
        ["All + S + V + is/was...", "enfatiza uma única necessidade", "All we need is your approval.", "variação do \"What\" cleft"],
        ["The reason (why)... is that...", "enfatiza a causa/razão", "The reason we succeeded is that we listened.", "usado para justificar decisões"]
      ]
    }
  },
  quiz: [
    { q: "___ is the data that convinces investors.", a: "It", opts: ["It", "What", "This", "There"] },
    { q: "___ matters most is customer trust.", a: "What", opts: ["What", "It", "Who", "Where"] },
    { q: "The reason we succeeded ___ that we listened.", a: "is", opts: ["is", "was", "be", "being"] },
    { q: "What we need now ___ a decision.", a: "is", opts: ["is", "are", "be", "was"] },
    { q: "It ___ the price that convinced them.", a: "was", opts: ["was", "is", "were", "did"] }
  ],
  speak: [
    "It is the data that convinces investors, not promises.",
    "What matters most to our clients is reliability.",
    "The reason we succeeded is that we listened to feedback.",
    "Let's wrap up with a clear call to action.",
    "What we need now is a decision, not more delays."
  ]
};

const LESSON_104 = {
  id: 104,
  title: "Diplomatic Emails & Negotiation Language",
  emoji: "🤝",
  verbs: ["To Request", "To Apologize", "To Clarify", "To Propose"],
  vocab: [
    { en: "Diplomatic", pt: "Diplomático" },
    { en: "Tactful", pt: "Sutil, com tato" },
    { en: "To phrase", pt: "Formular, expressar (algo)" },
    { en: "Concern", pt: "Preocupação" },
    { en: "To follow up", pt: "Dar continuidade, retomar contato" },
    { en: "Attachment", pt: "Anexo" },
    { en: "To CC someone", pt: "Copiar alguém (em e-mail)" },
    { en: "Deadline", pt: "Prazo" },
    { en: "To reschedule", pt: "Remarcar" },
    { en: "Kind regards", pt: "Atenciosamente (fechamento de e-mail)" },
    { en: "To apologize for the inconvenience", pt: "Pedir desculpas pelo transtorno" },
    { en: "Compromise", pt: "Acordo, meio-termo" },
    { en: "Counteroffer", pt: "Contraproposta" },
    { en: "To negotiate terms", pt: "Negociar termos" },
    { en: "Win-win situation", pt: "Situação em que todos ganham" },
    { en: "Common ground", pt: "Ponto em comum, consenso" },
    { en: "To reach an agreement", pt: "Chegar a um acordo" },
    { en: "Trade-off", pt: "Compensação, concessão" },
    { en: "Leverage", pt: "Vantagem, poder de barganha" },
    { en: "To push back", pt: "Resistir, contra-argumentar" },
    { en: "Bottom line", pt: "Resultado final, ponto essencial" },
    { en: "Flexibility", pt: "Flexibilidade" },
    { en: "To escalate an issue", pt: "Levar um problema a um nível superior" },
    { en: "Stakeholder", pt: "Parte interessada" },
    { en: "To follow protocol", pt: "Seguir o protocolo" },
    { en: "Non-negotiable", pt: "Inegociável" },
    { en: "To convey a message", pt: "Transmitir uma mensagem" },
    { en: "Miscommunication", pt: "Falha de comunicação" },
    { en: "To smooth things over", pt: "Suavizar, contornar uma situação" },
    { en: "Goodwill", pt: "Boa vontade" }
  ],
  expressions: [
    { expr: "I was wondering if it would be possible to...", meaning: "Eu estava pensando se seria possível...", example: "I was wondering if it would be possible to move our meeting." },
    { expr: "Would you mind sending over the updated file?", meaning: "Você se importaria de enviar o arquivo atualizado?", example: "Would you mind sending over the updated file?" },
    { expr: "I completely understand your concern, however...", meaning: "Eu entendo completamente sua preocupação, no entanto...", example: "I completely understand your concern, however we need more time." },
    { expr: "If it's not too much trouble, could we reschedule?", meaning: "Se não for muito incômodo, poderíamos remarcar?", example: "If it's not too much trouble, could we reschedule for Friday?" }
  ],
  sentences: [
    "I was wondering if it would be possible to move our meeting.",
    "Would you mind sending over the updated file?",
    "I completely understand your concern, however we need more time.",
    "If it's not too much trouble, could we reschedule for Friday?",
    "Could you clarify this point before we proceed?",
    "We appreciate your patience while we resolve this issue.",
    "Let's find a compromise that works for both sides.",
    "I look forward to hearing your thoughts. Kind regards."
  ],
  grammar: {
    title: "Softening Language & Indirect Requests (E-mails Diplomáticos)",
    rules: [
      "Para pedidos educados e indiretos, use \"Would you mind + gerúndio\" em vez do imperativo direto: Would you mind sending the file? (não \"Send me the file.\")",
      "\"I was wondering if...\" suaviza um pedido, tornando-o menos direto: I was wondering if we could reschedule the call.",
      "Modais como \"could/would/might\" soam mais diplomáticos que \"can/will\" em contextos profissionais: Could you clarify this point? é mais educado que Can you clarify this point?",
      "Condicionais de cortesia como \"If it's not too much trouble...\" ou \"If possible...\" suavizam pedidos e preservam o relacionamento profissional."
    ],
    table: {
      headers: ["Estrutura", "Função", "Exemplo", "Observação"],
      rows: [
        ["Would you mind + gerúndio?", "pedido educado", "Would you mind resending this?", "mais formal que \"Can you...\""],
        ["I was wondering if...", "pedido indireto", "I was wondering if you could help.", "soa menos impositivo"],
        ["Could/Might + verbo", "modal diplomático", "Could you clarify this point?", "mais suave que \"Can\""],
        ["If it's not too much trouble...", "condicional de cortesia", "If it's not too much trouble, could we reschedule?", "protege o relacionamento profissional"]
      ]
    }
  },
  quiz: [
    { q: "___ you mind sending over the updated file?", a: "Would", opts: ["Would", "Do", "Are", "Is"] },
    { q: "I was wondering ___ it would be possible to reschedule.", a: "if", opts: ["if", "that", "when", "because"] },
    { q: "___ you clarify this point before we proceed?", a: "Could", opts: ["Could", "Do", "Are", "Must"] },
    { q: "If it's not too much trouble, ___ we reschedule?", a: "could", opts: ["could", "do", "are", "will"] },
    { q: "Let's find a ___ that works for both sides.", a: "compromise", opts: ["compromise", "conflict", "deadline", "complaint"] }
  ],
  speak: [
    "I was wondering if it would be possible to move our meeting.",
    "Would you mind sending over the updated file?",
    "Could you clarify this point before we proceed?",
    "Let's find a compromise that works for both sides.",
    "I look forward to hearing your thoughts. Kind regards."
  ]
};

// ---------- Apply edits ----------

let learnHtml = fs.readFileSync(path.join(root, 'learn.html'), 'utf8');
let lessonsHtml = fs.readFileSync(path.join(root, 'lessons.html'), 'utf8');

// TRAIL: parse, push, replace
{
  const { code } = extractBalancedRange(learnHtml, 'TRAIL');
  const TRAIL = JSON.parse(code);
  TRAIL.push(TRAIL_103, TRAIL_104);
  learnHtml = replaceConst(learnHtml, 'TRAIL', TRAIL);
}

// CHAPTERS: parse, push, replace
{
  const { code } = extractBalancedRange(learnHtml, 'CHAPTERS');
  const CHAPTERS = JSON.parse(code);
  CHAPTERS.push(CHAPTER_23);
  learnHtml = replaceConst(learnHtml, 'CHAPTERS', CHAPTERS);
}

// JADSON_LESSONS: parse, push, replace
{
  const { code } = extractBalancedRange(lessonsHtml, 'JADSON_LESSONS');
  const JADSON_LESSONS = JSON.parse(code);
  JADSON_LESSONS.push(LESSON_103, LESSON_104);
  lessonsHtml = replaceConst(lessonsHtml, 'JADSON_LESSONS', JADSON_LESSONS);
}

// TRAIL_GAMES: parse, add keys, replace
{
  const { code } = extractBalancedRange(lessonsHtml, 'TRAIL_GAMES');
  const TRAIL_GAMES = JSON.parse(code);
  TRAIL_GAMES["103"] = "word_search_game.html";
  TRAIL_GAMES["104"] = "sound_seekers_game.html";
  lessonsHtml = replaceConst(lessonsHtml, 'TRAIL_GAMES', TRAIL_GAMES);
}

fs.writeFileSync(path.join(root, 'learn.html'), learnHtml, 'utf8');
fs.writeFileSync(path.join(root, 'lessons.html'), lessonsHtml, 'utf8');

console.log('Build complete. learn.html and lessons.html updated.');
