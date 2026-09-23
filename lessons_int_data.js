// ── Trilha de Prática Diária — Curso Intermediate ──────────────────────────
// 40 lições (ids 401-440).
// O vocabulário é de PALAVRAS que o aluno usa falando — não de termos de
// gramática. A frase de exemplo é que carrega a estrutura da lição.
// Schema idêntico ao JADSON_LESSONS de lessons.html.

const LESSONS_INT = [
  {
    "id": 401,
    "title": "Past Simple: Regular Verbs",
    "emoji": "📝",
    "verbs": [
      "To Work",
      "To Study",
      "To Decide",
      "To Travel"
    ],
    "vocab": [
      {
        "en": "to travel",
        "pt": "viajar",
        "ex": "I travelled to Chile last year."
      },
      {
        "en": "-ed ending",
        "pt": "terminação -ed",
        "ex": "Add -ed to make the past simple."
      },
      {
        "en": "yesterday",
        "pt": "ontem",
        "ex": "I called her yesterday."
      },
      {
        "en": "last week",
        "pt": "semana passada",
        "ex": "We travelled last week."
      },
      {
        "en": "last night",
        "pt": "ontem à noite",
        "ex": "I watched a movie last night."
      },
      {
        "en": "ago",
        "pt": "atrás, há",
        "ex": "She moved here two years ago."
      },
      {
        "en": "to work",
        "pt": "trabalhar",
        "ex": "I worked until six yesterday."
      },
      {
        "en": "to study",
        "pt": "estudar",
        "ex": "She studied English for two hours."
      },
      {
        "en": "to decide",
        "pt": "decidir",
        "ex": "He decided to stay home."
      },
      {
        "en": "to walk",
        "pt": "caminhar",
        "ex": "We walked to school every day."
      },
      {
        "en": "to watch",
        "pt": "assistir",
        "ex": "I watched a movie last night."
      },
      {
        "en": "to clean",
        "pt": "limpar",
        "ex": "She cleaned the house on Sunday."
      },
      {
        "en": "to cook",
        "pt": "cozinhar",
        "ex": "He cooked dinner for us."
      },
      {
        "en": "to visit",
        "pt": "visitar",
        "ex": "We visited my grandmother yesterday."
      },
      {
        "en": "to arrive",
        "pt": "chegar",
        "ex": "The train arrived late."
      },
      {
        "en": "to finish",
        "pt": "terminar",
        "ex": "I finished my homework early."
      },
      {
        "en": "to start",
        "pt": "começar",
        "ex": "The movie started at eight."
      },
      {
        "en": "to stay",
        "pt": "ficar",
        "ex": "We stayed at a small hotel."
      },
      {
        "en": "to move",
        "pt": "se mudar",
        "ex": "They moved to a new city."
      },
      {
        "en": "to change",
        "pt": "mudar (algo)",
        "ex": "She changed her job last month."
      },
      {
        "en": "to plan",
        "pt": "planejar",
        "ex": "We planned the trip carefully."
      },
      {
        "en": "to help",
        "pt": "ajudar",
        "ex": "He helped me carry the boxes."
      },
      {
        "en": "to listen",
        "pt": "escutar",
        "ex": "I listened to music all afternoon."
      },
      {
        "en": "to answer",
        "pt": "responder",
        "ex": "She answered every question."
      },
      {
        "en": "to open",
        "pt": "abrir",
        "ex": "He opened the door slowly."
      },
      {
        "en": "to close",
        "pt": "fechar",
        "ex": "We closed the shop at nine."
      },
      {
        "en": "to enjoy",
        "pt": "aproveitar",
        "ex": "I enjoyed the concert a lot."
      },
      {
        "en": "to explain",
        "pt": "explicar",
        "ex": "The teacher explained the rule."
      },
      {
        "en": "to happen",
        "pt": "acontecer",
        "ex": "It happened very fast."
      }
    ],
    "expressions": [
      {
        "expr": "It happened yesterday",
        "meaning": "Aconteceu ontem",
        "example": "It happened yesterday, right after lunch."
      },
      {
        "expr": "I worked all day",
        "meaning": "Eu trabalhei o dia todo",
        "example": "I worked all day and I am very tired."
      },
      {
        "expr": "We finally decided",
        "meaning": "Nós finalmente decidimos",
        "example": "We finally decided to travel in July."
      },
      {
        "expr": "Nothing changed",
        "meaning": "Nada mudou",
        "example": "Nothing changed after the meeting."
      }
    ],
    "sentences": [
      "I worked until six yesterday.",
      "She studied English for two hours.",
      "We travelled to Peru last year.",
      "He decided to stay home.",
      "They moved to a new city.",
      "I cleaned the house this morning.",
      "The train arrived late.",
      "We enjoyed the concert a lot."
    ],
    "grammar": {
      "title": "Past Simple: Verbos Regulares (+ -ED)",
      "rules": [
        "Verbos regulares recebem -ED no passado: work → worked, study → studied.",
        "Verbos terminados em -e só recebem -D: decide → decided, live → lived.",
        "Verbos terminados em consoante+y trocam y por i + ed: study → studied, cry → cried.",
        "Verbos curtos com uma vogal dobram a consoante final: stop → stopped, plan → planned."
      ],
      "table": {
        "headers": [
          "Verbo base",
          "Passado (+ed)",
          "Exemplo",
          "Regra"
        ],
        "rows": [
          [
            "work",
            "worked",
            "I worked yesterday.",
            "+ed simples"
          ],
          [
            "decide",
            "decided",
            "She decided quickly.",
            "termina em -e, +d"
          ],
          [
            "study",
            "studied",
            "He studied hard.",
            "y → ied"
          ],
          [
            "stop",
            "stopped",
            "We stopped early.",
            "dobra consoante"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I ___ (work) until six yesterday.",
        "a": "worked",
        "opts": [
          "worked",
          "work",
          "works",
          "working"
        ]
      },
      {
        "q": "She ___ (study) English for two hours.",
        "a": "studied",
        "opts": [
          "studied",
          "study",
          "studys",
          "studying"
        ]
      },
      {
        "q": "They ___ (travel) to Peru last year.",
        "a": "travelled",
        "opts": [
          "travelled",
          "travel",
          "travels",
          "traveling"
        ]
      },
      {
        "q": "We ___ (stop) at a small café.",
        "a": "stopped",
        "opts": [
          "stopped",
          "stoped",
          "stop",
          "stopping"
        ]
      },
      {
        "q": "He ___ (decide) to stay home.",
        "a": "decided",
        "opts": [
          "decided",
          "decide",
          "decides",
          "deciding"
        ]
      }
    ],
    "speak": [
      "I worked until six yesterday.",
      "She studied English for two hours.",
      "We travelled to Peru last year.",
      "He decided to stay home.",
      "They moved to a new city last month."
    ]
  },
  {
    "id": 402,
    "title": "Past Simple: Irregular Verbs",
    "emoji": "⚡",
    "verbs": [
      "To Go",
      "To Have",
      "To See",
      "To Say"
    ],
    "vocab": [
      {
        "en": "go → went",
        "pt": "ir → foi",
        "ex": "I went to the market this morning."
      },
      {
        "en": "have → had",
        "pt": "ter → teve",
        "ex": "We had a great time yesterday."
      },
      {
        "en": "see → saw",
        "pt": "ver → viu",
        "ex": "She saw an old friend downtown."
      },
      {
        "en": "say → said",
        "pt": "dizer → disse",
        "ex": "He said the meeting was cancelled."
      },
      {
        "en": "come → came",
        "pt": "vir → veio",
        "ex": "They came home very late."
      },
      {
        "en": "know → knew",
        "pt": "saber/conhecer → soube",
        "ex": "I knew the answer immediately."
      },
      {
        "en": "think → thought",
        "pt": "pensar → pensou",
        "ex": "She thought about it all night."
      },
      {
        "en": "take → took",
        "pt": "pegar/levar → pegou",
        "ex": "He took the bus to work."
      },
      {
        "en": "get → got",
        "pt": "conseguir/pegar → conseguiu",
        "ex": "We got tickets for the show."
      },
      {
        "en": "give → gave",
        "pt": "dar → deu",
        "ex": "She gave me some good advice."
      },
      {
        "en": "find → found",
        "pt": "achar/encontrar → achou",
        "ex": "I found my keys under the sofa."
      },
      {
        "en": "make → made",
        "pt": "fazer → fez",
        "ex": "They made dinner together."
      },
      {
        "en": "meet → met",
        "pt": "conhecer/encontrar → conheceu",
        "ex": "We met at a conference last spring."
      },
      {
        "en": "leave → left",
        "pt": "sair/deixar → saiu",
        "ex": "She left the office at five."
      },
      {
        "en": "buy → bought",
        "pt": "comprar → comprou",
        "ex": "He bought a new laptop yesterday."
      },
      {
        "en": "bring → brought",
        "pt": "trazer → trouxe",
        "ex": "I brought some snacks for everyone."
      },
      {
        "en": "write → wrote",
        "pt": "escrever → escreveu",
        "ex": "She wrote a long email last night."
      },
      {
        "en": "eat → ate",
        "pt": "comer → comeu",
        "ex": "We ate at that new restaurant."
      },
      {
        "en": "drink → drank",
        "pt": "beber → bebeu",
        "ex": "He drank a coffee before the meeting."
      },
      {
        "en": "feel → felt",
        "pt": "sentir → sentiu",
        "ex": "I felt nervous before the interview."
      },
      {
        "en": "tell → told",
        "pt": "contar → contou",
        "ex": "She told me a funny story."
      },
      {
        "en": "understand → understood",
        "pt": "entender → entendeu",
        "ex": "He finally understood the problem."
      },
      {
        "en": "become → became",
        "pt": "se tornar → se tornou",
        "ex": "She became a manager last year."
      },
      {
        "en": "begin → began",
        "pt": "começar → começou",
        "ex": "The show began at nine sharp."
      },
      {
        "en": "break → broke",
        "pt": "quebrar → quebrou",
        "ex": "He broke his phone last week."
      },
      {
        "en": "do → did",
        "pt": "fazer → fez",
        "ex": "I did my homework right after school."
      },
      {
        "en": "forget → forgot",
        "pt": "esquecer → esqueceu",
        "ex": "She forgot her umbrella at home."
      },
      {
        "en": "hear → heard",
        "pt": "ouvir → ouviu",
        "ex": "We heard a strange noise outside."
      },
      {
        "en": "sleep → slept",
        "pt": "dormir → dormiu",
        "ex": "He slept for ten hours last night."
      },
      {
        "en": "read → read",
        "pt": "ler → leu (mesma grafia)",
        "ex": "I read that book last summer."
      }
    ],
    "expressions": [
      {
        "expr": "I never saw that coming",
        "meaning": "Eu nunca vi aquilo vindo (nem imaginava)",
        "example": "I never saw that coming — what a surprise!"
      },
      {
        "expr": "She said it was fine",
        "meaning": "Ela disse que estava tudo bem",
        "example": "She said it was fine, so we relaxed."
      },
      {
        "expr": "We finally got it",
        "meaning": "Finalmente conseguimos",
        "example": "After three tries, we finally got it."
      },
      {
        "expr": "He made a good point",
        "meaning": "Ele fez uma boa observação",
        "example": "He made a good point during the meeting."
      }
    ],
    "sentences": [
      "I went to the market this morning.",
      "She saw an old friend downtown.",
      "He said the meeting was cancelled.",
      "We had a great time yesterday.",
      "They came home very late.",
      "I found my keys under the sofa.",
      "She wrote a long email last night.",
      "He forgot his umbrella at home."
    ],
    "grammar": {
      "title": "Past Simple: Verbos Irregulares",
      "rules": [
        "Verbos irregulares não seguem o padrão -ed — eles mudam completamente: go→went, have→had, see→saw.",
        "Não existe uma regra fixa — o jeito é decorar em grupos parecidos: think/thought, buy/bought, bring/brought.",
        "Na negativa e na pergunta, o verbo VOLTA à forma base: \"I didn't go\" (não \"didn't went\"), \"Did you see?\" (não \"Did you saw?\").",
        "Alguns verbos irregulares não mudam nada: put→put, read→read (só muda a pronúncia), cut→cut."
      ],
      "table": {
        "headers": [
          "Verbo base",
          "Passado",
          "Exemplo",
          "Grupo/Padrão"
        ],
        "rows": [
          [
            "go",
            "went",
            "I went home early.",
            "muda completamente"
          ],
          [
            "think",
            "thought",
            "She thought about it.",
            "grupo -ought"
          ],
          [
            "buy",
            "bought",
            "He bought a car.",
            "grupo -ought"
          ],
          [
            "put",
            "put",
            "I put it on the table.",
            "não muda"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I ___ (go) to the market this morning.",
        "a": "went",
        "opts": [
          "went",
          "goed",
          "gone",
          "go"
        ]
      },
      {
        "q": "She ___ (see) an old friend downtown.",
        "a": "saw",
        "opts": [
          "saw",
          "seen",
          "see",
          "seed"
        ]
      },
      {
        "q": "He ___ (say) the meeting was cancelled.",
        "a": "said",
        "opts": [
          "said",
          "sayed",
          "says",
          "saying"
        ]
      },
      {
        "q": "We ___ (have) a great time yesterday.",
        "a": "had",
        "opts": [
          "had",
          "have",
          "haved",
          "having"
        ]
      },
      {
        "q": "They ___ (come) home very late.",
        "a": "came",
        "opts": [
          "came",
          "comed",
          "come",
          "coming"
        ]
      }
    ],
    "speak": [
      "I went to the market this morning.",
      "She saw an old friend downtown.",
      "He said the meeting was cancelled.",
      "We had a great time yesterday.",
      "They came home very late last night."
    ]
  },
  {
    "id": 403,
    "title": "Past Continuous Basics",
    "emoji": "🔄",
    "verbs": [
      "To Study",
      "To Travel",
      "To Work",
      "To Sleep"
    ],
    "vocab": [
      {
        "en": "to rush",
        "pt": "correr / apressar-se",
        "ex": "I was rushing to catch the bus."
      },
      {
        "en": "was",
        "pt": "estava (I/he/she/it)",
        "ex": "I was reading at nine o'clock."
      },
      {
        "en": "were",
        "pt": "estava/estavam (you/we/they)",
        "ex": "They were working late."
      },
      {
        "en": "to enjoy",
        "pt": "curtir",
        "ex": "I enjoy walking in the morning."
      },
      {
        "en": "in progress",
        "pt": "em andamento",
        "ex": "The meeting was in progress at noon."
      },
      {
        "en": "background action",
        "pt": "ação de fundo",
        "ex": "The rain was a background action."
      },
      {
        "en": "interrupted action",
        "pt": "ação interrompida",
        "ex": "The call interrupted my ongoing work."
      },
      {
        "en": "while",
        "pt": "enquanto",
        "ex": "While I was cooking, he arrived."
      },
      {
        "en": "when",
        "pt": "quando",
        "ex": "I was sleeping when you called."
      },
      {
        "en": "suddenly",
        "pt": "de repente",
        "ex": "Suddenly, the lights went out."
      },
      {
        "en": "at that moment",
        "pt": "naquele momento",
        "ex": "At that moment, I was driving home."
      },
      {
        "en": "the whole time",
        "pt": "o tempo todo",
        "ex": "She was smiling the whole time."
      },
      {
        "en": "meanwhile",
        "pt": "enquanto isso",
        "ex": "Meanwhile, he was waiting outside."
      },
      {
        "en": "to interrupt",
        "pt": "interromper",
        "ex": "The phone call interrupted our dinner."
      },
      {
        "en": "to notice",
        "pt": "perceber",
        "ex": "I noticed she was crying."
      },
      {
        "en": "to happen",
        "pt": "acontecer",
        "ex": "It happened while we were talking."
      },
      {
        "en": "simultaneously",
        "pt": "simultaneamente",
        "ex": "They were talking simultaneously."
      },
      {
        "en": "duration",
        "pt": "duração",
        "ex": "The duration of the action matters."
      },
      {
        "en": "narrative",
        "pt": "narrativa",
        "ex": "The past continuous enriches any narrative."
      },
      {
        "en": "setting the scene",
        "pt": "criar o cenário",
        "ex": "Use it for setting the scene in stories."
      },
      {
        "en": "to knock",
        "pt": "bater (na porta)",
        "ex": "Someone was knocking at the door."
      },
      {
        "en": "to wait",
        "pt": "esperar",
        "ex": "I was waiting for the bus for an hour."
      },
      {
        "en": "to rain",
        "pt": "chover",
        "ex": "It was raining hard all morning."
      },
      {
        "en": "to shine",
        "pt": "brilhar",
        "ex": "The sun was shining when we left."
      },
      {
        "en": "quiet",
        "pt": "quieto, silencioso",
        "ex": "The house was very quiet at midnight."
      },
      {
        "en": "loud",
        "pt": "alto, barulhento",
        "ex": "The music was too loud outside."
      },
      {
        "en": "to text",
        "pt": "mandar mensagem",
        "ex": "She was texting during the whole class."
      },
      {
        "en": "to drive",
        "pt": "dirigir",
        "ex": "He was driving when his phone rang."
      },
      {
        "en": "to cook",
        "pt": "cozinhar",
        "ex": "We were cooking dinner together."
      },
      {
        "en": "to happen at the same time",
        "pt": "acontecer ao mesmo tempo",
        "ex": "Both things were happening at the same time."
      }
    ],
    "expressions": [
      {
        "expr": "I was just about to...",
        "meaning": "Eu estava prestes a...",
        "example": "I was just about to call you when you texted."
      },
      {
        "expr": "While this was happening...",
        "meaning": "Enquanto isso acontecia...",
        "example": "While this was happening, I was finishing my coffee."
      },
      {
        "expr": "At that exact moment...",
        "meaning": "Naquele exato momento...",
        "example": "At that exact moment, the power went out."
      },
      {
        "expr": "It was the perfect setting for...",
        "meaning": "Era o cenário perfeito para...",
        "example": "It was the perfect setting for a relaxing evening."
      }
    ],
    "sentences": [
      "I was reading when you called.",
      "She was studying all night for the exam.",
      "They were travelling when the storm started.",
      "We were working late on the project.",
      "He was sleeping when the alarm rang.",
      "It was raining hard all morning.",
      "Someone was knocking at the door.",
      "The sun was shining when we left."
    ],
    "grammar": {
      "title": "Past Continuous: was/were + verbo-ing",
      "rules": [
        "Estrutura: was/were + verbo-ING. Was para I/He/She/It, Were para You/We/They.",
        "Negativa: wasn't / weren't + verbo-ing: \"She wasn't sleeping.\"",
        "Pergunta: Was/Were + sujeito + verbo-ing?: \"Were you working?\"",
        "Usa-se para uma ação em progresso em um momento específico do passado, geralmente de fundo para outra ação."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Uso",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "was + -ing",
            "I/he/she/it",
            "I was reading.",
            "ação em progresso"
          ],
          [
            "were + -ing",
            "you/we/they",
            "They were working.",
            "ação em progresso"
          ],
          [
            "wasn't/weren't + -ing",
            "negativa",
            "She wasn't sleeping.",
            "forma contraída"
          ],
          [
            "Was/Were...?",
            "pergunta",
            "Were you working?",
            "inverte was/were"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I ___ (read) when you called.",
        "a": "was reading",
        "opts": [
          "was reading",
          "were reading",
          "reading",
          "read"
        ]
      },
      {
        "q": "They ___ (work) late on the project.",
        "a": "were working",
        "opts": [
          "were working",
          "was working",
          "worked",
          "working"
        ]
      },
      {
        "q": "She ___ (not/sleep) when the alarm rang.",
        "a": "wasn't sleeping",
        "opts": [
          "wasn't sleeping",
          "weren't sleeping",
          "didn't sleep",
          "not sleeping"
        ]
      },
      {
        "q": "___ you studying at nine last night?",
        "a": "Were",
        "opts": [
          "Were",
          "Was",
          "Did",
          "Are"
        ]
      },
      {
        "q": "It ___ (rain) hard all morning.",
        "a": "was raining",
        "opts": [
          "was raining",
          "were raining",
          "rained",
          "raining"
        ]
      }
    ],
    "speak": [
      "I was reading when you called.",
      "She was studying all night for the exam.",
      "They were working late on the project.",
      "He was sleeping when the alarm rang.",
      "It was raining hard all morning."
    ]
  },
  {
    "id": 404,
    "title": "While & When",
    "emoji": "🔗",
    "verbs": [
      "To Interrupt",
      "To Continue",
      "To Notice",
      "To Realize"
    ],
    "vocab": [
      {
        "en": "while",
        "pt": "enquanto",
        "ex": "While I was cooking, the phone rang."
      },
      {
        "en": "when",
        "pt": "quando",
        "ex": "I was sleeping when you called."
      },
      {
        "en": "as",
        "pt": "enquanto, à medida que",
        "ex": "As I was leaving, it started to rain."
      },
      {
        "en": "during",
        "pt": "durante",
        "ex": "During the meeting, my phone rang."
      },
      {
        "en": "at the moment",
        "pt": "no momento",
        "ex": "At the moment, I was driving home."
      },
      {
        "en": "just then",
        "pt": "bem naquela hora",
        "ex": "Just then, the lights went out."
      },
      {
        "en": "right when",
        "pt": "exatamente quando",
        "ex": "Right when I sat down, my boss called."
      },
      {
        "en": "all of a sudden",
        "pt": "de repente",
        "ex": "All of a sudden, the music stopped."
      },
      {
        "en": "in the meantime",
        "pt": "nesse meio tempo",
        "ex": "In the meantime, she was preparing dinner."
      },
      {
        "en": "meanwhile",
        "pt": "enquanto isso",
        "ex": "Meanwhile, he was waiting outside."
      },
      {
        "en": "background action",
        "pt": "ação de fundo",
        "ex": "The background action was longer than the interruption."
      },
      {
        "en": "interrupting action",
        "pt": "ação que interrompe",
        "ex": "The interrupting action is usually shorter."
      },
      {
        "en": "traffic jam",
        "pt": "engarrafamento",
        "ex": "I was in a traffic jam when she called."
      },
      {
        "en": "to knock",
        "pt": "bater (na porta)",
        "ex": "Someone was knocking while I cooked."
      },
      {
        "en": "comma rule",
        "pt": "regra da vírgula",
        "ex": "Use a comma when \"while\" starts the sentence."
      },
      {
        "en": "sequence",
        "pt": "sequência",
        "ex": "The sequence of events matters in a story."
      },
      {
        "en": "to interrupt",
        "pt": "interromper",
        "ex": "The phone call interrupted our dinner."
      },
      {
        "en": "to continue",
        "pt": "continuar",
        "ex": "We continued talking despite the noise."
      },
      {
        "en": "to notice",
        "pt": "perceber",
        "ex": "I noticed she was upset while we talked."
      },
      {
        "en": "to realize",
        "pt": "perceber, se dar conta",
        "ex": "She realized her mistake while driving."
      },
      {
        "en": "simultaneous actions",
        "pt": "ações simultâneas",
        "ex": "Simultaneous actions both use Past Continuous."
      },
      {
        "en": "one moment",
        "pt": "um momento",
        "ex": "Use when + Past Simple for one moment."
      },
      {
        "en": "two ongoing actions",
        "pt": "duas ações contínuas",
        "ex": "While she cooked, he was cleaning — two ongoing actions."
      },
      {
        "en": "unexpectedly",
        "pt": "inesperadamente",
        "ex": "Unexpectedly, the train stopped."
      },
      {
        "en": "at exactly that time",
        "pt": "exatamente naquela hora",
        "ex": "At exactly that time, the alarm rang."
      },
      {
        "en": "to happen at once",
        "pt": "acontecer ao mesmo tempo",
        "ex": "Both events happened at once."
      },
      {
        "en": "to be in the middle of",
        "pt": "estar no meio de (fazendo algo)",
        "ex": "I was in the middle of dinner when she arrived."
      },
      {
        "en": "to disturb",
        "pt": "atrapalhar, incomodar",
        "ex": "The noise disturbed my concentration."
      },
      {
        "en": "a sudden noise",
        "pt": "um barulho repentino",
        "ex": "A sudden noise woke everyone up."
      },
      {
        "en": "without warning",
        "pt": "sem aviso",
        "ex": "The rain started without warning."
      }
    ],
    "expressions": [
      {
        "expr": "While I was ___, ___ happened",
        "meaning": "Enquanto eu estava..., ... aconteceu",
        "example": "While I was driving, my phone rang."
      },
      {
        "expr": "Right when I ___",
        "meaning": "Exatamente quando eu...",
        "example": "Right when I sat down, the doorbell rang."
      },
      {
        "expr": "All of a sudden",
        "meaning": "De repente",
        "example": "All of a sudden, everyone stopped talking."
      },
      {
        "expr": "In the meantime",
        "meaning": "Nesse meio tempo",
        "example": "In the meantime, I finished my coffee."
      }
    ],
    "sentences": [
      "While I was cooking, the phone rang.",
      "I was sleeping when you called.",
      "As I was leaving, it started to rain.",
      "During the meeting, my phone rang loudly.",
      "Just then, the lights went out.",
      "All of a sudden, the music stopped.",
      "In the meantime, she was preparing dinner.",
      "I was in the middle of dinner when she arrived."
    ],
    "grammar": {
      "title": "While & When: conectando duas ações no passado",
      "rules": [
        "WHILE + Past Continuous (ação longa, de fundo): \"While I was cooking...\"",
        "WHEN + Past Simple (ação curta, que interrompe): \"...the phone rang.\"",
        "Se a frase com WHILE vem primeiro, use vírgula: \"While I was cooking, the phone rang.\"",
        "Também é possível usar WHEN com Past Continuous para duas ações simultâneas: \"When I arrived, she was leaving.\""
      ],
      "table": {
        "headers": [
          "Conector",
          "Tempo verbal comum",
          "Exemplo",
          "Uso"
        ],
        "rows": [
          [
            "while",
            "Past Continuous",
            "While I was cooking, ...",
            "ação de fundo/longa"
          ],
          [
            "when",
            "Past Simple",
            "...the phone rang.",
            "ação curta que interrompe"
          ],
          [
            "while + while",
            "Past Continuous + Past Continuous",
            "While she cooked, he cleaned.",
            "duas ações simultâneas"
          ],
          [
            "as",
            "Past Continuous",
            "As I was leaving, it rained.",
            "sinônimo de while"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "___ I was cooking, the phone rang.",
        "a": "While",
        "opts": [
          "While",
          "When",
          "Ago",
          "Since"
        ]
      },
      {
        "q": "I was sleeping ___ you called.",
        "a": "when",
        "opts": [
          "when",
          "while",
          "during",
          "since"
        ]
      },
      {
        "q": "All of a ___, the music stopped.",
        "a": "sudden",
        "opts": [
          "sudden",
          "moment",
          "instant",
          "while"
        ]
      },
      {
        "q": "While she was cooking, he ___ (clean).",
        "a": "was cleaning",
        "opts": [
          "was cleaning",
          "cleaned",
          "clean",
          "cleans"
        ]
      },
      {
        "q": "Just ___, the lights went out.",
        "a": "then",
        "opts": [
          "then",
          "when",
          "while",
          "moment"
        ]
      }
    ],
    "speak": [
      "While I was cooking, the phone rang.",
      "I was sleeping when you called.",
      "All of a sudden, the music stopped.",
      "In the meantime, she was preparing dinner.",
      "Just then, the lights went out."
    ]
  },
  {
    "id": 405,
    "title": "Present Perfect Basics",
    "emoji": "✅",
    "verbs": [
      "To Visit",
      "To Try",
      "To Finish",
      "To Live"
    ],
    "vocab": [
      {
        "en": "abroad",
        "pt": "no exterior",
        "ex": "Have you ever lived abroad?"
      },
      {
        "en": "to achieve",
        "pt": "conquistar",
        "ex": "She has achieved a lot this year."
      },
      {
        "en": "opportunity",
        "pt": "oportunidade",
        "ex": "I have never had this opportunity."
      },
      {
        "en": "have",
        "pt": "have (I/you/we/they)",
        "ex": "I have finished my homework."
      },
      {
        "en": "has",
        "pt": "has (he/she/it)",
        "ex": "She has finished her homework."
      },
      {
        "en": "haven't",
        "pt": "não tenho/temos... (negativa)",
        "ex": "We haven't finished yet."
      },
      {
        "en": "hasn't",
        "pt": "não tem (ele/ela)",
        "ex": "He hasn't called me back."
      },
      {
        "en": "gone",
        "pt": "ido",
        "ex": "She has gone to the gym."
      },
      {
        "en": "seen",
        "pt": "visto",
        "ex": "I have seen that movie before."
      },
      {
        "en": "eaten",
        "pt": "comido",
        "ex": "We have eaten there many times."
      },
      {
        "en": "been",
        "pt": "estado/ido (particípio de be)",
        "ex": "I have been to Italy twice."
      },
      {
        "en": "done",
        "pt": "feito",
        "ex": "She has done a great job."
      },
      {
        "en": "known",
        "pt": "conhecido",
        "ex": "I have known him for years."
      },
      {
        "en": "spoken",
        "pt": "falado",
        "ex": "They have spoken about it already."
      },
      {
        "en": "taken",
        "pt": "pego, tomado",
        "ex": "He has taken the exam twice."
      },
      {
        "en": "written",
        "pt": "escrito",
        "ex": "I have written two emails today."
      },
      {
        "en": "life experience",
        "pt": "experiência de vida",
        "ex": "This trip was a great life experience."
      },
      {
        "en": "up to now",
        "pt": "até agora",
        "ex": "Up to now, everything has been fine."
      },
      {
        "en": "unfinished time",
        "pt": "tempo não terminado",
        "ex": "This week is an unfinished time period."
      },
      {
        "en": "to connect past and present",
        "pt": "conectar passado e presente",
        "ex": "Present perfect connects past and present."
      },
      {
        "en": "so far",
        "pt": "até agora",
        "ex": "So far, we have finished two tasks."
      },
      {
        "en": "recently",
        "pt": "recentemente",
        "ex": "I have recently changed jobs."
      },
      {
        "en": "lately",
        "pt": "ultimamente",
        "ex": "She has been busy lately."
      },
      {
        "en": "this week",
        "pt": "esta semana",
        "ex": "I have called her twice this week."
      },
      {
        "en": "this year",
        "pt": "este ano",
        "ex": "We have travelled a lot this year."
      },
      {
        "en": "contraction",
        "pt": "contração",
        "ex": "I've is the contraction of I have."
      },
      {
        "en": "to complete",
        "pt": "completar",
        "ex": "She has completed the project."
      },
      {
        "en": "to try",
        "pt": "tentar/experimentar",
        "ex": "I have tried sushi many times."
      },
      {
        "en": "to visit",
        "pt": "visitar",
        "ex": "They have visited Rome before."
      },
      {
        "en": "to live",
        "pt": "morar",
        "ex": "We have lived here for ten years."
      }
    ],
    "expressions": [
      {
        "expr": "I've never...",
        "meaning": "Eu nunca...",
        "example": "I've never tried sushi before."
      },
      {
        "expr": "Have you ever...?",
        "meaning": "Você já alguma vez...?",
        "example": "Have you ever visited Japan?"
      },
      {
        "expr": "I've already...",
        "meaning": "Eu já...",
        "example": "I've already finished the report."
      },
      {
        "expr": "So far, so good",
        "meaning": "Até agora, tudo bem",
        "example": "So far, so good with the new job."
      }
    ],
    "sentences": [
      "I have visited Paris twice.",
      "She has finished her homework.",
      "We haven't finished yet.",
      "He hasn't called me back.",
      "I have known him for years.",
      "They have spoken about it already.",
      "We have lived here for ten years.",
      "I have tried sushi many times."
    ],
    "grammar": {
      "title": "Present Perfect: have/has + particípio passado",
      "rules": [
        "Estrutura: have/has + past participle. Have para I/you/we/they, has para he/she/it.",
        "Negativa: haven't/hasn't + particípio: \"We haven't finished.\"",
        "Pergunta: Have/Has + sujeito + particípio?: \"Have you been there?\"",
        "Use quando NÃO há um momento específico — a ação conecta o passado com o presente."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Uso",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "have + particípio",
            "I/you/we/they",
            "I have visited Rome.",
            "sem tempo específico"
          ],
          [
            "has + particípio",
            "he/she/it",
            "She has finished.",
            "verbo auxiliar has"
          ],
          [
            "haven't/hasn't",
            "negativa",
            "We haven't finished yet.",
            "forma contraída"
          ],
          [
            "Have/Has...?",
            "pergunta",
            "Have you been there?",
            "inverte have/has"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I ___ (visit) Paris twice.",
        "a": "have visited",
        "opts": [
          "have visited",
          "has visited",
          "visited",
          "visit"
        ]
      },
      {
        "q": "She ___ (finish) her homework.",
        "a": "has finished",
        "opts": [
          "has finished",
          "have finished",
          "finished",
          "finish"
        ]
      },
      {
        "q": "We ___ (not/finish) yet.",
        "a": "haven't finished",
        "opts": [
          "haven't finished",
          "hasn't finished",
          "didn't finish",
          "not finished"
        ]
      },
      {
        "q": "___ you ever been to Japan?",
        "a": "Have",
        "opts": [
          "Have",
          "Has",
          "Did",
          "Do"
        ]
      },
      {
        "q": "I ___ (know) him for years.",
        "a": "have known",
        "opts": [
          "have known",
          "has known",
          "knew",
          "know"
        ]
      }
    ],
    "speak": [
      "I have visited Paris twice.",
      "She has finished her homework.",
      "We haven't finished yet.",
      "Have you ever been to Japan?",
      "I have known him for years."
    ]
  },
  {
    "id": 406,
    "title": "Ever, Never, Already",
    "emoji": "⏳",
    "verbs": [
      "To Try",
      "To Finish",
      "To See",
      "To Do"
    ],
    "vocab": [
      {
        "en": "ever",
        "pt": "alguma vez, já",
        "ex": "Have you ever tried sushi?"
      },
      {
        "en": "never",
        "pt": "nunca",
        "ex": "I have never been to China."
      },
      {
        "en": "already",
        "pt": "já",
        "ex": "I have already eaten lunch."
      },
      {
        "en": "yet",
        "pt": "ainda (negativa/pergunta)",
        "ex": "I haven't finished yet."
      },
      {
        "en": "just",
        "pt": "acabou de",
        "ex": "She has just arrived."
      },
      {
        "en": "for",
        "pt": "por, há (duração)",
        "ex": "I have lived here for ten years."
      },
      {
        "en": "since",
        "pt": "desde",
        "ex": "I have worked here since 2020."
      },
      {
        "en": "so far",
        "pt": "até agora",
        "ex": "So far, we have finished two tasks."
      },
      {
        "en": "recently",
        "pt": "recentemente",
        "ex": "I have recently started a new job."
      },
      {
        "en": "before",
        "pt": "antes",
        "ex": "Have you seen this movie before?"
      },
      {
        "en": "once",
        "pt": "uma vez",
        "ex": "I have visited Rome once."
      },
      {
        "en": "twice",
        "pt": "duas vezes",
        "ex": "She has been to Bahia twice."
      },
      {
        "en": "many times",
        "pt": "muitas vezes",
        "ex": "We have watched that movie many times."
      },
      {
        "en": "a few times",
        "pt": "algumas vezes",
        "ex": "I have tried it a few times."
      },
      {
        "en": "not yet",
        "pt": "ainda não",
        "ex": "I haven't decided, not yet."
      },
      {
        "en": "still haven't",
        "pt": "ainda não (ênfase)",
        "ex": "I still haven't heard from him."
      },
      {
        "en": "finally",
        "pt": "finalmente",
        "ex": "I have finally finished the book."
      },
      {
        "en": "at last",
        "pt": "finalmente, por fim",
        "ex": "At last, she has passed the exam."
      },
      {
        "en": "lately",
        "pt": "ultimamente",
        "ex": "I haven't slept well lately."
      },
      {
        "en": "ever since",
        "pt": "desde então",
        "ex": "Ever since, we have been good friends."
      },
      {
        "en": "to try",
        "pt": "experimentar/tentar",
        "ex": "Have you ever tried Thai food?"
      },
      {
        "en": "to finish",
        "pt": "terminar",
        "ex": "I have already finished my homework."
      },
      {
        "en": "to see",
        "pt": "ver",
        "ex": "I have never seen snow."
      },
      {
        "en": "to do",
        "pt": "fazer",
        "ex": "Have you done your homework yet?"
      },
      {
        "en": "to hear",
        "pt": "ouvir",
        "ex": "I have just heard the news."
      },
      {
        "en": "to arrive",
        "pt": "chegar",
        "ex": "She has just arrived at the airport."
      },
      {
        "en": "to complete",
        "pt": "completar",
        "ex": "We have already completed the form."
      },
      {
        "en": "to check",
        "pt": "verificar",
        "ex": "I haven't checked my email yet."
      },
      {
        "en": "to lose",
        "pt": "perder",
        "ex": "I have never lost my passport."
      },
      {
        "en": "to forget",
        "pt": "esquecer",
        "ex": "I have never forgotten that day."
      }
    ],
    "expressions": [
      {
        "expr": "Have you ever...?",
        "meaning": "Você já alguma vez...?",
        "example": "Have you ever been to Portugal?"
      },
      {
        "expr": "I've never...",
        "meaning": "Eu nunca...",
        "example": "I've never eaten octopus."
      },
      {
        "expr": "I've already...",
        "meaning": "Eu já...",
        "example": "I've already sent the email."
      },
      {
        "expr": "Not yet",
        "meaning": "Ainda não",
        "example": "Have you finished? Not yet."
      }
    ],
    "sentences": [
      "Have you ever tried sushi?",
      "I have never been to China.",
      "I have already eaten lunch.",
      "I haven't finished yet.",
      "She has just arrived.",
      "I have lived here for ten years.",
      "I have worked here since 2020.",
      "I have finally finished the book."
    ],
    "grammar": {
      "title": "Advérbios do Present Perfect: EVER, NEVER, ALREADY, YET, JUST",
      "rules": [
        "EVER — em perguntas de experiência: \"Have you EVER been to Japan?\"",
        "NEVER — experiência negativa (não precisa de not): \"I've NEVER tried it.\"",
        "ALREADY — algo feito antes do esperado, geralmente na afirmativa: \"I've ALREADY done it.\"",
        "YET — algo ainda não feito (negativa) ou pergunta se já foi feito; sempre no fim da frase: \"I haven't done it YET.\" / \"Have you done it YET?\"",
        "JUST — muito recentemente: \"I've JUST finished.\""
      ],
      "table": {
        "headers": [
          "Advérbio",
          "Posição",
          "Exemplo",
          "Uso"
        ],
        "rows": [
          [
            "ever",
            "antes do particípio, em perguntas",
            "Have you ever been there?",
            "experiência"
          ],
          [
            "never",
            "antes do particípio",
            "I have never seen that.",
            "negativo, sem \"not\""
          ],
          [
            "already",
            "antes do particípio",
            "I have already finished.",
            "feito antes do esperado"
          ],
          [
            "yet",
            "no fim da frase",
            "I haven't finished yet.",
            "negativa/pergunta"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Have you ___ been to Japan?",
        "a": "ever",
        "opts": [
          "ever",
          "never",
          "already",
          "yet"
        ]
      },
      {
        "q": "I have ___ tried sushi before.",
        "a": "never",
        "opts": [
          "never",
          "ever",
          "yet",
          "just"
        ]
      },
      {
        "q": "I have ___ finished my homework.",
        "a": "already",
        "opts": [
          "already",
          "yet",
          "ever",
          "since"
        ]
      },
      {
        "q": "I haven't finished ___.",
        "a": "yet",
        "opts": [
          "yet",
          "already",
          "ever",
          "just"
        ]
      },
      {
        "q": "She has ___ arrived — give her a minute.",
        "a": "just",
        "opts": [
          "just",
          "yet",
          "ever",
          "already"
        ]
      }
    ],
    "speak": [
      "Have you ever tried sushi?",
      "I have never been to China.",
      "I have already eaten lunch.",
      "I haven't finished yet.",
      "She has just arrived."
    ]
  },
  {
    "id": 407,
    "title": "Past Perfect Basics",
    "emoji": "⏪",
    "verbs": [
      "To Finish",
      "To Leave",
      "To Decide",
      "To Eat"
    ],
    "vocab": [
      {
        "en": "to realise",
        "pt": "se dar conta",
        "ex": "I realised I had left my phone at home."
      },
      {
        "en": "to warn",
        "pt": "avisar",
        "ex": "She had warned me about the traffic."
      },
      {
        "en": "earlier action",
        "pt": "ação anterior",
        "ex": "The past perfect describes the earlier action."
      },
      {
        "en": "later action",
        "pt": "ação posterior",
        "ex": "The past simple describes the later action."
      },
      {
        "en": "had",
        "pt": "tinha (todos os sujeitos)",
        "ex": "They had already left."
      },
      {
        "en": "hadn't",
        "pt": "não tinha (negativa)",
        "ex": "She hadn't eaten before the meeting."
      },
      {
        "en": "sequence of events",
        "pt": "sequência de eventos",
        "ex": "Past Perfect helps show the sequence of events."
      },
      {
        "en": "before",
        "pt": "antes",
        "ex": "I had studied before the test."
      },
      {
        "en": "after",
        "pt": "depois",
        "ex": "She called after she had left."
      },
      {
        "en": "by the time",
        "pt": "quando, até (o momento em que)",
        "ex": "By the time I arrived, they had left."
      },
      {
        "en": "already",
        "pt": "já (no passado)",
        "ex": "They had already decided."
      },
      {
        "en": "just",
        "pt": "tinha acabado de",
        "ex": "I had just finished when she called."
      },
      {
        "en": "relieved",
        "pt": "aliviado",
        "ex": "I felt relieved when I saw she had arrived."
      },
      {
        "en": "two past actions",
        "pt": "duas ações no passado",
        "ex": "These are two past actions in order."
      },
      {
        "en": "first thing that happened",
        "pt": "primeira coisa que aconteceu",
        "ex": "The first thing that happened was the delay."
      },
      {
        "en": "second thing that happened",
        "pt": "segunda coisa que aconteceu",
        "ex": "The second thing that happened was our arrival."
      },
      {
        "en": "previous",
        "pt": "anterior",
        "ex": "The previous flight had been cancelled."
      },
      {
        "en": "prior to",
        "pt": "antes de",
        "ex": "Prior to the meeting, I had read the report."
      },
      {
        "en": "background story",
        "pt": "história de fundo",
        "ex": "The background story used Past Perfect."
      },
      {
        "en": "flashback",
        "pt": "flashback",
        "ex": "The flashback showed what had happened before."
      },
      {
        "en": "to finish",
        "pt": "terminar",
        "ex": "I had finished before she arrived."
      },
      {
        "en": "to leave",
        "pt": "sair",
        "ex": "They had left when I called."
      },
      {
        "en": "to decide",
        "pt": "decidir",
        "ex": "She had already decided before we talked."
      },
      {
        "en": "to eat",
        "pt": "comer",
        "ex": "We had eaten before the movie started."
      },
      {
        "en": "to close",
        "pt": "fechar",
        "ex": "The shop had closed by the time we got there."
      },
      {
        "en": "to arrive",
        "pt": "chegar",
        "ex": "She had arrived before the storm started."
      },
      {
        "en": "to lose",
        "pt": "perder",
        "ex": "He had lost his keys before he noticed."
      },
      {
        "en": "to forget",
        "pt": "esquecer",
        "ex": "I had forgotten her name by the next day."
      },
      {
        "en": "to plan",
        "pt": "planejar",
        "ex": "They had planned the trip months before."
      },
      {
        "en": "to realize",
        "pt": "perceber",
        "ex": "She had realized her mistake before I said anything."
      }
    ],
    "expressions": [
      {
        "expr": "By the time I arrived...",
        "meaning": "Quando eu cheguei...",
        "example": "By the time I arrived, they had already left."
      },
      {
        "expr": "I had already decided",
        "meaning": "Eu já tinha decidido",
        "example": "I had already decided before she called."
      },
      {
        "expr": "She had never...",
        "meaning": "Ela nunca tinha...",
        "example": "She had never seen snow before that trip."
      },
      {
        "expr": "After I had finished...",
        "meaning": "Depois que eu tinha terminado...",
        "example": "After I had finished, I went for a walk."
      }
    ],
    "sentences": [
      "By the time I arrived, they had left.",
      "I had already decided before she called.",
      "She had never seen snow before that trip.",
      "After I had finished, I went for a walk.",
      "They had left when I called.",
      "We had eaten before the movie started.",
      "The shop had closed by the time we got there.",
      "He had lost his keys before he noticed."
    ],
    "grammar": {
      "title": "Past Perfect: had + particípio passado",
      "rules": [
        "Estrutura: had + particípio passado — HAD nunca muda, para nenhum sujeito.",
        "Negativa: hadn't + particípio: \"She hadn't eaten.\"",
        "Pergunta: Had + sujeito + particípio?: \"Had you decided?\"",
        "Use para a ação que aconteceu PRIMEIRO, quando há duas ações no passado: \"When I arrived (2ª), they had left (1ª).\""
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Uso",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "had + particípio",
            "ação anterior",
            "They had left.",
            "sempre \"had\""
          ],
          [
            "hadn't + particípio",
            "negativa",
            "She hadn't eaten.",
            "forma contraída"
          ],
          [
            "Had...?",
            "pergunta",
            "Had you decided?",
            "inverte had"
          ],
          [
            "when + Past Simple",
            "ação posterior",
            "When I arrived...",
            "segunda ação"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "By the time I arrived, they ___ (leave).",
        "a": "had left",
        "opts": [
          "had left",
          "have left",
          "left",
          "were leaving"
        ]
      },
      {
        "q": "I ___ (already/decide) before she called.",
        "a": "had already decided",
        "opts": [
          "had already decided",
          "have already decided",
          "already decided",
          "was deciding"
        ]
      },
      {
        "q": "She ___ (never/see) snow before that trip.",
        "a": "had never seen",
        "opts": [
          "had never seen",
          "has never seen",
          "never saw",
          "was never seeing"
        ]
      },
      {
        "q": "___ you decided before the meeting?",
        "a": "Had",
        "opts": [
          "Had",
          "Have",
          "Did",
          "Was"
        ]
      },
      {
        "q": "We ___ (eat) before the movie started.",
        "a": "had eaten",
        "opts": [
          "had eaten",
          "have eaten",
          "ate",
          "were eating"
        ]
      }
    ],
    "speak": [
      "By the time I arrived, they had left.",
      "I had already decided before she called.",
      "She had never seen snow before that trip.",
      "After I had finished, I went for a walk.",
      "We had eaten before the movie started."
    ]
  },
  {
    "id": 408,
    "title": "Before & After",
    "emoji": "⏱️",
    "verbs": [
      "To Arrive",
      "To Leave",
      "To Close",
      "To Start"
    ],
    "vocab": [
      {
        "en": "before",
        "pt": "antes",
        "ex": "I had studied before the test."
      },
      {
        "en": "after",
        "pt": "depois",
        "ex": "She called after she had left."
      },
      {
        "en": "by the time",
        "pt": "quando, até (o momento em que)",
        "ex": "By the time we got there, it had closed."
      },
      {
        "en": "as soon as",
        "pt": "assim que",
        "ex": "As soon as I arrived, they left."
      },
      {
        "en": "once",
        "pt": "uma vez que",
        "ex": "Once I had finished, I relaxed."
      },
      {
        "en": "until",
        "pt": "até",
        "ex": "We waited until the rain had stopped."
      },
      {
        "en": "previously",
        "pt": "anteriormente",
        "ex": "Previously, they had lived in Rio."
      },
      {
        "en": "later",
        "pt": "mais tarde",
        "ex": "Later, I found out what had happened."
      },
      {
        "en": "then",
        "pt": "então, depois",
        "ex": "I finished, then I went home."
      },
      {
        "en": "first",
        "pt": "primeiro",
        "ex": "First, I had packed my bags."
      },
      {
        "en": "next",
        "pt": "em seguida",
        "ex": "Next, we had breakfast."
      },
      {
        "en": "finally",
        "pt": "finalmente",
        "ex": "Finally, the train had arrived."
      },
      {
        "en": "in the end",
        "pt": "no final",
        "ex": "In the end, everything had worked out."
      },
      {
        "en": "sequence connector",
        "pt": "conector de sequência",
        "ex": "\"Before\" is a sequence connector."
      },
      {
        "en": "to arrive",
        "pt": "chegar",
        "ex": "She had arrived before the rain started."
      },
      {
        "en": "to leave",
        "pt": "sair",
        "ex": "They left after they had eaten."
      },
      {
        "en": "to close",
        "pt": "fechar",
        "ex": "The shop had closed by the time we arrived."
      },
      {
        "en": "to start",
        "pt": "começar",
        "ex": "The movie had started before we sat down."
      },
      {
        "en": "to open",
        "pt": "abrir",
        "ex": "The store had opened before I woke up."
      },
      {
        "en": "to finish",
        "pt": "terminar",
        "ex": "We left after we had finished dinner."
      },
      {
        "en": "to pack",
        "pt": "fazer as malas",
        "ex": "I had packed everything before the taxi arrived."
      },
      {
        "en": "to check in",
        "pt": "fazer check-in",
        "ex": "We had checked in before the flight was called."
      },
      {
        "en": "to check out",
        "pt": "fazer check-out",
        "ex": "They had checked out before noon."
      },
      {
        "en": "to lock",
        "pt": "trancar",
        "ex": "He had locked the door before he left."
      },
      {
        "en": "to turn off",
        "pt": "desligar",
        "ex": "She had turned off the lights before leaving."
      },
      {
        "en": "to prepare",
        "pt": "preparar",
        "ex": "We had prepared everything before the guests arrived."
      },
      {
        "en": "to expect",
        "pt": "esperar (algo acontecer)",
        "ex": "I hadn't expected that before the meeting."
      },
      {
        "en": "right after",
        "pt": "logo depois",
        "ex": "Right after we had eaten, we left."
      },
      {
        "en": "shortly before",
        "pt": "pouco antes",
        "ex": "Shortly before the show, they had arrived."
      },
      {
        "en": "a moment before",
        "pt": "um momento antes",
        "ex": "A moment before, she had noticed the mistake."
      }
    ],
    "expressions": [
      {
        "expr": "Before I..., I had already...",
        "meaning": "Antes de eu..., eu já tinha...",
        "example": "Before I left, I had already packed my bags."
      },
      {
        "expr": "After we had..., we...",
        "meaning": "Depois que a gente tinha..., a gente...",
        "example": "After we had eaten, we went for a walk."
      },
      {
        "expr": "By the time we got there...",
        "meaning": "Quando a gente chegou lá...",
        "example": "By the time we got there, the shop had closed."
      },
      {
        "expr": "As soon as I had finished...",
        "meaning": "Assim que eu tinha terminado...",
        "example": "As soon as I had finished, I called her."
      }
    ],
    "sentences": [
      "I had studied before the test.",
      "She called after she had left.",
      "By the time we got there, it had closed.",
      "As soon as I arrived, they had left.",
      "We waited until the rain had stopped.",
      "First, I had packed my bags.",
      "The movie had started before we sat down.",
      "He had locked the door before he left."
    ],
    "grammar": {
      "title": "Before & After: sequenciando eventos com Past Perfect",
      "rules": [
        "BEFORE + Past Simple pode vir com Past Perfect na outra oração: \"I had studied before the test started.\"",
        "AFTER + Past Perfect mostra a ação que aconteceu primeiro: \"After she had left, I arrived.\"",
        "BY THE TIME sempre aponta para o Past Perfect na oração seguinte: \"By the time we got there, it had closed.\"",
        "AS SOON AS liga duas ações próximas no tempo: \"As soon as I had finished, I called her.\""
      ],
      "table": {
        "headers": [
          "Conector",
          "Estrutura comum",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "before",
            "Past Perfect + before + Past Simple",
            "I had studied before the test.",
            "ação anterior primeiro"
          ],
          [
            "after",
            "After + Past Perfect, Past Simple",
            "After she had left, I arrived.",
            "ação anterior primeiro"
          ],
          [
            "by the time",
            "By the time + Past Simple, Past Perfect",
            "By the time we got there, it had closed.",
            "resultado já ocorrido"
          ],
          [
            "as soon as",
            "As soon as + Past Perfect, Past Simple",
            "As soon as I had finished, I called.",
            "sequência imediata"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I had studied ___ the test started.",
        "a": "before",
        "opts": [
          "before",
          "after",
          "since",
          "until"
        ]
      },
      {
        "q": "___ she had left, I arrived.",
        "a": "After",
        "opts": [
          "After",
          "Before",
          "Since",
          "While"
        ]
      },
      {
        "q": "By the time we got there, it ___ (close).",
        "a": "had closed",
        "opts": [
          "had closed",
          "closed",
          "has closed",
          "was closing"
        ]
      },
      {
        "q": "As soon as I ___ (finish), I called her.",
        "a": "had finished",
        "opts": [
          "had finished",
          "finished",
          "have finished",
          "was finishing"
        ]
      },
      {
        "q": "We waited ___ the rain had stopped.",
        "a": "until",
        "opts": [
          "until",
          "before",
          "after",
          "since"
        ]
      }
    ],
    "speak": [
      "I had studied before the test started.",
      "After she had left, I arrived.",
      "By the time we got there, it had closed.",
      "As soon as I had finished, I called her.",
      "We waited until the rain had stopped."
    ]
  },
  {
    "id": 409,
    "title": "Telling Your Story",
    "emoji": "🎭",
    "verbs": [
      "To Quit",
      "To Decide",
      "To Change",
      "To Discover"
    ],
    "vocab": [
      {
        "en": "dread",
        "pt": "pavor, medo grande",
        "ex": "I felt dread every Sunday evening."
      },
      {
        "en": "overnight",
        "pt": "da noite para o dia",
        "ex": "The decision didn't happen overnight."
      },
      {
        "en": "stable",
        "pt": "estável",
        "ex": "The job was stable, but I wasn't happy."
      },
      {
        "en": "freelance",
        "pt": "autônomo, freelancer",
        "ex": "She started a freelance business."
      },
      {
        "en": "capable",
        "pt": "capaz",
        "ex": "I was more capable than I thought."
      },
      {
        "en": "decision",
        "pt": "decisão",
        "ex": "It was the biggest decision of my life."
      },
      {
        "en": "journey",
        "pt": "jornada, viagem",
        "ex": "The journey changed everything for her."
      },
      {
        "en": "risk",
        "pt": "risco",
        "ex": "Quitting my job was a big risk."
      },
      {
        "en": "comfort zone",
        "pt": "zona de conforto",
        "ex": "I finally left my comfort zone."
      },
      {
        "en": "one-way ticket",
        "pt": "passagem só de ida",
        "ex": "I booked a one-way ticket to Asia."
      },
      {
        "en": "life-changing",
        "pt": "que muda a vida",
        "ex": "It was a life-changing experience."
      },
      {
        "en": "career",
        "pt": "carreira",
        "ex": "She changed careers after the trip."
      },
      {
        "en": "to quit",
        "pt": "largar, pedir demissão",
        "ex": "I quit my job five years ago."
      },
      {
        "en": "brave",
        "pt": "corajoso",
        "ex": "It was a brave, terrifying decision."
      },
      {
        "en": "terrifying",
        "pt": "aterrorizante",
        "ex": "The idea was exciting but terrifying."
      },
      {
        "en": "promotion",
        "pt": "promoção",
        "ex": "My boss offered me a promotion to stay."
      },
      {
        "en": "crisis",
        "pt": "crise",
        "ex": "My friends thought I was having a crisis."
      },
      {
        "en": "dream",
        "pt": "sonho",
        "ex": "Travelling was always my dream."
      },
      {
        "en": "opportunity",
        "pt": "oportunidade",
        "ex": "I saw an opportunity and took it."
      },
      {
        "en": "challenge",
        "pt": "desafio",
        "ex": "Living abroad was a big challenge."
      },
      {
        "en": "growth",
        "pt": "crescimento",
        "ex": "The trip brought real personal growth."
      },
      {
        "en": "confidence",
        "pt": "confiança",
        "ex": "I gained a lot of confidence."
      },
      {
        "en": "experience",
        "pt": "experiência",
        "ex": "It was an unforgettable experience."
      },
      {
        "en": "memory",
        "pt": "lembrança",
        "ex": "I still have that memory with me."
      },
      {
        "en": "turning point",
        "pt": "ponto de virada",
        "ex": "That trip was a turning point in my life."
      },
      {
        "en": "adventure",
        "pt": "aventura",
        "ex": "The whole journey felt like an adventure."
      },
      {
        "en": "change",
        "pt": "mudança",
        "ex": "Change can be scary but good."
      },
      {
        "en": "choice",
        "pt": "escolha",
        "ex": "It all started with one brave choice."
      },
      {
        "en": "to discover",
        "pt": "descobrir",
        "ex": "I discovered a new version of myself."
      },
      {
        "en": "to look back",
        "pt": "olhar para trás (relembrar)",
        "ex": "When I look back, I feel proud."
      }
    ],
    "expressions": [
      {
        "expr": "It all started when...",
        "meaning": "Tudo começou quando...",
        "example": "It all started when I decided to travel alone."
      },
      {
        "expr": "That was a turning point",
        "meaning": "Aquilo foi um ponto de virada",
        "example": "Quitting my job was a turning point."
      },
      {
        "expr": "Looking back, I...",
        "meaning": "Olhando para trás, eu...",
        "example": "Looking back, I know it was the right choice."
      },
      {
        "expr": "The question is: what are you waiting for?",
        "meaning": "A pergunta é: o que você está esperando?",
        "example": "I always ask myself: what are you waiting for?"
      }
    ],
    "sentences": [
      "I felt dread every Sunday evening.",
      "The decision didn't happen overnight.",
      "She started a freelance business.",
      "I was more capable than I thought.",
      "It all started when I decided to travel.",
      "That trip was a turning point in my life.",
      "I finally left my comfort zone.",
      "When I look back, I feel proud."
    ],
    "grammar": {
      "title": "Contando sua história: misturando os tempos verbais",
      "rules": [
        "Use Past Simple para os eventos principais da história: \"I quit my job.\"",
        "Use Past Continuous para o cenário e o contexto: \"I was feeling stuck.\"",
        "Use Present Perfect para falar de experiências sem tempo específico: \"I have travelled a lot since then.\"",
        "Use Past Perfect para explicar o que aconteceu ANTES do início da história: \"I had been saving money for two years.\""
      ],
      "table": {
        "headers": [
          "Tempo verbal",
          "Função na história",
          "Exemplo",
          "Quando usar"
        ],
        "rows": [
          [
            "Past Simple",
            "evento principal",
            "I quit my job.",
            "ação concluída, momento específico"
          ],
          [
            "Past Continuous",
            "cenário/contexto",
            "I was feeling stuck.",
            "ação de fundo"
          ],
          [
            "Present Perfect",
            "experiência geral",
            "I have changed a lot.",
            "sem tempo específico"
          ],
          [
            "Past Perfect",
            "o que veio antes",
            "I had been saving money.",
            "ação anterior à história"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "It all started ___ I decided to travel.",
        "a": "when",
        "opts": [
          "when",
          "while",
          "since",
          "for"
        ]
      },
      {
        "q": "That trip was a turning ___ in my life.",
        "a": "point",
        "opts": [
          "point",
          "moment",
          "time",
          "change"
        ]
      },
      {
        "q": "I finally left my comfort ___.",
        "a": "zone",
        "opts": [
          "zone",
          "place",
          "area",
          "space"
        ]
      },
      {
        "q": "I ___ (be) more capable than I thought.",
        "a": "was",
        "opts": [
          "was",
          "have been",
          "am",
          "had been"
        ]
      },
      {
        "q": "She started a ___ business after the trip.",
        "a": "freelance",
        "opts": [
          "freelance",
          "stable",
          "risky",
          "overnight"
        ]
      }
    ],
    "speak": [
      "It all started when I decided to travel alone.",
      "That trip was a turning point in my life.",
      "I finally left my comfort zone.",
      "Looking back, I know it was the right choice.",
      "I was more capable than I thought."
    ]
  },
  {
    "id": 410,
    "title": "Life Events",
    "emoji": "🌟",
    "verbs": [
      "To Graduate",
      "To Retire",
      "To Move",
      "To Achieve"
    ],
    "vocab": [
      {
        "en": "to graduate",
        "pt": "se formar",
        "ex": "She graduated from university last year."
      },
      {
        "en": "to get married",
        "pt": "se casar",
        "ex": "They got married in December."
      },
      {
        "en": "to have a baby",
        "pt": "ter um bebê",
        "ex": "They had a baby last spring."
      },
      {
        "en": "to retire",
        "pt": "se aposentar",
        "ex": "My father retired last year."
      },
      {
        "en": "to get promoted",
        "pt": "ser promovido",
        "ex": "She got promoted to manager."
      },
      {
        "en": "to move abroad",
        "pt": "se mudar para outro país",
        "ex": "He moved abroad for work."
      },
      {
        "en": "to start a business",
        "pt": "abrir um negócio",
        "ex": "She started a business after college."
      },
      {
        "en": "graduation",
        "pt": "formatura",
        "ex": "Graduation day was very emotional."
      },
      {
        "en": "wedding",
        "pt": "casamento (cerimônia)",
        "ex": "The wedding was small but beautiful."
      },
      {
        "en": "birth",
        "pt": "nascimento",
        "ex": "The birth of her daughter changed everything."
      },
      {
        "en": "divorce",
        "pt": "divórcio",
        "ex": "The divorce was difficult for everyone."
      },
      {
        "en": "anniversary",
        "pt": "aniversário (de casamento/evento)",
        "ex": "We celebrated our tenth anniversary."
      },
      {
        "en": "milestone",
        "pt": "marco importante",
        "ex": "Buying a house was a big milestone."
      },
      {
        "en": "achievement",
        "pt": "conquista",
        "ex": "Finishing the marathon was an achievement."
      },
      {
        "en": "to grow up",
        "pt": "crescer",
        "ex": "I grew up in a small town."
      },
      {
        "en": "childhood",
        "pt": "infância",
        "ex": "I had a happy childhood."
      },
      {
        "en": "adulthood",
        "pt": "vida adulta",
        "ex": "Adulthood brings new responsibilities."
      },
      {
        "en": "to lose a job",
        "pt": "perder o emprego",
        "ex": "He lost his job during the crisis."
      },
      {
        "en": "to change careers",
        "pt": "mudar de carreira",
        "ex": "She changed careers at forty."
      },
      {
        "en": "to fall in love",
        "pt": "se apaixonar",
        "ex": "They fell in love at university."
      },
      {
        "en": "to break up",
        "pt": "terminar (relacionamento)",
        "ex": "They broke up after two years."
      },
      {
        "en": "to buy a house",
        "pt": "comprar uma casa",
        "ex": "We bought a house last summer."
      },
      {
        "en": "to pass away",
        "pt": "falecer",
        "ex": "Her grandfather passed away last year."
      },
      {
        "en": "generation",
        "pt": "geração",
        "ex": "Each generation faces new challenges."
      },
      {
        "en": "memory",
        "pt": "lembrança",
        "ex": "That day is one of my best memories."
      },
      {
        "en": "celebration",
        "pt": "celebração",
        "ex": "The party was a big celebration."
      },
      {
        "en": "to look back",
        "pt": "olhar para trás",
        "ex": "I like to look back at old photos."
      },
      {
        "en": "to look forward to",
        "pt": "ansiar por, esperar ansiosamente",
        "ex": "I look forward to my graduation."
      },
      {
        "en": "life story",
        "pt": "história de vida",
        "ex": "Everyone has an interesting life story."
      },
      {
        "en": "to achieve",
        "pt": "alcançar, conquistar",
        "ex": "She achieved her biggest goal that year."
      }
    ],
    "expressions": [
      {
        "expr": "It was a big milestone",
        "meaning": "Foi um marco importante",
        "example": "Buying our first house was a big milestone."
      },
      {
        "expr": "Looking back on it...",
        "meaning": "Olhando para trás...",
        "example": "Looking back on it, it was the right decision."
      },
      {
        "expr": "I'll never forget the day...",
        "meaning": "Nunca vou esquecer o dia...",
        "example": "I'll never forget the day I graduated."
      },
      {
        "expr": "That changed my life",
        "meaning": "Isso mudou minha vida",
        "example": "Having a baby changed my life completely."
      }
    ],
    "sentences": [
      "She graduated from university last year.",
      "They got married in December.",
      "My father retired last year.",
      "She got promoted to manager.",
      "He moved abroad for work.",
      "We bought a house last summer.",
      "They fell in love at university.",
      "I'll never forget the day I graduated."
    ],
    "grammar": {
      "title": "Falando de marcos da vida: Past Simple + Present Perfect",
      "rules": [
        "Use Past Simple com data específica: \"She graduated in 2019.\"",
        "Use Present Perfect sem data específica, como um resumo de vida: \"She has achieved a lot.\"",
        "Verbos como get married, get promoted, have a baby são muito comuns em histórias de vida.",
        "Combine tempos verbais para contar sua própria linha do tempo com naturalidade."
      ],
      "table": {
        "headers": [
          "Marco",
          "Verbo comum",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "formatura",
            "to graduate",
            "She graduated last year.",
            "com data → Past Simple"
          ],
          [
            "casamento",
            "to get married",
            "They got married in June.",
            "com data → Past Simple"
          ],
          [
            "carreira",
            "to get promoted",
            "She has been promoted twice.",
            "sem data → Present Perfect"
          ],
          [
            "mudança",
            "to move abroad",
            "He moved abroad in 2021.",
            "com data → Past Simple"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "She ___ (graduate) from university last year.",
        "a": "graduated",
        "opts": [
          "graduated",
          "has graduated",
          "graduate",
          "graduating"
        ]
      },
      {
        "q": "They got ___ in December.",
        "a": "married",
        "opts": [
          "married",
          "marriage",
          "marry",
          "marrying"
        ]
      },
      {
        "q": "My father ___ (retire) last year.",
        "a": "retired",
        "opts": [
          "retired",
          "has retired",
          "retire",
          "retiring"
        ]
      },
      {
        "q": "She has ___ a lot in her career.",
        "a": "achieved",
        "opts": [
          "achieved",
          "achieve",
          "achieving",
          "achieves"
        ]
      },
      {
        "q": "Buying our first house was a big ___.",
        "a": "milestone",
        "opts": [
          "milestone",
          "birth",
          "divorce",
          "anniversary"
        ]
      }
    ],
    "speak": [
      "She graduated from university last year.",
      "They got married in December.",
      "My father retired last year.",
      "He moved abroad for work.",
      "I'll never forget the day I graduated."
    ]
  },
  {
    "id": 411,
    "title": "Mixing Past Tenses",
    "emoji": "🔀",
    "verbs": [
      "To Realize",
      "To Interrupt",
      "To Finish",
      "To Remember"
    ],
    "vocab": [
      {
        "en": "While",
        "pt": "Enquanto",
        "ex": "While I was cooking, the phone rang."
      },
      {
        "en": "When",
        "pt": "Quando",
        "ex": "When she arrived, we had already left."
      },
      {
        "en": "Before",
        "pt": "Antes",
        "ex": "I had studied English before I moved to Canada."
      },
      {
        "en": "After",
        "pt": "Depois",
        "ex": "After I finished the report, I went home."
      },
      {
        "en": "Already",
        "pt": "Já",
        "ex": "She had already left when I called."
      },
      {
        "en": "Just",
        "pt": "Acabou de",
        "ex": "I had just sat down when the meeting started."
      },
      {
        "en": "Since",
        "pt": "Desde",
        "ex": "I've worked here since 2019."
      },
      {
        "en": "For",
        "pt": "Por (duração)",
        "ex": "I've lived here for five years."
      },
      {
        "en": "Ago",
        "pt": "Atrás",
        "ex": "I finished college three years ago."
      },
      {
        "en": "Suddenly",
        "pt": "De repente",
        "ex": "Suddenly, the lights went out."
      },
      {
        "en": "Meanwhile",
        "pt": "Enquanto isso",
        "ex": "Meanwhile, the rest of the team was waiting."
      },
      {
        "en": "At that time",
        "pt": "Naquela época",
        "ex": "At that time, I was still studying."
      },
      {
        "en": "By the time",
        "pt": "Quando (já)",
        "ex": "By the time I arrived, the meeting had ended."
      },
      {
        "en": "Previously",
        "pt": "Anteriormente",
        "ex": "Previously, she had worked at a bank."
      },
      {
        "en": "Once",
        "pt": "Uma vez / assim que",
        "ex": "Once I finished, I felt relieved."
      },
      {
        "en": "Still",
        "pt": "Ainda",
        "ex": "He was still working when I left."
      },
      {
        "en": "Yet",
        "pt": "Ainda (negativa)",
        "ex": "I hadn't finished yet when she called."
      },
      {
        "en": "Never",
        "pt": "Nunca",
        "ex": "I had never seen snow before that trip."
      },
      {
        "en": "Ever",
        "pt": "Já (pergunta)",
        "ex": "Had you ever traveled alone before?"
      },
      {
        "en": "So far",
        "pt": "Até agora",
        "ex": "So far, I've learned a lot in this job."
      },
      {
        "en": "Earlier",
        "pt": "Mais cedo",
        "ex": "I had called her earlier that day."
      },
      {
        "en": "Later",
        "pt": "Mais tarde",
        "ex": "Later, I realized my mistake."
      },
      {
        "en": "That day",
        "pt": "Naquele dia",
        "ex": "That day, everything changed."
      },
      {
        "en": "One day",
        "pt": "Um dia",
        "ex": "One day, she decided to change careers."
      },
      {
        "en": "In the end",
        "pt": "No final",
        "ex": "In the end, everything worked out fine."
      },
      {
        "en": "Eventually",
        "pt": "Eventualmente",
        "ex": "Eventually, we found a solution."
      },
      {
        "en": "First",
        "pt": "Primeiro",
        "ex": "First, I checked my email."
      },
      {
        "en": "Then",
        "pt": "Então, depois",
        "ex": "Then, I went to the meeting."
      },
      {
        "en": "Finally",
        "pt": "Finalmente",
        "ex": "Finally, we finished the project."
      },
      {
        "en": "Afterwards",
        "pt": "Depois disso",
        "ex": "Afterwards, we celebrated."
      }
    ],
    "expressions": [
      {
        "expr": "While I was [doing X], [Y] happened",
        "meaning": "Enquanto eu estava fazendo X, Y aconteceu",
        "example": "While I was driving, my phone rang."
      },
      {
        "expr": "By the time I arrived, [Y] had already happened",
        "meaning": "Quando eu cheguei, Y já tinha acontecido",
        "example": "By the time I arrived, the meeting had already started."
      },
      {
        "expr": "I'd never [done X] before",
        "meaning": "Eu nunca tinha feito X antes",
        "example": "I'd never given a presentation before that day."
      },
      {
        "expr": "I've just [done X]",
        "meaning": "Eu acabei de fazer X",
        "example": "I've just finished my report."
      }
    ],
    "sentences": [
      "While I was working, the internet stopped.",
      "By the time I got there, she had already left.",
      "I had never visited Brazil before last year.",
      "I have just finished my English homework.",
      "Suddenly, everyone stopped talking.",
      "Meanwhile, my colleague was preparing the slides.",
      "First I checked my notes, then I called the client.",
      "In the end, everything worked out well."
    ],
    "grammar": {
      "title": "Misturando os quatro tempos do passado",
      "rules": [
        "Past Simple: ação concluída em um momento específico — I finished the report.",
        "Past Continuous: ação em andamento, geralmente interrompida — I was finishing the report when she called.",
        "Present Perfect: liga o passado ao presente, sem tempo específico — I have finished the report.",
        "Past Perfect: ação anterior a outra ação passada — I had finished the report before she called."
      ],
      "table": {
        "headers": [
          "Tempo",
          "Uso",
          "Exemplo",
          "Sinal típico"
        ],
        "rows": [
          [
            "Past Simple",
            "ação concluída, tempo definido",
            "I called her yesterday.",
            "yesterday, last week, ago"
          ],
          [
            "Past Continuous",
            "ação em andamento, cenário",
            "I was calling her when...",
            "while, at that moment"
          ],
          [
            "Present Perfect",
            "experiência, ligação ao presente",
            "I have called her before.",
            "ever, never, since, for"
          ],
          [
            "Past Perfect",
            "ação anterior a outra no passado",
            "I had called her before he arrived.",
            "before, by the time, already"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "While I ___ dinner, the phone rang.",
        "a": "was cooking",
        "opts": [
          "was cooking",
          "cooked",
          "cook",
          "have cooked"
        ]
      },
      {
        "q": "By the time I arrived, she ___ already left.",
        "a": "had",
        "opts": [
          "had",
          "has",
          "was",
          "did"
        ]
      },
      {
        "q": "I ___ never seen the ocean before that trip.",
        "a": "had",
        "opts": [
          "had",
          "have",
          "was",
          "did"
        ]
      },
      {
        "q": "I ___ just finished my report.",
        "a": "have",
        "opts": [
          "have",
          "had",
          "was",
          "did"
        ]
      },
      {
        "q": "Suddenly, the lights ___ out.",
        "a": "went",
        "opts": [
          "went",
          "go",
          "were going",
          "have gone"
        ]
      }
    ],
    "speak": [
      "While I was working, the internet stopped.",
      "By the time I got there, she had already left.",
      "I've just finished my English homework.",
      "Suddenly, everyone stopped talking.",
      "In the end, everything worked out well."
    ]
  },
  {
    "id": 412,
    "title": "Story Time Practice",
    "emoji": "📖",
    "verbs": [
      "To Tell",
      "To Happen",
      "To Continue",
      "To End"
    ],
    "vocab": [
      {
        "en": "Narrator",
        "pt": "Narrador",
        "ex": "The narrator told the story in past tense."
      },
      {
        "en": "Plot",
        "pt": "Enredo",
        "ex": "The plot of the story was very exciting."
      },
      {
        "en": "Character",
        "pt": "Personagem",
        "ex": "The main character was a young engineer."
      },
      {
        "en": "Beginning",
        "pt": "Início",
        "ex": "At the beginning, everything seemed normal."
      },
      {
        "en": "Middle",
        "pt": "Meio",
        "ex": "In the middle of the story, a problem appeared."
      },
      {
        "en": "End",
        "pt": "Final",
        "ex": "At the end, she found a great solution."
      },
      {
        "en": "Setting",
        "pt": "Cenário",
        "ex": "The setting of the story was a small office."
      },
      {
        "en": "Event",
        "pt": "Acontecimento",
        "ex": "The main event happened on a Friday."
      },
      {
        "en": "Memory",
        "pt": "Lembrança",
        "ex": "It brought back an old memory."
      },
      {
        "en": "Adventure",
        "pt": "Aventura",
        "ex": "It was a real adventure for the whole team."
      },
      {
        "en": "Twist",
        "pt": "Reviravolta",
        "ex": "The story had an unexpected twist."
      },
      {
        "en": "Ending",
        "pt": "Desfecho",
        "ex": "I loved the happy ending."
      },
      {
        "en": "Moral",
        "pt": "Moral (da história)",
        "ex": "The moral of the story was to never give up."
      },
      {
        "en": "Chapter",
        "pt": "Capítulo",
        "ex": "This was the hardest chapter of my career."
      },
      {
        "en": "Scene",
        "pt": "Cena",
        "ex": "I still remember that scene clearly."
      },
      {
        "en": "Once upon a time",
        "pt": "Era uma vez",
        "ex": "Once upon a time, a small company had a big idea."
      },
      {
        "en": "Suddenly",
        "pt": "De repente",
        "ex": "Suddenly, everything changed."
      },
      {
        "en": "Meanwhile",
        "pt": "Enquanto isso",
        "ex": "Meanwhile, the client was waiting for an answer."
      },
      {
        "en": "In the end",
        "pt": "No fim",
        "ex": "In the end, we solved the problem together."
      },
      {
        "en": "Turning point",
        "pt": "Ponto de virada",
        "ex": "That meeting was the turning point of the project."
      },
      {
        "en": "Flashback",
        "pt": "Flashback",
        "ex": "The story had a flashback to her first job."
      },
      {
        "en": "Cliffhanger",
        "pt": "Suspense (final em aberto)",
        "ex": "The episode ended with a big cliffhanger."
      },
      {
        "en": "Hero",
        "pt": "Herói",
        "ex": "She was the hero of the whole project."
      },
      {
        "en": "Villain",
        "pt": "Vilão",
        "ex": "In this story, bad luck was the real villain."
      },
      {
        "en": "Journey",
        "pt": "Jornada",
        "ex": "It was a long journey to reach that goal."
      },
      {
        "en": "Challenge",
        "pt": "Desafio",
        "ex": "The biggest challenge was the tight deadline."
      },
      {
        "en": "Lesson learned",
        "pt": "Lição aprendida",
        "ex": "The lesson learned was to plan ahead."
      },
      {
        "en": "Surprise",
        "pt": "Surpresa",
        "ex": "The ending was a big surprise for everyone."
      },
      {
        "en": "Conclusion",
        "pt": "Conclusão",
        "ex": "In conclusion, the project was a success."
      },
      {
        "en": "Storyteller",
        "pt": "Contador de histórias",
        "ex": "She is a great storyteller."
      }
    ],
    "expressions": [
      {
        "expr": "Let me tell you a story about...",
        "meaning": "Deixa eu te contar uma história sobre...",
        "example": "Let me tell you a story about my first job interview."
      },
      {
        "expr": "It all started when...",
        "meaning": "Tudo começou quando...",
        "example": "It all started when I lost my keys on my first day."
      },
      {
        "expr": "To make a long story short...",
        "meaning": "Resumindo a história...",
        "example": "To make a long story short, I got the job."
      },
      {
        "expr": "And that's how it happened",
        "meaning": "E foi assim que aconteceu",
        "example": "And that's how it happened — I changed my whole career."
      }
    ],
    "sentences": [
      "Once upon a time, there was a small startup.",
      "It all started with a simple idea.",
      "Suddenly, a big challenge appeared.",
      "Meanwhile, the whole team was working hard.",
      "The turning point came after months of effort.",
      "In the end, the story had a happy ending.",
      "To make a long story short, everything worked out.",
      "The lesson learned was to trust the process."
    ],
    "grammar": {
      "title": "Conectores para contar uma história",
      "rules": [
        "First / Then / After that / Finally organizam a sequência da história.",
        "Use Past Simple para a linha principal dos eventos: I woke up, I got dressed, I left.",
        "Use Past Continuous para descrever o cenário: The sun was shining, birds were singing.",
        "Use Past Perfect para explicar algo que aconteceu antes: I was tired because I hadn't slept well."
      ],
      "table": {
        "headers": [
          "Conector",
          "Uso",
          "Exemplo",
          "Posição"
        ],
        "rows": [
          [
            "First",
            "primeiro evento",
            "First, I checked my email.",
            "início"
          ],
          [
            "Then / After that",
            "evento seguinte",
            "Then, I called my manager.",
            "meio"
          ],
          [
            "Meanwhile",
            "ação simultânea",
            "Meanwhile, my team prepared the report.",
            "meio"
          ],
          [
            "Finally / In the end",
            "último evento/conclusão",
            "Finally, we solved the problem.",
            "fim"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Once ___ a time, there was a small company.",
        "a": "upon",
        "opts": [
          "upon",
          "on",
          "in",
          "at"
        ]
      },
      {
        "q": "___, I checked my email and answered two messages.",
        "a": "First",
        "opts": [
          "First",
          "Finally",
          "Meanwhile",
          "Ago"
        ]
      },
      {
        "q": "___, my colleague was preparing the presentation.",
        "a": "Meanwhile",
        "opts": [
          "Meanwhile",
          "First",
          "Finally",
          "Yet"
        ]
      },
      {
        "q": "The story had an unexpected ___.",
        "a": "twist",
        "opts": [
          "twist",
          "memory",
          "setting",
          "character"
        ]
      },
      {
        "q": "To make a long story ___, we won the contract.",
        "a": "short",
        "opts": [
          "short",
          "long",
          "end",
          "fast"
        ]
      }
    ],
    "speak": [
      "Let me tell you a story about my first job.",
      "It all started with a simple idea.",
      "Suddenly, everything changed.",
      "In the end, the story had a happy ending.",
      "To make a long story short, I got the job."
    ]
  },
  {
    "id": 413,
    "title": "First Conditional",
    "emoji": "🌦️",
    "verbs": [
      "To Happen",
      "To Decide",
      "To Finish",
      "To Call"
    ],
    "vocab": [
      {
        "en": "If",
        "pt": "Se",
        "ex": "If it rains, we will stay home."
      },
      {
        "en": "Unless",
        "pt": "A menos que",
        "ex": "Unless you hurry, you'll miss the bus."
      },
      {
        "en": "Will",
        "pt": "Vai / Irá",
        "ex": "She will call you tomorrow."
      },
      {
        "en": "Might",
        "pt": "Pode ser que",
        "ex": "It might rain later, so take an umbrella."
      },
      {
        "en": "In case",
        "pt": "Caso, para o caso de",
        "ex": "Take an umbrella in case it rains."
      },
      {
        "en": "As soon as",
        "pt": "Assim que",
        "ex": "I will call you as soon as I arrive."
      },
      {
        "en": "Provided that",
        "pt": "Desde que",
        "ex": "You'll pass, provided that you study."
      },
      {
        "en": "Likely",
        "pt": "Provável",
        "ex": "It is likely to rain this afternoon."
      },
      {
        "en": "Possibility",
        "pt": "Possibilidade",
        "ex": "There's a possibility of rain tomorrow."
      },
      {
        "en": "Real condition",
        "pt": "Condição real",
        "ex": "This is a real condition, it can really happen."
      },
      {
        "en": "Result",
        "pt": "Resultado",
        "ex": "If you work hard, the result will be great."
      },
      {
        "en": "Future",
        "pt": "Futuro",
        "ex": "If I save money, my future will be safer."
      },
      {
        "en": "Decision",
        "pt": "Decisão",
        "ex": "I'll make a decision if I get more information."
      },
      {
        "en": "Plan",
        "pt": "Plano",
        "ex": "If the plan works, we will save time."
      },
      {
        "en": "Chance",
        "pt": "Chance",
        "ex": "If you apply, you'll have a chance."
      },
      {
        "en": "Opportunity",
        "pt": "Oportunidade",
        "ex": "If you're free, this is a great opportunity."
      },
      {
        "en": "Promise",
        "pt": "Promessa",
        "ex": "I promise I'll help if you need it."
      },
      {
        "en": "Warning",
        "pt": "Aviso",
        "ex": "If you don't back up your files, you'll lose data."
      },
      {
        "en": "Advice",
        "pt": "Conselho",
        "ex": "If I were tired, I'd rest — that's my advice."
      },
      {
        "en": "Deadline",
        "pt": "Prazo",
        "ex": "If we miss the deadline, we'll lose the client."
      },
      {
        "en": "Weather",
        "pt": "Clima",
        "ex": "If the weather improves, we'll go outside."
      },
      {
        "en": "Rain",
        "pt": "Chuva",
        "ex": "If it doesn't rain, we'll have the meeting outside."
      },
      {
        "en": "Traffic",
        "pt": "Trânsito",
        "ex": "If there's traffic, I'll be late."
      },
      {
        "en": "Meeting",
        "pt": "Reunião",
        "ex": "If the meeting finishes early, I'll call you."
      },
      {
        "en": "Raise",
        "pt": "Aumento (salário)",
        "ex": "If I get a raise, I'll save more money."
      },
      {
        "en": "Promotion",
        "pt": "Promoção",
        "ex": "If she works hard, she'll get a promotion."
      },
      {
        "en": "Offer",
        "pt": "Oferta",
        "ex": "If they offer me the job, I'll accept it."
      },
      {
        "en": "Choice",
        "pt": "Escolha",
        "ex": "If I have a choice, I'll choose the morning shift."
      },
      {
        "en": "Risk",
        "pt": "Risco",
        "ex": "If we don't test it, we'll take a big risk."
      },
      {
        "en": "Outcome",
        "pt": "Resultado final",
        "ex": "If we plan well, the outcome will be positive."
      }
    ],
    "expressions": [
      {
        "expr": "If it rains, we will...",
        "meaning": "Se chover, nós vamos...",
        "example": "If it rains, we will cancel the picnic."
      },
      {
        "expr": "Unless you..., you won't...",
        "meaning": "A menos que você..., você não vai...",
        "example": "Unless you study, you won't pass the test."
      },
      {
        "expr": "As soon as I..., I will...",
        "meaning": "Assim que eu..., eu vou...",
        "example": "As soon as I finish, I will send you the file."
      },
      {
        "expr": "I'll call you if...",
        "meaning": "Eu ligo pra você se...",
        "example": "I'll call you if anything changes."
      }
    ],
    "sentences": [
      "If it rains, we will stay inside.",
      "Unless you hurry, you will miss the train.",
      "As soon as I arrive, I will text you.",
      "If she studies hard, she will pass the exam.",
      "I will call you if there are any problems.",
      "If we finish early, we will go for coffee.",
      "Unless the client agrees, we won't sign the contract.",
      "If I get a raise, I will save more money."
    ],
    "grammar": {
      "title": "First Conditional: condições reais e possíveis",
      "rules": [
        "Estrutura: If + Present Simple, will + verbo base — If it rains, we will stay home.",
        "Usa-se para situações reais e possíveis no futuro, não hipotéticas.",
        "\"Unless\" significa \"if not\": Unless you study, you won't pass = If you don't study, you won't pass.",
        "Pode inverter a ordem sem vírgula: We will stay home if it rains."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Uso",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "If + present, will + infinitive",
            "condição real futura",
            "If I finish, I will call you.",
            "ordem normal"
          ],
          [
            "will + infinitive if + present",
            "mesma ideia, ordem invertida",
            "I will call you if I finish.",
            "sem vírgula"
          ],
          [
            "Unless + present, will + infinitive",
            "condição negativa",
            "Unless you hurry, you'll be late.",
            "= if not"
          ],
          [
            "If + present, might/could + infinitive",
            "possibilidade menor",
            "If it rains, we might cancel it.",
            "menos certeza que \"will\""
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "If it rains, we ___ stay home.",
        "a": "will",
        "opts": [
          "will",
          "would",
          "are",
          "were"
        ]
      },
      {
        "q": "___ you hurry, you will miss the bus.",
        "a": "Unless",
        "opts": [
          "Unless",
          "If",
          "Because",
          "Since"
        ]
      },
      {
        "q": "If she ___ hard, she will pass.",
        "a": "studies",
        "opts": [
          "studies",
          "study",
          "will study",
          "studied"
        ]
      },
      {
        "q": "I will call you as soon as I ___.",
        "a": "arrive",
        "opts": [
          "arrive",
          "will arrive",
          "arrived",
          "arriving"
        ]
      },
      {
        "q": "If we finish early, we ___ go for coffee.",
        "a": "will",
        "opts": [
          "will",
          "would",
          "did",
          "are"
        ]
      }
    ],
    "speak": [
      "If it rains, we will stay inside.",
      "Unless you hurry, you will miss the train.",
      "I'll call you if anything changes.",
      "If she studies hard, she will pass the exam.",
      "If I get a raise, I will save more money."
    ]
  },
  {
    "id": 414,
    "title": "Second Conditional",
    "emoji": "💭",
    "verbs": [
      "To Win",
      "To Travel",
      "To Imagine",
      "To Choose"
    ],
    "vocab": [
      {
        "en": "Imaginary",
        "pt": "Imaginário",
        "ex": "This is just an imaginary situation."
      },
      {
        "en": "Unreal",
        "pt": "Irreal",
        "ex": "The situation is unreal, but let's imagine it."
      },
      {
        "en": "Hypothetical",
        "pt": "Hipotético",
        "ex": "It's a hypothetical question, not a real plan."
      },
      {
        "en": "Would",
        "pt": "Faria / Iria (hipotético)",
        "ex": "If I had time, I would travel more."
      },
      {
        "en": "Wish",
        "pt": "Desejo",
        "ex": "I wish I had more free time."
      },
      {
        "en": "Dream",
        "pt": "Sonho",
        "ex": "If I won the lottery, my dream would come true."
      },
      {
        "en": "Lottery",
        "pt": "Loteria",
        "ex": "If I won the lottery, I would quit my job."
      },
      {
        "en": "Million",
        "pt": "Milhão",
        "ex": "If I had a million dollars, I would invest it."
      },
      {
        "en": "If I were",
        "pt": "Se eu fosse",
        "ex": "If I were you, I would take that job."
      },
      {
        "en": "Fantasy",
        "pt": "Fantasia",
        "ex": "It sounds like a fantasy, but it could happen."
      },
      {
        "en": "Situation",
        "pt": "Situação",
        "ex": "What would you do in this situation?"
      },
      {
        "en": "Choice",
        "pt": "Escolha",
        "ex": "If I had a choice, I would work from home."
      },
      {
        "en": "Freedom",
        "pt": "Liberdade",
        "ex": "If I were rich, I would have more freedom."
      },
      {
        "en": "Adventure",
        "pt": "Aventura",
        "ex": "If I could, I would go on a big adventure."
      },
      {
        "en": "Opportunity",
        "pt": "Oportunidade",
        "ex": "If I had the opportunity, I'd study abroad."
      },
      {
        "en": "Decision",
        "pt": "Decisão",
        "ex": "If it were my decision, I would change everything."
      },
      {
        "en": "Advice",
        "pt": "Conselho",
        "ex": "If you asked for my advice, I would say wait."
      },
      {
        "en": "Imagination",
        "pt": "Imaginação",
        "ex": "Use your imagination — what would you do?"
      },
      {
        "en": "Possibility",
        "pt": "Possibilidade (remota)",
        "ex": "It's a small possibility, but imagine it."
      },
      {
        "en": "Pretend",
        "pt": "Fingir, imaginar",
        "ex": "Let's pretend we had unlimited money."
      },
      {
        "en": "Suppose",
        "pt": "Suponha",
        "ex": "Suppose you had one more year to plan."
      },
      {
        "en": "Scenario",
        "pt": "Cenário",
        "ex": "In this scenario, what would you change?"
      },
      {
        "en": "Ideal",
        "pt": "Ideal",
        "ex": "In an ideal world, I would work less."
      },
      {
        "en": "Perfect world",
        "pt": "Mundo perfeito",
        "ex": "In a perfect world, everyone would have a job."
      },
      {
        "en": "Chance",
        "pt": "Chance",
        "ex": "If I had the chance, I would move abroad."
      },
      {
        "en": "Luck",
        "pt": "Sorte",
        "ex": "If I had more luck, I would try the lottery."
      },
      {
        "en": "Wealth",
        "pt": "Riqueza",
        "ex": "If I had wealth, I would help my family."
      },
      {
        "en": "Fame",
        "pt": "Fama",
        "ex": "If I had fame, life would be very different."
      },
      {
        "en": "Career change",
        "pt": "Mudança de carreira",
        "ex": "If I were braver, I would make a career change."
      },
      {
        "en": "Life change",
        "pt": "Mudança de vida",
        "ex": "A big life change would need a lot of courage."
      }
    ],
    "expressions": [
      {
        "expr": "If I were you...",
        "meaning": "Se eu fosse você...",
        "example": "If I were you, I would accept the offer."
      },
      {
        "expr": "What would you do if...?",
        "meaning": "O que você faria se...?",
        "example": "What would you do if you won the lottery?"
      },
      {
        "expr": "I wish I could...",
        "meaning": "Eu queria poder...",
        "example": "I wish I could travel more often."
      },
      {
        "expr": "If I won the lottery, I would...",
        "meaning": "Se eu ganhasse na loteria, eu...",
        "example": "If I won the lottery, I would open my own business."
      }
    ],
    "sentences": [
      "If I had more time, I would travel more.",
      "If I were you, I would take that job.",
      "What would you do if you won the lottery?",
      "I wish I could speak three languages.",
      "If she had the chance, she would move abroad.",
      "If we had more money, we would hire more people.",
      "If I were braver, I would start my own company.",
      "If they asked me, I would say yes."
    ],
    "grammar": {
      "title": "Second Conditional: situações imaginárias e hipotéticas",
      "rules": [
        "Estrutura: If + Past Simple, would + verbo base — If I had time, I would travel.",
        "Usa-se para situações imaginárias, improváveis ou impossíveis no presente/futuro.",
        "Com o verbo \"to be\", usa-se \"were\" para todas as pessoas: If I were rich...",
        "Diferente do First Conditional, que fala de situações reais e possíveis."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Uso",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "If + past simple, would + infinitive",
            "situação imaginária",
            "If I had money, I would travel.",
            "improvável/hipotético"
          ],
          [
            "If I were...",
            "conselho ou opinião",
            "If I were you, I would wait.",
            "forma padrão com \"were\""
          ],
          [
            "would + infinitive if + past",
            "ordem invertida",
            "I would travel if I had money.",
            "sem vírgula"
          ],
          [
            "First vs Second Conditional",
            "real vs imaginário",
            "If it rains... (real) / If I won... (imaginário)",
            "compare os dois"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "If I ___ more time, I would travel more.",
        "a": "had",
        "opts": [
          "had",
          "have",
          "has",
          "will have"
        ]
      },
      {
        "q": "If I ___ you, I would accept the offer.",
        "a": "were",
        "opts": [
          "were",
          "was",
          "am",
          "be"
        ]
      },
      {
        "q": "What ___ you do if you won the lottery?",
        "a": "would",
        "opts": [
          "would",
          "will",
          "do",
          "did"
        ]
      },
      {
        "q": "I wish I ___ speak three languages.",
        "a": "could",
        "opts": [
          "could",
          "can",
          "would",
          "will"
        ]
      },
      {
        "q": "If she had the chance, she ___ move abroad.",
        "a": "would",
        "opts": [
          "would",
          "will",
          "can",
          "did"
        ]
      }
    ],
    "speak": [
      "If I had more time, I would travel more.",
      "If I were you, I would take that job.",
      "What would you do if you won the lottery?",
      "I wish I could speak three languages.",
      "If I were braver, I would start my own company."
    ]
  },
  {
    "id": 415,
    "title": "Reported Speech Basics",
    "emoji": "🗣️",
    "verbs": [
      "To Report",
      "To Mention",
      "To Explain",
      "To Repeat"
    ],
    "vocab": [
      {
        "en": "Statement",
        "pt": "Declaração",
        "ex": "She made a statement about the delay."
      },
      {
        "en": "Backshift",
        "pt": "Mudança de tempo verbal",
        "ex": "Backshift moves \"is\" to \"was\" in reported speech."
      },
      {
        "en": "Direct speech",
        "pt": "Discurso direto",
        "ex": "In direct speech, she said, \"I am tired.\""
      },
      {
        "en": "Indirect speech",
        "pt": "Discurso indireto",
        "ex": "In indirect speech, she said she was tired."
      },
      {
        "en": "Quotation",
        "pt": "Citação",
        "ex": "The article included a quotation from the manager."
      },
      {
        "en": "Said that",
        "pt": "Disse que",
        "ex": "He said that the meeting was cancelled."
      },
      {
        "en": "Told me",
        "pt": "Me disse que",
        "ex": "She told me that she was moving to Brazil."
      },
      {
        "en": "Mentioned",
        "pt": "Mencionou",
        "ex": "He mentioned that the report was ready."
      },
      {
        "en": "Explained",
        "pt": "Explicou",
        "ex": "She explained that the flight had been delayed."
      },
      {
        "en": "Claimed",
        "pt": "Alegou",
        "ex": "He claimed that he had finished the project."
      },
      {
        "en": "Admitted",
        "pt": "Admitiu",
        "ex": "She admitted that she had made a mistake."
      },
      {
        "en": "Promised",
        "pt": "Prometeu",
        "ex": "He promised that he would call back."
      },
      {
        "en": "Denied",
        "pt": "Negou",
        "ex": "She denied that she had seen the email."
      },
      {
        "en": "Reported",
        "pt": "Relatou",
        "ex": "The news reported that sales had increased."
      },
      {
        "en": "According to",
        "pt": "De acordo com",
        "ex": "According to him, the deal was closed."
      },
      {
        "en": "Apparently",
        "pt": "Aparentemente",
        "ex": "Apparently, she had already left the company."
      },
      {
        "en": "Allegedly",
        "pt": "Supostamente",
        "ex": "He allegedly said the project would fail."
      },
      {
        "en": "Source",
        "pt": "Fonte",
        "ex": "The source said the news was true."
      },
      {
        "en": "to admit",
        "pt": "admitir",
        "ex": "He admitted that he was wrong."
      },
      {
        "en": "Time change",
        "pt": "Mudança de tempo",
        "ex": "\"Today\" becomes \"that day\" in reported speech."
      },
      {
        "en": "Yesterday → the day before",
        "pt": "ontem → no dia anterior",
        "ex": "She said she had called the day before."
      },
      {
        "en": "Tomorrow → the next day",
        "pt": "amanhã → no dia seguinte",
        "ex": "He said he would call the next day."
      },
      {
        "en": "Here → there",
        "pt": "aqui → lá",
        "ex": "She said the meeting was there, not here."
      },
      {
        "en": "This → that",
        "pt": "este → aquele",
        "ex": "He said that project, not this one."
      },
      {
        "en": "Ago → before",
        "pt": "atrás → antes",
        "ex": "She said it happened two days before."
      },
      {
        "en": "Now → then",
        "pt": "agora → naquele momento",
        "ex": "He said he was busy then."
      },
      {
        "en": "Today → that day",
        "pt": "hoje → naquele dia",
        "ex": "She said she was tired that day."
      },
      {
        "en": "Quote",
        "pt": "Citar, citação",
        "ex": "Can you quote what she actually said?"
      },
      {
        "en": "Paraphrase",
        "pt": "Parafrasear",
        "ex": "I will paraphrase what he told me."
      },
      {
        "en": "Message",
        "pt": "Recado",
        "ex": "He left a message saying he would be late."
      }
    ],
    "expressions": [
      {
        "expr": "She said that...",
        "meaning": "Ela disse que...",
        "example": "She said that the meeting had been rescheduled."
      },
      {
        "expr": "He told me that...",
        "meaning": "Ele me disse que...",
        "example": "He told me that he was starting a new job."
      },
      {
        "expr": "According to him/her...",
        "meaning": "De acordo com ele/ela...",
        "example": "According to her, the project was on track."
      },
      {
        "expr": "Apparently...",
        "meaning": "Aparentemente...",
        "example": "Apparently, she had already accepted another offer."
      }
    ],
    "sentences": [
      "She said that she was tired.",
      "He told me that he had finished the report.",
      "They said that they would arrive late.",
      "She mentioned that the meeting was cancelled.",
      "He admitted that he had made a mistake.",
      "According to my manager, the deal is closed.",
      "Apparently, she has already left the company.",
      "She promised that she would call back."
    ],
    "grammar": {
      "title": "Reported Speech: como relatar o que alguém disse",
      "rules": [
        "Verbos geralmente \"voltam\" um tempo verbal (backshift): \"I am tired\" → She said she was tired.",
        "Present Simple → Past Simple / Present Perfect → Past Perfect / Will → Would.",
        "Pronomes e expressões de tempo/lugar mudam: I→she, today→that day, here→there.",
        "Não é sempre obrigatório mudar o tempo, se a informação ainda é verdadeira no presente."
      ],
      "table": {
        "headers": [
          "Discurso direto",
          "Discurso indireto",
          "Exemplo direto",
          "Exemplo indireto"
        ],
        "rows": [
          [
            "Present Simple",
            "Past Simple",
            "\"I work here.\"",
            "She said she worked there."
          ],
          [
            "Present Continuous",
            "Past Continuous",
            "\"I am working.\"",
            "He said he was working."
          ],
          [
            "Present Perfect",
            "Past Perfect",
            "\"I have finished.\"",
            "She said she had finished."
          ],
          [
            "Will",
            "Would",
            "\"I will call.\"",
            "He said he would call."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"I am tired,\" she said. → She said she ___ tired.",
        "a": "was",
        "opts": [
          "was",
          "is",
          "were",
          "be"
        ]
      },
      {
        "q": "\"I will call you.\" → He said he ___ call me.",
        "a": "would",
        "opts": [
          "would",
          "will",
          "can",
          "could"
        ]
      },
      {
        "q": "\"I have finished.\" → She said she ___ finished.",
        "a": "had",
        "opts": [
          "had",
          "has",
          "have",
          "was"
        ]
      },
      {
        "q": "She said that she ___ tired that day.",
        "a": "was",
        "opts": [
          "was",
          "is",
          "be",
          "were"
        ]
      },
      {
        "q": "___ him, the deal is closed.",
        "a": "According to",
        "opts": [
          "According to",
          "Apparently at",
          "Said by",
          "Told to"
        ]
      }
    ],
    "speak": [
      "She said that she was tired.",
      "He told me that he had finished the report.",
      "They said that they would arrive late.",
      "According to my manager, the deal is closed.",
      "Apparently, she has already left the company."
    ]
  },
  {
    "id": 416,
    "title": "Say, Tell, Ask",
    "emoji": "💬",
    "verbs": [
      "To Say",
      "To Tell",
      "To Ask",
      "To Answer"
    ],
    "vocab": [
      {
        "en": "Say",
        "pt": "Dizer",
        "ex": "She said she was busy."
      },
      {
        "en": "Tell",
        "pt": "Contar, dizer (a alguém)",
        "ex": "He told me the news."
      },
      {
        "en": "Ask",
        "pt": "Perguntar",
        "ex": "She asked me if I was ready."
      },
      {
        "en": "Reply",
        "pt": "Responder",
        "ex": "He replied that he would help."
      },
      {
        "en": "Answer",
        "pt": "Responder",
        "ex": "She answered the question quickly."
      },
      {
        "en": "Respond",
        "pt": "Responder",
        "ex": "He responded to the email right away."
      },
      {
        "en": "Mention",
        "pt": "Mencionar",
        "ex": "She mentioned the deadline in the meeting."
      },
      {
        "en": "Explain",
        "pt": "Explicar",
        "ex": "He explained the situation clearly."
      },
      {
        "en": "Whisper",
        "pt": "Sussurrar",
        "ex": "She whispered the secret to me."
      },
      {
        "en": "Shout",
        "pt": "Gritar",
        "ex": "He shouted the news across the room."
      },
      {
        "en": "Request",
        "pt": "Pedido, solicitar",
        "ex": "She made a request for more time."
      },
      {
        "en": "Question",
        "pt": "Pergunta",
        "ex": "He asked a difficult question."
      },
      {
        "en": "Command",
        "pt": "Ordem",
        "ex": "The manager gave a clear command."
      },
      {
        "en": "Order",
        "pt": "Mandar, ordem",
        "ex": "He ordered them to finish the report."
      },
      {
        "en": "Advice",
        "pt": "Conselho",
        "ex": "She gave me some good advice."
      },
      {
        "en": "Suggestion",
        "pt": "Sugestão",
        "ex": "He made a helpful suggestion."
      },
      {
        "en": "Warning",
        "pt": "Aviso",
        "ex": "She gave us a warning about the deadline."
      },
      {
        "en": "Invitation",
        "pt": "Convite",
        "ex": "He sent an invitation to the meeting."
      },
      {
        "en": "to complain",
        "pt": "reclamar",
        "ex": "He complained that the food was cold."
      },
      {
        "en": "To someone",
        "pt": "Para alguém",
        "ex": "You say something to someone."
      },
      {
        "en": "to suggest",
        "pt": "sugerir",
        "ex": "She suggested we take a taxi."
      },
      {
        "en": "If / whether",
        "pt": "Se (pergunta indireta)",
        "ex": "He asked if I was coming."
      },
      {
        "en": "Wh-question",
        "pt": "Pergunta com wh-",
        "ex": "She asked what time it was."
      },
      {
        "en": "Polite request",
        "pt": "Pedido educado",
        "ex": "Could you tell me the time, please?"
      },
      {
        "en": "Instruction",
        "pt": "Instrução",
        "ex": "He gave clear instructions for the task."
      },
      {
        "en": "Statement",
        "pt": "Afirmação",
        "ex": "She made a short statement."
      },
      {
        "en": "Promise",
        "pt": "Promessa",
        "ex": "He made a promise to help."
      },
      {
        "en": "Apology",
        "pt": "Desculpa",
        "ex": "She said an apology for being late."
      },
      {
        "en": "Greeting",
        "pt": "Cumprimento",
        "ex": "He said a quick greeting and left."
      }
    ],
    "expressions": [
      {
        "expr": "Tell me about...",
        "meaning": "Me conta sobre...",
        "example": "Tell me about your new job."
      },
      {
        "expr": "She asked me if...",
        "meaning": "Ela me perguntou se...",
        "example": "She asked me if I had finished the report."
      },
      {
        "expr": "He said (that)...",
        "meaning": "Ele disse (que)...",
        "example": "He said that he would be late."
      },
      {
        "expr": "Could you tell me...?",
        "meaning": "Você poderia me dizer...?",
        "example": "Could you tell me what time the meeting is?"
      }
    ],
    "sentences": [
      "She told me about her new job.",
      "He said that he was very busy.",
      "They asked me if I was free tomorrow.",
      "Could you tell me the time, please?",
      "She asked what time the meeting started.",
      "He told her the truth.",
      "They said hello and left quickly.",
      "She asked whether I needed help."
    ],
    "grammar": {
      "title": "Say vs Tell vs Ask: qual usar?",
      "rules": [
        "\"Say\" não precisa de objeto pessoal: She said she was tired. (não \"She said me\")",
        "\"Tell\" sempre precisa de um objeto pessoal: He told me the news. (não \"He told the news\" sozinho)",
        "\"Ask\" pode ser seguido de \"if/whether\" (sim/não) ou uma wh-question: She asked if I was ready.",
        "Tell também é usado em expressões: tell the truth, tell a story, tell the time."
      ],
      "table": {
        "headers": [
          "Verbo",
          "Uso",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "Say",
            "sem objeto pessoal",
            "She said that she was tired.",
            "say something (to someone)"
          ],
          [
            "Tell",
            "com objeto pessoal",
            "He told me the news.",
            "tell someone something"
          ],
          [
            "Ask + if/whether",
            "pergunta sim/não",
            "She asked if I was ready.",
            "pergunta indireta"
          ],
          [
            "Ask + wh-word",
            "pergunta aberta",
            "He asked what time it was.",
            "pergunta indireta"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "She ___ me that she was tired.",
        "a": "told",
        "opts": [
          "told",
          "said",
          "asked",
          "spoke"
        ]
      },
      {
        "q": "He ___ that he would call later.",
        "a": "said",
        "opts": [
          "said",
          "told",
          "asked",
          "spoke"
        ]
      },
      {
        "q": "She asked ___ I was ready.",
        "a": "if",
        "opts": [
          "if",
          "that",
          "what",
          "said"
        ]
      },
      {
        "q": "Could you ___ me the time, please?",
        "a": "tell",
        "opts": [
          "tell",
          "say",
          "ask",
          "speak"
        ]
      },
      {
        "q": "He asked ___ time the meeting started.",
        "a": "what",
        "opts": [
          "what",
          "if",
          "that",
          "who"
        ]
      }
    ],
    "speak": [
      "Tell me about your new job.",
      "She asked me if I had finished the report.",
      "He said that he would be late.",
      "Could you tell me what time the meeting is?",
      "She asked whether I needed help."
    ]
  },
  {
    "id": 417,
    "title": "Passive Voice Basics",
    "emoji": "🏗️",
    "verbs": [
      "To Build",
      "To Make",
      "To Design",
      "To Produce"
    ],
    "vocab": [
      {
        "en": "to build",
        "pt": "construir",
        "ex": "The bridge was built in 1998."
      },
      {
        "en": "Active",
        "pt": "Ativa",
        "ex": "In the active voice, the subject does the action."
      },
      {
        "en": "factory",
        "pt": "fábrica",
        "ex": "These shoes are made in a local factory."
      },
      {
        "en": "to deliver",
        "pt": "entregar",
        "ex": "The package will be delivered tomorrow."
      },
      {
        "en": "Agent",
        "pt": "Agente (quem faz a ação)",
        "ex": "The agent is introduced with \"by\"."
      },
      {
        "en": "By",
        "pt": "Por (agente)",
        "ex": "The bridge was built by a local company."
      },
      {
        "en": "Is made",
        "pt": "É feito",
        "ex": "This bag is made of leather."
      },
      {
        "en": "Was built",
        "pt": "Foi construído",
        "ex": "The factory was built in 2005."
      },
      {
        "en": "Product",
        "pt": "Produto",
        "ex": "This product is sold all over the world."
      },
      {
        "en": "Material",
        "pt": "Material",
        "ex": "The material is imported from Italy."
      },
      {
        "en": "Process",
        "pt": "Processo",
        "ex": "The process is checked twice a day."
      },
      {
        "en": "Machine",
        "pt": "Máquina",
        "ex": "The parts are cut by a machine."
      },
      {
        "en": "Company",
        "pt": "Empresa",
        "ex": "The app was developed by a small company."
      },
      {
        "en": "Brand",
        "pt": "Marca",
        "ex": "The brand is known around the world."
      },
      {
        "en": "Invented",
        "pt": "Inventado",
        "ex": "The telephone was invented by Alexander Graham Bell."
      },
      {
        "en": "Designed",
        "pt": "Projetado",
        "ex": "This chair was designed by a Brazilian architect."
      },
      {
        "en": "Produced",
        "pt": "Produzido",
        "ex": "These shoes are produced in Vietnam."
      },
      {
        "en": "Manufactured",
        "pt": "Fabricado",
        "ex": "The cars are manufactured in this plant."
      },
      {
        "en": "Exported",
        "pt": "Exportado",
        "ex": "Coffee is exported to many countries."
      },
      {
        "en": "Imported",
        "pt": "Importado",
        "ex": "The fabric is imported from India."
      },
      {
        "en": "Delivered",
        "pt": "Entregue",
        "ex": "The package is delivered every morning."
      },
      {
        "en": "Packaged",
        "pt": "Embalado",
        "ex": "The products are packaged carefully."
      },
      {
        "en": "Assembled",
        "pt": "Montado",
        "ex": "The furniture is assembled in the factory."
      },
      {
        "en": "Tested",
        "pt": "Testado",
        "ex": "Every unit is tested before shipping."
      },
      {
        "en": "Launched",
        "pt": "Lançado",
        "ex": "The new product is launched every year."
      },
      {
        "en": "Sold",
        "pt": "Vendido",
        "ex": "These items are sold online only."
      },
      {
        "en": "Used",
        "pt": "Usado",
        "ex": "This tool is used by many engineers."
      },
      {
        "en": "Repaired",
        "pt": "Consertado",
        "ex": "The machine is repaired once a month."
      },
      {
        "en": "Recycled",
        "pt": "Reciclado",
        "ex": "The plastic is recycled after use."
      }
    ],
    "expressions": [
      {
        "expr": "It is made of...",
        "meaning": "É feito de...",
        "example": "This table is made of wood."
      },
      {
        "expr": "This was built in...",
        "meaning": "Isso foi construído em...",
        "example": "This building was built in 1990."
      },
      {
        "expr": "The product is designed by...",
        "meaning": "O produto é projetado por...",
        "example": "The product is designed by our engineering team."
      },
      {
        "expr": "It was invented by...",
        "meaning": "Foi inventado por...",
        "example": "The lightbulb was invented by Thomas Edison."
      }
    ],
    "sentences": [
      "This bag is made of leather.",
      "The bridge was built in 1998.",
      "The reports are checked every week.",
      "This product is sold in twenty countries.",
      "The machine is repaired once a year.",
      "The cars are manufactured in Brazil.",
      "This app was designed by a small team.",
      "The packages are delivered every morning."
    ],
    "grammar": {
      "title": "Passive Voice: be + particípio passado",
      "rules": [
        "Estrutura: sujeito + be (is/are/was/were) + particípio passado.",
        "Foco na ação ou no resultado, não em quem faz: The car is made in Germany.",
        "Adiciona-se \"by + agente\" apenas quando é importante dizer quem fez: It was designed by a famous architect.",
        "Presente: is/are + particípio. Passado: was/were + particípio."
      ],
      "table": {
        "headers": [
          "Tempo",
          "Estrutura",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "Presente passivo",
            "is/are + particípio",
            "The product is made here.",
            "ação habitual"
          ],
          [
            "Passado passivo",
            "was/were + particípio",
            "It was built in 2010.",
            "ação concluída"
          ],
          [
            "Com agente",
            "... + by + agente",
            "Designed by a famous engineer.",
            "só quando relevante"
          ],
          [
            "Sem agente",
            "sem \"by\"",
            "The bridge was built in 1998.",
            "agente desconhecido/óbvio"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "This bag ___ made of leather.",
        "a": "is",
        "opts": [
          "is",
          "was",
          "are",
          "be"
        ]
      },
      {
        "q": "The bridge ___ built in 1998.",
        "a": "was",
        "opts": [
          "was",
          "is",
          "were",
          "been"
        ]
      },
      {
        "q": "The cars ___ manufactured in Brazil.",
        "a": "are",
        "opts": [
          "are",
          "is",
          "was",
          "be"
        ]
      },
      {
        "q": "This app was designed ___ a small team.",
        "a": "by",
        "opts": [
          "by",
          "from",
          "with",
          "to"
        ]
      },
      {
        "q": "The packages ___ delivered every morning.",
        "a": "are",
        "opts": [
          "are",
          "is",
          "was",
          "be"
        ]
      }
    ],
    "speak": [
      "This bag is made of leather.",
      "The bridge was built in 1998.",
      "This product is sold in twenty countries.",
      "The cars are manufactured in Brazil.",
      "This app was designed by a small team."
    ]
  },
  {
    "id": 418,
    "title": "Passive in the Past",
    "emoji": "📜",
    "verbs": [
      "To Discover",
      "To Create",
      "To Announce",
      "To Confirm"
    ],
    "vocab": [
      {
        "en": "History",
        "pt": "História",
        "ex": "This building has an interesting history."
      },
      {
        "en": "Invention",
        "pt": "Invenção",
        "ex": "The invention was announced last year."
      },
      {
        "en": "Discovery",
        "pt": "Descoberta",
        "ex": "The discovery was made by a small team."
      },
      {
        "en": "Decision",
        "pt": "Decisão",
        "ex": "The decision was made yesterday."
      },
      {
        "en": "Announcement",
        "pt": "Anúncio",
        "ex": "The announcement was made at the meeting."
      },
      {
        "en": "Confirmation",
        "pt": "Confirmação",
        "ex": "The confirmation was sent by email."
      },
      {
        "en": "Event",
        "pt": "Evento",
        "ex": "The event was organized by the whole team."
      },
      {
        "en": "Ceremony",
        "pt": "Cerimônia",
        "ex": "The ceremony was held last Friday."
      },
      {
        "en": "Agreement",
        "pt": "Acordo",
        "ex": "The agreement was signed last month."
      },
      {
        "en": "Contract",
        "pt": "Contrato",
        "ex": "The contract was reviewed by a lawyer."
      },
      {
        "en": "Deal",
        "pt": "Negócio, acordo",
        "ex": "The deal was closed yesterday."
      },
      {
        "en": "Signed",
        "pt": "Assinado",
        "ex": "The contract was signed by both companies."
      },
      {
        "en": "Closed",
        "pt": "Fechado (negócio)",
        "ex": "The deal was closed in record time."
      },
      {
        "en": "Opened",
        "pt": "Aberto (inaugurado)",
        "ex": "The new store was opened last week."
      },
      {
        "en": "Founded",
        "pt": "Fundado",
        "ex": "The company was founded in 1995."
      },
      {
        "en": "Established",
        "pt": "Estabelecido",
        "ex": "The rule was established years ago."
      },
      {
        "en": "Launched",
        "pt": "Lançado",
        "ex": "The product was launched in March."
      },
      {
        "en": "Released",
        "pt": "Lançado (divulgado)",
        "ex": "The report was released to the public."
      },
      {
        "en": "Published",
        "pt": "Publicado",
        "ex": "The article was published last week."
      },
      {
        "en": "Awarded",
        "pt": "Premiado",
        "ex": "She was awarded employee of the year."
      },
      {
        "en": "Elected",
        "pt": "Eleito",
        "ex": "He was elected team leader."
      },
      {
        "en": "Appointed",
        "pt": "Nomeado",
        "ex": "She was appointed manager last month."
      },
      {
        "en": "Promoted",
        "pt": "Promovido",
        "ex": "He was promoted to senior analyst."
      },
      {
        "en": "Hired",
        "pt": "Contratado",
        "ex": "She was hired two years ago."
      },
      {
        "en": "Fired",
        "pt": "Demitido",
        "ex": "He was fired after the incident."
      },
      {
        "en": "Canceled",
        "pt": "Cancelado",
        "ex": "The meeting was canceled at the last minute."
      },
      {
        "en": "Postponed",
        "pt": "Adiado",
        "ex": "The launch was postponed to next month."
      },
      {
        "en": "Rescheduled",
        "pt": "Remarcado",
        "ex": "The interview was rescheduled for Friday."
      },
      {
        "en": "Celebrated",
        "pt": "Comemorado",
        "ex": "The anniversary was celebrated with the team."
      },
      {
        "en": "Confirmed",
        "pt": "Confirmado",
        "ex": "The order was confirmed this morning."
      }
    ],
    "expressions": [
      {
        "expr": "It was decided that...",
        "meaning": "Foi decidido que...",
        "example": "It was decided that the launch would be postponed."
      },
      {
        "expr": "It is said/believed that...",
        "meaning": "Diz-se/acredita-se que...",
        "example": "It is believed that the new policy will reduce costs."
      },
      {
        "expr": "The [X] was signed/closed.",
        "meaning": "O [X] foi assinado/fechado.",
        "example": "The contract was signed yesterday."
      },
      {
        "expr": "It has been confirmed that...",
        "meaning": "Foi confirmado que...",
        "example": "It has been confirmed that the event will happen in March."
      }
    ],
    "sentences": [
      "The company was founded in 1995.",
      "The contract was signed last week.",
      "The meeting was canceled at the last minute.",
      "She was promoted to manager last year.",
      "The report was published yesterday.",
      "It was decided that we would hire more people.",
      "The launch was postponed to next month.",
      "He was hired two years ago."
    ],
    "grammar": {
      "title": "Passiva no passado: was/were + particípio",
      "rules": [
        "Estrutura: sujeito + was/were + particípio passado — The deal was closed yesterday.",
        "Usada para anunciar decisões, eventos e fatos históricos de forma impessoal.",
        "Present Perfect Passive: has/have been + particípio, para algo recente ou confirmado agora — It has been confirmed.",
        "Compare: The manager signed the contract (ativa) x The contract was signed by the manager (passiva)."
      ],
      "table": {
        "headers": [
          "Tempo",
          "Estrutura",
          "Exemplo",
          "Uso"
        ],
        "rows": [
          [
            "Passado passivo",
            "was/were + particípio",
            "The company was founded in 1995.",
            "fato histórico concluído"
          ],
          [
            "Present Perfect passivo",
            "has/have been + particípio",
            "It has been confirmed today.",
            "recente, ligado ao presente"
          ],
          [
            "Impessoal formal",
            "It was decided that...",
            "It was decided that we would wait.",
            "decisão sem citar quem decidiu"
          ],
          [
            "Rumor/crença",
            "It is said/believed that...",
            "It is believed that sales will grow.",
            "informação não confirmada"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "The company ___ founded in 1995.",
        "a": "was",
        "opts": [
          "was",
          "is",
          "has",
          "were"
        ]
      },
      {
        "q": "The contract ___ signed last week.",
        "a": "was",
        "opts": [
          "was",
          "is",
          "has been",
          "were"
        ]
      },
      {
        "q": "It ___ been confirmed that the event will happen.",
        "a": "has",
        "opts": [
          "has",
          "was",
          "is",
          "had"
        ]
      },
      {
        "q": "She ___ promoted to manager last year.",
        "a": "was",
        "opts": [
          "was",
          "is",
          "has",
          "were"
        ]
      },
      {
        "q": "The meeting was ___ at the last minute.",
        "a": "canceled",
        "opts": [
          "canceled",
          "cancel",
          "canceling",
          "cancels"
        ]
      }
    ],
    "speak": [
      "The company was founded in 1995.",
      "The contract was signed last week.",
      "She was promoted to manager last year.",
      "It has been confirmed that the event will happen in March.",
      "The launch was postponed to next month."
    ]
  },
  {
    "id": 419,
    "title": "Work & Career Words",
    "emoji": "💼",
    "verbs": [
      "To Apply",
      "To Hire",
      "To Promote",
      "To Resign"
    ],
    "vocab": [
      {
        "en": "Career",
        "pt": "Carreira",
        "ex": "She has built an amazing career in tech."
      },
      {
        "en": "Job",
        "pt": "Emprego",
        "ex": "He found a new job last month."
      },
      {
        "en": "Position",
        "pt": "Cargo",
        "ex": "She applied for a senior position."
      },
      {
        "en": "Resume / CV",
        "pt": "Currículo",
        "ex": "I updated my resume before the interview."
      },
      {
        "en": "Interview",
        "pt": "Entrevista",
        "ex": "I have a job interview tomorrow."
      },
      {
        "en": "Salary",
        "pt": "Salário",
        "ex": "The salary for this position is competitive."
      },
      {
        "en": "Promotion",
        "pt": "Promoção",
        "ex": "She got a promotion after two years."
      },
      {
        "en": "Raise",
        "pt": "Aumento",
        "ex": "He asked his boss for a raise."
      },
      {
        "en": "Deadline",
        "pt": "Prazo",
        "ex": "We have a tight deadline this week."
      },
      {
        "en": "Teammate",
        "pt": "Colega de equipe",
        "ex": "My teammate helped me finish the project."
      },
      {
        "en": "Manager",
        "pt": "Gerente",
        "ex": "My manager gave me great feedback."
      },
      {
        "en": "Employee",
        "pt": "Funcionário",
        "ex": "The company has over 500 employees."
      },
      {
        "en": "Employer",
        "pt": "Empregador",
        "ex": "My employer offers good benefits."
      },
      {
        "en": "Colleague",
        "pt": "Colega de trabalho",
        "ex": "I had lunch with a colleague today."
      },
      {
        "en": "Department",
        "pt": "Departamento",
        "ex": "She works in the marketing department."
      },
      {
        "en": "Meeting",
        "pt": "Reunião",
        "ex": "We have a team meeting every Monday."
      },
      {
        "en": "Project",
        "pt": "Projeto",
        "ex": "This project is due next week."
      },
      {
        "en": "Skill",
        "pt": "Habilidade",
        "ex": "Communication is an important skill."
      },
      {
        "en": "Experience",
        "pt": "Experiência",
        "ex": "She has five years of experience."
      },
      {
        "en": "Application",
        "pt": "Candidatura",
        "ex": "I sent my application yesterday."
      },
      {
        "en": "Offer",
        "pt": "Oferta (de emprego)",
        "ex": "She accepted the job offer."
      },
      {
        "en": "Contract",
        "pt": "Contrato",
        "ex": "He signed a two-year contract."
      },
      {
        "en": "Benefits",
        "pt": "Benefícios",
        "ex": "The company offers great benefits."
      },
      {
        "en": "Overtime",
        "pt": "Hora extra",
        "ex": "I worked overtime last week."
      },
      {
        "en": "Workload",
        "pt": "Carga de trabalho",
        "ex": "My workload has increased this month."
      },
      {
        "en": "Feedback",
        "pt": "Retorno, avaliação",
        "ex": "My manager gave me positive feedback."
      },
      {
        "en": "Goal",
        "pt": "Meta",
        "ex": "Our team goal is to grow sales by 20%."
      },
      {
        "en": "Achievement",
        "pt": "Conquista",
        "ex": "Getting this job was a big achievement."
      },
      {
        "en": "Networking",
        "pt": "Networking",
        "ex": "Networking helped her find a new job."
      },
      {
        "en": "Resignation",
        "pt": "Pedido de demissão",
        "ex": "He handed in his resignation letter."
      }
    ],
    "expressions": [
      {
        "expr": "I'm applying for a new position",
        "meaning": "Estou me candidatando a um novo cargo",
        "example": "I'm applying for a new position in another department."
      },
      {
        "expr": "She got a promotion last month",
        "meaning": "Ela foi promovida no mês passado",
        "example": "She got a promotion last month after great results."
      },
      {
        "expr": "I have a deadline tomorrow",
        "meaning": "Eu tenho um prazo amanhã",
        "example": "I have a deadline tomorrow, so I need to finish this today."
      },
      {
        "expr": "We need to network more",
        "meaning": "Precisamos fazer mais networking",
        "example": "We need to network more to find new opportunities."
      }
    ],
    "sentences": [
      "I'm applying for a new position at work.",
      "She got a promotion after two great years.",
      "I have a tight deadline this Friday.",
      "My manager gave me good feedback yesterday.",
      "He signed a new contract last week.",
      "I updated my resume before the interview.",
      "She accepted a job offer from a bigger company.",
      "Networking helped me find this job."
    ],
    "grammar": {
      "title": "Present Perfect para falar de experiência profissional",
      "rules": [
        "Use Present Perfect para experiência de carreira sem tempo específico: I have worked in marketing for six years.",
        "Use \"for\" com duração e \"since\" com ponto de partida: for three years / since 2020.",
        "Use Past Simple para eventos específicos: I got my first job in 2015.",
        "Combine os dois para contar sua trajetória: I have worked here since 2021, and I got a promotion last year."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Uso",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "have/has + particípio",
            "experiência sem tempo definido",
            "I have worked in sales.",
            "ligação com o presente"
          ],
          [
            "for + duração",
            "quanto tempo",
            "I have worked here for 3 years.",
            "duração até agora"
          ],
          [
            "since + ponto no tempo",
            "desde quando",
            "I have worked here since 2021.",
            "ponto de partida"
          ],
          [
            "Past Simple",
            "evento específico e concluído",
            "I got a promotion last year.",
            "tempo definido"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I have worked here ___ three years.",
        "a": "for",
        "opts": [
          "for",
          "since",
          "at",
          "in"
        ]
      },
      {
        "q": "I have worked here ___ 2021.",
        "a": "since",
        "opts": [
          "since",
          "for",
          "at",
          "from"
        ]
      },
      {
        "q": "She ___ a promotion last year.",
        "a": "got",
        "opts": [
          "got",
          "has got",
          "get",
          "getting"
        ]
      },
      {
        "q": "I ___ applying for a new position this week.",
        "a": "am",
        "opts": [
          "am",
          "have",
          "was",
          "is"
        ]
      },
      {
        "q": "He signed a new ___ last week.",
        "a": "contract",
        "opts": [
          "contract",
          "salary",
          "feedback",
          "goal"
        ]
      }
    ],
    "speak": [
      "I'm applying for a new position.",
      "She got a promotion last month.",
      "I have a deadline tomorrow.",
      "My manager gave me good feedback.",
      "Networking helped me find this job."
    ]
  },
  {
    "id": 420,
    "title": "My Career Story",
    "emoji": "🎯",
    "verbs": [
      "To Achieve",
      "To Struggle",
      "To Grow",
      "To Succeed"
    ],
    "vocab": [
      {
        "en": "Career path",
        "pt": "Trajetória profissional",
        "ex": "Her career path was full of surprises."
      },
      {
        "en": "Turning point",
        "pt": "Ponto de virada",
        "ex": "That meeting was the turning point in my career."
      },
      {
        "en": "Decision",
        "pt": "Decisão",
        "ex": "It was the hardest decision I have ever made."
      },
      {
        "en": "Challenge",
        "pt": "Desafio",
        "ex": "The biggest challenge was moving to a new city."
      },
      {
        "en": "Struggle",
        "pt": "Luta, dificuldade",
        "ex": "I had a real struggle finding my first job."
      },
      {
        "en": "Growth",
        "pt": "Crescimento",
        "ex": "This job gave me a lot of personal growth."
      },
      {
        "en": "Success",
        "pt": "Sucesso",
        "ex": "Her success came after years of hard work."
      },
      {
        "en": "Failure",
        "pt": "Fracasso",
        "ex": "I learned more from failure than from success."
      },
      {
        "en": "Lesson learned",
        "pt": "Lição aprendida",
        "ex": "The lesson learned was to trust myself."
      },
      {
        "en": "Ambition",
        "pt": "Ambição",
        "ex": "She has always had a lot of ambition."
      },
      {
        "en": "Dream job",
        "pt": "Emprego dos sonhos",
        "ex": "Working here has always been my dream job."
      },
      {
        "en": "Passion",
        "pt": "Paixão",
        "ex": "I found my passion for teaching by accident."
      },
      {
        "en": "Opportunity",
        "pt": "Oportunidade",
        "ex": "That was a great opportunity for my career."
      },
      {
        "en": "Risk",
        "pt": "Risco",
        "ex": "Changing careers was a big risk for me."
      },
      {
        "en": "Sacrifice",
        "pt": "Sacrifício",
        "ex": "I made some sacrifices to reach this goal."
      },
      {
        "en": "Achievement",
        "pt": "Conquista",
        "ex": "Finishing this project was a huge achievement."
      },
      {
        "en": "Milestone",
        "pt": "Marco importante",
        "ex": "Getting promoted was an important milestone."
      },
      {
        "en": "Journey",
        "pt": "Jornada",
        "ex": "My career journey has not always been easy."
      },
      {
        "en": "Confidence",
        "pt": "Confiança",
        "ex": "I gained a lot of confidence over the years."
      },
      {
        "en": "Change",
        "pt": "Mudança",
        "ex": "That change completely transformed my career."
      },
      {
        "en": "Transition",
        "pt": "Transição",
        "ex": "The transition to a new role was difficult."
      },
      {
        "en": "Mentor",
        "pt": "Mentor",
        "ex": "My mentor taught me so much about leadership."
      },
      {
        "en": "Inspiration",
        "pt": "Inspiração",
        "ex": "She has always been an inspiration to me."
      },
      {
        "en": "Motivation",
        "pt": "Motivação",
        "ex": "My motivation comes from helping people."
      },
      {
        "en": "Balance",
        "pt": "Equilíbrio",
        "ex": "I try to keep a good work-life balance."
      },
      {
        "en": "Fulfillment",
        "pt": "Realização",
        "ex": "This job gives me a real sense of fulfillment."
      },
      {
        "en": "Purpose",
        "pt": "Propósito",
        "ex": "I finally found my purpose in this career."
      },
      {
        "en": "Legacy",
        "pt": "Legado",
        "ex": "I want to leave a positive legacy at work."
      },
      {
        "en": "Reflection",
        "pt": "Reflexão",
        "ex": "Looking back, this reflection helps me grow."
      },
      {
        "en": "Gratitude",
        "pt": "Gratidão",
        "ex": "I feel a lot of gratitude for this opportunity."
      }
    ],
    "expressions": [
      {
        "expr": "Looking back, I realize...",
        "meaning": "Olhando para trás, eu percebo...",
        "example": "Looking back, I realize that decision changed everything."
      },
      {
        "expr": "The turning point in my career was...",
        "meaning": "O ponto de virada da minha carreira foi...",
        "example": "The turning point in my career was when I moved abroad."
      },
      {
        "expr": "I've learned so much since then",
        "meaning": "Eu aprendi muito desde então",
        "example": "I've learned so much since then, especially about leadership."
      },
      {
        "expr": "If I could go back, I would...",
        "meaning": "Se eu pudesse voltar, eu...",
        "example": "If I could go back, I would take more risks."
      }
    ],
    "sentences": [
      "A few years ago, I was working in a completely different field.",
      "Since then, I've built a career I'm proud of.",
      "The turning point was when I decided to change jobs.",
      "If I could go back, I would have started sooner.",
      "It was a difficult decision, but it was the right one.",
      "I've learned so much since I started this journey.",
      "Looking back, every challenge helped me grow.",
      "Today, I feel grateful for everything that happened."
    ],
    "grammar": {
      "title": "Revisão: usando todos os tempos para contar sua história",
      "rules": [
        "Past Simple para eventos concluídos: I decided to change careers in 2019.",
        "Past Continuous para o cenário: I was working long hours when I made that decision.",
        "Present Perfect para ligar o passado ao presente: I have grown so much since then.",
        "Second/Third Conditional para refletir sobre escolhas: If I could go back, I would take more risks."
      ],
      "table": {
        "headers": [
          "Tempo/Estrutura",
          "Uso na história",
          "Exemplo",
          "Efeito"
        ],
        "rows": [
          [
            "Past Simple",
            "evento principal",
            "I decided to change careers.",
            "linha da história"
          ],
          [
            "Past Continuous",
            "cenário/contexto",
            "I was working long hours.",
            "ambientação"
          ],
          [
            "Present Perfect",
            "resultado até hoje",
            "I have grown so much since then.",
            "liga passado e presente"
          ],
          [
            "Conditional (would)",
            "reflexão/hipótese",
            "If I could go back, I would take more risks.",
            "reflexão pessoal"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "A few years ago, I ___ working in a different field.",
        "a": "was",
        "opts": [
          "was",
          "am",
          "have been",
          "were"
        ]
      },
      {
        "q": "Since then, I ___ built a career I'm proud of.",
        "a": "'ve",
        "opts": [
          "'ve",
          "was",
          "did",
          "am"
        ]
      },
      {
        "q": "The turning point ___ when I decided to change jobs.",
        "a": "was",
        "opts": [
          "was",
          "is",
          "has been",
          "were"
        ]
      },
      {
        "q": "If I could go back, I ___ take more risks.",
        "a": "would",
        "opts": [
          "would",
          "will",
          "did",
          "had"
        ]
      },
      {
        "q": "Looking back, every challenge helped me ___.",
        "a": "grow",
        "opts": [
          "grow",
          "grew",
          "growing",
          "grows"
        ]
      }
    ],
    "speak": [
      "A few years ago, I was working in a different field.",
      "Since then, I've built a career I'm proud of.",
      "The turning point was when I decided to change jobs.",
      "If I could go back, I would have started sooner.",
      "Looking back, every challenge helped me grow."
    ]
  },
  {
    "id": 421,
    "title": "Articles: A or An?",
    "emoji": "🔤",
    "verbs": [
      "To Need",
      "To Have",
      "To Want",
      "To See"
    ],
    "vocab": [
      {
        "en": "bakery",
        "pt": "padaria",
        "ex": "There is a bakery on the corner."
      },
      {
        "en": "neighbourhood",
        "pt": "bairro",
        "ex": "I live in a quiet neighbourhood."
      },
      {
        "en": "vowel sound",
        "pt": "som de vogal",
        "ex": "Use an before a vowel sound."
      },
      {
        "en": "consonant sound",
        "pt": "som de consoante",
        "ex": "Use a before a consonant sound."
      },
      {
        "en": "umbrella",
        "pt": "guarda-chuva",
        "ex": "Take an umbrella, it is raining."
      },
      {
        "en": "one of many",
        "pt": "um entre vários",
        "ex": "A book means one book, not a specific one."
      },
      {
        "en": "silent h",
        "pt": "h mudo",
        "ex": "An hour has a silent h."
      },
      {
        "en": "spelling vs sound",
        "pt": "grafia vs som",
        "ex": "It's about sound, not spelling: a university."
      },
      {
        "en": "a car",
        "pt": "um carro",
        "ex": "I have a car."
      },
      {
        "en": "an apple",
        "pt": "uma maçã",
        "ex": "She is eating an apple."
      },
      {
        "en": "a house",
        "pt": "uma casa",
        "ex": "We bought a house last year."
      },
      {
        "en": "an idea",
        "pt": "uma ideia",
        "ex": "He had a great idea."
      },
      {
        "en": "a university",
        "pt": "uma universidade",
        "ex": "She studies at a university."
      },
      {
        "en": "an hour",
        "pt": "uma hora",
        "ex": "Wait for an hour, please."
      },
      {
        "en": "a uniform",
        "pt": "um uniforme",
        "ex": "He wears a uniform at work."
      },
      {
        "en": "an umbrella",
        "pt": "um guarda-chuva",
        "ex": "Take an umbrella, it's raining."
      },
      {
        "en": "a European country",
        "pt": "um país europeu",
        "ex": "France is a European country."
      },
      {
        "en": "an honest person",
        "pt": "uma pessoa honesta",
        "ex": "She is an honest person."
      },
      {
        "en": "a dog",
        "pt": "um cachorro",
        "ex": "They have a dog."
      },
      {
        "en": "an elephant",
        "pt": "um elefante",
        "ex": "We saw an elephant at the zoo."
      },
      {
        "en": "a job",
        "pt": "um emprego",
        "ex": "I need a job."
      },
      {
        "en": "an opportunity",
        "pt": "uma oportunidade",
        "ex": "This is an opportunity."
      },
      {
        "en": "a friend",
        "pt": "um amigo",
        "ex": "He is a good friend."
      },
      {
        "en": "an office",
        "pt": "um escritório",
        "ex": "She works in an office."
      },
      {
        "en": "a plan",
        "pt": "um plano",
        "ex": "We have a plan."
      },
      {
        "en": "an animal",
        "pt": "um animal",
        "ex": "That is an unusual animal."
      },
      {
        "en": "a question",
        "pt": "uma pergunta",
        "ex": "I have a question."
      },
      {
        "en": "an answer",
        "pt": "uma resposta",
        "ex": "I need an answer."
      },
      {
        "en": "a solution",
        "pt": "uma solução",
        "ex": "We found a solution."
      },
      {
        "en": "an example",
        "pt": "um exemplo",
        "ex": "Give me an example."
      }
    ],
    "expressions": [
      {
        "expr": "a couple of",
        "meaning": "um casal de / alguns",
        "example": "I need a couple of minutes."
      },
      {
        "expr": "an idea popped into my head",
        "meaning": "uma ideia surgiu na minha cabeça",
        "example": "An idea popped into my head during the meeting."
      },
      {
        "expr": "in a hurry",
        "meaning": "com pressa",
        "example": "Sorry, I'm in a hurry."
      },
      {
        "expr": "an eye for detail",
        "meaning": "um olho para detalhes",
        "example": "She has an eye for detail."
      }
    ],
    "sentences": [
      "I need a new phone.",
      "She has an amazing idea.",
      "He waited for an hour at the airport.",
      "We saw an elephant at the zoo.",
      "This is a great opportunity.",
      "She studies at a university in Lisbon.",
      "He is an honest and hardworking person.",
      "Can you give me an example?"
    ],
    "grammar": {
      "title": "A ou An: Artigo Indefinido",
      "rules": [
        "Use a antes de som de consoante: a car, a house, a university.",
        "Use an antes de som de vogal: an apple, an hour, an umbrella.",
        "A regra é sobre o SOM, não a letra: 'university' começa com som de 'y' (consoante), então usa a.",
        "Palavras com h mudo usam an: an hour, an honest person."
      ],
      "table": {
        "headers": [
          "Palavra",
          "Artigo",
          "Motivo",
          "Exemplo"
        ],
        "rows": [
          [
            "car",
            "a",
            "som de consoante",
            "I have a car."
          ],
          [
            "apple",
            "an",
            "som de vogal",
            "She ate an apple."
          ],
          [
            "university",
            "a",
            "soa como 'y' (consoante)",
            "He studies at a university."
          ],
          [
            "hour",
            "an",
            "h mudo, som de vogal",
            "Wait an hour."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I need ___ umbrella.",
        "a": "an",
        "opts": [
          "an",
          "a",
          "the",
          "some"
        ]
      },
      {
        "q": "She has ___ university degree.",
        "a": "a",
        "opts": [
          "a",
          "an",
          "the",
          "some"
        ]
      },
      {
        "q": "He waited for ___ hour.",
        "a": "an",
        "opts": [
          "an",
          "a",
          "the",
          "some"
        ]
      },
      {
        "q": "This is ___ honest answer.",
        "a": "an",
        "opts": [
          "an",
          "a",
          "the",
          "some"
        ]
      },
      {
        "q": "We saw ___ elephant at the zoo.",
        "a": "an",
        "opts": [
          "an",
          "a",
          "the",
          "some"
        ]
      }
    ],
    "speak": [
      "I need a new phone.",
      "She has an amazing idea.",
      "He waited for an hour at the airport.",
      "This is a great opportunity.",
      "She studies at a university in Lisbon."
    ]
  },
  {
    "id": 422,
    "title": "The or No Article?",
    "emoji": "🎯",
    "verbs": [
      "To Visit",
      "To Play",
      "To Go",
      "To Love"
    ],
    "vocab": [
      {
        "en": "the countryside",
        "pt": "o interior",
        "ex": "They live in the countryside."
      },
      {
        "en": "downtown",
        "pt": "centro (da cidade)",
        "ex": "We went downtown on Saturday."
      },
      {
        "en": "specific thing",
        "pt": "coisa específica",
        "ex": "Use the for a specific thing both people know."
      },
      {
        "en": "unique thing",
        "pt": "coisa única",
        "ex": "The sun is unique, so we always say the sun."
      },
      {
        "en": "general category",
        "pt": "categoria geral",
        "ex": "Dogs are loyal, a general category."
      },
      {
        "en": "second mention",
        "pt": "segunda menção",
        "ex": "A dog... the dog was brown."
      },
      {
        "en": "furniture",
        "pt": "móveis",
        "ex": "We bought new furniture for the flat."
      },
      {
        "en": "luggage",
        "pt": "bagagem",
        "ex": "The luggage is already in the car."
      },
      {
        "en": "the sun",
        "pt": "o sol",
        "ex": "The sun rises in the east."
      },
      {
        "en": "the moon",
        "pt": "a lua",
        "ex": "The moon was full last night."
      },
      {
        "en": "the internet",
        "pt": "a internet",
        "ex": "We use the internet every day."
      },
      {
        "en": "the piano",
        "pt": "o piano",
        "ex": "She plays the piano beautifully."
      },
      {
        "en": "football",
        "pt": "futebol",
        "ex": "He plays football on Sundays."
      },
      {
        "en": "music",
        "pt": "música",
        "ex": "I love music."
      },
      {
        "en": "the cinema",
        "pt": "o cinema",
        "ex": "Let's go to the cinema tonight."
      },
      {
        "en": "breakfast",
        "pt": "café da manhã",
        "ex": "I had breakfast at seven."
      },
      {
        "en": "the United States",
        "pt": "os Estados Unidos",
        "ex": "She lives in the United States."
      },
      {
        "en": "Brazil",
        "pt": "Brasil",
        "ex": "Brazil is a beautiful country."
      },
      {
        "en": "the Amazon River",
        "pt": "o Rio Amazonas",
        "ex": "The Amazon River is enormous."
      },
      {
        "en": "school",
        "pt": "escola",
        "ex": "Children go to school by bus."
      },
      {
        "en": "the best restaurant",
        "pt": "o melhor restaurante",
        "ex": "It's the best restaurant in town."
      },
      {
        "en": "work",
        "pt": "trabalho",
        "ex": "I go to work by train."
      },
      {
        "en": "the news",
        "pt": "as notícias",
        "ex": "Did you watch the news?"
      },
      {
        "en": "love",
        "pt": "amor",
        "ex": "Love is complicated."
      },
      {
        "en": "the guitar",
        "pt": "o violão",
        "ex": "He learned to play the guitar."
      },
      {
        "en": "the airport",
        "pt": "o aeroporto",
        "ex": "We arrived at the airport early."
      },
      {
        "en": "the weekend",
        "pt": "o fim de semana",
        "ex": "See you at the weekend!"
      },
      {
        "en": "life",
        "pt": "a vida",
        "ex": "Life is full of surprises."
      },
      {
        "en": "the doctor",
        "pt": "o médico/a médica",
        "ex": "I have an appointment with the doctor."
      },
      {
        "en": "tennis",
        "pt": "tênis",
        "ex": "She plays tennis every Saturday."
      }
    ],
    "expressions": [
      {
        "expr": "in the end",
        "meaning": "no final / no fim das contas",
        "example": "In the end, we chose the cheaper flight."
      },
      {
        "expr": "for the first time",
        "meaning": "pela primeira vez",
        "example": "I tried sushi for the first time last week."
      },
      {
        "expr": "play it by ear",
        "meaning": "decidir na hora / agir sem planejar",
        "example": "We don't have a plan, let's just play it by ear."
      },
      {
        "expr": "the best of both worlds",
        "meaning": "o melhor dos dois mundos",
        "example": "Working from a beach town is the best of both worlds."
      }
    ],
    "sentences": [
      "The sun was shining all day.",
      "She plays the piano every evening.",
      "He plays football with his friends.",
      "I love music, especially jazz.",
      "We had breakfast at a small café.",
      "It's the best restaurant in the city.",
      "Life is full of surprises.",
      "Did you watch the news this morning?"
    ],
    "grammar": {
      "title": "The x Artigo Zero: Quando Usar (ou Não Usar) The",
      "rules": [
        "Use the quando o substantivo é específico e ambos os falantes sabem qual é: the dog (aquele cachorro que já mencionamos).",
        "Use the para coisas únicas no mundo: the sun, the internet, the moon.",
        "Use the com instrumentos musicais: play the guitar, play the piano.",
        "NÃO use artigo com esportes, refeições e substantivos genéricos/abstratos: play football, have breakfast, love music."
      ],
      "table": {
        "headers": [
          "Contexto",
          "Artigo",
          "Exemplo",
          "Motivo"
        ],
        "rows": [
          [
            "instrumento musical",
            "the",
            "She plays the piano.",
            "regra fixa com instrumentos"
          ],
          [
            "esporte",
            "(nenhum)",
            "He plays football.",
            "esportes não levam artigo"
          ],
          [
            "coisa única",
            "the",
            "The sun is bright today.",
            "só existe um sol"
          ],
          [
            "substantivo abstrato/genérico",
            "(nenhum)",
            "Music makes me happy.",
            "categoria geral"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "She plays ___ piano beautifully.",
        "a": "the",
        "opts": [
          "the",
          "a",
          "an",
          "(no article)"
        ]
      },
      {
        "q": "He plays ___ football every Sunday.",
        "a": "(no article)",
        "opts": [
          "(no article)",
          "the",
          "a",
          "an"
        ]
      },
      {
        "q": "___ sun is very bright today.",
        "a": "The",
        "opts": [
          "The",
          "A",
          "An",
          "(no article)"
        ]
      },
      {
        "q": "I love ___ music.",
        "a": "(no article)",
        "opts": [
          "(no article)",
          "the",
          "a",
          "an"
        ]
      },
      {
        "q": "It's ___ best day of my life.",
        "a": "the",
        "opts": [
          "the",
          "a",
          "an",
          "(no article)"
        ]
      }
    ],
    "speak": [
      "She plays the piano every evening.",
      "He plays football with his friends on weekends.",
      "The sun was shining all day.",
      "I love music, especially jazz.",
      "It's the best restaurant in the city."
    ]
  },
  {
    "id": 423,
    "title": "Modal Verbs: Obligation & Advice",
    "emoji": "📋",
    "verbs": [
      "To Wear",
      "To Arrive",
      "To Study",
      "To Book"
    ],
    "vocab": [
      {
        "en": "obligation",
        "pt": "obrigação",
        "ex": "Must expresses strong obligation."
      },
      {
        "en": "no obligation",
        "pt": "sem obrigação",
        "ex": "Don't have to means no obligation."
      },
      {
        "en": "prohibition",
        "pt": "proibição",
        "ex": "Must not expresses prohibition."
      },
      {
        "en": "advice",
        "pt": "conselho",
        "ex": "Should is used to give advice."
      },
      {
        "en": "strong obligation",
        "pt": "obrigação forte (regra externa)",
        "ex": "Have to often refers to external rules."
      },
      {
        "en": "personal obligation",
        "pt": "obrigação pessoal",
        "ex": "Must often expresses the speaker's own feeling."
      },
      {
        "en": "recommendation",
        "pt": "recomendação",
        "ex": "Ought to is a formal way to recommend something."
      },
      {
        "en": "necessity",
        "pt": "necessidade",
        "ex": "You need to bring your passport."
      },
      {
        "en": "to wear a uniform",
        "pt": "usar uniforme",
        "ex": "You must wear a uniform at work."
      },
      {
        "en": "to arrive on time",
        "pt": "chegar na hora",
        "ex": "You have to arrive on time for the meeting."
      },
      {
        "en": "to study hard",
        "pt": "estudar muito",
        "ex": "You should study hard for the exam."
      },
      {
        "en": "to book in advance",
        "pt": "reservar com antecedência",
        "ex": "You must book in advance for this restaurant."
      },
      {
        "en": "to see a doctor",
        "pt": "consultar um médico",
        "ex": "You should see a doctor about that cough."
      },
      {
        "en": "to bring a passport",
        "pt": "trazer o passaporte",
        "ex": "You have to bring your passport to the airport."
      },
      {
        "en": "to park here",
        "pt": "estacionar aqui",
        "ex": "You must not park here."
      },
      {
        "en": "to smoke inside",
        "pt": "fumar dentro",
        "ex": "You must not smoke inside the building."
      },
      {
        "en": "to wash your hands",
        "pt": "lavar as mãos",
        "ex": "You should wash your hands before eating."
      },
      {
        "en": "to pay the bill",
        "pt": "pagar a conta",
        "ex": "We have to pay the bill by Friday."
      },
      {
        "en": "to apologize",
        "pt": "se desculpar",
        "ex": "You ought to apologize to her."
      },
      {
        "en": "to get insurance",
        "pt": "contratar um seguro",
        "ex": "You need to get travel insurance."
      },
      {
        "en": "to renew a passport",
        "pt": "renovar o passaporte",
        "ex": "I have to renew my passport this year."
      },
      {
        "en": "to take a break",
        "pt": "fazer uma pausa",
        "ex": "You should take a break, you look tired."
      },
      {
        "en": "to follow the rules",
        "pt": "seguir as regras",
        "ex": "Employees must follow the safety rules."
      },
      {
        "en": "to wear a seatbelt",
        "pt": "usar cinto de segurança",
        "ex": "You must wear a seatbelt in the car."
      },
      {
        "en": "to ask permission",
        "pt": "pedir permissão",
        "ex": "You don't have to ask permission to leave early today."
      },
      {
        "en": "to save money",
        "pt": "economizar dinheiro",
        "ex": "You should save money every month."
      },
      {
        "en": "to be on time",
        "pt": "ser pontual",
        "ex": "You must be on time for the interview."
      },
      {
        "en": "to check the schedule",
        "pt": "conferir o horário",
        "ex": "You ought to check the schedule before you go."
      },
      {
        "en": "to cancel a reservation",
        "pt": "cancelar uma reserva",
        "ex": "You have to cancel the reservation by tomorrow."
      },
      {
        "en": "to fill out a form",
        "pt": "preencher um formulário",
        "ex": "You need to fill out this form."
      }
    ],
    "expressions": [
      {
        "expr": "You'd better...",
        "meaning": "É melhor você...",
        "example": "You'd better call her before it's too late."
      },
      {
        "expr": "It's a must",
        "meaning": "É essencial / obrigatório",
        "example": "Visiting the old town is a must."
      },
      {
        "expr": "No need to...",
        "meaning": "Não precisa...",
        "example": "No need to worry, everything is fine."
      },
      {
        "expr": "I really should...",
        "meaning": "Eu realmente deveria...",
        "example": "I really should call my parents more often."
      }
    ],
    "sentences": [
      "You must wear a uniform at work.",
      "You don't have to come if you're busy.",
      "You should see a doctor about that cough.",
      "You must not park here.",
      "We have to pay the bill by Friday.",
      "You ought to apologize to her.",
      "You need to bring your passport.",
      "You'd better hurry, the train leaves soon."
    ],
    "grammar": {
      "title": "Modal Verbs: Obrigação e Conselho",
      "rules": [
        "Must expressa obrigação forte, geralmente uma opinião pessoal de quem fala: I must call her today.",
        "Have to expressa obrigação vinda de uma regra externa: I have to wear a uniform at work.",
        "Must not expressa proibição: You must not smoke here. Don't have to expressa AUSÊNCIA de obrigação: You don't have to come.",
        "Should e ought to dão conselhos, não são tão fortes quanto must: You should rest more."
      ],
      "table": {
        "headers": [
          "Modal",
          "Uso",
          "Exemplo",
          "Força"
        ],
        "rows": [
          [
            "must",
            "obrigação pessoal / proibição (must not)",
            "I must finish this today.",
            "forte"
          ],
          [
            "have to",
            "obrigação externa (regra)",
            "I have to wear a uniform.",
            "forte"
          ],
          [
            "should / ought to",
            "conselho",
            "You should rest more.",
            "moderada"
          ],
          [
            "don't have to",
            "ausência de obrigação",
            "You don't have to come.",
            "nenhuma"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "You ___ wear a seatbelt in the car.",
        "a": "must",
        "opts": [
          "must",
          "should",
          "might",
          "could"
        ]
      },
      {
        "q": "You ___ come to the party if you don't want to.",
        "a": "don't have to",
        "opts": [
          "don't have to",
          "must not",
          "shouldn't",
          "can't"
        ]
      },
      {
        "q": "You ___ see a doctor about that cough.",
        "a": "should",
        "opts": [
          "should",
          "must",
          "don't have to",
          "can't"
        ]
      },
      {
        "q": "Employees ___ follow the safety rules.",
        "a": "have to",
        "opts": [
          "have to",
          "might",
          "should",
          "could"
        ]
      },
      {
        "q": "You ___ not park here.",
        "a": "must",
        "opts": [
          "must",
          "should",
          "don't have to",
          "might"
        ]
      }
    ],
    "speak": [
      "You must wear a uniform at work.",
      "You should see a doctor about that cough.",
      "We have to pay the bill by Friday.",
      "You must not park here.",
      "You'd better hurry, the train leaves soon."
    ]
  },
  {
    "id": 424,
    "title": "Modal Verbs: Possibility & Deduction",
    "emoji": "🔍",
    "verbs": [
      "To Guess",
      "To Assume",
      "To Wonder",
      "To Suspect"
    ],
    "vocab": [
      {
        "en": "possibility",
        "pt": "possibilidade",
        "ex": "Might expresses possibility."
      },
      {
        "en": "deduction",
        "pt": "dedução",
        "ex": "Must can express logical deduction."
      },
      {
        "en": "certainty",
        "pt": "certeza",
        "ex": "Must be means you are almost sure."
      },
      {
        "en": "impossibility",
        "pt": "impossibilidade lógica",
        "ex": "Can't be expresses that something is impossible."
      },
      {
        "en": "hedging",
        "pt": "suavizar uma afirmação",
        "ex": "Might and could soften an opinion."
      },
      {
        "en": "guess",
        "pt": "suposição/chute",
        "ex": "That's just a guess, I'm not sure."
      },
      {
        "en": "logical conclusion",
        "pt": "conclusão lógica",
        "ex": "Based on the evidence, he must be lying."
      },
      {
        "en": "uncertainty",
        "pt": "incerteza",
        "ex": "I'm not sure; it could be true."
      },
      {
        "en": "might be",
        "pt": "pode ser (talvez)",
        "ex": "She might be at home right now."
      },
      {
        "en": "could be",
        "pt": "pode ser (possibilidade)",
        "ex": "It could be true, I'm not sure."
      },
      {
        "en": "may be",
        "pt": "pode ser (formal)",
        "ex": "The meeting may be cancelled."
      },
      {
        "en": "must be",
        "pt": "deve ser (dedução)",
        "ex": "He must be tired after that trip."
      },
      {
        "en": "can't be",
        "pt": "não pode ser (impossível)",
        "ex": "That can't be right, check again."
      },
      {
        "en": "must have been",
        "pt": "deve ter sido",
        "ex": "The road was wet, it must have rained."
      },
      {
        "en": "can't have been",
        "pt": "não pode ter sido",
        "ex": "He can't have finished already, it's too soon."
      },
      {
        "en": "might have been",
        "pt": "pode ter sido",
        "ex": "She might have forgotten about the meeting."
      },
      {
        "en": "to be stuck in traffic",
        "pt": "estar preso no trânsito",
        "ex": "He must be stuck in traffic."
      },
      {
        "en": "to be on vacation",
        "pt": "estar de férias",
        "ex": "She might be on vacation this week."
      },
      {
        "en": "to run out of time",
        "pt": "ficar sem tempo",
        "ex": "They must have run out of time."
      },
      {
        "en": "to forget an appointment",
        "pt": "esquecer um compromisso",
        "ex": "He might have forgotten the appointment."
      },
      {
        "en": "to be asleep",
        "pt": "estar dormindo",
        "ex": "It's late, she must be asleep."
      },
      {
        "en": "to lose a phone",
        "pt": "perder o celular",
        "ex": "He can't answer, he might have lost his phone."
      },
      {
        "en": "evidence",
        "pt": "evidência/prova",
        "ex": "Based on the evidence, she must be right."
      },
      {
        "en": "clue",
        "pt": "pista",
        "ex": "The wet umbrella is a clue that it rained."
      },
      {
        "en": "to make sense",
        "pt": "fazer sentido",
        "ex": "That explanation must be true, it makes sense."
      },
      {
        "en": "unlikely",
        "pt": "improvável",
        "ex": "It's unlikely to rain today, but it might."
      },
      {
        "en": "probably",
        "pt": "provavelmente",
        "ex": "She's probably at work now."
      },
      {
        "en": "definitely not",
        "pt": "definitivamente não",
        "ex": "That can't be true, definitely not."
      },
      {
        "en": "to double-check",
        "pt": "conferir novamente",
        "ex": "You should double-check before you decide."
      },
      {
        "en": "to jump to conclusions",
        "pt": "tirar conclusões precipitadas",
        "ex": "Don't jump to conclusions, it might be a mistake."
      }
    ],
    "expressions": [
      {
        "expr": "It could go either way",
        "meaning": "Pode ser dos dois jeitos / não dá pra saber",
        "example": "The match could go either way."
      },
      {
        "expr": "That must be it",
        "meaning": "Deve ser isso",
        "example": "The door is locked, that must be it."
      },
      {
        "expr": "I wouldn't be surprised if...",
        "meaning": "Eu não ficaria surpreso se...",
        "example": "I wouldn't be surprised if she was late again."
      },
      {
        "expr": "Beats me",
        "meaning": "Não faço ideia",
        "example": "Why is the light on? Beats me."
      }
    ],
    "sentences": [
      "She might be at home right now.",
      "It could be true, I'm not sure.",
      "He must be tired after that long trip.",
      "That can't be right, let's check again.",
      "The road is wet, it must have rained.",
      "She might have forgotten about the meeting.",
      "He's not answering, he might have lost his phone.",
      "Don't jump to conclusions, it could be a mistake."
    ],
    "grammar": {
      "title": "Modal Verbs: Possibilidade e Dedução",
      "rules": [
        "Might e could expressam possibilidade: It might rain later. (talvez chova)",
        "Must be expressa uma dedução lógica forte, quase certeza: The lights are off, they must be out.",
        "Can't be expressa que algo é logicamente impossível: He can't be at work, I just saw him at home.",
        "Para o passado, use modal + have + particípio: must have been, might have been, can't have been."
      ],
      "table": {
        "headers": [
          "Modal",
          "Grau de certeza",
          "Exemplo",
          "Tempo"
        ],
        "rows": [
          [
            "must be",
            "quase certeza (dedução)",
            "He must be tired.",
            "presente"
          ],
          [
            "might/could be",
            "possibilidade",
            "She might be at home.",
            "presente"
          ],
          [
            "can't be",
            "impossível",
            "That can't be true.",
            "presente"
          ],
          [
            "must have been",
            "dedução no passado",
            "It must have rained.",
            "passado"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "The lights are off, they ___ be out.",
        "a": "must",
        "opts": [
          "must",
          "might",
          "can't",
          "should"
        ]
      },
      {
        "q": "It ___ rain later, take an umbrella just in case.",
        "a": "might",
        "opts": [
          "might",
          "must",
          "can't",
          "should"
        ]
      },
      {
        "q": "He answered in French, he ___ be from Quebec.",
        "a": "must",
        "opts": [
          "must",
          "might not",
          "can't",
          "should"
        ]
      },
      {
        "q": "That ___ be right, I just spoke to her yesterday.",
        "a": "can't",
        "opts": [
          "can't",
          "must",
          "might",
          "should"
        ]
      },
      {
        "q": "The ground is wet, it ___ have rained last night.",
        "a": "must",
        "opts": [
          "must",
          "might",
          "can't",
          "should"
        ]
      }
    ],
    "speak": [
      "She might be at home right now.",
      "He must be tired after that long trip.",
      "That can't be right, let's check again.",
      "The road is wet, it must have rained.",
      "Don't jump to conclusions, it could be a mistake."
    ]
  },
  {
    "id": 425,
    "title": "Relative Clauses: Who, Which, That",
    "emoji": "🔗",
    "verbs": [
      "To Call",
      "To Read",
      "To Meet",
      "To Buy"
    ],
    "vocab": [
      {
        "en": "colleague",
        "pt": "colega de trabalho",
        "ex": "The colleague who helped me is very kind."
      },
      {
        "en": "reliable",
        "pt": "confiável",
        "ex": "I need someone who is reliable."
      },
      {
        "en": "who",
        "pt": "que/quem (pessoas)",
        "ex": "The man who called is my brother."
      },
      {
        "en": "which",
        "pt": "que (coisas/animais)",
        "ex": "The car, which is new, is mine."
      },
      {
        "en": "that",
        "pt": "que (pessoas ou coisas, informal)",
        "ex": "The book that I read was amazing."
      },
      {
        "en": "antecedent",
        "pt": "antecedente",
        "ex": "In 'the man who called', 'man' is the antecedent."
      },
      {
        "en": "tool",
        "pt": "ferramenta",
        "ex": "This is the tool that I use every day."
      },
      {
        "en": "generous",
        "pt": "generoso",
        "ex": "She is a person who is very generous."
      },
      {
        "en": "the woman who called",
        "pt": "a mulher que ligou",
        "ex": "The woman who called is my boss."
      },
      {
        "en": "the book that I read",
        "pt": "o livro que eu li",
        "ex": "The book that I read was great."
      },
      {
        "en": "the car which is red",
        "pt": "o carro que é vermelho",
        "ex": "The car which is parked outside is mine."
      },
      {
        "en": "the man who works here",
        "pt": "o homem que trabalha aqui",
        "ex": "The man who works here is very kind."
      },
      {
        "en": "the movie that we watched",
        "pt": "o filme que nós assistimos",
        "ex": "The movie that we watched was boring."
      },
      {
        "en": "the girl who sings",
        "pt": "a garota que canta",
        "ex": "The girl who sings in the choir is my niece."
      },
      {
        "en": "the phone which broke",
        "pt": "o celular que quebrou",
        "ex": "The phone which broke is only a year old."
      },
      {
        "en": "the restaurant that closed",
        "pt": "o restaurante que fechou",
        "ex": "The restaurant that closed was my favorite."
      },
      {
        "en": "the teacher who explained",
        "pt": "o professor que explicou",
        "ex": "The teacher who explained the lesson was patient."
      },
      {
        "en": "the dog that barks",
        "pt": "o cachorro que late",
        "ex": "The dog that barks all night belongs to my neighbor."
      },
      {
        "en": "the house which we bought",
        "pt": "a casa que nós compramos",
        "ex": "The house which we bought needs some repairs."
      },
      {
        "en": "the friend who helped me",
        "pt": "o amigo que me ajudou",
        "ex": "The friend who helped me moved away last year."
      },
      {
        "en": "the email that arrived",
        "pt": "o email que chegou",
        "ex": "The email that arrived this morning was important."
      },
      {
        "en": "the singer who performed",
        "pt": "o cantor que se apresentou",
        "ex": "The singer who performed was amazing."
      },
      {
        "en": "the company which hired her",
        "pt": "a empresa que a contratou",
        "ex": "The company which hired her is very famous."
      },
      {
        "en": "the shoes that I bought",
        "pt": "os sapatos que eu comprei",
        "ex": "The shoes that I bought yesterday are too small."
      },
      {
        "en": "the neighbor who complained",
        "pt": "o vizinho que reclamou",
        "ex": "The neighbor who complained lives upstairs."
      },
      {
        "en": "the meeting that started late",
        "pt": "a reunião que começou atrasada",
        "ex": "The meeting that started late ran over."
      },
      {
        "en": "the doctor who examined me",
        "pt": "o médico que me examinou",
        "ex": "The doctor who examined me was very thorough."
      },
      {
        "en": "the story which surprised us",
        "pt": "a história que nos surpreendeu",
        "ex": "The story which surprised us was true."
      },
      {
        "en": "the app that I downloaded",
        "pt": "o aplicativo que eu baixei",
        "ex": "The app that I downloaded is very useful."
      },
      {
        "en": "the plan which failed",
        "pt": "o plano que falhou",
        "ex": "The plan which failed cost us a lot of time."
      }
    ],
    "expressions": [
      {
        "expr": "someone who...",
        "meaning": "alguém que...",
        "example": "I need someone who can fix my computer."
      },
      {
        "expr": "the one that/which...",
        "meaning": "aquele(a) que...",
        "example": "This isn't the one that I ordered."
      },
      {
        "expr": "something that really matters",
        "meaning": "algo que realmente importa",
        "example": "Family is something that really matters to me."
      },
      {
        "expr": "everything that happened",
        "meaning": "tudo o que aconteceu",
        "example": "She told me everything that happened at the party."
      }
    ],
    "sentences": [
      "The woman who called is my boss.",
      "The book that I read last week was amazing.",
      "The car which is parked outside belongs to my father.",
      "The teacher who explained the lesson was very patient.",
      "The restaurant that closed was my favorite.",
      "I need someone who can help me with this.",
      "The email that arrived this morning was important.",
      "The house which we bought needs some repairs."
    ],
    "grammar": {
      "title": "Relative Clauses: Who, Which, That",
      "rules": [
        "Who se refere a pessoas: The man who called is my brother.",
        "Which se refere a coisas ou animais: The car which broke down is old.",
        "That pode se referir a pessoas ou coisas, é mais informal e comum na fala: The book that I read...",
        "O pronome relativo pode ser omitido quando é objeto da oração: The book (that) I read was great."
      ],
      "table": {
        "headers": [
          "Pronome",
          "Usado para",
          "Exemplo",
          "Pode omitir?"
        ],
        "rows": [
          [
            "who",
            "pessoas",
            "The man who called is my brother.",
            "não (como sujeito)"
          ],
          [
            "which",
            "coisas/animais",
            "The car which broke down is old.",
            "sim (como objeto)"
          ],
          [
            "that",
            "pessoas ou coisas (informal)",
            "The book that I read was great.",
            "sim (como objeto)"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "The woman ___ called is my boss.",
        "a": "who",
        "opts": [
          "who",
          "which",
          "where",
          "whose"
        ]
      },
      {
        "q": "The car ___ is parked outside is mine.",
        "a": "which",
        "opts": [
          "which",
          "who",
          "where",
          "whose"
        ]
      },
      {
        "q": "The book ___ I read last week was amazing.",
        "a": "that",
        "opts": [
          "that",
          "who",
          "where",
          "whose"
        ]
      },
      {
        "q": "I need someone ___ can help me.",
        "a": "who",
        "opts": [
          "who",
          "which",
          "where",
          "whose"
        ]
      },
      {
        "q": "The restaurant ___ closed was my favorite.",
        "a": "that",
        "opts": [
          "that",
          "who",
          "where",
          "whose"
        ]
      }
    ],
    "speak": [
      "The woman who called is my boss.",
      "The book that I read last week was amazing.",
      "The teacher who explained the lesson was very patient.",
      "I need someone who can help me with this.",
      "The house which we bought needs some repairs."
    ]
  },
  {
    "id": 426,
    "title": "Relative Clauses: Where, When, Whose",
    "emoji": "📍",
    "verbs": [
      "To Live",
      "To Meet",
      "To Remember",
      "To Own"
    ],
    "vocab": [
      {
        "en": "where",
        "pt": "onde (lugares)",
        "ex": "The city where I was born is small."
      },
      {
        "en": "when",
        "pt": "quando (tempo)",
        "ex": "I remember the day when we met."
      },
      {
        "en": "whose",
        "pt": "cujo/cuja (posse)",
        "ex": "The man whose car broke down called a mechanic."
      },
      {
        "en": "landlord",
        "pt": "dono do imóvel",
        "ex": "The landlord whose flat we rent is nice."
      },
      {
        "en": "workshop",
        "pt": "oficina",
        "ex": "The workshop where I work is downtown."
      },
      {
        "en": "essential information",
        "pt": "informação essencial",
        "ex": "Without it, the sentence loses its meaning."
      },
      {
        "en": "extra information",
        "pt": "informação extra",
        "ex": "You could remove it and the sentence still makes sense."
      },
      {
        "en": "possession",
        "pt": "posse",
        "ex": "Whose shows who something belongs to."
      },
      {
        "en": "the city where I was born",
        "pt": "a cidade onde eu nasci",
        "ex": "The city where I was born is very small."
      },
      {
        "en": "the school where I studied",
        "pt": "a escola onde eu estudei",
        "ex": "The school where I studied closed last year."
      },
      {
        "en": "the day when we met",
        "pt": "o dia em que nos conhecemos",
        "ex": "I remember the day when we met."
      },
      {
        "en": "the year when I graduated",
        "pt": "o ano em que eu me formei",
        "ex": "2018 was the year when I graduated."
      },
      {
        "en": "the man whose car",
        "pt": "o homem cujo carro",
        "ex": "The man whose car broke down called a mechanic."
      },
      {
        "en": "the woman whose dog",
        "pt": "a mulher cujo cachorro",
        "ex": "The woman whose dog barks a lot lives next door."
      },
      {
        "en": "the house where we grew up",
        "pt": "a casa onde crescemos",
        "ex": "The house where we grew up was sold last year."
      },
      {
        "en": "the restaurant where we ate",
        "pt": "o restaurante onde comemos",
        "ex": "The restaurant where we ate was excellent."
      },
      {
        "en": "the moment when it happened",
        "pt": "o momento em que aconteceu",
        "ex": "I still remember the moment when it happened."
      },
      {
        "en": "the country where she lives",
        "pt": "o país onde ela mora",
        "ex": "Canada is the country where she lives now."
      },
      {
        "en": "the time when I was young",
        "pt": "a época em que eu era jovem",
        "ex": "Things were different in the time when I was young."
      },
      {
        "en": "the company whose products",
        "pt": "a empresa cujos produtos",
        "ex": "It's the company whose products I always buy."
      },
      {
        "en": "the neighbourhood where I live",
        "pt": "o bairro onde eu moro",
        "ex": "The neighbourhood where I live is very quiet."
      },
      {
        "en": "the office where she works",
        "pt": "o escritório onde ela trabalha",
        "ex": "The office where she works is downtown."
      },
      {
        "en": "the summer when we travelled",
        "pt": "o verão em que viajamos",
        "ex": "The summer when we travelled to Italy was unforgettable."
      },
      {
        "en": "the writer whose book",
        "pt": "o escritor cujo livro",
        "ex": "She is the writer whose book won the prize."
      },
      {
        "en": "Paris, which is the capital",
        "pt": "Paris, que é a capital",
        "ex": "Paris, which is the capital of France, is beautiful."
      },
      {
        "en": "my sister, who lives",
        "pt": "minha irmã, que mora",
        "ex": "My sister, who lives in Spain, is visiting next month."
      },
      {
        "en": "this hotel, where we stayed",
        "pt": "este hotel, onde ficamos",
        "ex": "This hotel, where we stayed last summer, has closed."
      },
      {
        "en": "essential detail",
        "pt": "detalhe essencial",
        "ex": "Leaving out an essential detail changes the meaning."
      },
      {
        "en": "extra detail",
        "pt": "detalhe extra",
        "ex": "Commas signal that the detail is extra."
      },
      {
        "en": "childhood home",
        "pt": "casa da infância",
        "ex": "My childhood home, where I lived until I was ten, is still there."
      }
    ],
    "expressions": [
      {
        "expr": "the place where it all began",
        "meaning": "o lugar onde tudo começou",
        "example": "This café is the place where it all began."
      },
      {
        "expr": "back in the day when...",
        "meaning": "antigamente, quando...",
        "example": "Back in the day when we were kids, phones didn't exist."
      },
      {
        "expr": "a friend whose opinion I trust",
        "meaning": "um amigo cuja opinião eu confio",
        "example": "I asked a friend whose opinion I trust."
      },
      {
        "expr": "at a time when...",
        "meaning": "numa época em que...",
        "example": "She started the business at a time when nobody believed in it."
      }
    ],
    "sentences": [
      "The city where I was born is very small.",
      "I remember the day when we met.",
      "The man whose car broke down called a mechanic.",
      "The house where we grew up was sold last year.",
      "Canada is the country where she lives now.",
      "My sister, who lives in Spain, is visiting next month.",
      "This is the company whose products I always buy.",
      "Paris, which is the capital of France, is beautiful."
    ],
    "grammar": {
      "title": "Relative Clauses: Where, When, Whose + Restritiva x Explicativa",
      "rules": [
        "Where se refere a lugares: The city where I was born is small.",
        "When se refere a tempo: I remember the day when we met.",
        "Whose mostra posse: The man whose car broke down called a mechanic.",
        "Orações restritivas (defining) não usam vírgula e são essenciais; orações explicativas (non-defining) usam vírgula e dão informação extra: My sister, who lives in Spain, is visiting."
      ],
      "table": {
        "headers": [
          "Pronome",
          "Uso",
          "Tipo",
          "Exemplo"
        ],
        "rows": [
          [
            "where",
            "lugar",
            "restritiva",
            "The school where I studied closed."
          ],
          [
            "when",
            "tempo",
            "restritiva",
            "I remember the day when we met."
          ],
          [
            "whose",
            "posse",
            "restritiva ou explicativa",
            "The man whose car broke down..."
          ],
          [
            "who (com vírgula)",
            "pessoa, info extra",
            "explicativa",
            "My sister, who lives in Spain, ..."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "The city ___ I was born is very small.",
        "a": "where",
        "opts": [
          "where",
          "when",
          "whose",
          "who"
        ]
      },
      {
        "q": "I remember the day ___ we met.",
        "a": "when",
        "opts": [
          "when",
          "where",
          "whose",
          "who"
        ]
      },
      {
        "q": "The man ___ car broke down called a mechanic.",
        "a": "whose",
        "opts": [
          "whose",
          "who",
          "where",
          "when"
        ]
      },
      {
        "q": "My sister, ___ lives in Spain, is visiting next month.",
        "a": "who",
        "opts": [
          "who",
          "whose",
          "where",
          "when"
        ]
      },
      {
        "q": "This is the company ___ products I always buy.",
        "a": "whose",
        "opts": [
          "whose",
          "who",
          "where",
          "when"
        ]
      }
    ],
    "speak": [
      "The city where I was born is very small.",
      "I remember the day when we met.",
      "The man whose car broke down called a mechanic.",
      "My sister, who lives in Spain, is visiting next month.",
      "Paris, which is the capital of France, is beautiful."
    ]
  },
  {
    "id": 427,
    "title": "Gerunds: Verb + -ing",
    "emoji": "🎬",
    "verbs": [
      "To Enjoy",
      "To Avoid",
      "To Finish",
      "To Suggest"
    ],
    "vocab": [
      {
        "en": "to avoid",
        "pt": "evitar",
        "ex": "I avoid eating late at night."
      },
      {
        "en": "to enjoy",
        "pt": "curtir",
        "ex": "I enjoy walking in the morning."
      },
      {
        "en": "to give up",
        "pt": "desistir de",
        "ex": "He gave up smoking last year."
      },
      {
        "en": "to mind",
        "pt": "se importar",
        "ex": "Do you mind waiting a minute?"
      },
      {
        "en": "to keep",
        "pt": "continuar (fazendo)",
        "ex": "Just keep trying."
      },
      {
        "en": "to be good at",
        "pt": "ser bom em",
        "ex": "She is good at solving problems."
      },
      {
        "en": "activity",
        "pt": "atividade",
        "ex": "Swimming is a great activity."
      },
      {
        "en": "hobby",
        "pt": "hobby/passatempo",
        "ex": "Painting is her favorite hobby."
      },
      {
        "en": "to enjoy swimming",
        "pt": "gostar de nadar",
        "ex": "I enjoy swimming in the sea."
      },
      {
        "en": "to avoid eating",
        "pt": "evitar comer",
        "ex": "Avoid eating late at night."
      },
      {
        "en": "to finish working",
        "pt": "terminar de trabalhar",
        "ex": "She finished working at six."
      },
      {
        "en": "to suggest going",
        "pt": "sugerir ir",
        "ex": "He suggested going to the beach."
      },
      {
        "en": "to keep trying",
        "pt": "continuar tentando",
        "ex": "Keep trying, you're getting better."
      },
      {
        "en": "to mind waiting",
        "pt": "se importar de esperar",
        "ex": "Would you mind waiting a moment?"
      },
      {
        "en": "to practise speaking",
        "pt": "praticar falar",
        "ex": "You should practise speaking every day."
      },
      {
        "en": "to consider moving",
        "pt": "considerar se mudar",
        "ex": "We're considering moving to another city."
      },
      {
        "en": "to give up smoking",
        "pt": "parar de fumar",
        "ex": "He gave up smoking last year."
      },
      {
        "en": "to miss travelling",
        "pt": "sentir falta de viajar",
        "ex": "I miss travelling with my friends."
      },
      {
        "en": "to imagine living",
        "pt": "imaginar viver",
        "ex": "I can't imagine living without music."
      },
      {
        "en": "to postpone leaving",
        "pt": "adiar a partida",
        "ex": "They postponed leaving until Monday."
      },
      {
        "en": "to risk losing",
        "pt": "arriscar perder",
        "ex": "Don't risk losing your job over this."
      },
      {
        "en": "to deny stealing",
        "pt": "negar ter roubado",
        "ex": "He denied stealing the money."
      },
      {
        "en": "to be good at cooking",
        "pt": "ser bom em cozinhar",
        "ex": "She is good at cooking Italian food."
      },
      {
        "en": "to be interested in painting",
        "pt": "se interessar por pintura",
        "ex": "He is interested in painting landscapes."
      },
      {
        "en": "to be tired of waiting",
        "pt": "estar cansado de esperar",
        "ex": "I'm tired of waiting in line."
      },
      {
        "en": "to look forward to seeing",
        "pt": "estar ansioso para ver",
        "ex": "I'm looking forward to seeing you."
      },
      {
        "en": "to be afraid of flying",
        "pt": "ter medo de voar",
        "ex": "She is afraid of flying."
      },
      {
        "en": "to be responsible for cleaning",
        "pt": "ser responsável por limpar",
        "ex": "He is responsible for cleaning the office."
      },
      {
        "en": "to spend time reading",
        "pt": "passar tempo lendo",
        "ex": "I spend a lot of time reading."
      },
      {
        "en": "to have trouble sleeping",
        "pt": "ter dificuldade para dormir",
        "ex": "She has trouble sleeping before exams."
      }
    ],
    "expressions": [
      {
        "expr": "Would you mind + -ing?",
        "meaning": "Você se importaria de...?",
        "example": "Would you mind closing the window?"
      },
      {
        "expr": "It's worth + -ing",
        "meaning": "Vale a pena...",
        "example": "This museum is worth visiting."
      },
      {
        "expr": "There's no point in + -ing",
        "meaning": "Não adianta / não tem sentido...",
        "example": "There's no point in arguing about it."
      },
      {
        "expr": "I can't help + -ing",
        "meaning": "Eu não consigo evitar / não resisto...",
        "example": "I can't help laughing when he tells jokes."
      }
    ],
    "sentences": [
      "I enjoy swimming in the sea.",
      "She finished working at six.",
      "He suggested going to the beach.",
      "Would you mind closing the window?",
      "I'm looking forward to seeing you.",
      "This museum is worth visiting.",
      "He gave up smoking last year.",
      "I can't help laughing when he tells jokes."
    ],
    "grammar": {
      "title": "Gerúndio: Verbo + -ING como Substantivo",
      "rules": [
        "O gerúndio (verbo + -ing) funciona como substantivo: pode ser sujeito ou objeto da frase.",
        "Alguns verbos SEMPRE exigem gerúndio depois: enjoy, avoid, finish, suggest, mind, keep, practise, consider, give up, miss.",
        "Depois de preposições, use sempre o gerúndio: good at drawing, interested in painting, afraid of flying.",
        "Expressões fixas como 'it's worth', 'there's no point in' e 'can't help' também são seguidas de gerúndio."
      ],
      "table": {
        "headers": [
          "Verbo/expressão",
          "+ gerúndio",
          "Exemplo",
          "Nota"
        ],
        "rows": [
          [
            "enjoy",
            "sempre",
            "I enjoy swimming.",
            "gosto de"
          ],
          [
            "avoid",
            "sempre",
            "Avoid eating late.",
            "evitar"
          ],
          [
            "good at / interested in",
            "depois de preposição",
            "She is good at cooking.",
            "regra da preposição"
          ],
          [
            "it's worth",
            "expressão fixa",
            "This film is worth watching.",
            "vale a pena"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I enjoy ___ (swim) in the sea.",
        "a": "swimming",
        "opts": [
          "swimming",
          "to swim",
          "swim",
          "swam"
        ]
      },
      {
        "q": "He suggested ___ (go) to the beach.",
        "a": "going",
        "opts": [
          "going",
          "to go",
          "go",
          "went"
        ]
      },
      {
        "q": "Would you mind ___ (close) the window?",
        "a": "closing",
        "opts": [
          "closing",
          "to close",
          "close",
          "closed"
        ]
      },
      {
        "q": "She is good at ___ (cook).",
        "a": "cooking",
        "opts": [
          "cooking",
          "to cook",
          "cook",
          "cooked"
        ]
      },
      {
        "q": "This museum is worth ___ (visit).",
        "a": "visiting",
        "opts": [
          "visiting",
          "to visit",
          "visit",
          "visited"
        ]
      }
    ],
    "speak": [
      "I enjoy swimming in the sea.",
      "He suggested going to the beach.",
      "Would you mind closing the window?",
      "This museum is worth visiting.",
      "He gave up smoking last year."
    ]
  },
  {
    "id": 428,
    "title": "Infinitives & Verbs That Change Meaning",
    "emoji": "➡️",
    "verbs": [
      "To Decide",
      "To Want",
      "To Promise",
      "To Remember"
    ],
    "vocab": [
      {
        "en": "to pretend",
        "pt": "fingir",
        "ex": "He pretended to be busy."
      },
      {
        "en": "to afford",
        "pt": "ter condição de",
        "ex": "I cannot afford to lose this job."
      },
      {
        "en": "to promise",
        "pt": "prometer",
        "ex": "I promised to help her."
      },
      {
        "en": "to refuse",
        "pt": "recusar",
        "ex": "He refused to answer."
      },
      {
        "en": "meaning change",
        "pt": "mudança de significado",
        "ex": "Stop smoking and stop to smoke mean different things."
      },
      {
        "en": "purpose",
        "pt": "propósito/finalidade",
        "ex": "I called to ask about the price."
      },
      {
        "en": "to remind",
        "pt": "lembrar (alguém)",
        "ex": "Remind me to call her."
      },
      {
        "en": "causative",
        "pt": "verbo causativo",
        "ex": "Let and make use the bare infinitive."
      },
      {
        "en": "to decide to travel",
        "pt": "decidir viajar",
        "ex": "We decided to travel in July."
      },
      {
        "en": "to want to learn",
        "pt": "querer aprender",
        "ex": "I want to learn Spanish."
      },
      {
        "en": "to promise to call",
        "pt": "prometer ligar",
        "ex": "He promised to call me later."
      },
      {
        "en": "to remember to buy",
        "pt": "lembrar de comprar",
        "ex": "Remember to buy milk on your way home."
      },
      {
        "en": "to remember buying",
        "pt": "lembrar de ter comprado",
        "ex": "I remember buying this book years ago."
      },
      {
        "en": "to forget to lock",
        "pt": "esquecer de trancar",
        "ex": "Don't forget to lock the door."
      },
      {
        "en": "to forget meeting",
        "pt": "esquecer de ter conhecido",
        "ex": "I forgot meeting him at the party."
      },
      {
        "en": "to stop to smoke",
        "pt": "parar (de andar) para fumar",
        "ex": "He stopped to smoke a cigarette."
      },
      {
        "en": "to stop smoking",
        "pt": "parar de fumar (o hábito)",
        "ex": "He stopped smoking last year."
      },
      {
        "en": "to try to open",
        "pt": "tentar abrir",
        "ex": "She tried to open the door quietly."
      },
      {
        "en": "to try opening",
        "pt": "experimentar abrir",
        "ex": "Try opening the window for some fresh air."
      },
      {
        "en": "to need to finish",
        "pt": "precisar terminar",
        "ex": "I need to finish this report today."
      },
      {
        "en": "to plan to move",
        "pt": "planejar se mudar",
        "ex": "They plan to move next year."
      },
      {
        "en": "to hope to visit",
        "pt": "esperar visitar",
        "ex": "We hope to visit Japan someday."
      },
      {
        "en": "to refuse to answer",
        "pt": "se recusar a responder",
        "ex": "He refused to answer the question."
      },
      {
        "en": "to manage to arrive",
        "pt": "conseguir chegar",
        "ex": "She managed to arrive on time despite the traffic."
      },
      {
        "en": "to afford to buy",
        "pt": "ter condições de comprar",
        "ex": "We can't afford to buy a new car right now."
      },
      {
        "en": "to agree to help",
        "pt": "concordar em ajudar",
        "ex": "He agreed to help us move."
      },
      {
        "en": "to offer to pay",
        "pt": "se oferecer para pagar",
        "ex": "She offered to pay for dinner."
      },
      {
        "en": "to expect to win",
        "pt": "esperar vencer",
        "ex": "They expect to win the championship."
      },
      {
        "en": "to let someone go",
        "pt": "deixar alguém ir",
        "ex": "She let him go early today."
      },
      {
        "en": "to make someone laugh",
        "pt": "fazer alguém rir",
        "ex": "He always makes me laugh."
      }
    ],
    "expressions": [
      {
        "expr": "I'd love to...",
        "meaning": "Eu adoraria...",
        "example": "I'd love to visit Japan someday."
      },
      {
        "expr": "It's important to...",
        "meaning": "É importante...",
        "example": "It's important to save some money every month."
      },
      {
        "expr": "make sure to...",
        "meaning": "certifique-se de / não esqueça de...",
        "example": "Make sure to lock the door before you leave."
      },
      {
        "expr": "I regret to say...",
        "meaning": "Lamento informar que...",
        "example": "I regret to say that the flight was cancelled."
      }
    ],
    "sentences": [
      "We decided to travel in July.",
      "He promised to call me later.",
      "Don't forget to lock the door.",
      "He stopped smoking last year.",
      "She tried to open the door quietly.",
      "I need to finish this report today.",
      "She managed to arrive on time despite the traffic.",
      "Make sure to lock the door before you leave."
    ],
    "grammar": {
      "title": "Infinitivo (to + verbo) e Verbos que Mudam de Significado",
      "rules": [
        "O infinitivo (to + verbo) é usado depois de verbos como decide, want, promise, need, plan, hope, refuse, manage.",
        "Remember, forget e try mudam de significado: + infinitivo (ação futura/propósito) vs + gerúndio (memória/experimento).",
        "Remember to buy milk (não esqueça de comprar - ação futura) vs I remember buying it (lembro de já ter comprado - memória do passado).",
        "Stop + infinitivo = parar de fazer algo PARA fazer outra coisa; stop + gerúndio = parar de fazer o hábito."
      ],
      "table": {
        "headers": [
          "Verbo",
          "+ infinitivo",
          "+ gerúndio",
          "Diferença"
        ],
        "rows": [
          [
            "remember",
            "não esquecer de fazer (futuro)",
            "lembrar de já ter feito",
            "tempo da ação"
          ],
          [
            "forget",
            "esquecer de fazer (futuro)",
            "esquecer que já fez",
            "tempo da ação"
          ],
          [
            "stop",
            "parar para fazer outra coisa",
            "parar o hábito",
            "propósito x hábito"
          ],
          [
            "try",
            "tentar fazer algo difícil",
            "experimentar/testar",
            "esforço x experimento"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "We decided ___ (travel) in July.",
        "a": "to travel",
        "opts": [
          "to travel",
          "travelling",
          "travel",
          "travelled"
        ]
      },
      {
        "q": "Remember ___ (buy) milk on your way home.",
        "a": "to buy",
        "opts": [
          "to buy",
          "buying",
          "buy",
          "bought"
        ]
      },
      {
        "q": "I remember ___ (buy) this book years ago.",
        "a": "buying",
        "opts": [
          "buying",
          "to buy",
          "buy",
          "bought"
        ]
      },
      {
        "q": "He stopped ___ (smoke) last year.",
        "a": "smoking",
        "opts": [
          "smoking",
          "to smoke",
          "smoke",
          "smoked"
        ]
      },
      {
        "q": "She managed ___ (arrive) on time.",
        "a": "to arrive",
        "opts": [
          "to arrive",
          "arriving",
          "arrive",
          "arrived"
        ]
      }
    ],
    "speak": [
      "We decided to travel in July.",
      "Remember to buy milk on your way home.",
      "He stopped smoking last year.",
      "She managed to arrive on time despite the traffic.",
      "Make sure to lock the door before you leave."
    ]
  },
  {
    "id": 429,
    "title": "Talking About Your Dreams & Goals",
    "emoji": "🌟",
    "verbs": [
      "To Dream",
      "To Hope",
      "To Plan",
      "To Achieve"
    ],
    "vocab": [
      {
        "en": "dream job",
        "pt": "emprego dos sonhos",
        "ex": "Being a pilot is her dream job."
      },
      {
        "en": "life goal",
        "pt": "objetivo de vida",
        "ex": "Travelling the world is one of my life goals."
      },
      {
        "en": "dream life",
        "pt": "vida dos sonhos",
        "ex": "My dream life includes a small house by the sea."
      },
      {
        "en": "purpose",
        "pt": "propósito",
        "ex": "She finally found her purpose in teaching."
      },
      {
        "en": "turning point",
        "pt": "ponto de virada",
        "ex": "Moving abroad was a turning point in her life."
      },
      {
        "en": "to take a risk",
        "pt": "correr um risco",
        "ex": "You have to take a risk to achieve big things."
      },
      {
        "en": "to follow your dream",
        "pt": "seguir seu sonho",
        "ex": "He quit his job to follow his dream."
      },
      {
        "en": "to make a change",
        "pt": "fazer uma mudança",
        "ex": "I decided to make a change in my career."
      },
      {
        "en": "to pursue",
        "pt": "buscar, perseguir um objetivo",
        "ex": "She left the bank to pursue architecture."
      },
      {
        "en": "to achieve",
        "pt": "alcançar, conquistar",
        "ex": "He achieved his goal of running a marathon."
      },
      {
        "en": "to accomplish",
        "pt": "realizar, cumprir",
        "ex": "We accomplished everything we planned."
      },
      {
        "en": "ambition",
        "pt": "ambição",
        "ex": "Her ambition is to open her own restaurant."
      },
      {
        "en": "to be worth it",
        "pt": "valer a pena",
        "ex": "The hard work was worth it in the end."
      },
      {
        "en": "comfort zone",
        "pt": "zona de conforto",
        "ex": "You need to step out of your comfort zone."
      },
      {
        "en": "to start from scratch",
        "pt": "começar do zero",
        "ex": "She started from scratch after moving countries."
      },
      {
        "en": "stability",
        "pt": "estabilidade",
        "ex": "He gave up stability for a more exciting career."
      },
      {
        "en": "fulfillment",
        "pt": "realização pessoal",
        "ex": "Teaching gives her a real sense of fulfillment."
      },
      {
        "en": "to give up something",
        "pt": "abrir mão de algo",
        "ex": "She gave up a stable salary to study art."
      },
      {
        "en": "passion",
        "pt": "paixão",
        "ex": "Cooking has always been his passion."
      },
      {
        "en": "to figure out",
        "pt": "descobrir, entender",
        "ex": "It took years to figure out what she really wanted."
      },
      {
        "en": "career change",
        "pt": "mudança de carreira",
        "ex": "A career change can be scary but exciting."
      },
      {
        "en": "to make a living",
        "pt": "se sustentar, ganhar a vida",
        "ex": "He makes a living as a freelance photographer."
      },
      {
        "en": "to design your life",
        "pt": "planejar sua própria vida",
        "ex": "She wants to design her life, not just live it."
      },
      {
        "en": "to feel stuck",
        "pt": "se sentir preso/estagnado",
        "ex": "I felt stuck in my old job."
      },
      {
        "en": "to feel fulfilled",
        "pt": "se sentir realizado",
        "ex": "I finally feel fulfilled in my new career."
      },
      {
        "en": "bucket list",
        "pt": "lista de desejos",
        "ex": "Visiting Japan is on my bucket list."
      },
      {
        "en": "to reinvent yourself",
        "pt": "se reinventar",
        "ex": "It's never too late to reinvent yourself."
      },
      {
        "en": "self-discovery",
        "pt": "autoconhecimento",
        "ex": "The trip became a journey of self-discovery."
      },
      {
        "en": "to have second thoughts",
        "pt": "ter dúvidas / se arrepender",
        "ex": "She had second thoughts before quitting."
      },
      {
        "en": "worth the risk",
        "pt": "vale o risco",
        "ex": "Changing careers was worth the risk for her."
      }
    ],
    "expressions": [
      {
        "expr": "My dream is to...",
        "meaning": "Meu sonho é...",
        "example": "My dream is to open my own small business."
      },
      {
        "expr": "I've always wanted to...",
        "meaning": "Eu sempre quis...",
        "example": "I've always wanted to learn how to paint."
      },
      {
        "expr": "Someday I'd like to...",
        "meaning": "Um dia eu gostaria de...",
        "example": "Someday I'd like to live near the ocean."
      },
      {
        "expr": "It's now or never",
        "meaning": "É agora ou nunca",
        "example": "She decided it was now or never and booked the flight."
      }
    ],
    "sentences": [
      "My dream is to open my own small business.",
      "I've always wanted to learn how to paint.",
      "She quit her job to follow her dream.",
      "It took her years to figure out what she really wanted.",
      "He achieved his goal of running a marathon.",
      "You need to step out of your comfort zone sometimes.",
      "Cooking has always been his true passion.",
      "Someday I'd like to live near the ocean."
    ],
    "grammar": {
      "title": "Falando Sobre Sonhos e Objetivos: Estruturas Úteis",
      "rules": [
        "Use 'My dream is to + verbo' para falar do seu maior sonho: My dream is to travel the world.",
        "Use 'I've always wanted to + verbo' para desejos antigos: I've always wanted to write a book.",
        "Use 'Someday I'd like to + verbo' para planos futuros incertos: Someday I'd like to move abroad.",
        "Combine com want, hope, plan, dream (of + gerúndio): I dream of living by the sea."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Uso",
          "Exemplo",
          "Nota"
        ],
        "rows": [
          [
            "My dream is to...",
            "sonho principal",
            "My dream is to open a café.",
            "+ infinitivo"
          ],
          [
            "I've always wanted to...",
            "desejo antigo",
            "I've always wanted to travel alone.",
            "present perfect + infinitivo"
          ],
          [
            "dream of + -ing",
            "sonhar em fazer algo",
            "She dreams of living abroad.",
            "+ gerúndio depois de preposição"
          ],
          [
            "Someday I'd like to...",
            "plano futuro incerto",
            "Someday I'd like to retire early.",
            "+ infinitivo"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "My dream is ___ (open) my own restaurant.",
        "a": "to open",
        "opts": [
          "to open",
          "opening",
          "open",
          "opened"
        ]
      },
      {
        "q": "I've always ___ (want) to learn how to paint.",
        "a": "wanted",
        "opts": [
          "wanted",
          "want",
          "wants",
          "to want"
        ]
      },
      {
        "q": "She dreams ___ (live) by the sea.",
        "a": "of living",
        "opts": [
          "of living",
          "to live",
          "living",
          "of to live"
        ]
      },
      {
        "q": "Someday I'd like ___ (move) abroad.",
        "a": "to move",
        "opts": [
          "to move",
          "moving",
          "move",
          "moved"
        ]
      },
      {
        "q": "He ___ (achieve) his goal of running a marathon.",
        "a": "achieved",
        "opts": [
          "achieved",
          "achieve",
          "achieves",
          "achieving"
        ]
      }
    ],
    "speak": [
      "My dream is to open my own small business.",
      "I've always wanted to learn how to paint.",
      "She dreams of living by the sea.",
      "Someday I'd like to move abroad.",
      "He achieved his goal of running a marathon."
    ]
  },
  {
    "id": 430,
    "title": "Describing Your Ideal Life",
    "emoji": "🏆",
    "verbs": [
      "To Imagine",
      "To Design",
      "To Choose",
      "To Become"
    ],
    "vocab": [
      {
        "en": "ideal life",
        "pt": "vida ideal",
        "ex": "In my ideal life, I work from anywhere."
      },
      {
        "en": "if I could",
        "pt": "se eu pudesse",
        "ex": "If I could change one thing, I'd travel more."
      },
      {
        "en": "if I had the chance",
        "pt": "se eu tivesse a chance",
        "ex": "If I had the chance, I'd move to Portugal."
      },
      {
        "en": "a life where...",
        "pt": "uma vida onde...",
        "ex": "I want a life where I feel free."
      },
      {
        "en": "someone who...",
        "pt": "alguém que...",
        "ex": "I want to be someone who inspires others."
      },
      {
        "en": "work-life balance",
        "pt": "equilíbrio entre trabalho e vida pessoal",
        "ex": "She finally found a good work-life balance."
      },
      {
        "en": "to travel the world",
        "pt": "viajar pelo mundo",
        "ex": "I would love to travel the world someday."
      },
      {
        "en": "to work remotely",
        "pt": "trabalhar remotamente",
        "ex": "He works remotely from different countries."
      },
      {
        "en": "financial freedom",
        "pt": "liberdade financeira",
        "ex": "Financial freedom is one of my biggest goals."
      },
      {
        "en": "to spend time with family",
        "pt": "passar tempo com a família",
        "ex": "I want a life where I can spend more time with family."
      },
      {
        "en": "meaningful work",
        "pt": "trabalho com propósito",
        "ex": "She looks for meaningful work, not just a salary."
      },
      {
        "en": "to live simply",
        "pt": "viver de forma simples",
        "ex": "They chose to live simply, with fewer things."
      },
      {
        "en": "to feel at peace",
        "pt": "se sentir em paz",
        "ex": "I feel at peace when I'm near the ocean."
      },
      {
        "en": "to make a difference",
        "pt": "fazer a diferença",
        "ex": "I want a career where I can make a difference."
      },
      {
        "en": "to be my own boss",
        "pt": "ser meu próprio patrão",
        "ex": "My dream is to be my own boss."
      },
      {
        "en": "a slower pace of life",
        "pt": "um ritmo de vida mais devagar",
        "ex": "I'd love a slower pace of life in the countryside."
      },
      {
        "en": "to wake up excited",
        "pt": "acordar animado(a)",
        "ex": "I want to wake up excited to go to work."
      },
      {
        "en": "surrounded by nature",
        "pt": "cercado(a) pela natureza",
        "ex": "My ideal home is surrounded by nature."
      },
      {
        "en": "close-knit community",
        "pt": "comunidade unida",
        "ex": "I'd love to live in a close-knit community."
      },
      {
        "en": "to build something of my own",
        "pt": "construir algo meu",
        "ex": "He wants to build something of his own."
      },
      {
        "en": "to have no regrets",
        "pt": "não ter arrependimentos",
        "ex": "I want to live a life with no regrets."
      },
      {
        "en": "to prioritize",
        "pt": "priorizar",
        "ex": "I've learned to prioritize my health and happiness."
      },
      {
        "en": "to chase a dream",
        "pt": "correr atrás de um sonho",
        "ex": "She left everything to chase her dream."
      },
      {
        "en": "inner peace",
        "pt": "paz interior",
        "ex": "Meditation helped her find inner peace."
      },
      {
        "en": "to grow as a person",
        "pt": "crescer como pessoa",
        "ex": "Travelling helped him grow as a person."
      },
      {
        "en": "sense of freedom",
        "pt": "sensação de liberdade",
        "ex": "Working for myself gives me a real sense of freedom."
      },
      {
        "en": "to design your own path",
        "pt": "traçar seu próprio caminho",
        "ex": "She decided to design her own path in life."
      },
      {
        "en": "what truly matters",
        "pt": "o que realmente importa",
        "ex": "Family is what truly matters to me."
      },
      {
        "en": "to look back with pride",
        "pt": "olhar para trás com orgulho",
        "ex": "I want to look back with pride at what I built."
      },
      {
        "en": "to live life to the fullest",
        "pt": "viver a vida ao máximo",
        "ex": "He believes in living life to the fullest."
      }
    ],
    "expressions": [
      {
        "expr": "If I could design my life...",
        "meaning": "Se eu pudesse desenhar minha vida...",
        "example": "If I could design my life, I'd spend more time outdoors."
      },
      {
        "expr": "A life where...",
        "meaning": "Uma vida onde...",
        "example": "I want a life where I don't have to choose between work and family."
      },
      {
        "expr": "At the end of the day...",
        "meaning": "No final das contas...",
        "example": "At the end of the day, health matters more than money."
      },
      {
        "expr": "Live life to the fullest",
        "meaning": "Viver a vida ao máximo",
        "example": "She believes in living life to the fullest, no regrets."
      }
    ],
    "sentences": [
      "If I could design my life, I'd spend more time outdoors.",
      "I want a life where I feel free and fulfilled.",
      "My dream is to be my own boss someday.",
      "I'd love a slower pace of life in the countryside.",
      "She left everything to chase her dream of painting.",
      "I want a career where I can make a difference.",
      "At the end of the day, what truly matters is family.",
      "He believes in living life to the fullest."
    ],
    "grammar": {
      "title": "Descrevendo Sua Vida Ideal: Combinando Estruturas",
      "rules": [
        "Use o segundo condicional para falar de uma vida imaginária: If I could change one thing, I would travel more.",
        "Combine com orações relativas para descrever essa vida: I want a life where I feel free / I want to be someone who inspires others.",
        "Use modais para expressar desejos e possibilidades: I would love to..., I might move abroad someday.",
        "Junte tudo em frases mais completas: If I could, I'd live in a place where people know your name."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Combina com",
          "Exemplo",
          "Efeito"
        ],
        "rows": [
          [
            "If I could...",
            "condicional + relativa",
            "If I could, I'd live somewhere quieter.",
            "imaginar possibilidades"
          ],
          [
            "a life where...",
            "oração relativa",
            "I want a life where I feel free.",
            "descrever um cenário"
          ],
          [
            "someone who...",
            "oração relativa",
            "I want to be someone who helps others.",
            "descrever identidade"
          ],
          [
            "I would love to...",
            "modal + infinitivo",
            "I would love to travel the world.",
            "expressar desejo"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "If I ___ design my life, I'd travel more.",
        "a": "could",
        "opts": [
          "could",
          "can",
          "will",
          "must"
        ]
      },
      {
        "q": "I want a life ___ I feel free.",
        "a": "where",
        "opts": [
          "where",
          "who",
          "which",
          "whose"
        ]
      },
      {
        "q": "I want to be someone ___ inspires others.",
        "a": "who",
        "opts": [
          "who",
          "where",
          "which",
          "whose"
        ]
      },
      {
        "q": "I ___ love to travel the world someday.",
        "a": "would",
        "opts": [
          "would",
          "will",
          "can",
          "must"
        ]
      },
      {
        "q": "At the end of the day, what truly matters ___ family.",
        "a": "is",
        "opts": [
          "is",
          "are",
          "was",
          "be"
        ]
      }
    ],
    "speak": [
      "If I could design my life, I'd spend more time outdoors.",
      "I want a life where I feel free and fulfilled.",
      "My dream is to be my own boss someday.",
      "I want a career where I can make a difference.",
      "He believes in living life to the fullest."
    ]
  },
  {
    "id": 431,
    "title": "Used to: Talking About Past Habits",
    "emoji": "🔙",
    "verbs": [
      "To Live",
      "To Play",
      "To Wake Up",
      "To Smoke"
    ],
    "vocab": [
      {
        "en": "used to",
        "pt": "costumava",
        "ex": "I used to play soccer every Sunday."
      },
      {
        "en": "past habit",
        "pt": "hábito do passado",
        "ex": "Smoking was a past habit for him."
      },
      {
        "en": "past state",
        "pt": "estado do passado",
        "ex": "I used to be very shy."
      },
      {
        "en": "no longer",
        "pt": "não mais",
        "ex": "She no longer lives here."
      },
      {
        "en": "nowadays",
        "pt": "hoje em dia",
        "ex": "Nowadays I drink more water."
      },
      {
        "en": "back then",
        "pt": "naquela época",
        "ex": "Back then, we had no computers."
      },
      {
        "en": "as a child",
        "pt": "quando criança",
        "ex": "As a child, I was afraid of dogs."
      },
      {
        "en": "as a teenager",
        "pt": "quando adolescente",
        "ex": "As a teenager, I used to stay up late."
      },
      {
        "en": "when I was young",
        "pt": "quando eu era jovem",
        "ex": "When I was young, I used to run every morning."
      },
      {
        "en": "to change",
        "pt": "mudar",
        "ex": "A lot has changed since then."
      },
      {
        "en": "habit",
        "pt": "hábito",
        "ex": "Reading was a daily habit for her."
      },
      {
        "en": "to stop (doing something)",
        "pt": "parar (de fazer algo)",
        "ex": "He stopped smoking two years ago."
      },
      {
        "en": "to quit",
        "pt": "largar, abandonar",
        "ex": "She quit her old job."
      },
      {
        "en": "routine",
        "pt": "rotina",
        "ex": "My routine used to be very different."
      },
      {
        "en": "lifestyle",
        "pt": "estilo de vida",
        "ex": "My lifestyle used to be much busier."
      },
      {
        "en": "to grow up",
        "pt": "crescer",
        "ex": "I grew up in a small town."
      },
      {
        "en": "those days",
        "pt": "aqueles tempos",
        "ex": "In those days, life was simpler."
      },
      {
        "en": "to remember",
        "pt": "lembrar",
        "ex": "I remember when we used to walk to school."
      },
      {
        "en": "used to be",
        "pt": "costumava ser",
        "ex": "This street used to be much quieter."
      },
      {
        "en": "never used to",
        "pt": "nunca costumava",
        "ex": "I never used to like vegetables."
      },
      {
        "en": "did you use to...?",
        "pt": "você costumava...?",
        "ex": "Did you use to play an instrument?"
      },
      {
        "en": "didn't use to",
        "pt": "não costumava",
        "ex": "He didn't use to drink coffee."
      },
      {
        "en": "to change one's mind",
        "pt": "mudar de ideia",
        "ex": "She changed her mind about the job."
      },
      {
        "en": "compared to now",
        "pt": "comparado com agora",
        "ex": "Compared to now, things were slower back then."
      },
      {
        "en": "to be different",
        "pt": "ser diferente",
        "ex": "Life used to be very different."
      },
      {
        "en": "to miss (something)",
        "pt": "sentir falta (de algo)",
        "ex": "I miss how simple things used to be."
      },
      {
        "en": "old habit",
        "pt": "hábito antigo",
        "ex": "Biting my nails was an old habit."
      },
      {
        "en": "to give up",
        "pt": "desistir, abandonar",
        "ex": "I gave up eating fast food."
      },
      {
        "en": "former",
        "pt": "antigo, anterior",
        "ex": "My former neighbor used to play music every night."
      },
      {
        "en": "used to work",
        "pt": "costumava trabalhar",
        "ex": "I used to work in a bakery."
      }
    ],
    "expressions": [
      {
        "expr": "I used to...",
        "meaning": "Eu costumava...",
        "example": "I used to live in São Paulo."
      },
      {
        "expr": "Things have changed",
        "meaning": "As coisas mudaram",
        "example": "Things have changed a lot since then."
      },
      {
        "expr": "It's not like it used to be",
        "meaning": "Não é como costumava ser",
        "example": "This neighborhood is not like it used to be."
      },
      {
        "expr": "Back in the day",
        "meaning": "Antigamente",
        "example": "Back in the day, we didn't have smartphones."
      }
    ],
    "sentences": [
      "I used to play soccer every Sunday with my friends.",
      "She used to be very shy at school.",
      "We used to live in a small apartment downtown.",
      "Did you use to travel a lot before?",
      "He didn't use to like coffee, but now he loves it.",
      "Things used to be much simpler back then.",
      "I used to wake up early for my old job.",
      "My grandmother used to tell us amazing stories."
    ],
    "grammar": {
      "title": "Used to: Hábitos e Estados do Passado",
      "rules": [
        "USED TO + verbo base descreve hábitos ou estados do passado que não são mais verdade: I used to smoke.",
        "Forma NEGATIVA: didn't + use to (sem 'd'): She didn't use to like tea.",
        "Forma de PERGUNTA: Did + subject + use to...?: Did you use to play tennis?",
        "USED TO nunca é usado para o presente — só existe no passado. Para hábitos atuais, use 'usually'."
      ],
      "table": {
        "headers": [
          "Forma",
          "Estrutura",
          "Exemplo",
          "Uso"
        ],
        "rows": [
          [
            "Afirmativa",
            "used to + verbo",
            "I used to smoke.",
            "Hábito/estado passado"
          ],
          [
            "Negativa",
            "didn't use to + verbo",
            "She didn't use to like tea.",
            "Negar hábito passado"
          ],
          [
            "Interrogativa",
            "Did...use to + verbo?",
            "Did you use to play tennis?",
            "Perguntar sobre hábito passado"
          ],
          [
            "Presente (errado)",
            "❌ I use to go",
            "I usually go now.",
            "USED TO não existe no presente"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I ___ (use to) play soccer every Sunday.",
        "a": "used to",
        "opts": [
          "used to",
          "use to",
          "uses to",
          "using to"
        ]
      },
      {
        "q": "She ___ (not/use to) like coffee.",
        "a": "didn't use to",
        "opts": [
          "didn't use to",
          "doesn't use to",
          "not used to",
          "didn't used to"
        ]
      },
      {
        "q": "___ you use to live in Rio?",
        "a": "Did",
        "opts": [
          "Did",
          "Do",
          "Have",
          "Were"
        ]
      },
      {
        "q": "We ___ (use to) travel every summer.",
        "a": "used to",
        "opts": [
          "used to",
          "use to",
          "uses to",
          "were use to"
        ]
      },
      {
        "q": "As a child, I ___ (be) afraid of the dark.",
        "a": "used to be",
        "opts": [
          "used to be",
          "use to be",
          "was used to",
          "am used to"
        ]
      }
    ],
    "speak": [
      "I used to play soccer every Sunday with my friends.",
      "She used to be very shy at school.",
      "Did you use to travel a lot before?",
      "Things used to be much simpler back then.",
      "My grandmother used to tell us amazing stories."
    ]
  },
  {
    "id": 432,
    "title": "Would, Be Used To & Get Used To",
    "emoji": "🔄",
    "verbs": [
      "To Visit",
      "To Eat",
      "To Drive",
      "To Get Up"
    ],
    "vocab": [
      {
        "en": "would (past habit)",
        "pt": "costumava (ação repetida)",
        "ex": "Every summer, we would visit grandma."
      },
      {
        "en": "repeated action",
        "pt": "ação repetida",
        "ex": "Would is used for repeated actions in the past."
      },
      {
        "en": "be used to",
        "pt": "estar acostumado(a)",
        "ex": "I am used to the noise now."
      },
      {
        "en": "get used to",
        "pt": "acostumar-se (processo)",
        "ex": "I'm getting used to the cold weather."
      },
      {
        "en": "accustomed",
        "pt": "acostumado",
        "ex": "He became accustomed to city life."
      },
      {
        "en": "to adapt",
        "pt": "se adaptar",
        "ex": "It took her a while to adapt."
      },
      {
        "en": "process",
        "pt": "processo",
        "ex": "Adapting is a gradual process."
      },
      {
        "en": "comfortable with",
        "pt": "confortável com",
        "ex": "I'm comfortable with the new schedule now."
      },
      {
        "en": "strange at first",
        "pt": "estranho no início",
        "ex": "It felt strange at first, but now it's normal."
      },
      {
        "en": "normal now",
        "pt": "normal agora",
        "ex": "Waking up early feels normal now."
      },
      {
        "en": "it took me a while",
        "pt": "demorou um pouco para mim",
        "ex": "It took me a while to get used to the traffic."
      },
      {
        "en": "to avoid",
        "pt": "evitar",
        "ex": "I avoid eating late at night."
      },
      {
        "en": "childhood",
        "pt": "infância",
        "ex": "I used to play outside in my childhood."
      },
      {
        "en": "to climb",
        "pt": "escalar / subir",
        "ex": "We would climb the tree behind the house."
      },
      {
        "en": "still adjusting",
        "pt": "ainda se ajustando",
        "ex": "I'm still adjusting to the new job."
      },
      {
        "en": "adjust to",
        "pt": "ajustar-se a",
        "ex": "We had to adjust to the time difference."
      },
      {
        "en": "every summer",
        "pt": "todo verão",
        "ex": "Every summer, we would go camping."
      },
      {
        "en": "whenever",
        "pt": "sempre que",
        "ex": "Whenever it rained, we would stay inside."
      },
      {
        "en": "used to it",
        "pt": "acostumado com isso",
        "ex": "I'm used to it by now."
      },
      {
        "en": "new routine",
        "pt": "nova rotina",
        "ex": "I'm getting used to my new routine."
      },
      {
        "en": "gradually",
        "pt": "gradualmente",
        "ex": "I gradually got used to the noise."
      },
      {
        "en": "surroundings",
        "pt": "arredores",
        "ex": "It took time to get used to my new surroundings."
      },
      {
        "en": "to feel at home",
        "pt": "se sentir em casa",
        "ex": "I finally feel at home in this city."
      },
      {
        "en": "familiar",
        "pt": "familiar",
        "ex": "This place feels familiar now."
      },
      {
        "en": "unfamiliar",
        "pt": "desconhecido",
        "ex": "Everything felt unfamiliar at first."
      },
      {
        "en": "to settle in",
        "pt": "se estabelecer, se adaptar",
        "ex": "It took months to settle in."
      },
      {
        "en": "jet lag",
        "pt": "jet lag (fuso horário)",
        "ex": "I'm still getting used to the jet lag."
      },
      {
        "en": "climate",
        "pt": "clima",
        "ex": "I'm getting used to the cold climate here."
      },
      {
        "en": "schedule",
        "pt": "horário, agenda",
        "ex": "I'm used to a busy schedule now."
      },
      {
        "en": "to get accustomed to",
        "pt": "se acostumar com",
        "ex": "She got accustomed to working from home."
      }
    ],
    "expressions": [
      {
        "expr": "I'm used to it",
        "meaning": "Estou acostumado(a) com isso",
        "example": "Don't worry, I'm used to it."
      },
      {
        "expr": "I'm getting used to...",
        "meaning": "Estou me acostumando com...",
        "example": "I'm getting used to the new job."
      },
      {
        "expr": "It took me a while to...",
        "meaning": "Demorou um pouco para eu...",
        "example": "It took me a while to get used to driving here."
      },
      {
        "expr": "Whenever...",
        "meaning": "Sempre que...",
        "example": "Whenever we visited, she would bake a cake."
      }
    ],
    "sentences": [
      "Every summer, we would visit our grandparents in the countryside.",
      "Whenever it rained, we would stay inside and play games.",
      "I'm still getting used to my new schedule.",
      "He is used to working long hours now.",
      "It took me a while to get used to the traffic here.",
      "My grandmother would cook a huge meal every Sunday.",
      "She is finally used to living alone.",
      "We would walk to school together every morning."
    ],
    "grammar": {
      "title": "Would (hábitos) vs Be/Get Used To",
      "rules": [
        "WOULD substitui 'used to' para AÇÕES repetidas no passado: Every summer, we would visit grandma.",
        "WOULD não funciona com ESTADOS (be, have, like, know): use 'used to' para esses casos.",
        "BE USED TO + substantivo/gerúndio = estar acostumado (situação já normal): I am used to the noise.",
        "GET USED TO + substantivo/gerúndio = processo de se acostumar (ainda se adaptando): I'm getting used to the noise."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Significado",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "would + verbo",
            "hábito repetido (só ações)",
            "We would visit grandma every summer.",
            "Não usar com estados"
          ],
          [
            "used to + verbo",
            "hábito/estado passado",
            "I used to live there.",
            "Funciona com ações e estados"
          ],
          [
            "be used to + -ing",
            "acostumado (presente)",
            "I am used to waking up early.",
            "Situação já normal"
          ],
          [
            "get used to + -ing",
            "se acostumando (processo)",
            "I'm getting used to the cold.",
            "Ainda se adaptando"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Every summer, we ___ (would) visit our grandparents.",
        "a": "would",
        "opts": [
          "would",
          "use to",
          "used",
          "get used to"
        ]
      },
      {
        "q": "I am finally ___ (be used to) living alone.",
        "a": "used to",
        "opts": [
          "used to",
          "use to",
          "would",
          "using to"
        ]
      },
      {
        "q": "It took me months to ___ (get used to) the cold climate.",
        "a": "get used to",
        "opts": [
          "get used to",
          "getting used",
          "use to",
          "used"
        ]
      },
      {
        "q": "❌ 'I would have a dog.' is wrong because 'have' is a ___.",
        "a": "state",
        "opts": [
          "state",
          "action",
          "habit",
          "gerund"
        ]
      },
      {
        "q": "She is still ___ (get used to) her new job.",
        "a": "getting used to",
        "opts": [
          "getting used to",
          "get used to",
          "used to",
          "use to"
        ]
      }
    ],
    "speak": [
      "Every summer, we would visit our grandparents in the countryside.",
      "Whenever it rained, we would stay inside and play games.",
      "I'm still getting used to my new schedule.",
      "He is used to working long hours now.",
      "It took me a while to get used to the traffic here."
    ]
  },
  {
    "id": 433,
    "title": "I Wish... (Present Wishes)",
    "emoji": "🌠",
    "verbs": [
      "To Wish",
      "To Know",
      "To Live",
      "To Be"
    ],
    "vocab": [
      {
        "en": "to wish",
        "pt": "desejar",
        "ex": "I wish I had more free time."
      },
      {
        "en": "to be fluent",
        "pt": "ser fluente",
        "ex": "I wish I were fluent in English."
      },
      {
        "en": "dissatisfaction",
        "pt": "insatisfação",
        "ex": "Wish expresses dissatisfaction with the present."
      },
      {
        "en": "were (subjunctive)",
        "pt": "fosse/estivesse",
        "ex": "I wish I were taller."
      },
      {
        "en": "present wish",
        "pt": "desejo presente",
        "ex": "This is a present wish, not about the past."
      },
      {
        "en": "impossible desire",
        "pt": "desejo impossível",
        "ex": "Wishing to fly is an impossible desire."
      },
      {
        "en": "unlikely",
        "pt": "improvável",
        "ex": "It's unlikely, but I wish it would happen."
      },
      {
        "en": "to have more time",
        "pt": "ter mais tempo",
        "ex": "I wish I had more time to study."
      },
      {
        "en": "to know",
        "pt": "saber",
        "ex": "I wish I knew the answer."
      },
      {
        "en": "to live",
        "pt": "morar, viver",
        "ex": "She wishes she lived closer to her family."
      },
      {
        "en": "to speak fluently",
        "pt": "falar fluentemente",
        "ex": "I wish I spoke English fluently."
      },
      {
        "en": "money",
        "pt": "dinheiro",
        "ex": "I wish I had more money to travel."
      },
      {
        "en": "rich",
        "pt": "rico",
        "ex": "I wish I were rich."
      },
      {
        "en": "brave",
        "pt": "corajoso",
        "ex": "I wish I were braver."
      },
      {
        "en": "patient",
        "pt": "paciente",
        "ex": "I wish I were more patient."
      },
      {
        "en": "situation",
        "pt": "situação",
        "ex": "I wish the situation were different."
      },
      {
        "en": "reality",
        "pt": "realidade",
        "ex": "The reality is quite different from what I wish."
      },
      {
        "en": "dream",
        "pt": "sonho",
        "ex": "It's my dream, and I wish it were true."
      },
      {
        "en": "currently",
        "pt": "atualmente",
        "ex": "I currently live far away, but I wish I didn't."
      },
      {
        "en": "present",
        "pt": "presente",
        "ex": "Wish + past talks about the present."
      },
      {
        "en": "subjunctive",
        "pt": "subjuntivo",
        "ex": "'Were' is the subjunctive form of 'be'."
      },
      {
        "en": "formal English",
        "pt": "inglês formal",
        "ex": "'I wish I were' is correct formal English."
      },
      {
        "en": "casual speech",
        "pt": "fala informal",
        "ex": "In casual speech, people often say 'I wish I was'."
      },
      {
        "en": "honestly",
        "pt": "sinceramente",
        "ex": "Honestly, I wish I had chosen differently."
      },
      {
        "en": "to feel",
        "pt": "sentir",
        "ex": "I wish I felt more confident."
      },
      {
        "en": "confident",
        "pt": "confiante",
        "ex": "I wish I were more confident at work."
      },
      {
        "en": "free time",
        "pt": "tempo livre",
        "ex": "I wish I had more free time."
      },
      {
        "en": "closer",
        "pt": "mais perto",
        "ex": "I wish I lived closer to the beach."
      },
      {
        "en": "fluent",
        "pt": "fluente",
        "ex": "I wish I were fluent in Spanish."
      },
      {
        "en": "talent",
        "pt": "talento",
        "ex": "I wish I had more talent for music."
      }
    ],
    "expressions": [
      {
        "expr": "I wish I were...",
        "meaning": "Eu queria ser/estar...",
        "example": "I wish I were on vacation right now."
      },
      {
        "expr": "I wish I had...",
        "meaning": "Eu queria ter...",
        "example": "I wish I had more patience."
      },
      {
        "expr": "I wish I knew...",
        "meaning": "Eu queria saber...",
        "example": "I wish I knew what to do."
      },
      {
        "expr": "If only...",
        "meaning": "Se ao menos...",
        "example": "If only I had more time!"
      }
    ],
    "sentences": [
      "I wish I had more free time to relax.",
      "She wishes she lived closer to her family.",
      "I wish I were braver in difficult situations.",
      "He wishes he spoke English more fluently.",
      "I wish I knew the answer to that question.",
      "We wish we had more money to travel.",
      "I wish I were more patient with my students.",
      "They wish they lived in a bigger house."
    ],
    "grammar": {
      "title": "Wish + Past Simple: Desejos no Presente",
      "rules": [
        "Para desejar que uma situação PRESENTE fosse diferente, use WISH + PASSADO SIMPLES: I wish I knew the answer.",
        "Com o verbo 'be', use WERE para todos os sujeitos (subjuntivo): I wish I were rich. / She wishes she were here.",
        "A estrutura expressa algo que NÃO é verdade agora — insatisfação com o presente.",
        "Na fala informal, 'was' às vezes substitui 'were', mas 'were' é a forma correta."
      ],
      "table": {
        "headers": [
          "Sujeito",
          "Wish + passado",
          "Exemplo",
          "Significado"
        ],
        "rows": [
          [
            "I",
            "wish + past simple",
            "I wish I had more time.",
            "Eu queria ter mais tempo (mas não tenho)"
          ],
          [
            "She/He",
            "wishes + past simple",
            "She wishes she lived nearby.",
            "Ela queria morar perto (mas não mora)"
          ],
          [
            "I/He/She (be)",
            "wish(es) + were",
            "I wish I were taller.",
            "Eu queria ser mais alto (mas não sou)"
          ],
          [
            "We/They",
            "wish + past simple",
            "We wish we knew more.",
            "Queríamos saber mais (mas não sabemos)"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I wish I ___ (have) more free time.",
        "a": "had",
        "opts": [
          "had",
          "have",
          "having",
          "has"
        ]
      },
      {
        "q": "She wishes she ___ (live) closer to her family.",
        "a": "lived",
        "opts": [
          "lived",
          "lives",
          "living",
          "live"
        ]
      },
      {
        "q": "I wish I ___ (be) taller.",
        "a": "were",
        "opts": [
          "were",
          "was",
          "am",
          "be"
        ]
      },
      {
        "q": "He wishes he ___ (speak) English fluently.",
        "a": "spoke",
        "opts": [
          "spoke",
          "speaks",
          "speaking",
          "spoken"
        ]
      },
      {
        "q": "We wish we ___ (know) the answer.",
        "a": "knew",
        "opts": [
          "knew",
          "know",
          "known",
          "knowing"
        ]
      }
    ],
    "speak": [
      "I wish I had more free time to relax.",
      "She wishes she lived closer to her family.",
      "I wish I were braver in difficult situations.",
      "I wish I knew the answer to that question.",
      "We wish we had more money to travel."
    ]
  },
  {
    "id": 434,
    "title": "Wishes, Regrets & Complaints",
    "emoji": "😔",
    "verbs": [
      "To Study",
      "To Say",
      "To Take",
      "To Stop"
    ],
    "vocab": [
      {
        "en": "regret",
        "pt": "arrependimento",
        "ex": "She has no regrets about her decision."
      },
      {
        "en": "to regret",
        "pt": "se arrepender",
        "ex": "I regret not studying harder."
      },
      {
        "en": "to turn down",
        "pt": "recusar",
        "ex": "I wish I had not turned down the offer."
      },
      {
        "en": "if only",
        "pt": "se ao menos",
        "ex": "If only I had known!"
      },
      {
        "en": "to take the job",
        "pt": "aceitar o emprego",
        "ex": "She wishes she had taken the job."
      },
      {
        "en": "to say something",
        "pt": "dizer algo",
        "ex": "I wish I hadn't said that."
      },
      {
        "en": "stubborn",
        "pt": "teimoso",
        "ex": "If only I hadn't been so stubborn."
      },
      {
        "en": "complaint",
        "pt": "reclamação",
        "ex": "This is a common complaint about neighbors."
      },
      {
        "en": "to interrupt",
        "pt": "interromper",
        "ex": "I wish you would stop interrupting me."
      },
      {
        "en": "annoying",
        "pt": "irritante",
        "ex": "His habit is really annoying."
      },
      {
        "en": "behaviour",
        "pt": "comportamento",
        "ex": "Wish + would complains about someone's behaviour."
      },
      {
        "en": "to turn down (volume)",
        "pt": "abaixar (o volume)",
        "ex": "I wish my neighbour would turn down the music."
      },
      {
        "en": "to stop (someone) doing",
        "pt": "parar de fazer",
        "ex": "I wish it would stop raining."
      },
      {
        "en": "neighbour",
        "pt": "vizinho",
        "ex": "My neighbour is very noisy."
      },
      {
        "en": "rain",
        "pt": "chuva",
        "ex": "I wish it would stop raining."
      },
      {
        "en": "irritation",
        "pt": "irritação",
        "ex": "Wish + would expresses irritation."
      },
      {
        "en": "unchangeable",
        "pt": "inalterável",
        "ex": "The past is unchangeable, but we can still regret it."
      },
      {
        "en": "deep regret",
        "pt": "arrependimento profundo",
        "ex": "He felt deep regret about the missed opportunity."
      },
      {
        "en": "mistake",
        "pt": "erro",
        "ex": "I wish I hadn't made that mistake."
      },
      {
        "en": "opportunity",
        "pt": "oportunidade",
        "ex": "I wish I had taken that opportunity."
      },
      {
        "en": "to apologize",
        "pt": "se desculpar",
        "ex": "I wish I had apologized sooner."
      },
      {
        "en": "to waste",
        "pt": "desperdiçar",
        "ex": "I wish I had not wasted so much time."
      },
      {
        "en": "missed chance",
        "pt": "chance perdida",
        "ex": "It was a missed chance I still think about."
      },
      {
        "en": "hindsight",
        "pt": "retrospecto",
        "ex": "In hindsight, I wish I had chosen differently."
      },
      {
        "en": "sooner",
        "pt": "mais cedo",
        "ex": "I wish I had started sooner."
      },
      {
        "en": "harder",
        "pt": "mais difícil, com mais empenho",
        "ex": "I wish I had studied harder."
      },
      {
        "en": "differently",
        "pt": "diferente(mente)",
        "ex": "I would have done it differently."
      },
      {
        "en": "to change (the past)",
        "pt": "mudar (o passado)",
        "ex": "You can't change the past, but you can learn from it."
      },
      {
        "en": "loud",
        "pt": "barulhento",
        "ex": "I wish he wouldn't be so loud."
      },
      {
        "en": "patience",
        "pt": "paciência",
        "ex": "I wish people had more patience."
      }
    ],
    "expressions": [
      {
        "expr": "I wish I had... (regret)",
        "meaning": "Eu queria ter... (arrependimento)",
        "example": "I wish I had studied harder for the exam."
      },
      {
        "expr": "If only...",
        "meaning": "Se ao menos...",
        "example": "If only I hadn't said that."
      },
      {
        "expr": "I wish you would...",
        "meaning": "Eu queria que você...",
        "example": "I wish you would stop interrupting me."
      },
      {
        "expr": "In hindsight...",
        "meaning": "Em retrospecto...",
        "example": "In hindsight, I wish I had taken the job."
      }
    ],
    "sentences": [
      "I wish I had studied harder for the exam.",
      "If only I hadn't said that to her.",
      "She wishes she had taken the job when she had the chance.",
      "I wish you would stop interrupting me.",
      "I wish it would stop raining.",
      "He wishes he hadn't been so stubborn.",
      "I wish my neighbour would turn down the music.",
      "In hindsight, I wish I had apologized sooner."
    ],
    "grammar": {
      "title": "Wish + Past Perfect (arrependimentos) & Wish + Would (reclamações)",
      "rules": [
        "Para arrependimento sobre o PASSADO, use WISH + PAST PERFECT (had + particípio): I wish I had studied harder.",
        "'If only' funciona igual a 'wish', mas é mais enfático: If only I had known!",
        "Para reclamar do comportamento de OUTRA pessoa ou situação, use WISH + WOULD: I wish you would stop interrupting me.",
        "Não use WISH + WOULD para si mesmo: ❌ I wish I would be taller → ✅ I wish I were taller."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Uso",
          "Exemplo",
          "Foco"
        ],
        "rows": [
          [
            "wish + had + particípio",
            "arrependimento do passado",
            "I wish I had studied harder.",
            "Passado"
          ],
          [
            "if only + had + particípio",
            "arrependimento (enfático)",
            "If only I hadn't said that!",
            "Passado"
          ],
          [
            "wish + would + verbo",
            "reclamação sobre outros",
            "I wish you would stop interrupting.",
            "Comportamento alheio"
          ],
          [
            "wish + past simples",
            "desejo sobre si mesmo",
            "I wish I were taller.",
            "Presente (não seu comportamento)"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I wish I ___ (study) harder for the exam.",
        "a": "had studied",
        "opts": [
          "had studied",
          "studied",
          "have studied",
          "study"
        ]
      },
      {
        "q": "If only I ___ (not/say) that to her!",
        "a": "hadn't said",
        "opts": [
          "hadn't said",
          "didn't say",
          "haven't said",
          "not said"
        ]
      },
      {
        "q": "I wish you ___ (stop) interrupting me.",
        "a": "would stop",
        "opts": [
          "would stop",
          "stopped",
          "stop",
          "will stop"
        ]
      },
      {
        "q": "She wishes she ___ (take) the job when she had the chance.",
        "a": "had taken",
        "opts": [
          "had taken",
          "took",
          "would take",
          "takes"
        ]
      },
      {
        "q": "❌ I wish I would be taller → ✅ I wish I ___ taller.",
        "a": "were",
        "opts": [
          "were",
          "would be",
          "had been",
          "am"
        ]
      }
    ],
    "speak": [
      "I wish I had studied harder for the exam.",
      "If only I hadn't said that to her.",
      "I wish you would stop interrupting me.",
      "I wish it would stop raining.",
      "In hindsight, I wish I had apologized sooner."
    ]
  },
  {
    "id": 435,
    "title": "Question Tags: The Mirror Rule",
    "emoji": "🪞",
    "verbs": [
      "To Be",
      "To Have",
      "To Can",
      "To Like"
    ],
    "vocab": [
      {
        "en": "to be honest",
        "pt": "pra ser sincero",
        "ex": "To be honest, it is not easy, is it?"
      },
      {
        "en": "mirror rule",
        "pt": "regra do espelho",
        "ex": "Question tags follow the mirror rule."
      },
      {
        "en": "positive statement",
        "pt": "afirmação positiva",
        "ex": "A positive statement takes a negative tag."
      },
      {
        "en": "negative statement",
        "pt": "afirmação negativa",
        "ex": "A negative statement takes a positive tag."
      },
      {
        "en": "exhausting",
        "pt": "exaustivo",
        "ex": "This week has been exhausting, hasn't it?"
      },
      {
        "en": "to get along",
        "pt": "se dar bem",
        "ex": "You get along with your boss, don't you?"
      },
      {
        "en": "to be into",
        "pt": "curtir",
        "ex": "You are into football, aren't you?"
      },
      {
        "en": "to confirm",
        "pt": "confirmar",
        "ex": "We use tags to confirm information."
      },
      {
        "en": "isn't it?",
        "pt": "não é?",
        "ex": "It's cold today, isn't it?"
      },
      {
        "en": "aren't you?",
        "pt": "você não é/está?",
        "ex": "You're tired, aren't you?"
      },
      {
        "en": "don't you?",
        "pt": "você não?",
        "ex": "You like pizza, don't you?"
      },
      {
        "en": "doesn't she?",
        "pt": "ela não?",
        "ex": "She works here, doesn't she?"
      },
      {
        "en": "didn't he?",
        "pt": "ele não?",
        "ex": "He went home, didn't he?"
      },
      {
        "en": "can't you?",
        "pt": "você não consegue?",
        "ex": "You can swim, can't you?"
      },
      {
        "en": "hasn't she?",
        "pt": "ela não tem?",
        "ex": "She has finished, hasn't she?"
      },
      {
        "en": "haven't they?",
        "pt": "eles não têm?",
        "ex": "They haven't left, have they?"
      },
      {
        "en": "to agree",
        "pt": "concordar",
        "ex": "I want you to agree with me."
      },
      {
        "en": "to check information",
        "pt": "verificar informação",
        "ex": "We use tags to check information."
      },
      {
        "en": "to give up",
        "pt": "desistir de",
        "ex": "He gave up smoking last year."
      },
      {
        "en": "to make sense",
        "pt": "fazer sentido",
        "ex": "That makes sense, doesn't it?"
      },
      {
        "en": "present simple",
        "pt": "presente simples",
        "ex": "In present simple, use do/does for the tag."
      },
      {
        "en": "at least",
        "pt": "pelo menos",
        "ex": "At least it is Friday, right?"
      },
      {
        "en": "pretty",
        "pt": "bem / bastante",
        "ex": "It is pretty cold today, isn't it?"
      },
      {
        "en": "to be sure",
        "pt": "ter certeza",
        "ex": "I'm not sure, so I use a question tag."
      },
      {
        "en": "small talk",
        "pt": "conversa fiada",
        "ex": "Question tags are common in small talk."
      },
      {
        "en": "right?",
        "pt": "não é? (informal)",
        "ex": "It's a nice day, right?"
      },
      {
        "en": "correct?",
        "pt": "correto?",
        "ex": "You finished the report, correct?"
      },
      {
        "en": "friendly",
        "pt": "amigável",
        "ex": "Question tags sound friendly and natural."
      },
      {
        "en": "natural speech",
        "pt": "fala natural",
        "ex": "Question tags make your English sound more natural."
      },
      {
        "en": "to double-check",
        "pt": "conferir",
        "ex": "I asked again just to double-check."
      }
    ],
    "expressions": [
      {
        "expr": "..., isn't it?",
        "meaning": "..., não é?",
        "example": "It's a beautiful day, isn't it?"
      },
      {
        "expr": "..., don't you?",
        "meaning": "..., você não?",
        "example": "You love coffee, don't you?"
      },
      {
        "expr": "..., aren't you?",
        "meaning": "..., você não está?",
        "example": "You're new here, aren't you?"
      },
      {
        "expr": "..., can't you?",
        "meaning": "..., você não consegue?",
        "example": "You can drive, can't you?"
      }
    ],
    "sentences": [
      "It's a beautiful day, isn't it?",
      "You're new here, aren't you?",
      "She works at the hospital, doesn't she?",
      "He went to the party, didn't he?",
      "You can speak Spanish, can't you?",
      "They have finished the project, haven't they?",
      "You like coffee, don't you?",
      "We are late, aren't we?"
    ],
    "grammar": {
      "title": "Question Tags: A Regra do Espelho",
      "rules": [
        "Afirmação POSITIVA pede tag NEGATIVA: You're happy, aren't you?",
        "Afirmação NEGATIVA pede tag POSITIVA: You aren't happy, are you?",
        "A tag usa o MESMO verbo auxiliar da frase: You can swim, can't you? / She has left, hasn't she?",
        "Sem auxiliar (presente/passado simples), use DO/DOES/DID: You like it, don't you? / He went, didn't he?"
      ],
      "table": {
        "headers": [
          "Frase principal",
          "Tag",
          "Exemplo completo",
          "Regra"
        ],
        "rows": [
          [
            "Positiva (be)",
            "negativa",
            "You're happy, aren't you?",
            "Espelha o verbo be"
          ],
          [
            "Negativa (be)",
            "positiva",
            "You aren't happy, are you?",
            "Espelha o verbo be"
          ],
          [
            "Presente simples",
            "do/does + not",
            "You like it, don't you?",
            "Sem auxiliar, usa do/does"
          ],
          [
            "Passado simples",
            "did + not",
            "He went, didn't he?",
            "Sem auxiliar, usa did"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "You're happy, ___ you?",
        "a": "aren't",
        "opts": [
          "aren't",
          "isn't",
          "don't",
          "weren't"
        ]
      },
      {
        "q": "She works here, ___ she?",
        "a": "doesn't",
        "opts": [
          "doesn't",
          "isn't",
          "hasn't",
          "won't"
        ]
      },
      {
        "q": "He went home, ___ he?",
        "a": "didn't",
        "opts": [
          "didn't",
          "doesn't",
          "wasn't",
          "hasn't"
        ]
      },
      {
        "q": "You can swim, ___ you?",
        "a": "can't",
        "opts": [
          "can't",
          "don't",
          "won't",
          "aren't"
        ]
      },
      {
        "q": "They haven't left, ___ they?",
        "a": "have",
        "opts": [
          "have",
          "haven't",
          "did",
          "don't"
        ]
      }
    ],
    "speak": [
      "It's a beautiful day, isn't it?",
      "You're new here, aren't you?",
      "She works at the hospital, doesn't she?",
      "You can speak Spanish, can't you?",
      "They have finished the project, haven't they?"
    ]
  },
  {
    "id": 436,
    "title": "Question Tags: Tricky Cases & Tone",
    "emoji": "🎭",
    "verbs": [
      "To Help",
      "To Close",
      "To Let",
      "To Lock"
    ],
    "vocab": [
      {
        "en": "special case",
        "pt": "caso especial",
        "ex": "'I am' is a special case for tags."
      },
      {
        "en": "aren't I?",
        "pt": "eu não sou/estou?",
        "ex": "I'm right, aren't I?"
      },
      {
        "en": "shall we?",
        "pt": "vamos?",
        "ex": "Let's go, shall we?"
      },
      {
        "en": "imperative",
        "pt": "imperativo",
        "ex": "Imperatives use 'will you?' as a tag."
      },
      {
        "en": "will you?",
        "pt": "você pode?",
        "ex": "Close the door, will you?"
      },
      {
        "en": "won't you?",
        "pt": "você não vai/pode?",
        "ex": "Help me, won't you?"
      },
      {
        "en": "negative word",
        "pt": "palavra negativa",
        "ex": "'Never' is a negative word that changes the tag."
      },
      {
        "en": "never",
        "pt": "nunca",
        "ex": "You never call, do you?"
      },
      {
        "en": "nobody",
        "pt": "ninguém",
        "ex": "Nobody came, did they?"
      },
      {
        "en": "hardly",
        "pt": "quase não",
        "ex": "You hardly ever smile, do you?"
      },
      {
        "en": "there is/are",
        "pt": "há",
        "ex": "There's a problem, isn't there?"
      },
      {
        "en": "intonation",
        "pt": "entonação",
        "ex": "Intonation changes the meaning of the tag."
      },
      {
        "en": "rising intonation",
        "pt": "entonação ascendente",
        "ex": "Rising intonation shows a real question."
      },
      {
        "en": "falling intonation",
        "pt": "entonação descendente",
        "ex": "Falling intonation shows you expect agreement."
      },
      {
        "en": "genuine question",
        "pt": "pergunta genuína",
        "ex": "With rising intonation, it's a genuine question."
      },
      {
        "en": "seeking agreement",
        "pt": "buscando concordância",
        "ex": "Falling intonation is about seeking agreement."
      },
      {
        "en": "social glue",
        "pt": "cola social",
        "ex": "Question tags work as social glue in conversation."
      },
      {
        "en": "to lock the door",
        "pt": "trancar a porta",
        "ex": "You locked the door, didn't you?"
      },
      {
        "en": "lovely weather",
        "pt": "tempo agradável",
        "ex": "Lovely weather, isn't it?"
      },
      {
        "en": "exception",
        "pt": "exceção",
        "ex": "'I am' is an exception to the normal rule."
      },
      {
        "en": "request",
        "pt": "pedido",
        "ex": "Close the window, will you? (a polite request)"
      },
      {
        "en": "polite",
        "pt": "educado",
        "ex": "Question tags can sound polite."
      },
      {
        "en": "command",
        "pt": "ordem",
        "ex": "An imperative is a command, like 'Sit down.'"
      },
      {
        "en": "to expect",
        "pt": "esperar (algo)",
        "ex": "I expect you to agree with me."
      },
      {
        "en": "tone of voice",
        "pt": "tom de voz",
        "ex": "The tone of voice matters a lot here."
      },
      {
        "en": "context",
        "pt": "contexto",
        "ex": "Context tells you if it's a real question."
      },
      {
        "en": "everyone",
        "pt": "todo mundo",
        "ex": "Everyone left early, didn't they?"
      },
      {
        "en": "someone",
        "pt": "alguém",
        "ex": "Someone called, didn't they?"
      },
      {
        "en": "casual conversation",
        "pt": "conversa casual",
        "ex": "Most tags in casual conversation just confirm."
      },
      {
        "en": "genuinely unsure",
        "pt": "genuinamente inseguro",
        "ex": "She sounded genuinely unsure when she asked."
      }
    ],
    "expressions": [
      {
        "expr": "..., aren't I?",
        "meaning": "..., eu não sou/estou?",
        "example": "I'm right, aren't I?"
      },
      {
        "expr": "Let's..., shall we?",
        "meaning": "Vamos..., né?",
        "example": "Let's start, shall we?"
      },
      {
        "expr": "..., will you?",
        "meaning": "..., pode ser?",
        "example": "Close the door, will you?"
      },
      {
        "expr": "Nobody..., did they?",
        "meaning": "Ninguém..., né?",
        "example": "Nobody noticed, did they?"
      }
    ],
    "sentences": [
      "I'm right, aren't I?",
      "Let's go, shall we?",
      "Close the door, will you?",
      "Help me with this, won't you?",
      "You never call your mother, do you?",
      "Nobody came to the meeting, did they?",
      "There's a problem with the printer, isn't there?",
      "Lovely weather today, isn't it?"
    ],
    "grammar": {
      "title": "Question Tags: Casos Especiais e Entonação",
      "rules": [
        "'I AM' forma a tag 'aren't I?': I'm right, aren't I?",
        "'LET'S' forma a tag 'shall we?': Let's go, shall we?",
        "IMPERATIVOS usam 'will you?' ou 'won't you?': Close the door, will you?",
        "Palavras negativas (never, nobody, hardly) contam como negativas → tag positiva: You never call, do you?",
        "ENTONAÇÃO ascendente ↗ = pergunta real; descendente ↘ = busca concordância."
      ],
      "table": {
        "headers": [
          "Caso especial",
          "Tag correta",
          "Exemplo",
          "Observação"
        ],
        "rows": [
          [
            "I am",
            "aren't I?",
            "I'm right, aren't I?",
            "Nunca 'amn't I'"
          ],
          [
            "Let's",
            "shall we?",
            "Let's go, shall we?",
            "Fixo, não muda"
          ],
          [
            "Imperativo",
            "will you? / won't you?",
            "Close the door, will you?",
            "Pedido educado"
          ],
          [
            "Palavra negativa",
            "tag positiva",
            "You never call, do you?",
            "Never/nobody = negativo"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I'm right, ___ I?",
        "a": "aren't",
        "opts": [
          "aren't",
          "amn't",
          "isn't",
          "don't"
        ]
      },
      {
        "q": "Let's go, ___ we?",
        "a": "shall",
        "opts": [
          "shall",
          "will",
          "don't",
          "aren't"
        ]
      },
      {
        "q": "Close the door, ___ you?",
        "a": "will",
        "opts": [
          "will",
          "do",
          "are",
          "won't"
        ]
      },
      {
        "q": "You never call your mother, ___ you?",
        "a": "do",
        "opts": [
          "do",
          "don't",
          "are",
          "aren't"
        ]
      },
      {
        "q": "There's a problem, ___ there?",
        "a": "isn't",
        "opts": [
          "isn't",
          "aren't",
          "doesn't",
          "hasn't"
        ]
      }
    ],
    "speak": [
      "I'm right, aren't I?",
      "Let's go, shall we?",
      "Close the door, will you?",
      "You never call your mother, do you?",
      "There's a problem with the printer, isn't there?"
    ]
  },
  {
    "id": 437,
    "title": "Will vs Going To",
    "emoji": "🔮",
    "verbs": [
      "To Rain",
      "To Answer",
      "To Help",
      "To Finish"
    ],
    "vocab": [
      {
        "en": "prediction",
        "pt": "previsão",
        "ex": "I think it will rain tomorrow."
      },
      {
        "en": "spontaneous decision",
        "pt": "decisão espontânea",
        "ex": "I'll answer the phone — that's a spontaneous decision."
      },
      {
        "en": "promise",
        "pt": "promessa",
        "ex": "I will help you, I promise."
      },
      {
        "en": "plan",
        "pt": "plano",
        "ex": "I'm going to visit my parents this weekend."
      },
      {
        "en": "intention",
        "pt": "intenção",
        "ex": "It's just an intention, not a fixed plan."
      },
      {
        "en": "evidence",
        "pt": "evidência",
        "ex": "Look at those clouds — it's going to rain."
      },
      {
        "en": "decided before speaking",
        "pt": "decidido antes de falar",
        "ex": "Going to shows something decided before speaking."
      },
      {
        "en": "decided now",
        "pt": "decidido agora",
        "ex": "Will shows something decided right now."
      },
      {
        "en": "offer",
        "pt": "oferta",
        "ex": "I'll carry your bags for you."
      },
      {
        "en": "to think (opinion)",
        "pt": "achar, pensar",
        "ex": "I think it will be a great trip."
      },
      {
        "en": "probably",
        "pt": "provavelmente",
        "ex": "It will probably rain later."
      },
      {
        "en": "definitely",
        "pt": "definitivamente",
        "ex": "I'm definitely going to finish this today."
      },
      {
        "en": "clouds",
        "pt": "nuvens",
        "ex": "Look at those dark clouds!"
      },
      {
        "en": "sign",
        "pt": "sinal",
        "ex": "That's a clear sign it's going to rain."
      },
      {
        "en": "to visit",
        "pt": "visitar",
        "ex": "I'm going to visit my grandmother next week."
      },
      {
        "en": "phone is ringing",
        "pt": "telefone está tocando",
        "ex": "The phone is ringing — I'll get it!"
      },
      {
        "en": "weather forecast",
        "pt": "previsão do tempo",
        "ex": "The weather forecast says it will be sunny."
      },
      {
        "en": "to promise",
        "pt": "prometer",
        "ex": "I promise I will call you tonight."
      },
      {
        "en": "don't worry",
        "pt": "não se preocupe",
        "ex": "Don't worry, I will help you with this."
      },
      {
        "en": "opinion",
        "pt": "opinião",
        "ex": "In my opinion, the team will win."
      },
      {
        "en": "general prediction",
        "pt": "previsão geral",
        "ex": "This is a general prediction about the future."
      },
      {
        "en": "already decided",
        "pt": "já decidido",
        "ex": "I've already decided — I'm going to quit my job."
      },
      {
        "en": "clear evidence",
        "pt": "evidência clara",
        "ex": "There's clear evidence it's going to happen."
      },
      {
        "en": "spontaneously",
        "pt": "espontaneamente",
        "ex": "He spontaneously decided to help."
      },
      {
        "en": "right now",
        "pt": "agora mesmo",
        "ex": "I've decided right now — I'll do it."
      },
      {
        "en": "beforehand",
        "pt": "antes, com antecedência",
        "ex": "She planned it beforehand."
      },
      {
        "en": "to expect",
        "pt": "esperar (algo acontecer)",
        "ex": "I expect it will be busy tomorrow."
      },
      {
        "en": "weekend plans",
        "pt": "planos de fim de semana",
        "ex": "What are your weekend plans?"
      },
      {
        "en": "surely",
        "pt": "certamente",
        "ex": "It will surely rain later today."
      },
      {
        "en": "about to",
        "pt": "prestes a",
        "ex": "She is about to leave — she's going to miss the bus!"
      }
    ],
    "expressions": [
      {
        "expr": "I think it will...",
        "meaning": "Eu acho que vai...",
        "example": "I think it will rain tomorrow."
      },
      {
        "expr": "I'm going to...",
        "meaning": "Eu vou (planejo)...",
        "example": "I'm going to study abroad next year."
      },
      {
        "expr": "I'll... (spontaneous)",
        "meaning": "Eu vou... (decisão na hora)",
        "example": "The phone is ringing — I'll answer it!"
      },
      {
        "expr": "It's going to... (evidence)",
        "meaning": "Vai... (evidência visível)",
        "example": "Look at the sky — it's going to rain."
      }
    ],
    "sentences": [
      "I think it will rain tomorrow afternoon.",
      "The phone is ringing — I'll answer it!",
      "I'm going to visit my parents this weekend.",
      "Look at those clouds — it's going to rain soon.",
      "Don't worry, I will help you with your homework.",
      "I've decided — I'm going to change careers next year.",
      "It will probably be sunny later today.",
      "She is going to study abroad next semester."
    ],
    "grammar": {
      "title": "Will vs Going To: Escolhendo a Forma Certa",
      "rules": [
        "WILL para previsão geral (opinião): I think it will rain tomorrow.",
        "WILL para decisão espontânea (decidida na hora de falar): The phone is ringing — I'll answer it!",
        "WILL para promessas: Don't worry, I will help you.",
        "GOING TO para planos/intenções (decididos ANTES de falar): I'm going to visit my parents.",
        "GOING TO para previsão com evidência visível: Look at those clouds — it's going to rain!"
      ],
      "table": {
        "headers": [
          "Forma",
          "Uso",
          "Exemplo",
          "Sinal"
        ],
        "rows": [
          [
            "will",
            "previsão/opinião",
            "I think it will rain.",
            "Sem prova concreta"
          ],
          [
            "will",
            "decisão espontânea",
            "I'll answer the phone!",
            "Decidido agora"
          ],
          [
            "going to",
            "plano já decidido",
            "I'm going to visit my parents.",
            "Decidido antes"
          ],
          [
            "going to",
            "evidência visível",
            "It's going to rain — look!",
            "Prova na sua frente"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I think it ___ (will) rain tomorrow.",
        "a": "will",
        "opts": [
          "will",
          "is going to",
          "is",
          "would"
        ]
      },
      {
        "q": "The phone is ringing — I ___ (will) answer it!",
        "a": "'ll",
        "opts": [
          "'ll",
          "am going to",
          "would",
          "was going to"
        ]
      },
      {
        "q": "Look at those clouds — it ___ (going to) rain!",
        "a": "is going to",
        "opts": [
          "is going to",
          "will",
          "would",
          "is"
        ]
      },
      {
        "q": "I've already decided — I'm ___ (going to) change jobs.",
        "a": "going to",
        "opts": [
          "going to",
          "will",
          "would",
          "is"
        ]
      },
      {
        "q": "Don't worry, I ___ (promise) help you.",
        "a": "will",
        "opts": [
          "will",
          "am going to",
          "would",
          "was"
        ]
      }
    ],
    "speak": [
      "I think it will rain tomorrow afternoon.",
      "The phone is ringing — I'll answer it!",
      "I'm going to visit my parents this weekend.",
      "Look at those clouds — it's going to rain soon.",
      "I've decided — I'm going to change careers next year."
    ]
  },
  {
    "id": 438,
    "title": "Future Plans, Perfect & Continuous",
    "emoji": "📅",
    "verbs": [
      "To Meet",
      "To Leave",
      "To Fly",
      "To Pay"
    ],
    "vocab": [
      {
        "en": "arrangement",
        "pt": "compromisso marcado",
        "ex": "I have an arrangement with my mentor at 3pm."
      },
      {
        "en": "timetable",
        "pt": "horário fixo",
        "ex": "The train leaves according to the timetable."
      },
      {
        "en": "present continuous (future)",
        "pt": "presente contínuo (futuro)",
        "ex": "I am meeting my mentor at 3pm."
      },
      {
        "en": "present simple (future)",
        "pt": "presente simples (futuro)",
        "ex": "The train leaves at 9:15."
      },
      {
        "en": "booked",
        "pt": "reservado, marcado",
        "ex": "The meeting is already booked."
      },
      {
        "en": "confirmed",
        "pt": "confirmado",
        "ex": "The appointment is confirmed for Friday."
      },
      {
        "en": "departure",
        "pt": "partida",
        "ex": "The flight's departure is at 6am."
      },
      {
        "en": "schedule (n)",
        "pt": "programação, agenda",
        "ex": "Check the schedule for the exact time."
      },
      {
        "en": "future perfect",
        "pt": "futuro perfeito",
        "ex": "By 2030, I will have paid off my house."
      },
      {
        "en": "future continuous",
        "pt": "futuro contínuo",
        "ex": "This time tomorrow, I will be flying to Tokyo."
      },
      {
        "en": "by (time)",
        "pt": "até (um momento)",
        "ex": "By next year, I will have graduated."
      },
      {
        "en": "this time tomorrow",
        "pt": "a esta hora amanhã",
        "ex": "This time tomorrow, I'll be on a plane."
      },
      {
        "en": "in progress",
        "pt": "em andamento",
        "ex": "The action will be in progress at that moment."
      },
      {
        "en": "completed action",
        "pt": "ação concluída",
        "ex": "Future perfect describes a completed action."
      },
      {
        "en": "to pay off",
        "pt": "quitar",
        "ex": "I will have paid off my debt by 2030."
      },
      {
        "en": "to graduate",
        "pt": "se formar",
        "ex": "By June, I will have graduated from university."
      },
      {
        "en": "flight",
        "pt": "voo",
        "ex": "My flight departs at 6am sharp."
      },
      {
        "en": "to depart",
        "pt": "partir",
        "ex": "The train departs from platform 2."
      },
      {
        "en": "official schedule",
        "pt": "horário oficial",
        "ex": "Follow the official schedule for the event."
      },
      {
        "en": "mentor",
        "pt": "mentor",
        "ex": "I am meeting my mentor next Tuesday."
      },
      {
        "en": "appointment",
        "pt": "compromisso",
        "ex": "I have an appointment with the dentist tomorrow."
      },
      {
        "en": "to book",
        "pt": "reservar",
        "ex": "I've booked a table for two at 8pm."
      },
      {
        "en": "course",
        "pt": "curso",
        "ex": "The course starts on the 15th."
      },
      {
        "en": "to start (timetable)",
        "pt": "começar (horário fixo)",
        "ex": "The movie starts at 7 sharp."
      },
      {
        "en": "by next year",
        "pt": "até o ano que vem",
        "ex": "By next year, I will have finished my degree."
      },
      {
        "en": "at this time",
        "pt": "neste momento (futuro)",
        "ex": "At this time next week, I'll be traveling."
      },
      {
        "en": "reserved",
        "pt": "reservado",
        "ex": "The table is reserved for 8pm."
      },
      {
        "en": "definite plan",
        "pt": "plano definido",
        "ex": "It's a definite plan, already confirmed."
      },
      {
        "en": "milestone",
        "pt": "marco",
        "ex": "Graduating is an important milestone."
      },
      {
        "en": "to organize",
        "pt": "organizar",
        "ex": "We already organized everything with the team."
      }
    ],
    "expressions": [
      {
        "expr": "I'm meeting... at...",
        "meaning": "Vou me encontrar com... às...",
        "example": "I'm meeting my mentor at 3pm."
      },
      {
        "expr": "The train leaves at...",
        "meaning": "O trem sai às...",
        "example": "The train leaves at 9:15 sharp."
      },
      {
        "expr": "By [time], I will have...",
        "meaning": "Até [tempo], eu terei...",
        "example": "By 2030, I will have paid off my house."
      },
      {
        "expr": "This time tomorrow, I'll be...",
        "meaning": "A esta hora amanhã, eu estarei...",
        "example": "This time tomorrow, I'll be flying to Tokyo."
      }
    ],
    "sentences": [
      "I am meeting my mentor at 3pm tomorrow.",
      "The train leaves at 9:15, so we can't be late.",
      "My flight departs at 6am, so I need to wake up early.",
      "By 2030, I will have paid off my house.",
      "This time tomorrow, I will be flying to Tokyo.",
      "The course starts on the 15th of next month.",
      "By next year, I will have graduated from university.",
      "We are having dinner with friends this Friday."
    ],
    "grammar": {
      "title": "Compromissos, Horários Fixos, Futuro Perfeito e Contínuo",
      "rules": [
        "PRESENT CONTINUOUS para compromissos já marcados/confirmados: I am meeting my mentor at 3pm.",
        "PRESENT SIMPLE para horários fixos e programações oficiais: The train leaves at 9:15.",
        "FUTURE PERFECT (will have + particípio) para ação concluída antes de um ponto no futuro: By 2030, I will have paid off my house.",
        "FUTURE CONTINUOUS (will be + -ing) para ação em andamento num momento futuro: This time tomorrow, I will be flying to Tokyo."
      ],
      "table": {
        "headers": [
          "Forma",
          "Uso",
          "Exemplo",
          "Palavra-chave"
        ],
        "rows": [
          [
            "Present Continuous",
            "compromisso marcado",
            "I'm meeting him at 3pm.",
            "already arranged"
          ],
          [
            "Present Simple",
            "horário fixo/oficial",
            "The train leaves at 9:15.",
            "timetable"
          ],
          [
            "Future Perfect",
            "concluído antes de X",
            "By 2030, I will have finished.",
            "by + tempo"
          ],
          [
            "Future Continuous",
            "em andamento em X",
            "I will be flying at 6am.",
            "this time / at + hora"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I ___ (meet) my mentor at 3pm tomorrow.",
        "a": "am meeting",
        "opts": [
          "am meeting",
          "will meet",
          "meet",
          "meets"
        ]
      },
      {
        "q": "The train ___ (leave) at 9:15.",
        "a": "leaves",
        "opts": [
          "leaves",
          "is leaving",
          "will leave",
          "left"
        ]
      },
      {
        "q": "By 2030, I ___ (pay off) my house.",
        "a": "will have paid off",
        "opts": [
          "will have paid off",
          "will pay off",
          "am paying off",
          "have paid off"
        ]
      },
      {
        "q": "This time tomorrow, I ___ (fly) to Tokyo.",
        "a": "will be flying",
        "opts": [
          "will be flying",
          "will fly",
          "am flying",
          "fly"
        ]
      },
      {
        "q": "By next year, she ___ (graduate) from university.",
        "a": "will have graduated",
        "opts": [
          "will have graduated",
          "will graduate",
          "is graduating",
          "graduates"
        ]
      }
    ],
    "speak": [
      "I am meeting my mentor at 3pm tomorrow.",
      "The train leaves at 9:15, so we can't be late.",
      "By 2030, I will have paid off my house.",
      "This time tomorrow, I will be flying to Tokyo.",
      "By next year, I will have graduated from university."
    ]
  },
  {
    "id": 439,
    "title": "Reflecting on the Past, Looking to the Future",
    "emoji": "🚀",
    "verbs": [
      "To Change",
      "To Achieve",
      "To Reflect",
      "To Plan"
    ],
    "vocab": [
      {
        "en": "to reflect",
        "pt": "refletir",
        "ex": "It's good to reflect on how far you've come."
      },
      {
        "en": "to look back",
        "pt": "olhar para trás",
        "ex": "When I look back, I see how much I've grown."
      },
      {
        "en": "turning point",
        "pt": "ponto de virada",
        "ex": "That was the turning point in my career."
      },
      {
        "en": "achievement",
        "pt": "conquista",
        "ex": "Learning English was a big achievement for her."
      },
      {
        "en": "to look ahead",
        "pt": "olhar para frente",
        "ex": "It's time to look ahead and plan the future."
      },
      {
        "en": "entrepreneur",
        "pt": "empreendedor",
        "ex": "She became an entrepreneur after years as an employee."
      },
      {
        "en": "to grow",
        "pt": "crescer, evoluir",
        "ex": "Every challenge helped me grow."
      },
      {
        "en": "proud",
        "pt": "orgulhoso",
        "ex": "I'm proud of the career I've built."
      },
      {
        "en": "path",
        "pt": "caminho",
        "ex": "This is the path I chose for my life."
      },
      {
        "en": "journey",
        "pt": "jornada",
        "ex": "It's been an amazing journey so far."
      },
      {
        "en": "to build a career",
        "pt": "construir uma carreira",
        "ex": "She built a career she's proud of."
      },
      {
        "en": "opportunity",
        "pt": "oportunidade",
        "ex": "A new opportunity appeared unexpectedly."
      },
      {
        "en": "challenge",
        "pt": "desafio",
        "ex": "Every challenge taught me something new."
      },
      {
        "en": "to make progress",
        "pt": "progredir",
        "ex": "I've made a lot of progress this year."
      },
      {
        "en": "goal",
        "pt": "objetivo, meta",
        "ex": "My goal is to speak English fluently."
      },
      {
        "en": "to set a goal",
        "pt": "definir uma meta",
        "ex": "I set a goal to finish the course by December."
      },
      {
        "en": "to achieve",
        "pt": "alcançar, conquistar",
        "ex": "She achieved everything she planned."
      },
      {
        "en": "five years from now",
        "pt": "daqui a cinco anos",
        "ex": "Where will you be five years from now?"
      },
      {
        "en": "mumble",
        "pt": "falar baixo e sem clareza",
        "ex": "He mumbled a vague answer."
      },
      {
        "en": "invisible",
        "pt": "invisível",
        "ex": "She used to feel invisible at her old job."
      },
      {
        "en": "waiting list",
        "pt": "lista de espera",
        "ex": "There's a waiting list for the new class."
      },
      {
        "en": "to follow up",
        "pt": "dar continuidade, retomar",
        "ex": "She always follows up with another question."
      },
      {
        "en": "honest answer",
        "pt": "resposta sincera",
        "ex": "Give an honest answer, not a safe one."
      },
      {
        "en": "realistic",
        "pt": "realista",
        "ex": "Forget what's realistic — dream big."
      },
      {
        "en": "to fail",
        "pt": "falhar, fracassar",
        "ex": "What would you do if you knew you couldn't fail?"
      },
      {
        "en": "safe answer",
        "pt": "resposta segura",
        "ex": "Most people give a safe answer in interviews."
      },
      {
        "en": "mistake (career)",
        "pt": "erro (de carreira)",
        "ex": "I wondered if I had made a terrible mistake."
      },
      {
        "en": "leadership",
        "pt": "liderança",
        "ex": "She had to learn leadership on her own."
      },
      {
        "en": "accounting",
        "pt": "contabilidade",
        "ex": "Nobody taught her accounting or marketing."
      },
      {
        "en": "to keep going",
        "pt": "continuar em frente",
        "ex": "It wasn't easy, but she kept going."
      }
    ],
    "expressions": [
      {
        "expr": "Where do you see yourself...?",
        "meaning": "Onde você se vê...?",
        "example": "Where do you see yourself in five years?"
      },
      {
        "expr": "Looking back...",
        "meaning": "Olhando para trás...",
        "example": "Looking back, I'm proud of how far I've come."
      },
      {
        "expr": "What would you do if...?",
        "meaning": "O que você faria se...?",
        "example": "What would you do if you knew you couldn't fail?"
      },
      {
        "expr": "It wasn't easy, but...",
        "meaning": "Não foi fácil, mas...",
        "example": "It wasn't easy, but I kept going."
      }
    ],
    "sentences": [
      "Where do you see yourself in five years?",
      "Looking back, I'm proud of how far I've come.",
      "That was the turning point in my career.",
      "I used to feel invisible at my old job.",
      "What would you do if you knew you couldn't fail?",
      "It wasn't easy, but I kept going anyway.",
      "I've made a lot of progress since I started learning English.",
      "My goal is to build a career I truly love."
    ],
    "grammar": {
      "title": "Falando sobre o Passado e o Futuro: Revisão em Contexto",
      "rules": [
        "Para falar de hábitos/estados que mudaram, use USED TO: I used to feel invisible at work.",
        "Para desejos e arrependimentos, use WISH: I wish I had studied business earlier.",
        "Para planos e intenções futuras, use GOING TO: I'm going to build my own career.",
        "Para previsões e decisões espontâneas, use WILL: I think it will be a great journey."
      ],
      "table": {
        "headers": [
          "Tempo/foco",
          "Estrutura",
          "Exemplo",
          "Sentimento"
        ],
        "rows": [
          [
            "Hábito passado",
            "used to",
            "I used to feel invisible.",
            "Mudança de identidade"
          ],
          [
            "Arrependimento",
            "wish + had + particípio",
            "I wish I had started sooner.",
            "Reflexão"
          ],
          [
            "Plano futuro",
            "going to",
            "I'm going to change my career.",
            "Intenção"
          ],
          [
            "Previsão futura",
            "will",
            "I think it will be worth it.",
            "Esperança"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Where do you ___ yourself in five years?",
        "a": "see",
        "opts": [
          "see",
          "saw",
          "seeing",
          "seen"
        ]
      },
      {
        "q": "I ___ (use to) feel invisible at my old job.",
        "a": "used to",
        "opts": [
          "used to",
          "use to",
          "would",
          "was"
        ]
      },
      {
        "q": "I wish I ___ (study) business earlier.",
        "a": "had studied",
        "opts": [
          "had studied",
          "studied",
          "study",
          "would study"
        ]
      },
      {
        "q": "I'm ___ (going to) build my own career.",
        "a": "going to",
        "opts": [
          "going to",
          "will",
          "would",
          "used to"
        ]
      },
      {
        "q": "What would you do if you knew you couldn't ___?",
        "a": "fail",
        "opts": [
          "fail",
          "failed",
          "failing",
          "fails"
        ]
      }
    ],
    "speak": [
      "Where do you see yourself in five years?",
      "Looking back, I'm proud of how far I've come.",
      "I used to feel invisible at my old job.",
      "What would you do if you knew you couldn't fail?",
      "My goal is to build a career I truly love."
    ]
  },
  {
    "id": 440,
    "title": "Intermediate Course Review: Grand Finale",
    "emoji": "🎓",
    "verbs": [
      "To Review",
      "To Practice",
      "To Improve",
      "To Celebrate"
    ],
    "vocab": [
      {
        "en": "used to",
        "pt": "costumava",
        "ex": "I used to struggle with English grammar."
      },
      {
        "en": "would (past habit)",
        "pt": "costumava (repetido)",
        "ex": "We would practice every single day."
      },
      {
        "en": "wish",
        "pt": "desejar",
        "ex": "I wish I had started learning sooner."
      },
      {
        "en": "if only",
        "pt": "se ao menos",
        "ex": "If only I had practiced more at the beginning."
      },
      {
        "en": "to be honest",
        "pt": "pra ser sincero",
        "ex": "To be honest, it is not easy, is it?"
      },
      {
        "en": "isn't it?",
        "pt": "não é?",
        "ex": "English is challenging, isn't it?"
      },
      {
        "en": "will",
        "pt": "futuro (will)",
        "ex": "I will keep practicing every week."
      },
      {
        "en": "going to",
        "pt": "futuro (going to)",
        "ex": "I'm going to review this course again."
      },
      {
        "en": "future perfect",
        "pt": "futuro perfeito",
        "ex": "By next year, I will have finished the advanced course."
      },
      {
        "en": "to review",
        "pt": "revisar",
        "ex": "Let's review everything we've learned."
      },
      {
        "en": "to improve",
        "pt": "melhorar",
        "ex": "My English has really improved this year."
      },
      {
        "en": "progress",
        "pt": "progresso",
        "ex": "Look at all the progress you've made!"
      },
      {
        "en": "to celebrate",
        "pt": "comemorar",
        "ex": "It's time to celebrate finishing the course."
      },
      {
        "en": "achievement",
        "pt": "conquista",
        "ex": "Finishing this course is a big achievement."
      },
      {
        "en": "confident",
        "pt": "confiante",
        "ex": "I feel much more confident now."
      },
      {
        "en": "fluency",
        "pt": "fluência",
        "ex": "Fluency takes time and consistent practice."
      },
      {
        "en": "to look forward to",
        "pt": "estar ansioso por",
        "ex": "I am looking forward to seeing you."
      },
      {
        "en": "to master",
        "pt": "dominar",
        "ex": "You're starting to master these structures."
      },
      {
        "en": "milestone",
        "pt": "marco",
        "ex": "This is an important milestone in your journey."
      },
      {
        "en": "consistency",
        "pt": "consistência",
        "ex": "Consistency is the key to learning a language."
      },
      {
        "en": "to keep practicing",
        "pt": "continuar praticando",
        "ex": "Keep practicing, and you'll keep improving."
      },
      {
        "en": "next level",
        "pt": "próximo nível",
        "ex": "You're ready for the next level."
      },
      {
        "en": "to look back",
        "pt": "olhar para trás",
        "ex": "Looking back, you've come a long way."
      },
      {
        "en": "journey",
        "pt": "jornada",
        "ex": "This has been an amazing learning journey."
      },
      {
        "en": "to graduate",
        "pt": "se formar",
        "ex": "By the end of this year, I will have graduated."
      },
      {
        "en": "to reflect",
        "pt": "refletir",
        "ex": "Take a moment to reflect on your progress."
      },
      {
        "en": "proud",
        "pt": "orgulhoso",
        "ex": "You should be proud of everything you've learned."
      },
      {
        "en": "challenge",
        "pt": "desafio",
        "ex": "Every lesson was a new challenge."
      },
      {
        "en": "to set a new goal",
        "pt": "definir uma nova meta",
        "ex": "Now it's time to set a new goal."
      },
      {
        "en": "congratulations",
        "pt": "parabéns",
        "ex": "Congratulations on finishing the Intermediate course!"
      }
    ],
    "expressions": [
      {
        "expr": "You've come a long way, haven't you?",
        "meaning": "Você percorreu um longo caminho, não é?",
        "example": "You've come a long way, haven't you?"
      },
      {
        "expr": "I used to..., but now I...",
        "meaning": "Eu costumava..., mas agora eu...",
        "example": "I used to be afraid to speak, but now I feel confident."
      },
      {
        "expr": "I wish I had started sooner",
        "meaning": "Eu queria ter começado mais cedo",
        "example": "I wish I had started sooner, but I'm glad I'm here now."
      },
      {
        "expr": "I'm going to keep practicing",
        "meaning": "Eu vou continuar praticando",
        "example": "I'm going to keep practicing every day."
      }
    ],
    "sentences": [
      "You've come a long way, haven't you?",
      "I used to be afraid to speak English, but now I feel confident.",
      "I wish I had started learning English sooner.",
      "This grammar is tricky, isn't it?",
      "I'm going to keep practicing every single day.",
      "By next year, I will have finished the Advanced course.",
      "We would review new words together every week.",
      "Congratulations on finishing the Intermediate course!"
    ],
    "grammar": {
      "title": "Revisão Geral: Used To, Wish, Question Tags & Futuro",
      "rules": [
        "USED TO / WOULD descrevem hábitos e estados do passado que mudaram: I used to struggle, but I improved.",
        "WISH + passado (presente) ou passado perfeito (arrependimento) expressa desejos: I wish I had started sooner.",
        "QUESTION TAGS confirmam informação com a regra do espelho: You've improved, haven't you?",
        "WILL / GOING TO / futuro perfeito e contínuo descrevem planos e previsões: I'm going to keep practicing."
      ],
      "table": {
        "headers": [
          "Tópico",
          "Estrutura-chave",
          "Exemplo",
          "Aula de origem"
        ],
        "rows": [
          [
            "Hábitos passados",
            "used to / would",
            "I used to struggle with grammar.",
            "Lição 16"
          ],
          [
            "Desejos/arrependimentos",
            "wish + past / past perfect",
            "I wish I had started sooner.",
            "Lição 17"
          ],
          [
            "Confirmação",
            "question tags",
            "You've improved, haven't you?",
            "Lição 18"
          ],
          [
            "Futuro",
            "will / going to / future perfect",
            "I'm going to keep practicing.",
            "Lição 19"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "I ___ (use to) struggle with grammar, but now it's easy.",
        "a": "used to",
        "opts": [
          "used to",
          "use to",
          "would to",
          "using to"
        ]
      },
      {
        "q": "I wish I ___ (start) learning English sooner.",
        "a": "had started",
        "opts": [
          "had started",
          "started",
          "start",
          "would start"
        ]
      },
      {
        "q": "You've improved a lot, ___ you?",
        "a": "haven't",
        "opts": [
          "haven't",
          "aren't",
          "don't",
          "didn't"
        ]
      },
      {
        "q": "I'm ___ (going to) keep practicing every day.",
        "a": "going to",
        "opts": [
          "going to",
          "will",
          "used to",
          "would"
        ]
      },
      {
        "q": "By next year, I ___ (finish) the Advanced course.",
        "a": "will have finished",
        "opts": [
          "will have finished",
          "will finish",
          "am finishing",
          "finished"
        ]
      }
    ],
    "speak": [
      "You've come a long way, haven't you?",
      "I used to be afraid to speak English, but now I feel confident.",
      "I wish I had started learning English sooner.",
      "I'm going to keep practicing every single day.",
      "Congratulations on finishing the Intermediate course!"
    ]
  }
];

window.LESSONS_INT = LESSONS_INT;
