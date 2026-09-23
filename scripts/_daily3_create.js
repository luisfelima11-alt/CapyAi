// Cria as 2 novas lições da rotina diária (ids 109, 110) como data/lessons/<id>.json
// e regenera data/lessons-index.json via build-lesson-data.js.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const lessons = [
  {
    id: 109,
    title: "Irony, Sarcasm & Saying One Thing, Meaning Another",
    emoji: "😏",
    verbs: ["To Imply", "To Mock", "To Tease", "To Exaggerate"],
    vocab: [
      { en: "Irony", pt: "Ironia" },
      { en: "Sarcasm", pt: "Sarcasmo" },
      { en: "Wit", pt: "Presença de espírito, sagacidade" },
      { en: "Deadpan", pt: "Tom sério e inexpressivo (ao fazer piada)" },
      { en: "Mockery", pt: "Zombaria" },
      { en: "Tone", pt: "Tom (de voz)" },
      { en: "Pun", pt: "Trocadilho" },
      { en: "Understatement", pt: "Eufemismo, subestimação proposital" },
      { en: "Exaggeration", pt: "Exagero" },
      { en: "Facetious", pt: "Brincalhão, não sério" },
      { en: "Snarky", pt: "Sarcástico, respondão" },
      { en: "Dry humor", pt: "Humor seco" },
      { en: "Eye roll", pt: "Revirar os olhos" },
      { en: "Air quotes", pt: "Aspas no ar (gesto)" },
      { en: "Backhanded compliment", pt: "Elogio disfarçado de ofensa" },
      { en: "Roast", pt: "Zoar alguém de forma afetuosa" },
      { en: "Wordplay", pt: "Jogo de palavras" },
      { en: "Satire", pt: "Sátira" },
      { en: "Mock", pt: "Zombar, imitar debochando" },
      { en: "Tease", pt: "Provocar, brincar com" },
      { en: "Bittersweet", pt: "Agridoce" },
      { en: "Cynical", pt: "Cínico" },
      { en: "To poke fun at", pt: "Zoar, tirar sarro de" },
      { en: "Rhetorical question", pt: "Pergunta retórica" },
      { en: "Contradiction", pt: "Contradição" },
      { en: "Hyperbole", pt: "Hipérbole" },
      { en: "Literal", pt: "Literal" },
      { en: "Figurative", pt: "Figurado" },
      { en: "Straight face", pt: "Cara séria (sem rir)" },
      { en: "Punchline", pt: "Desfecho da piada" }
    ],
    expressions: [
      { expr: "Yeah, right", meaning: "Expressão de sarcasmo ou descrença", example: "\"You'll finish that report by Friday?\" \"Yeah, right.\"" },
      { expr: "Oh, great", meaning: "Usado ironicamente para expressar frustração", example: "\"Oh, great, another Monday meeting.\"" },
      { expr: "No kidding", meaning: "Sem brincadeira, obviamente (pode soar sarcástico)", example: "\"It's raining again.\" \"No kidding, I'm soaked.\"" },
      { expr: "Bless your heart", meaning: "Expressão que pode soar gentil, mas às vezes é sutilmente condescendente ou sarcástica", example: "\"You tried your best. Bless your heart.\"" }
    ],
    sentences: [
      "\"Oh, that's just perfect,\" she said, staring at the flat tire.",
      "\"Nice job,\" he said sarcastically after I dropped the tray.",
      "\"Well, this is fun,\" she muttered, stuck in traffic for two hours.",
      "\"You're a real genius,\" he joked, after I locked my keys in the car.",
      "\"I just love waking up early,\" she said with a deadpan expression.",
      "\"Wow, what a surprise,\" he said, rolling his eyes at the bad news.",
      "\"Sure, take your time,\" she said, tapping her foot impatiently.",
      "\"Great, more homework,\" he sighed, only half joking."
    ],
    grammar: {
      title: "Tag Questions for Sarcasm and Rhetorical Emphasis",
      rules: [
        "Tag questions (afirmativa + negativa curta) normalmente pedem confirmação, mas em tom sarcástico servem para enfatizar o oposto do que é dito: \"Oh, that's a great idea, isn't it?\" (quer dizer que NÃO é uma boa ideia).",
        "A regra gramatical continua a mesma: afirmativa → tag negativa; negativa → tag positiva. \"You didn't finish it, did you?\"",
        "Advérbios como \"really\", \"totally\" e \"so\" antes do adjetivo aumentam o efeito irônico: \"That's REALLY helpful, isn't it?\"",
        "Perguntas retóricas com \"Isn't it obvious?\" ou \"Who would've thought?\" não esperam resposta — servem para comentar algo de forma irônica."
      ],
      table: {
        headers: ["Statement", "Tag Question", "Sarcastic Meaning"],
        rows: [
          ["That's a great plan.", "That's a great plan, isn't it?", "Implica que o plano é ruim"],
          ["You worked really hard.", "You worked really hard, didn't you?", "Implica que a pessoa não se esforçou"],
          ["This traffic is fun.", "This traffic is fun, isn't it?", "Expressa irritação, não diversão"],
          ["He's never late.", "He's never late, is he?", "Implica que ele está sempre atrasado"]
        ]
      }
    },
    quiz: [
      { q: "What does \"Yeah, right\" usually express?", a: "Sarcasm or disbelief", opts: ["Sarcasm or disbelief", "Strong agreement", "A polite request", "Genuine surprise"] },
      { q: "Complete the sarcastic tag question: \"That's a great plan, ___?\"", a: "isn't it", opts: ["isn't it", "is it", "doesn't it", "wasn't it"] },
      { q: "What is a \"backhanded compliment\"?", a: "Um elogio que na verdade insulta", opts: ["Um elogio que na verdade insulta", "Um elogio muito sincero", "Um pedido de desculpas", "Uma crítica direta"] },
      { q: "Choose the ironic sentence.", a: "\"Oh, great, another Monday meeting.\"", opts: ["\"Oh, great, another Monday meeting.\"", "I'm excited for the meeting today.", "The meeting starts at 9 AM.", "Please schedule the meeting for Monday."] },
      { q: "What's the difference between irony and sarcasm?", a: "Sarcasmo é sempre intencional e mordaz; ironia pode ser situacional ou não intencional", opts: ["Sarcasmo é sempre intencional e mordaz; ironia pode ser situacional ou não intencional", "São exatamente a mesma coisa", "Ironia é sempre engraçada; sarcasmo nunca é", "Sarcasmo só existe por escrito"] }
    ],
    speak: [
      "Say a sentence with genuine meaning, then repeat it sarcastically, changing your tone.",
      "Describe an ironic situation that happened to you (or a friend), starting with 'Ironically, ...'.",
      "Practice a backhanded compliment and then explain what it really means.",
      "Create a sarcastic tag question about the weather today.",
      "Tell a short story where the ending is ironic — different from what you'd expect."
    ],
    lang: "en"
  },
  {
    id: 110,
    title: "Storytelling Techniques: Foreshadowing, Flashbacks & Twists",
    emoji: "🧵",
    verbs: ["To Hint", "To Reveal", "To Recall", "To Twist"],
    vocab: [
      { en: "Foreshadowing", pt: "Prenúncio, indício do que vai acontecer" },
      { en: "Flashback", pt: "Flashback, cena do passado" },
      { en: "Plot twist", pt: "Reviravolta na trama" },
      { en: "Cliffhanger", pt: "Final de suspense" },
      { en: "Narrator", pt: "Narrador(a)" },
      { en: "Unreliable narrator", pt: "Narrador não confiável" },
      { en: "Protagonist", pt: "Protagonista" },
      { en: "Antagonist", pt: "Antagonista" },
      { en: "Climax", pt: "Clímax" },
      { en: "Resolution", pt: "Desfecho" },
      { en: "Subplot", pt: "Subtrama" },
      { en: "Setting", pt: "Cenário, ambientação" },
      { en: "Point of view", pt: "Ponto de vista" },
      { en: "Suspense", pt: "Suspense" },
      { en: "Red herring", pt: "Pista falsa" },
      { en: "Symbolism", pt: "Simbolismo" },
      { en: "Dramatic irony", pt: "Ironia dramática" },
      { en: "Tension", pt: "Tensão" },
      { en: "Pacing", pt: "Ritmo (da narrativa)" },
      { en: "Backstory", pt: "História de fundo" },
      { en: "Reveal", pt: "Revelação" },
      { en: "Twist ending", pt: "Final surpreendente" },
      { en: "Narrative arc", pt: "Arco narrativo" },
      { en: "Chapter", pt: "Capítulo" },
      { en: "Hook", pt: "Gancho (que prende o leitor)" },
      { en: "Buildup", pt: "Preparação, construção (de tensão)" },
      { en: "Epilogue", pt: "Epílogo" },
      { en: "Prologue", pt: "Prólogo" },
      { en: "Anticipation", pt: "Expectativa, antecipação" },
      { en: "Payoff", pt: "Recompensa narrativa (quando algo plantado se resolve)" }
    ],
    expressions: [
      { expr: "Little did she know", meaning: "Expressão usada para criar suspense, indicando que a personagem não sabia o que estava por vir", example: "Little did she know, her best friend was planning a surprise party." },
      { expr: "Out of the blue", meaning: "Do nada, inesperadamente", example: "Out of the blue, he remembered where he'd hidden the letter." },
      { expr: "Come full circle", meaning: "Voltar ao ponto de partida, fechar o ciclo narrativo", example: "The story comes full circle when he returns to his hometown." },
      { expr: "The plot thickens", meaning: "A trama se complica ou fica mais interessante", example: "When the letter arrived, the plot thickened." }
    ],
    sentences: [
      "Little did he know, the stranger had been watching him for weeks.",
      "She had never told anyone the truth, until that rainy afternoon.",
      "Out of the blue, a letter arrived that changed everything.",
      "By the time she reached the door, he had already left.",
      "The old photograph reminded her of a promise she had made long ago.",
      "He had planned every detail, but the story still ended with a twist.",
      "The plot thickened when they discovered the diary had been rewritten.",
      "Everything came full circle when the hero returned to where it all began."
    ],
    grammar: {
      title: "Past Perfect for Flashbacks in Storytelling",
      rules: [
        "Ao narrar no passado (Past Simple) e voltar a um momento anterior (flashback), use o Past Perfect (had + particípio) para mostrar o que aconteceu antes: \"She opened the door. She had forgotten her keys inside.\"",
        "O Past Perfect deixa clara a ordem dos eventos sem precisar repetir \"before/after\": \"He recognized the voice — he had heard it years earlier.\"",
        "Depois que o flashback termina, volte ao Past Simple para continuar a ação principal da história: \"She had lived there as a child. Now she walked through the empty rooms.\"",
        "\"Little did [pronoun] know\" + Past Simple é uma estrutura invertida usada para criar suspense antes de um flashback ou revelação: \"Little did he know, the letter had been sitting there for years.\""
      ],
      table: {
        headers: ["Main Story (Past Simple)", "Flashback (Past Perfect)", "Effect"],
        rows: [
          ["She walked into the house.", "She had grown up there.", "Mostra que ela cresceu lá antes da cena atual"],
          ["He recognized the man.", "He had met him years before.", "Explica como ele já o conhecia"],
          ["They found the old letter.", "Someone had hidden it in the wall.", "Revela um evento anterior à descoberta"],
          ["She smiled at the photo.", "She had almost thrown it away.", "Cria contraste entre o presente e um quase-erro do passado"]
        ]
      }
    },
    quiz: [
      { q: "What is 'foreshadowing'?", a: "Um indício que sugere o que vai acontecer depois na história", opts: ["Um indício que sugere o que vai acontecer depois na história", "Um resumo do final da história", "O nome do narrador", "Um tipo de personagem"] },
      { q: "Complete with the correct tense for a flashback: \"She smiled at the photo. She ___ almost thrown it away.\"", a: "had", opts: ["had", "has", "have", "was"] },
      { q: "What does 'little did she know' signal?", a: "Que a personagem não sabia o que estava por vir — cria suspense", opts: ["Que a personagem não sabia o que estava por vir — cria suspense", "Que a personagem sabia de tudo", "Uma pergunta direta ao leitor", "O fim da história"] },
      { q: "What is a 'cliffhanger'?", a: "Um final que deixa o leitor em suspense, sem resolução completa", opts: ["Um final que deixa o leitor em suspense, sem resolução completa", "O clímax da história", "O narrador principal", "Um tipo de personagem secundário"] },
      { q: "Choose the sentence using Past Perfect correctly for a flashback.", a: "He recognized the voice — he had heard it years earlier.", opts: ["He recognized the voice — he had heard it years earlier.", "He recognized the voice — he hears it years earlier.", "He recognized the voice — he heard it years earlier before.", "He recognized the voice — he has heard it years earlier."] }
    ],
    speak: [
      "Tell a short story about your day, adding one flashback using Past Perfect.",
      "Describe a movie or book with a great plot twist, without spoiling the ending completely.",
      "Create a one-sentence cliffhanger to end a story.",
      "Use 'little did I know' to describe a moment that surprised you later.",
      "Retell a childhood memory as if it were a flashback in a novel."
    ],
    lang: "en"
  }
];

for (const lesson of lessons) {
  const outPath = path.join(ROOT, 'data', 'lessons', lesson.id + '.json');
  fs.writeFileSync(outPath, JSON.stringify(lesson), 'utf8');
  console.log('wrote', outPath);
}
