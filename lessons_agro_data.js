// ════════════════════════════════════════════════════════════════════════════
// lessons_agro_data.js — Trilha Diária do curso Agro English
// ════════════════════════════════════════════════════════════════════════════
// GERADO por scripts/build-trilha-agro.mjs a partir de
// scripts/agro-trilha-a.json e -b.json. Não edite este arquivo à mão:
// edite os JSON e rode o construtor de novo.
//
// Faixa de ids: 701-712 (en 1-110 · fr 201-212 · tr 301-336 · int 401-440 ·
// gps 501-508 · interview 601-612 já estão ocupadas).
//
// Mix 50-50 entre vocabulário geral e vocabulário do agro é regra do curso e
// está validada no construtor — o campo "tema" vive nos JSON de origem e é
// removido aqui, porque o app espera vocab {en, pt}.
//
// ⚠️  Este arquivo é FONTE DE COMPILAÇÃO, não é lido pelo navegador. Depois de
//     mudar qualquer coisa aqui é obrigatório rodar:
//         node scripts/build-lesson-data.js
//     senão a lição não existe para o app — sem erro nenhum.
// ════════════════════════════════════════════════════════════════════════════

const LESSONS_AGRO = [
  {
    "id": 701,
    "title": "Hello & Good Morning",
    "emoji": "👋",
    "verbs": [
      "To Be",
      "To Say",
      "To Meet",
      "To Start"
    ],
    "vocab": [
      {
        "en": "hello",
        "pt": "olá"
      },
      {
        "en": "hi",
        "pt": "oi"
      },
      {
        "en": "good morning",
        "pt": "bom dia"
      },
      {
        "en": "good afternoon",
        "pt": "boa tarde"
      },
      {
        "en": "good evening",
        "pt": "boa noite (ao chegar)"
      },
      {
        "en": "good night",
        "pt": "boa noite (ao sair)"
      },
      {
        "en": "goodbye",
        "pt": "tchau"
      },
      {
        "en": "see you tomorrow",
        "pt": "até amanhã"
      },
      {
        "en": "please",
        "pt": "por favor"
      },
      {
        "en": "thank you",
        "pt": "obrigado"
      },
      {
        "en": "sorry",
        "pt": "desculpa"
      },
      {
        "en": "excuse me",
        "pt": "com licença"
      },
      {
        "en": "yes",
        "pt": "sim"
      },
      {
        "en": "no",
        "pt": "não"
      },
      {
        "en": "welcome",
        "pt": "bem-vindo"
      },
      {
        "en": "workshop",
        "pt": "oficina"
      },
      {
        "en": "farm",
        "pt": "fazenda"
      },
      {
        "en": "field",
        "pt": "lavoura"
      },
      {
        "en": "tractor",
        "pt": "trator"
      },
      {
        "en": "boss",
        "pt": "chefe"
      },
      {
        "en": "team",
        "pt": "equipe"
      },
      {
        "en": "shift",
        "pt": "turno"
      },
      {
        "en": "gate",
        "pt": "portão / porteira"
      },
      {
        "en": "office",
        "pt": "escritório"
      },
      {
        "en": "visitor",
        "pt": "visitante"
      },
      {
        "en": "helmet",
        "pt": "capacete"
      },
      {
        "en": "truck",
        "pt": "caminhão"
      },
      {
        "en": "machine",
        "pt": "máquina"
      },
      {
        "en": "tool",
        "pt": "ferramenta"
      },
      {
        "en": "work",
        "pt": "trabalho"
      }
    ],
    "expressions": [
      {
        "expr": "Good morning!",
        "meaning": "Bom dia! — até o meio-dia",
        "example": "Good morning, Jack! Welcome to the farm."
      },
      {
        "expr": "How's it going?",
        "meaning": "Como vão as coisas? — informal, com colega",
        "example": "Hi Pedro, how's it going?"
      },
      {
        "expr": "Nice to meet you.",
        "meaning": "Prazer em conhecer você — só na primeira vez",
        "example": "Nice to meet you. I'm Luan."
      },
      {
        "expr": "See you tomorrow.",
        "meaning": "Até amanhã.",
        "example": "Goodbye! See you tomorrow at the workshop."
      }
    ],
    "sentences": [
      "Good morning! Welcome to the farm.",
      "Hello, my name is Luan.",
      "Hi! I work at the workshop.",
      "Good afternoon, boss.",
      "Thank you very much.",
      "Excuse me, is this the office?",
      "Goodbye! See you tomorrow.",
      "Please, come in."
    ],
    "grammar": {
      "title": "Cumprimentar pela hora do dia",
      "rules": [
        "Good morning até o meio-dia, good afternoon até o fim da tarde, good evening depois disso.",
        "⚠️ Good night NÃO é cumprimento de chegada — é despedida, quando você vai embora à noite ou vai dormir.",
        "Hi e Hello servem a qualquer hora. Hi é mais informal, bom entre colegas.",
        "Depois do cumprimento vem direto o nome, sem 'senhor': Good morning, Jack."
      ],
      "table": {
        "headers": [
          "Hora",
          "Inglês",
          "Quando usar"
        ],
        "rows": [
          [
            "06:00 – 12:00",
            "Good morning",
            "chegando no turno da manhã"
          ],
          [
            "12:00 – 18:00",
            "Good afternoon",
            "depois do almoço"
          ],
          [
            "18:00 em diante",
            "Good evening",
            "chegando à noite"
          ],
          [
            "ao sair à noite",
            "Good night",
            "só despedida"
          ],
          [
            "qualquer hora",
            "Hi / Hello",
            "informal, com colega"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "São 7 da manhã e você chega no galpão. O que você diz?",
        "a": "Good morning!",
        "opts": [
          "Good morning!",
          "Good night!",
          "Good evening!",
          "Goodbye!"
        ],
        "why": "Good morning vale até o meio-dia. Good night é despedida, nunca chegada."
      },
      {
        "q": "Como se despedir de quem você vê de novo amanhã?",
        "a": "See you tomorrow.",
        "opts": [
          "See you tomorrow.",
          "Good morning.",
          "Nice to meet you.",
          "Excuse me."
        ],
        "why": "See you + quando. É a despedida padrão entre colegas."
      },
      {
        "q": "\"Obrigado\" em inglês é:",
        "a": "Thank you",
        "opts": [
          "Thank you",
          "Please",
          "Sorry",
          "Welcome"
        ],
        "why": "Please é 'por favor'. Thank you é 'obrigado'."
      },
      {
        "q": "Você precisa passar e tem alguém na frente. O que diz?",
        "a": "Excuse me.",
        "opts": [
          "Excuse me.",
          "Sorry.",
          "Thank you.",
          "Hello."
        ],
        "why": "Excuse me pede licença ANTES. Sorry vem depois, quando já incomodou."
      },
      {
        "q": "Você conhece o Jack pela primeira vez. O que diz?",
        "a": "Nice to meet you.",
        "opts": [
          "Nice to meet you.",
          "See you tomorrow.",
          "Good night.",
          "How's it going?"
        ],
        "why": "Nice to meet you só na primeira vez. Depois disso é só Hi."
      }
    ],
    "speak": [
      "Good morning! Welcome to the farm.",
      "Hello, I'm Luan. Nice to meet you.",
      "Thank you very much!",
      "Excuse me, where is the workshop?",
      "Goodbye! See you tomorrow."
    ]
  },
  {
    "id": 702,
    "title": "How Are You?",
    "emoji": "😊",
    "verbs": [
      "To Feel",
      "To Have",
      "To Need",
      "To Rest"
    ],
    "vocab": [
      {
        "en": "how are you?",
        "pt": "como você está?"
      },
      {
        "en": "fine",
        "pt": "bem"
      },
      {
        "en": "good",
        "pt": "bom / bem"
      },
      {
        "en": "great",
        "pt": "ótimo"
      },
      {
        "en": "bad",
        "pt": "ruim"
      },
      {
        "en": "tired",
        "pt": "cansado"
      },
      {
        "en": "happy",
        "pt": "feliz"
      },
      {
        "en": "sad",
        "pt": "triste"
      },
      {
        "en": "hungry",
        "pt": "com fome"
      },
      {
        "en": "thirsty",
        "pt": "com sede"
      },
      {
        "en": "hot",
        "pt": "quente / com calor"
      },
      {
        "en": "cold",
        "pt": "frio / com frio"
      },
      {
        "en": "busy",
        "pt": "ocupado"
      },
      {
        "en": "and you?",
        "pt": "e você?"
      },
      {
        "en": "not bad",
        "pt": "nada mal"
      },
      {
        "en": "harvest",
        "pt": "colheita"
      },
      {
        "en": "season",
        "pt": "safra / estação"
      },
      {
        "en": "weather",
        "pt": "tempo (clima)"
      },
      {
        "en": "rain",
        "pt": "chuva"
      },
      {
        "en": "sun",
        "pt": "sol"
      },
      {
        "en": "dust",
        "pt": "poeira"
      },
      {
        "en": "break",
        "pt": "pausa / intervalo"
      },
      {
        "en": "lunch",
        "pt": "almoço"
      },
      {
        "en": "water",
        "pt": "água"
      },
      {
        "en": "shade",
        "pt": "sombra"
      },
      {
        "en": "long day",
        "pt": "dia longo"
      },
      {
        "en": "early",
        "pt": "cedo"
      },
      {
        "en": "late",
        "pt": "tarde / atrasado"
      },
      {
        "en": "day off",
        "pt": "folga"
      },
      {
        "en": "rest",
        "pt": "descanso"
      }
    ],
    "expressions": [
      {
        "expr": "How are you?",
        "meaning": "Como você está? — a pergunta de todo dia",
        "example": "Hi Luan, how are you today?"
      },
      {
        "expr": "I'm fine, thanks. And you?",
        "meaning": "Estou bem, obrigado. E você? — sempre devolva a pergunta",
        "example": "I'm fine, thanks. And you, Jack?"
      },
      {
        "expr": "I'm tired.",
        "meaning": "Estou cansado. — é SER, não TER",
        "example": "It was a long day. I'm tired."
      },
      {
        "expr": "Not bad!",
        "meaning": "Nada mal! — resposta natural, nem ótimo nem ruim",
        "example": "How's the harvest? — Not bad!"
      }
    ],
    "sentences": [
      "How are you today?",
      "I'm fine, thank you. And you?",
      "I'm very tired. It was a long day.",
      "Are you hungry?",
      "It's hot today.",
      "I'm busy. The harvest starts tomorrow.",
      "I need water, please.",
      "I'm happy. Tomorrow is my day off."
    ],
    "grammar": {
      "title": "Dizer como você está: I'm + adjetivo",
      "rules": [
        "⚠️ Em inglês você não TEM fome nem frio — você É: I am hungry, I am cold.",
        "Depois de I'm vem um adjetivo: I'm tired, I'm busy, I'm happy.",
        "Para devolver a pergunta, basta 'And you?' — não precisa repetir tudo.",
        "Para falar do ambiente, use It's + adjetivo: It's hot today."
      ],
      "table": {
        "headers": [
          "Português",
          "Inglês",
          "❌ Erro comum"
        ],
        "rows": [
          [
            "Estou cansado",
            "I'm tired",
            "I have tired"
          ],
          [
            "Estou com fome",
            "I'm hungry",
            "I have hunger"
          ],
          [
            "Estou com sede",
            "I'm thirsty",
            "I have thirst"
          ],
          [
            "Estou com frio",
            "I'm cold",
            "I have cold"
          ],
          [
            "Está quente hoje",
            "It's hot today",
            "Is hot today"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Estou com fome.\"",
        "a": "I'm hungry.",
        "opts": [
          "I'm hungry.",
          "I have hungry.",
          "I have hunger.",
          "I'm hunger."
        ],
        "why": "Fome, sede, frio e calor em inglês são com to be: I AM hungry."
      },
      {
        "q": "Jack pergunta \"How are you?\". Resposta mais natural:",
        "a": "I'm fine, thanks. And you?",
        "opts": [
          "I'm fine, thanks. And you?",
          "Yes, I am.",
          "I'm Luan.",
          "Thank you."
        ],
        "why": "Responde e devolve a pergunta. Conversa em inglês é troca, não resposta seca."
      },
      {
        "q": "\"Está quente hoje.\"",
        "a": "It's hot today.",
        "opts": [
          "It's hot today.",
          "Is hot today.",
          "It has hot today.",
          "Today is hot weather."
        ],
        "why": "Clima e ambiente começam com It's. O sujeito nunca some em inglês."
      },
      {
        "q": "Qual delas significa \"nada mal\"?",
        "a": "Not bad",
        "opts": [
          "Not bad",
          "No bad",
          "Not good",
          "Nothing bad"
        ],
        "why": "Not bad é elogio discreto — quer dizer que está bom."
      },
      {
        "q": "\"Eu estou ocupado. A colheita começa amanhã.\"",
        "a": "I'm busy. The harvest starts tomorrow.",
        "opts": [
          "I'm busy. The harvest starts tomorrow.",
          "I busy. The harvest start tomorrow.",
          "I have busy. The harvest starts tomorrow.",
          "I'm busy. The harvest start tomorrow."
        ],
        "why": "I'm + adjetivo, e harvest é uma coisa só (it), então starts com -s."
      }
    ],
    "speak": [
      "How are you today?",
      "I'm fine, thanks. And you?",
      "I'm very tired. It was a long day.",
      "I'm thirsty. I need water.",
      "It's hot today in the field."
    ]
  },
  {
    "id": 703,
    "title": "What Is This? What Is That?",
    "emoji": "👉",
    "verbs": [
      "To Be",
      "To Show",
      "To Point",
      "To Ask"
    ],
    "vocab": [
      {
        "en": "this",
        "pt": "isto (perto)"
      },
      {
        "en": "that",
        "pt": "aquilo (longe)"
      },
      {
        "en": "these",
        "pt": "estes (perto, plural)"
      },
      {
        "en": "those",
        "pt": "aqueles (longe, plural)"
      },
      {
        "en": "thing",
        "pt": "coisa"
      },
      {
        "en": "here",
        "pt": "aqui"
      },
      {
        "en": "there",
        "pt": "ali / lá"
      },
      {
        "en": "what",
        "pt": "o que / qual"
      },
      {
        "en": "a / an",
        "pt": "um / uma"
      },
      {
        "en": "the",
        "pt": "o / a"
      },
      {
        "en": "name",
        "pt": "nome"
      },
      {
        "en": "word",
        "pt": "palavra"
      },
      {
        "en": "question",
        "pt": "pergunta"
      },
      {
        "en": "answer",
        "pt": "resposta"
      },
      {
        "en": "look",
        "pt": "olhe / olhar"
      },
      {
        "en": "wrench",
        "pt": "chave inglesa"
      },
      {
        "en": "screwdriver",
        "pt": "chave de fenda"
      },
      {
        "en": "bolt",
        "pt": "parafuso"
      },
      {
        "en": "nut",
        "pt": "porca"
      },
      {
        "en": "cable",
        "pt": "cabo"
      },
      {
        "en": "antenna",
        "pt": "antena"
      },
      {
        "en": "screen",
        "pt": "tela"
      },
      {
        "en": "monitor",
        "pt": "monitor"
      },
      {
        "en": "seed",
        "pt": "semente"
      },
      {
        "en": "soil",
        "pt": "solo"
      },
      {
        "en": "plant",
        "pt": "planta"
      },
      {
        "en": "leaf",
        "pt": "folha"
      },
      {
        "en": "bag",
        "pt": "saco"
      },
      {
        "en": "box",
        "pt": "caixa"
      },
      {
        "en": "rope",
        "pt": "corda"
      }
    ],
    "expressions": [
      {
        "expr": "What is this?",
        "meaning": "O que é isto? — a pergunta mais útil de quem está começando",
        "example": "What is this? — This is a wrench."
      },
      {
        "expr": "What is that?",
        "meaning": "O que é aquilo? — para o que está longe",
        "example": "What is that over there? — That is a harvester."
      },
      {
        "expr": "How do you say… in English?",
        "meaning": "Como se diz… em inglês?",
        "example": "How do you say 'semente' in English? — Seed."
      },
      {
        "expr": "I don't know.",
        "meaning": "Eu não sei. — melhor dizer do que ficar calado",
        "example": "What is this? — Sorry, I don't know."
      }
    ],
    "sentences": [
      "What is this? This is a wrench.",
      "What is that? That is a tractor.",
      "What are these? These are seeds.",
      "Those are my tools.",
      "This is a bolt, and that is a nut.",
      "How do you say 'solo' in English?",
      "Look! This plant is green.",
      "Sorry, I don't know this word."
    ],
    "grammar": {
      "title": "this / that / these / those",
      "rules": [
        "Perto de você é this. Longe é that. Só existem essas duas distâncias em inglês.",
        "No plural, this vira these e that vira those — e o verbo is vira are.",
        "Toda coisa contável no singular precisa de a (ou an antes de som de vogal): this is A bolt.",
        "No plural não se usa a nem an: these are seeds, nunca these are a seeds."
      ],
      "table": {
        "headers": [
          "",
          "Perto",
          "Longe",
          "Exemplo"
        ],
        "rows": [
          [
            "1 coisa",
            "this",
            "that",
            "This is a bolt."
          ],
          [
            "2+ coisas",
            "these",
            "those",
            "These are seeds."
          ],
          [
            "o verbo (1)",
            "is",
            "is",
            "That antenna is new."
          ],
          [
            "o verbo (2+)",
            "are",
            "are",
            "Those bags are heavy."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "A ferramenta está na sua mão. Como você a apresenta?",
        "a": "This is a wrench.",
        "opts": [
          "This is a wrench.",
          "That is a wrench.",
          "These is a wrench.",
          "This is wrench."
        ],
        "why": "Na mão = perto = this. E singular precisa do a."
      },
      {
        "q": "\"O que são estes?\"",
        "a": "What are these?",
        "opts": [
          "What are these?",
          "What is these?",
          "What are this?",
          "What these are?"
        ],
        "why": "these é plural, então o verbo é are."
      },
      {
        "q": "Complete: \"That is ___ antenna.\"",
        "a": "an",
        "opts": [
          "an",
          "a",
          "the an",
          "one"
        ],
        "why": "antenna começa com som de vogal, então a vira an."
      },
      {
        "q": "\"Aqueles sacos são pesados.\" (lá longe)",
        "a": "Those bags are heavy.",
        "opts": [
          "Those bags are heavy.",
          "That bags are heavy.",
          "Those bags is heavy.",
          "Those bags are heavies."
        ],
        "why": "Longe + plural = those + are. E adjetivo em inglês nunca tem plural."
      },
      {
        "q": "Você não sabe o nome da peça. O que diz?",
        "a": "Sorry, I don't know.",
        "opts": [
          "Sorry, I don't know.",
          "Sorry, I no know.",
          "Sorry, I don't know it what.",
          "Sorry, I not know."
        ],
        "why": "A negativa do present simple é don't + verbo. Dizer que não sabe abre a conversa."
      }
    ],
    "speak": [
      "What is this?",
      "This is a screwdriver.",
      "What is that over there?",
      "These are seeds, and those are bolts.",
      "How do you say 'lavoura' in English?"
    ]
  },
  {
    "id": 704,
    "title": "Numbers 1 to 12",
    "emoji": "🔢",
    "verbs": [
      "To Count",
      "To Have",
      "To Weigh",
      "To Load"
    ],
    "vocab": [
      {
        "en": "zero",
        "pt": "zero"
      },
      {
        "en": "one",
        "pt": "um"
      },
      {
        "en": "two",
        "pt": "dois"
      },
      {
        "en": "three",
        "pt": "três"
      },
      {
        "en": "four",
        "pt": "quatro"
      },
      {
        "en": "five",
        "pt": "cinco"
      },
      {
        "en": "six",
        "pt": "seis"
      },
      {
        "en": "seven",
        "pt": "sete"
      },
      {
        "en": "eight",
        "pt": "oito"
      },
      {
        "en": "nine",
        "pt": "nove"
      },
      {
        "en": "ten",
        "pt": "dez"
      },
      {
        "en": "eleven",
        "pt": "onze"
      },
      {
        "en": "twelve",
        "pt": "doze"
      },
      {
        "en": "number",
        "pt": "número"
      },
      {
        "en": "how many?",
        "pt": "quantos?"
      },
      {
        "en": "hectare",
        "pt": "hectare"
      },
      {
        "en": "row",
        "pt": "linha (de plantio)"
      },
      {
        "en": "liter",
        "pt": "litro"
      },
      {
        "en": "kilo",
        "pt": "quilo"
      },
      {
        "en": "ton",
        "pt": "tonelada"
      },
      {
        "en": "hour",
        "pt": "hora"
      },
      {
        "en": "tank",
        "pt": "tanque"
      },
      {
        "en": "load",
        "pt": "carga"
      },
      {
        "en": "crop",
        "pt": "cultura / safra"
      },
      {
        "en": "part",
        "pt": "peça"
      },
      {
        "en": "fuel",
        "pt": "combustível"
      },
      {
        "en": "tire",
        "pt": "pneu"
      },
      {
        "en": "worker",
        "pt": "trabalhador"
      },
      {
        "en": "there is",
        "pt": "tem (uma coisa)"
      },
      {
        "en": "there are",
        "pt": "tem (várias)"
      }
    ],
    "expressions": [
      {
        "expr": "How many…?",
        "meaning": "Quantos…? — depois dele vem sempre o plural",
        "example": "How many tractors are there? — There are four."
      },
      {
        "expr": "There are…",
        "meaning": "Tem / há… — ⚠️ nunca use have para isso",
        "example": "There are six parts in the box."
      },
      {
        "expr": "Let's count.",
        "meaning": "Vamos contar.",
        "example": "Let's count the bags together."
      },
      {
        "expr": "What's your phone number?",
        "meaning": "Qual é o seu telefone? — números se falam um a um",
        "example": "What's your phone number? — Nine, nine, six, seven…"
      }
    ],
    "sentences": [
      "How many tractors are there?",
      "There are four tractors on the farm.",
      "There is one harvester.",
      "I need two liters of fuel.",
      "This bag is fifty kilos.",
      "The truck has six tires.",
      "Let's count the parts: one, two, three…",
      "Twelve workers are here today."
    ],
    "grammar": {
      "title": "there is / there are — o \"tem\" de existir",
      "rules": [
        "⚠️ O maior erro de brasileiro: o \"tem\" de existir NÃO é have. É there is (uma coisa) ou there are (várias).",
        "have é para alguém possuir: I have a truck. there is/are é para a coisa existir num lugar.",
        "Depois de how many vem sempre o plural: how many tractors, nunca how many tractor.",
        "Para perguntar, o verbo vai para a frente: Is there…? / Are there…?"
      ],
      "table": {
        "headers": [
          "Português",
          "Inglês",
          "❌ Erro comum"
        ],
        "rows": [
          [
            "Tem um trator",
            "There is a tractor",
            "Have a tractor"
          ],
          [
            "Tem quatro tratores",
            "There are four tractors",
            "There is four tractors"
          ],
          [
            "Quantos tratores tem?",
            "How many tractors are there?",
            "How many tractor have?"
          ],
          [
            "Não tem peças",
            "There aren't any parts",
            "Not have parts"
          ],
          [
            "Eu tenho um caminhão",
            "I have a truck",
            "There is my truck"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Tem quatro tratores aqui.\"",
        "a": "There are four tractors here.",
        "opts": [
          "There are four tractors here.",
          "Have four tractors here.",
          "There is four tractors here.",
          "It has four tractors here."
        ],
        "why": "O \"tem\" de existir é there is/are, nunca have. Plural pede are."
      },
      {
        "q": "Como se escreve o número 12?",
        "a": "twelve",
        "opts": [
          "twelve",
          "twelfe",
          "twenty",
          "twelv"
        ],
        "why": "12 = twelve. Não confunda com twenty, que é 20."
      },
      {
        "q": "\"Quantas peças tem na caixa?\"",
        "a": "How many parts are there in the box?",
        "opts": [
          "How many parts are there in the box?",
          "How many part are there in the box?",
          "How much parts are there in the box?",
          "How many parts have in the box?"
        ],
        "why": "how many + plural, e o \"tem\" é are there."
      },
      {
        "q": "\"Eu tenho um caminhão.\" (posse)",
        "a": "I have a truck.",
        "opts": [
          "I have a truck.",
          "There is a truck.",
          "I there is a truck.",
          "I am a truck."
        ],
        "why": "Aqui o \"ter\" é posse mesmo — então have. there is seria 'existe um caminhão'."
      },
      {
        "q": "Qual é o número 8?",
        "a": "eight",
        "opts": [
          "eight",
          "eigth",
          "ate",
          "eighth"
        ],
        "why": "eight = 8. eighth (com -th) é 'oitavo', a ordem, não a quantidade."
      }
    ],
    "speak": [
      "How many tractors are there?",
      "There are four tractors on the farm.",
      "There is one harvester here.",
      "I need two liters of fuel, please.",
      "Let's count: one, two, three, four."
    ]
  },
  {
    "id": 705,
    "title": "Colors",
    "emoji": "🎨",
    "verbs": [
      "To Be",
      "To Look",
      "To Paint",
      "To Grow"
    ],
    "vocab": [
      {
        "en": "color",
        "pt": "cor"
      },
      {
        "en": "red",
        "pt": "vermelho"
      },
      {
        "en": "blue",
        "pt": "azul"
      },
      {
        "en": "green",
        "pt": "verde"
      },
      {
        "en": "yellow",
        "pt": "amarelo"
      },
      {
        "en": "black",
        "pt": "preto"
      },
      {
        "en": "white",
        "pt": "branco"
      },
      {
        "en": "orange",
        "pt": "laranja"
      },
      {
        "en": "brown",
        "pt": "marrom"
      },
      {
        "en": "gray",
        "pt": "cinza"
      },
      {
        "en": "light",
        "pt": "claro"
      },
      {
        "en": "dark",
        "pt": "escuro"
      },
      {
        "en": "big",
        "pt": "grande"
      },
      {
        "en": "small",
        "pt": "pequeno"
      },
      {
        "en": "beautiful",
        "pt": "bonito"
      },
      {
        "en": "soybean",
        "pt": "soja"
      },
      {
        "en": "corn",
        "pt": "milho"
      },
      {
        "en": "wheat",
        "pt": "trigo"
      },
      {
        "en": "grass",
        "pt": "capim / grama"
      },
      {
        "en": "rust",
        "pt": "ferrugem"
      },
      {
        "en": "paint",
        "pt": "tinta"
      },
      {
        "en": "flag",
        "pt": "bandeira / marcador"
      },
      {
        "en": "ripe",
        "pt": "maduro"
      },
      {
        "en": "dry",
        "pt": "seco"
      },
      {
        "en": "wet",
        "pt": "molhado"
      },
      {
        "en": "healthy",
        "pt": "saudável"
      },
      {
        "en": "mud",
        "pt": "lama"
      },
      {
        "en": "brand",
        "pt": "marca"
      },
      {
        "en": "cab",
        "pt": "cabine"
      },
      {
        "en": "warning light",
        "pt": "luz de alerta"
      }
    ],
    "expressions": [
      {
        "expr": "What color is it?",
        "meaning": "De que cor é? — em máquina agrícola a cor entrega a marca",
        "example": "What color is that tractor? — It's green."
      },
      {
        "expr": "It's light green.",
        "meaning": "É verde-claro. — light e dark vêm ANTES da cor",
        "example": "The young corn is light green."
      },
      {
        "expr": "The red light is on.",
        "meaning": "A luz vermelha está acesa. — frase de painel de máquina",
        "example": "Stop! The red warning light is on."
      },
      {
        "expr": "It looks good.",
        "meaning": "Está com boa aparência.",
        "example": "The soybean field looks good this year."
      }
    ],
    "sentences": [
      "What color is that tractor?",
      "It's green. It's a John Deere.",
      "The harvester is red.",
      "The corn is yellow and dry.",
      "These soybean plants are dark green.",
      "That truck is white and blue.",
      "The red warning light is on.",
      "My helmet is orange."
    ],
    "grammar": {
      "title": "A cor vem ANTES da coisa",
      "rules": [
        "⚠️ Em português é 'um trator verde'. Em inglês é o contrário: a GREEN tractor.",
        "Adjetivo em inglês nunca vai para o plural: four green tractors, nunca greens.",
        "light e dark vêm antes da cor: light green, dark blue.",
        "Para perguntar a cor: What color is + coisa? A resposta começa com It's."
      ],
      "table": {
        "headers": [
          "Português",
          "Inglês",
          "❌ Erro comum"
        ],
        "rows": [
          [
            "um trator verde",
            "a green tractor",
            "a tractor green"
          ],
          [
            "quatro tratores verdes",
            "four green tractors",
            "four greens tractors"
          ],
          [
            "verde-claro",
            "light green",
            "green light (= sinal verde!)"
          ],
          [
            "De que cor é?",
            "What color is it?",
            "What color it is?"
          ],
          [
            "É vermelho",
            "It's red",
            "Is red"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"um trator verde\"",
        "a": "a green tractor",
        "opts": [
          "a green tractor",
          "a tractor green",
          "a green tractors",
          "green a tractor"
        ],
        "why": "Em inglês a cor vem antes da coisa, sempre."
      },
      {
        "q": "\"quatro colheitadeiras vermelhas\"",
        "a": "four red harvesters",
        "opts": [
          "four red harvesters",
          "four reds harvesters",
          "four harvesters red",
          "four red harvester"
        ],
        "why": "A cor não tem plural; quem ganha o -s é a coisa contada."
      },
      {
        "q": "\"De que cor é a cabine?\"",
        "a": "What color is the cab?",
        "opts": [
          "What color is the cab?",
          "What color the cab is?",
          "What is color the cab?",
          "Which color has the cab?"
        ],
        "why": "Na pergunta o verbo vem antes do sujeito: What color IS the cab?"
      },
      {
        "q": "O milho está maduro e amarelo. Como você diz?",
        "a": "The corn is ripe and yellow.",
        "opts": [
          "The corn is ripe and yellow.",
          "The corn is yellow ripe.",
          "The corn ripe and yellow.",
          "The corn are ripe and yellow."
        ],
        "why": "corn é incontável, então is. Dois adjetivos se ligam com and depois do verbo."
      },
      {
        "q": "\"verde-escuro\"",
        "a": "dark green",
        "opts": [
          "dark green",
          "green dark",
          "darked green",
          "green of dark"
        ],
        "why": "light e dark vêm antes da cor, como qualquer outro adjetivo."
      }
    ],
    "speak": [
      "What color is that tractor?",
      "It's green. It's a John Deere.",
      "The harvester is red and white.",
      "These plants are dark green.",
      "The red warning light is on."
    ]
  },
  {
    "id": 706,
    "title": "My Name Is… (the alphabet)",
    "emoji": "🔤",
    "verbs": [
      "To Spell",
      "To Study",
      "To Live",
      "To Call"
    ],
    "vocab": [
      {
        "en": "name",
        "pt": "nome"
      },
      {
        "en": "first name",
        "pt": "primeiro nome"
      },
      {
        "en": "last name",
        "pt": "sobrenome"
      },
      {
        "en": "letter",
        "pt": "letra"
      },
      {
        "en": "alphabet",
        "pt": "alfabeto"
      },
      {
        "en": "to spell",
        "pt": "soletrar"
      },
      {
        "en": "age",
        "pt": "idade"
      },
      {
        "en": "years old",
        "pt": "anos de idade"
      },
      {
        "en": "city",
        "pt": "cidade"
      },
      {
        "en": "country",
        "pt": "país"
      },
      {
        "en": "Brazil",
        "pt": "Brasil"
      },
      {
        "en": "Brazilian",
        "pt": "brasileiro"
      },
      {
        "en": "friend",
        "pt": "amigo"
      },
      {
        "en": "to live",
        "pt": "morar"
      },
      {
        "en": "again",
        "pt": "de novo"
      },
      {
        "en": "agronomy",
        "pt": "agronomia"
      },
      {
        "en": "student",
        "pt": "estudante"
      },
      {
        "en": "technician",
        "pt": "técnico"
      },
      {
        "en": "farmer",
        "pt": "produtor / fazendeiro"
      },
      {
        "en": "mechanic",
        "pt": "mecânico"
      },
      {
        "en": "driver",
        "pt": "motorista"
      },
      {
        "en": "operator",
        "pt": "operador"
      },
      {
        "en": "company",
        "pt": "empresa"
      },
      {
        "en": "GPS",
        "pt": "GPS"
      },
      {
        "en": "university",
        "pt": "universidade"
      },
      {
        "en": "badge",
        "pt": "crachá"
      },
      {
        "en": "uniform",
        "pt": "uniforme"
      },
      {
        "en": "crew",
        "pt": "turma / equipe"
      },
      {
        "en": "job",
        "pt": "emprego"
      },
      {
        "en": "to work at",
        "pt": "trabalhar em"
      }
    ],
    "expressions": [
      {
        "expr": "My name is…",
        "meaning": "Meu nome é… — mais formal que I'm",
        "example": "My name is Luan. I'm a technician."
      },
      {
        "expr": "How do you spell it?",
        "meaning": "Como se escreve? — a frase que salva quando não entendem seu nome",
        "example": "Luan. — Sorry, how do you spell it?"
      },
      {
        "expr": "Can you say that again?",
        "meaning": "Pode repetir? — peça sem vergonha, é o que todo aluno precisa",
        "example": "Sorry, can you say that again, please?"
      },
      {
        "expr": "I work at…",
        "meaning": "Eu trabalho na… — empresa leva at",
        "example": "I work at GPS Tronic and I study agronomy."
      }
    ],
    "sentences": [
      "My name is Luan.",
      "How do you spell your name?",
      "L, U, A, N. Luan.",
      "I'm twenty-one years old.",
      "I live in Dourados, in Brazil.",
      "I'm an agronomy student.",
      "I work at GPS Tronic.",
      "Sorry, can you say that again?"
    ],
    "grammar": {
      "title": "Falar de você: I'm, I live, I work, I study",
      "rules": [
        "⚠️ Idade em inglês é com to be: I AM 21 years old, nunca I have 21 years.",
        "Cidade e país levam in: I live IN Dourados, IN Brazil.",
        "Empresa e lugar de trabalho levam at: I work AT GPS Tronic.",
        "Profissão precisa de a / an: I'm A technician, I'm AN agronomy student."
      ],
      "table": {
        "headers": [
          "O que você diz",
          "Inglês",
          "❌ Erro comum"
        ],
        "rows": [
          [
            "Meu nome é Luan",
            "My name is Luan",
            "My name Luan"
          ],
          [
            "Tenho 21 anos",
            "I'm 21 years old",
            "I have 21 years"
          ],
          [
            "Moro em Dourados",
            "I live in Dourados",
            "I live at Dourados"
          ],
          [
            "Trabalho na GPS Tronic",
            "I work at GPS Tronic",
            "I work in GPS Tronic"
          ],
          [
            "Sou técnico",
            "I'm a technician",
            "I'm technician"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu tenho 21 anos.\"",
        "a": "I'm twenty-one years old.",
        "opts": [
          "I'm twenty-one years old.",
          "I have twenty-one years old.",
          "I have twenty-one years.",
          "I'm twenty-one years."
        ],
        "why": "Em inglês você não TEM anos, você É velho: I AM 21 years old."
      },
      {
        "q": "\"Eu trabalho na GPS Tronic.\"",
        "a": "I work at GPS Tronic.",
        "opts": [
          "I work at GPS Tronic.",
          "I work in GPS Tronic.",
          "I work on GPS Tronic.",
          "I working at GPS Tronic."
        ],
        "why": "Empresa leva at. in é para cidade e país."
      },
      {
        "q": "\"Eu sou técnico.\"",
        "a": "I'm a technician.",
        "opts": [
          "I'm a technician.",
          "I'm technician.",
          "I have a technician.",
          "I'm the technician."
        ],
        "why": "Profissão em inglês precisa de a / an. Sem o artigo a frase soa quebrada."
      },
      {
        "q": "Jack não entendeu seu nome. O que você oferece?",
        "a": "I can spell it: L, U, A, N.",
        "opts": [
          "I can spell it: L, U, A, N.",
          "I can write it in the air.",
          "I say again my name Luan.",
          "My name spell is Luan."
        ],
        "why": "to spell é soletrar letra por letra — é o que resolve nome estrangeiro."
      },
      {
        "q": "\"Eu moro em Dourados.\"",
        "a": "I live in Dourados.",
        "opts": [
          "I live in Dourados.",
          "I live at Dourados.",
          "I live on Dourados.",
          "I living in Dourados."
        ],
        "why": "Cidade e país levam in."
      }
    ],
    "speak": [
      "My name is Luan.",
      "I'm twenty-one years old.",
      "I live in Dourados, in Brazil.",
      "I'm an agronomy student.",
      "Sorry, how do you spell your name?"
    ]
  },
  {
    "id": 707,
    "title": "The Farm and the Workshop",
    "emoji": "🏡",
    "verbs": [
      "To Be",
      "To Go",
      "To Put",
      "To Find"
    ],
    "vocab": [
      {
        "en": "place",
        "pt": "lugar"
      },
      {
        "en": "house",
        "pt": "casa"
      },
      {
        "en": "room",
        "pt": "sala / cômodo"
      },
      {
        "en": "door",
        "pt": "porta"
      },
      {
        "en": "window",
        "pt": "janela"
      },
      {
        "en": "floor",
        "pt": "chão"
      },
      {
        "en": "wall",
        "pt": "parede"
      },
      {
        "en": "table",
        "pt": "mesa"
      },
      {
        "en": "chair",
        "pt": "cadeira"
      },
      {
        "en": "in",
        "pt": "dentro de / em"
      },
      {
        "en": "on",
        "pt": "sobre / em cima de"
      },
      {
        "en": "under",
        "pt": "embaixo de"
      },
      {
        "en": "next to",
        "pt": "ao lado de"
      },
      {
        "en": "behind",
        "pt": "atrás de"
      },
      {
        "en": "where",
        "pt": "onde"
      },
      {
        "en": "barn",
        "pt": "galpão / celeiro"
      },
      {
        "en": "silo",
        "pt": "silo"
      },
      {
        "en": "shed",
        "pt": "barracão"
      },
      {
        "en": "yard",
        "pt": "pátio"
      },
      {
        "en": "fence",
        "pt": "cerca"
      },
      {
        "en": "road",
        "pt": "estrada"
      },
      {
        "en": "warehouse",
        "pt": "depósito / armazém"
      },
      {
        "en": "workbench",
        "pt": "bancada"
      },
      {
        "en": "toolbox",
        "pt": "caixa de ferramentas"
      },
      {
        "en": "pasture",
        "pt": "pasto"
      },
      {
        "en": "garage",
        "pt": "garagem"
      },
      {
        "en": "storage",
        "pt": "armazenagem"
      },
      {
        "en": "shelf",
        "pt": "prateleira"
      },
      {
        "en": "tank",
        "pt": "tanque"
      },
      {
        "en": "scale",
        "pt": "balança"
      }
    ],
    "expressions": [
      {
        "expr": "Where is…?",
        "meaning": "Onde está…? — a pergunta que resolve o dia inteiro na oficina",
        "example": "Where is the toolbox? — It's on the workbench."
      },
      {
        "expr": "It's over there.",
        "meaning": "Está ali.",
        "example": "The silo? It's over there, behind the barn."
      },
      {
        "expr": "Put it on the bench.",
        "meaning": "Coloque na bancada.",
        "example": "Put the wrench on the workbench, please."
      },
      {
        "expr": "I can't find it.",
        "meaning": "Não consigo achar.",
        "example": "I can't find the screwdriver."
      }
    ],
    "sentences": [
      "Where is the toolbox?",
      "It's on the workbench.",
      "The tractor is in the shed.",
      "The truck is next to the barn.",
      "My helmet is under the table.",
      "The office is behind the warehouse.",
      "Put the parts on the shelf, please.",
      "I can't find the cable."
    ],
    "grammar": {
      "title": "Onde as coisas estão: in, on, under, next to",
      "rules": [
        "in = dentro (in the shed) · on = em cima, tocando (on the bench) · under = embaixo (under the table).",
        "next to = ao lado · behind = atrás. Essas quatro resolvem quase tudo na oficina.",
        "A pergunta é Where is + coisa? — o verbo vem antes do sujeito.",
        "⚠️ Em inglês você não 'está no trator' (in the tractor) para dirigir: é ON the tractor, em cima dele."
      ],
      "table": {
        "headers": [
          "Preposição",
          "Significado",
          "Exemplo"
        ],
        "rows": [
          [
            "in",
            "dentro de",
            "The tractor is in the shed."
          ],
          [
            "on",
            "em cima de",
            "The wrench is on the bench."
          ],
          [
            "under",
            "embaixo de",
            "The dog is under the truck."
          ],
          [
            "next to",
            "ao lado de",
            "The silo is next to the barn."
          ],
          [
            "behind",
            "atrás de",
            "The office is behind the warehouse."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"A chave está em cima da bancada.\"",
        "a": "The wrench is on the workbench.",
        "opts": [
          "The wrench is on the workbench.",
          "The wrench is in the workbench.",
          "The wrench is under the workbench.",
          "The wrench is at the workbench."
        ],
        "why": "Em cima e tocando a superfície = on."
      },
      {
        "q": "\"O trator está dentro do barracão.\"",
        "a": "The tractor is in the shed.",
        "opts": [
          "The tractor is in the shed.",
          "The tractor is on the shed.",
          "The tractor is next to shed.",
          "The tractor is in shed."
        ],
        "why": "Dentro de um espaço fechado = in. E não esqueça o the."
      },
      {
        "q": "\"Onde está a caixa de ferramentas?\"",
        "a": "Where is the toolbox?",
        "opts": [
          "Where is the toolbox?",
          "Where the toolbox is?",
          "Where is toolbox?",
          "Where have the toolbox?"
        ],
        "why": "Na pergunta o verbo vem antes do sujeito: Where IS the toolbox?"
      },
      {
        "q": "\"O silo fica ao lado do galpão.\"",
        "a": "The silo is next to the barn.",
        "opts": [
          "The silo is next to the barn.",
          "The silo is next the barn.",
          "The silo is beside to the barn.",
          "The silo is next of the barn."
        ],
        "why": "A expressão é next TO, com o to sempre junto."
      },
      {
        "q": "\"Não consigo achar o cabo.\"",
        "a": "I can't find the cable.",
        "opts": [
          "I can't find the cable.",
          "I don't can find the cable.",
          "I can't to find the cable.",
          "I not can find the cable."
        ],
        "why": "Depois de can / can't vem o verbo puro, sem to."
      }
    ],
    "speak": [
      "Where is the toolbox?",
      "It's on the workbench.",
      "The tractor is in the shed.",
      "The truck is next to the barn.",
      "Sorry, I can't find the cable."
    ]
  },
  {
    "id": 708,
    "title": "Days and Time",
    "emoji": "⏰",
    "verbs": [
      "To Start",
      "To Finish",
      "To Wait",
      "To Come"
    ],
    "vocab": [
      {
        "en": "day",
        "pt": "dia"
      },
      {
        "en": "week",
        "pt": "semana"
      },
      {
        "en": "month",
        "pt": "mês"
      },
      {
        "en": "year",
        "pt": "ano"
      },
      {
        "en": "today",
        "pt": "hoje"
      },
      {
        "en": "tomorrow",
        "pt": "amanhã"
      },
      {
        "en": "yesterday",
        "pt": "ontem"
      },
      {
        "en": "Monday",
        "pt": "segunda-feira"
      },
      {
        "en": "Tuesday",
        "pt": "terça-feira"
      },
      {
        "en": "Wednesday",
        "pt": "quarta-feira"
      },
      {
        "en": "Thursday",
        "pt": "quinta-feira"
      },
      {
        "en": "Friday",
        "pt": "sexta-feira"
      },
      {
        "en": "Saturday",
        "pt": "sábado"
      },
      {
        "en": "Sunday",
        "pt": "domingo"
      },
      {
        "en": "now",
        "pt": "agora"
      },
      {
        "en": "o'clock",
        "pt": "em ponto"
      },
      {
        "en": "half past",
        "pt": "e meia"
      },
      {
        "en": "morning shift",
        "pt": "turno da manhã"
      },
      {
        "en": "schedule",
        "pt": "programação"
      },
      {
        "en": "planting season",
        "pt": "época de plantio"
      },
      {
        "en": "harvest time",
        "pt": "época de colheita"
      },
      {
        "en": "workday",
        "pt": "dia de trabalho"
      },
      {
        "en": "weekend",
        "pt": "fim de semana"
      },
      {
        "en": "delivery",
        "pt": "entrega"
      },
      {
        "en": "appointment",
        "pt": "compromisso / hora marcada"
      },
      {
        "en": "calendar",
        "pt": "calendário"
      },
      {
        "en": "overtime",
        "pt": "hora extra"
      },
      {
        "en": "deadline",
        "pt": "prazo"
      },
      {
        "en": "on time",
        "pt": "no horário"
      },
      {
        "en": "next week",
        "pt": "semana que vem"
      }
    ],
    "expressions": [
      {
        "expr": "What time is it?",
        "meaning": "Que horas são?",
        "example": "What time is it? — It's six o'clock."
      },
      {
        "expr": "What time do you start?",
        "meaning": "Que horas você começa?",
        "example": "What time do you start? — At six in the morning."
      },
      {
        "expr": "See you on Monday.",
        "meaning": "Até segunda. — dia da semana leva on",
        "example": "Have a good weekend. See you on Monday!"
      },
      {
        "expr": "The part arrives on Friday.",
        "meaning": "A peça chega na sexta.",
        "example": "Don't worry — the part arrives on Friday."
      }
    ],
    "sentences": [
      "What time is it?",
      "It's six o'clock.",
      "I start work at six in the morning.",
      "The delivery arrives on Friday.",
      "Today is Wednesday.",
      "Tomorrow is my day off.",
      "The harvest starts next week.",
      "We finish at half past five."
    ],
    "grammar": {
      "title": "at, on, in — as três preposições de tempo",
      "rules": [
        "at + hora: at six o'clock, at half past five.",
        "on + dia: on Monday, on Friday, on the weekend.",
        "in + mês, ano ou parte do dia: in March, in 2026, in the morning.",
        "⚠️ Dia da semana em inglês SEMPRE com letra maiúscula: Monday, não monday."
      ],
      "table": {
        "headers": [
          "Preposição",
          "Usa com",
          "Exemplo"
        ],
        "rows": [
          [
            "at",
            "hora exata",
            "at six o'clock"
          ],
          [
            "on",
            "dia da semana / data",
            "on Friday"
          ],
          [
            "in",
            "mês, ano, parte do dia",
            "in the morning"
          ],
          [
            "—",
            "today, tomorrow, yesterday",
            "I work tomorrow (sem preposição!)"
          ],
          [
            "next / last",
            "semana, mês, ano",
            "next week, last year"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu começo às seis horas.\"",
        "a": "I start at six o'clock.",
        "opts": [
          "I start at six o'clock.",
          "I start in six o'clock.",
          "I start on six o'clock.",
          "I start six o'clock."
        ],
        "why": "Hora exata leva at."
      },
      {
        "q": "\"A peça chega na sexta.\"",
        "a": "The part arrives on Friday.",
        "opts": [
          "The part arrives on Friday.",
          "The part arrives in Friday.",
          "The part arrives at Friday.",
          "The part arrive on Friday."
        ],
        "why": "Dia da semana leva on. E part é singular: arrives com -s."
      },
      {
        "q": "\"Eu trabalho amanhã.\"",
        "a": "I work tomorrow.",
        "opts": [
          "I work tomorrow.",
          "I work in tomorrow.",
          "I work on tomorrow.",
          "I work at tomorrow."
        ],
        "why": "today, tomorrow e yesterday não levam preposição nenhuma."
      },
      {
        "q": "Que dia vem depois de Wednesday?",
        "a": "Thursday",
        "opts": [
          "Thursday",
          "Tuesday",
          "Saturday",
          "Sunday"
        ],
        "why": "A ordem é Monday, Tuesday, Wednesday, Thursday, Friday."
      },
      {
        "q": "\"São cinco e meia.\"",
        "a": "It's half past five.",
        "opts": [
          "It's half past five.",
          "It's five and half.",
          "It's half to five.",
          "It's five half."
        ],
        "why": "half past + a hora que já passou. half TO não existe; o oposto é 'quarter to'."
      }
    ],
    "speak": [
      "What time is it?",
      "I start work at six in the morning.",
      "The delivery arrives on Friday.",
      "Tomorrow is my day off.",
      "See you on Monday!"
    ]
  },
  {
    "id": 709,
    "title": "Family and People",
    "emoji": "👨‍👩‍👧",
    "verbs": [
      "To Have",
      "To Know",
      "To Help",
      "To Call"
    ],
    "vocab": [
      {
        "en": "family",
        "pt": "família"
      },
      {
        "en": "father",
        "pt": "pai"
      },
      {
        "en": "mother",
        "pt": "mãe"
      },
      {
        "en": "brother",
        "pt": "irmão"
      },
      {
        "en": "sister",
        "pt": "irmã"
      },
      {
        "en": "son",
        "pt": "filho"
      },
      {
        "en": "daughter",
        "pt": "filha"
      },
      {
        "en": "wife",
        "pt": "esposa"
      },
      {
        "en": "husband",
        "pt": "marido"
      },
      {
        "en": "man",
        "pt": "homem"
      },
      {
        "en": "woman",
        "pt": "mulher"
      },
      {
        "en": "people",
        "pt": "pessoas"
      },
      {
        "en": "my",
        "pt": "meu / minha"
      },
      {
        "en": "your",
        "pt": "seu / sua"
      },
      {
        "en": "his / her",
        "pt": "dele / dela"
      },
      {
        "en": "manager",
        "pt": "gerente"
      },
      {
        "en": "worker",
        "pt": "trabalhador"
      },
      {
        "en": "colleague",
        "pt": "colega de trabalho"
      },
      {
        "en": "customer",
        "pt": "cliente"
      },
      {
        "en": "supplier",
        "pt": "fornecedor"
      },
      {
        "en": "owner",
        "pt": "dono"
      },
      {
        "en": "partner",
        "pt": "sócio"
      },
      {
        "en": "neighbor",
        "pt": "vizinho"
      },
      {
        "en": "engineer",
        "pt": "engenheiro"
      },
      {
        "en": "agronomist",
        "pt": "agrônomo"
      },
      {
        "en": "trainee",
        "pt": "estagiário"
      },
      {
        "en": "supervisor",
        "pt": "supervisor"
      },
      {
        "en": "contact",
        "pt": "contato"
      },
      {
        "en": "staff",
        "pt": "pessoal / quadro"
      },
      {
        "en": "to help",
        "pt": "ajudar"
      }
    ],
    "expressions": [
      {
        "expr": "This is my…",
        "meaning": "Este é o meu… — apresentar alguém",
        "example": "Jack, this is my colleague Pedro."
      },
      {
        "expr": "Do you have…?",
        "meaning": "Você tem…?",
        "example": "Do you have brothers and sisters?"
      },
      {
        "expr": "He works with me.",
        "meaning": "Ele trabalha comigo.",
        "example": "Pedro? He works with me at GPS Tronic."
      },
      {
        "expr": "Can you help me?",
        "meaning": "Você pode me ajudar?",
        "example": "Can you help me with this part?"
      }
    ],
    "sentences": [
      "This is my brother.",
      "My father is a farmer.",
      "I have two sisters.",
      "Do you have a big family?",
      "Pedro is my colleague. He works with me.",
      "The owner of the farm is Mr. Silva.",
      "Her name is Ana. She's an agronomist.",
      "Can you help me, please?"
    ],
    "grammar": {
      "title": "have / has e os possessivos my, your, his, her",
      "rules": [
        "I / you / we / they → have. he / she / it → has. É a única mudança.",
        "my, your, his, her vêm ANTES da pessoa ou coisa: my brother, her name.",
        "⚠️ his é 'dele' e her é 'dela' — o dono é quem manda, não a coisa possuída.",
        "people já é o plural de person. Nunca peoples."
      ],
      "table": {
        "headers": [
          "Pessoa",
          "Verbo",
          "Possessivo",
          "Exemplo"
        ],
        "rows": [
          [
            "I",
            "have",
            "my",
            "I have my toolbox."
          ],
          [
            "you",
            "have",
            "your",
            "You have your helmet."
          ],
          [
            "he",
            "has",
            "his",
            "He has his own truck."
          ],
          [
            "she",
            "has",
            "her",
            "She has her badge."
          ],
          [
            "they",
            "have",
            "their",
            "They have their tools."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Ele tem um caminhão.\"",
        "a": "He has a truck.",
        "opts": [
          "He has a truck.",
          "He have a truck.",
          "He has an truck.",
          "He is have a truck."
        ],
        "why": "he / she / it pedem has, nunca have."
      },
      {
        "q": "\"O nome dela é Ana.\"",
        "a": "Her name is Ana.",
        "opts": [
          "Her name is Ana.",
          "His name is Ana.",
          "Her name are Ana.",
          "She name is Ana."
        ],
        "why": "Ana é mulher, então her. O possessivo segue o dono, não a coisa."
      },
      {
        "q": "\"Eu tenho duas irmãs.\"",
        "a": "I have two sisters.",
        "opts": [
          "I have two sisters.",
          "I has two sisters.",
          "I have two sister.",
          "I am two sisters."
        ],
        "why": "I sempre com have, e duas coisas pedem o -s do plural."
      },
      {
        "q": "\"Quantas pessoas trabalham aqui?\"",
        "a": "How many people work here?",
        "opts": [
          "How many people work here?",
          "How many peoples work here?",
          "How many person work here?",
          "How much people work here?"
        ],
        "why": "people já é plural de person. peoples não existe."
      },
      {
        "q": "\"Você pode me ajudar?\"",
        "a": "Can you help me?",
        "opts": [
          "Can you help me?",
          "Can you help I?",
          "You can help me?",
          "Can you to help me?"
        ],
        "why": "Depois de can vem o verbo puro, e o objeto é me, não I."
      }
    ],
    "speak": [
      "This is my colleague, Pedro.",
      "My father is a farmer.",
      "I have two sisters.",
      "She's an agronomist. Her name is Ana.",
      "Can you help me, please?"
    ]
  },
  {
    "id": 710,
    "title": "Food and the Crops",
    "emoji": "🍽️",
    "verbs": [
      "To Eat",
      "To Drink",
      "To Grow",
      "To Plant"
    ],
    "vocab": [
      {
        "en": "food",
        "pt": "comida"
      },
      {
        "en": "bread",
        "pt": "pão"
      },
      {
        "en": "rice",
        "pt": "arroz"
      },
      {
        "en": "beans",
        "pt": "feijão"
      },
      {
        "en": "meat",
        "pt": "carne"
      },
      {
        "en": "chicken",
        "pt": "frango"
      },
      {
        "en": "fruit",
        "pt": "fruta"
      },
      {
        "en": "vegetable",
        "pt": "verdura / legume"
      },
      {
        "en": "egg",
        "pt": "ovo"
      },
      {
        "en": "coffee",
        "pt": "café"
      },
      {
        "en": "milk",
        "pt": "leite"
      },
      {
        "en": "breakfast",
        "pt": "café da manhã"
      },
      {
        "en": "dinner",
        "pt": "jantar"
      },
      {
        "en": "to eat",
        "pt": "comer"
      },
      {
        "en": "to drink",
        "pt": "beber"
      },
      {
        "en": "cotton",
        "pt": "algodão"
      },
      {
        "en": "sugarcane",
        "pt": "cana-de-açúcar"
      },
      {
        "en": "grain",
        "pt": "grão"
      },
      {
        "en": "to grow",
        "pt": "cultivar / crescer"
      },
      {
        "en": "to plant",
        "pt": "plantar"
      },
      {
        "en": "to harvest",
        "pt": "colher"
      },
      {
        "en": "yield",
        "pt": "produtividade"
      },
      {
        "en": "fertilizer",
        "pt": "fertilizante"
      },
      {
        "en": "pesticide",
        "pt": "defensivo"
      },
      {
        "en": "irrigation",
        "pt": "irrigação"
      },
      {
        "en": "cattle",
        "pt": "gado"
      },
      {
        "en": "mill",
        "pt": "usina / moinho"
      },
      {
        "en": "export",
        "pt": "exportação"
      },
      {
        "en": "market",
        "pt": "mercado"
      },
      {
        "en": "price",
        "pt": "preço"
      }
    ],
    "expressions": [
      {
        "expr": "I'm hungry.",
        "meaning": "Estou com fome. — é SER, não TER",
        "example": "It's noon and I'm hungry."
      },
      {
        "expr": "What do you grow here?",
        "meaning": "O que vocês cultivam aqui?",
        "example": "What do you grow here? — Soybean and corn."
      },
      {
        "expr": "Let's have lunch.",
        "meaning": "Vamos almoçar. — have serve para refeição",
        "example": "It's twelve. Let's have lunch!"
      },
      {
        "expr": "Would you like some coffee?",
        "meaning": "Você aceita um café? — o convite educado",
        "example": "Would you like some coffee, Jack?"
      }
    ],
    "sentences": [
      "I'm hungry. Let's have lunch.",
      "Would you like some coffee?",
      "We grow soybean and corn here.",
      "I eat rice and beans every day.",
      "The farm plants cotton in October.",
      "We harvest the corn in July.",
      "The price of grain is good this year.",
      "Brazil exports a lot of soybean."
    ],
    "grammar": {
      "title": "some e any — quantidade sem número",
      "rules": [
        "Comida e líquido muitas vezes não se contam: water, rice, coffee, corn. Não levam a nem plural.",
        "Use some em frases afirmativas: I need some water.",
        "Use any em perguntas e negativas: Do you have any coffee? / We don't have any fuel.",
        "⚠️ Com incontável o verbo é sempre singular: The rice IS good, nunca are."
      ],
      "table": {
        "headers": [
          "Tipo",
          "Exemplo",
          "Afirmativa",
          "Pergunta / negativa"
        ],
        "rows": [
          [
            "contável",
            "bag, egg, tractor",
            "some bags",
            "any bags"
          ],
          [
            "incontável",
            "water, rice, corn",
            "some water",
            "any water"
          ],
          [
            "1 unidade",
            "an egg",
            "an egg",
            "—"
          ],
          [
            "verbo (incontável)",
            "rice",
            "The rice is good.",
            "Is the rice good?"
          ],
          [
            "muito",
            "a lot of",
            "a lot of grain",
            "much grain (em negativa)"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu preciso de um pouco de água.\"",
        "a": "I need some water.",
        "opts": [
          "I need some water.",
          "I need a water.",
          "I need some waters.",
          "I need any water."
        ],
        "why": "water é incontável: sem a, sem plural. Em afirmativa, some."
      },
      {
        "q": "\"Vocês têm combustível?\"",
        "a": "Do you have any fuel?",
        "opts": [
          "Do you have any fuel?",
          "Do you have some fuel?",
          "Do you have a fuel?",
          "Have you any fuels?"
        ],
        "why": "Em pergunta o normal é any. (some em pergunta só quando você está oferecendo algo.)"
      },
      {
        "q": "\"Nós cultivamos soja e milho aqui.\"",
        "a": "We grow soybean and corn here.",
        "opts": [
          "We grow soybean and corn here.",
          "We grows soybean and corn here.",
          "We growing soybean and corn here.",
          "We grow soybeans and corns here."
        ],
        "why": "we pede o verbo puro (sem -s), e corn é incontável — não ganha plural."
      },
      {
        "q": "\"Estou com fome.\"",
        "a": "I'm hungry.",
        "opts": [
          "I'm hungry.",
          "I have hungry.",
          "I have hunger.",
          "I'm hunger."
        ],
        "why": "Fome e sede em inglês são com to be: I AM hungry."
      },
      {
        "q": "\"O preço do grão está bom este ano.\"",
        "a": "The price of grain is good this year.",
        "opts": [
          "The price of grain is good this year.",
          "The price of grain are good this year.",
          "The price of grains are good this year.",
          "The price of grain is good in this year."
        ],
        "why": "price é singular → is. E this year não leva preposição."
      }
    ],
    "speak": [
      "I'm hungry. Let's have lunch.",
      "Would you like some coffee?",
      "We grow soybean and corn here.",
      "We harvest the corn in July.",
      "Do you have any water?"
    ]
  },
  {
    "id": 711,
    "title": "Tools and Machines",
    "emoji": "🔧",
    "verbs": [
      "To Use",
      "To Fix",
      "To Open",
      "To Check"
    ],
    "vocab": [
      {
        "en": "tool",
        "pt": "ferramenta"
      },
      {
        "en": "to use",
        "pt": "usar"
      },
      {
        "en": "to fix",
        "pt": "consertar"
      },
      {
        "en": "to open",
        "pt": "abrir"
      },
      {
        "en": "to close",
        "pt": "fechar"
      },
      {
        "en": "to check",
        "pt": "verificar"
      },
      {
        "en": "heavy",
        "pt": "pesado"
      },
      {
        "en": "strong",
        "pt": "forte"
      },
      {
        "en": "broken",
        "pt": "quebrado"
      },
      {
        "en": "ready",
        "pt": "pronto"
      },
      {
        "en": "careful",
        "pt": "cuidadoso"
      },
      {
        "en": "difficult",
        "pt": "difícil"
      },
      {
        "en": "easy",
        "pt": "fácil"
      },
      {
        "en": "again",
        "pt": "de novo"
      },
      {
        "en": "slowly",
        "pt": "devagar"
      },
      {
        "en": "hammer",
        "pt": "martelo"
      },
      {
        "en": "pliers",
        "pt": "alicate"
      },
      {
        "en": "drill",
        "pt": "furadeira"
      },
      {
        "en": "planter",
        "pt": "plantadeira"
      },
      {
        "en": "sprayer",
        "pt": "pulverizador"
      },
      {
        "en": "trailer",
        "pt": "carreta / reboque"
      },
      {
        "en": "engine",
        "pt": "motor"
      },
      {
        "en": "battery",
        "pt": "bateria"
      },
      {
        "en": "oil",
        "pt": "óleo"
      },
      {
        "en": "wire",
        "pt": "fio"
      },
      {
        "en": "sensor",
        "pt": "sensor"
      },
      {
        "en": "autopilot",
        "pt": "piloto automático"
      },
      {
        "en": "error code",
        "pt": "código de erro"
      },
      {
        "en": "manual",
        "pt": "manual"
      },
      {
        "en": "signal",
        "pt": "sinal"
      }
    ],
    "expressions": [
      {
        "expr": "It's broken.",
        "meaning": "Está quebrado.",
        "example": "Don't use that drill — it's broken."
      },
      {
        "expr": "Can you fix it?",
        "meaning": "Você consegue consertar?",
        "example": "The sensor is bad. Can you fix it?"
      },
      {
        "expr": "Be careful!",
        "meaning": "Cuidado! — o aviso mais importante da oficina",
        "example": "Be careful, that part is heavy!"
      },
      {
        "expr": "Slowly, please.",
        "meaning": "Devagar, por favor. — peça para falarem mais devagar",
        "example": "Sorry, slowly please. My English is basic."
      }
    ],
    "sentences": [
      "Can you fix the engine?",
      "This part is broken.",
      "Be careful! That box is heavy.",
      "I use a wrench and a hammer.",
      "Check the oil, please.",
      "The autopilot has no signal.",
      "What does this error code mean?",
      "The tractor is ready."
    ],
    "grammar": {
      "title": "can e can't — conseguir, saber e poder",
      "rules": [
        "can serve para os três: habilidade, permissão e possibilidade. I can drive a tractor.",
        "Depois de can vem o verbo PURO, sem to: I can fix it, nunca I can to fix it.",
        "can não muda com he / she / it: He can fix it, nunca He cans.",
        "A pergunta inverte: Can you fix it? A negativa é can't (cannot)."
      ],
      "table": {
        "headers": [
          "Uso",
          "Exemplo",
          "Tradução"
        ],
        "rows": [
          [
            "habilidade",
            "I can drive a tractor.",
            "Sei dirigir trator."
          ],
          [
            "pedido",
            "Can you help me?",
            "Pode me ajudar?"
          ],
          [
            "permissão",
            "You can use my tools.",
            "Pode usar minhas ferramentas."
          ],
          [
            "negativa",
            "I can't fix it today.",
            "Não consigo consertar hoje."
          ],
          [
            "❌ erro",
            "I can to fix it.",
            "sem to depois de can"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu sei dirigir trator.\"",
        "a": "I can drive a tractor.",
        "opts": [
          "I can drive a tractor.",
          "I can to drive a tractor.",
          "I can driving a tractor.",
          "I know drive a tractor."
        ],
        "why": "Depois de can vem o verbo puro, sem to e sem -ing."
      },
      {
        "q": "\"Ele consegue consertar o motor.\"",
        "a": "He can fix the engine.",
        "opts": [
          "He can fix the engine.",
          "He cans fix the engine.",
          "He can fixes the engine.",
          "He can to fix the engine."
        ],
        "why": "can nunca muda de forma — nem com he, she ou it."
      },
      {
        "q": "\"Está quebrado.\"",
        "a": "It's broken.",
        "opts": [
          "It's broken.",
          "It's break.",
          "It has broken.",
          "It's broke."
        ],
        "why": "broken é o adjetivo (particípio). It's broke existe na gíria, mas significa 'estou sem dinheiro'."
      },
      {
        "q": "Você não entendeu o que Jack disse. O que você pede?",
        "a": "Slowly, please.",
        "opts": [
          "Slowly, please.",
          "Slow, please.",
          "More slow, please.",
          "Slowly you, please."
        ],
        "why": "slowly é o advérbio — diz COMO falar. slow é o adjetivo."
      },
      {
        "q": "\"O piloto automático está sem sinal.\"",
        "a": "The autopilot has no signal.",
        "opts": [
          "The autopilot has no signal.",
          "The autopilot have no signal.",
          "The autopilot has not signal.",
          "The autopilot is no signal."
        ],
        "why": "autopilot é it → has. E has no + substantivo é o jeito curto de negar posse."
      }
    ],
    "speak": [
      "Can you fix the engine?",
      "This part is broken.",
      "Be careful! That box is heavy.",
      "Check the oil, please.",
      "Sorry, slowly please. My English is basic."
    ]
  },
  {
    "id": 712,
    "title": "Please, Thank You and Sorry",
    "emoji": "🙏",
    "verbs": [
      "To Ask",
      "To Give",
      "To Wait",
      "To Understand"
    ],
    "vocab": [
      {
        "en": "thanks",
        "pt": "obrigado (informal)"
      },
      {
        "en": "you're welcome",
        "pt": "de nada"
      },
      {
        "en": "excuse me",
        "pt": "com licença"
      },
      {
        "en": "of course",
        "pt": "claro"
      },
      {
        "en": "no problem",
        "pt": "sem problema"
      },
      {
        "en": "sure",
        "pt": "claro / pode deixar"
      },
      {
        "en": "maybe",
        "pt": "talvez"
      },
      {
        "en": "I don't understand",
        "pt": "eu não entendo"
      },
      {
        "en": "I don't know",
        "pt": "eu não sei"
      },
      {
        "en": "to repeat",
        "pt": "repetir"
      },
      {
        "en": "to understand",
        "pt": "entender"
      },
      {
        "en": "to wait",
        "pt": "esperar"
      },
      {
        "en": "to give",
        "pt": "dar"
      },
      {
        "en": "right",
        "pt": "certo"
      },
      {
        "en": "wrong",
        "pt": "errado"
      },
      {
        "en": "hold this",
        "pt": "segure isto"
      },
      {
        "en": "pass me",
        "pt": "me passa"
      },
      {
        "en": "hand me",
        "pt": "me entrega"
      },
      {
        "en": "watch out",
        "pt": "atenção / cuidado"
      },
      {
        "en": "stop",
        "pt": "pare"
      },
      {
        "en": "wait a minute",
        "pt": "espere um minuto"
      },
      {
        "en": "safety",
        "pt": "segurança"
      },
      {
        "en": "danger",
        "pt": "perigo"
      },
      {
        "en": "glove",
        "pt": "luva"
      },
      {
        "en": "boot",
        "pt": "bota"
      },
      {
        "en": "done",
        "pt": "pronto / feito"
      },
      {
        "en": "almost",
        "pt": "quase"
      },
      {
        "en": "shift change",
        "pt": "troca de turno"
      },
      {
        "en": "report",
        "pt": "relatório"
      },
      {
        "en": "to send",
        "pt": "enviar"
      }
    ],
    "expressions": [
      {
        "expr": "Sorry, I don't understand.",
        "meaning": "Desculpa, não entendi. — a frase mais honesta e mais útil do seu inglês",
        "example": "Sorry, I don't understand. Can you repeat?"
      },
      {
        "expr": "Can you repeat, please?",
        "meaning": "Pode repetir, por favor?",
        "example": "Can you repeat that, please? Slowly."
      },
      {
        "expr": "Pass me the wrench, please.",
        "meaning": "Me passa a chave, por favor.",
        "example": "Pass me the wrench, please. The big one."
      },
      {
        "expr": "You're welcome.",
        "meaning": "De nada. — a resposta a thank you",
        "example": "Thanks a lot! — You're welcome."
      }
    ],
    "sentences": [
      "Thank you very much!",
      "You're welcome.",
      "Sorry, I don't understand.",
      "Can you repeat that, please?",
      "Pass me the pliers, please.",
      "Wait a minute, please.",
      "Watch out! Be careful.",
      "It's done. The tractor is ready."
    ],
    "grammar": {
      "title": "Pedir sem soar grosso: please, can you, could you",
      "rules": [
        "O imperativo sozinho (Give me the wrench) soa como ordem. Com please já melhora muito.",
        "Can you…? é o pedido do dia a dia. Could you…? é o mesmo pedido, mais educado.",
        "please pode ir no começo ou no fim: Please wait. / Wait, please.",
        "⚠️ Sorry é para se desculpar do que já aconteceu. Excuse me é para pedir licença ANTES."
      ],
      "table": {
        "headers": [
          "Situação",
          "Direto demais",
          "Educado",
          "Bem educado"
        ],
        "rows": [
          [
            "pedir ferramenta",
            "Give me the wrench.",
            "Can you pass me the wrench?",
            "Could you pass me the wrench, please?"
          ],
          [
            "pedir para repetir",
            "Repeat.",
            "Can you repeat?",
            "Could you repeat that, please?"
          ],
          [
            "pedir para esperar",
            "Wait.",
            "Wait a minute, please.",
            "Could you wait a minute?"
          ],
          [
            "pedir ajuda",
            "Help me.",
            "Can you help me?",
            "Could you help me, please?"
          ],
          [
            "avisar de perigo",
            "Watch out!",
            "Watch out!",
            "Watch out! (perigo é sempre direto)"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Você não entendeu o que Jack falou. O que você diz?",
        "a": "Sorry, I don't understand.",
        "opts": [
          "Sorry, I don't understand.",
          "Sorry, I don't understood.",
          "Sorry, I no understand.",
          "Sorry, I am not understand."
        ],
        "why": "A negativa do present simple é don't + verbo puro."
      },
      {
        "q": "Jeito mais educado de pedir a chave:",
        "a": "Could you pass me the wrench, please?",
        "opts": [
          "Could you pass me the wrench, please?",
          "Give me the wrench.",
          "Pass the wrench.",
          "I want the wrench."
        ],
        "why": "Could you…? é o pedido mais educado. Imperativo sozinho soa como ordem."
      },
      {
        "q": "Alguém diz \"Thank you!\". Você responde:",
        "a": "You're welcome.",
        "opts": [
          "You're welcome.",
          "Welcome.",
          "You welcome.",
          "Thanks you."
        ],
        "why": "You're welcome (= you are welcome) é a resposta padrão. Welcome sozinho é 'bem-vindo'."
      },
      {
        "q": "Tem uma peça caindo perto do colega. O que você grita?",
        "a": "Watch out!",
        "opts": [
          "Watch out!",
          "Look out the window!",
          "Attention me!",
          "Careful you!"
        ],
        "why": "Watch out! é o aviso de perigo imediato. Perigo não pede frase longa."
      },
      {
        "q": "Você vai passar por alguém que está no caminho. O que diz?",
        "a": "Excuse me.",
        "opts": [
          "Excuse me.",
          "Sorry.",
          "Please.",
          "Thank you."
        ],
        "why": "Excuse me pede licença ANTES. Sorry é depois, quando já esbarrou."
      }
    ],
    "speak": [
      "Thank you very much!",
      "Sorry, I don't understand. Can you repeat?",
      "Pass me the wrench, please.",
      "Watch out! Be careful.",
      "It's done. The tractor is ready."
    ]
  }
];

window.LESSONS_AGRO = LESSONS_AGRO;
