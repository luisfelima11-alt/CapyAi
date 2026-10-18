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
  },
  {"id":713,"title":"What Do You Do? (Work & Study)","emoji":"💼","verbs":["To Work","To Study","To Fix","To Drive"],"vocab":[{"en":"to work","pt":"trabalhar"},{"en":"to study","pt":"estudar"},{"en":"to speak","pt":"falar"},{"en":"to read","pt":"ler"},{"en":"to like","pt":"gostar de"},{"en":"to live","pt":"morar / viver"},{"en":"to learn","pt":"aprender"},{"en":"to talk","pt":"conversar"},{"en":"every day","pt":"todo dia"},{"en":"at night","pt":"à noite"},{"en":"in the morning","pt":"de manhã"},{"en":"university","pt":"faculdade / universidade"},{"en":"student","pt":"estudante"},{"en":"city","pt":"cidade"},{"en":"a little","pt":"um pouco"},{"en":"to fix","pt":"consertar"},{"en":"to drive","pt":"dirigir"},{"en":"to check","pt":"verificar"},{"en":"technician","pt":"técnico"},{"en":"agronomy","pt":"agronomia"},{"en":"job","pt":"trabalho / emprego"},{"en":"company","pt":"empresa"},{"en":"customer","pt":"cliente"},{"en":"manual","pt":"manual técnico"},{"en":"system","pt":"sistema"},{"en":"GPS","pt":"GPS"},{"en":"antenna","pt":"antena"},{"en":"boss","pt":"chefe"},{"en":"colleague","pt":"colega de trabalho"},{"en":"workshop","pt":"oficina"}],"expressions":[{"expr":"What do you do?","meaning":"O que você faz? (qual é o seu trabalho)","example":"What do you do? — I fix GPS systems on tractors."},{"expr":"I work from Monday to Friday.","meaning":"Eu trabalho de segunda a sexta.","example":"I work from Monday to Friday at GPS Tronic."},{"expr":"I study agronomy at night.","meaning":"Eu estudo agronomia à noite.","example":"I work all day and I study agronomy at night."},{"expr":"I don't speak much English.","meaning":"Eu não falo muito inglês.","example":"I read manuals, but I don't speak much English."}],"sentences":["What do you do?","I fix GPS systems on tractors.","I study agronomy at night.","He checks the antennas every day.","My boss talks to the customers.","Does Pedro work with you?","Yes, he does. He works here.","I read manuals in English."],"grammar":{"title":"Padrão: falar da sua rotina (work / works)","rules":["Para I, you, we, they o verbo fica puro: I work, I study, we fix.","Para he, she, it o verbo ganha -s ou -es: He works, he checks, he fixes, he studies.","⚠️ Na pergunta (Do/Does) e na negativa (don't/doesn't), o verbo volta a ficar puro: Does Pedro work here?","A resposta curta repete o do/does: Yes, I do. / Yes, he does. / No, he doesn't."],"table":{"headers":["Pessoa","Afirmativa","Negativa","Pergunta"],"rows":[["I / you / we / they","I work here.","I don't work here.","Do you work here?"],["he / she / it","He works here.","He doesn't work here.","Does he work here?"],["verbo em -x (fix)","He fixes GPS.","He doesn't fix GPS.","Does he fix GPS?"],["verbo em -y (study)","He studies at night.","He doesn't study.","Does he study?"]]}},"quiz":[{"q":"\"Ele verifica as antenas todo dia.\"","a":"He checks the antennas every day.","opts":["He checks the antennas every day.","He check the antennas every day.","He is check the antennas every day.","He checking the antennas every day."],"why":"Com he, she ou it na rotina, o verbo ganha -s: checks."},{"q":"\"O Pedro trabalha aqui?\"","a":"Does Pedro work here?","opts":["Does Pedro work here?","Does Pedro works here?","Do Pedro work here?","Is Pedro work here?"],"why":"O -s já está no Does, então o verbo work fica puro."},{"q":"\"Ele conserta sistemas de GPS.\"","a":"He fixes GPS systems.","opts":["He fixes GPS systems.","He fixs GPS systems.","He fix GPS systems.","He is fixes GPS systems."],"why":"Verbos terminados em -x, -ch, -sh, -s ou -o ganham -es com he/she/it."},{"q":"\"Eu estudo agronomia à noite.\"","a":"I study agronomy at night.","opts":["I study agronomy at night.","I studies agronomy at night.","I study agronomy in night.","I am study agronomy at night."],"why":"Com I o verbo fica puro (study), e 'à noite' é sempre at night."},{"q":"Jack pergunta: \"Do you like your job?\". Você gosta. Responda:","a":"Yes, I do.","opts":["Yes, I do.","Yes, I like.","Yes, I am.","Yes, I does."],"why":"A resposta curta em inglês repete o auxiliar da pergunta: Do you...? -> Yes, I do."}],"speak":["What do you do?","I fix GPS systems on tractors.","I study agronomy at night.","He checks the antennas every day.","Does Pedro work with you?"]},
  {"id":714,"title":"Every Day at Six (Daily Routine)","emoji":"⏰","verbs":["To Wake Up","To Start","To Finish","To Eat"],"vocab":[{"en":"to wake up","pt":"acordar"},{"en":"to get up","pt":"levantar da cama"},{"en":"breakfast","pt":"café da manhã"},{"en":"lunch","pt":"almoço"},{"en":"dinner","pt":"jantar"},{"en":"home","pt":"casa / lar"},{"en":"always","pt":"sempre"},{"en":"usually","pt":"geralmente"},{"en":"sometimes","pt":"às vezes"},{"en":"never","pt":"nunca"},{"en":"early","pt":"cedo"},{"en":"late","pt":"atrasado / tarde"},{"en":"hour","pt":"hora"},{"en":"minute","pt":"minuto"},{"en":"before","pt":"antes de"},{"en":"after","pt":"depois de"},{"en":"until","pt":"até (horário)"},{"en":"shift","pt":"turno"},{"en":"break","pt":"parada / intervalo"},{"en":"service","pt":"revisão / manutenção"},{"en":"harvest","pt":"colheita"},{"en":"to start","pt":"começar"},{"en":"to finish","pt":"terminar"},{"en":"shed","pt":"barracão"},{"en":"overtime","pt":"hora extra"},{"en":"on time","pt":"no horário / pontual"},{"en":"every Monday","pt":"toda segunda-feira"},{"en":"at noon","pt":"ao meio-dia"},{"en":"field work","pt":"trabalho de campo"},{"en":"rest","pt":"descanso"}],"expressions":[{"expr":"What time does the shift start?","meaning":"Que horas começa o turno?","example":"What time does the shift start? — It starts at six."},{"expr":"I always wake up at five.","meaning":"Eu sempre acordo às cinco.","example":"I always wake up at five in the morning."},{"expr":"How long is the break?","meaning":"Quanto tempo dura a parada?","example":"How long is the break? — One hour."},{"expr":"We never work on Sunday.","meaning":"Nós nunca trabalhamos no domingo.","example":"Sometimes we work on Saturday, but we never work on Sunday."}],"sentences":["What time does the shift start?","It starts at six o'clock.","I always wake up at five.","Usually I have breakfast at home.","Lunch is at half past eleven in the shed.","How long is the break?","In the harvest we work until eight.","We never work on Sunday."],"grammar":{"title":"Padrão: frequência (always, usually, sometimes, never)","rules":["always (sempre), usually (geralmente), sometimes (às vezes) e never (nunca) vêm ANTES do verbo normal: I always wake up at five.","Mas com o verbo to be (am, is, are), eles vêm DEPOIS: He is never late.","⚠️ never já é negativo — nunca use don't junto com never: We never work on Sunday.","every + dia não usa preposição: every Monday, every day."],"table":{"headers":["Palavra","Significado","Com verbo normal","Com to be"],"rows":[["always","sempre (100%)","I always wake up at five.","He is always on time."],["usually","geralmente","I usually eat at home.","The shed is usually open."],["sometimes","às vezes","Sometimes we work late.","It is sometimes cold."],["never","nunca (0%)","We never work on Sunday.","I am never late."]]}},"quiz":[{"q":"\"Eu sempre acordo às cinco.\"","a":"I always wake up at five.","opts":["I always wake up at five.","I wake up always at five.","I always wakes up at five.","I am always wake up at five."],"why":"always vem antes do verbo normal (wake up)."},{"q":"\"Nós nunca trabalhamos no domingo.\"","a":"We never work on Sunday.","opts":["We never work on Sunday.","We don't never work on Sunday.","We never works on Sunday.","We never work in Sunday."],"why":"never já nega sozinho (sem don't), e dias da semana usam on."},{"q":"\"Ele nunca se atrasa.\"","a":"He is never late.","opts":["He is never late.","He never is late.","He doesn't never late.","He has never late."],"why":"Com o verbo to be (is), o never vem depois do verbo."},{"q":"\"Quanto tempo dura o intervalo?\"","a":"How long is the break?","opts":["How long is the break?","How far is the break?","How many is the break?","What time is the break?"],"why":"How long pergunta duração de tempo; how far pergunta distância."},{"q":"\"Na colheita trabalhamos até as oito.\"","a":"In the harvest we work until eight.","opts":["In the harvest we work until eight.","In the harvest we work to eight.","In the harvest we works until eight.","On the harvest we work until eight."],"why":"until marca até que horário uma ação continua."}],"speak":["What time does the shift start?","I always wake up at five.","How long is the break?","In the harvest we work until eight.","We never work on Sunday."]},
  {"id":715,"title":"Do You Like Soccer? (Sports & Free Time)","emoji":"⚽","verbs":["To Like","To Love","To Play","To Prefer"],"vocab":[{"en":"to like","pt":"gostar de"},{"en":"to love","pt":"amar / adorar"},{"en":"to prefer","pt":"preferir"},{"en":"to play","pt":"jogar / brincar"},{"en":"to watch","pt":"assistir"},{"en":"soccer","pt":"futebol"},{"en":"handball","pt":"handebol"},{"en":"sport","pt":"esporte"},{"en":"game","pt":"jogo / partida"},{"en":"team","pt":"time / equipe"},{"en":"player","pt":"jogador"},{"en":"favorite","pt":"favorito"},{"en":"weekend","pt":"fim de semana"},{"en":"friend","pt":"amigo"},{"en":"free time","pt":"tempo livre"},{"en":"rodeo","pt":"rodeio"},{"en":"horse","pt":"cavalo"},{"en":"fishing","pt":"pescaria"},{"en":"river","pt":"rio"},{"en":"ranch","pt":"rancho / fazenda de gado"},{"en":"countryside","pt":"interior / zona rural"},{"en":"barbecue","pt":"churrasco"},{"en":"farm show","pt":"feira agropecuária"},{"en":"pickup truck","pt":"caminhonete"},{"en":"hat","pt":"chapéu"},{"en":"boots","pt":"botas"},{"en":"trail","pt":"trilha / estradinha"},{"en":"lake","pt":"lago / açude"},{"en":"to ride","pt":"andar a cavalo / pilotar"},{"en":"outdoor","pt":"ao ar livre"}],"expressions":[{"expr":"Do you like soccer?","meaning":"Você gosta de futebol? — sem 'of'","example":"Do you like soccer? — Yes, I love it!"},{"expr":"Yes, I love it!","meaning":"Sim, eu adoro! — o 'it' nunca some","example":"Do you like handball? — Yes, I love it!"},{"expr":"He prefers fishing.","meaning":"Ele prefere pescar.","example":"Pedro doesn't like soccer. He prefers fishing."},{"expr":"What do you do on weekends?","meaning":"O que você faz nos fins de semana?","example":"What do you do on weekends? — I play handball on Sundays."}],"sentences":["Do you like soccer?","Yes, I love it!","I also play handball on Sundays.","Handball is my favorite sport.","Does Pedro like soccer too?","No, he doesn't. He prefers fishing.","We go to the farm show every year.","I live in the countryside."],"grammar":{"title":"Padrão: falar do que você gosta (like, love, prefer)","rules":["⚠️ like não leva 'of': diga I like soccer, nunca I like of soccer.","Em inglês o objeto nunca fica vazio depois de like ou love: Yes, I love it! (nunca só 'Yes, I love').","Depois de like, love e prefer, se vier outro verbo, use -ing: I like playing soccer, He prefers fishing.","Com he/she/it: Does Pedro like...? -> Yes, he does. / No, he doesn't."],"table":{"headers":["Em português","Em inglês","Ponto de atenção"],"rows":[["Você gosta de futebol?","Do you like soccer?","sem 'of' depois de like"],["Sim, eu adoro!","Yes, I love it!","it obrigatório no fim"],["Eu gosto de jogar.","I like playing.","verbo seguinte ganha -ing"],["Ele prefere pescar.","He prefers fishing.","prefers com -s + fishing"]]}},"quiz":[{"q":"\"Você gosta de futebol?\"","a":"Do you like soccer?","opts":["Do you like soccer?","Do you like of soccer?","Are you like soccer?","Does you like soccer?"],"why":"like já significa 'gostar de' — nunca use of depois dele."},{"q":"Jack pergunta: \"Do you like soccer?\". Qual resposta está certa?","a":"Yes, I love it!","opts":["Yes, I love it!","Yes, I love!","Yes, I loves it!","Yes, I liking!"],"why":"love precisa de complemento em inglês: I love it!"},{"q":"\"O Pedro gosta de futebol?\"","a":"Does Pedro like soccer?","opts":["Does Pedro like soccer?","Does Pedro likes soccer?","Do Pedro like soccer?","Is Pedro like soccer?"],"why":"Com Pedro (he) usamos Does, e o verbo like fica sem -s."},{"q":"\"Ele prefere pescar.\"","a":"He prefers fishing.","opts":["He prefers fishing.","He prefer fishing.","He prefers to fishing.","He is prefer fishing."],"why":"Com he o verbo ganha -s (prefers) e a atividade vem com -ing (fishing)."},{"q":"\"Qual é o seu esporte favorito?\"","a":"What's your favorite sport?","opts":["What's your favorite sport?","What's your most favorite sport?","Which is your favorite of sport?","What your favorite sport is?"],"why":"favorite já significa 'o preferido', sem most."}],"speak":["Do you like soccer?","Yes, I love it!","I also play handball on Sundays.","He doesn't like it. He prefers fishing.","What do you do on weekends?"]},
  {"id":716,"title":"Country Music, Movies & Friends","emoji":"🎸","verbs":["To Listen","To Watch","To Sing","To Go"],"vocab":[{"en":"music","pt":"música"},{"en":"song","pt":"canção / música"},{"en":"singer","pt":"cantor / cantora"},{"en":"band","pt":"banda / grupo"},{"en":"guitar","pt":"violão / guitarra"},{"en":"movie","pt":"filme"},{"en":"series","pt":"série"},{"en":"car","pt":"carro"},{"en":"fast","pt":"rápido"},{"en":"also","pt":"também (no meio da frase)"},{"en":"too","pt":"também (no fim da frase)"},{"en":"together","pt":"juntos"},{"en":"church","pt":"igreja"},{"en":"party","pt":"festa"},{"en":"radio","pt":"rádio"},{"en":"country music","pt":"música country / sertanejo"},{"en":"cab","pt":"cabine (do trator/caminhão)"},{"en":"speaker","pt":"caixa de som / alto-falante"},{"en":"road trip","pt":"viagem de estrada"},{"en":"highway","pt":"rodovia / BR"},{"en":"truck stop","pt":"posto de parada de caminhão"},{"en":"festival","pt":"festa do peão / festival"},{"en":"stage","pt":"palco"},{"en":"crowd","pt":"multidão / galera"},{"en":"ticket","pt":"ingresso"},{"en":"cowboy","pt":"peão / cowboy"},{"en":"long road","pt":"estrada longa"},{"en":"sound","pt":"som"},{"en":"story","pt":"história"},{"en":"town","pt":"cidade do interior"}],"expressions":[{"expr":"Me too!","meaning":"Eu também! — concorda com frase afirmativa","example":"I like country music. — Me too!"},{"expr":"What music do you like?","meaning":"De que música você gosta?","example":"What music do you like? — I like Brazilian country music."},{"expr":"I listen to music in the tractor.","meaning":"Eu ouço música no trator. — listen pede TO","example":"I always listen to music in the tractor cab."},{"expr":"What's your favorite movie?","meaning":"Qual é o seu filme favorito?","example":"What's your favorite movie? — I love Fast and Furious."}],"sentences":["What music do you like?","I like Brazilian country music.","Me too! I listen to country music every day.","I listen to the radio in the truck.","I also watch movies at night.","Do you like fast cars?","Yes, I do! I like them too.","There is a big festival in our town."],"grammar":{"title":"Padrão: also, too e me too","rules":["also e too significam 'também', mas mudam de lugar na frase.","also vai no MEIO da frase, antes do verbo: I also play handball. / I also watch movies.","too vai no FIM da frase: I like country music too.","Para concordar rápido com alguém na conversa, diga apenas: Me too! (Eu também!)."],"table":{"headers":["Palavra","Posição","Exemplo"],"rows":[["also","antes do verbo","I also play guitar."],["too","no fim da frase","I like movies too."],["Me too!","resposta curta (positiva)","I love soccer. — Me too!"],["listen to","sempre com to","I listen to music in the cab."]]}},"quiz":[{"q":"\"Eu também assisto filmes.\"","a":"I also watch movies.","opts":["I also watch movies.","I too watch movies.","I watch also movies.","Also I watch movies too."],"why":"also entra no meio da frase, antes do verbo principal."},{"q":"\"Eu gosto de música country também.\"","a":"I like country music too.","opts":["I like country music too.","I too like country music.","I like too country music.","I like country music also too."],"why":"too vai sempre no final da frase."},{"q":"Jack diz: \"I love fast cars!\". Você também gosta. O que responde?","a":"Me too!","opts":["Me too!","I too!","Me also!","Yes, too!"],"why":"Me too! é a resposta natural para concordar com uma frase afirmativa."},{"q":"\"Eu ouço música no caminhão.\"","a":"I listen to music in the truck.","opts":["I listen to music in the truck.","I listen music in the truck.","I hear to music in the truck.","I listening to music in the truck."],"why":"O verbo listen sempre pede a preposição to antes do que você ouve: listen to music."},{"q":"\"Você assiste séries à noite?\"","a":"Do you watch series at night?","opts":["Do you watch series at night?","Do you watches series at night?","Are you watch series at night?","Do you watch series in the night?"],"why":"Do you + verbo puro (watch), e 'à noite' é at night."}],"speak":["What music do you like?","I like Brazilian country music.","Me too! I listen to music in the truck.","I also watch movies on weekends.","What's your favorite movie?"]},
  {"id":717,"title":"Can You Drive a Tractor?","emoji":"🚜","verbs":["To Drive","To Plant","To Load","To Help"],"vocab":[{"en":"can","pt":"saber / conseguir / poder"},{"en":"can't","pt":"não saber / não poder"},{"en":"to help","pt":"ajudar"},{"en":"to use","pt":"usar"},{"en":"to show","pt":"mostrar"},{"en":"to teach","pt":"ensinar"},{"en":"well","pt":"bem"},{"en":"fast","pt":"rápido"},{"en":"easy","pt":"fácil"},{"en":"hard","pt":"difícil / duro"},{"en":"of course","pt":"claro"},{"en":"sure","pt":"com certeza / claro"},{"en":"no problem","pt":"sem problema"},{"en":"phone","pt":"celular / telefone"},{"en":"computer","pt":"computador"},{"en":"to plant","pt":"plantar"},{"en":"to load","pt":"carregar (carga)"},{"en":"to unload","pt":"descarregar"},{"en":"to calibrate","pt":"calibrar"},{"en":"soybeans","pt":"soja"},{"en":"corn","pt":"milho"},{"en":"seed","pt":"semente"},{"en":"sprayer","pt":"pulverizador"},{"en":"planter","pt":"plantadeira"},{"en":"harvester","pt":"colheitadeira"},{"en":"license","pt":"habilitação / carteira"},{"en":"forklift","pt":"empilhadeira"},{"en":"bag","pt":"saca / big bag"},{"en":"weight","pt":"peso"},{"en":"operator","pt":"operador de máquina"}],"expressions":[{"expr":"Can you drive a tractor?","meaning":"Você sabe dirigir trator?","example":"Can you drive a tractor? — Yes, I can."},{"expr":"No, I can't. I don't have a license.","meaning":"Não, não posso. Não tenho habilitação.","example":"Can you drive the sprayer? — No, I can't. I don't have a license."},{"expr":"Can I use your phone?","meaning":"Posso usar o seu celular?","example":"Can I use your phone? — Of course!"},{"expr":"I can learn fast.","meaning":"Eu consigo aprender rápido.","example":"I speak a little English, but I can learn fast."}],"sentences":["Can you drive a tractor?","Yes, I can. I drive every day.","Can you load the truck?","Yes, I can. It's easy.","I can't drive the sprayer.","He can calibrate the GPS very well.","Can you help me with these bags?","Can I use your phone, please?"],"grammar":{"title":"Padrão: can e can't (habilidade e pedidos)","rules":["Depois de can e can't o verbo vem sempre puro: sem to e sem -s (I can drive, He can drive).","Para perguntar, coloque Can no começo da frase, sem usar do/does: Can you plant soybeans?","A resposta curta repete o can: Yes, I can. / No, I can't.","Can you...? pede um favor para outra pessoa; Can I...? pede permissão para você fazer algo."],"table":{"headers":["Intenção","Inglês","Resposta"],"rows":[["Dizer que sabe","I can drive a tractor.","—"],["Dizer que não sabe","I can't drive the sprayer.","—"],["Perguntar se sabe","Can you load the truck?","Yes, I can. / No, I can't."],["Pedir ajuda","Can you help me?","Sure! / Of course."],["Pedir licença","Can I use your phone?","No problem."]]}},"quiz":[{"q":"\"Ele sabe calibrar o GPS muito bem.\"","a":"He can calibrate the GPS very well.","opts":["He can calibrate the GPS very well.","He cans calibrate the GPS very well.","He can calibrates the GPS very well.","He can to calibrate the GPS very well."],"why":"can não muda com he, e o verbo depois dele fica puro (calibrate)."},{"q":"\"Eu não sei dirigir o pulverizador.\"","a":"I can't drive the sprayer.","opts":["I can't drive the sprayer.","I don't can drive the sprayer.","I no can drive the sprayer.","I can't to drive the sprayer."],"why":"A negativa de can é can't — nunca use don't antes de can."},{"q":"\"Você sabe plantar soja?\"","a":"Can you plant soybeans?","opts":["Can you plant soybeans?","Do you can plant soybeans?","Are you can plant soybeans?","Can you to plant soybeans?"],"why":"Na pergunta, o próprio Can vai para o início da frase, sem Do."},{"q":"Jack pergunta: \"Can you load the truck?\". Você sabe. Responda:","a":"Yes, I can.","opts":["Yes, I can.","Yes, I do.","Yes, I am.","Yes, I load."],"why":"Pergunta com Can responde com can: Yes, I can."},{"q":"Você quer usar o computador da oficina. Como pede licença?","a":"Can I use the computer?","opts":["Can I use the computer?","Can you use the computer?","Do I can use the computer?","I can use the computer?"],"why":"Can I...? pede permissão para você mesmo fazer algo."}],"speak":["Can you drive a tractor?","Yes, I can. I drive every day.","I can't drive the sprayer.","Can you help me with the truck?","Can I use your phone, please?"]},
  {"id":718,"title":"The Weather Today (Sun, Rain & Frost)","emoji":"🌦️","verbs":["To Rain","To Need","To Start","To Stop"],"vocab":[{"en":"weather","pt":"tempo / clima"},{"en":"sunny","pt":"ensolarado"},{"en":"cloudy","pt":"nublado"},{"en":"windy","pt":"ventando / ventoso"},{"en":"hot","pt":"quente"},{"en":"cold","pt":"frio"},{"en":"warm","pt":"morno / agradável"},{"en":"cool","pt":"fresco"},{"en":"to rain","pt":"chover"},{"en":"sky","pt":"céu"},{"en":"cloud","pt":"nuvem"},{"en":"wind","pt":"vento"},{"en":"degree","pt":"grau (temperatura)"},{"en":"very","pt":"muito"},{"en":"too","pt":"demais (excesso)"},{"en":"drought","pt":"seca / estiagem"},{"en":"frost","pt":"geada"},{"en":"storm","pt":"tempestade"},{"en":"dry","pt":"seco"},{"en":"wet","pt":"molhado / úmido"},{"en":"mud","pt":"lama / barro"},{"en":"muddy","pt":"enlameado / com barro"},{"en":"rainy season","pt":"época de chuva"},{"en":"crop","pt":"lavoura / cultura"},{"en":"soil","pt":"solo / terra"},{"en":"forecast","pt":"previsão do tempo"},{"en":"to spray","pt":"pulverizar"},{"en":"summer","pt":"verão"},{"en":"winter","pt":"inverno"},{"en":"damage","pt":"dano / prejuízo"}],"expressions":[{"expr":"What's the weather like today?","meaning":"Como está o tempo hoje?","example":"What's the weather like today? — It's sunny and hot."},{"expr":"It's too windy for the sprayer.","meaning":"Está ventando demais para o pulverizador.","example":"We can't spray now. It's too windy for the sprayer."},{"expr":"Does it rain a lot here?","meaning":"Chove muito aqui?","example":"Does it rain a lot here in January? — Yes, it does."},{"expr":"The crop needs rain.","meaning":"A lavoura precisa de chuva.","example":"The soil is very dry. The crop needs rain."}],"sentences":["What's the weather like today?","It's sunny and very hot.","It's too hot at noon.","It's too windy for the sprayer today.","The field is too wet for the tractor.","Does it rain a lot in summer?","Frost is bad for the corn.","The soil is dry. We need rain!"],"grammar":{"title":"Padrão: It's + clima e a diferença entre very e too","rules":["Frases sobre o clima sempre começam com It's: It's hot, It's sunny, It's cold at night.","very significa 'muito' (intenso, mas normal): It's very hot today.","too significa 'demais' (passou do limite, atrapalha o trabalho): It's too wet for the tractor.","Para falar de chuva como rotina, rain é verbo com it: It rains a lot in January. / Does it rain in July?"],"table":{"headers":["Frase","Tradução","Ideia"],"rows":[["It's very hot.","Está muito quente.","Quente, mas dá para trabalhar"],["It's too hot.","Está quente demais.","Passou do limite"],["It's too windy.","Está ventando demais.","Não dá para pulverizar"],["It rains a lot.","Chove muito.","Rotina / hábito da estação"]]}},"quiz":[{"q":"\"Como está o tempo hoje?\"","a":"What's the weather like today?","opts":["What's the weather like today?","How's the weather like today?","What the weather is today?","How much is the weather today?"],"why":"Diga What's the weather like? ou How's the weather? — nunca misture How com like."},{"q":"\"Está ventando demais para o pulverizador.\"","a":"It's too windy for the sprayer.","opts":["It's too windy for the sprayer.","Is too windy for the sprayer.","It's too much windy for the sprayer.","It has too windy for the sprayer."],"why":"Clima começa com It's, e antes de adjetivo (windy) usamos too, sem much."},{"q":"\"Chove muito em janeiro.\"","a":"It rains a lot in January.","opts":["It rains a lot in January.","It's rain a lot in January.","It rain a lot on January.","Rains a lot in January."],"why":"Com it no presente simples, o verbo rain ganha -s (It rains), e meses usam in."},{"q":"\"A geada é ruim para o milho.\"","a":"Frost is bad for the corn.","opts":["Frost is bad for the corn.","Drought is bad for the corn.","Sunny is bad for the corn.","Warm is bad for the corn."],"why":"Frost é geada; drought é seca."},{"q":"\"A lavoura está molhada demais hoje.\"","a":"The field is too wet today.","opts":["The field is too wet today.","The field is too dry today.","The field are too wet today.","The field is very much wet today."],"why":"wet = molhado/encharcado; too wet = molhado demais."}],"speak":["What's the weather like today?","It's sunny and very hot.","It's too windy for the sprayer.","Does it rain a lot in summer?","The soil is dry. We need rain!"]},
  {"id":719,"title":"GPS & Screens in the Cab","emoji":"🛰️","verbs":["To Connect","To Turn On","To Press","To Show"],"vocab":[{"en":"screen","pt":"tela / monitor"},{"en":"button","pt":"botão"},{"en":"power","pt":"energia / força"},{"en":"to turn on","pt":"ligar (aparelho)"},{"en":"to turn off","pt":"desligar (aparelho)"},{"en":"to press","pt":"apertar / pressionar"},{"en":"to connect","pt":"conectar"},{"en":"map","pt":"mapa"},{"en":"line","pt":"linha"},{"en":"straight","pt":"reto / em linha reta"},{"en":"left","pt":"esquerda"},{"en":"right","pt":"direita"},{"en":"working","pt":"funcionando"},{"en":"dark","pt":"escuro / apagado"},{"en":"slow","pt":"lento"},{"en":"satellite","pt":"satélite"},{"en":"signal","pt":"sinal"},{"en":"receiver","pt":"receptor / globo do GPS"},{"en":"autopilot","pt":"piloto automático"},{"en":"guidance","pt":"orientação / guia de linha"},{"en":"A-B line","pt":"linha A-B (passada do trator)"},{"en":"steering wheel","pt":"volante"},{"en":"valve","pt":"válvula"},{"en":"harness","pt":"chicote elétrico"},{"en":"connector","pt":"conector / plugue"},{"en":"fuse","pt":"fusível"},{"en":"voltage","pt":"voltagem / tensão"},{"en":"update","pt":"atualização"},{"en":"accuracy","pt":"precisão"},{"en":"roof","pt":"teto (da cabine)"}],"expressions":[{"expr":"Turn on the screen.","meaning":"Ligue o monitor.","example":"Turn on the screen and check the GPS signal."},{"expr":"There is no signal.","meaning":"Não tem sinal.","example":"Look at the screen — there is no signal."},{"expr":"Check the cable on the roof.","meaning":"Verifique o cabo no teto.","example":"Check the cable on the roof of the cab."},{"expr":"It's working now!","meaning":"Está funcionando agora!","example":"Great! The autopilot is working now!"}],"sentences":["Turn on the screen, please.","Press the green button.","The receiver is on the roof of the cab.","There is no satellite signal.","Check the connector and the fuse.","The battery voltage is low.","Set the A-B line on the map.","Great! The autopilot is working now."],"grammar":{"title":"Padrão: dar instruções passo a passo (Turn on, Check, Press)","rules":["Para dar instruções diretas na oficina ou no suporte, comece a frase direto com o verbo puro: Turn on the screen. / Check the fuse.","Para deixar a instrução educada, coloque please no começo ou no fim: Press the green button, please.","Para avisar o que NÃO fazer, comece com Don't + verbo puro: Don't touch that wire!","turn on = ligar · turn off = desligar."],"table":{"headers":["Ação","Inglês","Negativa (Não faça)"],"rows":[["Ligar o monitor","Turn on the screen.","Don't turn off the screen."],["Apertar o botão","Press the button.","Don't press that button."],["Verificar o fusível","Check the fuse.","Don't forget the fuse."],["Conectar o cabo","Connect the cable.","Don't pull the cable."]]}},"quiz":[{"q":"\"Ligue o monitor, por favor.\"","a":"Turn on the screen, please.","opts":["Turn on the screen, please.","Turn off the screen, please.","To turn on the screen, please.","Turns on the screen, please."],"why":"Turn on = ligar (Turn off = desligar). Instruções começam com o verbo puro."},{"q":"\"Não desligue o trator!\"","a":"Don't turn off the tractor!","opts":["Don't turn off the tractor!","Not turn off the tractor!","No turn off the tractor!","Doesn't turn off the tractor!"],"why":"Para dizer 'não faça', usamos sempre Don't + verbo puro."},{"q":"\"Não tem sinal de satélite.\"","a":"There is no satellite signal.","opts":["There is no satellite signal.","Have no satellite signal.","There are no satellite signal.","It has no satellite signal here."],"why":"O 'tem' de existir é There is / There are."},{"q":"Onde fica o receptor (globo) do GPS no trator?","a":"On the roof of the cab.","opts":["On the roof of the cab.","Under the tire.","Inside the fuel tank.","Behind the fence."],"why":"roof = teto; cab = cabine. Em cima tocando a superfície = on the roof."},{"q":"\"O piloto automático está funcionando agora!\"","a":"The autopilot is working now!","opts":["The autopilot is working now!","The autopilot working now!","The autopilot are working now!","The autopilot is work now!"],"why":"autopilot é singular (it) -> is working."}],"speak":["Turn on the screen, please.","Press the green button.","There is no satellite signal.","Check the connector and the fuse.","The autopilot is working now!"]},
  {"id":720,"title":"Trucks, Tires & the Road","emoji":"🚚","verbs":["To Drive","To Stop","To Change","To Carry"],"vocab":[{"en":"to stop","pt":"parar"},{"en":"to change","pt":"trocar / mudar"},{"en":"to carry","pt":"transportar / carregar"},{"en":"to arrive","pt":"chegar"},{"en":"to leave","pt":"sair / partir"},{"en":"full","pt":"cheio"},{"en":"empty","pt":"vazio"},{"en":"far","pt":"longe"},{"en":"near","pt":"perto"},{"en":"slowly","pt":"devagar"},{"en":"bridge","pt":"ponte"},{"en":"gas station","pt":"posto de combustível"},{"en":"map","pt":"mapa"},{"en":"key","pt":"chave"},{"en":"problem","pt":"problema"},{"en":"truck","pt":"caminhão"},{"en":"trailer","pt":"carreta / reboque"},{"en":"tire","pt":"pneu"},{"en":"flat tire","pt":"pneu furado"},{"en":"spare tire","pt":"estepe"},{"en":"fuel","pt":"combustível"},{"en":"diesel","pt":"óleo diesel"},{"en":"tank","pt":"tanque"},{"en":"driver","pt":"motorista"},{"en":"dirt road","pt":"estrada de terra"},{"en":"gate","pt":"porteira / portão"},{"en":"kilometer","pt":"quilômetro"},{"en":"load","pt":"carga"},{"en":"scale","pt":"balança rodoviária"},{"en":"brake","pt":"freio"}],"expressions":[{"expr":"We have a flat tire.","meaning":"Estamos com um pneu furado.","example":"Stop the truck! We have a flat tire."},{"expr":"The fuel tank is almost empty.","meaning":"O tanque de combustível está quase vazio.","example":"We need diesel. The fuel tank is almost empty."},{"expr":"How far is the farm?","meaning":"Qual a distância até a fazenda?","example":"How far is the farm? — It's ten kilometers from here."},{"expr":"Drive slowly on the dirt road.","meaning":"Dirija devagar na estrada de terra.","example":"It rained yesterday. Drive slowly on the dirt road."}],"sentences":["Stop the truck! We have a flat tire.","Do we have a spare tire?","Can you help me change the tire?","The fuel tank is almost empty.","Is there a gas station near here?","How far is the soybean farm?","It's ten kilometers from the gate.","Drive slowly on the dirt road."],"grammar":{"title":"Padrão: How far (distância) e adjetivos opostos (full × empty)","rules":["Para perguntar distância, use sempre How far is...?: How far is the workshop?","Para responder com a distância a partir de um ponto, use from: It's two kilometers from the gate.","Estrada em inglês usa a preposição on: on the highway, on the dirt road (nunca in the road).","Pneu furado em inglês é flat tire (pneu murcho/plano), nunca broken tire."],"table":{"headers":["Pergunta / Situação","Inglês","Oposto"],"rows":[["Qual a distância?","How far is it?","It's near here. (É perto daqui)"],["Tanque vazio","The tank is empty.","The tank is full. (cheio)"],["Pneu furado","We have a flat tire.","The new tire is ready."],["Na estrada de terra","on the dirt road","on the highway (na rodovia)"]]}},"quiz":[{"q":"\"A carreta está com um pneu furado.\"","a":"The trailer has a flat tire.","opts":["The trailer has a flat tire.","The trailer have a flat tire.","The trailer has a broken tire.","The trailer is a flat tire."],"why":"trailer é singular (it -> has), e pneu furado em inglês é flat tire."},{"q":"\"Qual a distância até a fazenda?\"","a":"How far is the farm?","opts":["How far is the farm?","How long is the farm?","How much distance is the farm?","How many far is the farm?"],"why":"How far pergunta distância; How long pergunta tempo."},{"q":"\"Estou na estrada de terra.\"","a":"I'm on the dirt road.","opts":["I'm on the dirt road.","I'm in the dirt road.","I'm at dirt road.","I'm over the dirt road."],"why":"Estradas e ruas levam a preposição on: on the dirt road."},{"q":"\"O tanque está quase vazio.\"","a":"The tank is almost empty.","opts":["The tank is almost empty.","The tank is almost full.","The tank are almost empty.","The tank has almost empty."],"why":"empty = vazio (full = cheio)."},{"q":"\"Fica a dez quilômetros da porteira.\"","a":"It's ten kilometers from the gate.","opts":["It's ten kilometers from the gate.","It's ten kilometers of the gate.","It's ten kilometer from the gate.","Has ten kilometers from the gate."],"why":"Distância a partir de um ponto usa from: ten kilometers from the gate."}],"speak":["We have a flat tire.","The fuel tank is almost empty.","How far is the farm?","It's ten kilometers from the gate.","Drive slowly on the dirt road."]},
  {"id":721,"title":"I'm Working Right Now","emoji":"🔧","verbs":["To Work","To Fix","To Check","To Wait"],"vocab":[{"en":"now","pt":"agora"},{"en":"right now","pt":"agora mesmo / neste exato momento"},{"en":"at the moment","pt":"no momento"},{"en":"working","pt":"trabalhando"},{"en":"waiting","pt":"esperando"},{"en":"talking","pt":"conversando / falando"},{"en":"calling","pt":"ligando / chamando"},{"en":"looking","pt":"olhando / procurando"},{"en":"listening","pt":"ouvindo / escutando"},{"en":"eating","pt":"comendo"},{"en":"drinking","pt":"bebendo"},{"en":"coming","pt":"vindo / chegando"},{"en":"going","pt":"indo"},{"en":"helping","pt":"ajudando"},{"en":"busy","pt":"ocupado"},{"en":"fixing","pt":"consertando"},{"en":"driving","pt":"dirigindo / pilotando"},{"en":"planting","pt":"plantando"},{"en":"checking","pt":"checando / verificando"},{"en":"loading","pt":"carregando (carga)"},{"en":"unloading","pt":"descarregando"},{"en":"testing","pt":"testando"},{"en":"cleaning","pt":"limpando"},{"en":"spraying","pt":"pulverizando"},{"en":"harvesting","pt":"colhendo"},{"en":"calibrating","pt":"calibrando"},{"en":"soldering","pt":"soldando (placa/fio)"},{"en":"cable","pt":"cabo"},{"en":"workbench","pt":"bancada de trabalho"},{"en":"technician","pt":"técnico"}],"expressions":[{"expr":"What are you doing right now?","meaning":"O que você está fazendo agora mesmo?","example":"What are you doing right now? — I'm testing a GPS monitor."},{"expr":"I'm working on it","meaning":"Estou trabalhando nisso / já estou mexendo nisso","example":"Is the antenna ready? — Almost, I'm working on it."},{"expr":"Hold on a second","meaning":"Segura um segundo / aguarde um instante","example":"Hold on a second, I'm checking the cable."},{"expr":"On my way","meaning":"Estou a caminho / indo para aí","example":"The tractor stopped. — OK, I'm on my way!"}],"sentences":["I am fixing a GPS screen on the workbench right now.","The technician is testing the antenna in the yard.","We are loading the truck at the moment.","He is driving the tractor in the soybean field.","Are you working right now or are you free?","They are planting corn today because the weather is good.","She is talking to a client on the phone.","I am not watching TV now; I am studying for my test."],"grammar":{"title":"Padrão: ações acontecendo agora (am / is / are + -ing)","rules":["Para dizer o que está acontecendo neste momento, use am / is / are + verbo com -ing: I am working (estou trabalhando).","Com He / She / It, use is + -ing: He is fixing the monitor (Ele está consertando o monitor). The tractor is moving (O trator está se movendo).","Com You / We / They, use are + -ing: We are planting now (Estamos plantando agora).","Em verbos terminados em -e mudo, tire o -e antes de pôr -ing: drive -> driving, come -> coming, make -> making."],"table":{"headers":["Sujeito + be","Verbo + -ing","Exemplo no campo / oficina"],"rows":[["I am (I'm)","working / fixing","I'm fixing a cable right now."],["He / She / It is","driving / testing","He is testing the GPS in the cab."],["We / You / They are","planting / loading","They are loading the truck now."],["Are you...?","working / coming","Are you coming to the farm now?"]]}},"quiz":[{"q":"Como se diz 'Eu estou consertando o monitor agora'?","a":"I am fixing the monitor now.","opts":["I am fixing the monitor now.","I fixing the monitor now.","I am fix the monitor now.","I is fixing the monitor now."],"why":"Para ações em andamento, usamos am/is/are + verbo com -ing: I am fixing."},{"q":"Complete: 'The technician ___ testing the antenna right now.'","a":"is","opts":["is","are","am","do"],"why":"'The technician' equivale a 'he/she' (singular), então pede 'is'."},{"q":"Qual é a forma correta de 'drive' com '-ing'?","a":"driving","opts":["driving","driveing","drivving","drives"],"why":"Verbos terminados em '-e' perdem o '-e' antes de receber '-ing': drive -> driving."},{"q":"O que significa 'I'm working on it'?","a":"Estou trabalhando nisso / mexendo nisso.","opts":["Estou trabalhando nisso / mexendo nisso.","Eu já terminei o trabalho.","Eu não trabalho hoje.","O trabalho está longe."],"why":"'Working on it' indica que a pessoa já está cuidando daquele serviço no momento."},{"q":"Como você pergunta 'O que você está fazendo agora?'","a":"What are you doing right now?","opts":["What are you doing right now?","What do you do right now?","Where are you going yesterday?","Who is working tomorrow?"],"why":"'What are you doing right now?' pergunta pela ação em andamento neste exato instante."}],"speak":["What are you doing right now?","I am fixing a GPS screen on the workbench.","The technician is testing the antenna.","We are loading the truck at the moment.","Hold on a second, I am checking the cable."]},
  {"id":722,"title":"Planting, Seeds & the Soil","emoji":"🌱","verbs":["To Plant","To Grow","To Measure","To Test"],"vocab":[{"en":"deep","pt":"fundo / profundo"},{"en":"shallow","pt":"raso"},{"en":"centimeter","pt":"centímetro"},{"en":"meter","pt":"metro"},{"en":"ground","pt":"chão / terra"},{"en":"earth","pt":"terra"},{"en":"water","pt":"água"},{"en":"air","pt":"ar"},{"en":"light","pt":"luz"},{"en":"healthy","pt":"saudável"},{"en":"strong","pt":"forte"},{"en":"weak","pt":"fraco"},{"en":"sample","pt":"amostra"},{"en":"result","pt":"resultado"},{"en":"report","pt":"relatório / laudo"},{"en":"soil","pt":"solo"},{"en":"seed","pt":"semente"},{"en":"planter","pt":"plantadeira"},{"en":"fertilizer","pt":"fertilizante / adubo"},{"en":"depth","pt":"profundidade"},{"en":"row","pt":"linha de plantio / fileira"},{"en":"hectare","pt":"hectare"},{"en":"root","pt":"raiz"},{"en":"leaf","pt":"folha"},{"en":"sprout","pt":"broto / plântula"},{"en":"moisture","pt":"umidade (do solo/grão)"},{"en":"clay","pt":"argila"},{"en":"sand","pt":"areia"},{"en":"limestone","pt":"calcário"},{"en":"germination","pt":"germinação"}],"expressions":[{"expr":"Soil sample","meaning":"Amostra de solo","example":"We take a soil sample before planting."},{"expr":"Seed depth","meaning":"Profundidade da semente","example":"Check the seed depth on the planter."},{"expr":"Row spacing","meaning":"Espaçamento entre linhas","example":"The row spacing is forty-five centimeters."},{"expr":"Good moisture","meaning":"Boa umidade","example":"The soil has good moisture after the rain."}],"sentences":["Healthy soil makes strong roots and healthy plants.","We collect a soil sample to check the fertilizer need.","The planter puts the seed at five centimeters of depth.","Each row is straight because the tractor uses GPS.","The soil has good moisture for germination this week.","Look at the green leaf on this young soybean sprout.","We use limestone to correct the soil before planting.","How many seeds per meter is the planter dropping?"],"grammar":{"title":"Padrão: medidas no campo (How deep / How many / per)","rules":["Para perguntar a profundidade no plantio, use 'How deep...?': How deep is the seed? (Qual a profundidade da semente?).","Para indicar taxa ou distribuição no campo, use 'per' (por): fifteen seeds per meter (15 sementes por metro), three bags per hectare (3 sacas por hectare).","Atenção ao adjetivo 'deep' (fundo/profundo) vs. o substantivo 'depth' (profundidade): five centimeters deep = five centimeters of depth.","O plural de 'leaf' (folha) muda o -f para -ves: one leaf -> green leaves."],"table":{"headers":["Termo técnico","Significado","Frase prática de agronomia"],"rows":[["soil moisture","umidade do solo","The soil moisture is ideal today."],["seed depth","profundidade da semente","Check the seed depth in every row."],["seeds per meter","sementes por metro","We plant fourteen seeds per meter."],["bags per hectare","sacas por hectare","The field produces seventy bags per hectare."]]}},"quiz":[{"q":"O que significa 'soil moisture' na agronomia?","a":"Umidade do solo","opts":["Umidade do solo","Velocidade do trator","Preço da semente","Largura da plantadeira"],"why":"'Soil' é solo e 'moisture' é umidade — termo essencial no plantio e na colheita."},{"q":"Como se diz '14 sementes por metro' em inglês?","a":"Fourteen seeds per meter","opts":["Fourteen seeds per meter","Fourteen seeds for hectare","Fourteen roots in kilometer","Four seeds of depth"],"why":"Usamos 'per' para indicar 'por' em taxas e medidas técnicas: seeds per meter."},{"q":"Qual palavra significa 'linha de plantio'?","a":"row","opts":["row","root","leaf","sand"],"why":"'Row' é a linha de plantio; 'root' é raiz e 'leaf' é folha."},{"q":"O que o agrônomo coleta para mandar ao laboratório antes de adubar?","a":"A soil sample","opts":["A soil sample","A tractor tire","A radio station","A steering wheel"],"why":"'Soil sample' significa amostra de solo."},{"q":"Qual é a tradução de 'planter' e 'fertilizer'?","a":"Plantadeira e fertilizante (adubo)","opts":["Plantadeira e fertilizante (adubo)","Colheitadeira e calcário","Pulverizador e semente","Caminhão e argila"],"why":"'Planter' é a plantadeira e 'fertilizer' é o fertilizante/adubo."}],"speak":["We take a soil sample before planting.","The soil has good moisture after the rain.","Check the seed depth on the planter.","We plant fourteen seeds per meter.","Each row is straight with the GPS."]},
  {"id":723,"title":"Spraying & Crop Protection","emoji":"💦","verbs":["To Spray","To Protect","To Clean","To Mix"],"vocab":[{"en":"safe","pt":"seguro"},{"en":"dangerous","pt":"perigoso"},{"en":"careful","pt":"cuidadoso / atento"},{"en":"clean","pt":"limpo / limpar"},{"en":"dirty","pt":"sujo"},{"en":"full","pt":"cheio"},{"en":"empty","pt":"vazio"},{"en":"liter","pt":"litro"},{"en":"drop","pt":"gota"},{"en":"pressure","pt":"pressão"},{"en":"mask","pt":"máscara"},{"en":"gloves","pt":"luvas"},{"en":"boots","pt":"botas"},{"en":"glasses","pt":"óculos (de proteção)"},{"en":"label","pt":"rótulo / etiqueta"},{"en":"sprayer","pt":"pulverizador"},{"en":"nozzle","pt":"bico de pulverização"},{"en":"boom","pt":"barra do pulverizador"},{"en":"tank","pt":"tanque"},{"en":"weed","pt":"erva daninha / mato"},{"en":"pest","pt":"praga"},{"en":"bug","pt":"inseto / percevejo"},{"en":"fungus","pt":"fungo"},{"en":"chemical","pt":"produto químico / defensivo"},{"en":"dose","pt":"dose / dosagem"},{"en":"filter","pt":"filtro"},{"en":"pump","pt":"bomba (hidráulica/pulverização)"},{"en":"hose","pt":"mangueira"},{"en":"drift","pt":"deriva (vento levando as gotas)"},{"en":"crop","pt":"lavoura / cultura"}],"expressions":[{"expr":"Blocked nozzle","meaning":"Bico entupido","example":"Stop the sprayer, there is a blocked nozzle on the left boom."},{"expr":"Put on your gloves","meaning":"Coloque suas luvas","example":"Always put on your gloves and mask before mixing."},{"expr":"Tank is full","meaning":"O tanque está cheio","example":"The tank is full and the pressure is good."},{"expr":"Too much wind","meaning":"Vento demais","example":"We can't spray now because there is too much wind."}],"sentences":["Check every nozzle on the boom before you spray.","One nozzle is dirty, so I need to clean the filter.","Always wear gloves, boots, and a mask for safety.","The sprayer tank is full of water.","We spray the crop early in the morning to avoid drift.","Read the label to check the right dose per hectare.","There are weeds and bugs in this part of the field.","The GPS section control turns off the boom automatically."],"grammar":{"title":"Padrão: instruções e segurança no campo (Always / Don't / before)","rules":["Para dar instruções diretas no trabalho, comece com o verbo: Check the pressure (Cheque a pressão), Clean the nozzle (Limpe o bico).","Para reforçar uma regra de segurança, use 'Always' (sempre) no início: Always wear gloves (Use sempre luvas).","Para alertar sobre o que não fazer, use 'Don't' (não): Don't spray on a windy afternoon (Não pulverize em tarde de vento).","Use 'before' (antes de) e 'after' (depois de) para organizar etapas: Clean the tank after spraying."],"table":{"headers":["Tipo de instrução","Estrutura","Exemplo na pulverização"],"rows":[["Ordem direta","Verbo + complemento","Check the nozzles on the boom."],["Regra positiva","Always + verbo","Always read the product label."],["Alerta negativo","Don't + verbo","Don't spray when it is too windy."],["Sequência","before / after + ação","Clean the filter before filling the tank."]]}},"quiz":[{"q":"Como se diz 'bico de pulverização' e 'barra do pulverizador' em inglês?","a":"nozzle and boom","opts":["nozzle and boom","wheel and cab","root and leaf","clutch and brake"],"why":"'Nozzle' é o bico do pulverizador e 'boom' é a barra onde ficam os bicos."},{"q":"O que significa 'weed' no vocabulário agrícola?","a":"Erva daninha / planta invasora (mato)","opts":["Erva daninha / planta invasora (mato)","Semente de trigo","Tanque cheio","Bomba de água"],"why":"'Weed' é qualquer planta daninha que compete com a lavoura ('crop')."},{"q":"Por que a frase 'Don't spray when it is windy' é importante?","a":"Para evitar deriva ('drift'), quando o vento leva as gotas para longe.","opts":["Para evitar deriva ('drift'), quando o vento leva as gotas para longe.","Porque o trator não liga quando venta.","Porque o pneu fura no vento.","Porque a semente não germina no escuro."],"why":"Com vento forte ocorre 'drift' (deriva), prejudicando a aplicação."},{"q":"Qual frase dá uma instrução de segurança correta?","a":"Always wear gloves and a mask.","opts":["Always wear gloves and a mask.","Never check the pressure.","Spray with a blocked nozzle.","Don't read the label."],"why":"'Always wear gloves and a mask' orienta o uso obrigatório de EPIs."},{"q":"Qual é o oposto de 'The tank is full'?","a":"The tank is empty.","opts":["The tank is empty.","The tank is heavy.","The tank is fast.","The tank is green."],"why":"'Full' significa cheio e seu oposto direto é 'empty' (vazio)."}],"speak":["Check every nozzle on the boom before you spray.","The sprayer tank is full and the pressure is good.","Always wear gloves and a mask for safety.","We can't spray now because there is too much wind.","The GPS turns off the boom automatically."]},
  {"id":724,"title":"How Much Is This Part?","emoji":"💰","verbs":["To Buy","To Sell","To Pay","To Order"],"vocab":[{"en":"how much","pt":"quanto custa / quanto"},{"en":"price","pt":"preço"},{"en":"cost","pt":"custo / custar"},{"en":"cheap","pt":"barato"},{"en":"expensive","pt":"caro"},{"en":"money","pt":"dinheiro"},{"en":"dollar","pt":"dólar"},{"en":"cash","pt":"dinheiro vivo / à vista"},{"en":"card","pt":"cartão"},{"en":"total","pt":"total"},{"en":"discount","pt":"desconto"},{"en":"store","pt":"loja"},{"en":"customer","pt":"cliente / comprador"},{"en":"client","pt":"cliente"},{"en":"box","pt":"caixa"},{"en":"part","pt":"peça"},{"en":"spare part","pt":"peça de reposição"},{"en":"supplier","pt":"fornecedor"},{"en":"stock","pt":"estoque"},{"en":"invoice","pt":"nota fiscal / fatura"},{"en":"receipt","pt":"recibo / comprovante"},{"en":"warranty","pt":"garantia"},{"en":"freight","pt":"frete"},{"en":"delivery","pt":"entrega"},{"en":"order","pt":"pedido / encomenda"},{"en":"board","pt":"placa eletrônica"},{"en":"chip","pt":"chip / circuito"},{"en":"connector","pt":"conector"},{"en":"harness","pt":"chicote elétrico"},{"en":"quote","pt":"orçamento / cotação"}],"expressions":[{"expr":"How much is this?","meaning":"Quanto custa isto?","example":"How much is this GPS antenna? — It's two hundred dollars."},{"expr":"In stock","meaning":"Em estoque / à pronta entrega","example":"Do you have this connector in stock?"},{"expr":"Send me a quote","meaning":"Me envie um orçamento / cotação","example":"Please send me a quote for ten cables."},{"expr":"One-year warranty","meaning":"Garantia de um ano","example":"This monitor comes with a one-year warranty."}],"sentences":["How much is this electronic board for the monitor?","Do you have this wiring harness in stock today?","A new monitor is expensive, so many clients fix the old one.","We buy connectors and chips from an international supplier.","Please send the invoice and the tracking number by email.","Can you give me a discount if I order twenty parts?","The total price with freight is three hundred dollars.","Our service at GPS Tronic has a warranty for the customer."],"grammar":{"title":"Padrão: perguntando preços e quantidades (How much / How many)","rules":["Use 'How much is...?' para perguntar o preço de 1 item: How much is this cable? (Quanto custa este cabo?).","Use 'How much are...?' para perguntar o preço de vários itens: How much are these connectors? (Quanto custam estes conectores?).","Use 'How many...?' para coisas contáveis (peças, cabos, caixas): How many parts do you need? (De quantas peças você precisa?).","Para responder preços, basta usar 'It's...' (singular) ou 'They're...' (plural): It's fifty dollars."],"table":{"headers":["Pergunta","Quando usar","Exemplo na empresa"],"rows":[["How much is this...?","Preço no singular","How much is this GPS screen?"],["How much are these...?","Preço no plural","How much are these sensors?"],["How many... do you need?","Quantidade de peças","How many harnesses do you need?"],["Is it in stock?","Checar disponibilidade","Is this board in stock right now?"]]}},"quiz":[{"q":"Como você pergunta 'Quanto custa esta placa eletrônica?'","a":"How much is this board?","opts":["How much is this board?","How many is this board?","Where is this board?","Who is this board?"],"why":"Para perguntar o preço de um item no singular, usamos 'How much is this...?'."},{"q":"O que significa a pergunta 'Do you have this part in stock?'","a":"Você tem esta peça em estoque?","opts":["Você tem esta peça em estoque?","Você conserta esta peça hoje?","Quanto custa o frete desta peça?","Onde fica a loja de peças?"],"why":"'In stock' significa disponível em estoque para pronta entrega."},{"q":"Qual palavra em inglês significa 'chicote elétrico' de trator ou GPS?","a":"harness","opts":["harness","receipt","discount","warranty"],"why":"'Harness' (ou 'wiring harness') é o termo técnico para chicote elétrico."},{"q":"O cliente pede 'Please send me a quote'. O que ele quer receber?","a":"Um orçamento / uma cotação de preço.","opts":["Um orçamento / uma cotação de preço.","Um trator novo.","Uma previsão do tempo.","Uma amostra de solo."],"why":"Em compras e serviços técnicos, 'quote' significa cotação ou orçamento."},{"q":"Qual é o oposto de 'cheap' (barato)?","a":"expensive","opts":["expensive","empty","easy","early"],"why":"'Cheap' é barato e 'expensive' é caro."}],"speak":["How much is this GPS antenna?","Do you have this connector in stock?","Please send me a quote for ten cables.","Can you give me a discount on this order?","This monitor comes with a warranty."]},
  {"id":725,"title":"Yesterday at the Farm (Was & Were)","emoji":"📅","verbs":["To Be","To Stay","To Rest","To Finish"],"vocab":[{"en":"was","pt":"era / estava / foi (I, he, she, it)"},{"en":"were","pt":"eram / estavam / foram (you, we, they)"},{"en":"wasn't","pt":"não era / não estava"},{"en":"weren't","pt":"não eram / não estavam"},{"en":"yesterday","pt":"ontem"},{"en":"last night","pt":"ontem à noite"},{"en":"last week","pt":"semana passada"},{"en":"last month","pt":"mês passado"},{"en":"ago","pt":"atrás (no tempo)"},{"en":"two days ago","pt":"dois dias atrás"},{"en":"here","pt":"aqui"},{"en":"there","pt":"lá / ali"},{"en":"tired","pt":"cansado"},{"en":"ready","pt":"pronto"},{"en":"late","pt":"atrasado / tarde"},{"en":"in the field","pt":"na lavoura / no campo"},{"en":"at the farm","pt":"na fazenda"},{"en":"at the workshop","pt":"na oficina / bancada"},{"en":"in the cab","pt":"na cabine"},{"en":"on the road","pt":"na estrada"},{"en":"muddy","pt":"enlameado / com barro"},{"en":"broken","pt":"quebrado / com defeito"},{"en":"fixed","pt":"consertado / resolvido"},{"en":"busy season","pt":"época de pico / safra corrida"},{"en":"off-season","pt":"entressafra"},{"en":"shift","pt":"turno de trabalho"},{"en":"crew","pt":"equipe (de campo)"},{"en":"barn","pt":"galpão / celeiro"},{"en":"silo","pt":"silo"},{"en":"gate","pt":"porteira / portão"}],"expressions":[{"expr":"Where were you yesterday?","meaning":"Onde você estava ontem?","example":"Where were you yesterday? — I was at the farm all day."},{"expr":"It was a busy day","meaning":"Foi um dia corrido","example":"Yesterday was a busy day at the workshop."},{"expr":"The road was muddy","meaning":"A estrada estava com barro / enlameada","example":"The road was muddy after the heavy rain."},{"expr":"Everything was ready","meaning":"Tudo estava pronto","example":"By seven o'clock, everything was ready for planting."}],"sentences":["I was in the field yesterday morning.","The GPS monitor was broken, but now it is fixed.","Where were you last night? — I was at college.","The tractors were in the barn because of the rain.","It wasn't cold yesterday; it was very hot.","We were tired after a long shift during the harvest.","The crew was ready at six o'clock in the morning.","Two days ago, the soil was too dry for planting."],"grammar":{"title":"Padrão: passado de ser/estar (was / were)","rules":["Para falar de onde alguém estava ou como algo era no passado, use 'was' com I / he / she / it: I was at the farm (Eu estava na fazenda).","Use 'were' com you / we / they: We were in the field yesterday (Nós estávamos na lavoura ontem).","Para negar, basta usar 'wasn't' (was not) ou 'weren't' (were not): The antenna wasn't broken.","Para perguntar, coloque Was ou Were no começo: Were you at the workshop yesterday?"],"table":{"headers":["Pessoa","Afirmativa","Negativa","Exemplo no passado"],"rows":[["I / He / She / It","was","wasn't","The tractor was in the field."],["You / We / They","were","weren't","We were busy last week."],["Pergunta (singular)","Was he/it...?","—","Was the soil wet yesterday?"],["Pergunta (plural/you)","Were you/they...?","—","Were you at the farm last night?"]]}},"quiz":[{"q":"Complete: 'I ___ at the workshop yesterday afternoon.'","a":"was","opts":["was","were","am","are"],"why":"Com 'I' no passado ('yesterday'), usamos sempre 'was'."},{"q":"Complete: 'The tractors ___ in the barn last night.'","a":"were","opts":["were","was","is","be"],"why":"'The tractors' está no plural ('they'), por isso pede 'were'."},{"q":"Como se pergunta 'Onde você estava ontem?'","a":"Where were you yesterday?","opts":["Where were you yesterday?","Where was you yesterday?","Where are you yesterday?","What were you tomorrow?"],"why":"Com 'you', o passado de 'to be' é 'were': Where were you yesterday?"},{"q":"O que significa 'The road was muddy'?","a":"A estrada estava enlameada (com barro).","opts":["A estrada estava enlameada (com barro).","A estrada estava seca e rápida.","O caminhão estava no silo.","A porteira estava fechada."],"why":"'Muddy' vem de 'mud' (barro/lama): enlameada, cheia de barro."},{"q":"O que significa 'two days ago'?","a":"Dois dias atrás","opts":["Dois dias atrás","Daqui a dois dias","Durante dois dias","A cada dois dias"],"why":"'Ago' coloca a contagem de tempo no passado: two days ago = dois dias atrás."}],"speak":["Where were you yesterday?","I was at the farm all day.","Yesterday was a busy day at the workshop.","The GPS monitor was broken, but now it is fixed.","The road was muddy after the rain."]},
  {"id":726,"title":"I Went to the Field (Past Actions)","emoji":"🛻","verbs":["To Go","To See","To Have","To Do"],"vocab":[{"en":"went","pt":"fui / foi / fomos (passado de go)"},{"en":"saw","pt":"vi / viu (passado de see)"},{"en":"had","pt":"tive / teve (passado de have)"},{"en":"did","pt":"fiz / fez (passado de do)"},{"en":"didn't","pt":"não (auxiliar do passado)"},{"en":"came","pt":"veio / vim (passado de come)"},{"en":"took","pt":"levou / pegou (passado de take)"},{"en":"made","pt":"fez / fabricou (passado de make)"},{"en":"bought","pt":"comprou (passado de buy)"},{"en":"sold","pt":"vendeu (passado de sell)"},{"en":"called","pt":"ligou / chamou"},{"en":"talked","pt":"conversou / falou"},{"en":"helped","pt":"ajudou"},{"en":"started","pt":"começou"},{"en":"finished","pt":"terminou"},{"en":"worked","pt":"trabalhou / funcionou"},{"en":"fixed","pt":"consertou"},{"en":"checked","pt":"checou / verificou"},{"en":"planted","pt":"plantou"},{"en":"harvested","pt":"colheu"},{"en":"sprayed","pt":"pulverizou"},{"en":"tested","pt":"testou"},{"en":"drove","pt":"dirigiu / pilotou (passado de drive)"},{"en":"rained","pt":"choveu"},{"en":"loaded","pt":"carregou"},{"en":"repaired","pt":"reparou / consertou"},{"en":"installed","pt":"instalou"},{"en":"calibrated","pt":"calibrou"},{"en":"delivered","pt":"entregou"},{"en":"trip","pt":"viagem / ida ao campo"}],"expressions":[{"expr":"Did it work?","meaning":"Funcionou? / Deu certo?","example":"I changed the cable. — Did it work? — Yes, it worked!"},{"expr":"We finished the job","meaning":"Terminamos o serviço","example":"We finished the job before the rain started."},{"expr":"I went to the farm","meaning":"Eu fui para a fazenda","example":"I went to the farm early this morning."},{"expr":"It rained a lot","meaning":"Choveu muito","example":"It rained a lot last night in our region."}],"sentences":["Yesterday I fixed three GPS monitors at the company.","We went to the farm and installed the new antenna.","He drove the pickup truck to the soybean field.","It rained last night, so we didn't spray this morning.","Did you check the oil and the tires before the trip?","The client called me because the screen had no signal.","We calibrated the autopilot and tested the tractor.","They harvested fifty hectares of corn yesterday."],"grammar":{"title":"Padrão: contando o que você já fez (Passado Simples)","rules":["A maioria dos verbos ganha -ed no passado para todas as pessoas: work -> worked, fix -> fixed, plant -> planted, test -> tested.","Alguns verbos muito comuns têm forma própria no passado: go -> went (foi), drive -> drove (dirigiu), have -> had (teve), see -> saw (viu).","Para negar no passado, use 'didn't' + verbo normal (sem -ed): We didn't plant yesterday (Não plantamos ontem).","Para perguntar no passado, comece com 'Did' + sujeito + verbo normal: Did you fix the monitor? (Você consertou o monitor?)."],"table":{"headers":["Tipo de frase","Estrutura","Exemplo prático"],"rows":[["Afirmativa (-ed)","Sujeito + verbo-ed","I fixed the GPS yesterday."],["Afirmativa (irregular)","went / drove / had / saw","We went to the field early."],["Negativa","didn't + verbo base","It didn't rain last week."],["Pergunta","Did + sujeito + verbo base?","Did you test the antenna?"]]}},"quiz":[{"q":"Qual é o passado de 'go' e 'drive'?","a":"went and drove","opts":["went and drove","goed and drived","going and driving","goes and drives"],"why":"'Go' no passado vira 'went', e 'drive' vira 'drove'."},{"q":"Como se diz 'Eu consertei o monitor ontem'?","a":"I fixed the monitor yesterday.","opts":["I fixed the monitor yesterday.","I fix the monitor yesterday.","I am fixing the monitor yesterday.","I didn't fixed the monitor yesterday."],"why":"'Fix' é regular e recebe '-ed' no passado afirmativo: fixed."},{"q":"Qual pergunta está correta no passado?","a":"Did you check the antenna?","opts":["Did you check the antenna?","Did you checked the antenna?","Do you checked the antenna?","Were you check the antenna?"],"why":"Quando usamos o auxiliar 'Did', o verbo principal volta à forma base ('check', sem '-ed')."},{"q":"Como se diz 'Não choveu na semana passada'?","a":"It didn't rain last week.","opts":["It didn't rain last week.","It didn't rained last week.","It not rain last week.","It wasn't rain last week."],"why":"Na negativa do passado usamos 'didn't' + verbo base ('rain')."},{"q":"O que significa a pergunta 'Did it work?' depois de um conserto?","a":"Funcionou? / Deu certo?","opts":["Funcionou? / Deu certo?","Onde você trabalha?","Quem fez o serviço?","Quanto custou o conserto?"],"why":"Para máquinas e aparelhos, 'to work' também significa 'funcionar'."}],"speak":["Yesterday I fixed three GPS monitors.","We went to the farm and installed the antenna.","Did you check the oil before the trip?","It rained last night, so we didn't spray today.","I changed the cable and it worked."]},
  {"id":727,"title":"Faster, Bigger, Better (Comparing Machines)","emoji":"🏁","verbs":["To Compare","To Choose","To Prefer","To Upgrade"],"vocab":[{"en":"bigger","pt":"maior"},{"en":"smaller","pt":"menor"},{"en":"faster","pt":"mais rápido"},{"en":"slower","pt":"mais lento"},{"en":"newer","pt":"mais novo"},{"en":"older","pt":"mais velho / mais antigo"},{"en":"cheaper","pt":"mais barato"},{"en":"better","pt":"melhor"},{"en":"worse","pt":"pior"},{"en":"easier","pt":"mais fácil"},{"en":"harder","pt":"mais difícil / mais duro"},{"en":"than","pt":"do que (em comparações)"},{"en":"more","pt":"mais"},{"en":"less","pt":"menos"},{"en":"same","pt":"mesmo / igual"},{"en":"stronger","pt":"mais forte / mais potente"},{"en":"heavier","pt":"mais pesado"},{"en":"lighter","pt":"mais leve"},{"en":"wider","pt":"mais largo"},{"en":"deeper","pt":"mais fundo / mais profundo"},{"en":"horsepower","pt":"cavalos de potência (cv/hp)"},{"en":"model","pt":"modelo"},{"en":"version","pt":"versão"},{"en":"efficiency","pt":"eficiência / rendimento"},{"en":"fuel consumption","pt":"consumo de combustível"},{"en":"capacity","pt":"capacidade"},{"en":"width","pt":"largura"},{"en":"accuracy","pt":"precisão / exatidão"},{"en":"signal","pt":"sinal"},{"en":"yield","pt":"produtividade (sacas por hectare)"}],"expressions":[{"expr":"Much better than","meaning":"Muito melhor do que","example":"The RTK signal is much better than the basic signal."},{"expr":"Cheaper to fix","meaning":"Mais barato de consertar","example":"It is cheaper to fix the board than to buy a new monitor."},{"expr":"More accurate","meaning":"Mais preciso","example":"This new GPS antenna is more accurate in the field."},{"expr":"Higher yield","meaning":"Maior produtividade (na colheita)","example":"Good seed and fertilizer give a higher yield."}],"sentences":["The new combine is bigger and faster than the old model.","This screen is brighter and easier to read in the sun.","Fixing a monitor is much cheaper than buying a new one.","The green tractor has more horsepower than the blue tractor.","With autopilot, the rows are straighter and more accurate.","This year's soybean yield is better than last year's.","The sprayer boom is wider, so we finish the field faster.","Which GPS model do you prefer for a planter?"],"grammar":{"title":"Padrão: comparando máquinas, telas e safras (-er than / more ... than)","rules":["Para palavras curtas, adicione -er + than: fast -> faster than (mais rápido que), cheap -> cheaper than (mais barato que), big -> bigger than (maior que).","Se a palavra termina em -y, troque por -ier: easy -> easier than (mais fácil que), heavy -> heavier than (mais pesado que).","Para palavras longas, use 'more + palavra + than': more expensive than (mais caro que), more accurate than (mais preciso que).","Duas palavras muito usadas têm forma especial: good -> better than (melhor que) e bad -> worse than (pior que)."],"table":{"headers":["Adjetivo base","Comparativo","Exemplo no agro"],"rows":[["fast / cheap / wide","faster / cheaper / wider than","This boom is wider than the old one."],["big / heavy / easy","bigger / heavier / easier than","The new screen is easier to use."],["expensive / accurate","more expensive / more accurate than","RTK is more accurate than basic GPS."],["good / bad","better / worse than","This harvest is better than last year."]]}},"quiz":[{"q":"Como se diz 'Este trator é mais forte do que o antigo'?","a":"This tractor is stronger than the old one.","opts":["This tractor is stronger than the old one.","This tractor is more strong that the old one.","This tractor is strong than the old one.","This tractor is strongest the old one."],"why":"'Strong' é uma palavra curta, então recebe '-er' seguido de 'than': stronger than."},{"q":"Qual é o comparativo correto de 'good' (bom)?","a":"better","opts":["better","gooder","more good","best"],"why":"'Good' tem comparativo irregular: 'better' (melhor)."},{"q":"Por que dizemos 'Fixing the monitor is cheaper than buying a new one'?","a":"Porque consertar o monitor sai mais barato do que comprar um novo.","opts":["Porque consertar o monitor sai mais barato do que comprar um novo.","Porque o monitor novo é mais barato que o conserto.","Porque não é possível consertar o monitor.","Porque o cliente prefere pagar mais caro."],"why":"'Cheaper than' significa 'mais barato do que' — grande vantagem da assistência técnica."},{"q":"O que significa 'yield' quando falamos de soja ou milho?","a":"Produtividade da lavoura (sacas por hectare)","opts":["Produtividade da lavoura (sacas por hectare)","Pressão do pneu do caminhão","Tamanho do volante","Cor da cabine"],"why":"Na agronomia, 'yield' (ou 'crop yield') é o rendimento/produtividade colhida por área."},{"q":"Como fica 'easy' (fácil) no comparativo?","a":"easier","opts":["easier","easyer","more easy","easiest"],"why":"Adjetivos curtos terminados em '-y' trocam o '-y' por '-ier': easy -> easier."}],"speak":["The new combine is bigger and faster than the old model.","Fixing a monitor is much cheaper than buying a new one.","This screen is brighter and easier to read in the sun.","The RTK signal is more accurate in the field.","This year's harvest is better than last year's."]},
  {"id":728,"title":"Next Harvest & My Future in Agronomy","emoji":"🎓","verbs":["To Plan","To Graduate","To Build","To Travel"],"vocab":[{"en":"going to","pt":"vou / vai (planejamento futuro)"},{"en":"future","pt":"futuro"},{"en":"next week","pt":"semana que vem"},{"en":"next month","pt":"mês que vem"},{"en":"next year","pt":"ano que vem"},{"en":"soon","pt":"em breve / logo"},{"en":"tomorrow","pt":"amanhã"},{"en":"plan","pt":"plano / planejar"},{"en":"goal","pt":"meta / objetivo"},{"en":"dream","pt":"sonho"},{"en":"trip","pt":"viagem"},{"en":"abroad","pt":"no exterior / fora do país"},{"en":"country","pt":"país / interior"},{"en":"proud","pt":"orgulhoso"},{"en":"ready","pt":"pronto"},{"en":"next harvest","pt":"próxima safra / colheita"},{"en":"next season","pt":"próxima temporada / safra"},{"en":"agronomist","pt":"engenheiro agrônomo / agrônomo"},{"en":"engineer","pt":"engenheiro"},{"en":"degree","pt":"diploma universitário / graduação"},{"en":"diploma","pt":"diploma"},{"en":"farm show","pt":"feira agrícola (ex.: Agrishow)"},{"en":"trade fair","pt":"feira de negócios / exposição"},{"en":"technology","pt":"tecnologia"},{"en":"innovation","pt":"inovação"},{"en":"precision","pt":"precisão (agricultura de precisão)"},{"en":"business","pt":"negócio / empresa"},{"en":"partner","pt":"parceiro / sócio"},{"en":"expansion","pt":"expansão / crescimento"},{"en":"success","pt":"sucesso"}],"expressions":[{"expr":"I'm going to graduate","meaning":"Eu vou me formar","example":"I'm going to graduate in Agronomy soon."},{"expr":"Precision agriculture","meaning":"Agricultura de precisão","example":"Precision agriculture is the future of farming."},{"expr":"Grow the business","meaning":"Fazer a empresa crescer","example":"We are going to grow the business next year."},{"expr":"See you in the field!","meaning":"Nos vemos no campo!","example":"Good luck with the next harvest! See you in the field!"}],"sentences":["I am going to graduate in Agronomy and become an agronomist.","Next week we are going to install GPS on five tractors.","We are going to visit a big farm show next year.","My goal is to grow GPS Tronic and help more farmers.","Are you going to plant corn or soybeans next season?","Precision agriculture saves fuel, seed, and fertilizer.","I can speak English about my work, my studies, and the field.","I am proud of my journey and ready for the next harvest!"],"grammar":{"title":"Padrão: planos para a próxima safra e o futuro (am / is / are + going to)","rules":["Para falar de planos e intenções futuras, use am / is / are + going to + verbo: I am going to graduate (Eu vou me formar).","Com He / She / It, use 'is going to': He is going to buy a new planter next year.","Com We / You / They, use 'are going to': We are going to plant soybeans next month.","Para perguntar sobre os planos de alguém, comece com Are you going to...?: Are you going to visit the farm show?"],"table":{"headers":["Sujeito","Estrutura de futuro","Plano para o campo / carreira"],"rows":[["I","am going to + verbo","I'm going to finish my Agronomy degree."],["He / She / It","is going to + verbo","It is going to rain tomorrow morning."],["We / You / They","are going to + verbo","We are going to expand our GPS business."],["Pergunta","Are you going to + verbo?","Are you going to plant corn next season?"]]}},"quiz":[{"q":"Como se diz 'Eu vou me formar em Agronomia'?","a":"I am going to graduate in Agronomy.","opts":["I am going to graduate in Agronomy.","I graduated in Agronomy yesterday.","I going graduate in Agronomy.","I was graduate in Agronomy."],"why":"Para planos futuros, usamos 'am/is/are + going to + verbo base': I am going to graduate."},{"q":"O que significa 'precision agriculture'?","a":"Agricultura de precisão","opts":["Agricultura de precisão","Colheita manual","Previsão de geada","Transporte de gado"],"why":"'Precision agriculture' é a agricultura de precisão, área que une agronomia e tecnologia GPS."},{"q":"Complete: 'Next week we ___ going to install GPS on five tractors.'","a":"are","opts":["are","is","am","was"],"why":"Com 'we', usamos 'are going to'."},{"q":"O que é um 'farm show' (como a Agrishow ou Show Rural)?","a":"Uma feira agrícola / exposição de tecnologia no campo","opts":["Uma feira agrícola / exposição de tecnologia no campo","Um programa de rádio de música sertaneja","Um silo de armazenamento de grãos","Um exame de laboratório de solo"],"why":"'Farm show' é o termo em inglês para grandes feiras e exposições do agronegócio."},{"q":"Como você pergunta 'Você vai plantar milho na próxima safra?'","a":"Are you going to plant corn next season?","opts":["Are you going to plant corn next season?","Did you plant corn next season?","Were you planting corn yesterday?","Do you planted corn tomorrow?"],"why":"Para perguntar sobre um plano futuro ('next season'), usamos 'Are you going to + verbo?'."}],"speak":["I am going to graduate in Agronomy.","Next week we are going to install GPS on five tractors.","Precision agriculture is the future of farming.","We are going to grow the business next year.","I am ready for the next harvest!"]}
];

window.LESSONS_AGRO = LESSONS_AGRO;
