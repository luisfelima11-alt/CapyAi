// ════════════════════════════════════════════════════════════════════════════
// lessons_interview_data.js — Trilha Diária do curso de Entrevista de Emprego
// ════════════════════════════════════════════════════════════════════════════
// GERADO por scripts/build-trilha-interview.mjs a partir de
// scripts/interview-trilha-a.json e -b.json. Não edite este arquivo à mão:
// edite os JSON e rode o construtor de novo.
//
// Faixa de ids: 601-612 (en 1-110 · fr 201-212 · tr 301-336 · int 401-440 ·
// gps 501-508 já estão ocupadas).
//
// ⚠️  Este arquivo é FONTE DE COMPILAÇÃO, não é lido pelo navegador. Depois de
//     mudar qualquer coisa aqui é obrigatório rodar:
//         node scripts/build-lesson-data.js
//     senão a lição não existe para o app — sem erro nenhum.
// ════════════════════════════════════════════════════════════════════════════

const LESSONS_INTERVIEW = [
  {
    "id": 601,
    "title": "Before the Call",
    "emoji": "🎧",
    "verbs": [
      "To Hear",
      "To See",
      "To Freeze",
      "To Refresh"
    ],
    "vocab": [
      {
        "en": "camera",
        "pt": "câmera"
      },
      {
        "en": "microphone",
        "pt": "microfone"
      },
      {
        "en": "headphones",
        "pt": "fones de ouvido"
      },
      {
        "en": "webcam",
        "pt": "webcam"
      },
      {
        "en": "screen",
        "pt": "tela"
      },
      {
        "en": "laptop",
        "pt": "notebook"
      },
      {
        "en": "volume",
        "pt": "volume"
      },
      {
        "en": "mute",
        "pt": "mudo"
      },
      {
        "en": "to unmute",
        "pt": "tirar do mudo"
      },
      {
        "en": "link",
        "pt": "link"
      },
      {
        "en": "waiting room",
        "pt": "sala de espera"
      },
      {
        "en": "host",
        "pt": "anfitrião"
      },
      {
        "en": "connection",
        "pt": "conexão"
      },
      {
        "en": "signal",
        "pt": "sinal"
      },
      {
        "en": "wifi",
        "pt": "wifi"
      },
      {
        "en": "network",
        "pt": "rede"
      },
      {
        "en": "browser",
        "pt": "navegador"
      },
      {
        "en": "tab",
        "pt": "aba"
      },
      {
        "en": "lighting",
        "pt": "iluminação"
      },
      {
        "en": "echo",
        "pt": "eco"
      },
      {
        "en": "delay",
        "pt": "atraso, delay"
      },
      {
        "en": "frozen",
        "pt": "travado"
      },
      {
        "en": "blurry",
        "pt": "embaçado"
      },
      {
        "en": "clear",
        "pt": "nítido, claro"
      },
      {
        "en": "stable",
        "pt": "estável"
      },
      {
        "en": "early",
        "pt": "cedo"
      },
      {
        "en": "on time",
        "pt": "na hora"
      },
      {
        "en": "ready",
        "pt": "pronto"
      },
      {
        "en": "nearby",
        "pt": "por perto"
      },
      {
        "en": "comfortable",
        "pt": "confortável"
      }
    ],
    "expressions": [
      {
        "expr": "Can you hear me?",
        "meaning": "Você consegue me ouvir?",
        "example": "Hi! Can you hear me? I think my microphone is low."
      },
      {
        "expr": "Let me turn my camera on",
        "meaning": "Deixa eu ligar minha câmera",
        "example": "Oh, sorry. Let me turn my camera on."
      },
      {
        "expr": "Is that better?",
        "meaning": "Melhorou?",
        "example": "I moved closer to the router. Is that better?"
      },
      {
        "expr": "You're on mute",
        "meaning": "Você está no mudo",
        "example": "Sorry, I can't hear you. You're on mute."
      }
    ],
    "sentences": [
      "Can you hear me now?",
      "I can hear you, but I can't see your video.",
      "Let me turn my camera on.",
      "My screen just froze for a second.",
      "Can you refresh the page?",
      "I usually join five minutes early.",
      "Your connection looks stable now.",
      "I can see you clearly."
    ],
    "grammar": {
      "title": "can / can't: o que você consegue fazer",
      "rules": [
        "can + verbo na forma base, sem to: I can hear you. Nunca \"I can to hear\".",
        "can não muda na terceira pessoa: He can see. Nunca \"He cans\".",
        "Negativa: can't (= cannot) + verbo base: I can't see your video.",
        "Pergunta: Can + sujeito + verbo base: Can you hear me? Nunca \"Do you can hear me?\"."
      ],
      "table": {
        "headers": [
          "Sujeito",
          "Afirmativo",
          "Negativo",
          "Pergunta"
        ],
        "rows": [
          [
            "I",
            "I can hear",
            "I can't hear",
            "Can I hear?"
          ],
          [
            "You",
            "You can hear",
            "You can't hear",
            "Can you hear?"
          ],
          [
            "He / She / It",
            "He can hear",
            "He can't hear",
            "Can he hear?"
          ],
          [
            "We / They",
            "They can hear",
            "They can't hear",
            "Can they hear?"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "___ you hear me?",
        "a": "Can",
        "opts": [
          "Can",
          "Do",
          "Are",
          "Does"
        ]
      },
      {
        "q": "I ___ see your video.",
        "a": "can't",
        "opts": [
          "can't",
          "don't can",
          "not can",
          "doesn't"
        ]
      },
      {
        "q": "He ___ see the screen.",
        "a": "can",
        "opts": [
          "can",
          "cans",
          "can to",
          "is can"
        ]
      },
      {
        "q": "Let me ___ my camera on.",
        "a": "turn",
        "opts": [
          "turn",
          "to turn",
          "turning",
          "turns"
        ]
      },
      {
        "q": "\"Can you see me?\" — \"Yes, I ___.\"",
        "a": "can",
        "opts": [
          "can",
          "do",
          "am",
          "see"
        ]
      }
    ],
    "speak": [
      "Can you hear me?",
      "I can't see your video.",
      "Let me turn my camera on.",
      "Is that better?",
      "I can see you clearly now."
    ]
  },
  {
    "id": 602,
    "title": "Introducing Yourself",
    "emoji": "🙋",
    "verbs": [
      "To Graduate",
      "To Specialize",
      "To Pursue",
      "To Study"
    ],
    "vocab": [
      {
        "en": "background",
        "pt": "trajetória, formação"
      },
      {
        "en": "field",
        "pt": "área de atuação"
      },
      {
        "en": "degree",
        "pt": "diploma, graduação"
      },
      {
        "en": "university",
        "pt": "universidade"
      },
      {
        "en": "course",
        "pt": "curso"
      },
      {
        "en": "training",
        "pt": "treinamento"
      },
      {
        "en": "certificate",
        "pt": "certificado"
      },
      {
        "en": "diploma",
        "pt": "diploma"
      },
      {
        "en": "major",
        "pt": "área principal de estudo"
      },
      {
        "en": "internship",
        "pt": "estágio"
      },
      {
        "en": "trainee",
        "pt": "trainee"
      },
      {
        "en": "summary",
        "pt": "resumo"
      },
      {
        "en": "introduction",
        "pt": "apresentação"
      },
      {
        "en": "motivation",
        "pt": "motivação"
      },
      {
        "en": "passion",
        "pt": "paixão"
      },
      {
        "en": "challenge",
        "pt": "desafio"
      },
      {
        "en": "milestone",
        "pt": "marco"
      },
      {
        "en": "career path",
        "pt": "trajetória profissional"
      },
      {
        "en": "in a nutshell",
        "pt": "em resumo"
      },
      {
        "en": "so far",
        "pt": "até agora"
      },
      {
        "en": "abroad",
        "pt": "no exterior"
      },
      {
        "en": "currently",
        "pt": "atualmente"
      },
      {
        "en": "previously",
        "pt": "anteriormente"
      },
      {
        "en": "recently",
        "pt": "recentemente"
      },
      {
        "en": "almost",
        "pt": "quase"
      },
      {
        "en": "about",
        "pt": "cerca de"
      },
      {
        "en": "around",
        "pt": "por volta de"
      },
      {
        "en": "since",
        "pt": "desde"
      },
      {
        "en": "for",
        "pt": "há, por (duração)"
      },
      {
        "en": "how long",
        "pt": "há quanto tempo"
      }
    ],
    "expressions": [
      {
        "expr": "Let me tell you a little about myself",
        "meaning": "Deixa eu falar um pouco sobre mim",
        "example": "Sure! Let me tell you a little about myself."
      },
      {
        "expr": "I've always wanted...",
        "meaning": "Eu sempre quis...",
        "example": "I've always wanted a bigger challenge."
      },
      {
        "expr": "In a nutshell...",
        "meaning": "Em resumo...",
        "example": "In a nutshell: I started in sales and moved into marketing."
      },
      {
        "expr": "That's what made me apply",
        "meaning": "Foi isso que me fez me candidatar",
        "example": "I wanted to grow. That's what made me apply."
      }
    ],
    "sentences": [
      "I've worked in marketing for almost five years.",
      "I've been in this field since 2021.",
      "How long have you been in your current field?",
      "I have a degree in Business Administration.",
      "I specialized in digital marketing.",
      "I've always wanted a bigger challenge.",
      "In a nutshell: I started in sales.",
      "That's been my biggest milestone so far."
    ],
    "grammar": {
      "title": "Present Perfect com for e since",
      "rules": [
        "Present Perfect = have / has + particípio: I have worked (I've worked).",
        "Use para algo que começou no passado e CONTINUA hoje. Em português a gente usa o presente: \"trabalho há cinco anos\".",
        "for + duração (for five years, for two months). since + ponto de partida (since 2021, since March).",
        "A pergunta é How long have you...? — com estados, use have been: How long have you been here?"
      ],
      "table": {
        "headers": [
          "Você quer dizer",
          "Estrutura",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "Há 5 anos",
            "for + período",
            "I've worked here for five years.",
            "quanto tempo durou"
          ],
          [
            "Desde 2021",
            "since + momento",
            "I've been here since 2021.",
            "quando começou"
          ],
          [
            "Quanto tempo?",
            "How long have you...?",
            "How long have you worked here?",
            "have + particípio"
          ],
          [
            "Já alguma vez",
            "Have you ever...?",
            "Have you ever managed a team?",
            "sem data"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I've worked in marketing ___ five years.",
        "a": "for",
        "opts": [
          "for",
          "since",
          "ago",
          "from"
        ]
      },
      {
        "q": "I've been in this field ___ 2021.",
        "a": "since",
        "opts": [
          "since",
          "for",
          "during",
          "from"
        ]
      },
      {
        "q": "How long ___ you worked here?",
        "a": "have",
        "opts": [
          "have",
          "do",
          "did",
          "are"
        ]
      },
      {
        "q": "He ___ worked here since March.",
        "a": "has",
        "opts": [
          "has",
          "have",
          "is",
          "was"
        ]
      },
      {
        "q": "I ___ in marketing for five years. (e ainda trabalho)",
        "a": "have worked",
        "opts": [
          "have worked",
          "work",
          "worked",
          "am working"
        ]
      }
    ],
    "speak": [
      "I've worked in marketing for five years.",
      "I've been in this field since 2021.",
      "How long have you been in your current field?",
      "I have a degree in Business Administration.",
      "In a nutshell: I started in sales."
    ]
  },
  {
    "id": 603,
    "title": "Your Work History",
    "emoji": "📋",
    "verbs": [
      "To Manage",
      "To Organize",
      "To Increase",
      "To Report"
    ],
    "vocab": [
      {
        "en": "accomplishment",
        "pt": "conquista"
      },
      {
        "en": "responsibility",
        "pt": "responsabilidade"
      },
      {
        "en": "duty",
        "pt": "função, dever"
      },
      {
        "en": "task",
        "pt": "tarefa"
      },
      {
        "en": "team",
        "pt": "equipe"
      },
      {
        "en": "intern",
        "pt": "estagiário"
      },
      {
        "en": "launch",
        "pt": "lançamento"
      },
      {
        "en": "campaign",
        "pt": "campanha"
      },
      {
        "en": "client",
        "pt": "cliente"
      },
      {
        "en": "account",
        "pt": "conta (de cliente)"
      },
      {
        "en": "budget",
        "pt": "orçamento"
      },
      {
        "en": "result",
        "pt": "resultado"
      },
      {
        "en": "target",
        "pt": "meta"
      },
      {
        "en": "content calendar",
        "pt": "calendário de conteúdo"
      },
      {
        "en": "in charge of",
        "pt": "responsável por"
      },
      {
        "en": "overall",
        "pt": "no total, no geral"
      },
      {
        "en": "directly",
        "pt": "diretamente"
      },
      {
        "en": "previous",
        "pt": "anterior"
      },
      {
        "en": "former",
        "pt": "antigo, ex-"
      },
      {
        "en": "laid off",
        "pt": "demitido (por corte)"
      },
      {
        "en": "notice",
        "pt": "aviso prévio"
      },
      {
        "en": "full-time",
        "pt": "tempo integral"
      },
      {
        "en": "part-time",
        "pt": "meio período"
      },
      {
        "en": "freelance",
        "pt": "freelance"
      },
      {
        "en": "remote",
        "pt": "remoto"
      },
      {
        "en": "on-site",
        "pt": "presencial"
      },
      {
        "en": "shift",
        "pt": "turno"
      },
      {
        "en": "percent",
        "pt": "por cento"
      },
      {
        "en": "ago",
        "pt": "atrás (tempo)"
      },
      {
        "en": "between",
        "pt": "entre"
      }
    ],
    "expressions": [
      {
        "expr": "I was in charge of...",
        "meaning": "Eu era responsável por...",
        "example": "I was in charge of the content calendar."
      },
      {
        "expr": "I reported directly to...",
        "meaning": "Eu me reportava diretamente a...",
        "example": "I reported directly to the marketing director."
      },
      {
        "expr": "My biggest accomplishment was...",
        "meaning": "Minha maior conquista foi...",
        "example": "My biggest accomplishment was increasing our followers by forty percent."
      },
      {
        "expr": "I left six months ago",
        "meaning": "Eu saí há seis meses",
        "example": "I left six months ago, when the team closed."
      }
    ],
    "sentences": [
      "I worked at Sunrise Media for two years.",
      "I managed social media campaigns.",
      "I organized two big product launches.",
      "I left six months ago.",
      "I've worked in marketing for five years overall.",
      "I managed a team of three interns last year.",
      "I increased our followers by forty percent.",
      "I was in charge of the content calendar."
    ],
    "grammar": {
      "title": "Past Simple × Present Perfect",
      "rules": [
        "Acabou? Past Simple: I worked there for two years. (não trabalho mais)",
        "Continua? Present Perfect: I've worked in marketing for five years. (ainda trabalho)",
        "Data ou \"ago\" SEMPRE fecham o período: I left six months ago. Nunca \"I have left... ago\".",
        "A resposta curta repete o auxiliar: Have you...? → Yes, I have. Did you...? → Yes, I did."
      ],
      "table": {
        "headers": [
          "Situação",
          "Tempo verbal",
          "Exemplo",
          "Marcador"
        ],
        "rows": [
          [
            "Emprego que acabou",
            "Past Simple",
            "I worked at Sunrise Media.",
            "in 2020, last year"
          ],
          [
            "Carreira que continua",
            "Present Perfect",
            "I've worked in marketing for five years.",
            "for, since"
          ],
          [
            "Quando exatamente",
            "Past Simple",
            "I left six months ago.",
            "ago"
          ],
          [
            "Já fez alguma vez",
            "Present Perfect",
            "Have you ever managed a team?",
            "ever"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I ___ at Sunrise Media for two years. (saí de lá)",
        "a": "worked",
        "opts": [
          "worked",
          "have worked",
          "work",
          "am working"
        ]
      },
      {
        "q": "I ___ six months ago.",
        "a": "left",
        "opts": [
          "left",
          "have left",
          "leave",
          "was leaving"
        ]
      },
      {
        "q": "\"Have you ever managed a team?\" — \"Yes, I ___.\"",
        "a": "have",
        "opts": [
          "have",
          "did",
          "do",
          "was"
        ]
      },
      {
        "q": "\"Did you work with clients?\" — \"Yes, I ___.\"",
        "a": "did",
        "opts": [
          "did",
          "have",
          "do",
          "was"
        ]
      },
      {
        "q": "I increased our followers ___ forty percent.",
        "a": "by",
        "opts": [
          "by",
          "in",
          "at",
          "for"
        ]
      }
    ],
    "speak": [
      "I worked at Sunrise Media for two years.",
      "I left six months ago.",
      "I've worked in marketing for five years overall.",
      "I was in charge of the content calendar.",
      "I increased our followers by forty percent."
    ]
  },
  {
    "id": 604,
    "title": "Your Strong Points",
    "emoji": "💪",
    "verbs": [
      "To Lead",
      "To Support",
      "To Solve",
      "To Deliver"
    ],
    "vocab": [
      {
        "en": "strong point",
        "pt": "ponto forte"
      },
      {
        "en": "quality",
        "pt": "qualidade"
      },
      {
        "en": "organized",
        "pt": "organizado"
      },
      {
        "en": "detail-oriented",
        "pt": "detalhista"
      },
      {
        "en": "reliable",
        "pt": "confiável"
      },
      {
        "en": "punctual",
        "pt": "pontual"
      },
      {
        "en": "flexible",
        "pt": "flexível"
      },
      {
        "en": "proactive",
        "pt": "proativo"
      },
      {
        "en": "patient",
        "pt": "paciente"
      },
      {
        "en": "creative",
        "pt": "criativo"
      },
      {
        "en": "curious",
        "pt": "curioso"
      },
      {
        "en": "hard-working",
        "pt": "trabalhador"
      },
      {
        "en": "team player",
        "pt": "bom de equipe"
      },
      {
        "en": "problem-solver",
        "pt": "resolvedor de problemas"
      },
      {
        "en": "quick learner",
        "pt": "aprende rápido"
      },
      {
        "en": "self-taught",
        "pt": "autodidata"
      },
      {
        "en": "independent",
        "pt": "independente"
      },
      {
        "en": "careful",
        "pt": "cuidadoso"
      },
      {
        "en": "confident",
        "pt": "confiante"
      },
      {
        "en": "calm",
        "pt": "calmo"
      },
      {
        "en": "honest",
        "pt": "honesto"
      },
      {
        "en": "committed",
        "pt": "comprometido"
      },
      {
        "en": "motivated",
        "pt": "motivado"
      },
      {
        "en": "focused",
        "pt": "focado"
      },
      {
        "en": "efficient",
        "pt": "eficiente"
      },
      {
        "en": "accurate",
        "pt": "preciso"
      },
      {
        "en": "consistent",
        "pt": "consistente"
      },
      {
        "en": "supportive",
        "pt": "prestativo"
      },
      {
        "en": "approachable",
        "pt": "acessível"
      },
      {
        "en": "than",
        "pt": "do que"
      }
    ],
    "expressions": [
      {
        "expr": "I'd say my strongest point is...",
        "meaning": "Eu diria que meu ponto mais forte é...",
        "example": "I'd say my strongest point is organization."
      },
      {
        "expr": "Compared to my old team...",
        "meaning": "Comparado à minha antiga equipe...",
        "example": "Compared to my old team, I'm more detail-oriented."
      },
      {
        "expr": "For example, I always...",
        "meaning": "Por exemplo, eu sempre...",
        "example": "For example, I always finish tasks before the deadline."
      },
      {
        "expr": "That's one of my strengths",
        "meaning": "Esse é um dos meus pontos fortes",
        "example": "I stay calm under pressure. That's one of my strengths."
      }
    ],
    "sentences": [
      "I'm more organized than my old team.",
      "My reports are the clearest in the team.",
      "I'm more detail-oriented than most people.",
      "I finish tasks faster than my deadlines.",
      "I'd say my strongest point is organization.",
      "She is a better listener than I am.",
      "This is the most important skill for the role.",
      "I'm a quick learner and a team player."
    ],
    "grammar": {
      "title": "Comparativos: -er than e more ... than",
      "rules": [
        "Adjetivo curto ganha -er + than: faster than, easier than (o y vira i), bigger than (dobra a consoante).",
        "Adjetivo longo usa more + than: more organized than, more detail-oriented than.",
        "Nunca junte os dois. \"More easier\" e \"more faster\" estão errados.",
        "Irregulares: good → better, bad → worse, far → further. E o reforço é much, nunca very: much easier."
      ],
      "table": {
        "headers": [
          "Adjetivo",
          "Tipo",
          "Comparativo",
          "Exemplo"
        ],
        "rows": [
          [
            "fast",
            "curto",
            "faster than",
            "I work faster than before."
          ],
          [
            "easy",
            "termina em -y",
            "easier than",
            "It's easier than last year."
          ],
          [
            "organized",
            "longo",
            "more organized than",
            "I'm more organized than my team."
          ],
          [
            "good",
            "irregular",
            "better than",
            "She is better than me at design."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I'm more organized ___ my old team.",
        "a": "than",
        "opts": [
          "than",
          "that",
          "then",
          "of"
        ]
      },
      {
        "q": "It's much ___ now than last year.",
        "a": "easier",
        "opts": [
          "easier",
          "more easy",
          "more easier",
          "easiest"
        ]
      },
      {
        "q": "Qual é o comparativo de \"good\"?",
        "a": "better",
        "opts": [
          "better",
          "gooder",
          "more good",
          "best"
        ]
      },
      {
        "q": "I'm ___ detail-oriented than most people.",
        "a": "more",
        "opts": [
          "more",
          "most",
          "much",
          "many"
        ]
      },
      {
        "q": "It's ___ easier now. (reforço)",
        "a": "much",
        "opts": [
          "much",
          "very",
          "so",
          "too"
        ]
      }
    ],
    "speak": [
      "I'm more organized than my old team.",
      "My reports are the clearest in the team.",
      "I'd say my strongest point is organization.",
      "I finish tasks faster than my deadlines.",
      "I'm a quick learner and a team player."
    ]
  },
  {
    "id": 605,
    "title": "Areas to Improve",
    "emoji": "📈",
    "verbs": [
      "To Admit",
      "To Hide",
      "To Practise",
      "To Delegate"
    ],
    "vocab": [
      {
        "en": "area to improve",
        "pt": "ponto a melhorar"
      },
      {
        "en": "weak point",
        "pt": "ponto fraco"
      },
      {
        "en": "public speaking",
        "pt": "falar em público"
      },
      {
        "en": "time management",
        "pt": "gestão de tempo"
      },
      {
        "en": "planner",
        "pt": "agenda, planner"
      },
      {
        "en": "procrastination",
        "pt": "procrastinação"
      },
      {
        "en": "perfectionism",
        "pt": "perfeccionismo"
      },
      {
        "en": "impatience",
        "pt": "impaciência"
      },
      {
        "en": "delegation",
        "pt": "delegação"
      },
      {
        "en": "prioritization",
        "pt": "priorização"
      },
      {
        "en": "pressure",
        "pt": "pressão"
      },
      {
        "en": "stress",
        "pt": "estresse"
      },
      {
        "en": "mistake",
        "pt": "erro"
      },
      {
        "en": "correction",
        "pt": "correção"
      },
      {
        "en": "progress",
        "pt": "progresso"
      },
      {
        "en": "step by step",
        "pt": "passo a passo"
      },
      {
        "en": "little by little",
        "pt": "pouco a pouco"
      },
      {
        "en": "workshop",
        "pt": "oficina, workshop"
      },
      {
        "en": "mentor",
        "pt": "mentor"
      },
      {
        "en": "habit",
        "pt": "hábito"
      },
      {
        "en": "routine",
        "pt": "rotina"
      },
      {
        "en": "checklist",
        "pt": "lista de verificação"
      },
      {
        "en": "reminder",
        "pt": "lembrete"
      },
      {
        "en": "honestly",
        "pt": "sinceramente"
      },
      {
        "en": "gradually",
        "pt": "gradualmente"
      },
      {
        "en": "lately",
        "pt": "ultimamente"
      },
      {
        "en": "used to",
        "pt": "costumava"
      },
      {
        "en": "demanding",
        "pt": "exigente"
      },
      {
        "en": "weakest",
        "pt": "o mais fraco"
      },
      {
        "en": "the most",
        "pt": "o mais"
      }
    ],
    "expressions": [
      {
        "expr": "It used to be...",
        "meaning": "Costumava ser...",
        "example": "Public speaking used to be my weakest skill."
      },
      {
        "expr": "I'm getting better at it",
        "meaning": "Estou melhorando nisso",
        "example": "I use a planner, and I'm getting better at it every week."
      },
      {
        "expr": "Honestly, ...",
        "meaning": "Sinceramente, ...",
        "example": "Honestly, time management is my weakest point right now."
      },
      {
        "expr": "That's exactly why...",
        "meaning": "É exatamente por isso que...",
        "example": "It's more demanding. That's exactly why it's more exciting."
      }
    ],
    "sentences": [
      "Public speaking used to be my weakest skill.",
      "Time management is my weakest point at the moment.",
      "It's much easier now than it was two years ago.",
      "I'm using a planner this year.",
      "I'm getting better at it every week.",
      "Admitting a mistake is easier than hiding it.",
      "This is the most difficult part of my job.",
      "Communication is the most important skill here."
    ],
    "grammar": {
      "title": "Superlativos e used to",
      "rules": [
        "Superlativo curto: the + adjetivo + -est: the clearest, the biggest, the weakest.",
        "Superlativo longo: the most + adjetivo: the most important, the most difficult.",
        "Depois do superlativo vem in (grupo, lugar), não of: the best in the team.",
        "used to + verbo base = costumava: It used to be hard. Nunca \"use to be\" na afirmativa."
      ],
      "table": {
        "headers": [
          "Adjetivo",
          "Comparativo",
          "Superlativo",
          "Exemplo"
        ],
        "rows": [
          [
            "weak",
            "weaker than",
            "the weakest",
            "It was my weakest skill."
          ],
          [
            "clear",
            "clearer than",
            "the clearest",
            "My reports are the clearest."
          ],
          [
            "important",
            "more important than",
            "the most important",
            "It's the most important skill."
          ],
          [
            "good",
            "better than",
            "the best",
            "She is the best in the team."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "It was my ___ skill.",
        "a": "weakest",
        "opts": [
          "weakest",
          "most weak",
          "weaker",
          "weakiest"
        ]
      },
      {
        "q": "Communication is the ___ important skill.",
        "a": "most",
        "opts": [
          "most",
          "more",
          "much",
          "best"
        ]
      },
      {
        "q": "Public speaking ___ be my weak point.",
        "a": "used to",
        "opts": [
          "used to",
          "use to",
          "uses to",
          "using to"
        ]
      },
      {
        "q": "She is the best ___ the team.",
        "a": "in",
        "opts": [
          "in",
          "of",
          "at",
          "from"
        ]
      },
      {
        "q": "It's ___ easier now than before.",
        "a": "much",
        "opts": [
          "much",
          "very",
          "more",
          "most"
        ]
      }
    ],
    "speak": [
      "Public speaking used to be my weakest skill.",
      "Time management is my weakest point at the moment.",
      "It's much easier now than it was two years ago.",
      "I'm getting better at it every week.",
      "Communication is the most important skill here."
    ]
  },
  {
    "id": 606,
    "title": "What Would You Do?",
    "emoji": "🤔",
    "verbs": [
      "To Disagree",
      "To Prioritize",
      "To Handle",
      "To Apologize"
    ],
    "vocab": [
      {
        "en": "scenario",
        "pt": "cenário"
      },
      {
        "en": "situation",
        "pt": "situação"
      },
      {
        "en": "conflict",
        "pt": "conflito"
      },
      {
        "en": "disagreement",
        "pt": "desentendimento"
      },
      {
        "en": "complaint",
        "pt": "reclamação"
      },
      {
        "en": "solution",
        "pt": "solução"
      },
      {
        "en": "priority",
        "pt": "prioridade"
      },
      {
        "en": "impact",
        "pt": "impacto"
      },
      {
        "en": "consequence",
        "pt": "consequência"
      },
      {
        "en": "decision",
        "pt": "decisão"
      },
      {
        "en": "option",
        "pt": "opção"
      },
      {
        "en": "approach",
        "pt": "abordagem"
      },
      {
        "en": "calmly",
        "pt": "com calma"
      },
      {
        "en": "respectfully",
        "pt": "com respeito"
      },
      {
        "en": "immediately",
        "pt": "imediatamente"
      },
      {
        "en": "right away",
        "pt": "na hora"
      },
      {
        "en": "meanwhile",
        "pt": "enquanto isso"
      },
      {
        "en": "instead",
        "pt": "em vez disso"
      },
      {
        "en": "unless",
        "pt": "a menos que"
      },
      {
        "en": "in that case",
        "pt": "nesse caso"
      },
      {
        "en": "tight",
        "pt": "apertado (prazo)"
      },
      {
        "en": "urgent",
        "pt": "urgente"
      },
      {
        "en": "unhappy",
        "pt": "insatisfeito"
      },
      {
        "en": "upset",
        "pt": "chateado"
      },
      {
        "en": "fair",
        "pt": "justo"
      },
      {
        "en": "reasonable",
        "pt": "razoável"
      },
      {
        "en": "realistic",
        "pt": "realista"
      },
      {
        "en": "what if",
        "pt": "e se"
      },
      {
        "en": "would",
        "pt": "(condicional)"
      },
      {
        "en": "separately",
        "pt": "separadamente"
      }
    ],
    "expressions": [
      {
        "expr": "If that happened, I would...",
        "meaning": "Se isso acontecesse, eu...",
        "example": "If that happened, I would listen carefully first."
      },
      {
        "expr": "I'd listen carefully first",
        "meaning": "Eu ouviria com atenção primeiro",
        "example": "If a client was unhappy, I'd listen carefully first."
      },
      {
        "expr": "I'd admit it right away",
        "meaning": "Eu admitiria na hora",
        "example": "I'd admit it right away. Hiding a mistake is worse."
      },
      {
        "expr": "If I were you...",
        "meaning": "Se eu fosse você...",
        "example": "If I were you, I'd ask the team lead."
      }
    ],
    "sentences": [
      "What would you do if a client wasn't happy?",
      "If that happened, I would listen carefully first.",
      "I'd share my opinion respectfully.",
      "I'd rank them by deadline and impact.",
      "I'd admit it right away.",
      "If I didn't know how to solve it, I'd ask a teammate.",
      "If I had more time, I'd finish it today.",
      "If I were you, I'd do the same."
    ],
    "grammar": {
      "title": "Second Conditional: o hipotético",
      "rules": [
        "Estrutura: if + passado simples, would + verbo base. If a client wasn't happy, I would listen.",
        "NUNCA use would depois do if. \"If a client would be unhappy\" está errado.",
        "O passado aqui não fala do passado — fala do irreal agora: If I had more time... (mas não tenho).",
        "Na fala, would vira 'd: I'd listen, he'd ask. E a expressão fixa é If I were you, nunca \"If I was you\"."
      ],
      "table": {
        "headers": [
          "Metade da frase",
          "Forma",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "Condição (if...)",
            "passado simples",
            "If a client wasn't happy...",
            "nunca would aqui"
          ],
          [
            "Resultado",
            "would + base",
            "...I would listen carefully.",
            "sem to"
          ],
          [
            "Resultado (falado)",
            "'d + base",
            "...I'd listen carefully.",
            "contração"
          ],
          [
            "Conselho pronto",
            "If I were you...",
            "If I were you, I'd ask.",
            "were para todos"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "What would you do if a client ___ happy?",
        "a": "wasn't",
        "opts": [
          "wasn't",
          "wouldn't be",
          "isn't",
          "won't be"
        ]
      },
      {
        "q": "If that happened, I ___ listen first.",
        "a": "would",
        "opts": [
          "would",
          "will",
          "would to",
          "am going to"
        ]
      },
      {
        "q": "Depois de \"would\", o verbo fica:",
        "a": "listen",
        "opts": [
          "listen",
          "listened",
          "to listen",
          "listening"
        ]
      },
      {
        "q": "If I ___ you, I'd accept it.",
        "a": "were",
        "opts": [
          "were",
          "was",
          "am",
          "would be"
        ]
      },
      {
        "q": "If I ___ more time, I'd finish it today.",
        "a": "had",
        "opts": [
          "had",
          "have",
          "would have",
          "will have"
        ]
      }
    ],
    "speak": [
      "What would you do if a client wasn't happy?",
      "If that happened, I would listen carefully first.",
      "I'd share my opinion respectfully.",
      "I'd admit it right away.",
      "If I were you, I'd do the same."
    ]
  },
  {
    "id": 607,
    "title": "Your Room on Camera",
    "emoji": "🏠",
    "verbs": [
      "To Sit",
      "To Stand",
      "To Tidy",
      "To Show"
    ],
    "vocab": [
      {
        "en": "bookshelf",
        "pt": "estante"
      },
      {
        "en": "shelf",
        "pt": "prateleira"
      },
      {
        "en": "desk",
        "pt": "mesa de trabalho"
      },
      {
        "en": "chair",
        "pt": "cadeira"
      },
      {
        "en": "sofa",
        "pt": "sofá"
      },
      {
        "en": "window",
        "pt": "janela"
      },
      {
        "en": "wall",
        "pt": "parede"
      },
      {
        "en": "door",
        "pt": "porta"
      },
      {
        "en": "picture",
        "pt": "quadro"
      },
      {
        "en": "frame",
        "pt": "moldura"
      },
      {
        "en": "lamp",
        "pt": "luminária"
      },
      {
        "en": "plant",
        "pt": "planta"
      },
      {
        "en": "curtain",
        "pt": "cortina"
      },
      {
        "en": "carpet",
        "pt": "tapete"
      },
      {
        "en": "cupboard",
        "pt": "armário"
      },
      {
        "en": "drawer",
        "pt": "gaveta"
      },
      {
        "en": "mug",
        "pt": "caneca"
      },
      {
        "en": "notebook",
        "pt": "caderno"
      },
      {
        "en": "cable",
        "pt": "cabo"
      },
      {
        "en": "natural light",
        "pt": "luz natural"
      },
      {
        "en": "tidy",
        "pt": "arrumado"
      },
      {
        "en": "messy",
        "pt": "bagunçado"
      },
      {
        "en": "quiet",
        "pt": "silencioso"
      },
      {
        "en": "noisy",
        "pt": "barulhento"
      },
      {
        "en": "bright",
        "pt": "claro, iluminado"
      },
      {
        "en": "dark",
        "pt": "escuro"
      },
      {
        "en": "cosy",
        "pt": "aconchegante"
      },
      {
        "en": "spare room",
        "pt": "quarto extra"
      },
      {
        "en": "home office",
        "pt": "escritório em casa"
      },
      {
        "en": "neighbour",
        "pt": "vizinho"
      }
    ],
    "expressions": [
      {
        "expr": "There's a bookshelf right behind me",
        "meaning": "Tem uma estante bem atrás de mim",
        "example": "I'm at my desk, and there's a bookshelf right behind me."
      },
      {
        "expr": "I'm sitting at my desk",
        "meaning": "Estou sentado na minha mesa",
        "example": "I'm sitting at my desk in my home office."
      },
      {
        "expr": "Sorry about the noise",
        "meaning": "Desculpe o barulho",
        "example": "Sorry about the noise! My neighbour is working outside."
      },
      {
        "expr": "I get a lot of natural light",
        "meaning": "Recebo bastante luz natural",
        "example": "There's a big window, so I get a lot of natural light."
      }
    ],
    "sentences": [
      "There's a bookshelf right behind me.",
      "There are about forty books on the shelf.",
      "I'm sitting at my desk.",
      "There's a big window on my left.",
      "My neighbour is doing some work outside.",
      "My dog is sleeping on the sofa.",
      "The room is quiet and bright today.",
      "I usually work from here, but this week I'm working from the kitchen."
    ],
    "grammar": {
      "title": "there is / there are + Present Continuous",
      "rules": [
        "\"Tem\" de existência é there is (singular) ou there are (plural). NUNCA have: \"Have a bookshelf\" está errado.",
        "There's = There is. Negativa: There isn't a door. / There aren't any books.",
        "Present Continuous = am/is/are + verbo-ing, para o que acontece agora: I'm sitting at my desk.",
        "O verbo to be não pode sumir: \"I sitting\" está errado. É I am sitting."
      ],
      "table": {
        "headers": [
          "Você quer dizer",
          "Estrutura",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "Existe uma coisa",
            "There is / There's",
            "There's a window on my left.",
            "singular"
          ],
          [
            "Existem várias",
            "There are",
            "There are forty books.",
            "plural"
          ],
          [
            "Estou fazendo agora",
            "am/is/are + -ing",
            "I'm sitting at my desk.",
            "to be obrigatório"
          ],
          [
            "Faço normalmente",
            "present simple",
            "I usually work from here.",
            "hábito"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "___ a bookshelf behind me.",
        "a": "There's",
        "opts": [
          "There's",
          "Have",
          "It has",
          "There have"
        ]
      },
      {
        "q": "___ forty books on the shelf.",
        "a": "There are",
        "opts": [
          "There are",
          "There is",
          "There has",
          "It are"
        ]
      },
      {
        "q": "I ___ sitting at my desk.",
        "a": "am",
        "opts": [
          "am",
          "is",
          "are",
          "be"
        ]
      },
      {
        "q": "My dog ___ sleeping on the sofa.",
        "a": "is",
        "opts": [
          "is",
          "are",
          "am",
          "be"
        ]
      },
      {
        "q": "I ___ work from here. (rotina)",
        "a": "usually",
        "opts": [
          "usually",
          "am usually",
          "usually am",
          "be usually"
        ]
      }
    ],
    "speak": [
      "There's a bookshelf right behind me.",
      "There are about forty books on the shelf.",
      "I'm sitting at my desk.",
      "There's a big window on my left.",
      "The room is quiet and bright today."
    ]
  },
  {
    "id": 608,
    "title": "Where Things Are",
    "emoji": "📍",
    "verbs": [
      "To Put",
      "To Place",
      "To Hang",
      "To Face"
    ],
    "vocab": [
      {
        "en": "behind",
        "pt": "atrás de"
      },
      {
        "en": "in front of",
        "pt": "em frente a"
      },
      {
        "en": "next to",
        "pt": "ao lado de"
      },
      {
        "en": "beside",
        "pt": "ao lado de"
      },
      {
        "en": "across from",
        "pt": "do outro lado de"
      },
      {
        "en": "opposite",
        "pt": "em frente, oposto"
      },
      {
        "en": "between",
        "pt": "entre (dois)"
      },
      {
        "en": "among",
        "pt": "entre (vários)"
      },
      {
        "en": "above",
        "pt": "acima de"
      },
      {
        "en": "below",
        "pt": "abaixo de"
      },
      {
        "en": "under",
        "pt": "embaixo de"
      },
      {
        "en": "over",
        "pt": "sobre, por cima"
      },
      {
        "en": "on top of",
        "pt": "em cima de"
      },
      {
        "en": "at the back",
        "pt": "no fundo"
      },
      {
        "en": "in the corner",
        "pt": "no canto"
      },
      {
        "en": "on my left",
        "pt": "à minha esquerda"
      },
      {
        "en": "on my right",
        "pt": "à minha direita"
      },
      {
        "en": "in the middle",
        "pt": "no meio"
      },
      {
        "en": "near",
        "pt": "perto de"
      },
      {
        "en": "far from",
        "pt": "longe de"
      },
      {
        "en": "inside",
        "pt": "dentro"
      },
      {
        "en": "outside",
        "pt": "fora"
      },
      {
        "en": "upstairs",
        "pt": "lá em cima"
      },
      {
        "en": "downstairs",
        "pt": "lá embaixo"
      },
      {
        "en": "somewhere",
        "pt": "em algum lugar"
      },
      {
        "en": "anywhere",
        "pt": "em qualquer lugar"
      },
      {
        "en": "nowhere",
        "pt": "em lugar nenhum"
      },
      {
        "en": "everywhere",
        "pt": "em todo lugar"
      },
      {
        "en": "straight ahead",
        "pt": "em frente"
      },
      {
        "en": "around",
        "pt": "ao redor"
      }
    ],
    "expressions": [
      {
        "expr": "It's right behind me",
        "meaning": "Está bem atrás de mim",
        "example": "The bookshelf? It's right behind me."
      },
      {
        "expr": "On my left / on my right",
        "meaning": "À minha esquerda / à minha direita",
        "example": "There's a window on my left and a door on my right."
      },
      {
        "expr": "Across from my desk",
        "meaning": "Em frente à minha mesa",
        "example": "There's a door across from my desk."
      },
      {
        "expr": "In the corner of the room",
        "meaning": "No canto do cômodo",
        "example": "The plant is in the corner of the room."
      }
    ],
    "sentences": [
      "The bookshelf is behind me.",
      "There's a plant in front of the window.",
      "The lamp is next to the laptop.",
      "There's a door across from my desk.",
      "The picture is above the sofa.",
      "My notebook is under the keyboard.",
      "The speaker is in the corner of the shelf.",
      "The window is on my left."
    ],
    "grammar": {
      "title": "Preposições de lugar",
      "rules": [
        "in front of e across from têm DUAS palavras: a segunda nunca cai. \"In front the window\" está errado.",
        "between = entre dois. among = entre vários: between the desk and the wall / among the books.",
        "above / below falam de altura sem tocar. on / under falam de contato ou de estar por baixo.",
        "Com my/your: on my left, on my right, behind me — a pessoa vira o ponto de referência."
      ],
      "table": {
        "headers": [
          "Preposição",
          "Significado",
          "Exemplo",
          "Cuidado"
        ],
        "rows": [
          [
            "behind",
            "atrás de",
            "The shelf is behind me.",
            "—"
          ],
          [
            "in front of",
            "em frente a",
            "A plant in front of the window.",
            "não esqueça o of"
          ],
          [
            "across from",
            "do outro lado de",
            "A door across from my desk.",
            "from, não of"
          ],
          [
            "between",
            "entre dois",
            "Between the desk and the wall.",
            "among para vários"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "There's a plant in front ___ the window.",
        "a": "of",
        "opts": [
          "of",
          "to",
          "from",
          "at"
        ]
      },
      {
        "q": "There's a door ___ my desk.",
        "a": "across from",
        "opts": [
          "across from",
          "across of",
          "across to",
          "in across"
        ]
      },
      {
        "q": "The picture is ___ the sofa. (acima, na parede)",
        "a": "above",
        "opts": [
          "above",
          "under",
          "between",
          "inside"
        ]
      },
      {
        "q": "The desk is ___ the window and the door.",
        "a": "between",
        "opts": [
          "between",
          "among",
          "behind",
          "across"
        ]
      },
      {
        "q": "The window is ___ left.",
        "a": "on my",
        "opts": [
          "on my",
          "in my",
          "at my",
          "to my"
        ]
      }
    ],
    "speak": [
      "The bookshelf is behind me.",
      "There's a plant in front of the window.",
      "There's a door across from my desk.",
      "The picture is above the sofa.",
      "The window is on my left."
    ]
  },
  {
    "id": 609,
    "title": "Questions You Ask",
    "emoji": "🙋‍♀️",
    "verbs": [
      "To Clarify",
      "To Elaborate",
      "To Wonder",
      "To Mind"
    ],
    "vocab": [
      {
        "en": "typical day",
        "pt": "dia típico"
      },
      {
        "en": "role",
        "pt": "função, papel"
      },
      {
        "en": "team structure",
        "pt": "estrutura da equipe"
      },
      {
        "en": "team lead",
        "pt": "líder de equipe"
      },
      {
        "en": "onboarding",
        "pt": "integração"
      },
      {
        "en": "training period",
        "pt": "período de treinamento"
      },
      {
        "en": "probation",
        "pt": "período de experiência"
      },
      {
        "en": "growth opportunity",
        "pt": "oportunidade de crescimento"
      },
      {
        "en": "company culture",
        "pt": "cultura da empresa"
      },
      {
        "en": "values",
        "pt": "valores"
      },
      {
        "en": "remote-friendly",
        "pt": "aberto ao remoto"
      },
      {
        "en": "hybrid",
        "pt": "híbrido"
      },
      {
        "en": "collaborative",
        "pt": "colaborativo"
      },
      {
        "en": "replacement",
        "pt": "substituição"
      },
      {
        "en": "daily routine",
        "pt": "rotina diária"
      },
      {
        "en": "expectations",
        "pt": "expectativas"
      },
      {
        "en": "first month",
        "pt": "primeiro mês"
      },
      {
        "en": "next step",
        "pt": "próximo passo"
      },
      {
        "en": "could you",
        "pt": "você poderia"
      },
      {
        "en": "would you mind",
        "pt": "você se importaria"
      },
      {
        "en": "I was wondering",
        "pt": "eu estava me perguntando"
      },
      {
        "en": "if I may ask",
        "pt": "se eu puder perguntar"
      },
      {
        "en": "typical",
        "pt": "típico"
      },
      {
        "en": "usually",
        "pt": "normalmente"
      },
      {
        "en": "mainly",
        "pt": "principalmente"
      },
      {
        "en": "mostly",
        "pt": "em sua maioria"
      },
      {
        "en": "whether",
        "pt": "se (alternativa)"
      },
      {
        "en": "look like",
        "pt": "parecer, ser como"
      },
      {
        "en": "not at all",
        "pt": "de jeito nenhum (= pode sim)"
      },
      {
        "en": "of course",
        "pt": "claro"
      }
    ],
    "expressions": [
      {
        "expr": "Could you tell me...?",
        "meaning": "Você poderia me dizer...?",
        "example": "Could you tell me what a typical day looks like?"
      },
      {
        "expr": "I was wondering if...",
        "meaning": "Eu estava me perguntando se...",
        "example": "I was wondering if there are growth opportunities."
      },
      {
        "expr": "Would you mind telling me...?",
        "meaning": "Você se importaria de me falar...?",
        "example": "Would you mind telling me about the team structure?"
      },
      {
        "expr": "If I may ask...",
        "meaning": "Se eu puder perguntar...",
        "example": "If I may ask, why is this position open?"
      }
    ],
    "sentences": [
      "Could you tell me what a typical day looks like?",
      "I was wondering if there are growth opportunities.",
      "Would you mind telling me about the team structure?",
      "Could you clarify who I would report to?",
      "I'd like to know what the onboarding process looks like.",
      "Could you elaborate on the main challenge?",
      "I was wondering how you would describe the culture.",
      "Could you tell me where the office is?"
    ],
    "grammar": {
      "title": "Perguntas indiretas (educadas)",
      "rules": [
        "Na pergunta indireta a ordem volta a ser de frase normal: Could you tell me what a typical day LOOKS like? (o does some)",
        "Pergunta de sim/não vira indireta com if ou whether: I was wondering IF there are opportunities.",
        "Could you tell me...? ainda é pergunta e leva ?. Já I'd like to know... e I was wondering... terminam com ponto final.",
        "Depois de Would you mind vem verbo-ing: Would you mind telling me? E a resposta positiva é \"Not at all\"."
      ],
      "table": {
        "headers": [
          "Pergunta direta",
          "Pergunta indireta",
          "O que mudou",
          "Observação"
        ],
        "rows": [
          [
            "What does he do?",
            "Could you tell me what he does?",
            "does some, verbo ganha -s",
            "sem inversão"
          ],
          [
            "Where is the office?",
            "Could you tell me where the office is?",
            "sujeito antes do verbo",
            "sem inversão"
          ],
          [
            "Are there openings?",
            "I was wondering if there are openings.",
            "entra o if",
            "ponto final"
          ],
          [
            "Who will I report to?",
            "Could you clarify who I would report to?",
            "sem inversão",
            "mantém o to"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Could you tell me what a typical day ___ like?",
        "a": "looks",
        "opts": [
          "looks",
          "look",
          "does look",
          "is look"
        ]
      },
      {
        "q": "I was wondering ___ there are growth opportunities.",
        "a": "if",
        "opts": [
          "if",
          "that",
          "are",
          "do"
        ]
      },
      {
        "q": "Would you mind ___ me about the team?",
        "a": "telling",
        "opts": [
          "telling",
          "to tell",
          "tell",
          "told"
        ]
      },
      {
        "q": "Could you tell me where the office ___?",
        "a": "is",
        "opts": [
          "is",
          "is it",
          "does it",
          "it is"
        ]
      },
      {
        "q": "\"Would you mind...?\" — como dizer SIM, claro?",
        "a": "Not at all",
        "opts": [
          "Not at all",
          "Yes, I mind",
          "No, thank you",
          "Of course I mind"
        ]
      }
    ],
    "speak": [
      "Could you tell me what a typical day looks like?",
      "I was wondering if there are growth opportunities.",
      "Would you mind telling me about the team structure?",
      "Could you clarify who I would report to?",
      "If I may ask, why is this position open?"
    ]
  },
  {
    "id": 610,
    "title": "About the Company",
    "emoji": "🏢",
    "verbs": [
      "To Grow",
      "To Expand",
      "To Compete",
      "To Found"
    ],
    "vocab": [
      {
        "en": "industry",
        "pt": "setor, indústria"
      },
      {
        "en": "market",
        "pt": "mercado"
      },
      {
        "en": "competitor",
        "pt": "concorrente"
      },
      {
        "en": "client base",
        "pt": "base de clientes"
      },
      {
        "en": "headquarters",
        "pt": "sede"
      },
      {
        "en": "branch",
        "pt": "filial"
      },
      {
        "en": "startup",
        "pt": "startup"
      },
      {
        "en": "founder",
        "pt": "fundador"
      },
      {
        "en": "mission",
        "pt": "missão"
      },
      {
        "en": "vision",
        "pt": "visão"
      },
      {
        "en": "product",
        "pt": "produto"
      },
      {
        "en": "service",
        "pt": "serviço"
      },
      {
        "en": "customer",
        "pt": "consumidor, cliente final"
      },
      {
        "en": "revenue",
        "pt": "receita"
      },
      {
        "en": "profit",
        "pt": "lucro"
      },
      {
        "en": "investor",
        "pt": "investidor"
      },
      {
        "en": "partnership",
        "pt": "parceria"
      },
      {
        "en": "expansion",
        "pt": "expansão"
      },
      {
        "en": "overseas",
        "pt": "no exterior"
      },
      {
        "en": "merger",
        "pt": "fusão"
      },
      {
        "en": "leading",
        "pt": "líder (de mercado)"
      },
      {
        "en": "fast-growing",
        "pt": "de crescimento rápido"
      },
      {
        "en": "well-known",
        "pt": "conhecido"
      },
      {
        "en": "global",
        "pt": "global"
      },
      {
        "en": "local",
        "pt": "local"
      },
      {
        "en": "sustainable",
        "pt": "sustentável"
      },
      {
        "en": "innovative",
        "pt": "inovador"
      },
      {
        "en": "nowadays",
        "pt": "hoje em dia"
      },
      {
        "en": "in the long run",
        "pt": "a longo prazo"
      },
      {
        "en": "founded",
        "pt": "fundada"
      }
    ],
    "expressions": [
      {
        "expr": "I've read that you...",
        "meaning": "Eu li que vocês...",
        "example": "I've read that you opened two branches overseas."
      },
      {
        "expr": "What impressed me most was...",
        "meaning": "O que mais me impressionou foi...",
        "example": "What impressed me most was your sustainable packaging."
      },
      {
        "expr": "I'd love to be part of that",
        "meaning": "Eu adoraria fazer parte disso",
        "example": "You've grown a lot abroad, and I'd love to be part of that."
      },
      {
        "expr": "How does the company...?",
        "meaning": "Como a empresa...?",
        "example": "How does the company measure success in this role?"
      }
    ],
    "sentences": [
      "The company works with clients all over the world.",
      "It has two branches overseas.",
      "The founder started the business in 2015.",
      "They compete with three big companies.",
      "The team grows every year.",
      "I've read that you opened a new branch.",
      "What impressed me most was your mission.",
      "The company doesn't sell directly to customers."
    ],
    "grammar": {
      "title": "Present Simple para fatos e descrições",
      "rules": [
        "Para falar do que a empresa É e FAZ, use o presente simples: The company works with clients abroad.",
        "Na terceira pessoa o verbo ganha -s: it works, it has, it grows, it does.",
        "Negativa com doesn't + verbo base: The company doesn't sell directly. Nunca \"doesn't sells\".",
        "Pergunta com does: Does the company have an office here? — o verbo volta para a base."
      ],
      "table": {
        "headers": [
          "Forma",
          "Estrutura",
          "Exemplo",
          "Cuidado"
        ],
        "rows": [
          [
            "Afirmativa",
            "it + verbo-s",
            "The company works abroad.",
            "-s na 3ª pessoa"
          ],
          [
            "Negativa",
            "doesn't + base",
            "It doesn't sell directly.",
            "sem -s no verbo"
          ],
          [
            "Pergunta",
            "Does + sujeito + base",
            "Does it have a branch here?",
            "sem -s no verbo"
          ],
          [
            "Verbo have",
            "it has",
            "It has two branches.",
            "have vira has"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "The company ___ with clients abroad.",
        "a": "works",
        "opts": [
          "works",
          "work",
          "working",
          "is work"
        ]
      },
      {
        "q": "It ___ two branches overseas.",
        "a": "has",
        "opts": [
          "has",
          "have",
          "haves",
          "is have"
        ]
      },
      {
        "q": "The company ___ sell directly to customers.",
        "a": "doesn't",
        "opts": [
          "doesn't",
          "don't",
          "isn't",
          "not"
        ]
      },
      {
        "q": "___ the company have an office here?",
        "a": "Does",
        "opts": [
          "Does",
          "Do",
          "Is",
          "Has"
        ]
      },
      {
        "q": "The team ___ every year.",
        "a": "grows",
        "opts": [
          "grows",
          "grow",
          "growing",
          "is grow"
        ]
      }
    ],
    "speak": [
      "The company works with clients all over the world.",
      "It has two branches overseas.",
      "The founder started the business in 2015.",
      "The company doesn't sell directly to customers.",
      "What impressed me most was your mission."
    ]
  },
  {
    "id": 611,
    "title": "Money and Start Date",
    "emoji": "💰",
    "verbs": [
      "To Review",
      "To Consider",
      "To Negotiate",
      "To Accept"
    ],
    "vocab": [
      {
        "en": "salary range",
        "pt": "faixa salarial"
      },
      {
        "en": "base",
        "pt": "salário-base"
      },
      {
        "en": "bonus",
        "pt": "bônus"
      },
      {
        "en": "commission",
        "pt": "comissão"
      },
      {
        "en": "benefits package",
        "pt": "pacote de benefícios"
      },
      {
        "en": "health insurance",
        "pt": "plano de saúde"
      },
      {
        "en": "meal allowance",
        "pt": "vale-refeição"
      },
      {
        "en": "transport allowance",
        "pt": "vale-transporte"
      },
      {
        "en": "paid leave",
        "pt": "licença remunerada"
      },
      {
        "en": "holiday",
        "pt": "férias, feriado"
      },
      {
        "en": "sick leave",
        "pt": "licença médica"
      },
      {
        "en": "probation period",
        "pt": "período de experiência"
      },
      {
        "en": "notice period",
        "pt": "período de aviso prévio"
      },
      {
        "en": "start date",
        "pt": "data de início"
      },
      {
        "en": "available",
        "pt": "disponível"
      },
      {
        "en": "negotiable",
        "pt": "negociável"
      },
      {
        "en": "firm number",
        "pt": "número fixo"
      },
      {
        "en": "gross",
        "pt": "bruto"
      },
      {
        "en": "net",
        "pt": "líquido"
      },
      {
        "en": "monthly",
        "pt": "mensal"
      },
      {
        "en": "annual",
        "pt": "anual"
      },
      {
        "en": "reference",
        "pt": "referência"
      },
      {
        "en": "contact details",
        "pt": "dados de contato"
      },
      {
        "en": "follow-up email",
        "pt": "e-mail de retorno"
      },
      {
        "en": "decision",
        "pt": "decisão"
      },
      {
        "en": "shortlist",
        "pt": "lista final"
      },
      {
        "en": "candidate",
        "pt": "candidato"
      },
      {
        "en": "by Friday",
        "pt": "até sexta"
      },
      {
        "en": "in two weeks",
        "pt": "em duas semanas"
      },
      {
        "en": "personally",
        "pt": "pessoalmente"
      }
    ],
    "expressions": [
      {
        "expr": "What range are you looking for?",
        "meaning": "Que faixa você está buscando?",
        "example": "Let's talk about salary. What range are you looking for?"
      },
      {
        "expr": "Could you tell me the range first?",
        "meaning": "Você poderia me dizer a faixa primeiro?",
        "example": "Could you tell me the range first? I'd like to keep it fair."
      },
      {
        "expr": "How much notice do you need?",
        "meaning": "De quanto tempo de aviso vocês precisam?",
        "example": "How much notice do you need? I could start in two weeks."
      },
      {
        "expr": "When will I hear back?",
        "meaning": "Quando terei retorno?",
        "example": "And when will I hear back from you?"
      }
    ],
    "sentences": [
      "We're going to send the full range today.",
      "I'll review it and get back to you tomorrow.",
      "How much notice do you need?",
      "I could start in two weeks.",
      "We'll make a decision on Friday.",
      "If we move forward, I'll call you personally.",
      "We're going to ask you for two references.",
      "I'll send their contact details after this call."
    ],
    "grammar": {
      "title": "will × going to",
      "rules": [
        "going to = plano que já existia ANTES da conversa: We're going to finish the interviews by Thursday.",
        "will ('ll) = decisão tomada AGORA, respondendo ao que acabou de ouvir: I'll review it tonight.",
        "will também serve para promessa: If we move forward, I'll call you personally.",
        "Nos dois, o verbo fica na forma base: will call, going to send. Nunca \"will to call\"."
      ],
      "table": {
        "headers": [
          "Situação",
          "Forma",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "Plano anterior",
            "am/is/are going to",
            "We're going to send the range.",
            "to be obrigatório"
          ],
          [
            "Decisão agora",
            "will / 'll",
            "I'll review it tonight.",
            "+ verbo base"
          ],
          [
            "Promessa",
            "will",
            "I'll call you personally.",
            "compromisso"
          ],
          [
            "Pergunta",
            "When will...?",
            "When will I hear back?",
            "+ verbo base"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "We ___ going to send the range today.",
        "a": "are",
        "opts": [
          "are",
          "is",
          "will",
          "am"
        ]
      },
      {
        "q": "I ___ review it and get back to you. (decidindo agora)",
        "a": "will",
        "opts": [
          "will",
          "am going to",
          "would",
          "was"
        ]
      },
      {
        "q": "When ___ I hear back from you?",
        "a": "will",
        "opts": [
          "will",
          "do",
          "am",
          "have"
        ]
      },
      {
        "q": "Depois de \"will\", o verbo fica:",
        "a": "call",
        "opts": [
          "call",
          "to call",
          "calling",
          "called"
        ]
      },
      {
        "q": "If we move forward, I ___ call you.",
        "a": "'ll",
        "opts": [
          "'ll",
          "will to",
          "am",
          "would to"
        ]
      }
    ],
    "speak": [
      "What range are you looking for?",
      "I'll review it and get back to you tomorrow.",
      "How much notice do you need?",
      "We'll make a decision on Friday.",
      "We're going to send the full range today."
    ]
  },
  {
    "id": 612,
    "title": "After the Interview",
    "emoji": "✉️",
    "verbs": [
      "To Follow Up",
      "To Reply",
      "To Thank",
      "To Wait"
    ],
    "vocab": [
      {
        "en": "follow-up",
        "pt": "retorno, acompanhamento"
      },
      {
        "en": "thank-you note",
        "pt": "bilhete de agradecimento"
      },
      {
        "en": "email",
        "pt": "e-mail"
      },
      {
        "en": "subject line",
        "pt": "assunto (do e-mail)"
      },
      {
        "en": "greeting",
        "pt": "saudação"
      },
      {
        "en": "sign-off",
        "pt": "despedida (do e-mail)"
      },
      {
        "en": "attachment",
        "pt": "anexo"
      },
      {
        "en": "reminder",
        "pt": "lembrete"
      },
      {
        "en": "update",
        "pt": "atualização"
      },
      {
        "en": "response",
        "pt": "resposta"
      },
      {
        "en": "reply",
        "pt": "resposta, réplica"
      },
      {
        "en": "rejection",
        "pt": "recusa"
      },
      {
        "en": "acceptance",
        "pt": "aceite"
      },
      {
        "en": "second interview",
        "pt": "segunda entrevista"
      },
      {
        "en": "final round",
        "pt": "rodada final"
      },
      {
        "en": "next steps",
        "pt": "próximos passos"
      },
      {
        "en": "timeline",
        "pt": "cronograma"
      },
      {
        "en": "patience",
        "pt": "paciência"
      },
      {
        "en": "polite",
        "pt": "educado"
      },
      {
        "en": "brief",
        "pt": "breve"
      },
      {
        "en": "sincere",
        "pt": "sincero"
      },
      {
        "en": "grateful",
        "pt": "grato"
      },
      {
        "en": "within",
        "pt": "dentro de (prazo)"
      },
      {
        "en": "in a few days",
        "pt": "em alguns dias"
      },
      {
        "en": "as soon as",
        "pt": "assim que"
      },
      {
        "en": "looking forward to",
        "pt": "ansioso por"
      },
      {
        "en": "best regards",
        "pt": "atenciosamente"
      },
      {
        "en": "kind regards",
        "pt": "cordialmente"
      },
      {
        "en": "it was a pleasure",
        "pt": "foi um prazer"
      },
      {
        "en": "keep in touch",
        "pt": "manter contato"
      }
    ],
    "expressions": [
      {
        "expr": "Thank you for your time",
        "meaning": "Obrigado pelo seu tempo",
        "example": "Thank you for your time today. It was a pleasure."
      },
      {
        "expr": "I'll follow up next week",
        "meaning": "Vou dar um retorno semana que vem",
        "example": "I'll follow up next week if I don't hear anything."
      },
      {
        "expr": "I'm looking forward to hearing from you",
        "meaning": "Fico no aguardo do seu retorno",
        "example": "I'm looking forward to hearing from you. Best regards, Yara."
      },
      {
        "expr": "Please keep me in mind",
        "meaning": "Por favor, me mantenha em mente",
        "example": "Please keep me in mind for future openings."
      }
    ],
    "sentences": [
      "Thank you so much for your time today.",
      "It was a pleasure talking to you.",
      "I'll follow up next week if I don't hear anything.",
      "I'll send my references as soon as I get home.",
      "I'm looking forward to hearing from you.",
      "Please keep me in mind for future roles.",
      "I'll wait until Friday before I write again.",
      "I'll reply as soon as I read your email."
    ],
    "grammar": {
      "title": "will com prazos: by, within, as soon as",
      "rules": [
        "by + momento limite = até (no mais tardar): I'll reply by Friday.",
        "within + período = dentro de: You'll hear from us within two weeks.",
        "Depois de as soon as, when e until, use o PRESENTE, nunca will: I'll call you as soon as I get home.",
        "looking forward to é seguido de verbo-ing: looking forward to hearing from you. Nunca \"to hear\"."
      ],
      "table": {
        "headers": [
          "Expressão",
          "Significado",
          "Exemplo",
          "Cuidado"
        ],
        "rows": [
          [
            "by Friday",
            "até sexta, no máximo",
            "I'll reply by Friday.",
            "prazo limite"
          ],
          [
            "within two weeks",
            "dentro de duas semanas",
            "You'll hear back within two weeks.",
            "período"
          ],
          [
            "as soon as I get home",
            "assim que eu chegar",
            "I'll send it as soon as I get home.",
            "presente depois de as soon as"
          ],
          [
            "looking forward to",
            "no aguardo de",
            "Looking forward to hearing from you.",
            "verbo com -ing"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I'll send it as soon as I ___ home.",
        "a": "get",
        "opts": [
          "get",
          "will get",
          "getting",
          "got"
        ]
      },
      {
        "q": "I'm looking forward to ___ from you.",
        "a": "hearing",
        "opts": [
          "hearing",
          "hear",
          "to hear",
          "heard"
        ]
      },
      {
        "q": "I'll reply ___ Friday.",
        "a": "by",
        "opts": [
          "by",
          "until",
          "since",
          "in"
        ]
      },
      {
        "q": "You'll hear back ___ two weeks.",
        "a": "within",
        "opts": [
          "within",
          "during",
          "by",
          "since"
        ]
      },
      {
        "q": "I'll wait ___ Friday before I write again.",
        "a": "until",
        "opts": [
          "until",
          "by",
          "within",
          "since"
        ]
      }
    ],
    "speak": [
      "Thank you so much for your time today.",
      "I'll follow up next week if I don't hear anything.",
      "I'm looking forward to hearing from you.",
      "I'll send my references as soon as I get home.",
      "Please keep me in mind for future roles."
    ]
  }
];

window.LESSONS_INTERVIEW = LESSONS_INTERVIEW;
