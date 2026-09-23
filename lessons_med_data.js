// ════════════════════════════════════════════════════════════════════════════
// lessons_med_data.js — Trilha Diária do curso Medical English
// ════════════════════════════════════════════════════════════════════════════
// GERADO por scripts/build-trilha-med.mjs a partir de
// scripts/med-trilha-a.json e -b.json. Não edite este arquivo à mão:
// edite os JSON e rode o construtor de novo.
//
// Faixa de ids: 801-816 (en 1-110 · fr 201-212 · tr 301-336 · int 401-440 ·
// gps 501-508 · interview 601-612 · agro 701-712 já estão ocupadas).
//
// Mix 50-50 entre vocabulário geral e vocabulário clínico é regra do curso e
// está validada no construtor — o campo "tema" vive nos JSON de origem e é
// removido aqui, porque o app espera vocab {en, pt}.
//
// ⚠️  Este arquivo é FONTE DE COMPILAÇÃO, não é lido pelo navegador. Depois de
//     mudar qualquer coisa aqui é obrigatório rodar:
//         node scripts/build-lesson-data.js
//     senão a lição não existe para o app — sem erro nenhum.
// ════════════════════════════════════════════════════════════════════════════

const LESSONS_MED = [
  {
    "id": 801,
    "title": "Hello & Good Morning",
    "emoji": "👋",
    "verbs": [
      "To Be",
      "To Meet",
      "To Help",
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
        "en": "goodbye",
        "pt": "tchau"
      },
      {
        "en": "see you later",
        "pt": "até mais"
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
        "en": "my name is",
        "pt": "meu nome é"
      },
      {
        "en": "nice to meet you",
        "pt": "prazer em conhecer você"
      },
      {
        "en": "nurse",
        "pt": "enfermeiro(a)"
      },
      {
        "en": "ward",
        "pt": "enfermaria"
      },
      {
        "en": "shift",
        "pt": "plantão / turno"
      },
      {
        "en": "bed",
        "pt": "leito"
      },
      {
        "en": "chart",
        "pt": "prontuário"
      },
      {
        "en": "front desk",
        "pt": "recepção"
      },
      {
        "en": "waiting room",
        "pt": "sala de espera"
      },
      {
        "en": "on call",
        "pt": "de sobreaviso"
      },
      {
        "en": "staff",
        "pt": "equipe"
      },
      {
        "en": "white coat",
        "pt": "jaleco"
      },
      {
        "en": "scrubs",
        "pt": "pijama cirúrgico"
      },
      {
        "en": "ward round",
        "pt": "visita (ao leito)"
      },
      {
        "en": "name tag",
        "pt": "crachá"
      },
      {
        "en": "visiting hours",
        "pt": "horário de visita"
      },
      {
        "en": "to take care of",
        "pt": "cuidar de"
      }
    ],
    "expressions": [
      {
        "expr": "Good morning, I'm Dr. …",
        "meaning": "Bom dia, eu sou o Dr. / a Dra. …",
        "example": "Good morning, I'm Dr. Ana. I'll take care of you today."
      },
      {
        "expr": "How can I help you?",
        "meaning": "Como posso ajudar? — a abertura de toda consulta",
        "example": "Good afternoon. How can I help you today?"
      },
      {
        "expr": "Nice to meet you.",
        "meaning": "Prazer em conhecer você — só na primeira vez",
        "example": "Nice to meet you, Mrs. Brown."
      },
      {
        "expr": "I'll be back soon.",
        "meaning": "Eu já volto — nunca saia do leito sem dizer isso",
        "example": "I'll be back soon with your results."
      }
    ],
    "sentences": [
      "Good morning! I'm Dr. Ana.",
      "How can I help you today?",
      "Nice to meet you, Mr. Silva.",
      "Please, come in and sit down.",
      "I'm the doctor on call today.",
      "The nurse will see you first.",
      "Excuse me, is this bed four?",
      "I'll be back soon. Thank you."
    ],
    "grammar": {
      "title": "Apresentar-se a um paciente",
      "rules": [
        "Good morning até o meio-dia, good afternoon até o fim da tarde, good evening depois disso.",
        "⚠️ Good night NÃO é cumprimento de chegada — é despedida ou boa-noite para dormir.",
        "Profissão em inglês precisa de a / an: I'm A doctor, nunca I'm doctor.",
        "Com o sobrenome use Mr. / Mrs. / Ms. — chamar o paciente pelo primeiro nome sem convite soa íntimo demais."
      ],
      "table": {
        "headers": [
          "Situação",
          "Inglês",
          "❌ Erro comum"
        ],
        "rows": [
          [
            "Sou médica",
            "I'm a doctor",
            "I'm doctor"
          ],
          [
            "Meu nome é Ana",
            "My name is Ana",
            "My name Ana"
          ],
          [
            "Sou o plantonista hoje",
            "I'm the doctor on call today",
            "I'm doctor of call"
          ],
          [
            "Prazer em conhecê-lo",
            "Nice to meet you",
            "Nice to know you"
          ],
          [
            "Já volto",
            "I'll be back soon",
            "I come back soon"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "São 8 da manhã e você entra na enfermaria. O que diz?",
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
        "q": "\"Eu sou médica.\"",
        "a": "I'm a doctor.",
        "opts": [
          "I'm a doctor.",
          "I'm doctor.",
          "I am the doctor of.",
          "I have a doctor."
        ],
        "why": "Profissão em inglês sempre com a / an."
      },
      {
        "q": "Como abrir a consulta perguntando o que traz o paciente?",
        "a": "How can I help you?",
        "opts": [
          "How can I help you?",
          "What do you want?",
          "How I can help you?",
          "What you need?"
        ],
        "why": "How can I help you? é a abertura padrão. \"What do you want?\" soa rude."
      },
      {
        "q": "Você precisa passar por alguém no corredor. O que diz?",
        "a": "Excuse me.",
        "opts": [
          "Excuse me.",
          "Sorry.",
          "Please.",
          "Thank you."
        ],
        "why": "Excuse me pede licença ANTES. Sorry vem depois, quando já esbarrou."
      },
      {
        "q": "\"Eu já volto.\"",
        "a": "I'll be back soon.",
        "opts": [
          "I'll be back soon.",
          "I come back soon.",
          "I'll back soon.",
          "I return soon me."
        ],
        "why": "be back é a expressão pronta para voltar a um lugar."
      }
    ],
    "speak": [
      "Good morning! I'm Dr. Ana.",
      "How can I help you today?",
      "Nice to meet you, Mr. Silva.",
      "I'm the doctor on call today.",
      "I'll be back soon."
    ]
  },
  {
    "id": 802,
    "title": "How Are You Feeling?",
    "emoji": "🤒",
    "verbs": [
      "To Feel",
      "To Look",
      "To Get",
      "To Sleep"
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
        "en": "bad",
        "pt": "mal"
      },
      {
        "en": "better",
        "pt": "melhor"
      },
      {
        "en": "worse",
        "pt": "pior"
      },
      {
        "en": "the same",
        "pt": "igual"
      },
      {
        "en": "tired",
        "pt": "cansado"
      },
      {
        "en": "hot",
        "pt": "com calor"
      },
      {
        "en": "cold",
        "pt": "com frio"
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
        "en": "a little",
        "pt": "um pouco"
      },
      {
        "en": "a lot",
        "pt": "muito"
      },
      {
        "en": "since",
        "pt": "desde"
      },
      {
        "en": "to feel",
        "pt": "sentir-se"
      },
      {
        "en": "dizzy",
        "pt": "tonto"
      },
      {
        "en": "sick",
        "pt": "enjoado / doente"
      },
      {
        "en": "weak",
        "pt": "fraco"
      },
      {
        "en": "sore",
        "pt": "dolorido"
      },
      {
        "en": "swollen",
        "pt": "inchado"
      },
      {
        "en": "itchy",
        "pt": "com coceira"
      },
      {
        "en": "numb",
        "pt": "dormente"
      },
      {
        "en": "short of breath",
        "pt": "sem ar"
      },
      {
        "en": "lightheaded",
        "pt": "com a cabeça leve"
      },
      {
        "en": "shaky",
        "pt": "trêmulo"
      },
      {
        "en": "stuffy nose",
        "pt": "nariz entupido"
      },
      {
        "en": "run-down",
        "pt": "abatido"
      },
      {
        "en": "under the weather",
        "pt": "meio adoentado"
      },
      {
        "en": "to throw up",
        "pt": "vomitar"
      },
      {
        "en": "to pass out",
        "pt": "desmaiar"
      }
    ],
    "expressions": [
      {
        "expr": "How are you feeling today?",
        "meaning": "Como você está se sentindo hoje?",
        "example": "Good morning. How are you feeling today?"
      },
      {
        "expr": "I feel dizzy.",
        "meaning": "Estou tonto. — feel + adjetivo, sem 'me'",
        "example": "When I stand up, I feel dizzy."
      },
      {
        "expr": "Better or worse than yesterday?",
        "meaning": "Melhor ou pior que ontem? — a pergunta que mede evolução",
        "example": "Is the pain better or worse than yesterday?"
      },
      {
        "expr": "I'm short of breath.",
        "meaning": "Estou sem ar. — o que o paciente diz em vez de 'dispneia'",
        "example": "I'm short of breath when I climb the stairs."
      }
    ],
    "sentences": [
      "How are you feeling today?",
      "I feel dizzy when I stand up.",
      "Are you feeling better or worse?",
      "I feel weak and very tired.",
      "My arm is swollen and sore.",
      "I'm short of breath at night.",
      "I threw up twice this morning.",
      "I've felt sick since Monday."
    ],
    "grammar": {
      "title": "feel, be e o que o paciente realmente diz",
      "rules": [
        "⚠️ feel + adjetivo, sem pronome: I feel dizzy, nunca 'I feel me dizzy'.",
        "Fome, sede, frio e calor em inglês são com to be: I AM hungry, I AM cold.",
        "O paciente quase nunca usa o termo técnico. Ele diz short of breath, não dyspnea; itchy, não pruritus.",
        "Para comparar com ontem, use better / worse + than: worse than yesterday."
      ],
      "table": {
        "headers": [
          "O médico escreveria",
          "O paciente diz",
          "Português"
        ],
        "rows": [
          [
            "dyspnea",
            "short of breath",
            "falta de ar"
          ],
          [
            "vertigo",
            "dizzy",
            "tontura"
          ],
          [
            "pruritus",
            "itchy",
            "coceira"
          ],
          [
            "edema",
            "swollen",
            "inchado"
          ],
          [
            "emesis",
            "throw up",
            "vomitar"
          ],
          [
            "syncope",
            "pass out",
            "desmaiar"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu me sinto tonto.\"",
        "a": "I feel dizzy.",
        "opts": [
          "I feel dizzy.",
          "I feel me dizzy.",
          "I am feeling dizzy me.",
          "I feel dizziness me."
        ],
        "why": "feel + adjetivo, direto. Em inglês não entra pronome aí."
      },
      {
        "q": "O paciente tem falta de ar. Como ele descreve isso?",
        "a": "I'm short of breath.",
        "opts": [
          "I'm short of breath.",
          "I have dyspnea.",
          "I'm short of air.",
          "I have short breath."
        ],
        "why": "short of breath é o que se ouve de verdade. dyspnea aparece no prontuário, não na boca do paciente."
      },
      {
        "q": "\"Estou com sede.\"",
        "a": "I'm thirsty.",
        "opts": [
          "I'm thirsty.",
          "I have thirsty.",
          "I have thirst.",
          "I'm thirst."
        ],
        "why": "Sede, fome, frio e calor em inglês são com to be."
      },
      {
        "q": "\"A dor está pior que ontem.\"",
        "a": "The pain is worse than yesterday.",
        "opts": [
          "The pain is worse than yesterday.",
          "The pain is worst than yesterday.",
          "The pain is more bad than yesterday.",
          "The pain is worse that yesterday."
        ],
        "why": "O comparativo de bad é worse, e a comparação usa than."
      },
      {
        "q": "O paciente diz \"it's really itchy\". Do que ele está falando?",
        "a": "coceira",
        "opts": [
          "coceira",
          "inchaço",
          "dormência",
          "queimação"
        ],
        "why": "itchy = com coceira. No prontuário viraria prurido."
      }
    ],
    "speak": [
      "How are you feeling today?",
      "I feel dizzy when I stand up.",
      "Are you feeling better or worse?",
      "I'm short of breath at night.",
      "My arm is swollen and sore."
    ]
  },
  {
    "id": 803,
    "title": "Numbers & Doses",
    "emoji": "🔢",
    "verbs": [
      "To Take",
      "To Count",
      "To Weigh",
      "To Measure"
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
        "en": "twelve",
        "pt": "doze"
      },
      {
        "en": "twenty",
        "pt": "vinte"
      },
      {
        "en": "how many?",
        "pt": "quantos?"
      },
      {
        "en": "how much?",
        "pt": "quanto?"
      },
      {
        "en": "once a day",
        "pt": "uma vez ao dia"
      },
      {
        "en": "twice a day",
        "pt": "duas vezes ao dia"
      },
      {
        "en": "three times a day",
        "pt": "três vezes ao dia"
      },
      {
        "en": "every eight hours",
        "pt": "de oito em oito horas"
      },
      {
        "en": "pill",
        "pt": "comprimido"
      },
      {
        "en": "tablet",
        "pt": "comprimido"
      },
      {
        "en": "drop",
        "pt": "gota"
      },
      {
        "en": "spoonful",
        "pt": "colherada"
      },
      {
        "en": "shot",
        "pt": "injeção"
      },
      {
        "en": "refill",
        "pt": "renovação da receita"
      },
      {
        "en": "weight",
        "pt": "peso"
      },
      {
        "en": "height",
        "pt": "altura"
      },
      {
        "en": "blood pressure",
        "pt": "pressão arterial"
      },
      {
        "en": "before meals",
        "pt": "antes das refeições"
      },
      {
        "en": "at bedtime",
        "pt": "ao deitar"
      }
    ],
    "expressions": [
      {
        "expr": "Take one pill twice a day.",
        "meaning": "Tome um comprimido duas vezes ao dia.",
        "example": "Take one pill twice a day, after meals."
      },
      {
        "expr": "How many do you take?",
        "meaning": "Quantos você toma? — how many para o que se conta",
        "example": "How many pills do you take in the morning?"
      },
      {
        "expr": "What's your weight?",
        "meaning": "Qual é o seu peso?",
        "example": "What's your weight and your height?"
      },
      {
        "expr": "Every eight hours.",
        "meaning": "De oito em oito horas.",
        "example": "One tablet every eight hours for three days."
      }
    ],
    "sentences": [
      "Take one pill twice a day.",
      "How many pills do you take?",
      "Two drops in each eye at bedtime.",
      "One tablet every eight hours.",
      "Take it before meals, not after.",
      "What's your weight?",
      "Your blood pressure is a little high.",
      "Do you need a refill?"
    ],
    "grammar": {
      "title": "how many × how much, e a frequência",
      "rules": [
        "how many para o que se conta (pills, drops, days). how much para o que não se conta (water, blood, time).",
        "Frequência: once / twice / three times + a day. ⚠️ two times a day existe, mas o natural é twice.",
        "every + número + plural: every eight hours, every two days.",
        "Ordem da orientação: quanto → com que frequência → quando. \"One pill, twice a day, after meals.\""
      ],
      "table": {
        "headers": [
          "Frequência",
          "Inglês",
          "Exemplo"
        ],
        "rows": [
          [
            "1×/dia",
            "once a day",
            "Take it once a day."
          ],
          [
            "2×/dia",
            "twice a day",
            "One pill twice a day."
          ],
          [
            "3×/dia",
            "three times a day",
            "Three times a day, after meals."
          ],
          [
            "8/8h",
            "every eight hours",
            "One tablet every eight hours."
          ],
          [
            "ao deitar",
            "at bedtime",
            "Two drops at bedtime."
          ],
          [
            "se necessário",
            "as needed",
            "Take it as needed for pain."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Duas vezes ao dia.\"",
        "a": "twice a day",
        "opts": [
          "twice a day",
          "two times at day",
          "twice at day",
          "two time a day"
        ],
        "why": "twice é o natural para 2×. E a frequência usa a day, não at day."
      },
      {
        "q": "\"Quantos comprimidos você toma?\"",
        "a": "How many pills do you take?",
        "opts": [
          "How many pills do you take?",
          "How much pills do you take?",
          "How many pill do you take?",
          "How many pills you take?"
        ],
        "why": "pills se conta → how many, no plural, com do na pergunta."
      },
      {
        "q": "\"De oito em oito horas.\"",
        "a": "every eight hours",
        "opts": [
          "every eight hours",
          "each eight hours",
          "every eight hour",
          "at eight hours"
        ],
        "why": "every + número + plural. each não se usa para intervalo assim."
      },
      {
        "q": "\"Tome antes das refeições.\"",
        "a": "Take it before meals.",
        "opts": [
          "Take it before meals.",
          "Take it before the meals.",
          "Take before meals.",
          "Take it before meal."
        ],
        "why": "O imperativo precisa do objeto it, e meals vai no plural sem artigo."
      },
      {
        "q": "Qual delas NÃO se conta (pede how much)?",
        "a": "water",
        "opts": [
          "water",
          "pills",
          "drops",
          "days"
        ],
        "why": "water é incontável. Comprimidos, gotas e dias se contam."
      }
    ],
    "speak": [
      "Take one pill twice a day.",
      "How many pills do you take?",
      "One tablet every eight hours.",
      "Take it before meals, not after.",
      "Your blood pressure is a little high."
    ]
  },
  {
    "id": 804,
    "title": "Days, Hours, Shifts",
    "emoji": "⏰",
    "verbs": [
      "To Start",
      "To Finish",
      "To Wait",
      "To Come Back"
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
        "en": "weekend",
        "pt": "fim de semana"
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
        "en": "early",
        "pt": "cedo"
      },
      {
        "en": "night shift",
        "pt": "plantão noturno"
      },
      {
        "en": "day off",
        "pt": "folga"
      },
      {
        "en": "handover",
        "pt": "passagem de plantão"
      },
      {
        "en": "appointment",
        "pt": "consulta marcada"
      },
      {
        "en": "follow-up",
        "pt": "retorno"
      },
      {
        "en": "to book",
        "pt": "marcar"
      },
      {
        "en": "to reschedule",
        "pt": "remarcar"
      },
      {
        "en": "waiting list",
        "pt": "fila de espera"
      },
      {
        "en": "fasting",
        "pt": "em jejum"
      },
      {
        "en": "admission",
        "pt": "internação"
      },
      {
        "en": "discharge",
        "pt": "alta"
      },
      {
        "en": "overnight",
        "pt": "durante a noite"
      },
      {
        "en": "on duty",
        "pt": "de plantão"
      },
      {
        "en": "in a row",
        "pt": "seguidos"
      },
      {
        "en": "right away",
        "pt": "imediatamente"
      }
    ],
    "expressions": [
      {
        "expr": "What time is your appointment?",
        "meaning": "Que horas é a sua consulta?",
        "example": "What time is your appointment tomorrow?"
      },
      {
        "expr": "Come back in two weeks.",
        "meaning": "Volte daqui a duas semanas. — a orientação de retorno",
        "example": "Come back in two weeks for a follow-up."
      },
      {
        "expr": "You need to be fasting.",
        "meaning": "Você precisa estar em jejum.",
        "example": "For this test you need to be fasting since midnight."
      },
      {
        "expr": "I'm on duty tonight.",
        "meaning": "Estou de plantão hoje à noite.",
        "example": "Dr. Miller is on duty tonight, not me."
      }
    ],
    "sentences": [
      "What time is your appointment?",
      "The shift starts at seven.",
      "Come back in two weeks.",
      "I'm on the night shift tonight.",
      "Your follow-up is on Monday.",
      "You need to be fasting for the test.",
      "Can we reschedule for Friday?",
      "She was discharged yesterday."
    ],
    "grammar": {
      "title": "at, on, in — e o retorno com in",
      "rules": [
        "at + hora (at seven), on + dia (on Monday), in + mês ou parte do dia (in the morning).",
        "⚠️ today, tomorrow e yesterday não levam preposição nenhuma.",
        "Para retorno futuro, use in + período: come back IN two weeks (daqui a duas semanas).",
        "in two weeks é daqui a duas semanas; for two weeks é durante duas semanas. Trocar os dois muda a orientação."
      ],
      "table": {
        "headers": [
          "Você quer dizer",
          "Inglês",
          "❌ Erro comum"
        ],
        "rows": [
          [
            "às sete",
            "at seven",
            "in seven"
          ],
          [
            "na segunda",
            "on Monday",
            "in Monday"
          ],
          [
            "de manhã",
            "in the morning",
            "at the morning"
          ],
          [
            "amanhã",
            "tomorrow",
            "in tomorrow"
          ],
          [
            "daqui a 2 semanas",
            "in two weeks",
            "after two weeks"
          ],
          [
            "por 2 semanas",
            "for two weeks",
            "during two weeks"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"O plantão começa às sete.\"",
        "a": "The shift starts at seven.",
        "opts": [
          "The shift starts at seven.",
          "The shift starts in seven.",
          "The shift start at seven.",
          "The shift starts on seven."
        ],
        "why": "Hora exata leva at, e shift = it pede starts."
      },
      {
        "q": "\"Volte daqui a duas semanas.\"",
        "a": "Come back in two weeks.",
        "opts": [
          "Come back in two weeks.",
          "Come back after two weeks.",
          "Come back for two weeks.",
          "Come back on two weeks."
        ],
        "why": "in + período = daqui a. for two weeks seria ficar duas semanas."
      },
      {
        "q": "\"Seu retorno é na segunda.\"",
        "a": "Your follow-up is on Monday.",
        "opts": [
          "Your follow-up is on Monday.",
          "Your follow-up is in Monday.",
          "Your follow-up is at Monday.",
          "Your follow-up is Monday on."
        ],
        "why": "Dia da semana leva on, sempre com maiúscula."
      },
      {
        "q": "\"Você precisa estar em jejum.\"",
        "a": "You need to be fasting.",
        "opts": [
          "You need to be fasting.",
          "You need to be in fasting.",
          "You need be fasting.",
          "You need to be fast."
        ],
        "why": "need TO + verbo. E fasting é o adjetivo; fast sozinho é 'rápido'."
      },
      {
        "q": "\"Ela recebeu alta ontem.\"",
        "a": "She was discharged yesterday.",
        "opts": [
          "She was discharged yesterday.",
          "She was discharged in yesterday.",
          "She is discharged yesterday.",
          "She was discharge yesterday."
        ],
        "why": "yesterday não leva preposição, e o passado pede was + particípio."
      }
    ],
    "speak": [
      "What time is your appointment?",
      "The shift starts at seven.",
      "Come back in two weeks.",
      "You need to be fasting for the test.",
      "I'm on duty tonight."
    ]
  },
  {
    "id": 805,
    "title": "The Body — Outside",
    "emoji": "🧍",
    "verbs": [
      "To Move",
      "To Touch",
      "To Lift",
      "To Bend"
    ],
    "vocab": [
      {
        "en": "head",
        "pt": "cabeça"
      },
      {
        "en": "eye",
        "pt": "olho"
      },
      {
        "en": "ear",
        "pt": "orelha / ouvido"
      },
      {
        "en": "nose",
        "pt": "nariz"
      },
      {
        "en": "mouth",
        "pt": "boca"
      },
      {
        "en": "tooth",
        "pt": "dente"
      },
      {
        "en": "neck",
        "pt": "pescoço"
      },
      {
        "en": "shoulder",
        "pt": "ombro"
      },
      {
        "en": "arm",
        "pt": "braço"
      },
      {
        "en": "hand",
        "pt": "mão"
      },
      {
        "en": "finger",
        "pt": "dedo (da mão)"
      },
      {
        "en": "leg",
        "pt": "perna"
      },
      {
        "en": "knee",
        "pt": "joelho"
      },
      {
        "en": "foot",
        "pt": "pé"
      },
      {
        "en": "back",
        "pt": "costas"
      },
      {
        "en": "chest",
        "pt": "peito / tórax"
      },
      {
        "en": "belly",
        "pt": "barriga"
      },
      {
        "en": "hip",
        "pt": "quadril"
      },
      {
        "en": "ankle",
        "pt": "tornozelo"
      },
      {
        "en": "wrist",
        "pt": "punho"
      },
      {
        "en": "elbow",
        "pt": "cotovelo"
      },
      {
        "en": "jaw",
        "pt": "mandíbula"
      },
      {
        "en": "skin",
        "pt": "pele"
      },
      {
        "en": "rash",
        "pt": "manchas / erupção na pele"
      },
      {
        "en": "bruise",
        "pt": "hematoma"
      },
      {
        "en": "lump",
        "pt": "caroço / nódulo"
      },
      {
        "en": "scar",
        "pt": "cicatriz"
      },
      {
        "en": "cut",
        "pt": "corte"
      },
      {
        "en": "left",
        "pt": "esquerdo"
      },
      {
        "en": "right",
        "pt": "direito"
      }
    ],
    "expressions": [
      {
        "expr": "Which side?",
        "meaning": "Qual lado? — a pergunta que evita operar o lado errado",
        "example": "Which side? The left or the right?"
      },
      {
        "expr": "Can you move your fingers?",
        "meaning": "Você consegue mexer os dedos?",
        "example": "Can you move your fingers for me?"
      },
      {
        "expr": "There's a lump here.",
        "meaning": "Tem um caroço aqui.",
        "example": "I felt a lump here, under the skin."
      },
      {
        "expr": "How long have you had this rash?",
        "meaning": "Há quanto tempo você está com essas manchas?",
        "example": "How long have you had this rash on your arm?"
      }
    ],
    "sentences": [
      "Can you move your fingers?",
      "Which side hurts — left or right?",
      "My left knee is swollen.",
      "There's a rash on his chest.",
      "I found a lump under my arm.",
      "She has a bruise on her leg.",
      "Please raise your right arm.",
      "The cut is on his hand."
    ],
    "grammar": {
      "title": "Plurais irregulares e o possessivo do corpo",
      "rules": [
        "Três plurais do corpo fogem da regra: tooth → teeth, foot → feet, e o clássico child → children.",
        "⚠️ Em inglês a parte do corpo leva possessivo: raise YOUR arm, my left knee — nunca 'raise the arm'.",
        "left e right vêm antes da parte: my left knee, the right ear.",
        "rash, bruise, lump e cut são contáveis: a rash, two bruises."
      ],
      "table": {
        "headers": [
          "Singular",
          "Plural",
          "❌ Erro comum"
        ],
        "rows": [
          [
            "tooth",
            "teeth",
            "tooths"
          ],
          [
            "foot",
            "feet",
            "foots"
          ],
          [
            "hand",
            "hands",
            "—"
          ],
          [
            "o braço dele",
            "his arm",
            "the arm of him"
          ],
          [
            "levante o braço",
            "raise your arm",
            "raise the arm"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Qual é o plural de foot?",
        "a": "feet",
        "opts": [
          "feet",
          "foots",
          "feets",
          "foot"
        ],
        "why": "foot → feet é irregular, como tooth → teeth."
      },
      {
        "q": "\"Levante o braço direito.\"",
        "a": "Raise your right arm.",
        "opts": [
          "Raise your right arm.",
          "Raise the right arm.",
          "Raise your arm right.",
          "Raise right your arm."
        ],
        "why": "Parte do corpo leva possessivo em inglês, e left/right vêm antes."
      },
      {
        "q": "\"Meu joelho esquerdo está inchado.\"",
        "a": "My left knee is swollen.",
        "opts": [
          "My left knee is swollen.",
          "My knee left is swollen.",
          "The my left knee is swollen.",
          "My left knee are swollen."
        ],
        "why": "Ordem: possessivo + lado + parte. E knee é singular → is."
      },
      {
        "q": "O paciente diz \"I have a rash\". O que ele tem?",
        "a": "manchas na pele",
        "opts": [
          "manchas na pele",
          "um caroço",
          "um hematoma",
          "uma cicatriz"
        ],
        "why": "rash = erupção/manchas. Caroço é lump, hematoma é bruise."
      },
      {
        "q": "\"Ela tem um hematoma na perna.\"",
        "a": "She has a bruise on her leg.",
        "opts": [
          "She has a bruise on her leg.",
          "She has a bruise in her leg.",
          "She have a bruise on her leg.",
          "She has a bruise on the leg."
        ],
        "why": "she → has, lesão na superfície leva on, e a perna é her leg."
      }
    ],
    "speak": [
      "Can you move your fingers?",
      "Which side hurts — left or right?",
      "Please raise your right arm.",
      "There's a rash on his chest.",
      "My left knee is swollen."
    ]
  },
  {
    "id": 806,
    "title": "The Body — Inside",
    "emoji": "🫀",
    "verbs": [
      "To Breathe",
      "To Beat",
      "To Swallow",
      "To Work"
    ],
    "vocab": [
      {
        "en": "heart",
        "pt": "coração"
      },
      {
        "en": "blood",
        "pt": "sangue"
      },
      {
        "en": "bone",
        "pt": "osso"
      },
      {
        "en": "brain",
        "pt": "cérebro"
      },
      {
        "en": "lung",
        "pt": "pulmão"
      },
      {
        "en": "liver",
        "pt": "fígado"
      },
      {
        "en": "kidney",
        "pt": "rim"
      },
      {
        "en": "stomach",
        "pt": "estômago"
      },
      {
        "en": "muscle",
        "pt": "músculo"
      },
      {
        "en": "skull",
        "pt": "crânio"
      },
      {
        "en": "throat",
        "pt": "garganta"
      },
      {
        "en": "tongue",
        "pt": "língua"
      },
      {
        "en": "inside",
        "pt": "dentro"
      },
      {
        "en": "deep",
        "pt": "profundo"
      },
      {
        "en": "to breathe",
        "pt": "respirar"
      },
      {
        "en": "heartbeat",
        "pt": "batimento cardíaco"
      },
      {
        "en": "pulse",
        "pt": "pulso"
      },
      {
        "en": "breath",
        "pt": "respiração (o ar)"
      },
      {
        "en": "bowel",
        "pt": "intestino"
      },
      {
        "en": "bladder",
        "pt": "bexiga"
      },
      {
        "en": "womb",
        "pt": "útero"
      },
      {
        "en": "gut",
        "pt": "tripa / intestino (informal)"
      },
      {
        "en": "airway",
        "pt": "via aérea"
      },
      {
        "en": "wheezing",
        "pt": "chiado no peito"
      },
      {
        "en": "heartburn",
        "pt": "azia"
      },
      {
        "en": "to swallow",
        "pt": "engolir"
      },
      {
        "en": "to cough",
        "pt": "tossir"
      },
      {
        "en": "to bleed",
        "pt": "sangrar"
      },
      {
        "en": "tight",
        "pt": "apertado (no peito)"
      },
      {
        "en": "pounding",
        "pt": "acelerado / batendo forte"
      }
    ],
    "expressions": [
      {
        "expr": "Take a deep breath.",
        "meaning": "Respire fundo. — o comando mais usado do exame físico",
        "example": "Take a deep breath and hold it."
      },
      {
        "expr": "My chest feels tight.",
        "meaning": "Meu peito está apertado.",
        "example": "When I walk fast, my chest feels tight."
      },
      {
        "expr": "My heart is pounding.",
        "meaning": "Meu coração está acelerado.",
        "example": "I woke up and my heart was pounding."
      },
      {
        "expr": "Does it hurt when you swallow?",
        "meaning": "Dói quando você engole?",
        "example": "Does it hurt when you swallow?"
      }
    ],
    "sentences": [
      "Take a deep breath, please.",
      "My chest feels tight.",
      "I hear some wheezing.",
      "My heart is pounding at night.",
      "Does it hurt when you swallow?",
      "I get heartburn after meals.",
      "Your pulse is a little fast.",
      "He coughed up some blood."
    ],
    "grammar": {
      "title": "Os órgãos são fáceis — o difícil é a sensação",
      "rules": [
        "Muita palavra de órgão é cognata e você já sabe: stomach, muscle, brain (cérebro).",
        "⚠️ Cuidado com os falsos amigos: liver é fígado (não 'livre'), bowel é intestino, womb é útero.",
        "breathe é o verbo (respirar) e breath é o substantivo (a respiração). Som e grafia diferentes.",
        "Para descrever sensação use feel + adjetivo: my chest feels tight, my leg feels numb."
      ],
      "table": {
        "headers": [
          "Técnico (você já sabe)",
          "O que o paciente diz",
          "Português"
        ],
        "rows": [
          [
            "palpitations",
            "my heart is pounding",
            "coração acelerado"
          ],
          [
            "thoracic tightness",
            "my chest feels tight",
            "aperto no peito"
          ],
          [
            "pyrosis",
            "heartburn",
            "azia"
          ],
          [
            "dysphagia",
            "it hurts when I swallow",
            "dor ao engolir"
          ],
          [
            "wheezing",
            "whistling in my chest",
            "chiado"
          ],
          [
            "hemoptysis",
            "I coughed up blood",
            "tosse com sangue"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Respire fundo.\"",
        "a": "Take a deep breath.",
        "opts": [
          "Take a deep breath.",
          "Take a deep breathe.",
          "Make a deep breath.",
          "Take a big breath in deep."
        ],
        "why": "A expressão pronta é take a deep BREATH — o substantivo, não o verbo breathe."
      },
      {
        "q": "O que significa liver?",
        "a": "fígado",
        "opts": [
          "fígado",
          "rim",
          "pulmão",
          "baço"
        ],
        "why": "liver = fígado. Rim é kidney, pulmão é lung."
      },
      {
        "q": "O paciente diz \"my chest feels tight\". O que ele sente?",
        "a": "aperto no peito",
        "opts": [
          "aperto no peito",
          "queimação no peito",
          "palpitação",
          "falta de ar"
        ],
        "why": "tight = apertado. Azia seria heartburn."
      },
      {
        "q": "\"Dói quando você engole?\"",
        "a": "Does it hurt when you swallow?",
        "opts": [
          "Does it hurt when you swallow?",
          "Does it hurts when you swallow?",
          "Do it hurt when you swallow?",
          "Is it hurt when you swallow?"
        ],
        "why": "it → does, e depois de does o verbo fica puro: hurt."
      },
      {
        "q": "\"Ele tossiu sangue.\"",
        "a": "He coughed up some blood.",
        "opts": [
          "He coughed up some blood.",
          "He coughed up a blood.",
          "He cough up some blood.",
          "He coughed up many blood."
        ],
        "why": "cough up é o phrasal para expelir tossindo, e blood é incontável: some, nunca a."
      }
    ],
    "speak": [
      "Take a deep breath, please.",
      "My chest feels tight.",
      "Does it hurt when you swallow?",
      "Your pulse is a little fast.",
      "I get heartburn after meals."
    ]
  },
  {
    "id": 807,
    "title": "Pain Words",
    "emoji": "😣",
    "verbs": [
      "To Hurt",
      "To Ache",
      "To Start",
      "To Spread"
    ],
    "vocab": [
      {
        "en": "pain",
        "pt": "dor"
      },
      {
        "en": "to hurt",
        "pt": "doer"
      },
      {
        "en": "where",
        "pt": "onde"
      },
      {
        "en": "when",
        "pt": "quando"
      },
      {
        "en": "how long",
        "pt": "há quanto tempo"
      },
      {
        "en": "strong",
        "pt": "forte"
      },
      {
        "en": "mild",
        "pt": "leve"
      },
      {
        "en": "always",
        "pt": "sempre"
      },
      {
        "en": "sometimes",
        "pt": "às vezes"
      },
      {
        "en": "suddenly",
        "pt": "de repente"
      },
      {
        "en": "slowly",
        "pt": "devagar"
      },
      {
        "en": "worse",
        "pt": "pior"
      },
      {
        "en": "from one to ten",
        "pt": "de um a dez"
      },
      {
        "en": "point to",
        "pt": "apontar para"
      },
      {
        "en": "to show",
        "pt": "mostrar"
      },
      {
        "en": "sharp",
        "pt": "dor em fisgada"
      },
      {
        "en": "dull",
        "pt": "dor surda"
      },
      {
        "en": "burning",
        "pt": "queimação"
      },
      {
        "en": "stabbing",
        "pt": "dor em punhalada"
      },
      {
        "en": "throbbing",
        "pt": "dor latejante"
      },
      {
        "en": "cramping",
        "pt": "cólica"
      },
      {
        "en": "aching",
        "pt": "dor contínua e fraca"
      },
      {
        "en": "tender",
        "pt": "dolorido ao toque"
      },
      {
        "en": "to come and go",
        "pt": "ir e vir"
      },
      {
        "en": "to spread",
        "pt": "irradiar"
      },
      {
        "en": "painkiller",
        "pt": "analgésico"
      },
      {
        "en": "to get worse",
        "pt": "piorar"
      },
      {
        "en": "to ease off",
        "pt": "aliviar"
      },
      {
        "en": "attack",
        "pt": "crise"
      },
      {
        "en": "flare-up",
        "pt": "surto / reagudização"
      }
    ],
    "expressions": [
      {
        "expr": "Where does it hurt?",
        "meaning": "Onde dói? — a pergunta número um",
        "example": "Where does it hurt? Can you point to it?"
      },
      {
        "expr": "What kind of pain is it?",
        "meaning": "Que tipo de dor é? — abre o caráter da dor",
        "example": "What kind of pain is it — sharp or dull?"
      },
      {
        "expr": "From one to ten, how bad is it?",
        "meaning": "De um a dez, quanto dói?",
        "example": "From one to ten, how bad is the pain right now?"
      },
      {
        "expr": "Does it spread anywhere?",
        "meaning": "A dor irradia para algum lugar?",
        "example": "Does the pain spread to your arm or your jaw?"
      }
    ],
    "sentences": [
      "Where does it hurt?",
      "What kind of pain is it?",
      "Is it sharp or dull?",
      "From one to ten, how bad is it?",
      "Does the pain spread anywhere?",
      "It comes and goes all day.",
      "It gets worse when I walk.",
      "The painkiller helps a little."
    ],
    "grammar": {
      "title": "Perguntar sobre a dor",
      "rules": [
        "⚠️ hurt é verbo: it hurts, my leg hurts. pain é substantivo: I have pain. Nunca 'I have hurt'.",
        "Com it / he / she o verbo ganha -s: it hurtS. Mas depois de does ele fica puro: does it HURT?",
        "O caráter da dor vem em adjetivos terminados em -ing: burning, throbbing, stabbing, cramping.",
        "Para o que vai e volta, o inglês tem a expressão pronta it comes and goes."
      ],
      "table": {
        "headers": [
          "Tipo de dor",
          "Inglês",
          "Como o paciente explica"
        ],
        "rows": [
          [
            "fisgada",
            "sharp",
            "like a needle"
          ],
          [
            "surda",
            "dull",
            "a heavy, constant pain"
          ],
          [
            "queimação",
            "burning",
            "like something hot"
          ],
          [
            "punhalada",
            "stabbing",
            "like a knife"
          ],
          [
            "latejante",
            "throbbing",
            "it beats with my heart"
          ],
          [
            "cólica",
            "cramping",
            "it squeezes and lets go"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Onde dói?\"",
        "a": "Where does it hurt?",
        "opts": [
          "Where does it hurt?",
          "Where does it hurts?",
          "Where it hurts?",
          "Where do it hurt?"
        ],
        "why": "it → does, e depois de does o verbo fica puro: hurt."
      },
      {
        "q": "\"Eu tenho dor no peito.\"",
        "a": "I have pain in my chest.",
        "opts": [
          "I have pain in my chest.",
          "I have hurt in my chest.",
          "I have a pain of chest.",
          "I am pain in my chest."
        ],
        "why": "pain é o substantivo que anda com have. hurt é verbo."
      },
      {
        "q": "O paciente diz que a dor é \"stabbing\". Que dor é essa?",
        "a": "em punhalada",
        "opts": [
          "em punhalada",
          "em queimação",
          "latejante",
          "em cólica"
        ],
        "why": "stab = apunhalar. Queimação é burning, latejante é throbbing."
      },
      {
        "q": "\"A dor vai e volta.\"",
        "a": "The pain comes and goes.",
        "opts": [
          "The pain comes and goes.",
          "The pain come and go.",
          "The pain goes and comes.",
          "The pain is coming and going always."
        ],
        "why": "comes and goes é expressão pronta, nessa ordem, e pain = it pede o -s."
      },
      {
        "q": "\"Piora quando eu ando.\"",
        "a": "It gets worse when I walk.",
        "opts": [
          "It gets worse when I walk.",
          "It gets worst when I walk.",
          "It get worse when I walk.",
          "It becomes more bad when I walk."
        ],
        "why": "get worse = piorar. worst é o superlativo, para o pior de todos."
      }
    ],
    "speak": [
      "Where does it hurt?",
      "What kind of pain is it?",
      "Is it sharp or dull?",
      "From one to ten, how bad is it?",
      "Does the pain spread anywhere?"
    ]
  },
  {
    "id": 808,
    "title": "Common Symptoms",
    "emoji": "🤧",
    "verbs": [
      "To Have",
      "To Get",
      "To Feel",
      "To Notice"
    ],
    "vocab": [
      {
        "en": "to have",
        "pt": "ter"
      },
      {
        "en": "since",
        "pt": "desde"
      },
      {
        "en": "for",
        "pt": "há / durante"
      },
      {
        "en": "every night",
        "pt": "toda noite"
      },
      {
        "en": "at night",
        "pt": "à noite"
      },
      {
        "en": "after eating",
        "pt": "depois de comer"
      },
      {
        "en": "any",
        "pt": "algum / nenhum"
      },
      {
        "en": "also",
        "pt": "também"
      },
      {
        "en": "still",
        "pt": "ainda"
      },
      {
        "en": "not yet",
        "pt": "ainda não"
      },
      {
        "en": "a few days",
        "pt": "alguns dias"
      },
      {
        "en": "to notice",
        "pt": "notar"
      },
      {
        "en": "to start",
        "pt": "começar"
      },
      {
        "en": "to stop",
        "pt": "parar"
      },
      {
        "en": "to change",
        "pt": "mudar"
      },
      {
        "en": "fever",
        "pt": "febre"
      },
      {
        "en": "cough",
        "pt": "tosse"
      },
      {
        "en": "sore throat",
        "pt": "dor de garganta"
      },
      {
        "en": "headache",
        "pt": "dor de cabeça"
      },
      {
        "en": "runny nose",
        "pt": "nariz escorrendo"
      },
      {
        "en": "chills",
        "pt": "calafrios"
      },
      {
        "en": "rash",
        "pt": "manchas na pele"
      },
      {
        "en": "diarrhea",
        "pt": "diarreia"
      },
      {
        "en": "constipation",
        "pt": "prisão de ventre"
      },
      {
        "en": "nosebleed",
        "pt": "sangramento nasal"
      },
      {
        "en": "blurred vision",
        "pt": "visão embaçada"
      },
      {
        "en": "ringing in the ears",
        "pt": "zumbido no ouvido"
      },
      {
        "en": "night sweats",
        "pt": "sudorese noturna"
      },
      {
        "en": "weight loss",
        "pt": "perda de peso"
      },
      {
        "en": "loss of appetite",
        "pt": "falta de apetite"
      }
    ],
    "expressions": [
      {
        "expr": "Do you have any other symptoms?",
        "meaning": "Você tem outros sintomas? — a pergunta que fecha a lista",
        "example": "Do you have any other symptoms — fever, cough, anything?"
      },
      {
        "expr": "How long have you had it?",
        "meaning": "Há quanto tempo você está com isso?",
        "example": "How long have you had this cough?"
      },
      {
        "expr": "for three days / since Monday",
        "meaning": "há três dias / desde segunda",
        "example": "I've had a fever for three days."
      },
      {
        "expr": "It started after…",
        "meaning": "Começou depois de…",
        "example": "It started after I ate at a restaurant."
      }
    ],
    "sentences": [
      "Do you have any other symptoms?",
      "How long have you had this cough?",
      "I've had a fever for three days.",
      "I've had a sore throat since Monday.",
      "She has chills and night sweats.",
      "Any headache or blurred vision?",
      "It started after I ate out.",
      "I've noticed some weight loss."
    ],
    "grammar": {
      "title": "for e since — o tempo do sintoma",
      "rules": [
        "⚠️ for + duração (for three days, for a week). since + o ponto de início (since Monday, since yesterday).",
        "A pergunta padrão é How long have you had…? — porque o sintoma começou antes e continua agora.",
        "any aparece em pergunta e negativa: Do you have ANY pain? / I don't have any fever.",
        "Sintoma em inglês quase sempre anda com have: have a fever, have a cough, have a headache."
      ],
      "table": {
        "headers": [
          "Português",
          "Inglês",
          "for ou since?"
        ],
        "rows": [
          [
            "há três dias",
            "for three days",
            "for — é duração"
          ],
          [
            "desde segunda",
            "since Monday",
            "since — é o começo"
          ],
          [
            "há uma semana",
            "for a week",
            "for"
          ],
          [
            "desde ontem",
            "since yesterday",
            "since"
          ],
          [
            "há muito tempo",
            "for a long time",
            "for"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Estou com febre há três dias.\"",
        "a": "I've had a fever for three days.",
        "opts": [
          "I've had a fever for three days.",
          "I've had a fever since three days.",
          "I have fever for three days.",
          "I'm with fever for three days."
        ],
        "why": "for + duração. E febre anda com have: have A fever."
      },
      {
        "q": "\"Estou com dor de garganta desde segunda.\"",
        "a": "I've had a sore throat since Monday.",
        "opts": [
          "I've had a sore throat since Monday.",
          "I've had a sore throat for Monday.",
          "I have a sore throat since Monday.",
          "I've had sore throat since the Monday."
        ],
        "why": "since marca o ponto em que começou."
      },
      {
        "q": "\"Você tem outros sintomas?\"",
        "a": "Do you have any other symptoms?",
        "opts": [
          "Do you have any other symptoms?",
          "Do you have some other symptoms?",
          "Have you any others symptoms?",
          "Do you have any other symptom?"
        ],
        "why": "Em pergunta usa-se any, e symptoms vai no plural."
      },
      {
        "q": "O paciente diz \"there's a ringing in my ears\". O que é?",
        "a": "zumbido no ouvido",
        "opts": [
          "zumbido no ouvido",
          "dor de ouvido",
          "perda de audição",
          "tontura"
        ],
        "why": "É como o paciente descreve o que você anotaria como tinnitus."
      },
      {
        "q": "\"Há quanto tempo você está com essa tosse?\"",
        "a": "How long have you had this cough?",
        "opts": [
          "How long have you had this cough?",
          "How much time you have this cough?",
          "How long do you have this cough?",
          "How long are you with this cough?"
        ],
        "why": "Sintoma que começou antes e continua agora pede have had."
      }
    ],
    "speak": [
      "Do you have any other symptoms?",
      "How long have you had this cough?",
      "I've had a fever for three days.",
      "Any headache or blurred vision?",
      "It started after I ate out."
    ]
  },
  {
    "id": 809,
    "title": "At the Front Desk",
    "emoji": "🏥",
    "verbs": [
      "To Wait",
      "To Fill In",
      "To Sign",
      "To Call"
    ],
    "vocab": [
      {
        "en": "name",
        "pt": "nome"
      },
      {
        "en": "last name",
        "pt": "sobrenome"
      },
      {
        "en": "address",
        "pt": "endereço"
      },
      {
        "en": "phone number",
        "pt": "telefone"
      },
      {
        "en": "date of birth",
        "pt": "data de nascimento"
      },
      {
        "en": "age",
        "pt": "idade"
      },
      {
        "en": "to spell",
        "pt": "soletrar"
      },
      {
        "en": "to sign",
        "pt": "assinar"
      },
      {
        "en": "to wait",
        "pt": "esperar"
      },
      {
        "en": "line",
        "pt": "fila"
      },
      {
        "en": "next",
        "pt": "próximo"
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
        "en": "of course",
        "pt": "claro"
      },
      {
        "en": "just a moment",
        "pt": "um momento"
      },
      {
        "en": "form",
        "pt": "formulário / ficha"
      },
      {
        "en": "to fill in",
        "pt": "preencher"
      },
      {
        "en": "insurance",
        "pt": "convênio"
      },
      {
        "en": "ID card",
        "pt": "documento"
      },
      {
        "en": "referral",
        "pt": "encaminhamento"
      },
      {
        "en": "walk-in",
        "pt": "atendimento sem hora marcada"
      },
      {
        "en": "emergency room",
        "pt": "pronto-socorro"
      },
      {
        "en": "reception",
        "pt": "recepção"
      },
      {
        "en": "record",
        "pt": "registro"
      },
      {
        "en": "consent",
        "pt": "consentimento"
      },
      {
        "en": "next of kin",
        "pt": "familiar responsável"
      },
      {
        "en": "wheelchair",
        "pt": "cadeira de rodas"
      },
      {
        "en": "stretcher",
        "pt": "maca"
      },
      {
        "en": "to check in",
        "pt": "dar entrada"
      },
      {
        "en": "to be seen",
        "pt": "ser atendido"
      }
    ],
    "expressions": [
      {
        "expr": "Can you spell that, please?",
        "meaning": "Pode soletrar, por favor? — resolve nome estrangeiro na hora",
        "example": "Silva? Can you spell that, please?"
      },
      {
        "expr": "Please fill in this form.",
        "meaning": "Por favor, preencha esta ficha.",
        "example": "Please fill in this form and sign at the bottom."
      },
      {
        "expr": "Take a seat, please.",
        "meaning": "Sente-se, por favor.",
        "example": "Take a seat, please. The doctor will call you."
      },
      {
        "expr": "You'll be seen shortly.",
        "meaning": "Você será atendido em breve.",
        "example": "There are two people ahead of you. You'll be seen shortly."
      }
    ],
    "sentences": [
      "What's your full name, please?",
      "Can you spell that, please?",
      "What's your date of birth?",
      "Please fill in this form.",
      "Do you have your ID card?",
      "Take a seat, please.",
      "The doctor will call you.",
      "Sorry, can you say that again?"
    ],
    "grammar": {
      "title": "Pedir dados sem soar ríspido",
      "rules": [
        "O imperativo sozinho soa como ordem. Com please, ou com Can you…?, vira pedido.",
        "What's your…? é a forma padrão para pedir dado: name, date of birth, phone number.",
        "⚠️ Para repetir, peça Can you say that again? — 'repeat please' sozinho soa seco.",
        "Datas em inglês: o mês costuma vir antes do dia nos EUA (March 5th) e depois no Reino Unido (5 March)."
      ],
      "table": {
        "headers": [
          "Você quer",
          "Direto demais",
          "Educado"
        ],
        "rows": [
          [
            "o nome",
            "Your name.",
            "What's your name, please?"
          ],
          [
            "soletrar",
            "Spell it.",
            "Can you spell that, please?"
          ],
          [
            "preencher",
            "Fill this.",
            "Please fill in this form."
          ],
          [
            "esperar",
            "Wait there.",
            "Take a seat, please."
          ],
          [
            "repetir",
            "Repeat.",
            "Sorry, can you say that again?"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Qual é o seu nome completo?\"",
        "a": "What's your full name?",
        "opts": [
          "What's your full name?",
          "Which is your full name?",
          "What's your complete name?",
          "How is your full name?"
        ],
        "why": "Nome se pergunta com What's, não How is nem Which."
      },
      {
        "q": "Você não entendeu o sobrenome. O que pede?",
        "a": "Can you spell that, please?",
        "opts": [
          "Can you spell that, please?",
          "Can you write that in the air?",
          "How do you write it me?",
          "Spell it."
        ],
        "why": "to spell = soletrar. E Can you…? transforma ordem em pedido."
      },
      {
        "q": "\"Por favor, preencha esta ficha.\"",
        "a": "Please fill in this form.",
        "opts": [
          "Please fill in this form.",
          "Please fill this form in it.",
          "Please complete in this form.",
          "Please fill on this form."
        ],
        "why": "fill in é o phrasal verb de preencher."
      },
      {
        "q": "\"Sente-se, por favor.\"",
        "a": "Take a seat, please.",
        "opts": [
          "Take a seat, please.",
          "Sit you, please.",
          "Take a chair, please.",
          "Seat here, please."
        ],
        "why": "Take a seat é a fórmula educada. Sit down sozinho é mais direto."
      },
      {
        "q": "\"Qual é a sua data de nascimento?\"",
        "a": "What's your date of birth?",
        "opts": [
          "What's your date of birth?",
          "What's your birth date of?",
          "When is your date of born?",
          "What's your born date?"
        ],
        "why": "date of birth é a expressão fixa usada em qualquer ficha."
      }
    ],
    "speak": [
      "What's your full name, please?",
      "Can you spell that, please?",
      "What's your date of birth?",
      "Please fill in this form.",
      "Take a seat, please."
    ]
  },
  {
    "id": 810,
    "title": "Family & History",
    "emoji": "👨‍👩‍👦",
    "verbs": [
      "To Run",
      "To Die",
      "To Smoke",
      "To Drink"
    ],
    "vocab": [
      {
        "en": "family",
        "pt": "família"
      },
      {
        "en": "mother",
        "pt": "mãe"
      },
      {
        "en": "father",
        "pt": "pai"
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
        "en": "grandmother",
        "pt": "avó"
      },
      {
        "en": "grandfather",
        "pt": "avô"
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
        "en": "both",
        "pt": "ambos"
      },
      {
        "en": "nobody",
        "pt": "ninguém"
      },
      {
        "en": "ever",
        "pt": "alguma vez"
      },
      {
        "en": "never",
        "pt": "nunca"
      },
      {
        "en": "to run in the family",
        "pt": "ser de família"
      },
      {
        "en": "family history",
        "pt": "história familiar"
      },
      {
        "en": "to pass away",
        "pt": "falecer"
      },
      {
        "en": "heart disease",
        "pt": "doença cardíaca"
      },
      {
        "en": "stroke",
        "pt": "AVC"
      },
      {
        "en": "high blood pressure",
        "pt": "pressão alta"
      },
      {
        "en": "to smoke",
        "pt": "fumar"
      },
      {
        "en": "to quit",
        "pt": "parar (de fumar)"
      },
      {
        "en": "pack a day",
        "pt": "maço por dia"
      },
      {
        "en": "to drink",
        "pt": "beber (álcool)"
      },
      {
        "en": "drug",
        "pt": "droga / medicamento"
      },
      {
        "en": "allergy",
        "pt": "alergia"
      },
      {
        "en": "surgery",
        "pt": "cirurgia"
      },
      {
        "en": "pregnant",
        "pt": "grávida"
      },
      {
        "en": "checkup",
        "pt": "consulta de rotina"
      }
    ],
    "expressions": [
      {
        "expr": "Does it run in the family?",
        "meaning": "Isso é de família? — a pergunta da história familiar",
        "example": "Does diabetes run in the family?"
      },
      {
        "expr": "Have you ever had…?",
        "meaning": "Você já teve…? — ever abre a vida inteira",
        "example": "Have you ever had surgery?"
      },
      {
        "expr": "Do you smoke?",
        "meaning": "Você fuma? — pergunte sem julgamento na voz",
        "example": "Do you smoke? How many a day?"
      },
      {
        "expr": "I'm sorry to hear that.",
        "meaning": "Sinto muito por isso. — depois de uma perda",
        "example": "Your father passed away last year? I'm sorry to hear that."
      }
    ],
    "sentences": [
      "Does it run in the family?",
      "Have you ever had surgery?",
      "My mother had high blood pressure.",
      "My father passed away two years ago.",
      "Do you smoke? How many a day?",
      "I quit smoking five years ago.",
      "Are you allergic to any medicine?",
      "Is there any chance you're pregnant?"
    ],
    "grammar": {
      "title": "Have you ever…? — perguntar sobre a vida inteira",
      "rules": [
        "Have you ever + particípio pergunta se aconteceu alguma vez até hoje: Have you ever HAD surgery?",
        "A resposta curta é Yes, I have / No, I haven't — nunca 'Yes, I had'.",
        "⚠️ to pass away é a forma delicada de dizer que alguém morreu. to die é correto mas cru na frente da família.",
        "Para alergia use be allergic TO: I'm allergic to penicillin."
      ],
      "table": {
        "headers": [
          "Pergunta",
          "Inglês",
          "Resposta curta"
        ],
        "rows": [
          [
            "Já fez cirurgia?",
            "Have you ever had surgery?",
            "Yes, I have."
          ],
          [
            "Você fuma?",
            "Do you smoke?",
            "No, I don't."
          ],
          [
            "Já fumou?",
            "Did you ever smoke?",
            "Yes, I did."
          ],
          [
            "É de família?",
            "Does it run in the family?",
            "Yes, it does."
          ],
          [
            "Tem alergia?",
            "Are you allergic to anything?",
            "No, I'm not."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Você já fez cirurgia?\"",
        "a": "Have you ever had surgery?",
        "opts": [
          "Have you ever had surgery?",
          "Have you ever have surgery?",
          "Did you ever have surgery before now?",
          "Do you ever had surgery?"
        ],
        "why": "have + ever + particípio (had) para a vida inteira até hoje."
      },
      {
        "q": "\"Sou alérgico a penicilina.\"",
        "a": "I'm allergic to penicillin.",
        "opts": [
          "I'm allergic to penicillin.",
          "I'm allergic of penicillin.",
          "I have allergic to penicillin.",
          "I'm allergy to penicillin."
        ],
        "why": "be allergic TO. allergy é o substantivo; allergic é o adjetivo."
      },
      {
        "q": "\"Minha mãe tinha pressão alta.\"",
        "a": "My mother had high blood pressure.",
        "opts": [
          "My mother had high blood pressure.",
          "My mother has high blood pressure.",
          "My mother had high pressure of blood.",
          "My mother had the high blood pressure."
        ],
        "why": "Passado → had. E a expressão fixa é high blood pressure."
      },
      {
        "q": "O paciente diz que o pai \"passed away\". O que aconteceu?",
        "a": "o pai faleceu",
        "opts": [
          "o pai faleceu",
          "o pai desmaiou",
          "o pai melhorou",
          "o pai foi embora"
        ],
        "why": "pass away é a forma delicada de dizer morrer. Desmaiar é pass out — cuidado para não trocar."
      },
      {
        "q": "\"Isso é de família?\"",
        "a": "Does it run in the family?",
        "opts": [
          "Does it run in the family?",
          "Does it run on the family?",
          "Is it from family?",
          "Does it come of family?"
        ],
        "why": "run in the family é expressão pronta para doença hereditária."
      }
    ],
    "speak": [
      "Does it run in the family?",
      "Have you ever had surgery?",
      "Do you smoke? How many a day?",
      "Are you allergic to any medicine?",
      "I'm sorry to hear that."
    ]
  },
  {
    "id": 811,
    "title": "Food, Sleep, Habits",
    "emoji": "🥗",
    "verbs": [
      "To Eat",
      "To Sleep",
      "To Exercise",
      "To Avoid"
    ],
    "vocab": [
      {
        "en": "food",
        "pt": "comida"
      },
      {
        "en": "water",
        "pt": "água"
      },
      {
        "en": "salt",
        "pt": "sal"
      },
      {
        "en": "sugar",
        "pt": "açúcar"
      },
      {
        "en": "fat",
        "pt": "gordura"
      },
      {
        "en": "meat",
        "pt": "carne"
      },
      {
        "en": "vegetables",
        "pt": "verduras"
      },
      {
        "en": "fruit",
        "pt": "fruta"
      },
      {
        "en": "coffee",
        "pt": "café"
      },
      {
        "en": "breakfast",
        "pt": "café da manhã"
      },
      {
        "en": "lunch",
        "pt": "almoço"
      },
      {
        "en": "dinner",
        "pt": "jantar"
      },
      {
        "en": "to sleep",
        "pt": "dormir"
      },
      {
        "en": "enough",
        "pt": "suficiente"
      },
      {
        "en": "instead of",
        "pt": "em vez de"
      },
      {
        "en": "diet",
        "pt": "alimentação"
      },
      {
        "en": "to cut down on",
        "pt": "reduzir"
      },
      {
        "en": "to avoid",
        "pt": "evitar"
      },
      {
        "en": "to gain weight",
        "pt": "engordar"
      },
      {
        "en": "to lose weight",
        "pt": "emagrecer"
      },
      {
        "en": "exercise",
        "pt": "exercício"
      },
      {
        "en": "to work out",
        "pt": "malhar"
      },
      {
        "en": "bedtime",
        "pt": "hora de dormir"
      },
      {
        "en": "to fall asleep",
        "pt": "pegar no sono"
      },
      {
        "en": "to wake up",
        "pt": "acordar"
      },
      {
        "en": "snoring",
        "pt": "ronco"
      },
      {
        "en": "stress",
        "pt": "estresse"
      },
      {
        "en": "bowel movement",
        "pt": "evacuação"
      },
      {
        "en": "water intake",
        "pt": "ingestão de água"
      },
      {
        "en": "lifestyle",
        "pt": "estilo de vida"
      }
    ],
    "expressions": [
      {
        "expr": "How well do you sleep?",
        "meaning": "Como você dorme? — melhor que 'do you sleep well?'",
        "example": "How well do you sleep at night?"
      },
      {
        "expr": "Try to cut down on salt.",
        "meaning": "Tente reduzir o sal.",
        "example": "Try to cut down on salt and fried food."
      },
      {
        "expr": "Do you exercise?",
        "meaning": "Você faz exercício? — ⚠️ exercise é o verbo, sem 'do exercise'",
        "example": "Do you exercise? How many times a week?"
      },
      {
        "expr": "I have trouble falling asleep.",
        "meaning": "Tenho dificuldade para pegar no sono.",
        "example": "I have trouble falling asleep before midnight."
      }
    ],
    "sentences": [
      "How well do you sleep at night?",
      "I have trouble falling asleep.",
      "Do you exercise during the week?",
      "Try to cut down on salt.",
      "Drink more water every day.",
      "I wake up three times a night.",
      "Avoid fried food for two weeks.",
      "Have you lost weight recently?"
    ],
    "grammar": {
      "title": "Orientar sem mandar: try to, avoid, cut down on",
      "rules": [
        "⚠️ avoid pede o verbo com -ing: avoid EATING late, nunca 'avoid to eat'.",
        "try to + verbo puro: try TO drink more water.",
        "cut down on = reduzir (não cortar de vez). cut out = cortar completamente.",
        "Orientação soa melhor como sugestão: 'Try to…' e 'It would help to…' em vez de 'You must…'."
      ],
      "table": {
        "headers": [
          "Você quer dizer",
          "Inglês",
          "❌ Erro comum"
        ],
        "rows": [
          [
            "evite comer tarde",
            "avoid eating late",
            "avoid to eat late"
          ],
          [
            "tente beber mais água",
            "try to drink more water",
            "try drink more water"
          ],
          [
            "reduza o sal",
            "cut down on salt",
            "cut down the salt"
          ],
          [
            "faço exercício",
            "I exercise",
            "I do exercise"
          ],
          [
            "durmo mal",
            "I don't sleep well",
            "I sleep bad"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Evite comer tarde.\"",
        "a": "Avoid eating late.",
        "opts": [
          "Avoid eating late.",
          "Avoid to eat late.",
          "Avoid eat late.",
          "Avoid that you eat late."
        ],
        "why": "⚠️ avoid sempre pede o verbo com -ing."
      },
      {
        "q": "\"Tente reduzir o sal.\"",
        "a": "Try to cut down on salt.",
        "opts": [
          "Try to cut down on salt.",
          "Try cut down on salt.",
          "Try to cut down the salt.",
          "Try to cut on down salt."
        ],
        "why": "try TO + verbo, e a expressão é cut down ON."
      },
      {
        "q": "\"Você faz exercício?\"",
        "a": "Do you exercise?",
        "opts": [
          "Do you exercise?",
          "Do you do exercise?",
          "Do you make exercise?",
          "Do you practice exercise?"
        ],
        "why": "exercise já é verbo. 'do exercise' é tradução literal do português."
      },
      {
        "q": "\"Tenho dificuldade para pegar no sono.\"",
        "a": "I have trouble falling asleep.",
        "opts": [
          "I have trouble falling asleep.",
          "I have trouble to fall asleep.",
          "I have difficult to sleep.",
          "I have trouble for fall asleep."
        ],
        "why": "have trouble + verbo com -ing. E pegar no sono é fall asleep."
      },
      {
        "q": "\"Acordo três vezes por noite.\"",
        "a": "I wake up three times a night.",
        "opts": [
          "I wake up three times a night.",
          "I wake up three times at night.",
          "I wake up three times per the night.",
          "I wake three times a night up."
        ],
        "why": "Frequência usa a night, como a day. E wake up não se separa assim."
      }
    ],
    "speak": [
      "How well do you sleep at night?",
      "Do you exercise during the week?",
      "Try to cut down on salt.",
      "Avoid eating late at night.",
      "I have trouble falling asleep."
    ]
  },
  {
    "id": 812,
    "title": "Medicines & Labels",
    "emoji": "💊",
    "verbs": [
      "To Take",
      "To Prescribe",
      "To Stop",
      "To Skip"
    ],
    "vocab": [
      {
        "en": "medicine",
        "pt": "remédio"
      },
      {
        "en": "box",
        "pt": "caixa"
      },
      {
        "en": "bottle",
        "pt": "frasco"
      },
      {
        "en": "label",
        "pt": "rótulo"
      },
      {
        "en": "name",
        "pt": "nome"
      },
      {
        "en": "to read",
        "pt": "ler"
      },
      {
        "en": "to bring",
        "pt": "trazer"
      },
      {
        "en": "to show",
        "pt": "mostrar"
      },
      {
        "en": "every",
        "pt": "cada"
      },
      {
        "en": "with",
        "pt": "com"
      },
      {
        "en": "without",
        "pt": "sem"
      },
      {
        "en": "empty",
        "pt": "vazio"
      },
      {
        "en": "full",
        "pt": "cheio"
      },
      {
        "en": "to finish",
        "pt": "terminar"
      },
      {
        "en": "left",
        "pt": "restante"
      },
      {
        "en": "prescription",
        "pt": "receita"
      },
      {
        "en": "over-the-counter",
        "pt": "sem receita"
      },
      {
        "en": "painkiller",
        "pt": "analgésico"
      },
      {
        "en": "side effect",
        "pt": "efeito colateral"
      },
      {
        "en": "dose",
        "pt": "dose"
      },
      {
        "en": "to skip a dose",
        "pt": "pular uma dose"
      },
      {
        "en": "on an empty stomach",
        "pt": "em jejum"
      },
      {
        "en": "ointment",
        "pt": "pomada"
      },
      {
        "en": "eye drops",
        "pt": "colírio"
      },
      {
        "en": "inhaler",
        "pt": "bombinha"
      },
      {
        "en": "patch",
        "pt": "adesivo"
      },
      {
        "en": "syrup",
        "pt": "xarope"
      },
      {
        "en": "to run out of",
        "pt": "acabar (o remédio)"
      },
      {
        "en": "drowsy",
        "pt": "sonolento"
      },
      {
        "en": "upset stomach",
        "pt": "estômago embrulhado"
      }
    ],
    "expressions": [
      {
        "expr": "What medicines do you take?",
        "meaning": "Que remédios você toma?",
        "example": "What medicines do you take every day?"
      },
      {
        "expr": "It may make you drowsy.",
        "meaning": "Pode dar sono. — o aviso de efeito colateral",
        "example": "It may make you drowsy, so don't drive."
      },
      {
        "expr": "Take it on an empty stomach.",
        "meaning": "Tome em jejum.",
        "example": "Take it on an empty stomach, one hour before breakfast."
      },
      {
        "expr": "Don't stop it on your own.",
        "meaning": "Não pare por conta própria.",
        "example": "If you feel better, don't stop it on your own — call me first."
      }
    ],
    "sentences": [
      "What medicines do you take?",
      "Can you bring the box next time?",
      "It may make you drowsy.",
      "Take it on an empty stomach.",
      "Don't stop it on your own.",
      "Any side effects so far?",
      "I ran out of my pills last week.",
      "Finish the whole prescription."
    ],
    "grammar": {
      "title": "may, can e o aviso que não assusta",
      "rules": [
        "may indica possibilidade real mas não certa: it MAY make you drowsy (pode dar sono).",
        "can indica o que é possível em geral: this can cause an upset stomach.",
        "⚠️ Depois de may e can vem o verbo puro, sem to: it may CAUSE, nunca 'may to cause'.",
        "Para negar uma ação do paciente use Don't + verbo: Don't stop it, Don't skip a dose."
      ],
      "table": {
        "headers": [
          "Intenção",
          "Inglês",
          "Força"
        ],
        "rows": [
          [
            "pode acontecer",
            "It may make you drowsy.",
            "possível"
          ],
          [
            "costuma acontecer",
            "It often causes nausea.",
            "frequente"
          ],
          [
            "é possível em geral",
            "It can cause an upset stomach.",
            "capacidade"
          ],
          [
            "não faça",
            "Don't skip a dose.",
            "instrução firme"
          ],
          [
            "evite",
            "Try not to take it late.",
            "sugestão"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Pode dar sono.\"",
        "a": "It may make you drowsy.",
        "opts": [
          "It may make you drowsy.",
          "It may to make you drowsy.",
          "It may makes you drowsy.",
          "It can to give you sleep."
        ],
        "why": "Depois de may vem o verbo puro. E o adjetivo é drowsy."
      },
      {
        "q": "\"Tome em jejum.\"",
        "a": "Take it on an empty stomach.",
        "opts": [
          "Take it on an empty stomach.",
          "Take it in empty stomach.",
          "Take it with empty stomach.",
          "Take it on a empty stomach."
        ],
        "why": "Expressão fixa: ON AN empty stomach — com an, porque empty começa com som de vogal."
      },
      {
        "q": "\"Não pare por conta própria.\"",
        "a": "Don't stop it on your own.",
        "opts": [
          "Don't stop it on your own.",
          "Don't stop it for your own.",
          "No stop it by you.",
          "Don't stop it in your own."
        ],
        "why": "on your own = por conta própria. E a negativa do imperativo é Don't + verbo."
      },
      {
        "q": "\"Meu remédio acabou.\"",
        "a": "I ran out of my medicine.",
        "opts": [
          "I ran out of my medicine.",
          "My medicine finished.",
          "I run out my medicine.",
          "My medicine is over."
        ],
        "why": "run out of = acabar o estoque de algo. No passado é ran."
      },
      {
        "q": "\"Teve algum efeito colateral?\"",
        "a": "Any side effects so far?",
        "opts": [
          "Any side effects so far?",
          "Any collateral effects until now?",
          "Have any secondary effect?",
          "Any side effect so far?"
        ],
        "why": "side effect é o termo real (collateral effect é decalque do português), e no plural na pergunta."
      }
    ],
    "speak": [
      "What medicines do you take?",
      "It may make you drowsy.",
      "Take it on an empty stomach.",
      "Don't stop it on your own.",
      "Any side effects so far?"
    ]
  },
  {
    "id": 813,
    "title": "The Exam Room",
    "emoji": "🩺",
    "verbs": [
      "To Lie Down",
      "To Sit Up",
      "To Open",
      "To Relax"
    ],
    "vocab": [
      {
        "en": "please",
        "pt": "por favor"
      },
      {
        "en": "here",
        "pt": "aqui"
      },
      {
        "en": "now",
        "pt": "agora"
      },
      {
        "en": "slowly",
        "pt": "devagar"
      },
      {
        "en": "again",
        "pt": "de novo"
      },
      {
        "en": "ready",
        "pt": "pronto"
      },
      {
        "en": "almost",
        "pt": "quase"
      },
      {
        "en": "done",
        "pt": "terminado"
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
        "en": "to hold",
        "pt": "segurar"
      },
      {
        "en": "to turn",
        "pt": "virar"
      },
      {
        "en": "to look at",
        "pt": "olhar para"
      },
      {
        "en": "to relax",
        "pt": "relaxar"
      },
      {
        "en": "all right",
        "pt": "tudo bem"
      },
      {
        "en": "to lie down",
        "pt": "deitar"
      },
      {
        "en": "to sit up",
        "pt": "sentar-se"
      },
      {
        "en": "to roll up",
        "pt": "arregaçar (a manga)"
      },
      {
        "en": "sleeve",
        "pt": "manga"
      },
      {
        "en": "gown",
        "pt": "avental do paciente"
      },
      {
        "en": "couch",
        "pt": "maca de exame"
      },
      {
        "en": "stethoscope",
        "pt": "estetoscópio"
      },
      {
        "en": "cuff",
        "pt": "manguito"
      },
      {
        "en": "glove",
        "pt": "luva"
      },
      {
        "en": "to press",
        "pt": "apertar"
      },
      {
        "en": "to tap",
        "pt": "percutir"
      },
      {
        "en": "tender",
        "pt": "doloroso ao toque"
      },
      {
        "en": "to examine",
        "pt": "examinar"
      },
      {
        "en": "to check",
        "pt": "verificar"
      },
      {
        "en": "it won't hurt",
        "pt": "não vai doer"
      }
    ],
    "expressions": [
      {
        "expr": "I'm going to examine you now.",
        "meaning": "Vou examinar você agora. — avise ANTES de encostar",
        "example": "I'm going to examine you now. Is that all right?"
      },
      {
        "expr": "Please lie down on the couch.",
        "meaning": "Por favor, deite-se na maca.",
        "example": "Please lie down on the couch and relax."
      },
      {
        "expr": "Tell me if it hurts.",
        "meaning": "Me avise se doer.",
        "example": "I'm going to press here. Tell me if it hurts."
      },
      {
        "expr": "This won't hurt.",
        "meaning": "Isto não vai doer.",
        "example": "Just a small pinch. This won't hurt much."
      }
    ],
    "sentences": [
      "I'm going to examine you now.",
      "Please lie down on the couch.",
      "Roll up your sleeve, please.",
      "Take a deep breath and hold it.",
      "I'm going to press here.",
      "Tell me if it hurts.",
      "Now sit up slowly, please.",
      "All done. You can get dressed."
    ],
    "grammar": {
      "title": "Comandar com gentileza no exame físico",
      "rules": [
        "O exame é uma sequência de imperativos. Com please e um aviso antes, deixa de soar ríspido.",
        "Avise o que vem antes de fazer: I'm going to press here, then tell me if it hurts.",
        "⚠️ lie down é deitar-se (lie, lay, lain). lay down é deitar OUTRA coisa. Trocar os dois é o erro clássico.",
        "Verbos de corpo em inglês pedem possessivo: roll up YOUR sleeve, open YOUR mouth."
      ],
      "table": {
        "headers": [
          "Comando",
          "Inglês",
          "Aviso que vem antes"
        ],
        "rows": [
          [
            "deite-se",
            "Please lie down.",
            "I'm going to examine you."
          ],
          [
            "sente-se",
            "Sit up, please.",
            "Now, slowly…"
          ],
          [
            "abra a boca",
            "Open your mouth.",
            "I'm going to look at your throat."
          ],
          [
            "respire fundo",
            "Take a deep breath.",
            "I'm listening to your lungs."
          ],
          [
            "arregace a manga",
            "Roll up your sleeve.",
            "I'll check your blood pressure."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Por favor, deite-se.\"",
        "a": "Please lie down.",
        "opts": [
          "Please lie down.",
          "Please lay down.",
          "Please lie down you.",
          "Please lied down."
        ],
        "why": "lie down = a pessoa se deita. lay down seria deitar outra coisa."
      },
      {
        "q": "\"Vou examinar você agora.\"",
        "a": "I'm going to examine you now.",
        "opts": [
          "I'm going to examine you now.",
          "I go to examine you now.",
          "I'm going examine you now.",
          "I will examining you now."
        ],
        "why": "going TO + verbo puro, para o que você já decidiu fazer."
      },
      {
        "q": "\"Arregace a manga, por favor.\"",
        "a": "Roll up your sleeve, please.",
        "opts": [
          "Roll up your sleeve, please.",
          "Roll up the sleeve, please.",
          "Roll your sleeve up it, please.",
          "Turn up your sleeve, please."
        ],
        "why": "Parte da roupa do paciente leva possessivo: YOUR sleeve."
      },
      {
        "q": "\"Me avise se doer.\"",
        "a": "Tell me if it hurts.",
        "opts": [
          "Tell me if it hurts.",
          "Tell me if it hurt.",
          "Advise me if it hurts.",
          "Tell to me if it hurts."
        ],
        "why": "it → hurts com -s. E tell não leva to antes do me."
      },
      {
        "q": "\"Pronto. Pode se vestir.\"",
        "a": "All done. You can get dressed.",
        "opts": [
          "All done. You can get dressed.",
          "All done. You can dress you.",
          "All finish. You can get dress.",
          "All done. You can wear."
        ],
        "why": "get dressed é a expressão para vestir-se. wear é usar uma peça específica."
      }
    ],
    "speak": [
      "I'm going to examine you now.",
      "Please lie down on the couch.",
      "Roll up your sleeve, please.",
      "Tell me if it hurts.",
      "All done. You can get dressed."
    ]
  },
  {
    "id": 814,
    "title": "Tests & Results",
    "emoji": "🧪",
    "verbs": [
      "To Order",
      "To Run",
      "To Show",
      "To Wait For"
    ],
    "vocab": [
      {
        "en": "result",
        "pt": "resultado"
      },
      {
        "en": "normal",
        "pt": "normal"
      },
      {
        "en": "high",
        "pt": "alto"
      },
      {
        "en": "low",
        "pt": "baixo"
      },
      {
        "en": "good news",
        "pt": "boa notícia"
      },
      {
        "en": "number",
        "pt": "número"
      },
      {
        "en": "to show",
        "pt": "mostrar"
      },
      {
        "en": "to mean",
        "pt": "significar"
      },
      {
        "en": "to explain",
        "pt": "explicar"
      },
      {
        "en": "to wait for",
        "pt": "esperar por"
      },
      {
        "en": "ready",
        "pt": "pronto"
      },
      {
        "en": "a few days",
        "pt": "alguns dias"
      },
      {
        "en": "nothing",
        "pt": "nada"
      },
      {
        "en": "something",
        "pt": "algo"
      },
      {
        "en": "clear",
        "pt": "claro / limpo"
      },
      {
        "en": "blood test",
        "pt": "exame de sangue"
      },
      {
        "en": "urine sample",
        "pt": "amostra de urina"
      },
      {
        "en": "swab",
        "pt": "cotonete / coleta"
      },
      {
        "en": "X-ray",
        "pt": "raio-x"
      },
      {
        "en": "scan",
        "pt": "tomografia / exame de imagem"
      },
      {
        "en": "ultrasound",
        "pt": "ultrassom"
      },
      {
        "en": "to order a test",
        "pt": "solicitar um exame"
      },
      {
        "en": "to run a test",
        "pt": "realizar um exame"
      },
      {
        "en": "sample",
        "pt": "amostra"
      },
      {
        "en": "reading",
        "pt": "medição"
      },
      {
        "en": "within range",
        "pt": "dentro da faixa"
      },
      {
        "en": "slightly raised",
        "pt": "levemente elevado"
      },
      {
        "en": "borderline",
        "pt": "limítrofe"
      },
      {
        "en": "follow-up test",
        "pt": "exame de controle"
      },
      {
        "en": "nothing to worry about",
        "pt": "nada preocupante"
      }
    ],
    "expressions": [
      {
        "expr": "I'd like to order a blood test.",
        "meaning": "Eu gostaria de solicitar um exame de sangue.",
        "example": "I'd like to order a blood test and an X-ray."
      },
      {
        "expr": "Your results are normal.",
        "meaning": "Seus resultados estão normais.",
        "example": "Good news — your results are normal."
      },
      {
        "expr": "It's slightly raised.",
        "meaning": "Está levemente elevado. — suaviza sem esconder",
        "example": "Your sugar is slightly raised, but nothing to worry about yet."
      },
      {
        "expr": "Let me explain what this means.",
        "meaning": "Deixe-me explicar o que isso significa.",
        "example": "Let me explain what this number means for you."
      }
    ],
    "sentences": [
      "I'd like to order a blood test.",
      "We need a urine sample.",
      "Your results are normal.",
      "This number is slightly raised.",
      "It's within the normal range.",
      "The X-ray was clear.",
      "The results take a few days.",
      "Let me explain what this means."
    ],
    "grammar": {
      "title": "Dar resultado sem assustar",
      "rules": [
        "I'd like to (I would like to) é o pedido profissional padrão: mais suave que I want.",
        "Para número fora do normal, slightly raised / a little low soam factuais sem alarmar.",
        "⚠️ Em inglês exame é test; exam quase sempre é prova de escola. Diga blood test, não 'blood exam'.",
        "to order a test é solicitar; to run a test é realizar. Quem pede é o médico, quem roda é o laboratório."
      ],
      "table": {
        "headers": [
          "Resultado",
          "Inglês",
          "Como soa"
        ],
        "rows": [
          [
            "normal",
            "Your results are normal.",
            "tranquilizador"
          ],
          [
            "dentro da faixa",
            "It's within the normal range.",
            "técnico e neutro"
          ],
          [
            "um pouco alto",
            "It's slightly raised.",
            "factual, sem alarme"
          ],
          [
            "limítrofe",
            "It's borderline.",
            "merece controle"
          ],
          [
            "precisa repetir",
            "We'll need a follow-up test.",
            "próximo passo claro"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu gostaria de solicitar um exame de sangue.\"",
        "a": "I'd like to order a blood test.",
        "opts": [
          "I'd like to order a blood test.",
          "I'd like to order a blood exam.",
          "I like to order a blood test.",
          "I'd like order a blood test."
        ],
        "why": "⚠️ Exame médico é test. exam é prova de escola. E I'd like TO + verbo."
      },
      {
        "q": "\"Seus resultados estão normais.\"",
        "a": "Your results are normal.",
        "opts": [
          "Your results are normal.",
          "Your results is normal.",
          "Your result are normals.",
          "Your results are in the normal."
        ],
        "why": "results é plural → are. E adjetivo não tem plural em inglês."
      },
      {
        "q": "\"Está levemente elevado.\"",
        "a": "It's slightly raised.",
        "opts": [
          "It's slightly raised.",
          "It's lightly raised.",
          "It's slight raised.",
          "It's a little raise."
        ],
        "why": "slightly é o advérbio. lightly é 'de leve', outra coisa."
      },
      {
        "q": "\"Precisamos de uma amostra de urina.\"",
        "a": "We need a urine sample.",
        "opts": [
          "We need a urine sample.",
          "We need an urine sample.",
          "We need a sample of the urine.",
          "We need urine sample."
        ],
        "why": "urine começa com som de consoante (\"you-rin\"), então é A urine sample."
      },
      {
        "q": "\"O raio-x estava limpo.\"",
        "a": "The X-ray was clear.",
        "opts": [
          "The X-ray was clear.",
          "The X-ray was clean.",
          "The X-ray were clear.",
          "The X-ray was clearly."
        ],
        "why": "Para exame de imagem sem alteração usa-se clear. clean seria limpo de sujeira."
      }
    ],
    "speak": [
      "I'd like to order a blood test.",
      "Your results are normal.",
      "It's within the normal range.",
      "This number is slightly raised.",
      "Let me explain what this means."
    ]
  },
  {
    "id": 815,
    "title": "Please, Sorry, Thank You",
    "emoji": "🙏",
    "verbs": [
      "To Understand",
      "To Repeat",
      "To Mind",
      "To Worry"
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
        "en": "excuse me",
        "pt": "com licença"
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
        "en": "slowly",
        "pt": "devagar"
      },
      {
        "en": "word",
        "pt": "palavra"
      },
      {
        "en": "take your time",
        "pt": "sem pressa"
      },
      {
        "en": "don't worry",
        "pt": "não se preocupe"
      },
      {
        "en": "I'm sorry to hear that",
        "pt": "sinto muito por isso"
      },
      {
        "en": "that must be hard",
        "pt": "deve ser difícil"
      },
      {
        "en": "I understand",
        "pt": "eu compreendo"
      },
      {
        "en": "is that all right?",
        "pt": "tudo bem assim?"
      },
      {
        "en": "do you mind if…?",
        "pt": "você se importa se…?"
      },
      {
        "en": "privacy",
        "pt": "privacidade"
      },
      {
        "en": "in confidence",
        "pt": "em sigilo"
      },
      {
        "en": "to reassure",
        "pt": "tranquilizar"
      },
      {
        "en": "any questions?",
        "pt": "alguma dúvida?"
      },
      {
        "en": "does that make sense?",
        "pt": "ficou claro?"
      },
      {
        "en": "interpreter",
        "pt": "intérprete"
      },
      {
        "en": "to go over",
        "pt": "revisar / repassar"
      },
      {
        "en": "one more thing",
        "pt": "mais uma coisa"
      }
    ],
    "expressions": [
      {
        "expr": "Sorry, I don't understand.",
        "meaning": "Desculpa, não entendi. — a frase mais honesta do seu inglês",
        "example": "Sorry, I don't understand. Could you say that again?"
      },
      {
        "expr": "Take your time.",
        "meaning": "Sem pressa. — dá espaço ao paciente nervoso",
        "example": "Take your time. Tell me when you're ready."
      },
      {
        "expr": "Does that make sense?",
        "meaning": "Ficou claro? — melhor que 'do you understand?', que soa como teste",
        "example": "You'll take it twice a day. Does that make sense?"
      },
      {
        "expr": "Do you mind if I examine you?",
        "meaning": "Você se importa se eu examinar? — ⚠️ a resposta 'no' quer dizer SIM, pode",
        "example": "Do you mind if I examine your arm? — No, go ahead."
      }
    ],
    "sentences": [
      "Sorry, I don't understand.",
      "Could you say that again, please?",
      "Take your time.",
      "Don't worry, this is normal.",
      "I'm sorry to hear that.",
      "Does that make sense so far?",
      "Do you have any questions?",
      "Everything you tell me is in confidence."
    ],
    "grammar": {
      "title": "Could you…? e a armadilha do Do you mind?",
      "rules": [
        "Could you…? é mais educado que Can you…? — e em consulta você quase sempre quer o mais educado.",
        "⚠️ Do you mind if…? significa 'você se incomoda se…?'. Responder NO é dar permissão.",
        "Prefira Does that make sense? a Do you understand? — o segundo soa como se você duvidasse do paciente.",
        "Depois de Could you vem o verbo puro: could you REPEAT, nunca 'could you to repeat'."
      ],
      "table": {
        "headers": [
          "Você quer",
          "Educado",
          "Mais educado ainda"
        ],
        "rows": [
          [
            "que repita",
            "Can you repeat?",
            "Could you say that again?"
          ],
          [
            "examinar",
            "Can I examine you?",
            "Do you mind if I examine you?"
          ],
          [
            "que espere",
            "Please wait.",
            "Would you mind waiting?"
          ],
          [
            "confirmar",
            "Do you understand?",
            "Does that make sense?"
          ],
          [
            "que fale devagar",
            "Speak slowly.",
            "Could you speak a bit slower?"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Você não entendeu o paciente. O que diz?",
        "a": "Sorry, I don't understand.",
        "opts": [
          "Sorry, I don't understand.",
          "Sorry, I don't understood.",
          "Sorry, I no understand.",
          "Sorry, I'm not understand."
        ],
        "why": "A negativa do present simple é don't + verbo puro."
      },
      {
        "q": "Alguém pergunta \"Do you mind if I sit here?\" e você não se importa. Responda:",
        "a": "No, go ahead.",
        "opts": [
          "No, go ahead.",
          "Yes, go ahead.",
          "Yes, of course you can.",
          "No, you can't."
        ],
        "why": "⚠️ mind = incomodar. Dizer NO é dizer que não incomoda — ou seja, pode."
      },
      {
        "q": "Jeito mais educado de pedir que repita:",
        "a": "Could you say that again, please?",
        "opts": [
          "Could you say that again, please?",
          "Repeat, please.",
          "Can you repeat it?",
          "Say again."
        ],
        "why": "Could you… é o registro mais educado, e say that again soa mais natural que repeat."
      },
      {
        "q": "\"Ficou claro?\" — sem soar como teste",
        "a": "Does that make sense?",
        "opts": [
          "Does that make sense?",
          "Do you understand me?",
          "Is that clear for you?",
          "Did you get it all?"
        ],
        "why": "make sense põe a responsabilidade na explicação, não na capacidade do paciente."
      },
      {
        "q": "\"Sem pressa.\"",
        "a": "Take your time.",
        "opts": [
          "Take your time.",
          "Take your hour.",
          "No have hurry.",
          "Take the time you."
        ],
        "why": "Take your time é a expressão pronta para dar tempo a alguém."
      }
    ],
    "speak": [
      "Sorry, I don't understand.",
      "Could you say that again, please?",
      "Take your time.",
      "Does that make sense so far?",
      "Do you have any questions?"
    ]
  },
  {
    "id": 816,
    "title": "Emergency Words",
    "emoji": "🚑",
    "verbs": [
      "To Call",
      "To Move",
      "To Push",
      "To Stay"
    ],
    "vocab": [
      {
        "en": "help",
        "pt": "ajuda"
      },
      {
        "en": "quick",
        "pt": "rápido"
      },
      {
        "en": "now",
        "pt": "agora"
      },
      {
        "en": "stop",
        "pt": "pare"
      },
      {
        "en": "wait",
        "pt": "espere"
      },
      {
        "en": "careful",
        "pt": "cuidado"
      },
      {
        "en": "everyone",
        "pt": "todos"
      },
      {
        "en": "nobody",
        "pt": "ninguém"
      },
      {
        "en": "to call",
        "pt": "chamar"
      },
      {
        "en": "to bring",
        "pt": "trazer"
      },
      {
        "en": "to move",
        "pt": "mover"
      },
      {
        "en": "to stay",
        "pt": "ficar"
      },
      {
        "en": "right away",
        "pt": "imediatamente"
      },
      {
        "en": "out of the way",
        "pt": "fora do caminho"
      },
      {
        "en": "loud",
        "pt": "alto"
      },
      {
        "en": "unconscious",
        "pt": "inconsciente"
      },
      {
        "en": "not breathing",
        "pt": "sem respirar"
      },
      {
        "en": "no pulse",
        "pt": "sem pulso"
      },
      {
        "en": "bleeding",
        "pt": "sangrando"
      },
      {
        "en": "choking",
        "pt": "engasgando"
      },
      {
        "en": "seizure",
        "pt": "convulsão"
      },
      {
        "en": "chest pain",
        "pt": "dor no peito"
      },
      {
        "en": "stretcher",
        "pt": "maca"
      },
      {
        "en": "oxygen",
        "pt": "oxigênio"
      },
      {
        "en": "IV line",
        "pt": "acesso venoso"
      },
      {
        "en": "airway",
        "pt": "via aérea"
      },
      {
        "en": "vital signs",
        "pt": "sinais vitais"
      },
      {
        "en": "to resuscitate",
        "pt": "reanimar"
      },
      {
        "en": "crash cart",
        "pt": "carrinho de emergência"
      },
      {
        "en": "to stabilize",
        "pt": "estabilizar"
      }
    ],
    "expressions": [
      {
        "expr": "Call for help!",
        "meaning": "Chame ajuda! — a primeira frase de qualquer emergência",
        "example": "Call for help and bring the crash cart!"
      },
      {
        "expr": "He's not breathing.",
        "meaning": "Ele não está respirando.",
        "example": "He's unconscious and he's not breathing."
      },
      {
        "expr": "Stay with me.",
        "meaning": "Fique comigo. — para manter o paciente consciente",
        "example": "Stay with me, sir. Open your eyes."
      },
      {
        "expr": "Can you hear me?",
        "meaning": "Você consegue me ouvir? — o primeiro teste de consciência",
        "example": "Sir, can you hear me? Squeeze my hand."
      }
    ],
    "sentences": [
      "Call for help right away!",
      "He's unconscious and not breathing.",
      "Can you hear me? Squeeze my hand.",
      "She has chest pain and no pulse.",
      "Bring the oxygen, quick!",
      "Stay with me, sir.",
      "Everyone, out of the way!",
      "We need a stretcher here."
    ],
    "grammar": {
      "title": "Frases curtas salvam vidas",
      "rules": [
        "Na emergência o inglês fica curto: verbo primeiro, sem rodeio. Call for help! Bring oxygen!",
        "Educação sai de cena — aqui não se usa please nem could you. Isso é esperado e não é grosseria.",
        "⚠️ Use o presente contínuo para o que está acontecendo agora: he's bleeding, she's not breathing.",
        "Confirme o que ouviu repetindo em voz alta. Numa emergência, repetir a ordem recebida é protocolo, não redundância."
      ],
      "table": {
        "headers": [
          "Situação",
          "Inglês",
          "Não diga"
        ],
        "rows": [
          [
            "chamar ajuda",
            "Call for help!",
            "Could you call for help?"
          ],
          [
            "sem respirar",
            "He's not breathing.",
            "He doesn't breathe."
          ],
          [
            "sangrando",
            "She's bleeding.",
            "She bleeds."
          ],
          [
            "afaste-se",
            "Out of the way!",
            "Please move aside."
          ],
          [
            "consciência",
            "Can you hear me?",
            "Are you listening me?"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Ele não está respirando.\"",
        "a": "He's not breathing.",
        "opts": [
          "He's not breathing.",
          "He doesn't breathe.",
          "He's not breath.",
          "He not breathing."
        ],
        "why": "O que acontece AGORA pede o presente contínuo: is + verbo -ing."
      },
      {
        "q": "\"Chame ajuda!\"",
        "a": "Call for help!",
        "opts": [
          "Call for help!",
          "Call the help!",
          "Call for the helping!",
          "Make a call of help!"
        ],
        "why": "call for help é a expressão fixa. Na emergência, direto, sem please."
      },
      {
        "q": "\"Você consegue me ouvir?\"",
        "a": "Can you hear me?",
        "opts": [
          "Can you hear me?",
          "Are you listening me?",
          "Can you listen me?",
          "Do you hear me now?"
        ],
        "why": "hear é ouvir (involuntário); listen é escutar com atenção e pede to."
      },
      {
        "q": "\"Ela está sangrando.\"",
        "a": "She's bleeding.",
        "opts": [
          "She's bleeding.",
          "She bleeds.",
          "She's blooding.",
          "She is bleed."
        ],
        "why": "Agora, neste instante → presente contínuo. O verbo é bleed → bleeding."
      },
      {
        "q": "\"Precisamos de uma maca aqui.\"",
        "a": "We need a stretcher here.",
        "opts": [
          "We need a stretcher here.",
          "We need a stretch here.",
          "We need one stretcher here.",
          "We need the stretcher of here."
        ],
        "why": "stretcher é maca. E need + a + substantivo, sem o one."
      }
    ],
    "speak": [
      "Call for help right away!",
      "He's unconscious and not breathing.",
      "Can you hear me? Squeeze my hand.",
      "Bring the oxygen, quick!",
      "Stay with me, sir."
    ]
  }
];

window.LESSONS_MED = LESSONS_MED;
