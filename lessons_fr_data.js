// Capy Yara Adventures — French Daily-Trail Lessons (12 Units · IDs 201–212)
// Renovado em Português (BR) -> Francês (fr-FR), alinhado com fr_aula_01..12.html.
const LESSONS_FR = [
  {
    "id": 201,
    "title": "Les Salutations",
    "emoji": "👋",
    "lang": "fr",
    "verbs": [
      "Saluer",
      "S'appeler",
      "Parler",
      "Venir",
      "Remercier"
    ],
    "vocab": [
      {
        "en": "Bonjour",
        "pt": "Olá / Bom dia [bon-JUR]"
      },
      {
        "en": "Bonsoir",
        "pt": "Boa tarde (fim do dia) / Boa noite [bon-SUAR]"
      },
      {
        "en": "Bonne nuit",
        "pt": "Boa noite (ao dormir) [bôn NUÍ]"
      },
      {
        "en": "Salut",
        "pt": "Oi / Tchau (informal) [sa-LÜ]"
      },
      {
        "en": "Au revoir",
        "pt": "Tchau / Até logo [ô rã-VUAR]"
      },
      {
        "en": "À bientôt",
        "pt": "Até breve [a biãn-TÔ]"
      },
      {
        "en": "À demain",
        "pt": "Até amanhã [a dã-MÃ]"
      },
      {
        "en": "Merci",
        "pt": "Obrigado(a) [mer-SI]"
      },
      {
        "en": "De rien",
        "pt": "De nada [dã RIÃ]"
      },
      {
        "en": "S'il vous plaît",
        "pt": "Por favor (formal) [sil vu PLÉ]"
      },
      {
        "en": "S'il te plaît",
        "pt": "Por favor (informal) [sil tã PLÉ]"
      },
      {
        "en": "Excusez-moi",
        "pt": "Com licença / Desculpe [eks-kü-zê MUÁ]"
      },
      {
        "en": "Pardon",
        "pt": "Perdão / Com licença [par-DÔN]"
      },
      {
        "en": "Oui",
        "pt": "Sim [UÍ]"
      },
      {
        "en": "Non",
        "pt": "Não [NÔN]"
      },
      {
        "en": "Enchanté(e)",
        "pt": "Muito prazer [ãn-chãn-TÊ]"
      },
      {
        "en": "Monsieur",
        "pt": "Senhor [mã-SIÊ]"
      },
      {
        "en": "Madame",
        "pt": "Senhora [ma-DAM]"
      }
    ],
    "expressions": [
      {
        "expr": "Comment vous appelez-vous ?",
        "meaning": "Como o(a) senhor(a) se chama? (formal)",
        "example": "— Bonjour ! Comment vous appelez-vous ? — Je m'appelle Yara, enchantée !"
      },
      {
        "expr": "Comment allez-vous ? / Ça va ?",
        "meaning": "Como vai o(a) senhor(a)? / Tudo bem?",
        "example": "— Salut Léo, ça va ? — Oui, ça va très bien, merci !"
      },
      {
        "expr": "Je viens du Brésil / Je suis brésilien(ne).",
        "meaning": "Eu venho do Brasil / Eu sou brasileiro(a).",
        "example": "Je m'appelle Lucas, je viens du Brésil et j'habite à Curitiba."
      },
      {
        "expr": "Parlez-vous portugais / anglais ?",
        "meaning": "Você fala português / inglês?",
        "example": "Excusez-moi Madame, je suis débutant. Parlez-vous portugais ?"
      },
      {
        "expr": "Bonne journée ! / Bonne soirée !",
        "meaning": "Tenha um bom dia! / Tenha uma boa noite!",
        "example": "Merci pour le café ! Au revoir et bonne journée !"
      },
      {
        "expr": "Je vous en prie.",
        "meaning": "Por nada / Disponha (formal)",
        "example": "— Merci beaucoup pour votre aide ! — Je vous en prie, Madame."
      }
    ],
    "sentences": [
      "Bonjour ! Je m'appelle Yara. Enchantée !",
      "Comment allez-vous aujourd'hui ?",
      "Très bien, merci beaucoup ! Et vous ?",
      "Je viens du Brésil et je parle un peu français.",
      "Un café et un croissant, s'il vous plaît.",
      "Excusez-moi Monsieur, parlez-vous portugais ?",
      "Salut ! Ça va ? — Oui, ça va très bien !",
      "Merci, au revoir et bonne journée !",
      "Bonjour ! Excusez-moi, cette place est libre ?",
      "Bonjour ! Oui, bien sûr. Je m'appelle Léo, et vous ?"
    ],
    "grammar": {
      "title": "Tu vs. Vous — Quando usar cada um?",
      "rules": [
        "<b>Tu vs. Vous — Quando usar cada um?:</b> Com desconhecidos, em lojas ou no trabalho: \"Bonjour Monsieur, comment allez-vous ?\" (Na França, \"Bonjour\" + \"Vous\" é a chave que abre todas as portas. Na dúvida, escolha sempre \"vous\"!)",
        "<b>Bonjour vs. Bonne journée (Chegada vs. Despedida):</b> Ao entrar na padaria: \"Bonjour Madame !\" (Pense assim: Bonjour / Bonsoir = chegada. Bonne journée / Bonne soirée = despedida desejando um bom resto de dia/noite.)",
        "<b>Segredos da Pronúncia Francesa para Brasileiros:</b> \"OU\" tem som de \"U\" brasileiro: Bonjour = [bon-JUR], vous = [VU], oui = [UÍ]. (O \"U\" sozinho em francês (como em \"tu\" e \"salut\") é o famoso biquinho com som de \"I\" [ü]!)"
      ],
      "table": {
        "headers": [
          "Situação",
          "Pronome",
          "Exemplo em Francês"
        ],
        "rows": [
          [
            "Amigo / Família",
            "Tu",
            "Salut ! Comment tu t'appelles ?"
          ],
          [
            "Desconhecido / Formal",
            "Vous",
            "Bonjour ! Comment vous appelez-vous ?"
          ],
          [
            "Ao chegar (dia / noite)",
            "—",
            "Bonjour ! / Bonsoir !"
          ],
          [
            "Ao sair (dia / noite)",
            "—",
            "Bonne journée ! / Bonne soirée !"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como você cumprimenta alguém pela manhã ou durante o dia em francês?",
        "a": "Bonjour",
        "opts": [
          "Bonjour",
          "Bonsoir",
          "Bonne nuit",
          "Au revoir"
        ],
        "why": "\"Bonjour\" é a saudação universal durante todo o dia (até o fim da tarde)."
      },
      {
        "q": "Qual expressão você usa ao SAIR de uma loja durante o dia para desejar \"Tenha um bom dia\"?",
        "a": "Bonne journée !",
        "opts": [
          "Bonne journée !",
          "Bonjour !",
          "Bonne nuit !",
          "Salut !"
        ],
        "why": "\"Bonjour\" é ao chegar; \"Bonne journée\" é ao se despedir durante o dia."
      },
      {
        "q": "Você conheceu uma pessoa em um ambiente formal. Como pergunta o nome dela?",
        "a": "Comment vous appelez-vous ?",
        "opts": [
          "Comment vous appelez-vous ?",
          "Comment tu t'appelles ?",
          "Ça va bien ?",
          "Où habitez-vous ?"
        ],
        "why": "Com desconhecidos ou em contextos formais, usamos sempre \"vous\": Comment vous appelez-vous ?"
      },
      {
        "q": "Como se diz \"Eu venho do Brasil\" corretamente em francês?",
        "a": "Je viens du Brésil.",
        "opts": [
          "Je viens du Brésil.",
          "Je suis de Brésil.",
          "Je parle Brésil.",
          "Je vais Brésil."
        ],
        "why": "O Brasil é masculino em francês (le Brésil), então \"do Brasil\" contrai para \"du Brésil\": Je viens du Brésil."
      },
      {
        "q": "O que significa \"Enchanté(e)\"?",
        "a": "Muito prazer",
        "opts": [
          "Muito prazer",
          "Com licença",
          "Até amanhã",
          "Por favor"
        ],
        "why": "\"Enchanté(e)\" equivale a \"Muito prazer / Encantado(a)\" ao conhecer alguém."
      },
      {
        "q": "Como pedir algo educadamente a um garçom (\"por favor\")?",
        "a": "S'il vous plaît",
        "opts": [
          "S'il vous plaît",
          "De rien",
          "Enchanté",
          "À bientôt"
        ],
        "why": "\"S'il vous plaît\" [sil vu PLÉ] é a forma educada (\"vous\") de dizer \"por favor\"."
      },
      {
        "q": "Se alguém lhe diz \"Merci beaucoup !\", qual é uma resposta adequada?",
        "a": "De rien !",
        "opts": [
          "De rien !",
          "S'il vous plaît !",
          "Excusez-moi !",
          "Bonjour !"
        ],
        "why": "\"De rien\" (De nada) ou \"Je vous en prie\" (Disponha) são as respostas para \"Merci\"."
      },
      {
        "q": "Quando devemos usar \"Bonne nuit\" em francês?",
        "a": "Apenas na hora de ir dormir",
        "opts": [
          "Apenas na hora de ir dormir",
          "Ao chegar em um jantar às 20h",
          "Ao atender o telefone à noite",
          "Logo após o almoço"
        ],
        "why": "Ao chegar à noite usamos \"Bonsoir\". \"Bonne nuit\" é exclusivo para quando alguém vai para a cama dormir!"
      },
      {
        "q": "Como se pronuncia a combinação \"OU\" em palavras como \"Bonjour\" e \"vous\"?",
        "a": "Como o \"U\" do português (jur, vu)",
        "opts": [
          "Como o \"U\" do português (jur, vu)",
          "Como \"ÔU\" aberto",
          "Como \"ÓI\"",
          "É sempre muda"
        ],
        "why": "Em francês, \"OU\" tem o som exato do nosso \"U\" em português ([u])."
      },
      {
        "q": "Complete: \"Bonjour ! Je ___ Yara, je suis brésilienne.\"",
        "a": "m'appelle",
        "opts": [
          "m'appelle",
          "t'appelles",
          "vous appelez",
          "parlez"
        ],
        "why": "\"Je m'appelle...\" significa \"Eu me chamo...\"."
      }
    ],
    "speak": [
      "Bonjour ! Je m'appelle Yara. Enchantée !",
      "Comment allez-vous aujourd'hui ?",
      "Très bien, merci beaucoup ! Et vous ?",
      "Je viens du Brésil et je parle un peu français.",
      "Un café et un croissant, s'il vous plaît.",
      "Excusez-moi Monsieur, parlez-vous portugais ?",
      "Salut ! Ça va ? — Oui, ça va très bien !",
      "Merci, au revoir et bonne journée !"
    ]
  },
  {
    "id": 202,
    "title": "Les Chiffres",
    "emoji": "🔢",
    "lang": "fr",
    "verbs": [
      "Compter",
      "Avoir",
      "Coûter",
      "Payer",
      "Additionner"
    ],
    "vocab": [
      {
        "en": "Un / Une",
        "pt": "Um / Uma (1) [Ã / ÜN]"
      },
      {
        "en": "Deux",
        "pt": "Dois (2) [DØ]"
      },
      {
        "en": "Trois",
        "pt": "Três (3) [TRUÁ]"
      },
      {
        "en": "Quatre",
        "pt": "Quatro (4) [KÁTR]"
      },
      {
        "en": "Cinq",
        "pt": "Cinco (5) [SÃK]"
      },
      {
        "en": "Six",
        "pt": "Seis (6) [SIS]"
      },
      {
        "en": "Sept",
        "pt": "Sete (7) [SÉT]"
      },
      {
        "en": "Huit",
        "pt": "Oito (8) [UÍT]"
      },
      {
        "en": "Neuf",
        "pt": "Nove (9) [NŒF]"
      },
      {
        "en": "Dix",
        "pt": "Dez (10) [DIS]"
      },
      {
        "en": "Onze",
        "pt": "Onze (11) [ÔNZ]"
      },
      {
        "en": "Douze",
        "pt": "Doze (12) [DUZ]"
      },
      {
        "en": "Treize",
        "pt": "Treze (13) [TRÉZ]"
      },
      {
        "en": "Quatorze",
        "pt": "Quatorze (14) [ka-TÓRZ]"
      },
      {
        "en": "Quinze",
        "pt": "Quinze (15) [KÃZ]"
      },
      {
        "en": "Seize",
        "pt": "Dezesseis (16) [SÉZ]"
      },
      {
        "en": "Dix-sept / Dix-huit",
        "pt": "Dezessete (17) / Dezoito (18) [di-SÉT / di-ZUÍT]"
      },
      {
        "en": "Dix-neuf / Vingt",
        "pt": "Dezenove (19) / Vinte (20) [diz-NŒF / VÃ]"
      }
    ],
    "expressions": [
      {
        "expr": "Quel âge avez-vous ? / Quel âge as-tu ?",
        "meaning": "Quantos anos você tem? (formal / informal)",
        "example": "— Quel âge as-tu ? — J'ai dix-neuf ans."
      },
      {
        "expr": "Combien ça coûte ? / C'est combien ?",
        "meaning": "Quanto custa isso? / Quanto é?",
        "example": "— Excusez-moi, ce croissant, c'est combien ? — C'est deux euros."
      },
      {
        "expr": "Quel est votre numéro de téléphone ?",
        "meaning": "Qual é o seu número de telefone?",
        "example": "Mon numéro commence par zéro six, douze, vingt."
      },
      {
        "expr": "Une table pour deux / quatre personnes.",
        "meaning": "Uma mesa para duas / quatro pessoas.",
        "example": "Bonsoir ! Une table pour quatre personnes, s'il vous plaît."
      },
      {
        "expr": "Ça fait dix euros.",
        "meaning": "Dá dez euros (no total).",
        "example": "Deux cafés et deux croissants : ça fait huit euros, s'il vous plaît."
      },
      {
        "expr": "Plus / Moins / Égale",
        "meaning": "Mais / Menos / Igual a",
        "example": "Douze plus huit égale vingt !"
      }
    ],
    "sentences": [
      "Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.",
      "Onze, douze, treize, quatorze, quinze, seize.",
      "Dix-sept, dix-huit, dix-neuf, vingt.",
      "Quel âge avez-vous ? — J'ai vingt ans.",
      "Excusez-moi, combien ça coûte ? — Ça fait huit euros.",
      "Une table pour quatre personnes, s'il vous plaît.",
      "Je voudrais deux cafés et trois croissants.",
      "Cinq plus quinze égale vingt !",
      "Bonjour Madame ! Trois croissants et deux cafés, s'il vous plaît.",
      "Bonjour ! Alors, trois croissants et deux cafés... Ça fait neuf euros, s'il vous plaît."
    ],
    "grammar": {
      "title": "De 11 a 16 vs. 17 a 19 (Simples vs. Compostos)",
      "rules": [
        "<b>De 11 a 16 vs. 17 a 19 (Simples vs. Compostos):</b> 11 a 16 têm nomes próprios terminados em \"-ze\": onze, douze, treize, quatorze, quinze, seize. (No número 7 (sept [SÉT]), o \"p\" nunca é pronunciado, mas o \"t\" final soa forte!)",
        "<b>A Pronúncia de Six (6), Huit (8), Neuf (9) e Dix (10):</b> Sozinhos: six [SIS], dix [DIS]. Antes de consoante, o som final cai: six livres [si LIVR], dix cafés [di ka-FÊ]. (Essa costura sonora entre palavras chama-se \"liaison\" e é o que deixa seu francês com ritmo nativo!)",
        "<b>Dizer a Idade: Sempre com AVOIR + ANS:</b> J'ai vingt ans. / Elle a quinze ans. (Diferente do português onde podemos dizer \"Tenho 20\", em francês nunca omitimos \"ans\": J'ai vingt ans!)"
      ],
      "table": {
        "headers": [
          "Número",
          "Francês & Pronúncia",
          "Exemplo Prático"
        ],
        "rows": [
          [
            "1 a 5",
            "un, deux, trois, quatre, cinq",
            "Deux cafés, ça fait cinq euros."
          ],
          [
            "6 a 10",
            "six, sept [sét], huit, neuf, dix",
            "Le cours commence à huit heures."
          ],
          [
            "11 a 16",
            "onze, douze, treize, quatorze, quinze, seize",
            "Elle a seize ans."
          ],
          [
            "17 a 20",
            "dix-sept, dix-huit, dix-neuf, vingt [vã]",
            "J'ai vingt ans."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como se escreve o número 15 em francês?",
        "a": "quinze",
        "opts": [
          "quinze",
          "quatorze",
          "seize",
          "cinq"
        ],
        "why": "14 = quatorze, 15 = quinze [KÃZ], 16 = seize [SÉZ]."
      },
      {
        "q": "Qual é o resultado de \"douze + huit\" em francês?",
        "a": "vingt",
        "opts": [
          "vingt",
          "dix-huit",
          "dix-neuf",
          "seize"
        ],
        "why": "12 (douze) + 8 (huit) = 20 (vingt [VÃ])."
      },
      {
        "q": "Como você diz \"Eu tenho 18 anos\" em francês?",
        "a": "J'ai dix-huit ans.",
        "opts": [
          "J'ai dix-huit ans.",
          "Je suis dix-huit ans.",
          "J'ai dix-huit.",
          "Je viens dix-huit ans."
        ],
        "why": "Em francês usamos o verbo avoir (\"J'ai\") e nunca omitimos a palavra \"ans\"."
      },
      {
        "q": "Na palavra \"sept\" (7), qual letra é muda e qual é pronunciada?",
        "a": "O \"p\" é mudo e o \"t\" é pronunciado [SÉT]",
        "opts": [
          "O \"p\" é mudo e o \"t\" é pronunciado [SÉT]",
          "O \"t\" é mudo e o \"p\" é pronunciado [SÉP]",
          "Ambos são mudos [SÉ]",
          "Ambos são pronunciados [SÉPT]"
        ],
        "why": "\"Sept\" pronuncia-se [SÉT] — o P desaparece na fala!"
      },
      {
        "q": "Como se pergunta \"Quanto custa isso?\" em francês?",
        "a": "Combien ça coûte ?",
        "opts": [
          "Combien ça coûte ?",
          "Quel âge avez-vous ?",
          "Comment allez-vous ?",
          "Où est la caisse ?"
        ],
        "why": "\"Combien ça coûte ?\" ou \"C'est combien ?\" são as formas de perguntar o preço."
      },
      {
        "q": "Como soa a ligação (liaison) em \"dix euros\"?",
        "a": "[di-ZØ-RÔ] (com som de Z)",
        "opts": [
          "[di-ZØ-RÔ] (com som de Z)",
          "[dis Ø-RÔ] (com som de S)",
          "[di-KØ-RÔ]",
          "[dix] mudo"
        ],
        "why": "Antes de vogal, o X final de \"deux\", \"six\" e \"dix\" ganha som de Z!"
      },
      {
        "q": "Qual número vem imediatamente depois de \"seize\" (16)?",
        "a": "dix-sept",
        "opts": [
          "dix-sept",
          "quinze",
          "dix-huit",
          "quatorze"
        ],
        "why": "Depois de seize (16) começam os números compostos com dix: dix-sept (17), dix-huit (18), dix-neuf (19)."
      },
      {
        "q": "O que significa a frase do garçom \"Ça fait douze euros\"?",
        "a": "Dá doze euros (no total).",
        "opts": [
          "Dá doze euros (no total).",
          "Faltam doze minutos.",
          "São doze horas.",
          "Há doze mesas."
        ],
        "why": "\"Ça fait + valor\" é a expressão usada no comércio para informar o total da conta."
      },
      {
        "q": "Como se pergunta a idade de alguém de forma educada (formal)?",
        "a": "Quel âge avez-vous ?",
        "opts": [
          "Quel âge avez-vous ?",
          "Quel âge as-tu ?",
          "Combien ans avez-vous ?",
          "Qui êtes-vous ?"
        ],
        "why": "Com \"vous\", usamos \"Quel âge avez-vous ?\"."
      },
      {
        "q": "Qual destes números significa 14?",
        "a": "quatorze",
        "opts": [
          "quatorze",
          "quatre",
          "quarante",
          "quinze"
        ],
        "why": "4 = quatre, 14 = quatorze."
      }
    ],
    "speak": [
      "Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.",
      "Onze, douze, treize, quatorze, quinze, seize.",
      "Dix-sept, dix-huit, dix-neuf, vingt.",
      "Quel âge avez-vous ? — J'ai vingt ans.",
      "Excusez-moi, combien ça coûte ? — Ça fait huit euros.",
      "Une table pour quatre personnes, s'il vous plaît.",
      "Je voudrais deux cafés et trois croissants.",
      "Cinq plus quinze égale vingt !"
    ]
  },
  {
    "id": 203,
    "title": "Les Couleurs",
    "emoji": "🎨",
    "lang": "fr",
    "verbs": [
      "Aimer",
      "Préférer",
      "Voir",
      "Choisir",
      "Décrire"
    ],
    "vocab": [
      {
        "en": "Rouge",
        "pt": "Vermelho(a) [RUJ]"
      },
      {
        "en": "Bleu / Bleue",
        "pt": "Azul [BLØ]"
      },
      {
        "en": "Vert / Verte",
        "pt": "Verde [VÉR / VÉRT] [VÉR / VÉRT]"
      },
      {
        "en": "Jaune",
        "pt": "Amarelo(a) [JÔN]"
      },
      {
        "en": "Blanc / Blanche",
        "pt": "Branco / Branca [BLÃ / BLÃCH]"
      },
      {
        "en": "Noir / Noire",
        "pt": "Preto / Preta [NUAR]"
      },
      {
        "en": "Gris / Grise",
        "pt": "Cinza [GRI / GRIZ]"
      },
      {
        "en": "Rose",
        "pt": "Rosa [RÔZ]"
      },
      {
        "en": "Orange",
        "pt": "Laranja (invariável!) [ô-RÃJ]"
      },
      {
        "en": "Violet / Violette",
        "pt": "Roxo / Violeta [viô-LÉ / viô-LÉT]"
      },
      {
        "en": "Marron",
        "pt": "Marrom (invariável!) [ma-RÔN]"
      },
      {
        "en": "Grand / Grande",
        "pt": "Grande / Alto(a) [GRÃ / GRÃD]"
      },
      {
        "en": "Petit / Petite",
        "pt": "Pequeno(a) / Baixo(a) [pã-TI / pã-TÍT]"
      },
      {
        "en": "Beau / Belle",
        "pt": "Bonito / Bonita [BÔ / BÉL]"
      },
      {
        "en": "Joli / Jolie",
        "pt": "Bonitinho(a) / Lindo(a) [jô-LI]"
      },
      {
        "en": "Clair",
        "pt": "Claro (tom de cor) [KLÉR]"
      },
      {
        "en": "Foncé",
        "pt": "Escuro (tom de cor) [fôn-SÊ]"
      },
      {
        "en": "La couleur",
        "pt": "A cor [la ku-LŒR]"
      }
    ],
    "expressions": [
      {
        "expr": "Quelle est ta / votre couleur préférée ?",
        "meaning": "Qual é a sua cor favorita?",
        "example": "— Quelle est ta couleur préférée ? — Ma couleur préférée est le vert !"
      },
      {
        "expr": "De quelle couleur est... ?",
        "meaning": "De que cor é...?",
        "example": "— De quelle couleur est ta voiture ? — Elle est gris foncé."
      },
      {
        "expr": "Voir la vie en rose",
        "meaning": "Ver o lado bom da vida (expressão idiomática)",
        "example": "En vacances à Paris, je vois la vie en rose !"
      },
      {
        "expr": "Bleu, blanc, rouge",
        "meaning": "Azul, branco e vermelho (a bandeira francesa)",
        "example": "Le drapeau français est bleu, blanc, rouge."
      },
      {
        "expr": "Bleu clair / Vert foncé",
        "meaning": "Azul-claro / Verde-escuro",
        "example": "J'ai acheté une chemise bleu clair."
      },
      {
        "expr": "C'est magnifique !",
        "meaning": "É magnífico / É lindo demais!",
        "example": "Regarde ce jardin vert et jaune, c'est magnifique !"
      }
    ],
    "sentences": [
      "Quelle est votre couleur préférée ?",
      "J'aime beaucoup le bleu clair et le vert.",
      "Le drapeau français est bleu, blanc, rouge.",
      "Elle porte une belle robe blanche.",
      "J'ai un petit chat noir et gris.",
      "De quelle couleur est ta voiture ? — Elle est rouge.",
      "J'adore ces chaussures marron et ce sac orange.",
      "À Paris, je vois la vie en rose !",
      "Regarde Camille, ces écharpes sont très jolies ! Quelle est ta couleur préférée ?",
      "J'aime beaucoup le vert et le bleu clair. Et toi, Yara ?"
    ],
    "grammar": {
      "title": "Feminino das Cores (Quando muda o som e quando não muda)",
      "rules": [
        "<b>Feminino das Cores (Quando muda o som e quando não muda):</b> Ganham -E no feminino (e a consoante passa a soar!): vert [VÉR] → verte [VÉRT]; gris [GRI] → grise [GRIZ]. (No masculino \"vert\" [vér] o T é mudo; no feminino \"verte\" [vért] o E faz o T ganhar voz!)",
        "<b>As Duas Cores Rebeldes: Orange e Marron (Invariáveis!):</b> Une robe orange / Des robes orange (sem -s!). (Por que são invariáveis? Porque vêm de frutas (a laranja e a castanha marron)! Em francês, cores que têm nome de fruta ou pedra nunca variam.)",
        "<b>Posição dos Adjetivos: Cores DEPOIS, Tamanho/Beleza ANTES:</b> Cores vão DEPOIS do substantivo: un chat noir, une voiture bleue. (Você pode combinar os dois: \"Une belle robe rouge\" (Um lindo vestido vermelho — belle antes, rouge depois!).)"
      ],
      "table": {
        "headers": [
          "Masculino",
          "Feminino",
          "Exemplo"
        ],
        "rows": [
          [
            "vert [vér]",
            "verte [vért]",
            "un pull vert / une robe verte"
          ],
          [
            "blanc [blã]",
            "blanche [blãch]",
            "un vin blanc / une maison blanche"
          ],
          [
            "rouge / jaune / rose",
            "rouge / jaune / rose",
            "un sac rouge / une fleur rouge"
          ],
          [
            "orange / marron",
            "orange / marron (invariáveis!)",
            "des chaussures marron"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Qual é a forma feminina correta da cor \"blanc\" (branco)?",
        "a": "blanche",
        "opts": [
          "blanche",
          "blance",
          "blanca",
          "blanc"
        ],
        "why": "O feminino de \"blanc\" [BLÃ] é \"blanche\" [BLÃCH]: une maison blanche."
      },
      {
        "q": "Quais são as duas cores que NUNCA mudam no feminino nem ganham \"-s\" no plural?",
        "a": "orange e marron",
        "opts": [
          "orange e marron",
          "bleu e vert",
          "noir e blanc",
          "gris e violet"
        ],
        "why": "\"Orange\" e \"marron\" vêm de frutas/castanhas e são 100% invariáveis: des sacs orange, des chaussures marron."
      },
      {
        "q": "Como se diz \"um gato preto\" em francês?",
        "a": "un chat noir",
        "opts": [
          "un chat noir",
          "un noir chat",
          "un chat noire",
          "une chat noir"
        ],
        "why": "As cores ficam DEPOIS do substantivo, igual ao português: un chat noir."
      },
      {
        "q": "Como fica \"uma camisa verde\" em francês (sabendo que \"chemise\" é feminino)?",
        "a": "une chemise verte",
        "opts": [
          "une chemise verte",
          "une chemise vert",
          "une verte chemise",
          "un chemise vert"
        ],
        "why": "Como \"la chemise\" é feminina, \"vert\" recebe \"-e\": une chemise verte [VÉRT]."
      },
      {
        "q": "Qual destas cores JÁ termina com \"-e\" no masculino e por isso não muda no feminino?",
        "a": "rouge",
        "opts": [
          "rouge",
          "vert",
          "gris",
          "noir"
        ],
        "why": "Rouge, jaune e rose já terminam em -e e servem para masculino e feminino sem alteração."
      },
      {
        "q": "Qual é a tradução de \"une petite maison blanche\"?",
        "a": "uma casinha branca (uma pequena casa branca)",
        "opts": [
          "uma casinha branca (uma pequena casa branca)",
          "uma casa grande e azul",
          "um apartamento branco",
          "uma porta amarela"
        ],
        "why": "\"Petite\" (pequena) vem antes do substantivo e \"blanche\" (branca) vem depois."
      },
      {
        "q": "Como dizemos \"azul-claro\" e \"verde-escuro\" em francês?",
        "a": "bleu clair / vert foncé",
        "opts": [
          "bleu clair / vert foncé",
          "bleu foncé / vert clair",
          "clair bleu / foncé vert",
          "bleu blanc / vert noir"
        ],
        "why": "Clair = claro; foncé = escuro."
      },
      {
        "q": "Quais são as três cores da bandeira da França?",
        "a": "Bleu, blanc, rouge",
        "opts": [
          "Bleu, blanc, rouge",
          "Vert, jaune, bleu",
          "Noir, rouge, jaune",
          "Vert, blanc, rouge"
        ],
        "why": "A bandeira francesa (le drapeau tricolore) é azul, branca e vermelha: bleu, blanc, rouge."
      },
      {
        "q": "O que significa a expressão francesa \"voir la vie en rose\"?",
        "a": "Ver a vida com otimismo / ver o lado bom da vida",
        "opts": [
          "Ver a vida com otimismo / ver o lado bom da vida",
          "Usar apenas roupas cor-de-rosa",
          "Estar com sono",
          "Pintar a casa de rosa"
        ],
        "why": "\"Voir la vie en rose\" significa enxergar a vida de forma positiva e feliz."
      },
      {
        "q": "Complete: \"J'ai acheté des chaussures ___.\" (marrons)",
        "a": "marron",
        "opts": [
          "marron",
          "marrons",
          "marrones",
          "marronnes"
        ],
        "why": "\"Marron\" é invariável — nunca recebe \"-s\" no plural!"
      }
    ],
    "speak": [
      "Quelle est votre couleur préférée ?",
      "J'aime beaucoup le bleu clair et le vert.",
      "Le drapeau français est bleu, blanc, rouge.",
      "Elle porte une belle robe blanche.",
      "J'ai un petit chat noir et gris.",
      "De quelle couleur est ta voiture ? — Elle est rouge.",
      "J'adore ces chaussures marron et ce sac orange.",
      "À Paris, je vois la vie en rose !"
    ]
  },
  {
    "id": 204,
    "title": "La Famille",
    "emoji": "👨‍👩‍👧‍👦",
    "lang": "fr",
    "verbs": [
      "Habiter",
      "Présenter",
      "Travailler",
      "Aimer",
      "Appeler"
    ],
    "vocab": [
      {
        "en": "La mère / Maman",
        "pt": "A mãe / Mamãe [la MÉR / ma-MÃ]"
      },
      {
        "en": "Le père / Papa",
        "pt": "O pai / Papai [lã PÉR / pa-PÁ]"
      },
      {
        "en": "Les parents",
        "pt": "Os pais (pai e mãe) / Parentes [lê pa-RÃ]"
      },
      {
        "en": "Le frère",
        "pt": "O irmão [lã FRÉR]"
      },
      {
        "en": "La sœur",
        "pt": "A irmã [la SŒR]"
      },
      {
        "en": "Le fils",
        "pt": "O filho (pronuncia-se o S!) [lã FIS]"
      },
      {
        "en": "La fille",
        "pt": "A filha / A menina [la FÍI]"
      },
      {
        "en": "Les enfants",
        "pt": "Os filhos / As crianças [lê zãn-FÃ]"
      },
      {
        "en": "Le mari / La femme",
        "pt": "O marido / A esposa (ou mulher) [lã ma-RI / la FAM]"
      },
      {
        "en": "Le grand-père",
        "pt": "O avô [lã grãn-PÉR]"
      },
      {
        "en": "La grand-mère",
        "pt": "A avó [la grãn-MÉR]"
      },
      {
        "en": "Les grands-parents",
        "pt": "Os avós [lê grãn-pa-RÃ]"
      },
      {
        "en": "L'oncle",
        "pt": "O tio [LÔNKL]"
      },
      {
        "en": "La tante",
        "pt": "A tia [la TÃT]"
      },
      {
        "en": "Le cousin / La cousine",
        "pt": "O primo / A prima [lã ku-ZÃ / la ku-ZÍN]"
      },
      {
        "en": "L'ami / L'amie",
        "pt": "O amigo / A amiga [la-MI]"
      },
      {
        "en": "Le chien / Le chat",
        "pt": "O cachorro / O gato [lã CHIÃ / lã CHÁ]"
      },
      {
        "en": "Fils / Fille unique",
        "pt": "Filho(a) único(a) [fis / fíi ü-NÍK]"
      }
    ],
    "expressions": [
      {
        "expr": "Je vous présente... / Voici...",
        "meaning": "Eu lhe apresento... / Aqui está...",
        "example": "Voici mon père, ma mère et ma petite sœur !"
      },
      {
        "expr": "As-tu des frères et sœurs ?",
        "meaning": "Você tem irmãos e irmãs?",
        "example": "— As-tu des frères et sœurs ? — Oui, j'ai un frère et deux sœurs."
      },
      {
        "expr": "Je suis fils unique / fille unique.",
        "meaning": "Eu sou filho único / filha única.",
        "example": "Non, je n'ai pas de frères, je suis fille unique."
      },
      {
        "expr": "Toute la famille",
        "meaning": "Toda a família",
        "example": "Dimanche, je déjeune avec toute la famille."
      },
      {
        "expr": "Mon grand frère / Ma petite sœur",
        "meaning": "Meu irmão mais velho / Minha irmã mais nova",
        "example": "Mon grand frère a vingt ans et ma petite sœur a douze ans."
      },
      {
        "expr": "Nous sommes très proches.",
        "meaning": "Nós somos muito próximos / unidos.",
        "example": "Ma cousine et moi, nous sommes très proches."
      }
    ],
    "sentences": [
      "Voici ma famille : mon père, ma mère et ma petite sœur.",
      "As-tu des frères et sœurs ?",
      "J'ai un grand frère et deux cousins.",
      "Mes grands-parents habitent au Brésil.",
      "Mon amie Camille habite à Paris avec son mari.",
      "Je suis fille unique, mais j'ai beaucoup de cousins.",
      "Son fils a dix ans et sa fille a huit ans.",
      "Ma famille et moi, nous sommes très proches.",
      "Oh, quelle belle photo sur ton téléphone, Yara ! C'est ta famille ?",
      "Oui ! Voici mes parents : mon père s'appelle Carlos et ma mère s'appelle Helena."
    ],
    "grammar": {
      "title": "Os Possessivos: Mon / Ma / Mes (Meu, Minha, Meus/Minhas)",
      "rules": [
        "<b>Os Possessivos: Mon / Ma / Mes (Meu, Minha, Meus/Minhas):</b> Masculino singular: mon père, mon frère, mon livre (meu) · ton (teu) · son (dele/dela). (No plural não há diferença entre masculino e feminino: \"mes frères\" e \"mes sœurs\" usam MES [mê]!)",
        "<b>A Regra de Ouro antes de Vogal: \"Mon amie\" (e NÃO \"Ma amie\"!):</b> Mon amie Camille (Minha amiga Camille — amie começa com A!). (Se a palavra feminina tiver um adjetivo consoante no meio, o \"ma\" volta: \"Ma bonne amie\" (Minha boa amiga)!)",
        "<b>Pronúncias Especiais da Família: Femme, Fils e Fille:</b> La femme (a esposa/mulher) pronuncia-se [la FAM] (com som de A, mesmo escrita com E!). (Guarde este trio sonoro: femme = [FAM], fils = [FIS], fille = [FÍI]!)"
      ],
      "table": {
        "headers": [
          "Dono",
          "Masculino Sing.",
          "Feminino Sing.",
          "Plural (Masc./Fem.)"
        ],
        "rows": [
          [
            "Je (meu/minha)",
            "mon père / mon amie*",
            "ma mère / ma sœur",
            "mes parents / mes sœurs"
          ],
          [
            "Tu (teu/tua)",
            "ton frère / ton amie*",
            "ta tante / ta cousine",
            "tes frères / tes amies"
          ],
          [
            "Il / Elle (dele/dela)",
            "son fils / son amie*",
            "sa fille / sa femme",
            "ses enfants / ses cousins"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Qual adjetivo possessivo completa corretamente: \"___ mère\" (minha mãe) e \"___ père\" (meu pai)?",
        "a": "Ma mère / Mon père",
        "opts": [
          "Ma mère / Mon père",
          "Mon mère / Ma père",
          "Mes mère / Mes père",
          "Sa mère / Ton père"
        ],
        "why": "\"Mon\" é usado para masculino singular (mon père) e \"Ma\" para feminino singular (ma mère)."
      },
      {
        "q": "Como se diz \"minha amiga\" em francês (sabendo que \"amie\" começa com vogal)?",
        "a": "mon amie",
        "opts": [
          "mon amie",
          "ma amie",
          "mes amie",
          "m'amie"
        ],
        "why": "Antes de palavra feminina iniciada por vogal ou H mudo, trocamos \"ma/ta/sa\" por \"mon/ton/son\" para soar fluido: mon amie!"
      },
      {
        "q": "Qual possessivo usamos no plural para dizer \"meus pais\" e \"minhas irmãs\"?",
        "a": "mes parents / mes sœurs",
        "opts": [
          "mes parents / mes sœurs",
          "mons parents / mas sœurs",
          "mon parents / ma sœurs",
          "les parents / la sœurs"
        ],
        "why": "No plural, \"mes\" [MÊ] serve tanto para o masculino quanto para o feminino!"
      },
      {
        "q": "Como se pronuncia a palavra \"femme\" (esposa / mulher) em francês?",
        "a": "[FAM] (com som de A)",
        "opts": [
          "[FAM] (com som de A)",
          "[FÊM] (com som de Ê)",
          "[FÍM] (com som de I)",
          "[FÔM] (com som de Ô)"
        ],
        "why": "Apesar de escrita com E, \"femme\" pronuncia-se [FAM]!"
      },
      {
        "q": "Como você pergunta \"Você tem irmãos e irmãs?\" em francês?",
        "a": "As-tu des frères et sœurs ?",
        "opts": [
          "As-tu des frères et sœurs ?",
          "As-tu des pères et mères ?",
          "Où sont tes frères ?",
          "Qui est ton frère ?"
        ],
        "why": "Em francês pergunta-se sempre o par completo: \"As-tu des frères et sœurs ?\"."
      },
      {
        "q": "O que significa \"mon grand frère\" em uma conversa sobre família?",
        "a": "Meu irmão mais velho",
        "opts": [
          "Meu irmão mais velho",
          "Meu avô",
          "Meu tio alto",
          "Meu primo distante"
        ],
        "why": "Com irmãos, \"grand frère / grande sœur\" significa irmão/irmã mais velho(a), e \"petit frère / petite sœur\" significa mais novo(a)."
      },
      {
        "q": "Qual é o significado de \"mes grands-parents\"?",
        "a": "Meus avós",
        "opts": [
          "Meus avós",
          "Meus pais altos",
          "Meus tios",
          "Meus primos"
        ],
        "why": "Le grand-père (o avô) + la grand-mère (a avó) = les grands-parents (os avós)."
      },
      {
        "q": "Como se diz \"Eu sou filha única\" em francês?",
        "a": "Je suis fille unique.",
        "opts": [
          "Je suis fille unique.",
          "Je suis seule fille.",
          "J'ai une fille.",
          "Je viens fille unique."
        ],
        "why": "Filho único = fils unique; filha única = fille unique."
      },
      {
        "q": "Complete: \"Mon oncle et ___ tante habitent à Lyon.\" (minha tia)",
        "a": "ma",
        "opts": [
          "ma",
          "mon",
          "mes",
          "ta"
        ],
        "why": "\"La tante\" é feminino e começa com consoante, portanto usa \"ma\": ma tante."
      },
      {
        "q": "O que significa a palavra \"Voici...\" ao mostrar uma foto?",
        "a": "Aqui está / Aqui estão...",
        "opts": [
          "Aqui está / Aqui estão...",
          "Onde está...",
          "Eu gosto de...",
          "Até logo..."
        ],
        "why": "\"Voici\" [vua-SI] serve para apresentar pessoas ou apontar coisas (\"Voici ma famille !\")."
      }
    ],
    "speak": [
      "Voici ma famille : mon père, ma mère et ma petite sœur.",
      "As-tu des frères et sœurs ?",
      "J'ai un grand frère et deux cousins.",
      "Mes grands-parents habitent au Brésil.",
      "Mon amie Camille habite à Paris avec son mari.",
      "Je suis fille unique, mais j'ai beaucoup de cousins.",
      "Son fils a dix ans et sa fille a huit ans.",
      "Ma famille et moi, nous sommes très proches."
    ]
  },
  {
    "id": 205,
    "title": "Être & Avoir",
    "emoji": "✨",
    "lang": "fr",
    "verbs": [
      "Être",
      "Avoir",
      "Aller",
      "Sentir",
      "Vouloir"
    ],
    "vocab": [
      {
        "en": "Je suis",
        "pt": "Eu sou / Eu estou [jã SUÍ]"
      },
      {
        "en": "Tu es",
        "pt": "Você é / está (informal) [tü É]"
      },
      {
        "en": "Il est / Elle est",
        "pt": "Ele(a) é / está [i-LÉ / é-LÉ]"
      },
      {
        "en": "Nous sommes",
        "pt": "Nós somos / estamos [nu SÓM]"
      },
      {
        "en": "Vous êtes",
        "pt": "Vocês são/estão · O(a) sr(a) é/está [vu ZÉT]"
      },
      {
        "en": "Ils sont / Elles sont",
        "pt": "Eles(as) são / estão [il SÔN / él SÔN]"
      },
      {
        "en": "J'ai / Tu as / Il a",
        "pt": "Eu tenho / Tu tens / Ele tem [JÊ / tü Á / i-LÁ]"
      },
      {
        "en": "Nous avons / Vous avez / Ils ont",
        "pt": "Nós temos / Vocês têm / Eles têm [nu za-VÔN / vu za-VÊ / il ZÔN]"
      },
      {
        "en": "Avoir faim",
        "pt": "Estar com fome (lit. ter fome) [a-VUAR FÃ]"
      },
      {
        "en": "Avoir soif",
        "pt": "Estar com sede [a-VUAR SUÁF]"
      },
      {
        "en": "Avoir froid / chaud",
        "pt": "Estar com frio / calor [a-VUAR FRUÁ / CHÔ]"
      },
      {
        "en": "Avoir sommeil",
        "pt": "Estar com sono [a-VUAR sô-MÉI]"
      },
      {
        "en": "Avoir peur (de)",
        "pt": "Estar com medo (de) [a-VUAR PŒR]"
      },
      {
        "en": "Avoir raison / tort",
        "pt": "Ter razão / Estar errado(a) [a-VUAR rê-ZÔN / TÓR]"
      },
      {
        "en": "Avoir besoin de",
        "pt": "Precisar de (ter necessidade de) [a-VUAR bã-ZUÃ dã]"
      },
      {
        "en": "Avoir envie de",
        "pt": "Estar com vontade de [a-VUAR ãn-VI dã]"
      },
      {
        "en": "Fatigué(e)",
        "pt": "Cansado(a) (usa ÊTRE!) [fa-ti-GUÊ]"
      },
      {
        "en": "Prêt(e) / Content(e)",
        "pt": "Pronto(a) / Feliz (usam ÊTRE!) [PRÉ / PRÉT · kôn-TÃ / kôn-TÃT]"
      }
    ],
    "expressions": [
      {
        "expr": "J'ai faim / J'ai soif",
        "meaning": "Estou com fome / Estou com sede",
        "example": "Il est midi, j'ai très faim ! On va déjeuner ?"
      },
      {
        "expr": "J'ai froid / J'ai chaud",
        "meaning": "Estou com frio / Estou com calor",
        "example": "Brrr, il neige dehors, j'ai froid !"
      },
      {
        "expr": "J'ai besoin de...",
        "meaning": "Eu preciso de...",
        "example": "Excusez-moi, j'ai besoin d'informations, s'il vous plaît."
      },
      {
        "expr": "J'ai envie de...",
        "meaning": "Estou com vontade de...",
        "example": "Ce soir, j'ai envie de manger une crêpe au chocolat !"
      },
      {
        "expr": "Tu as raison ! / Vous avez raison !",
        "meaning": "Você tem razão!",
        "example": "Oui, tu as raison, c'est beaucoup mieux comme ça."
      },
      {
        "expr": "Être en retard / Être à l'heure",
        "meaning": "Estar atrasado(a) / Estar no horário",
        "example": "Pardon, je suis en retard à cause du métro."
      }
    ],
    "sentences": [
      "Je suis brésilien(ne) et je suis très content(e) d'être ici.",
      "J'ai très faim et j'ai un peu soif.",
      "Tu as froid ? Moi, j'ai chaud !",
      "J'ai besoin d'un café parce que j'ai sommeil.",
      "Vous avez raison, nous sommes à l'heure !",
      "Ce soir, j'ai envie de regarder un film français.",
      "Je suis un peu fatigué(e), mais je suis prêt(e) !",
      "Ils sont français et ils ont deux enfants.",
      "Brrr ! Tu n'as pas froid, Yara ? Il fait très frais aujourd'hui !",
      "Si, j'ai un peu froid et j'ai aussi très faim ! On marche depuis deux heures."
    ],
    "grammar": {
      "title": "Être = Ser E Estar (Um verbo só para os dois!)",
      "rules": [
        "<b>Être = Ser E Estar (Um verbo só para os dois!):</b> Identidade / profissão / nacionalidade: Je suis étudiant(e), elle est médecin. (Atenção à pronúncia de \"Ils sont\" [il SÔN] (eles são — com S puro) vs. \"Ils ont\" [il ZÔN] (eles têm — com som de Z pela liaison!).)",
        "<b>Sensações Físicas usam AVOIR (e não Être!):</b> J'ai faim (fome) · J'ai soif (sede) · J'ai sommeil (sono). (Já \"fatigué(e)\" (cansado), \"malade\" (doente) e \"prêt(e)\" (pronto) são adjetivos, então usam ÊTRE: Je suis fatigué(e)!)",
        "<b>O Pronome \"ON\" — O Segredo do Francês Falado:</b> Formal / escrito: Nous sommes prêts · Nous avons faim. (Dominar o \"on\" (= a gente / nós) faz você entender 90% das conversas reais na França!)"
      ],
      "table": {
        "headers": [
          "Pronome",
          "ÊTRE (Ser / Estar)",
          "AVOIR (Ter / Sensações)"
        ],
        "rows": [
          [
            "je / j'",
            "je suis brésilien(ne)",
            "j'ai faim / j'ai froid"
          ],
          [
            "tu",
            "tu es prêt(e)",
            "tu as soif / tu as raison"
          ],
          [
            "il / elle / on",
            "il/elle/on est à Paris",
            "il/elle/on a besoin d'aide"
          ],
          [
            "nous",
            "nous sommes contents",
            "nous avons vingt ans"
          ],
          [
            "vous",
            "vous êtes en vacances",
            "vous avez chaud"
          ],
          [
            "ils / elles",
            "ils/elles sont ici [il SÔN]",
            "ils/elles ont deux enfants [il ZÔN]"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como você diz \"Estou com muita fome\" em francês?",
        "a": "J'ai très faim.",
        "opts": [
          "J'ai très faim.",
          "Je suis très faim.",
          "J'ai beaucoup faim.",
          "Je fais faim."
        ],
        "why": "Em francês, fome usa o verbo AVOIR: \"J'ai faim\" / \"J'ai très faim\"."
      },
      {
        "q": "Qual é a diferença sonora entre \"Ils sont\" (eles são) e \"Ils ont\" (eles têm)?",
        "a": "\"Ils sont\" tem som de S [il SÔN] e \"Ils ont\" tem som de Z [il ZÔN]",
        "opts": [
          "\"Ils sont\" tem som de S [il SÔN] e \"Ils ont\" tem som de Z [il ZÔN]",
          "Ambos têm som idêntico",
          "\"Ils sont\" tem som de Z e \"Ils ont\" tem som de S",
          "O \"s\" final é pronunciado nos dois"
        ],
        "why": "Em \"Ils ont\", o S de \"ils\" junta-se à vogal de \"ont\" produzindo som de Z [il ZÔN]!"
      },
      {
        "q": "Qual frase está CORRETA para dizer \"Estou cansada, mas estou pronta\"?",
        "a": "Je suis fatiguée, mais je suis prête.",
        "opts": [
          "Je suis fatiguée, mais je suis prête.",
          "J'ai fatiguée, mais j'ai prête.",
          "Je suis fatigue, mais j'ai prête.",
          "J'ai sommeil, mais j'ai prête."
        ],
        "why": "\"Fatigué(e)\" e \"prêt(e)\" são adjetivos, por isso usam o verbo ÊTRE (Je suis)."
      },
      {
        "q": "O que significa a expressão \"J'ai besoin d'un café\"?",
        "a": "Eu preciso de um café.",
        "opts": [
          "Eu preciso de um café.",
          "Eu sou dono de um café.",
          "Eu tenho medo de café.",
          "Eu trabalho em um café."
        ],
        "why": "\"Avoir besoin de...\" significa \"precisar de / ter necessidade de\"."
      },
      {
        "q": "Como você diz \"Estou com frio\" em francês?",
        "a": "J'ai froid.",
        "opts": [
          "J'ai froid.",
          "Je suis froid.",
          "Il est froid.",
          "Je fais froid."
        ],
        "why": "Para sensação térmica pessoal, usamos sempre AVOIR: J'ai froid / J'ai chaud."
      },
      {
        "q": "Qual forma verbal completa corretamente: \"Vous ___ en vacances à Paris ?\" (Vocês estão de férias em Paris?)",
        "a": "êtes",
        "opts": [
          "êtes",
          "avez",
          "sommes",
          "sont"
        ],
        "why": "A conjugação de \"être\" para \"vous\" é \"vous êtes\" [vu ZÉT]."
      },
      {
        "q": "No francês falado do dia a dia, como os franceses costumam dizer \"Nós estamos prontos / A gente está pronto\"?",
        "a": "On est prêts.",
        "opts": [
          "On est prêts.",
          "On sommes prêts.",
          "Nous est prêts.",
          "Ils sommes prêts."
        ],
        "why": "\"On\" equivale a \"a gente / nós\" e conjuga o verbo na 3ª pessoa do singular: on est, on a."
      },
      {
        "q": "O que significa \"Tu as raison !\"?",
        "a": "Você tem razão!",
        "opts": [
          "Você tem razão!",
          "Você está atrasado!",
          "Você está com sede!",
          "Você é francês!"
        ],
        "why": "Avoir raison = ter razão; avoir tort = estar errado."
      },
      {
        "q": "Complete: \"Il est minuit et j'___ sommeil.\" (estou com sono)",
        "a": "ai",
        "opts": [
          "ai",
          "suis",
          "as",
          "est"
        ],
        "why": "Avoir sommeil = estar com sono (\"J'ai sommeil\")."
      },
      {
        "q": "Qual opção completa o par: \"Nous ___ brésiliens et nous ___ beaucoup d'amis en France.\"",
        "a": "sommes / avons",
        "opts": [
          "sommes / avons",
          "avons / sommes",
          "êtes / avez",
          "sont / ont"
        ],
        "why": "Nous sommes (nós somos — être) e nous avons (nós temos — avoir)."
      }
    ],
    "speak": [
      "Je suis brésilien(ne) et je suis très content(e) d'être ici.",
      "J'ai très faim et j'ai un peu soif.",
      "Tu as froid ? Moi, j'ai chaud !",
      "J'ai besoin d'un café parce que j'ai sommeil.",
      "Vous avez raison, nous sommes à l'heure !",
      "Ce soir, j'ai envie de regarder un film français.",
      "Je suis un peu fatigué(e), mais je suis prêt(e) !",
      "Ils sont français et ils ont deux enfants."
    ]
  },
  {
    "id": 206,
    "title": "La Nourriture",
    "emoji": "🥐",
    "lang": "fr",
    "verbs": [
      "Manger",
      "Boire",
      "Prendre",
      "Commander",
      "Aimer"
    ],
    "vocab": [
      {
        "en": "Le pain / La baguette",
        "pt": "O pão / A baguete [lã PÃ / la ba-GUÉT]"
      },
      {
        "en": "Le croissant",
        "pt": "O croissant [lã krua-SÃ]"
      },
      {
        "en": "Le fromage",
        "pt": "O queijo [lã frô-MÁJ]"
      },
      {
        "en": "Le beurre",
        "pt": "A manteiga [lã BŒR]"
      },
      {
        "en": "Le poulet",
        "pt": "O frango [lã pu-LÉ]"
      },
      {
        "en": "Le poisson",
        "pt": "O peixe [lã pua-SÔN]"
      },
      {
        "en": "La viande",
        "pt": "A carne [la VIÃD]"
      },
      {
        "en": "La salade",
        "pt": "A salada [la sa-LÁD]"
      },
      {
        "en": "La soupe",
        "pt": "A sopa [la SUP]"
      },
      {
        "en": "Le riz / Les pâtes",
        "pt": "O arroz / O macarrão [lã RI / lê PÁT]"
      },
      {
        "en": "L'eau (minérale / plate)",
        "pt": "A água (mineral / sem gás) [LÔ]"
      },
      {
        "en": "Le café / Le thé",
        "pt": "O café / O chá [lã ka-FÊ / lã TÊ]"
      },
      {
        "en": "Le lait",
        "pt": "O leite [lã LÉ]"
      },
      {
        "en": "Le jus d'orange",
        "pt": "O suco de laranja [lã jü dô-RÃJ]"
      },
      {
        "en": "Le gâteau / La crêpe",
        "pt": "O bolo / O crepe [lã ga-TÔ / la KRÉP]"
      },
      {
        "en": "Le petit-déjeuner",
        "pt": "O café da manhã [lã pã-ti de-jœ-NÊ]"
      },
      {
        "en": "Le déjeuner / Le dîner",
        "pt": "O almoço / O jantar [lã de-jœ-NÊ / lã di-NÊ]"
      },
      {
        "en": "L'addition",
        "pt": "A conta (no restaurante) [la-di-SIÔN]"
      }
    ],
    "expressions": [
      {
        "expr": "Je voudrais... / Je vais prendre...",
        "meaning": "Eu gostaria de... / Vou pedir...",
        "example": "Bonjour ! Je voudrais le plat du jour, s'il vous plaît."
      },
      {
        "expr": "Une carafe d'eau, s'il vous plaît.",
        "meaning": "Uma jarra de água (gratuita!), por favor.",
        "example": "Pour boire, une carafe d'eau, s'il vous plaît."
      },
      {
        "expr": "L'addition, s'il vous plaît !",
        "meaning": "A conta, por favor!",
        "example": "C'était délicieux ! L'addition, s'il vous plaît."
      },
      {
        "expr": "Bon appétit !",
        "meaning": "Bom apetite!",
        "example": "Voici vos plats. Bon appétit !"
      },
      {
        "expr": "Le plat du jour / La formule",
        "meaning": "O prato do dia / O menu executivo (entrada+prato ou prato+sobremesa)",
        "example": "Quel est le plat du jour aujourd'hui ?"
      },
      {
        "expr": "C'est délicieux !",
        "meaning": "Está delicioso!",
        "example": "Cette soupe à l'oignon, c'est délicieux !"
      }
    ],
    "sentences": [
      "Bonjour ! Je voudrais un café au lait et un croissant, s'il vous plaît.",
      "Au petit-déjeuner, je mange du pain avec du beurre.",
      "Je vais prendre le poulet rôti et de la salade.",
      "Une carafe d'eau, s'il vous plaît.",
      "Je ne mange pas de viande, je préfère le poisson.",
      "J'aime beaucoup le fromage français !",
      "C'est délicieux ! L'addition, s'il vous plaît.",
      "Nous mangeons ensemble au restaurant à midi.",
      "Bonjour Madame ! Voici la carte. Vous avez choisi ?",
      "Bonjour ! Oui, quel est le plat du jour, s'il vous plaît ?"
    ],
    "grammar": {
      "title": "Os Artigos Partitivos: Du, De la, De l', Des",
      "rules": [
        "<b>Os Artigos Partitivos: Du, De la, De l', Des:</b> Masculino singular (du): Je mange du pain, du fromage, du riz. (Com os verbos de gosto (aimer, adorer, préférer), usamos o artigo definido (le, la, l', les): \"J'aime le fromage, alors je mange du fromage !\")",
        "<b>Na Negativa Tudo Vira \"PAS DE / PAS D'\"!:</b> Afirmativa: Je mange de la viande · Je bois du café. (Fórmula infalível da negação: Je ne mange PAS DE + alimento (sem du/la/les)!)",
        "<b>Como Pedir no Restaurante: \"Je prends\" vs. \"Je voudrais\":</b> Para pedir unidades: \"Je voudrais un croissant et un café, s'il vous plaît.\" (Em francês não usamos \"boire\" ou \"manger\" para fazer o pedido ao garçom — usamos \"Je voudrais\" ou \"Je prends\"!)"
      ],
      "table": {
        "headers": [
          "Partitivo",
          "Quando usar",
          "Exemplo no Restaurante"
        ],
        "rows": [
          [
            "du",
            "Masculino singular",
            "Je mange du pain et du fromage."
          ],
          [
            "de la",
            "Feminino singular",
            "Elle mange de la salade et de la soupe."
          ],
          [
            "de l'",
            "Antes de vogal ou H mudo",
            "Je bois de l'eau minérale."
          ],
          [
            "des / pas de",
            "Plural / Forma negativa",
            "Des fruits · Je ne mange pas de viande."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Qual artigo partitivo completa corretamente: \"Je mange ___ pain et ___ fromage.\"?",
        "a": "du / du",
        "opts": [
          "du / du",
          "de la / de la",
          "des / des",
          "le / la"
        ],
        "why": "\"Le pain\" e \"le fromage\" são masculinos, então usamos \"du\" (= de + le)."
      },
      {
        "q": "Como você diz \"Eu bebo água\" em francês?",
        "a": "Je bois de l'eau.",
        "opts": [
          "Je bois de l'eau.",
          "Je bois du eau.",
          "Je bois de la eau.",
          "Je bois eau."
        ],
        "why": "Como \"eau\" começa com vogal, usamos o partitivo \"de l'\": Je bois de l'eau."
      },
      {
        "q": "Como fica a frase \"Je mange de la viande\" na forma NEGATIVA (\"Eu não como carne\")?",
        "a": "Je ne mange pas de viande.",
        "opts": [
          "Je ne mange pas de viande.",
          "Je ne mange pas de la viande.",
          "Je ne mange pas du viande.",
          "Je pas mange viande."
        ],
        "why": "Na negativa (\"ne... pas\"), os partitivos (du, de la, des) viram apenas \"de\": pas de viande!"
      },
      {
        "q": "Qual é o segredo para pedir água gratuita na mesa de qualquer restaurante na França?",
        "a": "Pedir 'une carafe d'eau'",
        "opts": [
          "Pedir 'une carafe d'eau'",
          "Pedir 'une bouteille d'eau'",
          "Pedir 'du vin blanc'",
          "Pedir 'l'addition'"
        ],
        "why": "\"Une carafe d'eau\" é a jarra de água potável servida gratuitamente por lei nos restaurantes franceses."
      },
      {
        "q": "Como você pede a conta ao garçom no final da refeição?",
        "a": "L'addition, s'il vous plaît !",
        "opts": [
          "L'addition, s'il vous plaît !",
          "La recette, s'il vous plaît !",
          "Le menu, s'il vous plaît !",
          "Bon appétit, s'il vous plaît !"
        ],
        "why": "A conta do restaurante chama-se \"l'addition\"."
      },
      {
        "q": "Qual frase é mais educada para fazer um pedido ao garçom?",
        "a": "Je voudrais un croissant, s'il vous plaît.",
        "opts": [
          "Je voudrais un croissant, s'il vous plaît.",
          "Je veux un croissant.",
          "Donne-moi un croissant.",
          "Tu as un croissant."
        ],
        "why": "\"Je voudrais...\" (Eu gostaria de...) ou \"Je vais prendre...\" são as formas educadas de pedir."
      },
      {
        "q": "Qual partitivo completa: \"Au dîner, elle mange ___ salade et ___ soupe.\"?",
        "a": "de la / de la",
        "opts": [
          "de la / de la",
          "du / du",
          "de l' / de l'",
          "des / du"
        ],
        "why": "\"La salade\" e \"la soupe\" são femininas, então usamos \"de la\"."
      },
      {
        "q": "Com verbos de preferência (\"J'aime...\", \"J'adore...\"), qual artigo usamos?",
        "a": "Le, la, l', les (J'aime le chocolat)",
        "opts": [
          "Le, la, l', les (J'aime le chocolat)",
          "Du, de la, des (J'aime du chocolat)",
          "Pas de",
          "Un, une"
        ],
        "why": "Verbos de gosto (aimer, adorer, préférer, détester) usam sempre le/la/les: \"J'aime le café, je bois du café\"."
      },
      {
        "q": "O que significa \"le petit-déjeuner\" em francês?",
        "a": "O café da manhã",
        "opts": [
          "O café da manhã",
          "O almoço pequeno",
          "O lanche da noite",
          "A sobremesa"
        ],
        "why": "Petit-déjeuner = café da manhã; déjeuner = almoço; dîner = jantar."
      },
      {
        "q": "Como se conjuga o verbo \"manger\" com \"nous\" (\"Nós comemos\")?",
        "a": "nous mangeons",
        "opts": [
          "nous mangeons",
          "nous mangons",
          "nous mangez",
          "nous mangent"
        ],
        "why": "Mantemos o \"e\" depois do G em \"nous mangeons\" [nu mãn-JÔN] para preservar o som suave de J!"
      }
    ],
    "speak": [
      "Bonjour ! Je voudrais un café au lait et un croissant, s'il vous plaît.",
      "Au petit-déjeuner, je mange du pain avec du beurre.",
      "Je vais prendre le poulet rôti et de la salade.",
      "Une carafe d'eau, s'il vous plaît.",
      "Je ne mange pas de viande, je préfère le poisson.",
      "J'aime beaucoup le fromage français !",
      "C'est délicieux ! L'addition, s'il vous plaît.",
      "Nous mangeons ensemble au restaurant à midi."
    ]
  },
  {
    "id": 207,
    "title": "Les Jours et les Mois",
    "emoji": "📅",
    "lang": "fr",
    "verbs": [
      "Commencer",
      "Fêter",
      "Travailler",
      "Planifier",
      "Se reposer"
    ],
    "vocab": [
      {
        "en": "Lundi",
        "pt": "Segunda-feira [lãn-DI]"
      },
      {
        "en": "Mardi",
        "pt": "Terça-feira [mar-DI]"
      },
      {
        "en": "Mercredi",
        "pt": "Quarta-feira [mér-krã-DI]"
      },
      {
        "en": "Jeudi",
        "pt": "Quinta-feira [jœ-DI]"
      },
      {
        "en": "Vendredi",
        "pt": "Sexta-feira [vãn-drã-DI]"
      },
      {
        "en": "Samedi",
        "pt": "Sábado [sam-DI]"
      },
      {
        "en": "Dimanche",
        "pt": "Domingo [di-MÃCH]"
      },
      {
        "en": "Janvier / Février",
        "pt": "Janeiro / Fevereiro [jãn-VIÊ / fe-vri-IÊ]"
      },
      {
        "en": "Mars / Avril",
        "pt": "Março / Abril (pronuncia-se o S e o L!) [MÁRS / a-VRIL]"
      },
      {
        "en": "Mai / Juin",
        "pt": "Maio / Junho [MÉ / JUÃ]"
      },
      {
        "en": "Juillet / Août",
        "pt": "Julho / Agosto [jüi-IÉ / ÚT]"
      },
      {
        "en": "Septembre / Octobre",
        "pt": "Setembro / Outubro [sep-TÃBR / ók-TÓBR]"
      },
      {
        "en": "Novembre / Décembre",
        "pt": "Novembro / Dezembro [nô-VÃBR / de-SÃBR]"
      },
      {
        "en": "Aujourd'hui",
        "pt": "Hoje [ô-jur-DUÍ]"
      },
      {
        "en": "Demain / Hier",
        "pt": "Amanhã / Ontem [dã-MÃ / i-ÉR]"
      },
      {
        "en": "La semaine / Le week-end",
        "pt": "A semana / O fim de semana [la sã-MÉN / lã ui-KÉND]"
      },
      {
        "en": "Le mois / L'année",
        "pt": "O mês / O ano [lã MUÁ / la-NÊ]"
      },
      {
        "en": "Le premier (1er)",
        "pt": "Primeiro (dia 1º do mês) [lã prã-MIÊ]"
      }
    ],
    "expressions": [
      {
        "expr": "Quel jour sommes-nous aujourd'hui ?",
        "meaning": "Que dia é hoje?",
        "example": "— Quel jour sommes-nous ? — Aujourd'hui, nous sommes jeudi dix octobre."
      },
      {
        "expr": "Quelle est la date de ton anniversaire ?",
        "meaning": "Qual é a data do seu aniversário?",
        "example": "Mon anniversaire, c'est le quatorze juillet !"
      },
      {
        "expr": "Joyeux anniversaire !",
        "meaning": "Feliz aniversário!",
        "example": "Joyeux anniversaire, Yara ! Voici un cadeau pour toi."
      },
      {
        "expr": "Du lundi au vendredi",
        "meaning": "De segunda a sexta-feira",
        "example": "J'étudie le français du lundi au vendredi."
      },
      {
        "expr": "Bon week-end ! / Bonne semaine !",
        "meaning": "Bom fim de semana! / Boa semana!",
        "example": "Au revoir tout le monde, bon week-end et à lundi !"
      },
      {
        "expr": "En janvier / Au mois de janvier",
        "meaning": "Em janeiro / No mês de janeiro",
        "example": "Je vais à Paris en avril."
      }
    ],
    "sentences": [
      "Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.",
      "Janvier, février, mars, avril, mai, juin.",
      "Juillet, août, septembre, octobre, novembre, décembre.",
      "Quel jour sommes-nous aujourd'hui ? — Nous sommes jeudi.",
      "Mon anniversaire est le quinze mars.",
      "Le samedi, je dîne avec mes amis.",
      "Je vais voyager en France en juillet ou en août.",
      "Bon week-end et à lundi !",
      "Salut Yara ! Quel jour sommes-nous aujourd'hui ?",
      "Aujourd'hui, nous sommes mercredi douze mai. Pourquoi ?"
    ],
    "grammar": {
      "title": "\"Lundi\" vs. \"Le lundi\" (Esta segunda vs. Toda segunda!)",
      "rules": [
        "<b>\"Lundi\" vs. \"Le lundi\" (Esta segunda vs. Toda segunda!):</b> Sem \"le\" = um dia específico (nesta semana): \"Lundi, je vais chez le médecin.\" (Na segunda-feira vou ao médico). (Lembre-se: Lundi = nesta segunda; Le lundi = todas as segundas-feiras!)",
        "<b>Como Dizer Datas: \"Le premier\" (Dia 1º) vs. Outros Dias:</b> Dia 1º do mês: C'est le premier janvier / le premier mai. (Em francês, dias da semana e meses do ano escrevem-se com letra minúscula (lundi, janvier) quando estão no meio da frase!)",
        "<b>Pronúncia de \"Mars\" (Março) e \"Août\" (Agosto):</b> Mars (março) pronuncia-se o S final bem claro: [MÁRS]. (No dia \"samedi\" (sábado), o E central é mudo: pronuncia-se [sam-DI] em duas sílabas!)"
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Significado",
          "Exemplo"
        ],
        "rows": [
          [
            "lundi (sem artigo)",
            "Nesta segunda-feira",
            "Lundi, je vais chez le médecin."
          ],
          [
            "le lundi (com le)",
            "Toda segunda-feira (hábito)",
            "Le lundi, je fais du sport."
          ],
          [
            "le premier / le dix",
            "Datas (1º = premier; 2..31 = cardinal)",
            "Le premier mai · Le quatorze juillet."
          ],
          [
            "en + mês",
            "Em + mês do ano",
            "Mon anniversaire est en août [ÚT]."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Qual é a diferença entre \"Samedi, je vais au cinéma\" e \"Le samedi, je vais au cinéma\"?",
        "a": "\"Samedi\" = neste sábado; \"Le samedi\" = todos os sábados (hábito)",
        "opts": [
          "\"Samedi\" = neste sábado; \"Le samedi\" = todos os sábados (hábito)",
          "Ambos significam exatamente a mesma coisa",
          "\"Le samedi\" significa sábado passado",
          "\"Samedi\" é formal e \"Le samedi\" é informal"
        ],
        "why": "O artigo \"le\" antes de um dia da semana indica hábito recorrente (\"toda segunda / aos sábados\")."
      },
      {
        "q": "Como se diz \"1º de maio\" em francês?",
        "a": "le premier mai",
        "opts": [
          "le premier mai",
          "le un mai",
          "le premier de mai",
          "en premier mai"
        ],
        "why": "Para o dia 1º do mês usamos sempre o ordinal \"premier\", sem preposição \"de\": le premier mai."
      },
      {
        "q": "Como se diz \"14 de julho\" em francês?",
        "a": "le quatorze juillet",
        "opts": [
          "le quatorze juillet",
          "le quatorze de juillet",
          "quatorze en juillet",
          "la quatorze juillet"
        ],
        "why": "Em francês nunca colocamos \"de\" entre o número e o mês: le quatorze juillet!"
      },
      {
        "q": "Qual preposição usamos antes dos meses do ano para dizer \"em janeiro / em agosto\"?",
        "a": "en (en janvier, en août)",
        "opts": [
          "en (en janvier, en août)",
          "dans (dans janvier)",
          "à (à janvier)",
          "le (le janvier)"
        ],
        "why": "Antes de meses do ano usamos \"en\": en janvier, en mai, en décembre."
      },
      {
        "q": "Como se pronuncia o mês de agosto (\"août\") em francês?",
        "a": "[ÚT] (o \"a\" é mudo e o \"t\" soa)",
        "opts": [
          "[ÚT] (o \"a\" é mudo e o \"t\" soa)",
          "[a-Ú]",
          "[a-ÚT]",
          "[ÔT]"
        ],
        "why": "\"Août\" pronuncia-se [ÚT], em uma única sílaba!"
      },
      {
        "q": "Quais são os dias úteis de segunda a sexta em ordem correta?",
        "a": "lundi, mardi, mercredi, jeudi, vendredi",
        "opts": [
          "lundi, mardi, mercredi, jeudi, vendredi",
          "lundi, mercredi, mardi, jeudi, vendredi",
          "dimanche, lundi, mardi, jeudi, samedi",
          "mardi, lundi, mercredi, vendredi, jeudi"
        ],
        "why": "Lundi (2ª), mardi (3ª), mercredi (4ª), jeudi (5ª), vendredi (6ª), samedi (sáb.), dimanche (dom.)."
      },
      {
        "q": "O que significa a pergunta \"Quel jour sommes-nous aujourd'hui ?\"?",
        "a": "Que dia é hoje?",
        "opts": [
          "Que dia é hoje?",
          "Quantos dias você fica aqui?",
          "Qual é o seu mês favorito?",
          "A que horas começa a aula?"
        ],
        "why": "\"Quel jour sommes-nous aujourd'hui ?\" (ou \"On est quel jour ?\") pergunta o dia da semana/data de hoje."
      },
      {
        "q": "Como se deseja \"Feliz aniversário!\" em francês?",
        "a": "Joyeux anniversaire !",
        "opts": [
          "Joyeux anniversaire !",
          "Bonne journée !",
          "Bon appétit !",
          "Bonne nuit !"
        ],
        "why": "\"Joyeux anniversaire !\" é a expressão padrão para desejar feliz aniversário."
      },
      {
        "q": "Qual mês vem logo depois de \"juin\" (junho)?",
        "a": "juillet (julho)",
        "opts": [
          "juillet (julho)",
          "mai (maio)",
          "août (agosto)",
          "avril (abril)"
        ],
        "why": "Mai (maio) → juin (junho) → juillet (julho) → août (agosto)."
      },
      {
        "q": "Complete: \"Je travaille ___ lundi ___ vendredi.\" (de segunda a sexta)",
        "a": "du / au",
        "opts": [
          "du / au",
          "de la / à la",
          "en / en",
          "dans / pour"
        ],
        "why": "\"Du lundi au vendredi\" = de segunda a sexta-feira."
      }
    ],
    "speak": [
      "Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.",
      "Janvier, février, mars, avril, mai, juin.",
      "Juillet, août, septembre, octobre, novembre, décembre.",
      "Quel jour sommes-nous aujourd'hui ? — Nous sommes jeudi.",
      "Mon anniversaire est le quinze mars.",
      "Le samedi, je dîne avec mes amis.",
      "Je vais voyager en France en juillet ou en août.",
      "Bon week-end et à lundi !"
    ]
  },
  {
    "id": 208,
    "title": "L'Heure",
    "emoji": "⏰",
    "lang": "fr",
    "verbs": [
      "Se réveiller",
      "Se lever",
      "Partir",
      "Arriver",
      "Se coucher"
    ],
    "vocab": [
      {
        "en": "Quelle heure est-il ?",
        "pt": "Que horas são? [kél ŒR é-TIL?]"
      },
      {
        "en": "Il est une heure",
        "pt": "É uma hora (1h00) [i-lé ü-NŒR]"
      },
      {
        "en": "Il est deux heures",
        "pt": "São duas horas [dø-ZŒR] [i-lé dø-ZŒR]"
      },
      {
        "en": "Il est midi",
        "pt": "É meio-dia (12h00) [i-lé mi-DI]"
      },
      {
        "en": "Il est minuit",
        "pt": "É meia-noite (00h00) [i-lé mi-NUÍ]"
      },
      {
        "en": "Et quart",
        "pt": "E quinze (lit. e um quarto) [ê KÁR]"
      },
      {
        "en": "Et demie",
        "pt": "E meia (30 min) [ê dã-MI]"
      },
      {
        "en": "Moins le quart",
        "pt": "Quinze para as... (lit. menos um quarto) [muã lã KÁR]"
      },
      {
        "en": "Pile",
        "pt": "Em ponto [PÍL]"
      },
      {
        "en": "Du matin",
        "pt": "Da manhã [dü ma-TÃ]"
      },
      {
        "en": "De l'après-midi",
        "pt": "Da tarde [dã la-pré-mi-DI]"
      },
      {
        "en": "Du soir",
        "pt": "Da noite [dü SUAR]"
      },
      {
        "en": "À quelle heure... ?",
        "pt": "A que horas...? [a kél ŒR?]"
      },
      {
        "en": "Tôt / Tard",
        "pt": "Cedo / Tarde [TÔ / TÁR]"
      },
      {
        "en": "Se réveiller / Se lever",
        "pt": "Acordar / Levantar-se [sã re-vê-IÊ / sã lã-VÊ]"
      },
      {
        "en": "Se coucher",
        "pt": "Deitar-se / Ir dormir [sã ku-CHÊ]"
      },
      {
        "en": "En avance / En retard",
        "pt": "Adiantado(a) / Atrasado(a) [ã na-VÃS / ãn rã-TÁR]"
      },
      {
        "en": "Rendez-vous",
        "pt": "Compromisso / Horário marcado / Encontro [rãn-dê-VU]"
      }
    ],
    "expressions": [
      {
        "expr": "Excusez-moi, quelle heure est-il ?",
        "meaning": "Com licença, que horas são?",
        "example": "— Excusez-moi, quelle heure est-il ? — Il est trois heures et quart."
      },
      {
        "expr": "À quelle heure... ?",
        "meaning": "A que horas...?",
        "example": "— À quelle heure part le train pour Lyon ? — À quinze heures vingt."
      },
      {
        "expr": "J'ai un rendez-vous à...",
        "meaning": "Eu tenho um compromisso / horário marcado às...",
        "example": "J'ai un rendez-vous chez le dentiste à dix heures et demie."
      },
      {
        "expr": "Il est huit heures pile.",
        "meaning": "São oito horas em ponto.",
        "example": "Le cours commence à neuf heures pile."
      },
      {
        "expr": "Vers huit heures",
        "meaning": "Por volta das oito horas / Lá pelas oito",
        "example": "On se retrouve au restaurant vers vingt heures ?"
      },
      {
        "expr": "Faire la grasse matinée",
        "meaning": "Dormir até mais tarde (no fim de semana)",
        "example": "Le dimanche, j'adore faire la grasse matinée !"
      }
    ],
    "sentences": [
      "Excusez-moi, quelle heure est-il ?",
      "Il est huit heures et quart.",
      "Il est neuf heures et demie.",
      "Il est dix heures moins le quart.",
      "À midi, je déjeune avec mes collègues.",
      "La semaine, je me lève à sept heures du matin.",
      "J'ai un rendez-vous à quatorze heures trente.",
      "Le soir, je me couche vers vingt-trois heures.",
      "Excuse-moi Léo, quelle heure est-il ? Mon téléphone n'a plus de batterie.",
      "Il est neuf heures moins le quart. À quelle heure part ton train ?"
    ],
    "grammar": {
      "title": "Em Francês as Horas são SEMPRE no Singular: \"Il est...\"!",
      "rules": [
        "<b>Em Francês as Horas são SEMPRE no Singular: \"Il est...\"!:</b> 1h00: Il est une heure. (Note que a palavra \"heure(s)\" vai para o plural a partir de 2h, mas o verbo continua no singular: \"Il est deux heures\"!)",
        "<b>Os Minutos: Et quart (:15), Et demie (:30), Moins le quart (:45):</b> :15 = et quart → Il est huit heures et quart (8h15). (Na França, trens, cinemas, aulas e restaurantes usam quase sempre o formato de 24h (18h, 20h30)!)",
        "<b>Verbos Reflexivos da Rotina (Je me lève, Tu te couches):</b> Je me réveille à sept heures (Eu acordo às 7h). (Na negativa, o \"ne\" abraça o pronome e o verbo juntos: \"Je ne me lève pas tôt le dimanche\".)"
      ],
      "table": {
        "headers": [
          "Horário",
          "Em Francês (Sempre \"Il est...\")",
          "Pronúncia"
        ],
        "rows": [
          [
            "8h00 / 12h00 / 00h00",
            "Il est huit heures / midi / minuit",
            "[i-lé uí-TŒR / mi-DI / mi-NUÍ]"
          ],
          [
            "8h15",
            "Il est huit heures et quart",
            "[i-lé uí-TŒR ê KÁR]"
          ],
          [
            "8h30",
            "Il est huit heures et demie",
            "[i-lé uí-TŒR ê dã-MI]"
          ],
          [
            "8h45",
            "Il est neuf heures moins le quart",
            "[i-lé nœ-VŒR muã lã KÁR]"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como se diz \"São três horas\" corretamente em francês?",
        "a": "Il est trois heures.",
        "opts": [
          "Il est trois heures.",
          "Ils sont trois heures.",
          "Il est trois heure.",
          "C'est trois heures."
        ],
        "why": "Em francês as horas usam sempre \"Il est...\" no singular!"
      },
      {
        "q": "Que horas são quando alguém diz: \"Il est huit heures et quart\"?",
        "a": "8h15",
        "opts": [
          "8h15",
          "8h30",
          "8h45",
          "7h45"
        ],
        "why": "\"Et quart\" = e um quarto de hora (+15 minutos): 8h15."
      },
      {
        "q": "Que horas são quando alguém diz: \"Il est dix heures moins le quart\"?",
        "a": "9h45 (quinze para as dez)",
        "opts": [
          "9h45 (quinze para as dez)",
          "10h15 (dez e quinze)",
          "10h45 (quinze para as onze)",
          "10h30 (dez e meia)"
        ],
        "why": "\"Dix heures moins le quart\" = dez horas menos um quarto = 9h45!"
      },
      {
        "q": "Como os franceses dizem \"É meio-dia\" e \"É meia-noite\"?",
        "a": "Il est midi / Il est minuit",
        "opts": [
          "Il est midi / Il est minuit",
          "Il est douze heures / Il est zéro heure",
          "C'est le jour / C'est la nuit",
          "Midi heures / Minuit heures"
        ],
        "why": "Meio-dia é \"Il est midi\" e meia-noite é \"Il est minuit\" (nunca se adiciona a palavra \"heures\" depois deles)."
      },
      {
        "q": "Como você pergunta \"A que horas começa o filme?\" em francês?",
        "a": "À quelle heure commence le film ?",
        "opts": [
          "À quelle heure commence le film ?",
          "Quelle heure est le film ?",
          "Combien d'heures le film ?",
          "Quand heure le film ?"
        ],
        "why": "\"Quelle heure est-il ?\" = Que horas são? · \"À quelle heure... ?\" = A que horas...?"
      },
      {
        "q": "O que significa a palavra \"rendez-vous\" no dia a dia na França?",
        "a": "Qualquer horário marcado, consulta médica, reunião ou encontro",
        "opts": [
          "Qualquer horário marcado, consulta médica, reunião ou encontro",
          "Apenas um encontro romântico",
          "Um atraso no trem",
          "Um despertador"
        ],
        "why": "\"Un rendez-vous\" é qualquer compromisso com hora marcada (médico, trabalho, amigos)."
      },
      {
        "q": "Como se diz \"São nove e meia\" em francês?",
        "a": "Il est neuf heures et demie.",
        "opts": [
          "Il est neuf heures et demie.",
          "Il est neuf heures et quart.",
          "Il est neuf heures moins demie.",
          "Il est neuf et trente."
        ],
        "why": "\":30\" diz-se \"et demie\" (no modo 12h) ou \"trente\" (no modo 24h: neuf heures trente)."
      },
      {
        "q": "Complete a frase de rotina: \"Le matin, je ___ lève à sept heures.\"",
        "a": "me",
        "opts": [
          "me",
          "te",
          "se",
          "nous"
        ],
        "why": "\"Se lever\" é um verbo pronominal: Je me lève, tu te lèves, il se lève."
      },
      {
        "q": "O que significa a expressão \"faire la grasse matinée\"?",
        "a": "Dormir até tarde pela manhã",
        "opts": [
          "Dormir até tarde pela manhã",
          "Tomar um café da manhã gorduroso",
          "Acordar às cinco da manhã",
          "Trabalhar no domingo"
        ],
        "why": "\"Faire la grasse matinée\" é ficar na cama até mais tarde nos dias de folga!"
      },
      {
        "q": "Na estação de trem, o painel mostra 15h20. Como isso é anunciado em francês?",
        "a": "Quinze heures vingt",
        "opts": [
          "Quinze heures vingt",
          "Trois heures moins vingt",
          "Cinquante heures vingt",
          "Quinze et vingt minutes"
        ],
        "why": "Basta dizer o número da hora + \"heures\" + o número dos minutos: quinze heures vingt."
      }
    ],
    "speak": [
      "Excusez-moi, quelle heure est-il ?",
      "Il est huit heures et quart.",
      "Il est neuf heures et demie.",
      "Il est dix heures moins le quart.",
      "À midi, je déjeune avec mes collègues.",
      "La semaine, je me lève à sept heures du matin.",
      "J'ai un rendez-vous à quatorze heures trente.",
      "Le soir, je me couche vers vingt-trois heures."
    ]
  },
  {
    "id": 209,
    "title": "La Météo",
    "emoji": "🌦️",
    "lang": "fr",
    "verbs": [
      "Faire",
      "Pleuvoir",
      "Neiger",
      "Sortir",
      "Voyager"
    ],
    "vocab": [
      {
        "en": "Quel temps fait-il ?",
        "pt": "Como está o tempo? [kél TÃ fé-TIL?]"
      },
      {
        "en": "Il fait beau",
        "pt": "O tempo está bom / bonito [il fé BÔ]"
      },
      {
        "en": "Il fait mauvais",
        "pt": "O tempo está ruim / feio [il fé mô-VÉ]"
      },
      {
        "en": "Il fait chaud",
        "pt": "Está calor / quente [il fé CHÔ]"
      },
      {
        "en": "Il fait froid",
        "pt": "Está frio [il fé FRUÁ]"
      },
      {
        "en": "Il fait frais / doux",
        "pt": "Está fresquinho / ameno [il fé FRÉ / DU]"
      },
      {
        "en": "Il pleut / La pluie",
        "pt": "Está chovendo / A chuva [il PLØ / la PLUÍ]"
      },
      {
        "en": "Il neige / La neige",
        "pt": "Está nevando / A neve [il NÉJ / la NÉJ]"
      },
      {
        "en": "Il y a du soleil",
        "pt": "Está fazendo sol (há sol) [i-li-á dü sô-LÉI]"
      },
      {
        "en": "Il y a du vent",
        "pt": "Está ventando (há vento) [i-li-á dü VÃ]"
      },
      {
        "en": "Il y a des nuages",
        "pt": "Está nublado (há nuvens) [i-li-á dê nü-ÁJ]"
      },
      {
        "en": "Il y a de l'orage",
        "pt": "Há tempestade / trovoada [i-li-á dã lô-RÁJ]"
      },
      {
        "en": "Le printemps",
        "pt": "A primavera (usa AU printemps!) [lã prãn-TÃ]"
      },
      {
        "en": "L'été",
        "pt": "O verão (usa EN été) [le-TÊ]"
      },
      {
        "en": "L'automne",
        "pt": "O outono (usa EN automne) [lô-TÓN]"
      },
      {
        "en": "L'hiver",
        "pt": "O inverno (usa EN hiver [ã ni-VÉR]) [li-VÉR]"
      },
      {
        "en": "Le parapluie",
        "pt": "O guarda-chuva [lã pa-ra-PLUÍ]"
      },
      {
        "en": "Les degrés",
        "pt": "Os graus (temperatura) [lê dã-GRÊ]"
      }
    ],
    "expressions": [
      {
        "expr": "Quel temps fait-il ?",
        "meaning": "Como está o tempo? (Lit. Que tempo faz?)",
        "example": "— Quel temps fait-il à Rio ? — Il fait beau et il fait trente degrés !"
      },
      {
        "expr": "Il fait un froid de canard !",
        "meaning": "Está um frio de rachar! (Lit. um frio de pato)",
        "example": "Mets ton manteau et ton écharpe, il fait un froid de canard !"
      },
      {
        "expr": "Il pleut des cordes !",
        "meaning": "Está chovendo canivetes! (Lit. chovendo cordas)",
        "example": "On ne peut pas sortir maintenant, il pleut des cordes !"
      },
      {
        "expr": "Au printemps / En été / En automne / En hiver",
        "meaning": "Na primavera / No verão / No outono / No inverno",
        "example": "J'adore Paris au printemps et en automne."
      },
      {
        "expr": "Il fait vingt-cinq degrés.",
        "meaning": "Está fazendo 25 graus.",
        "example": "En hiver, il fait parfois zéro degré à Paris."
      },
      {
        "expr": "Quelle belle journée !",
        "meaning": "Que dia lindo!",
        "example": "Il fait beau, le ciel est bleu : quelle belle journée !"
      }
    ],
    "sentences": [
      "Quel temps fait-il aujourd'hui ?",
      "Il fait très beau et il y a du soleil.",
      "Prends ton parapluie, il pleut des cordes !",
      "En été, il fait très chaud au Brésil.",
      "En hiver, il fait froid et il neige en France.",
      "Au printemps, il fait doux et il y a des fleurs.",
      "En automne, il y a du vent et des nuages.",
      "Demain, il va faire vingt-cinq degrés !",
      "Coucou ma chérie ! Quel temps fait-il à Paris aujourd'hui ?",
      "Coucou Maman ! Ici, c'est l'automne : il fait frais, il y a du vent et il pleut un peu."
    ],
    "grammar": {
      "title": "As 3 Estruturas do Clima: Il fait vs. Il y a vs. Verbo Direto",
      "rules": [
        "<b>As 3 Estruturas do Clima: Il fait vs. Il y a vs. Verbo Direto:</b> IL FAIT + adjetivo: Il fait beau, il fait mauvais, il fait chaud, il fait froid, il fait frais. (Compare: \"Il fait froid\" (Está frio lá fora — clima) vs. \"J'ai froid\" (Eu estou com frio — sensação pessoal)!)",
        "<b>As Preposições das Estações: Por que \"AU printemps\" e \"EN été\"?:</b> Começam com som de vogal → usam EN: en été [ã ne-TÊ], en automne [ã nô-TÓN], en hiver [ã ni-VÉR]. (Em \"l'hiver\" [li-VÉR], o R final é pronunciado! Já em \"l'automne\" [lô-TÓN], o M é mudo e soa só o N!)",
        "<b>Futuro Próximo para Previsão do Tempo (Aller + Infinitivo):</b> Il va pleuvoir cet après-midi (Vai chover hoje à tarde). (Basta usar \"Il va\" + faire / pleuvoir / neiger / y avoir para falar do tempo de amanhã!)"
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Exemplo em Francês",
          "Tradução"
        ],
        "rows": [
          [
            "Il fait + adjetivo",
            "Il fait beau / chaud / froid / frais.",
            "O tempo está bom / quente / frio / fresco."
          ],
          [
            "Il y a + partitivo",
            "Il y a du soleil / du vent / des nuages.",
            "Está fazendo sol / ventando / nublado."
          ],
          [
            "Verbo direto",
            "Il pleut / Il neige.",
            "Está chovendo / Está nevando."
          ],
          [
            "Estações",
            "Au printemps · En été / automne / hiver",
            "Na primavera · No verão / outono / inverno"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como se pergunta \"Como está o tempo?\" em francês?",
        "a": "Quel temps fait-il ?",
        "opts": [
          "Quel temps fait-il ?",
          "Quelle heure est-il ?",
          "Quel climat est-il ?",
          "Comment va le temps ?"
        ],
        "why": "\"Quel temps fait-il ?\" é a forma padrão de perguntar sobre o tempo/clima."
      },
      {
        "q": "Qual é a diferença entre \"Il fait froid\" e \"J'ai froid\"?",
        "a": "\"Il fait froid\" = está frio (o clima lá fora); \"J'ai froid\" = eu estou com frio",
        "opts": [
          "\"Il fait froid\" = está frio (o clima lá fora); \"J'ai froid\" = eu estou com frio",
          "Ambos significam exatamente a mesma coisa",
          "\"Il fait froid\" é para pessoas e \"J'ai froid\" é para o clima",
          "\"Il fait froid\" é no verão"
        ],
        "why": "\"Il fait...\" descreve o tempo atmosférico; \"J'ai...\" descreve o que a pessoa sente no corpo."
      },
      {
        "q": "Qual estação do ano usa a preposição \"AU\" em vez de \"EN\"?",
        "a": "au printemps (na primavera)",
        "opts": [
          "au printemps (na primavera)",
          "au été (no verão)",
          "au hiver (no inverno)",
          "au automne (no outono)"
        ],
        "why": "Dizemos \"au printemps\", mas \"en été\", \"en automne\" e \"en hiver\"!"
      },
      {
        "q": "Como se diz \"Está chovendo\" e \"Está nevando\" em francês?",
        "a": "Il pleut / Il neige",
        "opts": [
          "Il pleut / Il neige",
          "Il fait pleut / Il fait neige",
          "Il y a pleut / Il y a neige",
          "C'est pluie / C'est neige"
        ],
        "why": "\"Pleuvoir\" e \"neiger\" são verbos próprios: Il pleut (chove/está chovendo) e Il neige (neva/está nevando)."
      },
      {
        "q": "Qual expressão completa corretamente: \"Aujourd'hui, ___ du soleil et ___ du vent.\"?",
        "a": "il y a / il y a",
        "opts": [
          "il y a / il y a",
          "il fait / il fait",
          "il est / il est",
          "c'est / c'est"
        ],
        "why": "Antes de substantivos com partitivo (du soleil, du vent, des nuages), usamos \"Il y a\"!"
      },
      {
        "q": "O que significa a expressão idiomática \"Il pleut des cordes !\"?",
        "a": "Está chovendo muito forte (chovendo canivetes)!",
        "opts": [
          "Está chovendo muito forte (chovendo canivetes)!",
          "Está ventando na praia",
          "Está nevando nas montanhas",
          "O tempo abriu"
        ],
        "why": "\"Il pleut des cordes\" (lit. chove cordas) significa que está caindo um toró."
      },
      {
        "q": "Como você diz \"O tempo está bom / bonito\" em francês?",
        "a": "Il fait beau.",
        "opts": [
          "Il fait beau.",
          "Il fait bonjour.",
          "Il est joli.",
          "Il a beau."
        ],
        "why": "\"Il fait beau\" = o tempo está bom/bonito; \"Il fait mauvais\" = o tempo está ruim/feio."
      },
      {
        "q": "Como se pronuncia a palavra \"hiver\" (inverno)?",
        "a": "[i-VÉR] (H mudo e R final pronunciado)",
        "opts": [
          "[i-VÉR] (H mudo e R final pronunciado)",
          "[i-VÊ] (R mudo)",
          "[ri-VÉR]",
          "[i-VÉRN]"
        ],
        "why": "Diferente dos verbos em -er, o substantivo \"hiver\" tem o R final pronunciado: [i-VÉR]."
      },
      {
        "q": "O que significa \"Il fait un froid de canard\"?",
        "a": "Está um frio de rachar!",
        "opts": [
          "Está um frio de rachar!",
          "Há patos no lago",
          "Está fazendo calor",
          "Vai começar a primavera"
        ],
        "why": "\"Un froid de canard\" é a expressão francesa clássica para um frio intenso."
      },
      {
        "q": "Complete: \"Demain, il va ___ beau et chaud.\" (Amanhã vai fazer tempo bom e quente)",
        "a": "faire",
        "opts": [
          "faire",
          "fait",
          "être",
          "avoir"
        ],
        "why": "Depois de \"il va\" (futuro próximo), usamos o infinitivo: il va faire beau!"
      }
    ],
    "speak": [
      "Quel temps fait-il aujourd'hui ?",
      "Il fait très beau et il y a du soleil.",
      "Prends ton parapluie, il pleut des cordes !",
      "En été, il fait très chaud au Brésil.",
      "En hiver, il fait froid et il neige en France.",
      "Au printemps, il fait doux et il y a des fleurs.",
      "En automne, il y a du vent et des nuages.",
      "Demain, il va faire vingt-cinq degrés !"
    ]
  },
  {
    "id": 210,
    "title": "Les Directions",
    "emoji": "🧭",
    "lang": "fr",
    "verbs": [
      "Aller",
      "Tourner",
      "Traverser",
      "Continuer",
      "Prendre"
    ],
    "vocab": [
      {
        "en": "Où est... ? / Où se trouve... ?",
        "pt": "Onde fica...? [u É / u sã TRUV]"
      },
      {
        "en": "À droite",
        "pt": "À direita [a DRUÁT]"
      },
      {
        "en": "À gauche",
        "pt": "À esquerda [a GÔCH]"
      },
      {
        "en": "Tout droit",
        "pt": "Sempre em frente / Reto [tu DRUÁ]"
      },
      {
        "en": "Près de / À côté de",
        "pt": "Perto de / Ao lado de [PRÉ dã / a kô-TÊ dã]"
      },
      {
        "en": "Loin de",
        "pt": "Longe de [LUÃ dã]"
      },
      {
        "en": "En face de",
        "pt": "Em frente a [ãn FÁS dã]"
      },
      {
        "en": "Au coin de la rue",
        "pt": "Na esquina da rua [ô KUÃ dã la RÜ]"
      },
      {
        "en": "La gare / Le métro",
        "pt": "A estação de trem / O metrô [la GÁR / lã me-TRÔ]"
      },
      {
        "en": "La boulangerie",
        "pt": "A padaria [la bu-lãn-jã-RI]"
      },
      {
        "en": "La pharmacie / L'hôpital",
        "pt": "A farmácia / O hospital [la far-ma-SI / lô-pi-TÁL]"
      },
      {
        "en": "Le musée / Le parc",
        "pt": "O museu / O parque [lã mü-ZÊ / lã PÁRK]"
      },
      {
        "en": "La banque / Le supermarché",
        "pt": "O banco / O supermercado [la BÃK / lã sü-pér-mar-CHÊ]"
      },
      {
        "en": "L'hôtel / L'aéroport",
        "pt": "O hotel / O aeroporto [lô-TÉL / la-e-rô-PÓR]"
      },
      {
        "en": "Le pont / La place",
        "pt": "A ponte / A praça [lã PÔN / la PLÁS]"
      },
      {
        "en": "Le feu rouge",
        "pt": "O semáforo / sinal [lã fø RUJ]"
      },
      {
        "en": "À pied / En métro / En bus",
        "pt": "A pé / De metrô / De ônibus [a PIÊ / ãn me-TRÔ / ãn BÜS]"
      },
      {
        "en": "Ici / Là-bas",
        "pt": "Aqui / Logo ali (lá) [i-SI / la-BÁ]"
      }
    ],
    "expressions": [
      {
        "expr": "Excusez-moi, pour aller à... ?",
        "meaning": "Com licença, como faço para ir até...?",
        "example": "Excusez-moi Monsieur, pour aller au musée d'Orsay, s'il vous plaît ?"
      },
      {
        "expr": "Où est... ? / Où se trouve... ?",
        "meaning": "Onde está...? / Onde fica...?",
        "example": "Pardon Madame, où se trouve la pharmacie la plus proche ?"
      },
      {
        "expr": "C'est à cinq minutes à pied.",
        "meaning": "Fica a cinco minutos a pé.",
        "example": "Ce n'est pas loin, c'est à cinq minutes à pied d'ici."
      },
      {
        "expr": "Prenez la première rue à droite.",
        "meaning": "Pegue a primeira rua à direita.",
        "example": "Allez tout droit et prenez la deuxième rue à gauche."
      },
      {
        "expr": "Jusqu'au feu rouge / Jusqu'à la place",
        "meaning": "Até o semáforo / Até a praça",
        "example": "Continuez tout droit jusqu'au feu rouge."
      },
      {
        "expr": "Je suis perdu(e) !",
        "meaning": "Estou perdido(a)!",
        "example": "Excusez-moi, je suis un peu perdue. Où est le métro ?"
      }
    ],
    "sentences": [
      "Excusez-moi, où se trouve la station de métro ?",
      "Allez tout droit jusqu'au feu rouge, puis tournez à droite.",
      "Prenez la première rue à gauche.",
      "La boulangerie est au coin de la rue, à côté de l'hôtel.",
      "Le café est juste en face du musée.",
      "Ce n'est pas loin, c'est à cinq minutes à pied.",
      "Je vais à la gare en métro.",
      "Traversez le pont et la grande place !",
      "Bonjour Madame ! Excusez-moi, je cherche le musée du Louvre. C'est loin d'ici ?",
      "Bonjour ! Non, ce n'est pas loin du tout, c'est à dix minutes à pied."
    ],
    "grammar": {
      "title": "Ir a Algum Lugar: Aller + AU / À LA / À L' / AUX",
      "rules": [
        "<b>Ir a Algum Lugar: Aller + AU / À LA / À L' / AUX:</b> Lugar masculino (à + le = AU): Je vais au parc, au musée, au cinéma, au supermarché. (Se você vai à casa ou consultório de uma PESSOA, use CHEZ: \"Je vais chez le médecin / chez mon ami\"!)",
        "<b>Preposições de Localização com DE (Du / De la / De l'):</b> Masculino (de + le = DU): La banque est à côté du musée / en face du parc. (Sempre que o lugar vier no final da frase sem outro complemento, tire o \"de\": \"C'est juste à côté !\" (Fica bem ao lado!).)",
        "<b>Dando Direções com Educação (Imperativo com Vous: -EZ):</b> Allez tout droit (Vá reto / Siga em frente). (Repare na diferença sonora: \"tout droit\" [tu DRUÁ] (masculino, T mudo) vs. \"à droite\" [a DRUÁT] (feminino, T pronunciado)!)"
      ],
      "table": {
        "headers": [
          "Gênero do Lugar",
          "Aller (Ir a)",
          "À côté / En face (Ao lado / Em frente)"
        ],
        "rows": [
          [
            "Masculino (le parc)",
            "Je vais au parc.",
            "C'est en face du parc."
          ],
          [
            "Feminino (la gare)",
            "Je vais à la gare.",
            "C'est à côté de la gare."
          ],
          [
            "Vogal / H (l'hôtel)",
            "Je vais à l'hôtel.",
            "C'est près de l'hôtel."
          ],
          [
            "Direções",
            "Allez tout droit !",
            "Tournez à droite / à gauche !"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Qual é a contração correta para dizer \"Eu vou ao parque\" e \"Eu vou à estação\"?",
        "a": "Je vais au parc / Je vais à la gare",
        "opts": [
          "Je vais au parc / Je vais à la gare",
          "Je vais à le parc / Je vais au gare",
          "Je vais du parc / Je vais de la gare",
          "Je vais en parc / Je vais en gare"
        ],
        "why": "Com lugares masculinos usamos \"au\" (à + le); com lugares femininos usamos \"à la\"."
      },
      {
        "q": "Como se diz \"Eu vou ao hotel\" em francês?",
        "a": "Je vais à l'hôtel.",
        "opts": [
          "Je vais à l'hôtel.",
          "Je vais au hôtel.",
          "Je vais à la hôtel.",
          "Je vais en hôtel."
        ],
        "why": "Como \"hôtel\" começa com H mudo, usamos \"à l'\": Je vais à l'hôtel."
      },
      {
        "q": "O que significa a instrução: \"Allez tout droit, puis tournez à gauche\"?",
        "a": "Siga sempre em frente, depois vire à esquerda",
        "opts": [
          "Siga sempre em frente, depois vire à esquerda",
          "Vire à direita e depois volte",
          "Atravesse a rua e pare à direita",
          "Pegue o metrô até a praça"
        ],
        "why": "Tout droit = sempre em frente / reto; à gauche = à esquerda; à droite = à direita."
      },
      {
        "q": "Como completamos: \"Le café est en face ___ musée.\" (em frente ao museu)?",
        "a": "du",
        "opts": [
          "du",
          "de le",
          "au",
          "de la"
        ],
        "why": "\"En face de\" + \"le musée\" contrai obrigatoriamente para \"en face du musée\"!"
      },
      {
        "q": "Qual é a diferença de pronúncia entre \"tout droit\" (reto) e \"à droite\" (à direita)?",
        "a": "Em \"tout droit\" [tu DRUÁ] o T final é mudo; em \"à droite\" [a DRUÁT] o T é pronunciado",
        "opts": [
          "Em \"tout droit\" [tu DRUÁ] o T final é mudo; em \"à droite\" [a DRUÁT] o T é pronunciado",
          "Ambos têm o T pronunciado",
          "Ambos têm o T mudo",
          "\"Tout droit\" significa à esquerda"
        ],
        "why": "O \"-e\" final em \"droite\" faz a consoante T soar claramente: [a DRUÁT]!"
      },
      {
        "q": "Como você diz \"Fica a cinco minutos a pé\" em francês?",
        "a": "C'est à cinq minutes à pied.",
        "opts": [
          "C'est à cinq minutes à pied.",
          "C'est en cinq minutes en pied.",
          "Il fait cinq minutes de pied.",
          "J'ai cinq minutes à pied."
        ],
        "why": "Dizemos \"à pied\" (a pé), mas \"en métro / en bus / en train / en voiture\"."
      },
      {
        "q": "Qual lugar da cidade francesa vende pães e croissants fresquinhos?",
        "a": "La boulangerie",
        "opts": [
          "La boulangerie",
          "La pharmacie",
          "La bibliothèque",
          "La gare"
        ],
        "why": "La boulangerie é a padaria tradicional francesa."
      },
      {
        "q": "O que significa \"au coin de la rue\"?",
        "a": "Na esquina da rua",
        "opts": [
          "Na esquina da rua",
          "No meio da ponte",
          "Longe da cidade",
          "Dentro do metrô"
        ],
        "why": "\"Le coin\" significa canto/esquina: au coin de la rue = na esquina da rua."
      },
      {
        "q": "Qual frase é ideal para pedir direção na rua a um desconhecido?",
        "a": "Excusez-moi, pour aller à la gare, s'il vous plaît ?",
        "opts": [
          "Excusez-moi, pour aller à la gare, s'il vous plaît ?",
          "Où tu vas à la gare ?",
          "Je veux la gare maintenant.",
          "La gare est gauche."
        ],
        "why": "\"Excusez-moi, pour aller à...\" ou \"Excusez-moi, où se trouve...\" são as formas mais educadas."
      },
      {
        "q": "O que significa \"à côté de\"?",
        "a": "Ao lado de",
        "opts": [
          "Ao lado de",
          "Longe de",
          "Em cima de",
          "Antes de"
        ],
        "why": "À côté de = ao lado de; en face de = em frente a; près de = perto de; loin de = longe de."
      }
    ],
    "speak": [
      "Excusez-moi, où se trouve la station de métro ?",
      "Allez tout droit jusqu'au feu rouge, puis tournez à droite.",
      "Prenez la première rue à gauche.",
      "La boulangerie est au coin de la rue, à côté de l'hôtel.",
      "Le café est juste en face du musée.",
      "Ce n'est pas loin, c'est à cinq minutes à pied.",
      "Je vais à la gare en métro.",
      "Traversez le pont et la grande place !"
    ]
  },
  {
    "id": 211,
    "title": "Les Vêtements",
    "emoji": "🛍️",
    "lang": "fr",
    "verbs": [
      "Porter",
      "Essayer",
      "Acheter",
      "Payer",
      "Choisir"
    ],
    "vocab": [
      {
        "en": "Les vêtements",
        "pt": "As roupas [lê vêt-MÃ]"
      },
      {
        "en": "Un pantalon / Un jean",
        "pt": "Uma calça / Uma calça jeans [ãn pãn-ta-LÔN / ãn DJÍN]"
      },
      {
        "en": "Une chemise / Un t-shirt",
        "pt": "Uma camisa / Uma camiseta [ün chã-MÍZ / ãn ti-CHŒRT]"
      },
      {
        "en": "Une robe / Une jupe",
        "pt": "Um vestido / Uma saia [ün RÓB / ün JÜP]"
      },
      {
        "en": "Un pull",
        "pt": "Um suéter / blusa de lã [ãn PÜL]"
      },
      {
        "en": "Un manteau / Une veste",
        "pt": "Um sobretudo (casaco longo) / Uma jaqueta (ou blazer) [ãn mãn-TÔ / ün VÉST]"
      },
      {
        "en": "Des chaussures / Des baskets",
        "pt": "Sapatos / Tênis [dê chô-SÜR / dê bas-KÉT]"
      },
      {
        "en": "Des chaussettes",
        "pt": "Meias [dê chô-SÉT]"
      },
      {
        "en": "Une écharpe / Un chapeau",
        "pt": "Um cachecol (lenço) / Um chapéu [ü ne-CHÁRP / ãn cha-PÔ]"
      },
      {
        "en": "Un sac / Des lunettes",
        "pt": "Uma bolsa (ou mochila) / Óculos [ãn SÁK / dê lü-NÉT]"
      },
      {
        "en": "La taille / La pointure",
        "pt": "O tamanho (de roupa) / O número (de calçado) [la TÁI / la puãn-TÜR]"
      },
      {
        "en": "La cabine d'essayage",
        "pt": "O provador [la ka-BÍN dê-sê-IÁJ]"
      },
      {
        "en": "Cher / Pas cher",
        "pt": "Caro / Barato [CHÉR / pá CHÉR]"
      },
      {
        "en": "Les soldes",
        "pt": "As liquidações / promoções [lê SÓLD]"
      },
      {
        "en": "Par carte / En espèces",
        "pt": "No cartão / Em dinheiro vivo [par KÁRT / ã nes-PÉS]"
      },
      {
        "en": "Ce / Cet (masc. sing.)",
        "pt": "Este / Esse (antes de consoante / vogal) [SÃ / SÉT]"
      },
      {
        "en": "Cette (fem. sing.)",
        "pt": "Esta / Essa [SÉT]"
      },
      {
        "en": "Ces (plural)",
        "pt": "Estes / Estas / Esses / Essas [SÊ]"
      }
    ],
    "expressions": [
      {
        "expr": "Je peux essayer, s'il vous plaît ?",
        "meaning": "Posso experimentar, por favor?",
        "example": "Excusez-moi, je peux essayer ce pantalon ? Où est la cabine d'essayage ?"
      },
      {
        "expr": "Quelle est votre taille ? / Vous faites du combien ?",
        "meaning": "Qual é o seu tamanho?",
        "example": "— Quelle est votre taille ? — Je fais du 38 (ou taille M)."
      },
      {
        "expr": "Ça vous va très bien ! / Ça me va bien.",
        "meaning": "Ficou ótimo em você! / Serviu bem em mim.",
        "example": "Cette veste bleue vous va très bien !"
      },
      {
        "expr": "Je vais le / la prendre !",
        "meaning": "Vou levar (ele / ela)!",
        "example": "La taille est parfaite, je vais la prendre !"
      },
      {
        "expr": "Vous payez par carte ou en espèces ?",
        "meaning": "O(a) senhor(a) paga no cartão ou em dinheiro?",
        "example": "— Vous payez comment ? — Par carte, sans contact, s'il vous plaît."
      },
      {
        "expr": "Je regarde seulement, merci.",
        "meaning": "Estou só dando uma olhadinha, obrigado(a).",
        "example": "— Bonjour, je peux vous aider ? — Je regarde seulement, merci beaucoup !"
      }
    ],
    "sentences": [
      "Bonjour ! Je cherche un manteau chaud pour l'hiver.",
      "Excusez-moi, je peux essayer cette robe, s'il vous plaît ?",
      "Où est la cabine d'essayage ?",
      "Ce pull est un peu trop petit. Vous avez la taille M ?",
      "Cette veste bleue vous va très bien !",
      "Ces chaussures sont très confortables et pas chères.",
      "La taille est parfaite, je vais la prendre !",
      "Je paie par carte bancaire, sans contact.",
      "Bonjour Madame ! Bienvenue, je peux vous aider ?",
      "Bonjour ! Oui, je cherche un manteau chaud pour l'hiver. J'aime beaucoup ce manteau bleu."
    ],
    "grammar": {
      "title": "Os Demonstrativos: CE, CET, CETTE, CES (Este/Esta/Estes/Estas)",
      "rules": [
        "<b>Os Demonstrativos: CE, CET, CETTE, CES (Este/Esta/Estes/Estas):</b> Masculino singular + consoante (CE [sã]): ce pantalon, ce pull, ce manteau. (\"Cet\" (masc. antes de vogal) e \"Cette\" (feminino) têm exatamente a mesma pronúncia [SÉT]!)",
        "<b>Singular em Português, Masculino/Feminino Diferente em Francês!:</b> Un pantalon / Un jean = masculino e singular em francês (\"une calça\" → un pantalon noir). (Lembre-se sempre deste par invertido em relação ao português: UN pantalon (masc.) e UNE robe (fem.)!)",
        "<b>La Taille (Roupa) vs. La Pointure (Sapato):</b> Para camisas, vestidos, calças e casacos: Quelle est votre taille ? (Je fais du M / du 38). (\"Très\" = muito (intensidade normal: très joli); \"Trop\" = demais / em excesso (trop petit = pequeno demais)!)"
      ],
      "table": {
        "headers": [
          "Demonstrativo",
          "Uso",
          "Exemplos de Compras"
        ],
        "rows": [
          [
            "ce [sã]",
            "Masc. sing. + consoante",
            "ce pantalon, ce pull, ce manteau"
          ],
          [
            "cet [sét]",
            "Masc. sing. + vogal / H mudo",
            "cet imperméable, cet hôtel"
          ],
          [
            "cette [sét]",
            "Feminino singular (todas)",
            "cette robe, cette chemise, cette écharpe"
          ],
          [
            "ces [sê]",
            "Plural (masculino e feminino)",
            "ces chaussures, ces vêtements"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Qual demonstrativo completa corretamente: \"___ pantalon est noir et ___ robe est rouge.\"?",
        "a": "Ce / cette",
        "opts": [
          "Ce / cette",
          "Cette / ce",
          "Cet / ces",
          "Ces / ce"
        ],
        "why": "\"Le pantalon\" é masculino em francês (ce pantalon) e \"la robe\" é feminino (cette robe)!"
      },
      {
        "q": "Por que dizemos \"cet imperméable\" e \"cet hôtel\" com CET em vez de CE?",
        "a": "Porque são masculinos singulares que começam com vogal ou H mudo",
        "opts": [
          "Porque são masculinos singulares que começam com vogal ou H mudo",
          "Porque são palavras femininas",
          "Porque estão no plural",
          "Porque são roupas caras"
        ],
        "why": "Antes de substantivo masculino singular iniciado por vogal ou H mudo, \"ce\" vira \"cet\" [SÉT]!"
      },
      {
        "q": "Qual demonstrativo usamos no plural para ambos os gêneros (\"estes sapatos / estas camisas\")?",
        "a": "ces (ces chaussures, ces chemises)",
        "opts": [
          "ces (ces chaussures, ces chemises)",
          "cettes",
          "ceux",
          "cet"
        ],
        "why": "\"Ces\" [SÊ] é o único demonstrativo plural para masculino e feminino!"
      },
      {
        "q": "Como você pergunta à vendedora \"Posso experimentar, por favor?\" em francês?",
        "a": "Je peux essayer, s'il vous plaît ?",
        "opts": [
          "Je peux essayer, s'il vous plaît ?",
          "Je peux porter, s'il vous plaît ?",
          "Où est la caisse, s'il vous plaît ?",
          "Combien je fais, s'il vous plaît ?"
        ],
        "why": "O verbo experimentar/provar roupas é \"essayer\", e o provador é \"la cabine d'essayage\"."
      },
      {
        "q": "Qual é a diferença entre \"très grand\" e \"trop grand\" ao provar uma roupa?",
        "a": "\"Très grand\" = muito grande; \"Trop grand\" = grande DEMAIS (não serve)",
        "opts": [
          "\"Très grand\" = muito grande; \"Trop grand\" = grande DEMAIS (não serve)",
          "Ambos significam grande demais",
          "\"Trop grand\" = muito pequeno",
          "\"Très grand\" = barato"
        ],
        "why": "\"Trop\" indica excesso (\"grande demais / pequeno demais / caro demais\")."
      },
      {
        "q": "Como se diz \"Eu pago no cartão\" e \"em dinheiro\" em francês?",
        "a": "Je paie par carte / en espèces",
        "opts": [
          "Je paie par carte / en espèces",
          "Je paie en carte / par argent",
          "Je fais carte / espèces",
          "J'ai carte / monnaie"
        ],
        "why": "Par carte bancaire = no cartão; en espèces = em dinheiro vivo."
      },
      {
        "q": "O que a vendedora quer dizer com \"Cette veste vous va très bien !\"?",
        "a": "Esta jaqueta ficou ótima em você!",
        "opts": [
          "Esta jaqueta ficou ótima em você!",
          "Esta jaqueta vai embora agora!",
          "Esta jaqueta é muito cara!",
          "Esta jaqueta está no provador!"
        ],
        "why": "\"Ça vous va très bien\" significa que a roupa caiu super bem em você."
      },
      {
        "q": "Qual palavra francesa é usada especificamente para o número do calçado (sapato/tênis)?",
        "a": "la pointure",
        "opts": [
          "la pointure",
          "la taille",
          "la couleur",
          "la cabine"
        ],
        "why": "La taille = tamanho de roupa; la pointure = numeração de calçado."
      },
      {
        "q": "Se você entrou na loja apenas para olhar, como responde educadamente ao vendedor?",
        "a": "Je regarde seulement, merci.",
        "opts": [
          "Je regarde seulement, merci.",
          "Je ne vois pas, merci.",
          "Je prends tout, merci.",
          "C'est trop cher, au revoir."
        ],
        "why": "\"Je regarde seulement, merci\" = Estou só olhando, obrigado(a)."
      },
      {
        "q": "Complete: \"Aujourd'hui, il fait froid : elle ___ un pull et un manteau.\" (ela veste/usa)",
        "a": "porte",
        "opts": [
          "porte",
          "parle",
          "paie",
          "pense"
        ],
        "why": "O verbo \"porter\" é usado para vestir/usar roupas e acessórios."
      }
    ],
    "speak": [
      "Bonjour ! Je cherche un manteau chaud pour l'hiver.",
      "Excusez-moi, je peux essayer cette robe, s'il vous plaît ?",
      "Où est la cabine d'essayage ?",
      "Ce pull est un peu trop petit. Vous avez la taille M ?",
      "Cette veste bleue vous va très bien !",
      "Ces chaussures sont très confortables et pas chères.",
      "La taille est parfaite, je vais la prendre !",
      "Je paie par carte bancaire, sans contact."
    ]
  },
  {
    "id": 212,
    "title": "Le Passé Composé",
    "emoji": "⏪",
    "lang": "fr",
    "verbs": [
      "Avoir mangé",
      "Avoir fait",
      "Avoir vu",
      "Avoir pris",
      "Être allé(e)"
    ],
    "vocab": [
      {
        "en": "Hier",
        "pt": "Ontem [i-ÉR]"
      },
      {
        "en": "Avant-hier",
        "pt": "Anteontem [a-vãn-ti-ÉR]"
      },
      {
        "en": "La semaine dernière",
        "pt": "Na semana passada [la sã-MÉN dér-NIÉR]"
      },
      {
        "en": "Le mois dernier / L'année dernière",
        "pt": "No mês passado / No ano passado [lã MUÁ dér-NIÊ / la-NÊ dér-NIÉR]"
      },
      {
        "en": "J'ai parlé / J'ai mangé",
        "pt": "Eu falei / Eu comi (verbos em -ER → -É) [jê par-LÊ / jê mãn-JÊ]"
      },
      {
        "en": "J'ai visité / J'ai acheté",
        "pt": "Eu visitei / Eu comprei [jê vi-zi-TÊ / jê a-chã-TÊ]"
      },
      {
        "en": "J'ai fini / J'ai choisi",
        "pt": "Eu terminei / Eu escolhi (verbos em -IR → -I) [jê fi-NI / jê chua-ZI]"
      },
      {
        "en": "J'ai fait",
        "pt": "Eu fiz (particípio de faire) [jê FÉ]"
      },
      {
        "en": "J'ai vu",
        "pt": "Eu vi / assisti (particípio de voir) [jê VÜ]"
      },
      {
        "en": "J'ai pris",
        "pt": "Eu tomei / peguei (particípio de prendre) [jê PRI]"
      },
      {
        "en": "J'ai bu / J'ai lu",
        "pt": "Eu bebi (boire) / Eu li (lire) [jê BÜ / jê LÜ]"
      },
      {
        "en": "J'ai eu / J'ai été",
        "pt": "Eu tive (avoir) / Eu fui ou estive (être) [jê Ü / jê e-TÊ]"
      },
      {
        "en": "Je suis allé(e)",
        "pt": "Eu fui (aller usa ÊTRE!) [jã suí za-LÊ]"
      },
      {
        "en": "Je suis arrivé(e) / parti(e)",
        "pt": "Eu cheguei / Eu parti (usam ÊTRE!) [jã suí za-ri-VÊ / par-TI]"
      },
      {
        "en": "Je suis venu(e) / rentré(e)",
        "pt": "Eu vim / Eu voltei para casa (usam ÊTRE!) [jã suí vã-NÜ / rãn-TRÊ]"
      },
      {
        "en": "Je suis resté(e)",
        "pt": "Eu fiquei / permaneci (usa ÊTRE!) [jã suí res-TÊ]"
      },
      {
        "en": "C'était magnifique !",
        "pt": "Foi magnífico / Estava incrível! [se-TÉ ma-nhi-FÍK!]"
      },
      {
        "en": "D'abord / Ensuite / Enfin",
        "pt": "Primeiro / Depois / Finalmente [da-BÓR / ãn-SUÍT / ãn-FÃ]"
      }
    ],
    "expressions": [
      {
        "expr": "Qu'est-ce que tu as fait hier / ce week-end ?",
        "meaning": "O que você fez ontem / neste fim de semana?",
        "example": "— Qu'est-ce que tu as fait ce week-end ? — Je suis allé à la plage et j'ai vu mes amis."
      },
      {
        "expr": "C'était super ! / C'était magnifique !",
        "meaning": "Foi ótimo! / Foi magnífico!",
        "example": "Nous avons dîné sur un bateau sur la Seine. C'était magnifique !"
      },
      {
        "expr": "J'ai passé une excellente journée !",
        "meaning": "Eu passei um dia excelente!",
        "example": "Merci pour tout, j'ai passé une excellente journée avec vous !"
      },
      {
        "expr": "D'abord... ensuite... enfin...",
        "meaning": "Primeiro... depois... finalmente...",
        "example": "D'abord, j'ai pris un café. Ensuite, j'ai visité le musée. Enfin, je suis rentré à l'hôtel."
      },
      {
        "expr": "On a beaucoup ri / On s'est bien amusés !",
        "meaning": "A gente riu muito / A gente se divertiu muito!",
        "example": "Hier soir, j'ai dîné avec Camille et Léo, on a beaucoup ri !"
      },
      {
        "expr": "Je n'ai pas eu le temps.",
        "meaning": "Eu não tive tempo.",
        "example": "Pardon, je n'ai pas eu le temps de répondre hier."
      }
    ],
    "sentences": [
      "Qu'est-ce que tu as fait ce week-end ?",
      "Hier, j'ai mangé une crêpe et j'ai bu un café.",
      "Samedi, je suis allé(e) au musée du Louvre.",
      "J'ai vu la Tour Eiffel et j'ai pris beaucoup de photos !",
      "D'abord nous avons déjeuné, ensuite nous sommes sortis.",
      "L'année dernière, elle est allée en France.",
      "Dimanche, je suis resté(e) à la maison et j'ai lu un livre.",
      "J'ai fini les douze leçons de français ! C'était super !",
      "Salut Yara ! Tu as passé un bon week-end à Paris ?",
      "Salut Camille ! Oui, c'était magnifique ! J'ai fait beaucoup de choses."
    ],
    "grammar": {
      "title": "A Fórmula do Passé Composé: [Auxiliar no Presente] + [Particípio]",
      "rules": [
        "<b>A Fórmula do Passé Composé: [Auxiliar no Presente] + [Particípio]:</b> Verbos terminados em -ER trocam -er por -É (mesmo som de -er [ê]!): parler → parlé, manger → mangé, visiter → visité. (Dica de pronúncia de ouro: \"manger\" (infinitivo) e \"mangé\" (particípio) têm EXATAMENTE o mesmo som [mãn-JÊ]! Quem diferencia é o \"J'ai\" antes!)",
        "<b>Quando Usar AVOIR vs. Quando Usar ÊTRE (A Casa do Être):</b> Com AVOIR (não muda no feminino/plural): Elle a mangé, nous avons visité, ils ont vu. (Na fala, \"allé\", \"allée\", \"allés\" e \"allées\" pronunciam-se TODOS iguais [a-LÊ]! A diferença aparece na escrita.)",
        "<b>A Negação no Passé Composé: \"Ne... pas\" Abraça o Auxiliar!:</b> Com avoir: Je n'ai pas compris (Eu não entendi) · Il n'a pas travaillé hier. (Fórmula da negativa: Sujeito + NE + (ai / suis) + PAS + particípio!)"
      ],
      "table": {
        "headers": [
          "Grupo de Verbos",
          "Auxiliar + Particípio",
          "Exemplo no Passé Composé"
        ],
        "rows": [
          [
            "Verbos em -ER → -É",
            "avoir + parlé / mangé / visité",
            "Hier, j'ai mangé une crêpe."
          ],
          [
            "Irregulares com AVOIR",
            "fait (faire), vu (voir), pris (prendre), bu (boire)",
            "J'ai vu la Tour Eiffel et j'ai pris des photos."
          ],
          [
            "Movimento com ÊTRE",
            "être + allé(e), venu(e), arrivé(e), parti(e)",
            "Samedi, je suis allé(e) au musée du Louvre."
          ],
          [
            "Negativa",
            "ne + auxiliar + pas + particípio",
            "Je n'ai pas compris · Je ne suis pas sorti(e)."
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como se diz \"Ontem eu comi um croissant\" em francês?",
        "a": "Hier, j'ai mangé un croissant.",
        "opts": [
          "Hier, j'ai mangé un croissant.",
          "Hier, je mangé un croissant.",
          "Hier, je suis mangé un croissant.",
          "Hier, je mange un croissant."
        ],
        "why": "O Passé Composé de \"manger\" forma-se com o auxiliar avoir no presente (\"j'ai\") + o particípio \"mangé\"."
      },
      {
        "q": "Qual verbo abaixo usa o auxiliar ÊTRE (\"je suis...\") no Passé Composé?",
        "a": "aller → je suis allé(e)",
        "opts": [
          "aller → je suis allé(e)",
          "manger → je suis mangé",
          "parler → je suis parlé",
          "finir → je suis fini"
        ],
        "why": "Verbos de deslocamento como \"aller\", \"venir\", \"arriver\", \"partir\" e \"rester\" usam o auxiliar ÊTRE!"
      },
      {
        "q": "Quais são os particípios passados corretos dos verbos irregulares \"faire\", \"voir\" e \"prendre\"?",
        "a": "fait / vu / pris",
        "opts": [
          "fait / vu / pris",
          "fairé / voiré / prendu",
          "fais / vois / prends",
          "fini / venu / parlé"
        ],
        "why": "Faire → fait (\"j'ai fait\"), voir → vu (\"j'ai vu\"), prendre → pris (\"j'ai pris\")."
      },
      {
        "q": "Uma mulher quer dizer \"Eu fui ao cinema ontem\". Como ela escreve corretamente em francês?",
        "a": "Je suis allée au cinéma hier.",
        "opts": [
          "Je suis allée au cinéma hier.",
          "J'ai allée au cinéma hier.",
          "Je suis allé au cinéma hier.",
          "Je vais allée au cinéma hier."
        ],
        "why": "Com o auxiliar ÊTRE, o particípio concorda com o sujeito: masculino = je suis allé; feminino = je suis allée (+e)!"
      },
      {
        "q": "Como se forma o particípio passado de TODOS os verbos terminados em \"-er\" (como parler, visiter, acheter)?",
        "a": "Troca-se \"-er\" por \"-é\" (parlé, visité, acheté)",
        "opts": [
          "Troca-se \"-er\" por \"-é\" (parlé, visité, acheté)",
          "Troca-se \"-er\" por \"-i\"",
          "Troca-se \"-er\" por \"-u\"",
          "Não muda nada"
        ],
        "why": "100% dos verbos terminados em \"-er\" formam o particípio passado com \"-é\" [ê]!"
      },
      {
        "q": "Como fica a frase \"J'ai compris\" na forma NEGATIVA (\"Eu não entendi\")?",
        "a": "Je n'ai pas compris.",
        "opts": [
          "Je n'ai pas compris.",
          "Je n'ai compris pas.",
          "Je pas ai compris.",
          "Je ne compris pas."
        ],
        "why": "No Passé Composé, \"ne... pas\" envolve o verbo auxiliar: Je n'ai pas compris!"
      },
      {
        "q": "O que significa a pergunta: \"Qu'est-ce que tu as fait ce week-end ?\"?",
        "a": "O que você fez neste fim de semana?",
        "opts": [
          "O que você fez neste fim de semana?",
          "O que você vai fazer na próxima semana?",
          "Como está o tempo neste fim de semana?",
          "Que horas você acorda no fim de semana?"
        ],
        "why": "\"Qu'est-ce que tu as fait... ?\" = O que você fez...?"
      },
      {
        "q": "Qual é o significado de \"C'était magnifique !\"?",
        "a": "Foi magnífico / Estava magnífico!",
        "opts": [
          "Foi magnífico / Estava magnífico!",
          "Será magnífico amanhã!",
          "Eu tenho um amigo magnífico!",
          "Eu vou ao museu!"
        ],
        "why": "\"C'était...\" é a forma ideal para dar sua opinião sobre como foi uma experiência no passado."
      },
      {
        "q": "Quais palavras significam \"Primeiro... depois... finalmente...\" para contar uma história?",
        "a": "D'abord... ensuite... enfin...",
        "opts": [
          "D'abord... ensuite... enfin...",
          "Hier... demain... midi...",
          "Mon... ton... son...",
          "Du... de la... des..."
        ],
        "why": "D'abord (primeiro), ensuite (em seguida/depois) e enfin (finalmente) conectam as ações em sequência."
      },
      {
        "q": "Complete: \"La semaine dernière, nous ___ visité le musée d'Orsay.\"",
        "a": "avons",
        "opts": [
          "avons",
          "sommes",
          "avez",
          "ont"
        ],
        "why": "O verbo \"visiter\" usa o auxiliar avoir: nous avons visité."
      }
    ],
    "speak": [
      "Qu'est-ce que tu as fait ce week-end ?",
      "Hier, j'ai mangé une crêpe et j'ai bu un café.",
      "Samedi, je suis allé(e) au musée du Louvre.",
      "J'ai vu la Tour Eiffel et j'ai pris beaucoup de photos !",
      "D'abord nous avons déjeuné, ensuite nous sommes sortis.",
      "L'année dernière, elle est allée en France.",
      "Dimanche, je suis resté(e) à la maison et j'ai lu un livre.",
      "J'ai fini les douze leçons de français ! C'était super !"
    ]
  }
];

if (typeof window !== 'undefined') window.LESSONS_FR = LESSONS_FR;
