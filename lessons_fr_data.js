// Capy Yara Adventures — French Daily-Trail Lessons (42 Units · IDs 201–242)
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
        "pt": "Olá / Bom dia"
      },
      {
        "en": "Bonsoir",
        "pt": "Boa tarde (fim do dia) / Boa noite"
      },
      {
        "en": "Bonne nuit",
        "pt": "Boa noite (ao dormir)"
      },
      {
        "en": "Salut",
        "pt": "Oi / Tchau (informal)"
      },
      {
        "en": "Au revoir",
        "pt": "Tchau / Até logo"
      },
      {
        "en": "À bientôt",
        "pt": "Até breve"
      },
      {
        "en": "À demain",
        "pt": "Até amanhã"
      },
      {
        "en": "Merci",
        "pt": "Obrigado(a)"
      },
      {
        "en": "De rien",
        "pt": "De nada"
      },
      {
        "en": "S'il vous plaît",
        "pt": "Por favor (formal)"
      },
      {
        "en": "S'il te plaît",
        "pt": "Por favor (informal)"
      },
      {
        "en": "Excusez-moi",
        "pt": "Com licença / Desculpe"
      },
      {
        "en": "Pardon",
        "pt": "Perdão / Com licença"
      },
      {
        "en": "Oui",
        "pt": "Sim"
      },
      {
        "en": "Non",
        "pt": "Não"
      },
      {
        "en": "Enchanté(e)",
        "pt": "Muito prazer"
      },
      {
        "en": "Monsieur",
        "pt": "Senhor"
      },
      {
        "en": "Madame",
        "pt": "Senhora"
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
        "<b>Segredos da Pronúncia Francesa para Brasileiros:</b> \"OU\" tem som de \"U\" brasileiro: Bonjour, vous, oui. (O \"U\" sozinho em francês (como em \"tu\" e \"salut\") é o famoso biquinho com som de \"I\"!)"
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
        "why": "\"S'il vous plaît\" é a forma educada (\"vous\") de dizer \"por favor\"."
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
        "why": "Em francês, \"OU\" tem o som exato do nosso \"U\" em português."
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
        "pt": "Um / Uma (1)"
      },
      {
        "en": "Deux",
        "pt": "Dois (2)"
      },
      {
        "en": "Trois",
        "pt": "Três (3)"
      },
      {
        "en": "Quatre",
        "pt": "Quatro (4)"
      },
      {
        "en": "Cinq",
        "pt": "Cinco (5)"
      },
      {
        "en": "Six",
        "pt": "Seis (6)"
      },
      {
        "en": "Sept",
        "pt": "Sete (7)"
      },
      {
        "en": "Huit",
        "pt": "Oito (8)"
      },
      {
        "en": "Neuf",
        "pt": "Nove (9)"
      },
      {
        "en": "Dix",
        "pt": "Dez (10)"
      },
      {
        "en": "Onze",
        "pt": "Onze (11)"
      },
      {
        "en": "Douze",
        "pt": "Doze (12)"
      },
      {
        "en": "Treize",
        "pt": "Treze (13)"
      },
      {
        "en": "Quatorze",
        "pt": "Quatorze (14)"
      },
      {
        "en": "Quinze",
        "pt": "Quinze (15)"
      },
      {
        "en": "Seize",
        "pt": "Dezesseis (16)"
      },
      {
        "en": "Dix-sept / Dix-huit",
        "pt": "Dezessete (17) / Dezoito (18)"
      },
      {
        "en": "Dix-neuf / Vingt",
        "pt": "Dezenove (19) / Vinte (20)"
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
        "<b>De 11 a 16 vs. 17 a 19 (Simples vs. Compostos):</b> 11 a 16 têm nomes próprios terminados em \"-ze\": onze, douze, treize, quatorze, quinze, seize. (No número 7 (sept), o \"p\" nunca é pronunciado, mas o \"t\" final soa forte!)",
        "<b>A Pronúncia de Six (6), Huit (8), Neuf (9) e Dix (10):</b> Sozinhos: six e dix soam o S/X final. Antes de consoante, o som final cai: six livres, dix cafés. (Essa costura sonora entre palavras chama-se \"liaison\" e é o que deixa seu francês com ritmo nativo!)",
        "<b>Dizer a Idade: Sempre com AVOIR + ANS:</b> J'ai vingt ans. / Elle a quinze ans. (Diferente do português onde podemos dizer \"Tenho 20\", em francês nunca omitimos \"ans\": J'ai vingt ans!)"
      ],
      "table": {
        "headers": [
          "Número",
          "Francês",
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
            "six, sept, huit, neuf, dix",
            "Le cours commence à huit heures."
          ],
          [
            "11 a 16",
            "onze, douze, treize, quatorze, quinze, seize",
            "Elle a seize ans."
          ],
          [
            "17 a 20",
            "dix-sept, dix-huit, dix-neuf, vingt",
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
        "why": "14 = quatorze, 15 = quinze, 16 = seize."
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
        "why": "12 (douze) + 8 (huit) = 20 (vingt)."
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
        "a": "O \"p\" é mudo e o \"t\" é pronunciado",
        "opts": [
          "O \"p\" é mudo e o \"t\" é pronunciado",
          "O \"t\" é mudo e o \"p\" é pronunciado",
          "Ambos são mudos",
          "Ambos são pronunciados"
        ],
        "why": "\"Sept\" pronuncia-se — o P desaparece na fala!"
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
        "a": "O X soa como Z",
        "opts": [
          "O X soa como Z",
          "O X soa como S",
          "O X soa como K",
          "O X fica mudo"
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
        "pt": "Vermelho(a)"
      },
      {
        "en": "Bleu / Bleue",
        "pt": "Azul"
      },
      {
        "en": "Vert / Verte",
        "pt": "Verde"
      },
      {
        "en": "Jaune",
        "pt": "Amarelo(a)"
      },
      {
        "en": "Blanc / Blanche",
        "pt": "Branco / Branca"
      },
      {
        "en": "Noir / Noire",
        "pt": "Preto / Preta"
      },
      {
        "en": "Gris / Grise",
        "pt": "Cinza"
      },
      {
        "en": "Rose",
        "pt": "Rosa"
      },
      {
        "en": "Orange",
        "pt": "Laranja (invariável!)"
      },
      {
        "en": "Violet / Violette",
        "pt": "Roxo / Violeta"
      },
      {
        "en": "Marron",
        "pt": "Marrom (invariável!)"
      },
      {
        "en": "Grand / Grande",
        "pt": "Grande / Alto(a)"
      },
      {
        "en": "Petit / Petite",
        "pt": "Pequeno(a) / Baixo(a)"
      },
      {
        "en": "Beau / Belle",
        "pt": "Bonito / Bonita"
      },
      {
        "en": "Joli / Jolie",
        "pt": "Bonitinho(a) / Lindo(a)"
      },
      {
        "en": "Clair",
        "pt": "Claro (tom de cor)"
      },
      {
        "en": "Foncé",
        "pt": "Escuro (tom de cor)"
      },
      {
        "en": "La couleur",
        "pt": "A cor"
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
        "<b>Feminino das Cores (Quando muda o som e quando não muda):</b> Ganham -E no feminino (e a consoante passa a soar!): vert → verte; gris → grise. (No masculino \"vert\" o T é mudo; no feminino \"verte\" o E faz o T ganhar voz!)",
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
            "vert",
            "verte",
            "un pull vert / une robe verte"
          ],
          [
            "blanc",
            "blanche",
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
        "why": "O feminino de \"blanc\" é \"blanche\": une maison blanche."
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
        "why": "Como \"la chemise\" é feminina, \"vert\" recebe \"-e\": une chemise verte."
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
        "pt": "A mãe / Mamãe"
      },
      {
        "en": "Le père / Papa",
        "pt": "O pai / Papai"
      },
      {
        "en": "Les parents",
        "pt": "Os pais (pai e mãe) / Parentes"
      },
      {
        "en": "Le frère",
        "pt": "O irmão"
      },
      {
        "en": "La sœur",
        "pt": "A irmã"
      },
      {
        "en": "Le fils",
        "pt": "O filho (pronuncia-se o S!)"
      },
      {
        "en": "La fille",
        "pt": "A filha / A menina"
      },
      {
        "en": "Les enfants",
        "pt": "Os filhos / As crianças"
      },
      {
        "en": "Le mari / La femme",
        "pt": "O marido / A esposa (ou mulher)"
      },
      {
        "en": "Le grand-père",
        "pt": "O avô"
      },
      {
        "en": "La grand-mère",
        "pt": "A avó"
      },
      {
        "en": "Les grands-parents",
        "pt": "Os avós"
      },
      {
        "en": "L'oncle",
        "pt": "O tio"
      },
      {
        "en": "La tante",
        "pt": "A tia"
      },
      {
        "en": "Le cousin / La cousine",
        "pt": "O primo / A prima"
      },
      {
        "en": "L'ami / L'amie",
        "pt": "O amigo / A amiga"
      },
      {
        "en": "Le chien / Le chat",
        "pt": "O cachorro / O gato"
      },
      {
        "en": "Fils / Fille unique",
        "pt": "Filho(a) único(a)"
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
        "<b>Os Possessivos: Mon / Ma / Mes (Meu, Minha, Meus/Minhas):</b> Masculino singular: mon père, mon frère, mon livre (meu) · ton (teu) · son (dele/dela). (No plural não há diferença entre masculino e feminino: \"mes frères\" e \"mes sœurs\" usam MES!)",
        "<b>A Regra de Ouro antes de Vogal: \"Mon amie\" (e NÃO \"Ma amie\"!):</b> Mon amie Camille (Minha amiga Camille — amie começa com A!). (Se a palavra feminina tiver um adjetivo consoante no meio, o \"ma\" volta: \"Ma bonne amie\" (Minha boa amiga)!)",
        "<b>Pronúncias Especiais da Família: Femme, Fils e Fille:</b> La femme (a esposa/mulher): o \"e\" tem som de A, mesmo escrito com E! (Guarde este trio sonoro: femme, fils, fille!)"
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
        "why": "No plural, \"mes\" serve tanto para o masculino quanto para o feminino!"
      },
      {
        "q": "Como se pronuncia a palavra \"femme\" (esposa / mulher) em francês?",
        "a": "O E soa como A",
        "opts": [
          "O E soa como A",
          "O E soa como Ê",
          "O E soa como I",
          "O E soa como Ô"
        ],
        "why": "Apesar de escrita com E, \"femme\" pronuncia-se!"
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
        "why": "\"Voici\" serve para apresentar pessoas ou apontar coisas (\"Voici ma famille !\")."
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
        "pt": "Eu sou / Eu estou"
      },
      {
        "en": "Tu es",
        "pt": "Você é / está (informal)"
      },
      {
        "en": "Il est / Elle est",
        "pt": "Ele(a) é / está"
      },
      {
        "en": "Nous sommes",
        "pt": "Nós somos / estamos"
      },
      {
        "en": "Vous êtes",
        "pt": "Vocês são/estão · O(a) sr(a) é/está"
      },
      {
        "en": "Ils sont / Elles sont",
        "pt": "Eles(as) são / estão"
      },
      {
        "en": "J'ai / Tu as / Il a",
        "pt": "Eu tenho / Tu tens / Ele tem"
      },
      {
        "en": "Nous avons / Vous avez / Ils ont",
        "pt": "Nós temos / Vocês têm / Eles têm"
      },
      {
        "en": "Avoir faim",
        "pt": "Estar com fome (lit. ter fome)"
      },
      {
        "en": "Avoir soif",
        "pt": "Estar com sede"
      },
      {
        "en": "Avoir froid / chaud",
        "pt": "Estar com frio / calor"
      },
      {
        "en": "Avoir sommeil",
        "pt": "Estar com sono"
      },
      {
        "en": "Avoir peur (de)",
        "pt": "Estar com medo (de)"
      },
      {
        "en": "Avoir raison / tort",
        "pt": "Ter razão / Estar errado(a)"
      },
      {
        "en": "Avoir besoin de",
        "pt": "Precisar de (ter necessidade de)"
      },
      {
        "en": "Avoir envie de",
        "pt": "Estar com vontade de"
      },
      {
        "en": "Fatigué(e)",
        "pt": "Cansado(a) (usa ÊTRE!)"
      },
      {
        "en": "Prêt(e) / Content(e)",
        "pt": "Pronto(a) / Feliz (usam ÊTRE!)"
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
        "<b>Être = Ser E Estar (Um verbo só para os dois!):</b> Identidade / profissão / nacionalidade: Je suis étudiant(e), elle est médecin. (Atenção à pronúncia de \"Ils sont\" (eles são — com S puro) vs. \"Ils ont\" (eles têm — com som de Z pela liaison!).)",
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
            "ils/elles sont ici",
            "ils/elles ont deux enfants"
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
        "a": "\"Ils sont\" tem som de S e \"Ils ont\" tem som de Z",
        "opts": [
          "\"Ils sont\" tem som de S e \"Ils ont\" tem som de Z",
          "Ambos têm som idêntico",
          "\"Ils sont\" tem som de Z e \"Ils ont\" tem som de S",
          "O \"s\" final é pronunciado nos dois"
        ],
        "why": "Em \"Ils ont\", o S de \"ils\" junta-se à vogal de \"ont\" produzindo som de Z!"
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
        "why": "A conjugação de \"être\" para \"vous\" é \"vous êtes\"."
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
        "pt": "O pão / A baguete"
      },
      {
        "en": "Le croissant",
        "pt": "O croissant"
      },
      {
        "en": "Le fromage",
        "pt": "O queijo"
      },
      {
        "en": "Le beurre",
        "pt": "A manteiga"
      },
      {
        "en": "Le poulet",
        "pt": "O frango"
      },
      {
        "en": "Le poisson",
        "pt": "O peixe"
      },
      {
        "en": "La viande",
        "pt": "A carne"
      },
      {
        "en": "La salade",
        "pt": "A salada"
      },
      {
        "en": "La soupe",
        "pt": "A sopa"
      },
      {
        "en": "Le riz / Les pâtes",
        "pt": "O arroz / O macarrão"
      },
      {
        "en": "L'eau (minérale / plate)",
        "pt": "A água (mineral / sem gás)"
      },
      {
        "en": "Le café / Le thé",
        "pt": "O café / O chá"
      },
      {
        "en": "Le lait",
        "pt": "O leite"
      },
      {
        "en": "Le jus d'orange",
        "pt": "O suco de laranja"
      },
      {
        "en": "Le gâteau / La crêpe",
        "pt": "O bolo / O crepe"
      },
      {
        "en": "Le petit-déjeuner",
        "pt": "O café da manhã"
      },
      {
        "en": "Le déjeuner / Le dîner",
        "pt": "O almoço / O jantar"
      },
      {
        "en": "L'addition",
        "pt": "A conta (no restaurante)"
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
        "why": "Mantemos o \"e\" depois do G em \"nous mangeons\" para preservar o som suave de J!"
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
        "pt": "Segunda-feira"
      },
      {
        "en": "Mardi",
        "pt": "Terça-feira"
      },
      {
        "en": "Mercredi",
        "pt": "Quarta-feira"
      },
      {
        "en": "Jeudi",
        "pt": "Quinta-feira"
      },
      {
        "en": "Vendredi",
        "pt": "Sexta-feira"
      },
      {
        "en": "Samedi",
        "pt": "Sábado"
      },
      {
        "en": "Dimanche",
        "pt": "Domingo"
      },
      {
        "en": "Janvier / Février",
        "pt": "Janeiro / Fevereiro"
      },
      {
        "en": "Mars / Avril",
        "pt": "Março / Abril (pronuncia-se o S e o L!)"
      },
      {
        "en": "Mai / Juin",
        "pt": "Maio / Junho"
      },
      {
        "en": "Juillet / Août",
        "pt": "Julho / Agosto"
      },
      {
        "en": "Septembre / Octobre",
        "pt": "Setembro / Outubro"
      },
      {
        "en": "Novembre / Décembre",
        "pt": "Novembro / Dezembro"
      },
      {
        "en": "Aujourd'hui",
        "pt": "Hoje"
      },
      {
        "en": "Demain / Hier",
        "pt": "Amanhã / Ontem"
      },
      {
        "en": "La semaine / Le week-end",
        "pt": "A semana / O fim de semana"
      },
      {
        "en": "Le mois / L'année",
        "pt": "O mês / O ano"
      },
      {
        "en": "Le premier (1er)",
        "pt": "Primeiro (dia 1º do mês)"
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
        "<b>Pronúncia de \"Mars\" (Março) e \"Août\" (Agosto):</b> Mars (março): o S final é bem claro. (No dia \"samedi\" (sábado), o E central é mudo: são duas sílabas!)"
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
            "Mon anniversaire est en août."
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
        "a": "O A é mudo e o T soa",
        "opts": [
          "O A é mudo e o T soa",
          "O A soa e o T fica mudo",
          "Soam o A, o U e o T",
          "Soa como \"ôt\""
        ],
        "why": "\"Août\" pronuncia-se, em uma única sílaba!"
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
        "pt": "Que horas são?"
      },
      {
        "en": "Il est une heure",
        "pt": "É uma hora (1h00)"
      },
      {
        "en": "Il est deux heures",
        "pt": "São duas horas"
      },
      {
        "en": "Il est midi",
        "pt": "É meio-dia (12h00)"
      },
      {
        "en": "Il est minuit",
        "pt": "É meia-noite (00h00)"
      },
      {
        "en": "Et quart",
        "pt": "E quinze (lit. e um quarto)"
      },
      {
        "en": "Et demie",
        "pt": "E meia (30 min)"
      },
      {
        "en": "Moins le quart",
        "pt": "Quinze para as... (lit. menos um quarto)"
      },
      {
        "en": "Pile",
        "pt": "Em ponto"
      },
      {
        "en": "Du matin",
        "pt": "Da manhã"
      },
      {
        "en": "De l'après-midi",
        "pt": "Da tarde"
      },
      {
        "en": "Du soir",
        "pt": "Da noite"
      },
      {
        "en": "À quelle heure... ?",
        "pt": "A que horas...?"
      },
      {
        "en": "Tôt / Tard",
        "pt": "Cedo / Tarde"
      },
      {
        "en": "Se réveiller / Se lever",
        "pt": "Acordar / Levantar-se"
      },
      {
        "en": "Se coucher",
        "pt": "Deitar-se / Ir dormir"
      },
      {
        "en": "En avance / En retard",
        "pt": "Adiantado(a) / Atrasado(a)"
      },
      {
        "en": "Rendez-vous",
        "pt": "Compromisso / Horário marcado / Encontro"
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
          "Em Francês (Sempre \"Il est...\")"
        ],
        "rows": [
          [
            "8h00 / 12h00 / 00h00",
            "Il est huit heures / midi / minuit"
          ],
          [
            "8h15",
            "Il est huit heures et quart"
          ],
          [
            "8h30",
            "Il est huit heures et demie"
          ],
          [
            "8h45",
            "Il est neuf heures moins le quart"
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
        "pt": "Como está o tempo?"
      },
      {
        "en": "Il fait beau",
        "pt": "O tempo está bom / bonito"
      },
      {
        "en": "Il fait mauvais",
        "pt": "O tempo está ruim / feio"
      },
      {
        "en": "Il fait chaud",
        "pt": "Está calor / quente"
      },
      {
        "en": "Il fait froid",
        "pt": "Está frio"
      },
      {
        "en": "Il fait frais / doux",
        "pt": "Está fresquinho / ameno"
      },
      {
        "en": "Il pleut / La pluie",
        "pt": "Está chovendo / A chuva"
      },
      {
        "en": "Il neige / La neige",
        "pt": "Está nevando / A neve"
      },
      {
        "en": "Il y a du soleil",
        "pt": "Está fazendo sol (há sol)"
      },
      {
        "en": "Il y a du vent",
        "pt": "Está ventando (há vento)"
      },
      {
        "en": "Il y a des nuages",
        "pt": "Está nublado (há nuvens)"
      },
      {
        "en": "Il y a de l'orage",
        "pt": "Há tempestade / trovoada"
      },
      {
        "en": "Le printemps",
        "pt": "A primavera (usa AU printemps!)"
      },
      {
        "en": "L'été",
        "pt": "O verão (usa EN été)"
      },
      {
        "en": "L'automne",
        "pt": "O outono (usa EN automne)"
      },
      {
        "en": "L'hiver",
        "pt": "O inverno (usa EN hiver)"
      },
      {
        "en": "Le parapluie",
        "pt": "O guarda-chuva"
      },
      {
        "en": "Les degrés",
        "pt": "Os graus (temperatura)"
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
        "<b>As Preposições das Estações: Por que \"AU printemps\" e \"EN été\"?:</b> Começam com som de vogal → usam EN: en été, en automne, en hiver. (Em \"l'hiver\", o R final é pronunciado! Já em \"l'automne\", o M é mudo e soa só o N!)",
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
        "a": "O H é mudo e o R final soa",
        "opts": [
          "O H é mudo e o R final soa",
          "O H é mudo e o R final também",
          "O H soa como R",
          "Termina em som de N"
        ],
        "why": "Diferente dos verbos em -er, o substantivo \"hiver\" tem o R final pronunciado."
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
        "pt": "Onde fica...?"
      },
      {
        "en": "À droite",
        "pt": "À direita"
      },
      {
        "en": "À gauche",
        "pt": "À esquerda"
      },
      {
        "en": "Tout droit",
        "pt": "Sempre em frente / Reto"
      },
      {
        "en": "Près de / À côté de",
        "pt": "Perto de / Ao lado de"
      },
      {
        "en": "Loin de",
        "pt": "Longe de"
      },
      {
        "en": "En face de",
        "pt": "Em frente a"
      },
      {
        "en": "Au coin de la rue",
        "pt": "Na esquina da rua"
      },
      {
        "en": "La gare / Le métro",
        "pt": "A estação de trem / O metrô"
      },
      {
        "en": "La boulangerie",
        "pt": "A padaria"
      },
      {
        "en": "La pharmacie / L'hôpital",
        "pt": "A farmácia / O hospital"
      },
      {
        "en": "Le musée / Le parc",
        "pt": "O museu / O parque"
      },
      {
        "en": "La banque / Le supermarché",
        "pt": "O banco / O supermercado"
      },
      {
        "en": "L'hôtel / L'aéroport",
        "pt": "O hotel / O aeroporto"
      },
      {
        "en": "Le pont / La place",
        "pt": "A ponte / A praça"
      },
      {
        "en": "Le feu rouge",
        "pt": "O semáforo / sinal"
      },
      {
        "en": "À pied / En métro / En bus",
        "pt": "A pé / De metrô / De ônibus"
      },
      {
        "en": "Ici / Là-bas",
        "pt": "Aqui / Logo ali (lá)"
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
        "<b>Dando Direções com Educação (Imperativo com Vous: -EZ):</b> Allez tout droit (Vá reto / Siga em frente). (Repare na diferença sonora: \"tout droit\" (masculino, T mudo) vs. \"à droite\" (feminino, T pronunciado)!)"
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
        "a": "Em \"tout droit\" o T final é mudo; em \"à droite\" o T é pronunciado",
        "opts": [
          "Em \"tout droit\" o T final é mudo; em \"à droite\" o T é pronunciado",
          "Ambos têm o T pronunciado",
          "Ambos têm o T mudo",
          "\"Tout droit\" significa à esquerda"
        ],
        "why": "O \"-e\" final em \"droite\" faz a consoante T soar claramente:!"
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
        "pt": "As roupas"
      },
      {
        "en": "Un pantalon / Un jean",
        "pt": "Uma calça / Uma calça jeans"
      },
      {
        "en": "Une chemise / Un t-shirt",
        "pt": "Uma camisa / Uma camiseta"
      },
      {
        "en": "Une robe / Une jupe",
        "pt": "Um vestido / Uma saia"
      },
      {
        "en": "Un pull",
        "pt": "Um suéter / blusa de lã"
      },
      {
        "en": "Un manteau / Une veste",
        "pt": "Um sobretudo (casaco longo) / Uma jaqueta (ou blazer)"
      },
      {
        "en": "Des chaussures / Des baskets",
        "pt": "Sapatos / Tênis"
      },
      {
        "en": "Des chaussettes",
        "pt": "Meias"
      },
      {
        "en": "Une écharpe / Un chapeau",
        "pt": "Um cachecol (lenço) / Um chapéu"
      },
      {
        "en": "Un sac / Des lunettes",
        "pt": "Uma bolsa (ou mochila) / Óculos"
      },
      {
        "en": "La taille / La pointure",
        "pt": "O tamanho (de roupa) / O número (de calçado)"
      },
      {
        "en": "La cabine d'essayage",
        "pt": "O provador"
      },
      {
        "en": "Cher / Pas cher",
        "pt": "Caro / Barato"
      },
      {
        "en": "Les soldes",
        "pt": "As liquidações / promoções"
      },
      {
        "en": "Par carte / En espèces",
        "pt": "No cartão / Em dinheiro vivo"
      },
      {
        "en": "Ce / Cet (masc. sing.)",
        "pt": "Este / Esse (antes de consoante / vogal)"
      },
      {
        "en": "Cette (fem. sing.)",
        "pt": "Esta / Essa"
      },
      {
        "en": "Ces (plural)",
        "pt": "Estes / Estas / Esses / Essas"
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
        "<b>Os Demonstrativos: CE, CET, CETTE, CES (Este/Esta/Estes/Estas):</b> Masculino singular + consoante (CE): ce pantalon, ce pull, ce manteau. (\"Cet\" (masc. antes de vogal) e \"Cette\" (feminino) têm exatamente a mesma pronúncia!)",
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
            "ce",
            "Masc. sing. + consoante",
            "ce pantalon, ce pull, ce manteau"
          ],
          [
            "cet",
            "Masc. sing. + vogal / H mudo",
            "cet imperméable, cet hôtel"
          ],
          [
            "cette",
            "Feminino singular (todas)",
            "cette robe, cette chemise, cette écharpe"
          ],
          [
            "ces",
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
        "why": "Antes de substantivo masculino singular iniciado por vogal ou H mudo, \"ce\" vira \"cet\"!"
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
        "why": "\"Ces\" é o único demonstrativo plural para masculino e feminino!"
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
        "pt": "Ontem"
      },
      {
        "en": "Avant-hier",
        "pt": "Anteontem"
      },
      {
        "en": "La semaine dernière",
        "pt": "Na semana passada"
      },
      {
        "en": "Le mois dernier / L'année dernière",
        "pt": "No mês passado / No ano passado"
      },
      {
        "en": "J'ai parlé / J'ai mangé",
        "pt": "Eu falei / Eu comi (verbos em -ER → -É)"
      },
      {
        "en": "J'ai visité / J'ai acheté",
        "pt": "Eu visitei / Eu comprei"
      },
      {
        "en": "J'ai fini / J'ai choisi",
        "pt": "Eu terminei / Eu escolhi (verbos em -IR → -I)"
      },
      {
        "en": "J'ai fait",
        "pt": "Eu fiz (particípio de faire)"
      },
      {
        "en": "J'ai vu",
        "pt": "Eu vi / assisti (particípio de voir)"
      },
      {
        "en": "J'ai pris",
        "pt": "Eu tomei / peguei (particípio de prendre)"
      },
      {
        "en": "J'ai bu / J'ai lu",
        "pt": "Eu bebi (boire) / Eu li (lire)"
      },
      {
        "en": "J'ai eu / J'ai été",
        "pt": "Eu tive (avoir) / Eu fui ou estive (être)"
      },
      {
        "en": "Je suis allé(e)",
        "pt": "Eu fui (aller usa ÊTRE!)"
      },
      {
        "en": "Je suis arrivé(e) / parti(e)",
        "pt": "Eu cheguei / Eu parti (usam ÊTRE!)"
      },
      {
        "en": "Je suis venu(e) / rentré(e)",
        "pt": "Eu vim / Eu voltei para casa (usam ÊTRE!)"
      },
      {
        "en": "Je suis resté(e)",
        "pt": "Eu fiquei / permaneci (usa ÊTRE!)"
      },
      {
        "en": "C'était magnifique !",
        "pt": "Foi magnífico / Estava incrível!"
      },
      {
        "en": "D'abord / Ensuite / Enfin",
        "pt": "Primeiro / Depois / Finalmente"
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
      "title": "A Fórmula do Passé Composé: +",
      "rules": [
        "<b>A Fórmula do Passé Composé: +:</b> Verbos terminados em -ER trocam -er por -É (mesmo som de -er!): parler → parlé, manger → mangé, visiter → visité. (Dica de pronúncia de ouro: \"manger\" (infinitivo) e \"mangé\" (particípio) têm EXATAMENTE o mesmo som! Quem diferencia é o \"J'ai\" antes!)",
        "<b>Quando Usar AVOIR vs. Quando Usar ÊTRE (A Casa do Être):</b> Com AVOIR (não muda no feminino/plural): Elle a mangé, nous avons visité, ils ont vu. (Na fala, \"allé\", \"allée\", \"allés\" e \"allées\" pronunciam-se TODOS iguais! A diferença aparece na escrita.)",
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
        "why": "100% dos verbos terminados em \"-er\" formam o particípio passado com \"-é\"!"
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
  },
  {
    "id": 213,
    "title": "Se Présenter avec Être & Avoir",
    "emoji": "🤝",
    "lang": "fr",
    "verbs": [
      "Être",
      "Avoir",
      "S'appeler",
      "Habiter",
      "Parler"
    ],
    "vocab": [
      {
        "en": "Je suis brésilien",
        "pt": "Eu sou brasileiro"
      },
      {
        "en": "Je suis brésilienne",
        "pt": "Eu sou brasileira"
      },
      {
        "en": "J'ai vingt ans",
        "pt": "Eu tenho vinte anos"
      },
      {
        "en": "Je suis étudiant",
        "pt": "Eu sou estudante (homem)"
      },
      {
        "en": "Je suis étudiante",
        "pt": "Eu sou estudante (mulher)"
      },
      {
        "en": "Je suis professeur",
        "pt": "Eu sou professor(a)"
      },
      {
        "en": "Vous êtes français ?",
        "pt": "O senhor é francês?"
      },
      {
        "en": "Tu es d'où ?",
        "pt": "De onde você é?"
      },
      {
        "en": "Je suis de São Paulo",
        "pt": "Eu sou de São Paulo"
      },
      {
        "en": "J'ai un accent",
        "pt": "Eu tenho sotaque"
      },
      {
        "en": "Enchanté",
        "pt": "Muito prazer (homem fala)"
      },
      {
        "en": "Enchantée",
        "pt": "Muito prazer (mulher fala)"
      },
      {
        "en": "Je suis marié",
        "pt": "Eu sou casado"
      },
      {
        "en": "Je suis célibataire",
        "pt": "Eu sou solteiro(a)"
      },
      {
        "en": "J'ai deux enfants",
        "pt": "Eu tenho dois filhos"
      },
      {
        "en": "Je suis content de vous connaître",
        "pt": "Fico feliz em conhecer o senhor"
      },
      {
        "en": "Tu as quel âge ?",
        "pt": "Quantos anos você tem?"
      },
      {
        "en": "Je n'ai pas de frères",
        "pt": "Eu não tenho irmãos"
      }
    ],
    "expressions": [
      {
        "expr": "Je suis ravi(e) de faire votre connaissance",
        "meaning": "Estou encantado(a) em conhecer o senhor",
        "example": "Bonjour, je suis Paula. Je suis ravie de faire votre connaissance !"
      },
      {
        "expr": "Tu as quel âge ?",
        "meaning": "Quantos anos você tem? (com avoir!)",
        "example": "— Tu as quel âge ? — J'ai vingt-cinq ans."
      },
      {
        "expr": "Je suis d'origine…",
        "meaning": "Eu sou de origem…",
        "example": "Je suis d'origine italienne, mais je suis né à Curitiba."
      },
      {
        "expr": "Vous êtes ici en vacances ?",
        "meaning": "O senhor está aqui de férias?",
        "example": "— Vous êtes ici en vacances ? — Non, je suis ici pour le travail."
      },
      {
        "expr": "J'ai l'habitude de…",
        "meaning": "Eu tenho o costume de…",
        "example": "J'ai l'habitude de parler anglais au travail."
      },
      {
        "expr": "Je suis en train d'apprendre le français",
        "meaning": "Estou aprendendo francês (agora)",
        "example": "Je suis en train d'apprendre le français avec Yara !"
      }
    ],
    "sentences": [
      "Bonjour, je suis Lucas et je suis brésilien.",
      "J'ai trente ans et je suis ingénieur.",
      "Tu es d'où ? Tu as un petit accent.",
      "Elle est française, elle a un accent parisien.",
      "Nous sommes étudiants et nous avons cours le lundi.",
      "Vous êtes marié ? Vous avez des enfants ?",
      "Je suis célibataire et je n'ai pas d'enfants.",
      "Enchantée ! Je suis la nouvelle collègue.",
      "Il a dix-huit ans, il est très jeune.",
      "Je suis content d'être ici avec vous."
    ],
    "grammar": {
      "title": "Apresentar-se: ÊTRE para quem você é, AVOIR para a idade",
      "rules": [
        "<b>Profissão e nacionalidade com ÊTRE:</b> Je suis professeur · Je suis brésilienne. Em francês não se usa artigo antes da profissão: \"Je suis médecin\", nunca \"Je suis un médecin\".",
        "<b>A idade sempre com AVOIR:</b> \"J'ai vingt ans\" (literalmente \"eu tenho vinte anos\", igual ao português). Nunca \"Je suis vingt ans\", que é o erro de quem pensa em inglês.",
        "<b>Masculino e feminino:</b> A nacionalidade concorda com quem fala: brésilien → brésilienne, français → française, étudiant → étudiante. \"Enchanté\" ganha um E quando é uma mulher que fala: \"Enchantée\"."
      ],
      "table": {
        "headers": [
          "Informação",
          "Verbo",
          "Exemplo"
        ],
        "rows": [
          [
            "Nome",
            "S'appeler / Être",
            "Je m'appelle Ana · Je suis Ana"
          ],
          [
            "Nacionalidade",
            "Être",
            "Je suis brésilienne"
          ],
          [
            "Profissão",
            "Être (sem artigo)",
            "Il est médecin"
          ],
          [
            "Idade",
            "Avoir",
            "J'ai vingt-deux ans"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como se diz \"Eu tenho vinte anos\"?",
        "a": "J'ai vingt ans.",
        "opts": [
          "Je suis vingt ans.",
          "J'ai vingt ans.",
          "Je vingt ans.",
          "J'ai vingt années vieux."
        ],
        "why": "A idade em francês usa AVOIR: \"J'ai vingt ans\"."
      },
      {
        "q": "Complete: \"Elle ___ brésilienne.\"",
        "a": "est",
        "opts": [
          "a",
          "es",
          "est",
          "sont"
        ],
        "why": "Nacionalidade usa ÊTRE: \"elle est\"."
      },
      {
        "q": "Qual frase está certa para dizer a profissão?",
        "a": "Je suis médecin.",
        "opts": [
          "Je suis un médecin.",
          "J'ai médecin.",
          "Je médecin.",
          "Je suis médecin."
        ],
        "why": "Com ÊTRE, a profissão vem sem artigo."
      },
      {
        "q": "Uma mulher acaba de conhecer alguém. Ela diz:",
        "a": "Enchantée !",
        "opts": [
          "Enchantée !",
          "Enchanté !",
          "Enchantés !",
          "Enchanter !"
        ],
        "why": "Quando quem fala é mulher, \"enchanté\" ganha um E: \"enchantée\"."
      },
      {
        "q": "Como perguntar a idade de um amigo?",
        "a": "Tu as quel âge ?",
        "opts": [
          "Tu es quel âge ?",
          "Tu as quel âge ?",
          "Quel âge tu es ?",
          "Tu as quel ans ?"
        ],
        "why": "Idade com AVOIR: \"Tu as quel âge ?\"."
      },
      {
        "q": "Complete: \"Nous ___ étudiants.\"",
        "a": "sommes",
        "opts": [
          "avons",
          "êtes",
          "sommes",
          "sont"
        ],
        "why": "\"Nous sommes\" é o presente de ÊTRE para \"nós\"."
      },
      {
        "q": "\"Eu não tenho filhos\" é:",
        "a": "Je n'ai pas d'enfants.",
        "opts": [
          "Je ne suis pas d'enfants.",
          "Je n'ai pas des enfants.",
          "J'ai pas enfants.",
          "Je n'ai pas d'enfants."
        ],
        "why": "Na negação, \"des\" vira \"de\" (d' antes de vogal): \"pas d'enfants\"."
      },
      {
        "q": "\"Vous êtes d'où ?\" significa:",
        "a": "De onde o senhor é?",
        "opts": [
          "De onde o senhor é?",
          "Onde o senhor está?",
          "Quem é o senhor?",
          "Quantos anos o senhor tem?"
        ],
        "why": "\"D'où\" = de onde. \"Vous êtes d'où ?\" pergunta a origem."
      },
      {
        "q": "Complete: \"Il ___ dix-huit ans.\"",
        "a": "a",
        "opts": [
          "est",
          "a",
          "as",
          "ont"
        ],
        "why": "Idade com AVOIR: \"il a dix-huit ans\"."
      },
      {
        "q": "Qual frase diz \"Estou aprendendo francês (neste momento)\"?",
        "a": "Je suis en train d'apprendre le français.",
        "opts": [
          "J'ai en train d'apprendre le français.",
          "Je suis apprendre le français.",
          "Je suis en train d'apprendre le français.",
          "J'apprends en train le français."
        ],
        "why": "\"Être en train de + infinitivo\" = estar fazendo algo agora."
      }
    ],
    "speak": [
      "Bonjour ! Je suis brésilien et j'ai vingt-huit ans.",
      "Je suis étudiante et je suis de Belo Horizonte.",
      "Tu as quel âge ? Moi, j'ai trente ans.",
      "Enchantée ! Je suis ravie de faire votre connaissance.",
      "Je suis marié et j'ai deux enfants.",
      "Vous êtes d'où ? Vous avez un bel accent.",
      "Je suis en train d'apprendre le français.",
      "Il est ingénieur et il a beaucoup de travail."
    ]
  },
  {
    "id": 214,
    "title": "Les Chiffres avec Avoir",
    "emoji": "🔢",
    "lang": "fr",
    "verbs": [
      "Avoir",
      "Être",
      "Coûter",
      "Compter",
      "Payer"
    ],
    "vocab": [
      {
        "en": "J'ai quinze ans",
        "pt": "Eu tenho quinze anos"
      },
      {
        "en": "Il y a",
        "pt": "Há / Tem (existe)"
      },
      {
        "en": "Il y a trois pommes",
        "pt": "Há três maçãs"
      },
      {
        "en": "Ça fait combien ?",
        "pt": "Quanto dá?"
      },
      {
        "en": "C'est combien ?",
        "pt": "Quanto é?"
      },
      {
        "en": "J'ai dix euros",
        "pt": "Eu tenho dez euros"
      },
      {
        "en": "Je n'ai pas de monnaie",
        "pt": "Não tenho troco"
      },
      {
        "en": "Nous sommes quatre",
        "pt": "Somos quatro (pessoas)"
      },
      {
        "en": "Vous êtes combien ?",
        "pt": "Vocês são quantos?"
      },
      {
        "en": "C'est cher",
        "pt": "É caro"
      },
      {
        "en": "C'est pas cher",
        "pt": "Não é caro (fala informal)"
      },
      {
        "en": "Il a douze ans",
        "pt": "Ele tem doze anos"
      },
      {
        "en": "Une table pour deux",
        "pt": "Uma mesa para dois"
      },
      {
        "en": "Le numéro de téléphone",
        "pt": "O número de telefone"
      },
      {
        "en": "Il n'y a plus de pain",
        "pt": "Não tem mais pão"
      },
      {
        "en": "La moitié",
        "pt": "A metade"
      },
      {
        "en": "Le double",
        "pt": "O dobro"
      },
      {
        "en": "J'ai le numéro sept",
        "pt": "Eu tenho o número sete"
      }
    ],
    "expressions": [
      {
        "expr": "Vous êtes combien ?",
        "meaning": "Vocês são quantos? (no restaurante)",
        "example": "— Bonsoir, vous êtes combien ? — Nous sommes trois."
      },
      {
        "expr": "Il y a combien de… ?",
        "meaning": "Há quantos…? / Quantos … tem?",
        "example": "Il y a combien d'élèves dans la classe ?"
      },
      {
        "expr": "Ça fait combien en tout ?",
        "meaning": "Quanto dá no total?",
        "example": "Deux cafés et un croissant, ça fait combien en tout ?"
      },
      {
        "expr": "Je n'ai pas de monnaie",
        "meaning": "Não tenho trocado",
        "example": "Désolé, je n'ai pas de monnaie, j'ai un billet de cinquante."
      },
      {
        "expr": "C'est mon tour",
        "meaning": "É a minha vez",
        "example": "Excusez-moi, j'ai le numéro dix, c'est mon tour !"
      },
      {
        "expr": "Il n'y a plus de…",
        "meaning": "Não tem mais…",
        "example": "Il n'y a plus de baguettes, désolé !"
      }
    ],
    "sentences": [
      "J'ai seize ans et ma sœur a douze ans.",
      "Il y a vingt élèves dans la classe.",
      "Bonsoir ! Nous sommes quatre, s'il vous plaît.",
      "C'est combien, le café ? — Deux euros.",
      "Je n'ai pas de monnaie, je suis désolé.",
      "Il y a trois boulangeries dans ma rue.",
      "Mon numéro, c'est le zéro six, douze, quinze, dix-huit, vingt.",
      "Ça fait combien en tout ? — Ça fait onze euros.",
      "Il n'y a plus de croissants ce matin.",
      "Vous êtes combien dans votre famille ?"
    ],
    "grammar": {
      "title": "Números com AVOIR e o \"il y a\" que conta o que existe",
      "rules": [
        "<b>Idade e posse com AVOIR:</b> \"J'ai quinze ans\" (idade) · \"J'ai dix euros\" (o que eu tenho). O número vem logo depois do verbo.",
        "<b>\"Il y a\" = há / tem:</b> Para dizer o que existe num lugar: \"Il y a vingt élèves\" (há vinte alunos). Não muda no plural: \"il y a un livre\", \"il y a dix livres\".",
        "<b>\"Nous sommes quatre\":</b> Para dizer quantas pessoas são, o francês usa ÊTRE: \"Nous sommes quatre\" (somos quatro). No restaurante: \"Vous êtes combien ?\"."
      ],
      "table": {
        "headers": [
          "Situação",
          "Estrutura",
          "Exemplo"
        ],
        "rows": [
          [
            "Idade",
            "Avoir + número + ans",
            "Il a douze ans"
          ],
          [
            "O que existe",
            "Il y a + número",
            "Il y a trois pommes"
          ],
          [
            "Quantas pessoas",
            "Être + número",
            "Nous sommes quatre"
          ],
          [
            "Preço",
            "C'est / Ça fait + preço",
            "Ça fait onze euros"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como dizer \"Há vinte alunos\"?",
        "a": "Il y a vingt élèves.",
        "opts": [
          "Il est vingt élèves.",
          "Il a vingt élèves.",
          "Il y a vingt élèves.",
          "Ils sont vingt élèves."
        ],
        "why": "\"Il y a\" diz o que existe num lugar."
      },
      {
        "q": "No restaurante, o garçom pergunta quantas pessoas são vocês:",
        "a": "Vous êtes combien ?",
        "opts": [
          "Vous avez combien ?",
          "Il y a combien vous ?",
          "Combien vous avez ?",
          "Vous êtes combien ?"
        ],
        "why": "Para pessoas num grupo, usa-se ÊTRE: \"Vous êtes combien ?\"."
      },
      {
        "q": "Responda: \"Nós somos três.\"",
        "a": "Nous sommes trois.",
        "opts": [
          "Nous sommes trois.",
          "Nous avons trois.",
          "Il y a trois nous.",
          "Nous sont trois."
        ],
        "why": "\"Nous sommes trois\" = somos três."
      },
      {
        "q": "\"Ma sœur ___ douze ans.\"",
        "a": "a",
        "opts": [
          "est",
          "a",
          "ai",
          "y a"
        ],
        "why": "Idade com AVOIR: \"elle a douze ans\"."
      },
      {
        "q": "\"Não tenho troco\" é:",
        "a": "Je n'ai pas de monnaie.",
        "opts": [
          "Je ne suis pas de monnaie.",
          "Il n'y a pas monnaie moi.",
          "Je n'ai pas de monnaie.",
          "Je n'ai pas la monnaie de."
        ],
        "why": "Negação com avoir: \"je n'ai pas de…\"."
      },
      {
        "q": "\"Il n'y a plus de pain\" significa:",
        "a": "Não tem mais pão.",
        "opts": [
          "Tem mais pão.",
          "Não gosto de pão.",
          "Ele não tem pão.",
          "Não tem mais pão."
        ],
        "why": "\"Il n'y a plus de…\" = não há mais…"
      },
      {
        "q": "Qual é o plural de \"il y a un livre\"?",
        "a": "Il y a deux livres.",
        "opts": [
          "Il y a deux livres.",
          "Ils y ont deux livres.",
          "Il y ont deux livres.",
          "Il sont deux livres."
        ],
        "why": "\"Il y a\" não muda no plural."
      },
      {
        "q": "\"Ça fait combien en tout ?\" serve para perguntar:",
        "a": "O total a pagar",
        "opts": [
          "A idade de alguém",
          "O total a pagar",
          "Quantas pessoas há",
          "O número de telefone"
        ],
        "why": "\"En tout\" = no total."
      },
      {
        "q": "Complete: \"J'___ le numéro sept, c'est mon tour.\"",
        "a": "ai",
        "opts": [
          "suis",
          "a",
          "ai",
          "y a"
        ],
        "why": "\"J'ai le numéro sept\" = estou com a senha sete."
      },
      {
        "q": "\"C'est pas cher\" é:",
        "a": "Uma forma informal de \"não é caro\"",
        "opts": [
          "Uma pergunta sobre o preço",
          "Um erro: tem que ser \"Il est pas cher\"",
          "Uma forma de dizer \"é caro\"",
          "Uma forma informal de \"não é caro\""
        ],
        "why": "Na fala, o \"ne\" cai: \"c'est pas cher\" = \"ce n'est pas cher\"."
      }
    ],
    "speak": [
      "J'ai vingt ans et mon frère a quinze ans.",
      "Il y a trois pommes et deux bananes.",
      "Bonsoir, nous sommes quatre, s'il vous plaît.",
      "Ça fait combien en tout ?",
      "Désolé, je n'ai pas de monnaie.",
      "Il n'y a plus de pain à la boulangerie.",
      "Vous êtes combien dans votre famille ?",
      "C'est pas cher, c'est seulement trois euros !"
    ]
  },
  {
    "id": 215,
    "title": "Les Couleurs avec Être & Avoir",
    "emoji": "🎨",
    "lang": "fr",
    "verbs": [
      "Être",
      "Avoir",
      "Porter",
      "Préférer",
      "Décrire"
    ],
    "vocab": [
      {
        "en": "La voiture est rouge",
        "pt": "O carro é vermelho"
      },
      {
        "en": "La maison est blanche",
        "pt": "A casa é branca"
      },
      {
        "en": "Le ciel est bleu",
        "pt": "O céu é azul"
      },
      {
        "en": "J'ai les yeux verts",
        "pt": "Eu tenho olhos verdes"
      },
      {
        "en": "Elle a les yeux marron",
        "pt": "Ela tem olhos castanhos"
      },
      {
        "en": "Il a les cheveux noirs",
        "pt": "Ele tem cabelo preto"
      },
      {
        "en": "Elle a les cheveux blonds",
        "pt": "Ela tem cabelo loiro"
      },
      {
        "en": "Les fleurs sont jaunes",
        "pt": "As flores são amarelas"
      },
      {
        "en": "Mon sac est gris",
        "pt": "Minha bolsa é cinza"
      },
      {
        "en": "Ma robe est violette",
        "pt": "Meu vestido é roxo"
      },
      {
        "en": "Les chaussures sont noires",
        "pt": "Os sapatos são pretos"
      },
      {
        "en": "Il est roux",
        "pt": "Ele é ruivo"
      },
      {
        "en": "Elle est brune",
        "pt": "Ela é morena"
      },
      {
        "en": "Clair",
        "pt": "Claro (cor)"
      },
      {
        "en": "Foncé",
        "pt": "Escuro (cor)"
      },
      {
        "en": "Bleu clair",
        "pt": "Azul-claro"
      },
      {
        "en": "Vert foncé",
        "pt": "Verde-escuro"
      },
      {
        "en": "De quelle couleur est… ?",
        "pt": "De que cor é…?"
      }
    ],
    "expressions": [
      {
        "expr": "De quelle couleur est… ?",
        "meaning": "De que cor é…?",
        "example": "De quelle couleur est ta voiture ? — Elle est rouge."
      },
      {
        "expr": "Avoir les yeux…",
        "meaning": "Ter olhos… (cor dos olhos com avoir)",
        "example": "Mon père a les yeux bleus, comme moi."
      },
      {
        "expr": "Avoir les cheveux…",
        "meaning": "Ter cabelo… (cor do cabelo com avoir)",
        "example": "Ma sœur a les cheveux longs et blonds."
      },
      {
        "expr": "Être tout rouge",
        "meaning": "Ficar vermelho (de vergonha)",
        "example": "Quand il parle en public, il est tout rouge !"
      },
      {
        "expr": "Voir la vie en rose",
        "meaning": "Ver a vida cor-de-rosa (ser otimista)",
        "example": "Elle est toujours contente, elle voit la vie en rose."
      },
      {
        "expr": "Être vert de peur",
        "meaning": "Ficar verde de medo",
        "example": "Pendant le film d'horreur, j'étais vert de peur !"
      }
    ],
    "sentences": [
      "Ma voiture est blanche et la voiture de Paul est noire.",
      "J'ai les yeux marron et les cheveux noirs.",
      "De quelle couleur est ton sac ? — Il est gris.",
      "Les fleurs du jardin sont jaunes et rouges.",
      "Elle a les cheveux blonds et les yeux bleus.",
      "Ma robe préférée est violette.",
      "Le ciel est gris aujourd'hui, il va pleuvoir.",
      "Les chaussures sont noires, mais la ceinture est marron.",
      "Mon fils est roux, il a les cheveux comme son grand-père.",
      "Je préfère le bleu clair au bleu foncé."
    ],
    "grammar": {
      "title": "Cor de coisa com ÊTRE, cor de olho e cabelo com AVOIR",
      "rules": [
        "<b>Coisa + ÊTRE + cor:</b> \"La voiture est rouge\" (o carro é vermelho). A cor concorda com a coisa: \"La maison est blanche\", \"Les sacs sont noirs\".",
        "<b>Olhos e cabelo com AVOIR:</b> O francês diz \"eu TENHO os olhos verdes\": \"J'ai les yeux verts\", \"Il a les cheveux noirs\". Sempre com o artigo \"les\".",
        "<b>Cores que não mudam:</b> \"Marron\" e \"orange\" não mudam no feminino nem no plural: \"des chaussures marron\". E cor composta também não: \"une robe bleu clair\"."
      ],
      "table": {
        "headers": [
          "O que descrever",
          "Estrutura",
          "Exemplo"
        ],
        "rows": [
          [
            "Um objeto",
            "Nome + être + cor",
            "Le sac est gris"
          ],
          [
            "Os olhos",
            "Avoir + les yeux + cor",
            "J'ai les yeux verts"
          ],
          [
            "O cabelo",
            "Avoir + les cheveux + cor",
            "Elle a les cheveux blonds"
          ],
          [
            "A pessoa",
            "Être + roux / brun / blond",
            "Il est roux"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Como dizer \"Eu tenho olhos verdes\"?",
        "a": "J'ai les yeux verts.",
        "opts": [
          "Je suis les yeux verts.",
          "J'ai des verts yeux.",
          "Mes yeux ont verts.",
          "J'ai les yeux verts."
        ],
        "why": "Cor dos olhos com AVOIR + \"les yeux\"."
      },
      {
        "q": "Complete: \"La maison ___ blanche.\"",
        "a": "est",
        "opts": [
          "est",
          "a",
          "sont",
          "ont"
        ],
        "why": "Cor de objeto com ÊTRE."
      },
      {
        "q": "Qual é o feminino certo de \"blanc\"?",
        "a": "blanche",
        "opts": [
          "blanque",
          "blanche",
          "blance",
          "blancs"
        ],
        "why": "Blanc → blanche (irregular)."
      },
      {
        "q": "\"Elle ___ les cheveux blonds.\"",
        "a": "a",
        "opts": [
          "est",
          "ai",
          "a",
          "as"
        ],
        "why": "Cabelo com AVOIR: \"elle a les cheveux…\"."
      },
      {
        "q": "Qual está certo?",
        "a": "Des chaussures marron.",
        "opts": [
          "Des chaussures marrons.",
          "Des chaussures marronnes.",
          "Des marron chaussures.",
          "Des chaussures marron."
        ],
        "why": "\"Marron\" não varia."
      },
      {
        "q": "\"De quelle couleur est ta voiture ?\" significa:",
        "a": "De que cor é o seu carro?",
        "opts": [
          "De que cor é o seu carro?",
          "Onde está o seu carro?",
          "Você gosta do seu carro?",
          "Qual é o seu carro?"
        ],
        "why": "\"De quelle couleur\" = de que cor."
      },
      {
        "q": "\"Les fleurs ___ jaunes.\"",
        "a": "sont",
        "opts": [
          "est",
          "sont",
          "ont",
          "a"
        ],
        "why": "Plural \"les fleurs\" → \"sont\"."
      },
      {
        "q": "\"Il est tout rouge\" pode significar:",
        "a": "Ele está vermelho de vergonha.",
        "opts": [
          "Ele é todo vermelho de nascença.",
          "Ele tem um carro vermelho.",
          "Ele está vermelho de vergonha.",
          "Ele está com raiva do vermelho."
        ],
        "why": "Expressão: ficar vermelho (de vergonha ou calor)."
      },
      {
        "q": "Como dizer \"um vestido azul-claro\"?",
        "a": "Une robe bleu clair.",
        "opts": [
          "Une robe bleue claire.",
          "Une robe claire bleue.",
          "Une bleu clair robe.",
          "Une robe bleu clair."
        ],
        "why": "Cor composta não varia."
      },
      {
        "q": "\"Voir la vie en rose\" é:",
        "a": "Ser otimista",
        "opts": [
          "Ser otimista",
          "Gostar de flores",
          "Estar triste",
          "Usar roupa rosa"
        ],
        "why": "Ver a vida cor-de-rosa = ser otimista."
      }
    ],
    "speak": [
      "J'ai les yeux marron et les cheveux noirs.",
      "Ma voiture est blanche, et la tienne ?",
      "De quelle couleur est ton sac préféré ?",
      "Elle a les cheveux blonds et les yeux bleus.",
      "Les chaussures sont noires et la ceinture est marron.",
      "Je préfère le vert foncé au vert clair.",
      "Quand je parle en public, je suis tout rouge !",
      "Ma sœur est toujours contente, elle voit la vie en rose."
    ]
  },
  {
    "id": 216,
    "title": "La Famille avec Être & Avoir",
    "emoji": "👨‍👩‍👧",
    "lang": "fr",
    "verbs": [
      "Avoir",
      "Être",
      "S'appeler",
      "Habiter",
      "Ressembler"
    ],
    "vocab": [
      {
        "en": "J'ai un frère",
        "pt": "Eu tenho um irmão"
      },
      {
        "en": "J'ai une sœur",
        "pt": "Eu tenho uma irmã"
      },
      {
        "en": "Je n'ai pas de sœur",
        "pt": "Não tenho irmã"
      },
      {
        "en": "Mon père est médecin",
        "pt": "Meu pai é médico"
      },
      {
        "en": "Ma mère est gentille",
        "pt": "Minha mãe é gentil"
      },
      {
        "en": "Mes parents sont divorcés",
        "pt": "Meus pais são divorciados"
      },
      {
        "en": "Je suis fils unique",
        "pt": "Sou filho único"
      },
      {
        "en": "Je suis fille unique",
        "pt": "Sou filha única"
      },
      {
        "en": "Mon frère aîné",
        "pt": "Meu irmão mais velho"
      },
      {
        "en": "Ma petite sœur",
        "pt": "Minha irmã mais nova"
      },
      {
        "en": "Les grands-parents",
        "pt": "Os avós"
      },
      {
        "en": "Elle a trois enfants",
        "pt": "Ela tem três filhos"
      },
      {
        "en": "Il est marié avec Julie",
        "pt": "Ele é casado com a Julie"
      },
      {
        "en": "Mon cousin",
        "pt": "Meu primo"
      },
      {
        "en": "Ma tante",
        "pt": "Minha tia"
      },
      {
        "en": "Mon oncle est drôle",
        "pt": "Meu tio é engraçado"
      },
      {
        "en": "Nous sommes une grande famille",
        "pt": "Somos uma família grande"
      },
      {
        "en": "Il ressemble à son père",
        "pt": "Ele se parece com o pai"
      }
    ],
    "expressions": [
      {
        "expr": "Avoir un air de famille",
        "meaning": "Ter um ar de família (se parecer)",
        "example": "Ton frère et toi, vous avez un air de famille !"
      },
      {
        "expr": "Être fils unique / fille unique",
        "meaning": "Ser filho(a) único(a)",
        "example": "Je suis fille unique, je n'ai pas de frères ni de sœurs."
      },
      {
        "expr": "Vous êtes combien de frères et sœurs ?",
        "meaning": "Vocês são quantos irmãos?",
        "example": "— Vous êtes combien de frères et sœurs ? — Nous sommes trois."
      },
      {
        "expr": "C'est tout le portrait de son père",
        "meaning": "É a cara do pai",
        "example": "Regarde le bébé, c'est tout le portrait de son père !"
      },
      {
        "expr": "Être proche de quelqu'un",
        "meaning": "Ser próximo de alguém",
        "example": "Je suis très proche de ma grand-mère."
      },
      {
        "expr": "Avoir de la famille à…",
        "meaning": "Ter parentes em…",
        "example": "J'ai de la famille à Lyon, mes cousins habitent là-bas."
      }
    ],
    "sentences": [
      "J'ai un frère et deux sœurs.",
      "Mon père est médecin et ma mère est professeure.",
      "Je suis fils unique, je n'ai pas de frères.",
      "Ma grand-mère a quatre-vingts ans, elle est très active.",
      "Mes parents sont mariés depuis trente ans.",
      "Mon frère aîné a deux enfants.",
      "Nous sommes une grande famille, nous sommes neuf !",
      "Mon oncle est très drôle, il a toujours des histoires.",
      "Ma cousine habite à Paris, elle est architecte.",
      "Tu as un air de famille avec ta mère."
    ],
    "grammar": {
      "title": "Família: AVOIR para quem você tem, ÊTRE para como eles são",
      "rules": [
        "<b>Quem eu tenho: AVOIR:</b> \"J'ai un frère\", \"Elle a trois enfants\". Na negação, o artigo vira \"de\": \"Je n'ai pas de sœur\".",
        "<b>Como eles são: ÊTRE:</b> \"Mon père est médecin\", \"Ma mère est gentille\", \"Mes parents sont divorcés\". O adjetivo concorda: gentil → gentille.",
        "<b>Quantos somos: ÊTRE:</b> Para contar a família, o francês usa ÊTRE: \"Nous sommes cinq\". Pergunta: \"Vous êtes combien de frères et sœurs ?\"."
      ],
      "table": {
        "headers": [
          "Ideia",
          "Verbo",
          "Exemplo"
        ],
        "rows": [
          [
            "Ter parentes",
            "Avoir",
            "J'ai deux cousins"
          ],
          [
            "Não ter",
            "Ne… pas de",
            "Je n'ai pas de frère"
          ],
          [
            "Descrever",
            "Être + adjetivo",
            "Ma tante est drôle"
          ],
          [
            "Contar",
            "Être + número",
            "Nous sommes cinq"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu tenho uma irmã\" é:",
        "a": "J'ai une sœur.",
        "opts": [
          "J'ai une sœur.",
          "Je suis une sœur.",
          "J'ai un sœur.",
          "Je une sœur ai."
        ],
        "why": "Ter parente: AVOIR. \"Sœur\" é feminino: \"une\"."
      },
      {
        "q": "Negue: \"J'ai un frère.\"",
        "a": "Je n'ai pas de frère.",
        "opts": [
          "Je n'ai pas un frère.",
          "Je n'ai pas de frère.",
          "Je ne suis pas de frère.",
          "J'ai pas un de frère."
        ],
        "why": "Na negação, \"un/une/des\" vira \"de\"."
      },
      {
        "q": "Complete: \"Mes parents ___ divorcés.\"",
        "a": "sont",
        "opts": [
          "ont",
          "est",
          "sont",
          "sommes"
        ],
        "why": "\"Mes parents\" = ils → \"sont\"."
      },
      {
        "q": "Qual frase significa \"Sou filha única\"?",
        "a": "Je suis fille unique.",
        "opts": [
          "J'ai fille unique.",
          "Je suis une unique fille.",
          "Je fille unique.",
          "Je suis fille unique."
        ],
        "why": "\"Être fils/fille unique\"."
      },
      {
        "q": "\"Ma mère est ___.\" (gentil)",
        "a": "gentille",
        "opts": [
          "gentille",
          "gentil",
          "gentile",
          "gentils"
        ],
        "why": "Feminino de gentil: gentille."
      },
      {
        "q": "Como perguntar \"Vocês são quantos irmãos?\"",
        "a": "Vous êtes combien de frères et sœurs ?",
        "opts": [
          "Vous avez combien frères et sœurs ?",
          "Vous êtes combien de frères et sœurs ?",
          "Combien vous êtes frères ?",
          "Vous êtes quels frères et sœurs ?"
        ],
        "why": "Contar pessoas: ÊTRE + combien."
      },
      {
        "q": "\"Ma grand-mère ___ quatre-vingts ans.\"",
        "a": "a",
        "opts": [
          "est",
          "ont",
          "a",
          "as"
        ],
        "why": "Idade com AVOIR."
      },
      {
        "q": "\"Il ressemble à son père\" significa:",
        "a": "Ele se parece com o pai.",
        "opts": [
          "Ele mora com o pai.",
          "Ele fala com o pai.",
          "Ele é o pai.",
          "Ele se parece com o pai."
        ],
        "why": "\"Ressembler à\" = parecer-se com."
      },
      {
        "q": "\"Mon frère aîné\" é:",
        "a": "Meu irmão mais velho",
        "opts": [
          "Meu irmão mais velho",
          "Meu irmão mais novo",
          "Meu meio-irmão",
          "Meu irmão gêmeo"
        ],
        "why": "\"Aîné\" = mais velho."
      },
      {
        "q": "\"J'ai de la famille à Lyon\" significa:",
        "a": "Tenho parentes em Lyon.",
        "opts": [
          "Moro com minha família em Lyon.",
          "Tenho parentes em Lyon.",
          "Minha família é de Lyon.",
          "Vou visitar Lyon com a família."
        ],
        "why": "\"Avoir de la famille à…\" = ter parentes em…"
      }
    ],
    "speak": [
      "J'ai un frère et une sœur.",
      "Mon père est médecin et ma mère est architecte.",
      "Je suis fils unique, je n'ai pas de frères.",
      "Nous sommes une grande famille, nous sommes sept.",
      "Ma grand-mère a quatre-vingt-dix ans !",
      "Mon oncle est très drôle.",
      "Vous êtes combien de frères et sœurs ?",
      "Tu as un air de famille avec ton père."
    ]
  },
  {
    "id": 217,
    "title": "Sensations : Avoir faim, Être fatigué",
    "emoji": "🌡️",
    "lang": "fr",
    "verbs": [
      "Avoir",
      "Être",
      "Sentir",
      "Dormir",
      "Manger"
    ],
    "vocab": [
      {
        "en": "J'ai faim",
        "pt": "Estou com fome"
      },
      {
        "en": "J'ai soif",
        "pt": "Estou com sede"
      },
      {
        "en": "J'ai chaud",
        "pt": "Estou com calor"
      },
      {
        "en": "J'ai froid",
        "pt": "Estou com frio"
      },
      {
        "en": "J'ai peur",
        "pt": "Estou com medo"
      },
      {
        "en": "J'ai sommeil",
        "pt": "Estou com sono"
      },
      {
        "en": "J'ai mal à la tête",
        "pt": "Estou com dor de cabeça"
      },
      {
        "en": "J'ai mal au ventre",
        "pt": "Estou com dor de barriga"
      },
      {
        "en": "J'ai de la fièvre",
        "pt": "Estou com febre"
      },
      {
        "en": "Je suis fatigué",
        "pt": "Estou cansado"
      },
      {
        "en": "Je suis malade",
        "pt": "Estou doente"
      },
      {
        "en": "Je suis content",
        "pt": "Estou contente / feliz"
      },
      {
        "en": "Je suis triste",
        "pt": "Estou triste"
      },
      {
        "en": "Je suis stressé",
        "pt": "Estou estressado"
      },
      {
        "en": "Je suis en forme",
        "pt": "Estou em forma / bem-disposto"
      },
      {
        "en": "Je suis enrhumé",
        "pt": "Estou resfriado"
      },
      {
        "en": "J'ai la grippe",
        "pt": "Estou com gripe"
      },
      {
        "en": "Je suis en colère",
        "pt": "Estou com raiva"
      }
    ],
    "expressions": [
      {
        "expr": "J'ai une faim de loup",
        "meaning": "Estou morrendo de fome (fome de lobo)",
        "example": "On mange ? J'ai une faim de loup !"
      },
      {
        "expr": "Je suis mort de fatigue",
        "meaning": "Estou morto de cansaço",
        "example": "Après le travail, je suis mort de fatigue."
      },
      {
        "expr": "Ça va, tu n'as pas froid ?",
        "meaning": "Tudo bem, você não está com frio?",
        "example": "Ça va, tu n'as pas froid ? Prends mon pull."
      },
      {
        "expr": "J'ai mal partout",
        "meaning": "Estou com dor no corpo todo",
        "example": "Après le sport, j'ai mal partout !"
      },
      {
        "expr": "Je ne suis pas dans mon assiette",
        "meaning": "Não estou nos meus dias (não estou bem)",
        "example": "Aujourd'hui, je ne suis pas dans mon assiette."
      },
      {
        "expr": "Avoir la flemme",
        "meaning": "Estar com preguiça (informal)",
        "example": "J'ai la flemme de faire la vaisselle."
      }
    ],
    "sentences": [
      "J'ai faim, on va manger ?",
      "Il fait trente degrés, j'ai très chaud.",
      "Je suis fatigué, je vais dormir.",
      "Tu as froid ? Ferme la fenêtre.",
      "Elle a peur des chiens.",
      "J'ai mal à la tête depuis ce matin.",
      "Il est malade, il a de la fièvre.",
      "Nous sommes contents d'être en vacances !",
      "Les enfants ont sommeil, il est tard.",
      "Je ne suis pas dans mon assiette aujourd'hui."
    ],
    "grammar": {
      "title": "Sensação do corpo com AVOIR, estado com ÊTRE",
      "rules": [
        "<b>O corpo sente: AVOIR + nome:</b> Fome, sede, calor, frio, medo, sono e dor usam AVOIR: \"J'ai faim\", \"J'ai froid\", \"J'ai mal à la tête\". Nunca \"Je suis faim\".",
        "<b>O estado: ÊTRE + adjetivo:</b> Cansado, doente, feliz, triste usam ÊTRE: \"Je suis fatigué\", \"Elle est malade\". O adjetivo concorda: fatiguée, contentes.",
        "<b>\"Avoir mal à\" + parte do corpo:</b> À + le = au, à + les = aux: \"J'ai mal au ventre\", \"J'ai mal aux pieds\", \"J'ai mal à la gorge\"."
      ],
      "table": {
        "headers": [
          "Sensação",
          "Em francês",
          "Verbo"
        ],
        "rows": [
          [
            "Fome / Sede",
            "J'ai faim / J'ai soif",
            "Avoir"
          ],
          [
            "Calor / Frio",
            "J'ai chaud / J'ai froid",
            "Avoir"
          ],
          [
            "Cansado / Doente",
            "Je suis fatigué / malade",
            "Être"
          ],
          [
            "Dor",
            "J'ai mal à la tête",
            "Avoir mal à"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Estou com fome\" é:",
        "a": "J'ai faim.",
        "opts": [
          "Je suis faim.",
          "J'ai faim.",
          "J'ai fameux.",
          "Je faim."
        ],
        "why": "Fome usa AVOIR: \"j'ai faim\"."
      },
      {
        "q": "\"Estou cansada\" (mulher) é:",
        "a": "Je suis fatiguée.",
        "opts": [
          "J'ai fatiguée.",
          "Je suis fatigué.",
          "Je suis fatiguée.",
          "J'ai fatigue."
        ],
        "why": "Estado com ÊTRE, e o adjetivo concorda: fatiguée."
      },
      {
        "q": "Complete: \"J'ai mal ___ ventre.\"",
        "a": "au",
        "opts": [
          "à le",
          "à la",
          "aux",
          "au"
        ],
        "why": "À + le = au."
      },
      {
        "q": "\"Elle ___ peur des chiens.\"",
        "a": "a",
        "opts": [
          "a",
          "est",
          "as",
          "ont"
        ],
        "why": "Medo com AVOIR."
      },
      {
        "q": "\"Il fait froid, j'___ froid.\"",
        "a": "ai",
        "opts": [
          "suis",
          "ai",
          "a",
          "fais"
        ],
        "why": "O tempo usa \"il fait\", a pessoa usa \"j'ai froid\"."
      },
      {
        "q": "\"Je suis enrhumé\" significa:",
        "a": "Estou resfriado.",
        "opts": [
          "Estou com raiva.",
          "Estou com sono.",
          "Estou resfriado.",
          "Estou em forma."
        ],
        "why": "\"Enrhumé\" = resfriado."
      },
      {
        "q": "\"Nous ___ contents.\"",
        "a": "sommes",
        "opts": [
          "avons",
          "sont",
          "êtes",
          "sommes"
        ],
        "why": "Estado com ÊTRE: \"nous sommes\"."
      },
      {
        "q": "\"J'ai une faim de loup\" quer dizer:",
        "a": "Estou com muita fome.",
        "opts": [
          "Estou com muita fome.",
          "Tenho medo de lobo.",
          "Comi demais.",
          "Estou com pouca fome."
        ],
        "why": "Exagero: fome de lobo."
      },
      {
        "q": "Como dizer \"Os meus pés doem\"?",
        "a": "J'ai mal aux pieds.",
        "opts": [
          "J'ai mal à les pieds.",
          "J'ai mal aux pieds.",
          "Je suis mal aux pieds.",
          "J'ai mal au pieds."
        ],
        "why": "À + les = aux."
      },
      {
        "q": "\"Je ne suis pas dans mon assiette\" significa:",
        "a": "Não estou bem hoje.",
        "opts": [
          "Não estou com fome.",
          "Não estou em casa.",
          "Não estou bem hoje.",
          "Não lavei o prato."
        ],
        "why": "Expressão: não estar nos seus dias."
      }
    ],
    "speak": [
      "J'ai faim et j'ai soif !",
      "Je suis fatigué, je vais dormir.",
      "Tu as froid ? Prends ma veste.",
      "J'ai mal à la tête depuis ce matin.",
      "Elle est malade, elle a de la fièvre.",
      "Nous sommes contents, ce sont les vacances !",
      "Après le sport, j'ai mal partout.",
      "J'ai une faim de loup, on mange ?"
    ]
  },
  {
    "id": 218,
    "title": "Au Café avec Être & Avoir",
    "emoji": "🥐",
    "lang": "fr",
    "verbs": [
      "Avoir",
      "Être",
      "Prendre",
      "Vouloir",
      "Commander"
    ],
    "vocab": [
      {
        "en": "J'ai envie d'un café",
        "pt": "Estou com vontade de um café"
      },
      {
        "en": "Vous avez du pain ?",
        "pt": "Vocês têm pão?"
      },
      {
        "en": "Il y a du fromage",
        "pt": "Tem queijo"
      },
      {
        "en": "Je suis végétarien",
        "pt": "Sou vegetariano"
      },
      {
        "en": "Je suis allergique aux noix",
        "pt": "Sou alérgico a nozes"
      },
      {
        "en": "C'est délicieux",
        "pt": "Está delicioso"
      },
      {
        "en": "Le plat du jour",
        "pt": "O prato do dia"
      },
      {
        "en": "Vous avez choisi ?",
        "pt": "Já escolheram?"
      },
      {
        "en": "Je suis prêt à commander",
        "pt": "Estou pronto para pedir"
      },
      {
        "en": "L'addition, s'il vous plaît",
        "pt": "A conta, por favor"
      },
      {
        "en": "C'est pour moi",
        "pt": "É para mim (e: eu pago)"
      },
      {
        "en": "Il est trop salé",
        "pt": "Está salgado demais"
      },
      {
        "en": "Elle est bien chaude",
        "pt": "Está bem quente"
      },
      {
        "en": "Nous n'avons plus de tarte",
        "pt": "Não temos mais torta"
      },
      {
        "en": "Une carafe d'eau",
        "pt": "Uma jarra de água"
      },
      {
        "en": "Un verre de vin rouge",
        "pt": "Uma taça de vinho tinto"
      },
      {
        "en": "Sans sucre",
        "pt": "Sem açúcar"
      },
      {
        "en": "J'ai assez mangé",
        "pt": "Já comi o bastante"
      }
    ],
    "expressions": [
      {
        "expr": "Avoir envie de…",
        "meaning": "Ter vontade de…",
        "example": "J'ai envie d'une crêpe au chocolat."
      },
      {
        "expr": "Vous avez choisi ?",
        "meaning": "Já escolheram? (o garçom pergunta)",
        "example": "— Vous avez choisi ? — Oui, je prends le plat du jour."
      },
      {
        "expr": "C'est pour moi !",
        "meaning": "Esta é por minha conta!",
        "example": "Non, non, rangez votre carte, c'est pour moi !"
      },
      {
        "expr": "Je suis au régime",
        "meaning": "Estou de dieta",
        "example": "Pas de dessert pour moi, je suis au régime."
      },
      {
        "expr": "Vous avez de la place ?",
        "meaning": "Vocês têm lugar? (mesa)",
        "example": "Bonjour, vous avez de la place pour deux ?"
      },
      {
        "expr": "Je n'ai plus faim",
        "meaning": "Não estou mais com fome",
        "example": "Merci, c'était très bon, mais je n'ai plus faim."
      }
    ],
    "sentences": [
      "J'ai envie d'un café et d'un croissant.",
      "Vous avez du pain sans gluten ?",
      "Je suis végétarienne, il y a un plat sans viande ?",
      "Le plat du jour, c'est quoi ?",
      "C'est délicieux ! Le chef est excellent.",
      "Je suis allergique aux crevettes.",
      "Vous avez choisi ? — Oui, nous sommes prêts.",
      "Désolé, nous n'avons plus de tarte aux pommes.",
      "La soupe est trop salée.",
      "L'addition, s'il vous plaît. C'est pour moi !"
    ],
    "grammar": {
      "title": "No café: AVOIR para ter e ter vontade, ÊTRE para como você é",
      "rules": [
        "<b>Perguntar o que tem: \"Vous avez… ?\":</b> \"Vous avez du pain ?\", \"Vous avez de la place ?\". Resposta negativa: \"Nous n'avons plus de…\" (não temos mais).",
        "<b>Vontade: \"avoir envie de\":</b> \"J'ai envie d'un café\" (de + um nome) ou \"J'ai envie de manger\" (de + verbo). Antes de vogal, \"de\" vira \"d'\".",
        "<b>Restrições com ÊTRE:</b> \"Je suis végétarien(ne)\", \"Je suis allergique à…\", \"Je suis au régime\". A comida também é descrita com ÊTRE: \"C'est délicieux\", \"La soupe est trop salée\"."
      ],
      "table": {
        "headers": [
          "Situação",
          "Frase",
          "Verbo"
        ],
        "rows": [
          [
            "Perguntar se tem",
            "Vous avez du pain ?",
            "Avoir"
          ],
          [
            "Vontade",
            "J'ai envie d'un café",
            "Avoir envie de"
          ],
          [
            "Restrição",
            "Je suis végétarien",
            "Être"
          ],
          [
            "Opinião",
            "C'est délicieux",
            "Être"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Estou com vontade de um café\" é:",
        "a": "J'ai envie d'un café.",
        "opts": [
          "Je suis envie d'un café.",
          "J'ai envie un café.",
          "J'ai envie d'un café.",
          "Je veux envie café."
        ],
        "why": "\"Avoir envie de\" + nome."
      },
      {
        "q": "Como perguntar \"Vocês têm pão?\"",
        "a": "Vous avez du pain ?",
        "opts": [
          "Vous êtes du pain ?",
          "Vous avez le pain de ?",
          "Il y a vous pain ?",
          "Vous avez du pain ?"
        ],
        "why": "Ter = AVOIR, com o partitivo \"du\"."
      },
      {
        "q": "\"Sou vegetariana\" é:",
        "a": "Je suis végétarienne.",
        "opts": [
          "Je suis végétarienne.",
          "J'ai végétarienne.",
          "Je suis végétarien.",
          "J'ai végétarien."
        ],
        "why": "Restrição com ÊTRE, no feminino: végétarienne."
      },
      {
        "q": "\"Nous n'avons plus de tarte\" significa:",
        "a": "Não temos mais torta.",
        "opts": [
          "Temos muita torta.",
          "Não temos mais torta.",
          "Não gostamos de torta.",
          "Queremos mais torta."
        ],
        "why": "\"Ne… plus\" = não… mais."
      },
      {
        "q": "O garçom pergunta \"Vous avez choisi ?\". Isso quer dizer:",
        "a": "Já escolheram?",
        "opts": [
          "Vocês têm troco?",
          "Vocês estão satisfeitos?",
          "Já escolheram?",
          "Vocês têm reserva?"
        ],
        "why": "\"Choisir\" = escolher."
      },
      {
        "q": "\"C'est pour moi !\" ao pagar significa:",
        "a": "É por minha conta!",
        "opts": [
          "Isso é meu prato.",
          "Eu não quero.",
          "Pode trazer para mim.",
          "É por minha conta!"
        ],
        "why": "Quem diz isso paga a conta."
      },
      {
        "q": "Complete: \"La soupe ___ trop salée.\"",
        "a": "est",
        "opts": [
          "est",
          "a",
          "ai",
          "ont"
        ],
        "why": "Descrever a comida: ÊTRE."
      },
      {
        "q": "\"Je suis allergique ___ noix.\"",
        "a": "aux",
        "opts": [
          "au",
          "aux",
          "à les",
          "de"
        ],
        "why": "Allergique à + les = aux."
      },
      {
        "q": "\"Je n'ai plus faim\" significa:",
        "a": "Não estou mais com fome.",
        "opts": [
          "Estou com mais fome.",
          "Nunca tenho fome.",
          "Não estou mais com fome.",
          "Tenho fome de novo."
        ],
        "why": "\"Ne… plus\" com avoir faim."
      },
      {
        "q": "Como dizer \"Estou de dieta\"?",
        "a": "Je suis au régime.",
        "opts": [
          "J'ai au régime.",
          "Je suis en régime de.",
          "J'ai le régime.",
          "Je suis au régime."
        ],
        "why": "Expressão: être au régime."
      }
    ],
    "speak": [
      "J'ai envie d'un café et d'un croissant.",
      "Vous avez du pain sans gluten ?",
      "Je suis végétarien, il y a un plat sans viande ?",
      "C'est délicieux, merci beaucoup !",
      "Je suis allergique aux noix.",
      "L'addition, s'il vous plaît. C'est pour moi !",
      "Pas de dessert pour moi, je suis au régime.",
      "Merci, c'était très bon, mais je n'ai plus faim."
    ]
  },
  {
    "id": 219,
    "title": "L'Agenda avec Être & Avoir",
    "emoji": "📅",
    "lang": "fr",
    "verbs": [
      "Être",
      "Avoir",
      "Commencer",
      "Fêter",
      "Planifier"
    ],
    "vocab": [
      {
        "en": "Nous sommes lundi",
        "pt": "Hoje é segunda-feira"
      },
      {
        "en": "On est le quinze mars",
        "pt": "Hoje é quinze de março"
      },
      {
        "en": "C'est mon anniversaire",
        "pt": "É o meu aniversário"
      },
      {
        "en": "J'ai rendez-vous",
        "pt": "Tenho um compromisso / consulta"
      },
      {
        "en": "J'ai un rendez-vous chez le médecin",
        "pt": "Tenho consulta no médico"
      },
      {
        "en": "Je suis libre samedi",
        "pt": "Estou livre no sábado"
      },
      {
        "en": "Je suis occupé",
        "pt": "Estou ocupado"
      },
      {
        "en": "J'ai cours le mardi",
        "pt": "Tenho aula às terças"
      },
      {
        "en": "J'ai une réunion",
        "pt": "Tenho uma reunião"
      },
      {
        "en": "Le week-end",
        "pt": "O fim de semana"
      },
      {
        "en": "La semaine prochaine",
        "pt": "A semana que vem"
      },
      {
        "en": "Le mois dernier",
        "pt": "O mês passado"
      },
      {
        "en": "Il y a une fête vendredi",
        "pt": "Tem uma festa na sexta"
      },
      {
        "en": "Les vacances sont en juillet",
        "pt": "As férias são em julho"
      },
      {
        "en": "C'est férié",
        "pt": "É feriado"
      },
      {
        "en": "J'ai le temps",
        "pt": "Tenho tempo"
      },
      {
        "en": "Je n'ai pas le temps",
        "pt": "Não tenho tempo"
      },
      {
        "en": "Un jour de congé",
        "pt": "Um dia de folga"
      }
    ],
    "expressions": [
      {
        "expr": "On est quel jour aujourd'hui ?",
        "meaning": "Que dia é hoje?",
        "example": "— On est quel jour aujourd'hui ? — On est mercredi."
      },
      {
        "expr": "Tu es libre ce soir ?",
        "meaning": "Você está livre hoje à noite?",
        "example": "Tu es libre ce soir ? Il y a un concert."
      },
      {
        "expr": "J'ai un empêchement",
        "meaning": "Tive um imprevisto",
        "example": "Désolé, je ne viens pas demain, j'ai un empêchement."
      },
      {
        "expr": "C'est noté !",
        "meaning": "Anotado!",
        "example": "Rendez-vous jeudi à dix heures ? — C'est noté !"
      },
      {
        "expr": "Je suis complètement débordé",
        "meaning": "Estou completamente atolado de trabalho",
        "example": "Cette semaine, je suis complètement débordé."
      },
      {
        "expr": "Bon anniversaire !",
        "meaning": "Feliz aniversário!",
        "example": "Bon anniversaire ! Tu as quel âge aujourd'hui ?"
      }
    ],
    "sentences": [
      "Nous sommes jeudi, le douze avril.",
      "C'est mon anniversaire le vingt mai.",
      "J'ai rendez-vous chez le dentiste mardi.",
      "Tu es libre samedi après-midi ?",
      "Je suis occupé lundi, mais mercredi j'ai le temps.",
      "Il y a une réunion à neuf heures.",
      "Lundi, c'est férié, je n'ai pas cours.",
      "Mes vacances sont en août cette année.",
      "J'ai un empêchement, on change le rendez-vous ?",
      "Elle a trente ans le mois prochain."
    ],
    "grammar": {
      "title": "Datas com ÊTRE, compromissos com AVOIR",
      "rules": [
        "<b>Que dia é: ÊTRE:</b> \"Nous sommes lundi\" ou, mais falado, \"On est lundi\". A data: \"On est le quinze mars\" (com \"le\", sem \"de\").",
        "<b>Compromissos: AVOIR:</b> \"J'ai rendez-vous\", \"J'ai une réunion\", \"J'ai cours le mardi\". Disponibilidade com ÊTRE: \"Je suis libre\", \"Je suis occupé\".",
        "<b>Dias sem preposição:</b> \"Samedi\" = neste sábado. \"Le samedi\" = todo sábado. \"J'ai cours le mardi\" = tenho aula às terças (sempre)."
      ],
      "table": {
        "headers": [
          "Pergunta",
          "Resposta",
          "Verbo"
        ],
        "rows": [
          [
            "On est quel jour ?",
            "On est vendredi",
            "Être"
          ],
          [
            "Tu es libre ?",
            "Non, je suis occupé",
            "Être"
          ],
          [
            "Tu as le temps ?",
            "Oui, j'ai le temps",
            "Avoir"
          ],
          [
            "C'est quand, ton anniversaire ?",
            "C'est le vingt mai",
            "Être"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Hoje é segunda\" é:",
        "a": "Nous sommes lundi.",
        "opts": [
          "Nous avons lundi.",
          "Il y a lundi.",
          "Nous sommes le lundi de.",
          "Nous sommes lundi."
        ],
        "why": "O dia da semana com ÊTRE: \"nous sommes / on est lundi\"."
      },
      {
        "q": "\"Tenho consulta no médico\" é:",
        "a": "J'ai rendez-vous chez le médecin.",
        "opts": [
          "J'ai rendez-vous chez le médecin.",
          "Je suis rendez-vous chez le médecin.",
          "J'ai rendez-vous au le médecin.",
          "Il y a rendez-vous moi médecin."
        ],
        "why": "Compromisso com AVOIR. Na casa ou consultório de alguém: \"chez\"."
      },
      {
        "q": "Complete: \"Tu ___ libre ce soir ?\"",
        "a": "es",
        "opts": [
          "as",
          "es",
          "est",
          "êtes"
        ],
        "why": "Disponibilidade com ÊTRE: \"tu es libre\"."
      },
      {
        "q": "\"J'ai cours le mardi\" significa:",
        "a": "Tenho aula toda terça.",
        "opts": [
          "Tenho aula nesta terça só.",
          "Não tenho aula na terça.",
          "Tenho aula toda terça.",
          "Tive aula na terça."
        ],
        "why": "\"Le mardi\" = toda terça."
      },
      {
        "q": "Como dizer a data \"15 de março\"?",
        "a": "On est le quinze mars.",
        "opts": [
          "On est quinze de mars.",
          "On a le quinze mars.",
          "On est mars quinze.",
          "On est le quinze mars."
        ],
        "why": "Data: le + número + mês, sem \"de\"."
      },
      {
        "q": "\"Je n'ai pas le temps\" significa:",
        "a": "Não tenho tempo.",
        "opts": [
          "Não tenho tempo.",
          "Não está fazendo tempo bom.",
          "Não sei a hora.",
          "Não estou com pressa."
        ],
        "why": "\"Le temps\" aqui é tempo disponível."
      },
      {
        "q": "\"J'ai un empêchement\" serve para:",
        "a": "Avisar que surgiu um imprevisto",
        "opts": [
          "Marcar um encontro",
          "Avisar que surgiu um imprevisto",
          "Pedir a conta",
          "Dizer que está doente"
        ],
        "why": "Empêchement = imprevisto."
      },
      {
        "q": "\"C'est férié\" significa:",
        "a": "É feriado.",
        "opts": [
          "É fim de semana.",
          "É meu aniversário.",
          "É feriado.",
          "É dia de folga do chefe."
        ],
        "why": "\"Férié\" = feriado."
      },
      {
        "q": "Complete: \"Elle ___ trente ans le mois prochain.\"",
        "a": "a",
        "opts": [
          "est",
          "sera",
          "ont",
          "a"
        ],
        "why": "Idade com AVOIR."
      },
      {
        "q": "\"Je suis débordé\" significa:",
        "a": "Estou atolado de coisas para fazer.",
        "opts": [
          "Estou atolado de coisas para fazer.",
          "Estou de folga.",
          "Estou atrasado.",
          "Estou de férias."
        ],
        "why": "Débordé = transbordando de trabalho."
      }
    ],
    "speak": [
      "Aujourd'hui, nous sommes lundi.",
      "C'est mon anniversaire le vingt mai !",
      "J'ai rendez-vous chez le dentiste jeudi.",
      "Tu es libre samedi soir ?",
      "Je suis occupé lundi, mais mercredi j'ai le temps.",
      "J'ai cours le mardi et le jeudi.",
      "Désolé, j'ai un empêchement.",
      "Cette semaine, je suis complètement débordé."
    ]
  },
  {
    "id": 220,
    "title": "L'Heure avec Être & Avoir",
    "emoji": "⏰",
    "lang": "fr",
    "verbs": [
      "Être",
      "Avoir",
      "Arriver",
      "Partir",
      "Se dépêcher"
    ],
    "vocab": [
      {
        "en": "Il est huit heures",
        "pt": "São oito horas"
      },
      {
        "en": "Il est midi",
        "pt": "É meio-dia"
      },
      {
        "en": "Il est minuit",
        "pt": "É meia-noite"
      },
      {
        "en": "Il est sept heures et demie",
        "pt": "São sete e meia"
      },
      {
        "en": "Il est neuf heures moins le quart",
        "pt": "São quinze para as nove"
      },
      {
        "en": "Quelle heure est-il ?",
        "pt": "Que horas são?"
      },
      {
        "en": "Je suis en retard",
        "pt": "Estou atrasado"
      },
      {
        "en": "Je suis en avance",
        "pt": "Estou adiantado"
      },
      {
        "en": "Je suis à l'heure",
        "pt": "Estou na hora certa"
      },
      {
        "en": "J'ai cinq minutes",
        "pt": "Tenho cinco minutos"
      },
      {
        "en": "J'ai un train à dix heures",
        "pt": "Tenho um trem às dez"
      },
      {
        "en": "Le magasin est ouvert",
        "pt": "A loja está aberta"
      },
      {
        "en": "Le magasin est fermé",
        "pt": "A loja está fechada"
      },
      {
        "en": "Tôt",
        "pt": "Cedo"
      },
      {
        "en": "Tard",
        "pt": "Tarde"
      },
      {
        "en": "Il est tard",
        "pt": "É tarde"
      },
      {
        "en": "J'ai du retard",
        "pt": "Estou com atraso"
      },
      {
        "en": "Le matin",
        "pt": "De manhã"
      }
    ],
    "expressions": [
      {
        "expr": "Quelle heure est-il ?",
        "meaning": "Que horas são?",
        "example": "Excusez-moi, quelle heure est-il ? — Il est trois heures."
      },
      {
        "expr": "Je suis pressé",
        "meaning": "Estou com pressa",
        "example": "Désolé, je ne peux pas parler, je suis pressé."
      },
      {
        "expr": "Tu as l'heure ?",
        "meaning": "Você tem horas? (sabe que horas são?)",
        "example": "Tu as l'heure ? Mon téléphone n'a plus de batterie."
      },
      {
        "expr": "Il est grand temps de…",
        "meaning": "Já passou da hora de…",
        "example": "Il est grand temps de partir, le train part à six heures !"
      },
      {
        "expr": "J'ai tout mon temps",
        "meaning": "Tenho todo o tempo do mundo",
        "example": "Prends ton temps, j'ai tout mon temps."
      },
      {
        "expr": "Être en retard de dix minutes",
        "meaning": "Estar dez minutos atrasado",
        "example": "Je suis en retard de dix minutes, je m'excuse."
      }
    ],
    "sentences": [
      "Quelle heure est-il ? — Il est huit heures et quart.",
      "Je suis en retard, le bus est parti !",
      "Elle est toujours à l'heure.",
      "J'ai un train à dix heures quarante.",
      "Il est midi, on mange ?",
      "Le magasin est fermé le dimanche.",
      "Il est tard, les enfants ont sommeil.",
      "Tu as l'heure, s'il te plaît ?",
      "Nous sommes en avance, le film commence à vingt heures.",
      "Je suis pressée, j'ai une réunion dans cinq minutes."
    ],
    "grammar": {
      "title": "A hora com \"IL EST\", atraso e pressa com ÊTRE",
      "rules": [
        "<b>A hora: sempre \"il est\":</b> \"Il est huit heures\" (são oito horas). Mesmo no plural, é \"il est\": nunca \"ils sont huit heures\". Meio-dia e meia-noite: \"il est midi\", \"il est minuit\".",
        "<b>Pontualidade com ÊTRE:</b> \"Je suis en retard\" (atrasado), \"en avance\" (adiantado), \"à l'heure\" (na hora). Pressa também: \"Je suis pressé(e)\".",
        "<b>Ter tempo e ter horário com AVOIR:</b> \"J'ai cinq minutes\", \"J'ai un train à dix heures\", \"Tu as l'heure ?\" (você sabe que horas são?)."
      ],
      "table": {
        "headers": [
          "Situação",
          "Frase",
          "Verbo"
        ],
        "rows": [
          [
            "Dizer a hora",
            "Il est huit heures",
            "Être (il est)"
          ],
          [
            "Atrasado",
            "Je suis en retard",
            "Être"
          ],
          [
            "Com pressa",
            "Je suis pressé",
            "Être"
          ],
          [
            "Tempo disponível",
            "J'ai dix minutes",
            "Avoir"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"São oito horas\" é:",
        "a": "Il est huit heures.",
        "opts": [
          "Il est huit heures.",
          "Ils sont huit heures.",
          "Il a huit heures.",
          "C'est huit heures de."
        ],
        "why": "A hora sempre com \"il est\"."
      },
      {
        "q": "\"Estou atrasado\" é:",
        "a": "Je suis en retard.",
        "opts": [
          "J'ai en retard.",
          "Je suis en retard.",
          "Je suis retard.",
          "J'ai retardé."
        ],
        "why": "Pontualidade com ÊTRE: \"être en retard\"."
      },
      {
        "q": "\"Tu as l'heure ?\" significa:",
        "a": "Você sabe que horas são?",
        "opts": [
          "Você tem tempo?",
          "Você chegou na hora?",
          "Você sabe que horas são?",
          "Você tem um relógio caro?"
        ],
        "why": "Pergunta informal pelas horas."
      },
      {
        "q": "\"São sete e meia\" é:",
        "a": "Il est sept heures et demie.",
        "opts": [
          "Il est sept heures et demi heure.",
          "Il est demie sept heures.",
          "Il a sept heures et demie.",
          "Il est sept heures et demie."
        ],
        "why": "\"Et demie\" depois de \"heures\"."
      },
      {
        "q": "Complete: \"Le magasin ___ fermé le dimanche.\"",
        "a": "est",
        "opts": [
          "est",
          "a",
          "ont",
          "sont"
        ],
        "why": "Descrever a loja: ÊTRE."
      },
      {
        "q": "\"Je suis pressée\" significa:",
        "a": "Estou com pressa.",
        "opts": [
          "Estou cansada.",
          "Estou com pressa.",
          "Estou na hora.",
          "Estou estressada."
        ],
        "why": "\"Pressé(e)\" = com pressa."
      },
      {
        "q": "\"J'___ un train à dix heures.\"",
        "a": "ai",
        "opts": [
          "suis",
          "a",
          "ai",
          "est"
        ],
        "why": "Ter um horário: AVOIR."
      },
      {
        "q": "\"Il est minuit\" é:",
        "a": "É meia-noite.",
        "opts": [
          "É meio-dia.",
          "São doze e meia.",
          "É de manhã.",
          "É meia-noite."
        ],
        "why": "Minuit = meia-noite."
      },
      {
        "q": "\"Nous sommes en avance\" significa:",
        "a": "Estamos adiantados.",
        "opts": [
          "Estamos adiantados.",
          "Estamos atrasados.",
          "Estamos com pressa.",
          "Estamos na frente da fila."
        ],
        "why": "En avance = adiantado."
      },
      {
        "q": "\"Il est grand temps de partir\" significa:",
        "a": "Já passou da hora de ir.",
        "opts": [
          "Faz muito tempo que partimos.",
          "Já passou da hora de ir.",
          "Está um tempo bom para sair.",
          "Temos muito tempo."
        ],
        "why": "\"Il est grand temps\" = já está mais que na hora."
      }
    ],
    "speak": [
      "Quelle heure est-il ? — Il est huit heures.",
      "Je suis en retard, je suis désolé !",
      "J'ai un train à dix heures et demie.",
      "Elle est toujours à l'heure.",
      "Tu as l'heure, s'il te plaît ?",
      "Il est tard, je vais dormir.",
      "Je suis pressé, j'ai une réunion.",
      "Prends ton temps, j'ai tout mon temps."
    ]
  },
  {
    "id": 221,
    "title": "La Météo : Il fait, Il y a, J'ai froid",
    "emoji": "🌦️",
    "lang": "fr",
    "verbs": [
      "Faire",
      "Être",
      "Avoir",
      "Pleuvoir",
      "Neiger"
    ],
    "vocab": [
      {
        "en": "Il fait beau",
        "pt": "O tempo está bom"
      },
      {
        "en": "Il fait chaud",
        "pt": "Está calor"
      },
      {
        "en": "Il fait froid",
        "pt": "Está frio"
      },
      {
        "en": "Il y a du soleil",
        "pt": "Tem sol"
      },
      {
        "en": "Il y a du vent",
        "pt": "Está ventando"
      },
      {
        "en": "Il y a des nuages",
        "pt": "Está nublado"
      },
      {
        "en": "Il pleut",
        "pt": "Está chovendo"
      },
      {
        "en": "Il neige",
        "pt": "Está nevando"
      },
      {
        "en": "J'ai chaud",
        "pt": "Estou com calor"
      },
      {
        "en": "J'ai froid",
        "pt": "Estou com frio"
      },
      {
        "en": "Je suis mouillé",
        "pt": "Estou molhado"
      },
      {
        "en": "Le ciel est gris",
        "pt": "O céu está cinza"
      },
      {
        "en": "L'été est chaud",
        "pt": "O verão é quente"
      },
      {
        "en": "L'hiver est froid",
        "pt": "O inverno é frio"
      },
      {
        "en": "Il y a un orage",
        "pt": "Tem uma tempestade"
      },
      {
        "en": "Il y a du brouillard",
        "pt": "Tem neblina"
      },
      {
        "en": "La température est de vingt degrés",
        "pt": "A temperatura é de vinte graus"
      },
      {
        "en": "Un parapluie",
        "pt": "Um guarda-chuva"
      }
    ],
    "expressions": [
      {
        "expr": "Quel temps fait-il ?",
        "meaning": "Como está o tempo?",
        "example": "Quel temps fait-il à Paris ? — Il fait froid et il pleut."
      },
      {
        "expr": "Il fait un temps de chien",
        "meaning": "O tempo está horrível",
        "example": "Reste à la maison, il fait un temps de chien !"
      },
      {
        "expr": "Je suis trempé",
        "meaning": "Estou encharcado",
        "example": "J'ai oublié mon parapluie, je suis trempé !"
      },
      {
        "expr": "Il pleut des cordes",
        "meaning": "Está chovendo canivete",
        "example": "Il pleut des cordes, on prend un taxi ?"
      },
      {
        "expr": "J'ai froid aux mains",
        "meaning": "Estou com as mãos frias",
        "example": "Il fait moins deux, j'ai froid aux mains."
      },
      {
        "expr": "Le temps est à l'orage",
        "meaning": "O tempo está para tempestade",
        "example": "Le ciel est noir, le temps est à l'orage."
      }
    ],
    "sentences": [
      "Aujourd'hui, il fait beau et il y a du soleil.",
      "Il fait froid, j'ai froid aux pieds.",
      "Il pleut et je suis mouillé.",
      "Il y a du vent sur la plage.",
      "En été, il fait chaud et j'ai soif.",
      "Le ciel est gris, il y a des nuages.",
      "Il fait trente degrés, nous avons très chaud.",
      "Il y a du brouillard ce matin.",
      "Je suis trempé, il pleut des cordes !",
      "En hiver, il neige et les enfants sont contents."
    ],
    "grammar": {
      "title": "O tempo com FAIRE e IL Y A, a pessoa com AVOIR",
      "rules": [
        "<b>O tempo: \"il fait\" + adjetivo:</b> \"Il fait beau / chaud / froid\". Não use \"il est chaud\" para o tempo: \"il est chaud\" fala de uma coisa (o café está quente).",
        "<b>Fenômenos: \"il y a\" + nome:</b> \"Il y a du soleil / du vent / des nuages / un orage\". Chuva e neve têm verbo próprio: \"il pleut\", \"il neige\".",
        "<b>Você sente: AVOIR:</b> O tempo \"faz\" frio, você \"tem\" frio: \"Il fait froid, j'ai froid\". Molhado é estado, então ÊTRE: \"je suis mouillé\"."
      ],
      "table": {
        "headers": [
          "Quem",
          "Estrutura",
          "Exemplo"
        ],
        "rows": [
          [
            "O tempo",
            "Il fait + adjetivo",
            "Il fait chaud"
          ],
          [
            "O fenômeno",
            "Il y a + du/des",
            "Il y a du vent"
          ],
          [
            "Você (sensação)",
            "Avoir + chaud/froid",
            "J'ai froid"
          ],
          [
            "Você (estado)",
            "Être + adjetivo",
            "Je suis mouillé"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Está frio (o tempo)\" é:",
        "a": "Il fait froid.",
        "opts": [
          "Il est froid.",
          "Il fait froid.",
          "J'ai froid.",
          "Il a froid."
        ],
        "why": "O tempo usa \"il fait\"."
      },
      {
        "q": "\"Estou com frio\" é:",
        "a": "J'ai froid.",
        "opts": [
          "Je suis froid.",
          "Il fait froid moi.",
          "J'ai froid.",
          "Je fais froid."
        ],
        "why": "A pessoa sente com AVOIR."
      },
      {
        "q": "\"Está ventando\" é:",
        "a": "Il y a du vent.",
        "opts": [
          "Il est du vent.",
          "Il fait vent.",
          "Il a du vent.",
          "Il y a du vent."
        ],
        "why": "Fenômeno com \"il y a\"."
      },
      {
        "q": "\"Estou molhado\" é:",
        "a": "Je suis mouillé.",
        "opts": [
          "Je suis mouillé.",
          "J'ai mouillé.",
          "Il fait mouillé.",
          "J'ai mouille."
        ],
        "why": "Estado com ÊTRE."
      },
      {
        "q": "\"Quel temps fait-il ?\" significa:",
        "a": "Como está o tempo?",
        "opts": [
          "Que horas são?",
          "Como está o tempo?",
          "Quanto tempo falta?",
          "Faz quanto tempo?"
        ],
        "why": "\"Temps\" aqui é clima."
      },
      {
        "q": "Complete: \"Il ___ des nuages.\"",
        "a": "y a",
        "opts": [
          "fait",
          "est",
          "y a",
          "a"
        ],
        "why": "Nuvens: \"il y a des nuages\"."
      },
      {
        "q": "\"Le café est chaud\" fala de:",
        "a": "O café (que está quente)",
        "opts": [
          "O tempo lá fora",
          "Você estar com calor",
          "Um café aberto no verão",
          "O café (que está quente)"
        ],
        "why": "\"Être chaud\" descreve uma coisa."
      },
      {
        "q": "\"Il pleut des cordes\" significa:",
        "a": "Está chovendo muito.",
        "opts": [
          "Está chovendo muito.",
          "Está chovendo pouco.",
          "Vai parar de chover.",
          "Está nevando."
        ],
        "why": "Chover cordas = chover canivete."
      },
      {
        "q": "\"En été, nous ___ chaud.\"",
        "a": "avons",
        "opts": [
          "sommes",
          "avons",
          "faisons",
          "avez"
        ],
        "why": "Sensação com AVOIR: \"nous avons chaud\"."
      },
      {
        "q": "\"Il fait un temps de chien\" significa:",
        "a": "O tempo está horrível.",
        "opts": [
          "Está calor de cachorro.",
          "O cachorro está com frio.",
          "O tempo está horrível.",
          "O tempo está ótimo."
        ],
        "why": "Tempo de cão = tempo ruim."
      }
    ],
    "speak": [
      "Aujourd'hui, il fait beau et il y a du soleil.",
      "Il fait froid, j'ai froid aux mains.",
      "Il pleut et je suis trempé !",
      "Quel temps fait-il chez toi ?",
      "Il y a du vent et des nuages.",
      "En été, il fait chaud et j'ai soif.",
      "Il pleut des cordes, on prend un taxi ?",
      "Le ciel est noir, le temps est à l'orage."
    ]
  },
  {
    "id": 222,
    "title": "En Ville avec Être & Avoir",
    "emoji": "🧭",
    "lang": "fr",
    "verbs": [
      "Être",
      "Avoir",
      "Chercher",
      "Trouver",
      "Tourner"
    ],
    "vocab": [
      {
        "en": "La gare est loin ?",
        "pt": "A estação é longe?"
      },
      {
        "en": "C'est tout près",
        "pt": "É bem perto"
      },
      {
        "en": "C'est à côté de la banque",
        "pt": "Fica ao lado do banco"
      },
      {
        "en": "C'est en face du musée",
        "pt": "Fica em frente ao museu"
      },
      {
        "en": "Il y a une pharmacie ici ?",
        "pt": "Tem uma farmácia aqui?"
      },
      {
        "en": "Il n'y a pas de métro",
        "pt": "Não tem metrô"
      },
      {
        "en": "Je suis perdu",
        "pt": "Estou perdido"
      },
      {
        "en": "Je suis perdue",
        "pt": "Estou perdida"
      },
      {
        "en": "Je suis à la gare",
        "pt": "Estou na estação"
      },
      {
        "en": "Vous êtes où ?",
        "pt": "Onde o senhor está?"
      },
      {
        "en": "J'ai un plan",
        "pt": "Tenho um mapa (da cidade)"
      },
      {
        "en": "Je n'ai pas de réseau",
        "pt": "Estou sem sinal"
      },
      {
        "en": "C'est à dix minutes à pied",
        "pt": "Fica a dez minutos a pé"
      },
      {
        "en": "Le centre-ville",
        "pt": "O centro da cidade"
      },
      {
        "en": "Au coin de la rue",
        "pt": "Na esquina"
      },
      {
        "en": "Tout droit",
        "pt": "Em frente (reto)"
      },
      {
        "en": "À gauche",
        "pt": "À esquerda"
      },
      {
        "en": "À droite",
        "pt": "À direita"
      }
    ],
    "expressions": [
      {
        "expr": "Excusez-moi, je suis perdu(e)",
        "meaning": "Com licença, estou perdido(a)",
        "example": "Excusez-moi, je suis perdue. La gare, c'est par où ?"
      },
      {
        "expr": "C'est par où ?",
        "meaning": "É para que lado?",
        "example": "Le musée du Louvre, c'est par où ?"
      },
      {
        "expr": "Il y a un… près d'ici ?",
        "meaning": "Tem um… aqui perto?",
        "example": "Il y a un distributeur près d'ici ?"
      },
      {
        "expr": "Vous ne pouvez pas le manquer",
        "meaning": "Não tem como errar",
        "example": "C'est le grand bâtiment rouge, vous ne pouvez pas le manquer."
      },
      {
        "expr": "Je n'ai pas de réseau",
        "meaning": "Estou sem sinal",
        "example": "Mon GPS ne marche pas, je n'ai pas de réseau."
      },
      {
        "expr": "C'est à deux pas",
        "meaning": "É pertinho (a dois passos)",
        "example": "La boulangerie ? C'est à deux pas d'ici !"
      }
    ],
    "sentences": [
      "Excusez-moi, il y a une pharmacie près d'ici ?",
      "La gare est loin ? — Non, c'est à dix minutes à pied.",
      "Je suis perdu, je cherche la rue Victor Hugo.",
      "Le musée est en face de la cathédrale.",
      "Il n'y a pas de métro dans cette ville.",
      "Vous êtes où ? Je suis devant le cinéma.",
      "La banque est à côté de la poste.",
      "J'ai un plan, mais je n'ai pas de réseau.",
      "Tournez à gauche, c'est au coin de la rue.",
      "L'hôtel ? C'est à deux pas d'ici."
    ],
    "grammar": {
      "title": "Onde fica com ÊTRE, se existe com IL Y A",
      "rules": [
        "<b>Onde fica: ÊTRE:</b> \"La gare est loin\", \"Le musée est en face de la cathédrale\". Para você: \"Je suis à la gare\", \"Je suis perdu(e)\".",
        "<b>Se existe: \"Il y a… ?\":</b> Para perguntar se existe um lugar: \"Il y a une pharmacie près d'ici ?\". Negativa: \"Il n'y a pas de métro\".",
        "<b>De + o = du:</b> Em \"à côté de\" e \"en face de\": de + le = du, de + les = des. \"En face du musée\", \"À côté des magasins\", mas \"à côté de la banque\"."
      ],
      "table": {
        "headers": [
          "Pergunta",
          "Resposta",
          "Ideia"
        ],
        "rows": [
          [
            "La gare est loin ?",
            "Non, c'est tout près",
            "Localização (être)"
          ],
          [
            "Il y a une banque ?",
            "Oui, à côté de la poste",
            "Existência (il y a)"
          ],
          [
            "Vous êtes où ?",
            "Je suis devant le cinéma",
            "Onde você está (être)"
          ],
          [
            "Il y a un métro ?",
            "Non, il n'y a pas de métro",
            "Negação (pas de)"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Estou perdida\" é:",
        "a": "Je suis perdue.",
        "opts": [
          "J'ai perdue.",
          "Je suis perdu.",
          "Je suis perdue.",
          "J'ai perdu."
        ],
        "why": "Estado com ÊTRE, feminino \"perdue\". (\"J'ai perdu\" = eu perdi algo.)"
      },
      {
        "q": "\"Tem uma farmácia aqui perto?\" é:",
        "a": "Il y a une pharmacie près d'ici ?",
        "opts": [
          "Est une pharmacie près d'ici ?",
          "Il a une pharmacie près d'ici ?",
          "C'est une pharmacie près ici ?",
          "Il y a une pharmacie près d'ici ?"
        ],
        "why": "Perguntar se existe: \"il y a\"."
      },
      {
        "q": "\"Fica em frente ao museu\" é:",
        "a": "C'est en face du musée.",
        "opts": [
          "C'est en face du musée.",
          "C'est en face de le musée.",
          "C'est en face au musée.",
          "Il y a en face musée."
        ],
        "why": "De + le = du."
      },
      {
        "q": "\"Não tem metrô\" é:",
        "a": "Il n'y a pas de métro.",
        "opts": [
          "Il n'y a pas un métro.",
          "Il n'y a pas de métro.",
          "Il n'est pas de métro.",
          "Il ne y a pas métro."
        ],
        "why": "Negação de \"il y a\": \"il n'y a pas de\"."
      },
      {
        "q": "Complete: \"Vous ___ où ?\"",
        "a": "êtes",
        "opts": [
          "avez",
          "est",
          "êtes",
          "sont"
        ],
        "why": "Onde você está: ÊTRE."
      },
      {
        "q": "\"C'est à deux pas\" significa:",
        "a": "É bem perto.",
        "opts": [
          "É a dois quarteirões.",
          "São duas paradas.",
          "É longe.",
          "É bem perto."
        ],
        "why": "Expressão: pertinho."
      },
      {
        "q": "\"Je n'ai pas de réseau\" significa:",
        "a": "Estou sem sinal (celular).",
        "opts": [
          "Estou sem sinal (celular).",
          "Não tenho rede social.",
          "Não conheço ninguém.",
          "Não tenho mapa."
        ],
        "why": "Réseau = rede / sinal."
      },
      {
        "q": "\"C'est par où ?\" pergunta:",
        "a": "Para que lado é?",
        "opts": [
          "Quanto custa?",
          "Para que lado é?",
          "É longe?",
          "Quem está lá?"
        ],
        "why": "\"Par où\" = por onde."
      },
      {
        "q": "\"La banque est ___ la poste.\" (ao lado de)",
        "a": "à côté de",
        "opts": [
          "à côté du",
          "en côté de",
          "à côté de",
          "à côte à"
        ],
        "why": "La poste é feminino: \"à côté de la poste\"."
      },
      {
        "q": "\"Tout droit\" significa:",
        "a": "Em frente / reto",
        "opts": [
          "Tudo certo",
          "À direita",
          "Volta",
          "Em frente / reto"
        ],
        "why": "Tout droit = seguir reto."
      }
    ],
    "speak": [
      "Excusez-moi, je suis perdu. La gare, c'est par où ?",
      "Il y a une pharmacie près d'ici ?",
      "La banque est à côté de la poste.",
      "Le musée est en face de la cathédrale.",
      "Il n'y a pas de métro dans cette ville.",
      "Je suis devant le cinéma, tu es où ?",
      "J'ai un plan, mais je n'ai pas de réseau.",
      "La boulangerie ? C'est à deux pas d'ici !"
    ]
  },
  {
    "id": 223,
    "title": "Les Achats avec Être & Avoir",
    "emoji": "🛍️",
    "lang": "fr",
    "verbs": [
      "Avoir",
      "Être",
      "Essayer",
      "Acheter",
      "Porter"
    ],
    "vocab": [
      {
        "en": "Vous avez ce pull en bleu ?",
        "pt": "Vocês têm este suéter em azul?"
      },
      {
        "en": "Vous avez la taille M ?",
        "pt": "Vocês têm o tamanho M?"
      },
      {
        "en": "C'est trop grand",
        "pt": "Está grande demais"
      },
      {
        "en": "C'est trop petit",
        "pt": "Está pequeno demais"
      },
      {
        "en": "C'est parfait",
        "pt": "Está perfeito"
      },
      {
        "en": "Il est en solde",
        "pt": "Está em promoção"
      },
      {
        "en": "J'ai besoin d'une veste",
        "pt": "Preciso de uma jaqueta"
      },
      {
        "en": "Je fais du quarante",
        "pt": "Calço / visto 40"
      },
      {
        "en": "Les cabines sont là-bas",
        "pt": "Os provadores ficam ali"
      },
      {
        "en": "C'est combien ?",
        "pt": "Quanto custa?"
      },
      {
        "en": "Elle est jolie, cette robe",
        "pt": "Este vestido é bonito"
      },
      {
        "en": "Ces chaussures sont confortables",
        "pt": "Estes sapatos são confortáveis"
      },
      {
        "en": "Je suis juste en train de regarder",
        "pt": "Só estou olhando"
      },
      {
        "en": "Vous avez une carte de fidélité ?",
        "pt": "Tem cartão fidelidade?"
      },
      {
        "en": "C'est un cadeau",
        "pt": "É um presente"
      },
      {
        "en": "Je n'ai pas d'espèces",
        "pt": "Não tenho dinheiro vivo"
      },
      {
        "en": "Par carte",
        "pt": "No cartão"
      },
      {
        "en": "Il est un peu cher",
        "pt": "Está um pouco caro"
      }
    ],
    "expressions": [
      {
        "expr": "Je regarde, merci",
        "meaning": "Só estou olhando, obrigado",
        "example": "— Je peux vous aider ? — Non, je regarde, merci."
      },
      {
        "expr": "Vous l'avez en… ?",
        "meaning": "Vocês têm em… (cor/tamanho)?",
        "example": "Elle est belle, cette chemise. Vous l'avez en blanc ?"
      },
      {
        "expr": "J'ai besoin de…",
        "meaning": "Eu preciso de…",
        "example": "J'ai besoin d'un manteau pour l'hiver."
      },
      {
        "expr": "Ça vous va très bien",
        "meaning": "Ficou muito bem em você",
        "example": "Cette veste ? Ça vous va très bien !"
      },
      {
        "expr": "C'est une bonne affaire",
        "meaning": "É um bom negócio",
        "example": "Moins cinquante pour cent ? C'est une bonne affaire !"
      },
      {
        "expr": "Je suis à découvert",
        "meaning": "Estou no vermelho (no banco)",
        "example": "Pas de shopping ce mois-ci, je suis à découvert !"
      }
    ],
    "sentences": [
      "Bonjour, vous avez ce pull en taille M ?",
      "Ce pantalon est trop grand, vous l'avez en trente-huit ?",
      "J'ai besoin d'une veste pour le travail.",
      "Ces chaussures sont belles, mais elles sont trop chères.",
      "Les cabines sont au fond du magasin.",
      "C'est un cadeau, vous avez un paquet ?",
      "La robe est en solde, elle est à moitié prix.",
      "Je n'ai pas d'espèces, je paie par carte.",
      "Ça vous va très bien, ce manteau !",
      "Non merci, je suis juste en train de regarder."
    ],
    "grammar": {
      "title": "Perguntar o que a loja tem: AVOIR. Dizer como a roupa está: ÊTRE",
      "rules": [
        "<b>O que a loja tem: AVOIR:</b> \"Vous avez ce pull en bleu ?\", \"Vous l'avez en M ?\". Responder: \"Oui, nous l'avons\" ou \"Non, nous ne l'avons plus\".",
        "<b>Como a roupa está: ÊTRE:</b> \"C'est trop grand\", \"Elle est jolie, cette robe\", \"Ces chaussures sont confortables\". O adjetivo concorda com a roupa.",
        "<b>Precisar: \"avoir besoin de\":</b> \"J'ai besoin d'une veste\" (de + nome) ou \"J'ai besoin d'essayer\" (de + verbo). Negativa: \"Je n'ai pas besoin de sac\"."
      ],
      "table": {
        "headers": [
          "Quer dizer",
          "Em francês",
          "Verbo"
        ],
        "rows": [
          [
            "Vocês têm?",
            "Vous l'avez en bleu ?",
            "Avoir"
          ],
          [
            "Está grande",
            "C'est trop grand",
            "Être"
          ],
          [
            "Preciso de",
            "J'ai besoin d'une veste",
            "Avoir besoin de"
          ],
          [
            "Está em promoção",
            "Il est en solde",
            "Être"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Vocês têm este suéter em azul?\" é:",
        "a": "Vous avez ce pull en bleu ?",
        "opts": [
          "Vous êtes ce pull en bleu ?",
          "Il y a vous ce pull bleu ?",
          "Vous avez ce pull de bleu ?",
          "Vous avez ce pull en bleu ?"
        ],
        "why": "O que a loja tem: AVOIR."
      },
      {
        "q": "\"Está grande demais\" é:",
        "a": "C'est trop grand.",
        "opts": [
          "C'est trop grand.",
          "J'ai trop grand.",
          "Il a trop grand.",
          "C'est très trop grand."
        ],
        "why": "Como a roupa está: ÊTRE."
      },
      {
        "q": "\"Preciso de uma jaqueta\" é:",
        "a": "J'ai besoin d'une veste.",
        "opts": [
          "Je suis besoin d'une veste.",
          "J'ai besoin d'une veste.",
          "J'ai besoin une veste.",
          "Je besoin de veste."
        ],
        "why": "\"Avoir besoin de\"."
      },
      {
        "q": "Complete: \"Ces chaussures ___ confortables.\"",
        "a": "sont",
        "opts": [
          "ont",
          "est",
          "sont",
          "a"
        ],
        "why": "Plural com ÊTRE: \"sont\"."
      },
      {
        "q": "\"Je regarde, merci\" significa:",
        "a": "Só estou olhando, obrigado.",
        "opts": [
          "Eu vou levar, obrigado.",
          "Estou procurando o provador.",
          "Quero ver o preço.",
          "Só estou olhando, obrigado."
        ],
        "why": "Resposta para o vendedor."
      },
      {
        "q": "\"Il est en solde\" significa:",
        "a": "Está em promoção.",
        "opts": [
          "Está em promoção.",
          "Está esgotado.",
          "Está sozinho.",
          "Está no provador."
        ],
        "why": "Soldes = liquidação."
      },
      {
        "q": "\"Je n'ai pas d'espèces\" significa:",
        "a": "Não tenho dinheiro vivo.",
        "opts": [
          "Não tenho espaço.",
          "Não tenho dinheiro vivo.",
          "Não tenho tamanho.",
          "Não tenho tempo."
        ],
        "why": "Espèces = dinheiro em espécie."
      },
      {
        "q": "\"Ça vous va très bien\" significa:",
        "a": "Ficou muito bem em você.",
        "opts": [
          "Vai muito bem, obrigado.",
          "Vai para o provador.",
          "Ficou muito bem em você.",
          "Você vai bem?"
        ],
        "why": "\"Aller\" aqui = cair bem."
      },
      {
        "q": "\"Elle est jolie, cette ___.\" Qual palavra combina?",
        "a": "robe",
        "opts": [
          "pantalon",
          "manteau",
          "pull",
          "robe"
        ],
        "why": "\"Jolie\" é feminino; \"robe\" é feminino."
      },
      {
        "q": "\"Je suis à découvert\" significa:",
        "a": "Estou no vermelho no banco.",
        "opts": [
          "Estou no vermelho no banco.",
          "Estou sem casaco.",
          "Estou descobrindo a loja.",
          "Estou com frio."
        ],
        "why": "À découvert = saldo negativo."
      }
    ],
    "speak": [
      "Bonjour, vous avez ce pull en taille M ?",
      "C'est trop grand, vous l'avez en trente-huit ?",
      "J'ai besoin d'une veste pour l'hiver.",
      "Ces chaussures sont belles, mais elles sont trop chères.",
      "Je n'ai pas d'espèces, je paie par carte.",
      "Ça vous va très bien !",
      "Non merci, je regarde.",
      "Moins cinquante pour cent ? C'est une bonne affaire !"
    ]
  },
  {
    "id": 224,
    "title": "Hier : J'ai été, J'ai eu, Je suis allé",
    "emoji": "⏪",
    "lang": "fr",
    "verbs": [
      "Être (passé)",
      "Avoir (passé)",
      "Aller",
      "Faire",
      "Voir"
    ],
    "vocab": [
      {
        "en": "J'ai été malade",
        "pt": "Eu fiquei doente"
      },
      {
        "en": "J'ai eu de la chance",
        "pt": "Eu tive sorte"
      },
      {
        "en": "J'ai eu peur",
        "pt": "Eu tive medo / fiquei com medo"
      },
      {
        "en": "Il a été très gentil",
        "pt": "Ele foi muito gentil"
      },
      {
        "en": "Nous avons eu un problème",
        "pt": "Tivemos um problema"
      },
      {
        "en": "Elle a eu un bébé",
        "pt": "Ela teve um bebê"
      },
      {
        "en": "Je suis allé au cinéma",
        "pt": "Fui ao cinema"
      },
      {
        "en": "Elle est allée à Paris",
        "pt": "Ela foi a Paris"
      },
      {
        "en": "Nous sommes restés à la maison",
        "pt": "Ficamos em casa"
      },
      {
        "en": "J'ai fait du sport",
        "pt": "Fiz esporte"
      },
      {
        "en": "J'ai vu un film",
        "pt": "Vi um filme"
      },
      {
        "en": "Hier",
        "pt": "Ontem"
      },
      {
        "en": "Le week-end dernier",
        "pt": "No fim de semana passado"
      },
      {
        "en": "L'année dernière",
        "pt": "No ano passado"
      },
      {
        "en": "Il y a deux jours",
        "pt": "Dois dias atrás"
      },
      {
        "en": "Ça a été ?",
        "pt": "Foi tudo bem?"
      },
      {
        "en": "J'ai eu vingt ans hier",
        "pt": "Fiz vinte anos ontem"
      },
      {
        "en": "Tu as eu froid ?",
        "pt": "Você sentiu frio?"
      }
    ],
    "expressions": [
      {
        "expr": "Ça a été ?",
        "meaning": "Foi tudo bem? (sobre algo que já passou)",
        "example": "— Ton examen, ça a été ? — Oui, très bien !"
      },
      {
        "expr": "J'ai eu de la chance",
        "meaning": "Tive sorte",
        "example": "Le train était en retard, j'ai eu de la chance !"
      },
      {
        "expr": "J'ai eu du mal à…",
        "meaning": "Tive dificuldade para…",
        "example": "J'ai eu du mal à trouver l'hôtel."
      },
      {
        "expr": "Ça a été une belle surprise",
        "meaning": "Foi uma bela surpresa",
        "example": "La fête pour mon anniversaire, ça a été une belle surprise !"
      },
      {
        "expr": "Je suis passé chez toi",
        "meaning": "Passei na sua casa",
        "example": "Je suis passé chez toi hier, mais tu n'étais pas là."
      },
      {
        "expr": "Il y a eu un accident",
        "meaning": "Houve um acidente",
        "example": "Il y a eu un accident sur l'autoroute, je suis en retard."
      }
    ],
    "sentences": [
      "Hier, j'ai été malade, je suis resté au lit.",
      "Le week-end dernier, nous sommes allés à la plage.",
      "J'ai eu peur pendant le film d'horreur.",
      "Elle a eu un bébé le mois dernier !",
      "Il a été très gentil avec moi.",
      "Nous avons eu un problème avec la voiture.",
      "Ton entretien, ça a été ?",
      "J'ai eu trente ans samedi.",
      "Il y a eu un accident ce matin.",
      "J'ai eu du mal à dormir, il a fait très chaud."
    ],
    "grammar": {
      "title": "ÊTRE e AVOIR no passé composé: os dois usam AVOIR como ajudante",
      "rules": [
        "<b>ÊTRE no passado: \"j'ai été\":</b> O particípio de être é \"été\", e o ajudante é AVOIR: \"J'ai été malade\", \"Il a été gentil\". Nunca \"je suis été\".",
        "<b>AVOIR no passado: \"j'ai eu\":</b> O particípio de avoir é \"eu\": \"J'ai eu peur\", \"Nous avons eu un problème\", \"J'ai eu vingt ans\" (fiz vinte anos).",
        "<b>Movimento usa ÊTRE como ajudante:</b> Verbos como aller, venir, rester, partir usam ÊTRE: \"Je suis allé(e)\", \"Nous sommes restés\". O particípio concorda: \"Elle est allée\"."
      ],
      "table": {
        "headers": [
          "Verbo",
          "Passé composé",
          "Exemplo"
        ],
        "rows": [
          [
            "Être",
            "J'ai été",
            "J'ai été malade"
          ],
          [
            "Avoir",
            "J'ai eu",
            "J'ai eu de la chance"
          ],
          [
            "Aller",
            "Je suis allé(e)",
            "Elle est allée à Paris"
          ],
          [
            "Il y a",
            "Il y a eu",
            "Il y a eu un accident"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu fiquei doente\" é:",
        "a": "J'ai été malade.",
        "opts": [
          "J'ai été malade.",
          "Je suis été malade.",
          "J'ai eu malade.",
          "Je étais malade."
        ],
        "why": "Être no passé composé: \"j'ai été\"."
      },
      {
        "q": "\"Tive sorte\" é:",
        "a": "J'ai eu de la chance.",
        "opts": [
          "J'ai été de la chance.",
          "J'ai eu de la chance.",
          "Je suis eu de la chance.",
          "J'ai eu chance de la."
        ],
        "why": "Avoir no passé composé: \"j'ai eu\"."
      },
      {
        "q": "\"Ela foi a Paris\" é:",
        "a": "Elle est allée à Paris.",
        "opts": [
          "Elle a allée à Paris.",
          "Elle est allé à Paris.",
          "Elle est allée à Paris.",
          "Elle a été allée à Paris."
        ],
        "why": "Aller usa ÊTRE e concorda: allée."
      },
      {
        "q": "Qual é o particípio de \"être\"?",
        "a": "été",
        "opts": [
          "était",
          "êté",
          "eu",
          "été"
        ],
        "why": "Être → été."
      },
      {
        "q": "Qual é o particípio de \"avoir\"?",
        "a": "eu",
        "opts": [
          "eu",
          "eut",
          "avait",
          "avé"
        ],
        "why": "Avoir → eu."
      },
      {
        "q": "\"Il y a eu un accident\" significa:",
        "a": "Houve um acidente.",
        "opts": [
          "Há um acidente.",
          "Houve um acidente.",
          "Haverá um acidente.",
          "Ele teve um acidente."
        ],
        "why": "\"Il y a\" no passé composé: \"il y a eu\"."
      },
      {
        "q": "\"Ça a été ?\" pergunta:",
        "a": "Se algo que já passou foi bem",
        "opts": [
          "Que horas são",
          "Onde a pessoa está",
          "Se algo que já passou foi bem",
          "Se a pessoa já comeu"
        ],
        "why": "Ça a été = foi tudo bem?"
      },
      {
        "q": "Complete: \"Nous ___ restés à la maison.\"",
        "a": "sommes",
        "opts": [
          "avons",
          "êtes",
          "sont",
          "sommes"
        ],
        "why": "Rester usa ÊTRE."
      },
      {
        "q": "\"J'ai eu vingt ans hier\" significa:",
        "a": "Fiz vinte anos ontem.",
        "opts": [
          "Fiz vinte anos ontem.",
          "Tive vinte anos de idade.",
          "Vinte anos atrás.",
          "Faz vinte anos que estou aqui."
        ],
        "why": "Avoir + idade no passé composé = fazer anos."
      },
      {
        "q": "\"J'ai eu du mal à trouver l'hôtel\" significa:",
        "a": "Tive dificuldade para achar o hotel.",
        "opts": [
          "Fiquei mal no hotel.",
          "Tive dificuldade para achar o hotel.",
          "O hotel era ruim.",
          "Achei o hotel fácil."
        ],
        "why": "\"Avoir du mal à\" = ter dificuldade para."
      }
    ],
    "speak": [
      "Hier, j'ai été malade, je suis resté au lit.",
      "J'ai eu de la chance, le train était en retard.",
      "Le week-end dernier, nous sommes allés à la plage.",
      "J'ai eu peur pendant le film.",
      "Elle est allée à Paris en avril.",
      "Ton examen, ça a été ?",
      "J'ai eu trente ans samedi !",
      "Il y a eu un accident sur l'autoroute."
    ]
  },
  {
    "id": 225,
    "title": "Être au Singulier : je suis, tu es, il est",
    "emoji": "1️⃣",
    "lang": "fr",
    "verbs": [
      "Je suis",
      "Tu es",
      "Il est",
      "Elle est",
      "On est"
    ],
    "vocab": [
      {
        "en": "Je suis",
        "pt": "Eu sou / Eu estou"
      },
      {
        "en": "Tu es",
        "pt": "Você é / Você está (informal)"
      },
      {
        "en": "Il est",
        "pt": "Ele é / Ele está"
      },
      {
        "en": "Elle est",
        "pt": "Ela é / Ela está"
      },
      {
        "en": "On est",
        "pt": "A gente é / A gente está"
      },
      {
        "en": "C'est",
        "pt": "É (isso é)"
      },
      {
        "en": "Je suis heureux",
        "pt": "Eu estou feliz (homem)"
      },
      {
        "en": "Je suis heureuse",
        "pt": "Eu estou feliz (mulher)"
      },
      {
        "en": "Tu es sympa",
        "pt": "Você é legal"
      },
      {
        "en": "Il est grand",
        "pt": "Ele é alto"
      },
      {
        "en": "Elle est petite",
        "pt": "Ela é baixa"
      },
      {
        "en": "Il est à la maison",
        "pt": "Ele está em casa"
      },
      {
        "en": "Elle est au travail",
        "pt": "Ela está no trabalho"
      },
      {
        "en": "Tu es prêt ?",
        "pt": "Você está pronto?"
      },
      {
        "en": "Je suis sûr",
        "pt": "Tenho certeza"
      },
      {
        "en": "Il est gentil",
        "pt": "Ele é gentil"
      },
      {
        "en": "Elle est sérieuse",
        "pt": "Ela é séria"
      },
      {
        "en": "On est ensemble",
        "pt": "A gente está junto"
      }
    ],
    "expressions": [
      {
        "expr": "Je suis d'accord",
        "meaning": "Eu concordo",
        "example": "— On mange à midi ? — Je suis d'accord !"
      },
      {
        "expr": "Tu es sûr ?",
        "meaning": "Você tem certeza?",
        "example": "Tu es sûr ? Le magasin est fermé le lundi."
      },
      {
        "expr": "C'est la vie !",
        "meaning": "É a vida!",
        "example": "Il pleut le jour de mon anniversaire… c'est la vie !"
      },
      {
        "expr": "On est où ?",
        "meaning": "Onde a gente está?",
        "example": "On est où ? Je ne reconnais pas la rue."
      },
      {
        "expr": "Il est comment ?",
        "meaning": "Como ele é?",
        "example": "Ton nouveau chef, il est comment ? — Il est sympa."
      },
      {
        "expr": "Je suis là !",
        "meaning": "Estou aqui! / Cheguei!",
        "example": "Ouvre la porte, je suis là !"
      }
    ],
    "sentences": [
      "Je suis brésilien et tu es français.",
      "Elle est à la maison, il est au travail.",
      "Tu es prêt ? On est en retard !",
      "Il est grand et elle est petite.",
      "Je suis d'accord avec toi.",
      "Tu es sûr ? Il est déjà midi.",
      "On est ensemble, on est une équipe.",
      "C'est mon ami, il est très gentil.",
      "Elle est sérieuse, mais elle est drôle aussi.",
      "Je suis là, je t'attends devant la porte."
    ],
    "grammar": {
      "title": "ÊTRE no singular: suis, es, est",
      "rules": [
        "<b>Três formas para uma pessoa:</b> Je SUIS · Tu ES · Il / Elle / On EST. \"Es\" e \"est\" soam iguais; a diferença está só na escrita.",
        "<b>\"On\" = a gente:</b> \"On\" é muito usado na fala no lugar de \"nous\": \"On est en retard\" (a gente está atrasado). Conjuga como \"il\": \"on est\".",
        "<b>Um verbo para \"ser\" e \"estar\":</b> O francês não separa ser e estar: \"Je suis grand\" (sou alto) e \"Je suis fatigué\" (estou cansado) usam o mesmo verbo."
      ],
      "table": {
        "headers": [
          "Pronome",
          "Être",
          "Exemplo"
        ],
        "rows": [
          [
            "Je",
            "suis",
            "Je suis prêt"
          ],
          [
            "Tu",
            "es",
            "Tu es sympa"
          ],
          [
            "Il / Elle",
            "est",
            "Elle est au travail"
          ],
          [
            "On",
            "est",
            "On est ensemble"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Complete: \"Je ___ fatigué.\"",
        "a": "suis",
        "opts": [
          "es",
          "suis",
          "est",
          "ai"
        ],
        "why": "Je → suis."
      },
      {
        "q": "Complete: \"Tu ___ prêt ?\"",
        "a": "es",
        "opts": [
          "est",
          "suis",
          "es",
          "as"
        ],
        "why": "Tu → es."
      },
      {
        "q": "Complete: \"Elle ___ à la maison.\"",
        "a": "est",
        "opts": [
          "es",
          "a",
          "sont",
          "est"
        ],
        "why": "Elle → est."
      },
      {
        "q": "Complete: \"On ___ en retard !\"",
        "a": "est",
        "opts": [
          "est",
          "sommes",
          "es",
          "ont"
        ],
        "why": "\"On\" conjuga como \"il\": on est."
      },
      {
        "q": "\"Je suis d'accord\" significa:",
        "a": "Eu concordo.",
        "opts": [
          "Eu estou acordado.",
          "Eu concordo.",
          "Eu estou de acordo com o horário.",
          "Estou pronto."
        ],
        "why": "Être d'accord = concordar."
      },
      {
        "q": "Qual frase diz \"Ele é alto\"?",
        "a": "Il est grand.",
        "opts": [
          "Il a grand.",
          "Il es grand.",
          "Il est grand.",
          "Il suis grand."
        ],
        "why": "Il → est."
      },
      {
        "q": "\"Tu es sûr ?\" significa:",
        "a": "Você tem certeza?",
        "opts": [
          "Você está seguro (protegido)?",
          "Você é o primeiro?",
          "Você está sozinho?",
          "Você tem certeza?"
        ],
        "why": "Être sûr = ter certeza."
      },
      {
        "q": "Qual pronome combina com \"es\"?",
        "a": "Tu",
        "opts": [
          "Tu",
          "Je",
          "Il",
          "On"
        ],
        "why": "Só \"tu\" usa \"es\"."
      },
      {
        "q": "\"C'est la vie !\" significa:",
        "a": "É a vida!",
        "opts": [
          "Esta é a minha vida.",
          "É a vida!",
          "Viva a vida!",
          "A vida é bela."
        ],
        "why": "Expressão de conformação."
      },
      {
        "q": "\"Je suis là !\" significa:",
        "a": "Estou aqui! / Cheguei!",
        "opts": [
          "Eu sou de lá.",
          "Eu vou lá.",
          "Estou aqui! / Cheguei!",
          "Eu estava lá."
        ],
        "why": "Là = aqui/ali."
      }
    ],
    "speak": [
      "Je suis brésilien, et toi ?",
      "Tu es prêt ? On est en retard !",
      "Il est grand et elle est petite.",
      "Je suis d'accord avec toi.",
      "Elle est au travail jusqu'à six heures.",
      "C'est la vie !",
      "Tu es sûr ? Il est déjà tard.",
      "Ouvre la porte, je suis là !"
    ]
  },
  {
    "id": 226,
    "title": "Être au Pluriel : nous sommes, vous êtes, ils sont",
    "emoji": "👥",
    "lang": "fr",
    "verbs": [
      "Nous sommes",
      "Vous êtes",
      "Ils sont",
      "Elles sont",
      "Être"
    ],
    "vocab": [
      {
        "en": "Nous sommes",
        "pt": "Nós somos / estamos"
      },
      {
        "en": "Vous êtes",
        "pt": "Vocês são / O senhor é"
      },
      {
        "en": "Ils sont",
        "pt": "Eles são / estão"
      },
      {
        "en": "Elles sont",
        "pt": "Elas são / estão"
      },
      {
        "en": "Nous sommes amis",
        "pt": "Somos amigos"
      },
      {
        "en": "Vous êtes brésiliens ?",
        "pt": "Vocês são brasileiros?"
      },
      {
        "en": "Ils sont en vacances",
        "pt": "Eles estão de férias"
      },
      {
        "en": "Elles sont sœurs",
        "pt": "Elas são irmãs"
      },
      {
        "en": "Nous sommes prêts",
        "pt": "Estamos prontos"
      },
      {
        "en": "Vous êtes très gentil",
        "pt": "O senhor é muito gentil"
      },
      {
        "en": "Ils sont arrivés",
        "pt": "Eles chegaram"
      },
      {
        "en": "Elles sont contentes",
        "pt": "Elas estão contentes"
      },
      {
        "en": "Nous sommes trois",
        "pt": "Somos três"
      },
      {
        "en": "Vous êtes où ?",
        "pt": "Onde vocês estão?"
      },
      {
        "en": "Ils sont à Paris",
        "pt": "Eles estão em Paris"
      },
      {
        "en": "Les enfants sont à l'école",
        "pt": "As crianças estão na escola"
      },
      {
        "en": "Mes amis sont sympas",
        "pt": "Meus amigos são legais"
      },
      {
        "en": "Vous êtes libres ?",
        "pt": "Vocês estão livres?"
      }
    ],
    "expressions": [
      {
        "expr": "Vous êtes combien ?",
        "meaning": "Vocês são quantos?",
        "example": "— Vous êtes combien ? — Nous sommes quatre."
      },
      {
        "expr": "Nous sommes ravis",
        "meaning": "Estamos encantados",
        "example": "Nous sommes ravis de vous accueillir !"
      },
      {
        "expr": "Vous êtes très aimable",
        "meaning": "O senhor é muito amável",
        "example": "Merci beaucoup, vous êtes très aimable."
      },
      {
        "expr": "Ils sont sur la même longueur d'onde",
        "meaning": "Eles estão na mesma sintonia",
        "example": "Paul et Marie ? Ils sont sur la même longueur d'onde."
      },
      {
        "expr": "Nous sommes partants !",
        "meaning": "Estamos dentro! (topamos)",
        "example": "Un pique-nique dimanche ? Nous sommes partants !"
      },
      {
        "expr": "Vous êtes servis !",
        "meaning": "Pronto, estão servidos!",
        "example": "Deux cafés et un thé… Voilà, vous êtes servis !"
      }
    ],
    "sentences": [
      "Nous sommes amis depuis dix ans.",
      "Vous êtes brésiliens ? — Oui, nous sommes de Recife.",
      "Ils sont en vacances au Portugal.",
      "Elles sont sœurs, mais elles sont très différentes.",
      "Nous sommes prêts, on peut partir.",
      "Les enfants sont à l'école jusqu'à quatre heures.",
      "Vous êtes libres ce soir ?",
      "Mes parents sont contents de leur voyage.",
      "Ils sont à Paris pour le travail.",
      "Vous êtes très gentil, merci beaucoup."
    ],
    "grammar": {
      "title": "ÊTRE no plural: sommes, êtes, sont",
      "rules": [
        "<b>Três formas para várias pessoas:</b> Nous SOMMES · Vous ÊTES · Ils / Elles SONT. O \"s\" de \"vous\" se liga ao \"ê\" com som de Z (ouça na Yara).",
        "<b>\"Vous\" formal ou plural:</b> \"Vous êtes\" serve para falar com várias pessoas e também com uma pessoa de forma educada (o senhor, a senhora). O adjetivo mostra quem é: \"Vous êtes gentil\" (um homem) · \"Vous êtes gentils\" (vários).",
        "<b>Cuidado: SONT x ONT:</b> \"Ils SONT\" (são) tem som de S; \"ils ONT\" (têm) liga o S ao O com som de Z. Errar isso muda o sentido!"
      ],
      "table": {
        "headers": [
          "Pronome",
          "Être",
          "Exemplo"
        ],
        "rows": [
          [
            "Nous",
            "sommes",
            "Nous sommes prêts"
          ],
          [
            "Vous",
            "êtes",
            "Vous êtes libres ?"
          ],
          [
            "Ils",
            "sont",
            "Ils sont à Paris"
          ],
          [
            "Elles",
            "sont",
            "Elles sont sœurs"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Complete: \"Nous ___ amis.\"",
        "a": "sommes",
        "opts": [
          "sont",
          "êtes",
          "sommes",
          "avons"
        ],
        "why": "Nous → sommes."
      },
      {
        "q": "Complete: \"Vous ___ brésiliens ?\"",
        "a": "êtes",
        "opts": [
          "sommes",
          "sont",
          "avez",
          "êtes"
        ],
        "why": "Vous → êtes."
      },
      {
        "q": "Complete: \"Ils ___ en vacances.\"",
        "a": "sont",
        "opts": [
          "sont",
          "ont",
          "est",
          "êtes"
        ],
        "why": "Ils → sont."
      },
      {
        "q": "\"Ils sont\" x \"ils ont\". Qual significa \"eles são\"?",
        "a": "Ils sont",
        "opts": [
          "Ils ont",
          "Ils sont",
          "Os dois",
          "Nenhum"
        ],
        "why": "\"Sont\" = são; \"ont\" = têm."
      },
      {
        "q": "\"Vous êtes très gentil\" fala com:",
        "a": "Uma pessoa, de forma educada",
        "opts": [
          "Várias pessoas",
          "Um amigo íntimo",
          "Uma pessoa, de forma educada",
          "Uma criança"
        ],
        "why": "\"Gentil\" no singular: uma pessoa tratada por \"vous\"."
      },
      {
        "q": "\"Nous sommes partants !\" significa:",
        "a": "Topamos! / Estamos dentro!",
        "opts": [
          "Estamos partindo.",
          "Somos parentes.",
          "Estamos cansados.",
          "Topamos! / Estamos dentro!"
        ],
        "why": "Être partant = topar."
      },
      {
        "q": "Complete: \"Les enfants ___ à l'école.\"",
        "a": "sont",
        "opts": [
          "sont",
          "est",
          "ont",
          "sommes"
        ],
        "why": "\"Les enfants\" = ils → sont."
      },
      {
        "q": "Complete: \"Mes sœurs ___ contentes.\"",
        "a": "sont",
        "opts": [
          "est",
          "sont",
          "êtes",
          "ont"
        ],
        "why": "\"Mes sœurs\" = elles → sont."
      },
      {
        "q": "\"Vous êtes où ?\" significa:",
        "a": "Onde vocês estão?",
        "opts": [
          "Quem são vocês?",
          "De onde vocês são?",
          "Onde vocês estão?",
          "Quando vocês vêm?"
        ],
        "why": "Où = onde."
      },
      {
        "q": "\"Vous êtes servis !\" quer dizer:",
        "a": "Pronto, estão servidos!",
        "opts": [
          "Vocês são garçons!",
          "Sirvam-se!",
          "Vocês estão atrasados!",
          "Pronto, estão servidos!"
        ],
        "why": "Dito ao entregar o pedido."
      }
    ],
    "speak": [
      "Nous sommes amis depuis dix ans.",
      "Vous êtes brésiliens ? Nous aussi !",
      "Ils sont en vacances au Portugal.",
      "Elles sont sœurs, mais elles sont très différentes.",
      "Nous sommes prêts, on y va !",
      "Vous êtes libres ce soir ?",
      "Merci, vous êtes très aimable.",
      "Un pique-nique dimanche ? Nous sommes partants !"
    ]
  },
  {
    "id": 227,
    "title": "Avoir au Singulier : j'ai, tu as, il a",
    "emoji": "🎒",
    "lang": "fr",
    "verbs": [
      "J'ai",
      "Tu as",
      "Il a",
      "Elle a",
      "On a"
    ],
    "vocab": [
      {
        "en": "J'ai",
        "pt": "Eu tenho"
      },
      {
        "en": "Tu as",
        "pt": "Você tem (informal)"
      },
      {
        "en": "Il a",
        "pt": "Ele tem"
      },
      {
        "en": "Elle a",
        "pt": "Ela tem"
      },
      {
        "en": "On a",
        "pt": "A gente tem"
      },
      {
        "en": "J'ai une voiture",
        "pt": "Eu tenho um carro"
      },
      {
        "en": "Tu as un stylo ?",
        "pt": "Você tem uma caneta?"
      },
      {
        "en": "Il a un chien",
        "pt": "Ele tem um cachorro"
      },
      {
        "en": "Elle a les yeux bleus",
        "pt": "Ela tem olhos azuis"
      },
      {
        "en": "On a le temps",
        "pt": "A gente tem tempo"
      },
      {
        "en": "J'ai une question",
        "pt": "Tenho uma pergunta"
      },
      {
        "en": "Tu as raison",
        "pt": "Você tem razão"
      },
      {
        "en": "Il a tort",
        "pt": "Ele está errado"
      },
      {
        "en": "Elle a de la chance",
        "pt": "Ela tem sorte"
      },
      {
        "en": "J'ai une idée !",
        "pt": "Tenho uma ideia!"
      },
      {
        "en": "Tu as faim ?",
        "pt": "Você está com fome?"
      },
      {
        "en": "Il a mal au dos",
        "pt": "Ele está com dor nas costas"
      },
      {
        "en": "On a un problème",
        "pt": "A gente tem um problema"
      }
    ],
    "expressions": [
      {
        "expr": "Tu as raison",
        "meaning": "Você tem razão",
        "example": "— Il fait froid, prends un pull. — Tu as raison !"
      },
      {
        "expr": "J'ai une idée !",
        "meaning": "Tive uma ideia!",
        "example": "J'ai une idée ! On va au cinéma ce soir ?"
      },
      {
        "expr": "Il a tort",
        "meaning": "Ele está errado",
        "example": "Il dit que Paris est la capitale de l'Italie ? Il a tort !"
      },
      {
        "expr": "Elle a de la chance",
        "meaning": "Ela tem sorte",
        "example": "Elle a gagné un voyage ? Elle a de la chance !"
      },
      {
        "expr": "On a un problème",
        "meaning": "Temos um problema",
        "example": "Le train est annulé… on a un problème."
      },
      {
        "expr": "Tu as deux minutes ?",
        "meaning": "Você tem dois minutinhos?",
        "example": "Tu as deux minutes ? J'ai une question."
      }
    ],
    "sentences": [
      "J'ai une voiture rouge.",
      "Tu as un stylo, s'il te plaît ?",
      "Il a un chien et deux chats.",
      "Elle a les yeux bleus comme sa mère.",
      "On a le temps, le film commence à neuf heures.",
      "J'ai une question sur l'exercice.",
      "Tu as raison, il fait trop froid.",
      "Il a mal au dos, il a beaucoup travaillé.",
      "Elle a de la chance, elle a gagné !",
      "J'ai une idée : on fait une fête samedi !"
    ],
    "grammar": {
      "title": "AVOIR no singular: ai, as, a",
      "rules": [
        "<b>Três formas para uma pessoa:</b> J'AI · Tu AS · Il / Elle / On A. \"Je\" vira \"j'\" antes de vogal: \"j'ai\", nunca \"je ai\".",
        "<b>Ter razão e estar errado:</b> O francês usa AVOIR: \"avoir raison\" (ter razão) e \"avoir tort\" (estar errado). \"Tu as raison\", \"Il a tort\".",
        "<b>\"A\" sem acento:</b> \"Il a\" (ele tem) é o verbo, sem acento. \"À\" com acento é preposição (a, para): \"Il a un rendez-vous à dix heures\"."
      ],
      "table": {
        "headers": [
          "Pronome",
          "Avoir",
          "Exemplo"
        ],
        "rows": [
          [
            "Je",
            "ai (j'ai)",
            "J'ai une idée"
          ],
          [
            "Tu",
            "as",
            "Tu as raison"
          ],
          [
            "Il / Elle",
            "a",
            "Elle a de la chance"
          ],
          [
            "On",
            "a",
            "On a le temps"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Complete: \"___ une voiture.\" (eu)",
        "a": "J'ai",
        "opts": [
          "Je ai",
          "Je as",
          "J'a",
          "J'ai"
        ],
        "why": "Je + ai = j'ai."
      },
      {
        "q": "Complete: \"Tu ___ un stylo ?\"",
        "a": "as",
        "opts": [
          "as",
          "a",
          "ai",
          "es"
        ],
        "why": "Tu → as."
      },
      {
        "q": "Complete: \"Il ___ un chien.\"",
        "a": "a",
        "opts": [
          "à",
          "a",
          "as",
          "est"
        ],
        "why": "Il → a (sem acento)."
      },
      {
        "q": "\"Você tem razão\" é:",
        "a": "Tu as raison.",
        "opts": [
          "Tu es raison.",
          "Tu as la raison de.",
          "Tu as raison.",
          "Tu es raisonnable."
        ],
        "why": "Avoir raison."
      },
      {
        "q": "\"Il a tort\" significa:",
        "a": "Ele está errado.",
        "opts": [
          "Ele está torto.",
          "Ele tem uma torta.",
          "Ele tem razão.",
          "Ele está errado."
        ],
        "why": "Avoir tort = estar errado."
      },
      {
        "q": "Qual frase tem o \"a\" do verbo avoir?",
        "a": "Il a un rendez-vous.",
        "opts": [
          "Il a un rendez-vous.",
          "Il va à Paris.",
          "Elle parle à Paul.",
          "On mange à midi."
        ],
        "why": "\"A\" sem acento é o verbo."
      },
      {
        "q": "Complete: \"On ___ le temps.\"",
        "a": "a",
        "opts": [
          "avons",
          "a",
          "ont",
          "as"
        ],
        "why": "\"On\" conjuga como \"il\": on a."
      },
      {
        "q": "\"J'ai une idée !\" significa:",
        "a": "Tive uma ideia!",
        "opts": [
          "Não tenho ideia.",
          "Que ideia!",
          "Tive uma ideia!",
          "Que boa ideia a sua!"
        ],
        "why": "Avoir une idée."
      },
      {
        "q": "\"Elle a de la chance\" significa:",
        "a": "Ela tem sorte.",
        "opts": [
          "Ela tem uma chance.",
          "Ela está com azar.",
          "Ela tem dinheiro.",
          "Ela tem sorte."
        ],
        "why": "Avoir de la chance = ter sorte."
      },
      {
        "q": "\"Tu as deux minutes ?\" é usado para:",
        "a": "Pedir um momento de atenção",
        "opts": [
          "Pedir um momento de atenção",
          "Perguntar as horas",
          "Marcar um encontro",
          "Reclamar de atraso"
        ],
        "why": "Você tem um minutinho?"
      }
    ],
    "speak": [
      "J'ai une voiture rouge.",
      "Tu as un stylo, s'il te plaît ?",
      "Il a un chien et deux chats.",
      "Tu as raison, il fait froid.",
      "J'ai une idée ! On va au cinéma ?",
      "Elle a de la chance !",
      "On a le temps, le film commence à neuf heures.",
      "Tu as deux minutes ? J'ai une question."
    ]
  },
  {
    "id": 228,
    "title": "Avoir au Pluriel : nous avons, vous avez, ils ont",
    "emoji": "🧺",
    "lang": "fr",
    "verbs": [
      "Nous avons",
      "Vous avez",
      "Ils ont",
      "Elles ont",
      "Avoir"
    ],
    "vocab": [
      {
        "en": "Nous avons",
        "pt": "Nós temos"
      },
      {
        "en": "Vous avez",
        "pt": "Vocês têm / O senhor tem"
      },
      {
        "en": "Ils ont",
        "pt": "Eles têm"
      },
      {
        "en": "Elles ont",
        "pt": "Elas têm"
      },
      {
        "en": "Nous avons une réservation",
        "pt": "Temos uma reserva"
      },
      {
        "en": "Vous avez une chambre ?",
        "pt": "Vocês têm um quarto?"
      },
      {
        "en": "Ils ont deux enfants",
        "pt": "Eles têm dois filhos"
      },
      {
        "en": "Elles ont faim",
        "pt": "Elas estão com fome"
      },
      {
        "en": "Nous avons cours",
        "pt": "Temos aula"
      },
      {
        "en": "Vous avez raison",
        "pt": "O senhor tem razão"
      },
      {
        "en": "Ils ont une maison à la campagne",
        "pt": "Eles têm uma casa no campo"
      },
      {
        "en": "Nous avons le temps",
        "pt": "Temos tempo"
      },
      {
        "en": "Vous avez des questions ?",
        "pt": "Vocês têm perguntas?"
      },
      {
        "en": "Elles ont un chat",
        "pt": "Elas têm um gato"
      },
      {
        "en": "Les voisins ont un jardin",
        "pt": "Os vizinhos têm um jardim"
      },
      {
        "en": "Nous avons besoin d'aide",
        "pt": "Precisamos de ajuda"
      },
      {
        "en": "Vous avez de la monnaie ?",
        "pt": "Vocês têm troco?"
      },
      {
        "en": "Ils ont froid",
        "pt": "Eles estão com frio"
      }
    ],
    "expressions": [
      {
        "expr": "Vous avez une réservation ?",
        "meaning": "Vocês têm reserva?",
        "example": "— Bonsoir, vous avez une réservation ? — Oui, au nom de Silva."
      },
      {
        "expr": "Nous avons besoin de…",
        "meaning": "Precisamos de…",
        "example": "Nous avons besoin de deux chambres pour ce soir."
      },
      {
        "expr": "Vous avez des questions ?",
        "meaning": "Vocês têm perguntas?",
        "example": "C'est la fin de la présentation. Vous avez des questions ?"
      },
      {
        "expr": "Ils ont l'air contents",
        "meaning": "Eles parecem contentes",
        "example": "Regarde les enfants, ils ont l'air contents !"
      },
      {
        "expr": "Nous avons hâte de…",
        "meaning": "Estamos ansiosos para…",
        "example": "Nous avons hâte de vous voir à Paris !"
      },
      {
        "expr": "Vous avez tout ce qu'il faut ?",
        "meaning": "Vocês têm tudo de que precisam?",
        "example": "Vous avez tout ce qu'il faut ? Bonne soirée !"
      }
    ],
    "sentences": [
      "Nous avons une réservation pour deux personnes.",
      "Vous avez une chambre pour ce soir ?",
      "Ils ont deux enfants et un chien.",
      "Elles ont faim, on prépare le dîner ?",
      "Nous avons cours le lundi et le mercredi.",
      "Vous avez raison, madame.",
      "Ils ont une maison à la campagne.",
      "Les enfants ont froid, ferme la fenêtre.",
      "Nous avons hâte de partir en vacances !",
      "Vous avez des questions ? N'hésitez pas."
    ],
    "grammar": {
      "title": "AVOIR no plural: avons, avez, ont",
      "rules": [
        "<b>Três formas para várias pessoas:</b> Nous AVONS · Vous AVEZ · Ils / Elles ONT. Com \"nous\" e \"vous\" o S se liga ao A com som de Z (ouça na Yara).",
        "<b>ILS ONT x ILS SONT:</b> \"Ils ont\" liga o S ao O com som de Z e significa \"eles têm\". \"Ils sont\" tem som de S e significa \"eles são\". É a dupla que mais confunde.",
        "<b>\"Avoir l'air\" = parecer:</b> \"Ils ont l'air contents\" (eles parecem contentes). \"Avoir hâte de\" = estar ansioso para."
      ],
      "table": {
        "headers": [
          "Pronome",
          "Avoir",
          "Être (compare)"
        ],
        "rows": [
          [
            "Nous",
            "avons",
            "sommes"
          ],
          [
            "Vous",
            "avez",
            "êtes"
          ],
          [
            "Ils / Elles",
            "ont",
            "sont"
          ],
          [
            "Exemplo",
            "Ils ont froid",
            "Ils sont fatigués"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Complete: \"Nous ___ une réservation.\"",
        "a": "avons",
        "opts": [
          "avons",
          "sommes",
          "avez",
          "ont"
        ],
        "why": "Nous → avons."
      },
      {
        "q": "Complete: \"Vous ___ une chambre ?\"",
        "a": "avez",
        "opts": [
          "avons",
          "avez",
          "êtes",
          "ont"
        ],
        "why": "Vous → avez."
      },
      {
        "q": "Complete: \"Ils ___ deux enfants.\"",
        "a": "ont",
        "opts": [
          "sont",
          "a",
          "ont",
          "avez"
        ],
        "why": "Ter filhos: AVOIR → ils ont."
      },
      {
        "q": "\"Eles estão com frio\" é:",
        "a": "Ils ont froid.",
        "opts": [
          "Ils sont froid.",
          "Ils a froid.",
          "Il font froid.",
          "Ils ont froid."
        ],
        "why": "Sensação com AVOIR: ils ont froid."
      },
      {
        "q": "\"Eles estão cansados\" é:",
        "a": "Ils sont fatigués.",
        "opts": [
          "Ils sont fatigués.",
          "Ils ont fatigués.",
          "Ils sont fatigué.",
          "Ils ont fatigue."
        ],
        "why": "Estado com ÊTRE, adjetivo no plural."
      },
      {
        "q": "Qual tem som de Z?",
        "a": "Ils ont",
        "opts": [
          "Ils sont",
          "Ils ont",
          "Il est",
          "Il sait"
        ],
        "why": "Em \"ils ont\" o S se liga ao O com som de Z."
      },
      {
        "q": "\"Nous avons hâte de partir\" significa:",
        "a": "Estamos ansiosos para partir.",
        "opts": [
          "Temos pressa de partir.",
          "Odiamos partir.",
          "Estamos ansiosos para partir.",
          "Temos que partir."
        ],
        "why": "Avoir hâte de = estar ansioso para."
      },
      {
        "q": "\"Ils ont l'air contents\" significa:",
        "a": "Eles parecem contentes.",
        "opts": [
          "Eles têm ar fresco.",
          "Eles estão no ar.",
          "Eles são contentes.",
          "Eles parecem contentes."
        ],
        "why": "Avoir l'air = parecer."
      },
      {
        "q": "Complete: \"Les voisins ___ un jardin.\"",
        "a": "ont",
        "opts": [
          "ont",
          "sont",
          "a",
          "avons"
        ],
        "why": "\"Les voisins\" = ils → ont."
      },
      {
        "q": "\"Vous avez de la monnaie ?\" pergunta se:",
        "a": "A pessoa tem troco.",
        "opts": [
          "A pessoa tem dinheiro estrangeiro.",
          "A pessoa tem troco.",
          "A pessoa quer pagar.",
          "A pessoa tem moedas antigas."
        ],
        "why": "Monnaie = troco."
      }
    ],
    "speak": [
      "Nous avons une réservation pour deux.",
      "Vous avez une chambre pour ce soir ?",
      "Ils ont deux enfants et un chien.",
      "Les enfants ont froid, ferme la fenêtre.",
      "Nous avons hâte de partir en vacances !",
      "Vous avez raison, madame.",
      "Regarde, ils ont l'air contents !",
      "Vous avez des questions ?"
    ]
  },
  {
    "id": 229,
    "title": "La Négation : je ne suis pas, je n'ai pas",
    "emoji": "🚫",
    "lang": "fr",
    "verbs": [
      "Ne pas être",
      "Ne pas avoir",
      "Ne plus",
      "Ne jamais",
      "Pas de"
    ],
    "vocab": [
      {
        "en": "Je ne suis pas",
        "pt": "Eu não sou / não estou"
      },
      {
        "en": "Je n'ai pas",
        "pt": "Eu não tenho"
      },
      {
        "en": "Tu n'es pas",
        "pt": "Você não é / não está"
      },
      {
        "en": "Il n'a pas",
        "pt": "Ele não tem"
      },
      {
        "en": "Nous ne sommes pas",
        "pt": "Nós não somos"
      },
      {
        "en": "Vous n'avez pas",
        "pt": "Vocês não têm"
      },
      {
        "en": "Ils ne sont pas",
        "pt": "Eles não são"
      },
      {
        "en": "Elles n'ont pas",
        "pt": "Elas não têm"
      },
      {
        "en": "Je n'ai pas de voiture",
        "pt": "Não tenho carro"
      },
      {
        "en": "Il n'y a pas de pain",
        "pt": "Não tem pão"
      },
      {
        "en": "Je ne suis pas d'accord",
        "pt": "Não concordo"
      },
      {
        "en": "Je ne suis plus fatigué",
        "pt": "Não estou mais cansado"
      },
      {
        "en": "Je n'ai jamais froid",
        "pt": "Nunca sinto frio"
      },
      {
        "en": "Ce n'est pas grave",
        "pt": "Não é grave / Tudo bem"
      },
      {
        "en": "Je n'ai pas le temps",
        "pt": "Não tenho tempo"
      },
      {
        "en": "Je n'ai rien",
        "pt": "Não tenho nada"
      },
      {
        "en": "Il n'est pas là",
        "pt": "Ele não está"
      },
      {
        "en": "Je ne suis pas sûr",
        "pt": "Não tenho certeza"
      }
    ],
    "expressions": [
      {
        "expr": "Ce n'est pas grave",
        "meaning": "Não tem problema / Não é grave",
        "example": "— Pardon, je suis en retard ! — Ce n'est pas grave."
      },
      {
        "expr": "Je ne suis pas d'accord",
        "meaning": "Não concordo",
        "example": "Je ne suis pas d'accord, le film est excellent !"
      },
      {
        "expr": "Je n'en ai aucune idée",
        "meaning": "Não faço a menor ideia",
        "example": "— Où sont les clés ? — Je n'en ai aucune idée !"
      },
      {
        "expr": "Il n'est pas là",
        "meaning": "Ele não está (aqui)",
        "example": "— Je voudrais parler à Marc. — Désolé, il n'est pas là."
      },
      {
        "expr": "Je n'ai pas de chance",
        "meaning": "Estou sem sorte",
        "example": "Encore une panne ? Je n'ai pas de chance !"
      },
      {
        "expr": "T'es pas sérieux !",
        "meaning": "Você não está falando sério! (informal)",
        "example": "Tu as perdu ton passeport ? T'es pas sérieux !"
      }
    ],
    "sentences": [
      "Je ne suis pas fatigué, on continue.",
      "Je n'ai pas de voiture, je prends le bus.",
      "Il n'est pas là, il est en réunion.",
      "Nous ne sommes pas d'accord avec la décision.",
      "Elles n'ont pas faim, elles ont déjà mangé.",
      "Il n'y a pas de lait dans le frigo.",
      "Ce n'est pas grave, ça arrive.",
      "Je ne suis plus malade, merci.",
      "Vous n'avez pas de monnaie ?",
      "Je n'ai jamais peur dans l'avion."
    ],
    "grammar": {
      "title": "A negação abraça o verbo: NE + verbo + PAS",
      "rules": [
        "<b>NE … PAS em volta do verbo:</b> \"Je ne suis pas\", \"Tu n'es pas\". Antes de vogal, \"ne\" vira \"n'\": \"je n'ai pas\", \"il n'a pas\", \"vous n'avez pas\".",
        "<b>Depois de \"pas\", o artigo vira DE:</b> \"J'ai une voiture\" → \"Je n'ai pas DE voiture\". \"Il y a du pain\" → \"Il n'y a pas DE pain\". Mas com être o artigo fica: \"Ce n'est pas un problème\".",
        "<b>Outras negações:</b> \"Ne… plus\" = não… mais (\"je ne suis plus malade\"). \"Ne… jamais\" = nunca (\"je n'ai jamais froid\"). \"Ne… rien\" = nada (\"je n'ai rien\"). Na fala, o \"ne\" muitas vezes some: \"T'es pas sérieux !\"."
      ],
      "table": {
        "headers": [
          "Afirmativa",
          "Negativa",
          "Detalhe"
        ],
        "rows": [
          [
            "Je suis prêt",
            "Je ne suis pas prêt",
            "ne + suis + pas"
          ],
          [
            "J'ai un chien",
            "Je n'ai pas de chien",
            "un vira de"
          ],
          [
            "Il y a du pain",
            "Il n'y a pas de pain",
            "du vira de"
          ],
          [
            "C'est un problème",
            "Ce n'est pas un problème",
            "com être, fica \"un\""
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Negue: \"Je suis fatigué.\"",
        "a": "Je ne suis pas fatigué.",
        "opts": [
          "Je suis pas ne fatigué.",
          "Je ne suis pas fatigué.",
          "Je ne pas suis fatigué.",
          "Je n'ai pas fatigué."
        ],
        "why": "Ne + verbo + pas."
      },
      {
        "q": "Negue: \"J'ai une voiture.\"",
        "a": "Je n'ai pas de voiture.",
        "opts": [
          "Je n'ai pas une voiture.",
          "Je ne ai pas de voiture.",
          "Je n'ai pas de voiture.",
          "Je n'ai voiture pas."
        ],
        "why": "N' antes de vogal e \"une\" vira \"de\"."
      },
      {
        "q": "Negue: \"Il y a du pain.\"",
        "a": "Il n'y a pas de pain.",
        "opts": [
          "Il n'y a pas du pain.",
          "Il y a pas pain.",
          "Il ne y a pas de pain.",
          "Il n'y a pas de pain."
        ],
        "why": "Du vira \"de\"."
      },
      {
        "q": "Negue: \"C'est un problème.\"",
        "a": "Ce n'est pas un problème.",
        "opts": [
          "Ce n'est pas un problème.",
          "Ce n'est pas de problème.",
          "C'est ne pas un problème.",
          "Ce n'a pas un problème."
        ],
        "why": "Com être, o artigo fica."
      },
      {
        "q": "\"Je ne suis plus malade\" significa:",
        "a": "Não estou mais doente.",
        "opts": [
          "Estou mais doente.",
          "Não estou mais doente.",
          "Nunca fico doente.",
          "Não estou doente ainda."
        ],
        "why": "Ne… plus = não… mais."
      },
      {
        "q": "\"Je n'ai jamais froid\" significa:",
        "a": "Nunca sinto frio.",
        "opts": [
          "Não estou com frio agora.",
          "Já estive com frio.",
          "Nunca sinto frio.",
          "Não tenho mais frio."
        ],
        "why": "Ne… jamais = nunca."
      },
      {
        "q": "\"Ce n'est pas grave\" serve para:",
        "a": "Dizer que não tem problema",
        "opts": [
          "Dizer que algo é sério",
          "Reclamar",
          "Pedir desculpas",
          "Dizer que não tem problema"
        ],
        "why": "Resposta tranquilizadora."
      },
      {
        "q": "Complete: \"Elles ___ faim.\" (não têm)",
        "a": "n'ont pas",
        "opts": [
          "n'ont pas",
          "ne sont pas",
          "n'ont",
          "ont pas ne"
        ],
        "why": "Fome com AVOIR, negado: n'ont pas."
      },
      {
        "q": "\"Je n'en ai aucune idée\" significa:",
        "a": "Não faço a menor ideia.",
        "opts": [
          "Tenho uma ideia.",
          "Não faço a menor ideia.",
          "Não tenho nenhuma pergunta.",
          "Não quero ideias."
        ],
        "why": "Expressão comum."
      },
      {
        "q": "Na fala informal, \"Tu n'es pas sérieux\" vira:",
        "a": "T'es pas sérieux !",
        "opts": [
          "Tu es n'pas sérieux !",
          "Tu pas sérieux !",
          "T'es pas sérieux !",
          "T'as pas sérieux !"
        ],
        "why": "O \"ne\" cai e \"tu es\" vira \"t'es\"."
      }
    ],
    "speak": [
      "Je ne suis pas fatigué, on continue !",
      "Je n'ai pas de voiture, je prends le bus.",
      "Il n'est pas là, il est en réunion.",
      "Il n'y a pas de lait dans le frigo.",
      "Ce n'est pas grave, ça arrive.",
      "Je ne suis pas d'accord avec toi.",
      "Je ne suis plus malade, merci !",
      "Où sont les clés ? Je n'en ai aucune idée !"
    ]
  },
  {
    "id": 230,
    "title": "Les Questions : Tu es… ? Est-ce que tu as… ?",
    "emoji": "❓",
    "lang": "fr",
    "verbs": [
      "Est-ce que",
      "Êtes-vous",
      "Avez-vous",
      "As-tu",
      "Es-tu"
    ],
    "vocab": [
      {
        "en": "Tu es prêt ?",
        "pt": "Você está pronto?"
      },
      {
        "en": "Est-ce que tu es prêt ?",
        "pt": "Você está pronto? (neutro)"
      },
      {
        "en": "Es-tu prêt ?",
        "pt": "Estás pronto? (formal escrito)"
      },
      {
        "en": "Tu as faim ?",
        "pt": "Você está com fome?"
      },
      {
        "en": "Est-ce que tu as faim ?",
        "pt": "Você está com fome? (neutro)"
      },
      {
        "en": "As-tu faim ?",
        "pt": "Tens fome? (formal)"
      },
      {
        "en": "Vous êtes français ?",
        "pt": "O senhor é francês?"
      },
      {
        "en": "Êtes-vous français ?",
        "pt": "O senhor é francês? (formal)"
      },
      {
        "en": "Avez-vous une réservation ?",
        "pt": "O senhor tem reserva? (formal)"
      },
      {
        "en": "A-t-il un frère ?",
        "pt": "Ele tem um irmão? (formal)"
      },
      {
        "en": "Est-elle là ?",
        "pt": "Ela está? (formal)"
      },
      {
        "en": "Qu'est-ce que tu as ?",
        "pt": "O que você tem? (o que houve?)"
      },
      {
        "en": "Où es-tu ?",
        "pt": "Onde você está?"
      },
      {
        "en": "Tu as quel âge ?",
        "pt": "Quantos anos você tem?"
      },
      {
        "en": "C'est qui ?",
        "pt": "Quem é?"
      },
      {
        "en": "C'est quoi ?",
        "pt": "O que é?"
      },
      {
        "en": "Pourquoi tu es triste ?",
        "pt": "Por que você está triste?"
      },
      {
        "en": "Combien avez-vous ?",
        "pt": "Quanto vocês têm?"
      }
    ],
    "expressions": [
      {
        "expr": "Qu'est-ce que tu as ?",
        "meaning": "O que você tem? / O que houve?",
        "example": "Tu es tout pâle. Qu'est-ce que tu as ?"
      },
      {
        "expr": "Est-ce que vous avez… ?",
        "meaning": "O senhor tem…?",
        "example": "Est-ce que vous avez une table pour deux ?"
      },
      {
        "expr": "Tu es sûr de toi ?",
        "meaning": "Você tem certeza do que diz?",
        "example": "Tu es sûr de toi ? C'est une grosse décision."
      },
      {
        "expr": "Ça va, tu es bien installé ?",
        "meaning": "Tudo bem, ficou bem acomodado?",
        "example": "Ça va, tu es bien installé dans le nouvel appartement ?"
      },
      {
        "expr": "Avez-vous besoin d'aide ?",
        "meaning": "O senhor precisa de ajuda?",
        "example": "Avez-vous besoin d'aide avec vos bagages ?"
      },
      {
        "expr": "C'est qui ?",
        "meaning": "Quem é?",
        "example": "On sonne à la porte… C'est qui ?"
      }
    ],
    "sentences": [
      "Tu es prêt ? On part dans cinq minutes.",
      "Est-ce que tu as faim ? Il y a des pâtes.",
      "Êtes-vous libre jeudi matin ?",
      "Avez-vous une réservation, monsieur ?",
      "Qu'est-ce que tu as ? Tu es triste ?",
      "Est-ce que vous êtes d'accord ?",
      "Où es-tu ? Je suis devant la gare.",
      "A-t-il des frères et sœurs ?",
      "C'est qui, la fille avec le chapeau ?",
      "Pourquoi tu es en retard ?"
    ],
    "grammar": {
      "title": "Perguntar de três jeitos",
      "rules": [
        "<b>1. Só a entonação (fala do dia a dia):</b> A frase fica igual e a voz sobe no final: \"Tu es prêt ?\", \"Tu as faim ?\". É o jeito mais comum na conversa.",
        "<b>2. \"Est-ce que\" + frase (neutro):</b> \"Est-ce que tu es prêt ?\", \"Est-ce que vous avez une chambre ?\". Serve em qualquer situação. Antes de vogal: \"est-ce qu'il a…\".",
        "<b>3. Inversão (formal e escrito):</b> O verbo vem antes do pronome, com hífen: \"Êtes-vous libre ?\", \"Avez-vous une réservation ?\". Com \"il/elle\" + vogal entra um T: \"A-t-il un frère ?\"."
      ],
      "table": {
        "headers": [
          "Informal",
          "Neutro",
          "Formal"
        ],
        "rows": [
          [
            "Tu es prêt ?",
            "Est-ce que tu es prêt ?",
            "Es-tu prêt ?"
          ],
          [
            "Tu as faim ?",
            "Est-ce que tu as faim ?",
            "As-tu faim ?"
          ],
          [
            "Vous êtes libre ?",
            "Est-ce que vous êtes libre ?",
            "Êtes-vous libre ?"
          ],
          [
            "Il a un frère ?",
            "Est-ce qu'il a un frère ?",
            "A-t-il un frère ?"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Qual é a forma formal de \"Vous avez une réservation ?\"",
        "a": "Avez-vous une réservation ?",
        "opts": [
          "Vous-avez une réservation ?",
          "Avez vous-une réservation ?",
          "Avez-vous une réservation ?",
          "Est-vous une réservation ?"
        ],
        "why": "Inversão: verbo-pronome com hífen."
      },
      {
        "q": "Complete com a inversão: \"___ il un frère ?\"",
        "a": "A-t-",
        "opts": [
          "A-",
          "At-",
          "Est-ce",
          "A-t-"
        ],
        "why": "Il + vogal pede um T: \"a-t-il\"."
      },
      {
        "q": "\"Est-ce que tu as faim ?\" é:",
        "a": "Uma pergunta neutra",
        "opts": [
          "Uma pergunta neutra",
          "Uma afirmação",
          "Uma pergunta muito formal",
          "Uma negação"
        ],
        "why": "\"Est-ce que\" serve em qualquer situação."
      },
      {
        "q": "\"Qu'est-ce que tu as ?\" significa:",
        "a": "O que você tem? / O que houve?",
        "opts": [
          "O que você quer?",
          "O que você tem? / O que houve?",
          "O que você é?",
          "Quantos anos você tem?"
        ],
        "why": "Pergunta por um problema."
      },
      {
        "q": "Forma formal de \"Tu es prêt ?\":",
        "a": "Es-tu prêt ?",
        "opts": [
          "Tu-es prêt ?",
          "Est-tu prêt ?",
          "Es-tu prêt ?",
          "Es tu-prêt ?"
        ],
        "why": "Verbo + hífen + pronome."
      },
      {
        "q": "\"Est-ce qu'il a une voiture ?\" Por que \"qu'\"?",
        "a": "Porque \"il\" começa com vogal",
        "opts": [
          "Porque é formal",
          "Porque é negação",
          "Porque é plural",
          "Porque \"il\" começa com vogal"
        ],
        "why": "Que + il = qu'il."
      },
      {
        "q": "\"C'est qui ?\" pergunta:",
        "a": "Quem é?",
        "opts": [
          "Quem é?",
          "O que é?",
          "Onde é?",
          "Quando é?"
        ],
        "why": "Qui = quem."
      },
      {
        "q": "Qual pergunta é mais comum na conversa do dia a dia?",
        "a": "Tu es prêt ?",
        "opts": [
          "Es-tu prêt ?",
          "Tu es prêt ?",
          "Êtes-vous prêt ?",
          "Est-il prêt ?"
        ],
        "why": "Na fala, basta a entonação."
      },
      {
        "q": "\"Avez-vous besoin d'aide ?\" significa:",
        "a": "O senhor precisa de ajuda?",
        "opts": [
          "O senhor ajudou?",
          "O senhor tem ajudante?",
          "O senhor precisa de ajuda?",
          "Posso pedir ajuda?"
        ],
        "why": "Avoir besoin de = precisar de."
      },
      {
        "q": "Complete: \"Où ___-tu ?\" (estar)",
        "a": "es",
        "opts": [
          "as",
          "est",
          "êtes",
          "es"
        ],
        "why": "\"Où es-tu ?\" = onde você está?"
      }
    ],
    "speak": [
      "Tu es prêt ? On part dans cinq minutes.",
      "Est-ce que tu as faim ?",
      "Êtes-vous libre jeudi matin ?",
      "Avez-vous une réservation, madame ?",
      "Qu'est-ce que tu as ? Tu es triste ?",
      "Est-ce que vous êtes d'accord ?",
      "Où es-tu ? Je suis devant la gare.",
      "Avez-vous besoin d'aide avec vos bagages ?"
    ]
  },
  {
    "id": 231,
    "title": "Les Expressions avec Avoir",
    "emoji": "🧩",
    "lang": "fr",
    "verbs": [
      "Avoir besoin de",
      "Avoir envie de",
      "Avoir l'air",
      "Avoir mal à",
      "Avoir hâte de"
    ],
    "vocab": [
      {
        "en": "Avoir besoin de",
        "pt": "Precisar de"
      },
      {
        "en": "Avoir envie de",
        "pt": "Ter vontade de"
      },
      {
        "en": "Avoir l'air",
        "pt": "Parecer"
      },
      {
        "en": "Avoir mal à",
        "pt": "Ter dor em"
      },
      {
        "en": "Avoir hâte de",
        "pt": "Estar ansioso para"
      },
      {
        "en": "Avoir raison",
        "pt": "Ter razão"
      },
      {
        "en": "Avoir tort",
        "pt": "Estar errado"
      },
      {
        "en": "Avoir de la chance",
        "pt": "Ter sorte"
      },
      {
        "en": "Avoir honte",
        "pt": "Ter vergonha"
      },
      {
        "en": "Avoir peur de",
        "pt": "Ter medo de"
      },
      {
        "en": "Avoir l'habitude de",
        "pt": "Ter o costume de"
      },
      {
        "en": "Avoir lieu",
        "pt": "Acontecer (evento)"
      },
      {
        "en": "Avoir du mal à",
        "pt": "Ter dificuldade para"
      },
      {
        "en": "Avoir rendez-vous",
        "pt": "Ter um encontro / consulta"
      },
      {
        "en": "Avoir l'occasion de",
        "pt": "Ter a oportunidade de"
      },
      {
        "en": "Avoir sommeil",
        "pt": "Estar com sono"
      },
      {
        "en": "Avoir le cafard",
        "pt": "Estar na fossa (triste)"
      },
      {
        "en": "En avoir marre",
        "pt": "Estar de saco cheio (informal)"
      }
    ],
    "expressions": [
      {
        "expr": "J'ai besoin de vacances !",
        "meaning": "Preciso de férias!",
        "example": "Je travaille trop, j'ai besoin de vacances !"
      },
      {
        "expr": "Tu as l'air fatigué",
        "meaning": "Você parece cansado",
        "example": "Tu as l'air fatigué, tu as bien dormi ?"
      },
      {
        "expr": "La réunion a lieu à dix heures",
        "meaning": "A reunião acontece às dez",
        "example": "La réunion a lieu à dix heures dans la salle B."
      },
      {
        "expr": "J'ai honte",
        "meaning": "Estou com vergonha",
        "example": "J'ai oublié ton anniversaire, j'ai honte !"
      },
      {
        "expr": "J'en ai marre !",
        "meaning": "Estou de saco cheio!",
        "example": "Encore la pluie ? J'en ai marre !"
      },
      {
        "expr": "J'ai le cafard",
        "meaning": "Estou na fossa / pra baixo",
        "example": "Le dimanche soir, j'ai souvent le cafard."
      }
    ],
    "sentences": [
      "J'ai besoin d'un café, je suis fatigué.",
      "Tu as envie d'aller au cinéma ?",
      "Elle a l'air contente aujourd'hui.",
      "J'ai mal aux dents depuis hier.",
      "Nous avons hâte de vous voir !",
      "J'ai l'habitude de courir le matin.",
      "Le concert a lieu samedi soir.",
      "Il a du mal à comprendre l'accent du sud.",
      "Les enfants ont peur du noir.",
      "J'en ai marre de ce bruit !"
    ],
    "grammar": {
      "title": "Expressões que o português faz com \"estar\" e o francês faz com AVOIR",
      "rules": [
        "<b>AVOIR + nome, sem artigo:</b> Muitas expressões são AVOIR + um nome direto: \"avoir faim\", \"avoir peur\", \"avoir honte\", \"avoir besoin\", \"avoir envie\". O verbo é conjugado: \"nous avons besoin\".",
        "<b>Depois vem DE:</b> \"Avoir besoin DE\", \"avoir envie DE\", \"avoir peur DE\", \"avoir hâte DE\": \"J'ai envie de dormir\", \"J'ai besoin d'aide\". De + le = du: \"J'ai peur du chien\".",
        "<b>\"Avoir l'air\" = parecer:</b> \"Tu as l'air fatigué\" (você parece cansado). E \"avoir lieu\" = acontecer, para eventos: \"La fête a lieu samedi\"."
      ],
      "table": {
        "headers": [
          "Expressão",
          "Significado",
          "Exemplo"
        ],
        "rows": [
          [
            "Avoir besoin de",
            "Precisar de",
            "J'ai besoin d'aide"
          ],
          [
            "Avoir envie de",
            "Ter vontade de",
            "J'ai envie de dormir"
          ],
          [
            "Avoir l'air",
            "Parecer",
            "Il a l'air content"
          ],
          [
            "Avoir lieu",
            "Acontecer",
            "La fête a lieu samedi"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Preciso de um café\" é:",
        "a": "J'ai besoin d'un café.",
        "opts": [
          "Je suis besoin d'un café.",
          "J'ai besoin un café.",
          "Je besoin de café.",
          "J'ai besoin d'un café."
        ],
        "why": "Avoir besoin de + nome."
      },
      {
        "q": "\"Você parece cansado\" é:",
        "a": "Tu as l'air fatigué.",
        "opts": [
          "Tu as l'air fatigué.",
          "Tu es l'air fatigué.",
          "Tu parais avoir fatigué.",
          "Tu as air de fatigué."
        ],
        "why": "Avoir l'air = parecer."
      },
      {
        "q": "\"O concerto acontece sábado\" é:",
        "a": "Le concert a lieu samedi.",
        "opts": [
          "Le concert est lieu samedi.",
          "Le concert a lieu samedi.",
          "Le concert a lieu de samedi.",
          "Le concert se passe lieu samedi."
        ],
        "why": "Avoir lieu = acontecer."
      },
      {
        "q": "\"Estou com vergonha\" é:",
        "a": "J'ai honte.",
        "opts": [
          "Je suis honte.",
          "J'ai la honte de.",
          "J'ai honte.",
          "Je honte."
        ],
        "why": "Avoir honte."
      },
      {
        "q": "Complete: \"Les enfants ont peur ___ noir.\"",
        "a": "du",
        "opts": [
          "de le",
          "au",
          "des",
          "du"
        ],
        "why": "De + le = du."
      },
      {
        "q": "\"J'en ai marre !\" é:",
        "a": "Uma expressão informal de irritação",
        "opts": [
          "Uma expressão informal de irritação",
          "Uma forma educada de agradecer",
          "Um pedido de ajuda",
          "Um elogio"
        ],
        "why": "Estar de saco cheio."
      },
      {
        "q": "\"Il a du mal à comprendre\" significa:",
        "a": "Ele tem dificuldade para entender.",
        "opts": [
          "Ele entende mal de propósito.",
          "Ele tem dificuldade para entender.",
          "Ele está com dor.",
          "Ele entende tudo."
        ],
        "why": "Avoir du mal à = ter dificuldade."
      },
      {
        "q": "\"J'ai le cafard\" significa:",
        "a": "Estou triste, na fossa.",
        "opts": [
          "Tenho uma barata.",
          "Estou com fome.",
          "Estou triste, na fossa.",
          "Tenho um café."
        ],
        "why": "Avoir le cafard = estar para baixo."
      },
      {
        "q": "\"J'ai l'habitude de courir\" significa:",
        "a": "Costumo correr.",
        "opts": [
          "Preciso correr.",
          "Odeio correr.",
          "Vou correr agora.",
          "Costumo correr."
        ],
        "why": "Avoir l'habitude de = costumar."
      },
      {
        "q": "Complete: \"Nous avons hâte ___ vous voir.\"",
        "a": "de",
        "opts": [
          "de",
          "à",
          "pour",
          "que"
        ],
        "why": "Avoir hâte de + verbo."
      }
    ],
    "speak": [
      "J'ai besoin d'un café, je suis fatigué.",
      "Tu as envie d'aller au cinéma ce soir ?",
      "Elle a l'air contente aujourd'hui.",
      "Nous avons hâte de vous voir !",
      "La réunion a lieu à dix heures.",
      "J'ai l'habitude de courir le matin.",
      "Il a du mal à comprendre l'accent.",
      "Encore la pluie ? J'en ai marre !"
    ]
  },
  {
    "id": 232,
    "title": "Les Expressions avec Être",
    "emoji": "🎭",
    "lang": "fr",
    "verbs": [
      "Être en train de",
      "Être sur le point de",
      "Être d'accord",
      "Être en retard",
      "Être à"
    ],
    "vocab": [
      {
        "en": "Être en train de",
        "pt": "Estar fazendo (agora)"
      },
      {
        "en": "Être sur le point de",
        "pt": "Estar prestes a"
      },
      {
        "en": "Être d'accord",
        "pt": "Concordar"
      },
      {
        "en": "Être en retard",
        "pt": "Estar atrasado"
      },
      {
        "en": "Être à l'heure",
        "pt": "Estar na hora"
      },
      {
        "en": "Être en avance",
        "pt": "Estar adiantado"
      },
      {
        "en": "Être de bonne humeur",
        "pt": "Estar de bom humor"
      },
      {
        "en": "Être de mauvaise humeur",
        "pt": "Estar de mau humor"
      },
      {
        "en": "Être en forme",
        "pt": "Estar em forma / bem-disposto"
      },
      {
        "en": "Être pressé",
        "pt": "Estar com pressa"
      },
      {
        "en": "Être à l'aise",
        "pt": "Estar à vontade"
      },
      {
        "en": "Être au courant",
        "pt": "Estar a par (saber)"
      },
      {
        "en": "Être en panne",
        "pt": "Estar quebrado (máquina)"
      },
      {
        "en": "Être en vacances",
        "pt": "Estar de férias"
      },
      {
        "en": "Être de retour",
        "pt": "Estar de volta"
      },
      {
        "en": "Être à qui ?",
        "pt": "Ser de quem?"
      },
      {
        "en": "C'est à moi",
        "pt": "É meu"
      },
      {
        "en": "Être fier de",
        "pt": "Ter orgulho de"
      }
    ],
    "expressions": [
      {
        "expr": "Je suis en train de cuisiner",
        "meaning": "Estou cozinhando (agora)",
        "example": "Je ne peux pas parler, je suis en train de cuisiner."
      },
      {
        "expr": "Le train est sur le point de partir",
        "meaning": "O trem está prestes a partir",
        "example": "Vite ! Le train est sur le point de partir !"
      },
      {
        "expr": "Tu es au courant ?",
        "meaning": "Você está sabendo?",
        "example": "Tu es au courant ? Marie a eu un bébé !"
      },
      {
        "expr": "La voiture est en panne",
        "meaning": "O carro quebrou",
        "example": "Je prends le bus, ma voiture est en panne."
      },
      {
        "expr": "C'est à qui ?",
        "meaning": "É de quem? / É a vez de quem?",
        "example": "Ce sac, c'est à qui ? — C'est à moi !"
      },
      {
        "expr": "Je suis fier de toi",
        "meaning": "Tenho orgulho de você",
        "example": "Tu as réussi ton examen ? Je suis fier de toi !"
      }
    ],
    "sentences": [
      "Je suis en train de lire, je te rappelle.",
      "Le film est sur le point de commencer.",
      "Tu es d'accord avec moi ?",
      "Elle est de bonne humeur ce matin.",
      "Je suis de retour à la maison.",
      "Tu es au courant de la nouvelle ?",
      "L'ascenseur est en panne, on prend l'escalier.",
      "Ce téléphone est à toi ?",
      "Nous sommes fiers de notre fille.",
      "Je suis à l'aise avec mes nouveaux collègues."
    ],
    "grammar": {
      "title": "Expressões com ÊTRE que mudam o sentido da frase",
      "rules": [
        "<b>\"Être en train de\" + verbo:</b> Diz que a ação está acontecendo agora, como o gerúndio do português: \"Je suis en train de lire\" (estou lendo).",
        "<b>\"Être sur le point de\" + verbo:</b> Diz que algo vai acontecer em instantes: \"Le train est sur le point de partir\" (o trem está prestes a partir).",
        "<b>\"Être à\" = ser de:</b> Para dizer de quem é: \"C'est à moi\" (é meu), \"Ce sac est à Paul\" (esta bolsa é do Paul). Pergunta: \"C'est à qui ?\"."
      ],
      "table": {
        "headers": [
          "Expressão",
          "Uso",
          "Exemplo"
        ],
        "rows": [
          [
            "Être en train de",
            "Ação agora",
            "Il est en train de manger"
          ],
          [
            "Être sur le point de",
            "Logo vai acontecer",
            "Je suis sur le point de partir"
          ],
          [
            "Être à",
            "Posse",
            "C'est à moi"
          ],
          [
            "Être en panne",
            "Máquina quebrada",
            "La voiture est en panne"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Estou lendo (agora)\" é:",
        "a": "Je suis en train de lire.",
        "opts": [
          "Je suis en train de lire.",
          "J'ai en train de lire.",
          "Je suis lisant.",
          "Je suis en lire."
        ],
        "why": "Être en train de + infinitivo."
      },
      {
        "q": "\"O trem está prestes a partir\" é:",
        "a": "Le train est sur le point de partir.",
        "opts": [
          "Le train a sur le point de partir.",
          "Le train est sur le point de partir.",
          "Le train est au point partir.",
          "Le train est sur point partir."
        ],
        "why": "Être sur le point de."
      },
      {
        "q": "\"É meu\" (de quem é) é:",
        "a": "C'est à moi.",
        "opts": [
          "C'est de moi.",
          "J'ai à moi.",
          "C'est à moi.",
          "C'est mien."
        ],
        "why": "Être à + pronome tônico."
      },
      {
        "q": "\"A máquina quebrou\" é:",
        "a": "La machine est en panne.",
        "opts": [
          "La machine a en panne.",
          "La machine est cassée de panne.",
          "La machine a une panne en.",
          "La machine est en panne."
        ],
        "why": "Être en panne."
      },
      {
        "q": "\"Tu es au courant ?\" significa:",
        "a": "Você está sabendo?",
        "opts": [
          "Você está sabendo?",
          "Você está correndo?",
          "Você está na corrente?",
          "Você está atrasado?"
        ],
        "why": "Être au courant = estar a par."
      },
      {
        "q": "Complete: \"Elle est de bonne ___ ce matin.\"",
        "a": "humeur",
        "opts": [
          "humour",
          "humeur",
          "heure",
          "humide"
        ],
        "why": "Être de bonne humeur."
      },
      {
        "q": "\"Je suis de retour\" significa:",
        "a": "Estou de volta.",
        "opts": [
          "Estou voltando amanhã.",
          "Estou atrasado.",
          "Estou de volta.",
          "Estou indo embora."
        ],
        "why": "Être de retour."
      },
      {
        "q": "\"Je suis fier de toi\" significa:",
        "a": "Tenho orgulho de você.",
        "opts": [
          "Estou bravo com você.",
          "Confio em você.",
          "Sou parecido com você.",
          "Tenho orgulho de você."
        ],
        "why": "Être fier de."
      },
      {
        "q": "\"Je suis à l'aise\" significa:",
        "a": "Estou à vontade.",
        "opts": [
          "Estou à vontade.",
          "Estou com pressa.",
          "Estou ocupado.",
          "Estou em casa."
        ],
        "why": "Être à l'aise."
      },
      {
        "q": "Complete: \"Ce sac est ___ Paul.\"",
        "a": "à",
        "opts": [
          "de",
          "à",
          "pour",
          "chez"
        ],
        "why": "Posse com être à."
      }
    ],
    "speak": [
      "Je suis en train de lire, je te rappelle.",
      "Vite, le film est sur le point de commencer !",
      "Tu es d'accord avec moi ?",
      "Ma voiture est en panne, je prends le bus.",
      "Ce sac, c'est à qui ? — C'est à moi !",
      "Tu es au courant de la nouvelle ?",
      "Je suis de retour à la maison.",
      "Tu as réussi ? Je suis fier de toi !"
    ]
  },
  {
    "id": 233,
    "title": "C'est, Il est, Il y a",
    "emoji": "🔍",
    "lang": "fr",
    "verbs": [
      "C'est",
      "Il est",
      "Elle est",
      "Il y a",
      "Ce sont"
    ],
    "vocab": [
      {
        "en": "C'est mon frère",
        "pt": "É o meu irmão"
      },
      {
        "en": "Il est médecin",
        "pt": "Ele é médico"
      },
      {
        "en": "C'est un bon médecin",
        "pt": "É um bom médico"
      },
      {
        "en": "Ce sont mes amis",
        "pt": "São meus amigos"
      },
      {
        "en": "Il y a un problème",
        "pt": "Tem um problema"
      },
      {
        "en": "C'est facile",
        "pt": "É fácil"
      },
      {
        "en": "C'est beau !",
        "pt": "Que bonito!"
      },
      {
        "en": "Il est tard",
        "pt": "É tarde"
      },
      {
        "en": "Il est huit heures",
        "pt": "São oito horas"
      },
      {
        "en": "Elle est architecte",
        "pt": "Ela é arquiteta"
      },
      {
        "en": "C'est une architecte",
        "pt": "É uma arquiteta"
      },
      {
        "en": "C'est vrai",
        "pt": "É verdade"
      },
      {
        "en": "C'est dommage",
        "pt": "Que pena"
      },
      {
        "en": "Il y a du monde",
        "pt": "Tem muita gente"
      },
      {
        "en": "C'est lundi",
        "pt": "É segunda-feira"
      },
      {
        "en": "C'est moi",
        "pt": "Sou eu"
      },
      {
        "en": "C'est à droite",
        "pt": "É à direita"
      },
      {
        "en": "Il y a longtemps",
        "pt": "Faz tempo"
      }
    ],
    "expressions": [
      {
        "expr": "C'est dommage !",
        "meaning": "Que pena!",
        "example": "Tu ne viens pas à la fête ? C'est dommage !"
      },
      {
        "expr": "C'est pas vrai !",
        "meaning": "Não acredito! (informal)",
        "example": "Tu as gagné au loto ? C'est pas vrai !"
      },
      {
        "expr": "Qu'est-ce qu'il y a ?",
        "meaning": "O que está acontecendo? / O que foi?",
        "example": "Tu as l'air inquiet. Qu'est-ce qu'il y a ?"
      },
      {
        "expr": "Il y a du monde",
        "meaning": "Tem muita gente",
        "example": "Il y a du monde au marché le samedi."
      },
      {
        "expr": "C'est moi qui…",
        "meaning": "Sou eu que…",
        "example": "C'est moi qui paie ce soir !"
      },
      {
        "expr": "Il y a longtemps",
        "meaning": "Faz tempo / Há muito tempo",
        "example": "On s'est vus il y a longtemps !"
      }
    ],
    "sentences": [
      "C'est mon frère, il est ingénieur.",
      "C'est un bon restaurant, il est très connu.",
      "Ce sont mes amis de l'université.",
      "Il y a un problème avec la réservation.",
      "Elle est professeure, c'est une excellente professeure.",
      "C'est facile, tu vas voir.",
      "Il est tard, on rentre ?",
      "Qu'est-ce qu'il y a ? Tu es triste ?",
      "Il y a du monde à la plage aujourd'hui.",
      "C'est dommage, le musée est fermé."
    ],
    "grammar": {
      "title": "\"C'est\" apresenta, \"il est\" descreve, \"il y a\" diz que existe",
      "rules": [
        "<b>C'EST + artigo ou nome:</b> \"C'est mon frère\", \"C'est un bon médecin\", \"C'est Paul\". No plural: \"Ce sont mes amis\". Também para comentar algo: \"C'est beau !\", \"C'est facile\".",
        "<b>IL / ELLE EST + adjetivo ou profissão sem artigo:</b> \"Il est médecin\" (sem \"un\"), \"Elle est grande\", \"Il est tard\", \"Il est huit heures\". Se aparecer um artigo, volta para \"c'est\": \"C'est un médecin\".",
        "<b>IL Y A = existe / há:</b> \"Il y a un problème\", \"Il y a du monde\". \"Il y a\" + tempo = faz (atrás): \"il y a deux ans\" (dois anos atrás)."
      ],
      "table": {
        "headers": [
          "Estrutura",
          "Usa com",
          "Exemplo"
        ],
        "rows": [
          [
            "C'est",
            "Artigo, nome, comentário",
            "C'est un médecin · C'est beau"
          ],
          [
            "Il / Elle est",
            "Adjetivo, profissão sem artigo, hora",
            "Il est médecin · Il est tard"
          ],
          [
            "Ce sont",
            "Plural com artigo",
            "Ce sont mes amis"
          ],
          [
            "Il y a",
            "Existência, tempo atrás",
            "Il y a un problème"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Complete: \"___ mon frère.\"",
        "a": "C'est",
        "opts": [
          "Il est",
          "C'est",
          "Il y a",
          "Il a"
        ],
        "why": "Apresentar alguém com artigo/possessivo: c'est."
      },
      {
        "q": "Complete: \"___ médecin.\" (falando do irmão)",
        "a": "Il est",
        "opts": [
          "C'est",
          "Il y a",
          "Il est",
          "Il a"
        ],
        "why": "Profissão sem artigo: il est."
      },
      {
        "q": "Qual está certo?",
        "a": "C'est un bon médecin.",
        "opts": [
          "Il est un bon médecin.",
          "Il y a un bon médecin moi.",
          "Il a un bon médecin de.",
          "C'est un bon médecin."
        ],
        "why": "Com artigo, usa-se c'est."
      },
      {
        "q": "Complete: \"___ un problème avec la voiture.\"",
        "a": "Il y a",
        "opts": [
          "Il y a",
          "C'est",
          "Il est",
          "Il a"
        ],
        "why": "Existência: il y a."
      },
      {
        "q": "Plural de \"C'est mon ami\":",
        "a": "Ce sont mes amis.",
        "opts": [
          "Ce est mes amis.",
          "Ce sont mes amis.",
          "Ils sont mes amis de.",
          "Il y a mes amis."
        ],
        "why": "C'est → ce sont."
      },
      {
        "q": "\"Il est tard\" significa:",
        "a": "É tarde.",
        "opts": [
          "Ele está atrasado.",
          "Ele é tarde.",
          "É tarde.",
          "Tem uma tarde."
        ],
        "why": "Hora e \"tarde\" com il est."
      },
      {
        "q": "\"Qu'est-ce qu'il y a ?\" significa:",
        "a": "O que foi? / O que está acontecendo?",
        "opts": [
          "O que é isso?",
          "Quem está aí?",
          "Quanto tem?",
          "O que foi? / O que está acontecendo?"
        ],
        "why": "Pergunta por um problema."
      },
      {
        "q": "\"Il y a deux ans\" significa:",
        "a": "Dois anos atrás",
        "opts": [
          "Dois anos atrás",
          "Há dois anos à frente",
          "Ele tem dois anos",
          "Daqui a dois anos"
        ],
        "why": "Il y a + tempo = atrás."
      },
      {
        "q": "Complete: \"Regarde la tour Eiffel ! ___ beau !\"",
        "a": "C'est",
        "opts": [
          "Il est",
          "C'est",
          "Il y a",
          "Elle a"
        ],
        "why": "Comentário geral: c'est."
      },
      {
        "q": "\"C'est dommage\" significa:",
        "a": "Que pena.",
        "opts": [
          "É perigoso.",
          "É um dano.",
          "Que pena.",
          "Está quebrado."
        ],
        "why": "Expressão de lamento."
      }
    ],
    "speak": [
      "C'est mon frère, il est ingénieur.",
      "C'est un très bon restaurant.",
      "Ce sont mes amis de l'université.",
      "Il y a un problème avec la réservation.",
      "Il est tard, on rentre ?",
      "Qu'est-ce qu'il y a ? Tu es triste ?",
      "C'est dommage, le musée est fermé.",
      "On s'est vus il y a longtemps !"
    ]
  },
  {
    "id": 234,
    "title": "Passé Composé avec Avoir : j'ai parlé",
    "emoji": "📝",
    "lang": "fr",
    "verbs": [
      "Parler",
      "Manger",
      "Finir",
      "Vendre",
      "Travailler"
    ],
    "vocab": [
      {
        "en": "J'ai parlé",
        "pt": "Eu falei"
      },
      {
        "en": "Tu as mangé",
        "pt": "Você comeu"
      },
      {
        "en": "Il a fini",
        "pt": "Ele terminou"
      },
      {
        "en": "Elle a vendu",
        "pt": "Ela vendeu"
      },
      {
        "en": "Nous avons travaillé",
        "pt": "Nós trabalhamos"
      },
      {
        "en": "Vous avez choisi ?",
        "pt": "Vocês escolheram?"
      },
      {
        "en": "Ils ont attendu",
        "pt": "Eles esperaram"
      },
      {
        "en": "J'ai acheté",
        "pt": "Eu comprei"
      },
      {
        "en": "J'ai regardé un film",
        "pt": "Eu assisti a um filme"
      },
      {
        "en": "J'ai écouté",
        "pt": "Eu escutei"
      },
      {
        "en": "Elle a répondu",
        "pt": "Ela respondeu"
      },
      {
        "en": "On a dansé",
        "pt": "A gente dançou"
      },
      {
        "en": "J'ai oublié",
        "pt": "Eu esqueci"
      },
      {
        "en": "J'ai perdu",
        "pt": "Eu perdi"
      },
      {
        "en": "J'ai trouvé",
        "pt": "Eu encontrei"
      },
      {
        "en": "Hier soir",
        "pt": "Ontem à noite"
      },
      {
        "en": "Ce matin",
        "pt": "Hoje de manhã"
      },
      {
        "en": "Déjà",
        "pt": "Já"
      }
    ],
    "expressions": [
      {
        "expr": "J'ai oublié !",
        "meaning": "Esqueci!",
        "example": "Mon parapluie ! J'ai oublié mon parapluie au café !"
      },
      {
        "expr": "Tu as fini ?",
        "meaning": "Você terminou?",
        "example": "Tu as fini ? On peut partir ?"
      },
      {
        "expr": "J'ai perdu mes clés",
        "meaning": "Perdi minhas chaves",
        "example": "Je ne peux pas entrer, j'ai perdu mes clés."
      },
      {
        "expr": "On a bien mangé",
        "meaning": "A gente comeu bem",
        "example": "Merci pour le dîner, on a bien mangé !"
      },
      {
        "expr": "Vous avez déjà choisi ?",
        "meaning": "Já escolheram?",
        "example": "Vous avez déjà choisi, ou vous voulez encore un moment ?"
      },
      {
        "expr": "J'ai adoré !",
        "meaning": "Adorei!",
        "example": "Le spectacle ? J'ai adoré !"
      }
    ],
    "sentences": [
      "Hier, j'ai parlé avec ma mère.",
      "Tu as mangé ce matin ?",
      "Il a fini le travail à six heures.",
      "Nous avons travaillé tout le week-end.",
      "Elle a vendu sa voiture.",
      "Ils ont attendu le bus pendant vingt minutes.",
      "J'ai acheté un cadeau pour Paul.",
      "On a dansé toute la nuit !",
      "J'ai perdu mon téléphone, mais j'ai trouvé mes clés.",
      "Le film ? J'ai adoré !"
    ],
    "grammar": {
      "title": "Passé composé = AVOIR no presente + particípio",
      "rules": [
        "<b>A fórmula:</b> Sujeito + avoir (ai, as, a, avons, avez, ont) + particípio: \"J'ai parlé\", \"Nous avons travaillé\". O passé composé conta uma ação terminada.",
        "<b>Como fazer o particípio:</b> Verbos em -ER → -É (parler → parlé). Em -IR → -I (finir → fini). Em -RE → -U (vendre → vendu, attendre → attendu).",
        "<b>Negação e posição de \"déjà\":</b> A negação abraça o AVOIR: \"Je n'ai pas mangé\". Palavras curtas como \"déjà\", \"bien\", \"tout\" ficam entre os dois: \"J'ai déjà mangé\", \"On a bien dormi\"."
      ],
      "table": {
        "headers": [
          "Infinitivo",
          "Particípio",
          "Passé composé"
        ],
        "rows": [
          [
            "Parler (-er)",
            "parlé",
            "J'ai parlé"
          ],
          [
            "Finir (-ir)",
            "fini",
            "Il a fini"
          ],
          [
            "Vendre (-re)",
            "vendu",
            "Elle a vendu"
          ],
          [
            "Attendre (-re)",
            "attendu",
            "Ils ont attendu"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu falei\" é:",
        "a": "J'ai parlé.",
        "opts": [
          "Je suis parlé.",
          "J'ai parler.",
          "J'ai parlé.",
          "Je parlé."
        ],
        "why": "Avoir + particípio em -é."
      },
      {
        "q": "Particípio de \"finir\":",
        "a": "fini",
        "opts": [
          "finé",
          "finu",
          "finit",
          "fini"
        ],
        "why": "-ir → -i."
      },
      {
        "q": "Particípio de \"vendre\":",
        "a": "vendu",
        "opts": [
          "vendu",
          "vendé",
          "vendi",
          "vendre"
        ],
        "why": "-re → -u."
      },
      {
        "q": "Complete: \"Nous ___ travaillé tout le week-end.\"",
        "a": "avons",
        "opts": [
          "sommes",
          "avons",
          "avez",
          "ont"
        ],
        "why": "Nous → avons."
      },
      {
        "q": "Negue: \"J'ai mangé.\"",
        "a": "Je n'ai pas mangé.",
        "opts": [
          "Je n'ai mangé pas.",
          "Je ne pas ai mangé.",
          "Je n'ai pas mangé.",
          "J'ai ne pas mangé."
        ],
        "why": "Ne + avoir + pas + particípio."
      },
      {
        "q": "Onde fica \"déjà\"?",
        "a": "J'ai déjà mangé.",
        "opts": [
          "J'ai mangé déjà.",
          "Déjà j'ai mangé.",
          "Je déjà ai mangé.",
          "J'ai déjà mangé."
        ],
        "why": "Entre o auxiliar e o particípio."
      },
      {
        "q": "\"Ils ont attendu le bus\" significa:",
        "a": "Eles esperaram o ônibus.",
        "opts": [
          "Eles esperaram o ônibus.",
          "Eles esperam o ônibus.",
          "Eles vão esperar o ônibus.",
          "Eles perderam o ônibus."
        ],
        "why": "Passé composé = ação terminada."
      },
      {
        "q": "\"J'ai oublié !\" significa:",
        "a": "Esqueci!",
        "opts": [
          "Lembrei!",
          "Esqueci!",
          "Vou esquecer!",
          "Estou esquecendo!"
        ],
        "why": "Oublier → oublié."
      },
      {
        "q": "Complete: \"Tu ___ fini ?\"",
        "a": "as",
        "opts": [
          "es",
          "a",
          "as",
          "avez"
        ],
        "why": "Tu → as."
      },
      {
        "q": "\"Le film ? J'ai adoré !\" significa:",
        "a": "Adorei o filme!",
        "opts": [
          "Vou adorar o filme!",
          "Odiei o filme!",
          "Adoro filmes!",
          "Adorei o filme!"
        ],
        "why": "Adorer → adoré."
      }
    ],
    "speak": [
      "Hier, j'ai parlé avec ma mère.",
      "Tu as mangé ce matin ?",
      "Il a fini le travail à six heures.",
      "Nous avons travaillé tout le week-end.",
      "J'ai perdu mon téléphone !",
      "Je n'ai pas encore mangé.",
      "On a dansé toute la nuit !",
      "Le spectacle ? J'ai adoré !"
    ]
  },
  {
    "id": 235,
    "title": "Les Participes Irréguliers : été, eu, fait, pris",
    "emoji": "🧠",
    "lang": "fr",
    "verbs": [
      "Être → été",
      "Avoir → eu",
      "Faire → fait",
      "Prendre → pris",
      "Voir → vu"
    ],
    "vocab": [
      {
        "en": "J'ai été",
        "pt": "Eu fui / fiquei / estive"
      },
      {
        "en": "J'ai eu",
        "pt": "Eu tive"
      },
      {
        "en": "J'ai fait",
        "pt": "Eu fiz"
      },
      {
        "en": "J'ai pris",
        "pt": "Eu peguei / tomei"
      },
      {
        "en": "J'ai vu",
        "pt": "Eu vi"
      },
      {
        "en": "J'ai bu",
        "pt": "Eu bebi"
      },
      {
        "en": "J'ai lu",
        "pt": "Eu li"
      },
      {
        "en": "J'ai dit",
        "pt": "Eu disse"
      },
      {
        "en": "J'ai écrit",
        "pt": "Eu escrevi"
      },
      {
        "en": "J'ai mis",
        "pt": "Eu coloquei / vesti"
      },
      {
        "en": "J'ai pu",
        "pt": "Eu pude / consegui"
      },
      {
        "en": "J'ai dû",
        "pt": "Eu tive que"
      },
      {
        "en": "J'ai voulu",
        "pt": "Eu quis"
      },
      {
        "en": "J'ai su",
        "pt": "Eu soube"
      },
      {
        "en": "J'ai ouvert",
        "pt": "Eu abri"
      },
      {
        "en": "J'ai compris",
        "pt": "Eu entendi"
      },
      {
        "en": "J'ai reçu",
        "pt": "Eu recebi"
      },
      {
        "en": "J'ai connu",
        "pt": "Eu conheci"
      }
    ],
    "expressions": [
      {
        "expr": "J'ai compris !",
        "meaning": "Entendi!",
        "example": "Ah, c'est comme ça ? D'accord, j'ai compris !"
      },
      {
        "expr": "Qu'est-ce que tu as fait ce week-end ?",
        "meaning": "O que você fez no fim de semana?",
        "example": "— Qu'est-ce que tu as fait ce week-end ? — J'ai vu un film."
      },
      {
        "expr": "J'ai dû partir",
        "meaning": "Tive que ir embora",
        "example": "Désolé, j'ai dû partir plus tôt, j'avais un rendez-vous."
      },
      {
        "expr": "Tu as vu ?",
        "meaning": "Você viu?",
        "example": "Tu as vu ? Il neige !"
      },
      {
        "expr": "J'ai pris le métro",
        "meaning": "Peguei o metrô",
        "example": "Il y avait des embouteillages, alors j'ai pris le métro."
      },
      {
        "expr": "Je n'ai pas pu venir",
        "meaning": "Não consegui vir",
        "example": "Je n'ai pas pu venir à la réunion, j'étais malade."
      }
    ],
    "sentences": [
      "J'ai fait mes devoirs hier soir.",
      "Tu as vu le dernier film de Spielberg ?",
      "Elle a pris le train de huit heures.",
      "Nous avons bu un café sur la terrasse.",
      "J'ai lu un livre de Victor Hugo.",
      "Il a dit la vérité.",
      "J'ai eu de la chance, il a été très gentil.",
      "Vous avez reçu mon message ?",
      "Ils n'ont pas compris la question.",
      "J'ai dû travailler samedi."
    ],
    "grammar": {
      "title": "Os particípios irregulares mais usados",
      "rules": [
        "<b>ÊTRE e AVOIR também têm particípio:</b> Être → été (\"j'ai été malade\"), avoir → eu (\"j'ai eu peur\"). Os dois usam AVOIR como ajudante.",
        "<b>Terminados em -U:</b> Avoir → eu, voir → vu, boire → bu, lire → lu, pouvoir → pu, devoir → dû, vouloir → voulu, savoir → su, recevoir → reçu, connaître → connu.",
        "<b>Terminados em -IS / -IT e outros:</b> Prendre → pris (e comprendre → compris), mettre → mis, dire → dit, écrire → écrit, faire → fait, ouvrir → ouvert."
      ],
      "table": {
        "headers": [
          "Infinitivo",
          "Particípio",
          "Exemplo"
        ],
        "rows": [
          [
            "Être",
            "été",
            "J'ai été content"
          ],
          [
            "Avoir",
            "eu",
            "J'ai eu peur"
          ],
          [
            "Faire",
            "fait",
            "J'ai fait un gâteau"
          ],
          [
            "Prendre",
            "pris",
            "J'ai pris le bus"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "Particípio de \"faire\":",
        "a": "fait",
        "opts": [
          "faisé",
          "fairé",
          "fit",
          "fait"
        ],
        "why": "Faire → fait."
      },
      {
        "q": "Particípio de \"prendre\":",
        "a": "pris",
        "opts": [
          "pris",
          "prendu",
          "prené",
          "prit"
        ],
        "why": "Prendre → pris."
      },
      {
        "q": "Particípio de \"voir\":",
        "a": "vu",
        "opts": [
          "voi",
          "vu",
          "voyé",
          "vit"
        ],
        "why": "Voir → vu."
      },
      {
        "q": "Particípio de \"boire\":",
        "a": "bu",
        "opts": [
          "boiré",
          "buvé",
          "bu",
          "bois"
        ],
        "why": "Boire → bu."
      },
      {
        "q": "\"Eu entendi\" é:",
        "a": "J'ai compris.",
        "opts": [
          "J'ai comprendu.",
          "Je suis compris.",
          "J'ai comprené.",
          "J'ai compris."
        ],
        "why": "Comprendre → compris."
      },
      {
        "q": "\"Eu tive que trabalhar\" é:",
        "a": "J'ai dû travailler.",
        "opts": [
          "J'ai dû travailler.",
          "J'ai devu travailler.",
          "J'ai dois travailler.",
          "Je suis dû travailler."
        ],
        "why": "Devoir → dû."
      },
      {
        "q": "Complete: \"Tu as ___ le film ?\" (ver)",
        "a": "vu",
        "opts": [
          "voi",
          "vu",
          "vois",
          "voyé"
        ],
        "why": "Voir → vu."
      },
      {
        "q": "\"Je n'ai pas pu venir\" significa:",
        "a": "Não consegui vir.",
        "opts": [
          "Não quis vir.",
          "Não devo vir.",
          "Não consegui vir.",
          "Não vou poder vir."
        ],
        "why": "Pouvoir → pu."
      },
      {
        "q": "Particípio de \"mettre\":",
        "a": "mis",
        "opts": [
          "mettu",
          "metté",
          "mit",
          "mis"
        ],
        "why": "Mettre → mis."
      },
      {
        "q": "\"Il a dit la vérité\" significa:",
        "a": "Ele disse a verdade.",
        "opts": [
          "Ele disse a verdade.",
          "Ele diz a verdade.",
          "Ele vai dizer a verdade.",
          "Ele leu a verdade."
        ],
        "why": "Dire → dit."
      }
    ],
    "speak": [
      "Qu'est-ce que tu as fait ce week-end ?",
      "J'ai vu un film et j'ai lu un livre.",
      "Elle a pris le train de huit heures.",
      "Nous avons bu un café sur la terrasse.",
      "D'accord, j'ai compris !",
      "J'ai dû travailler samedi.",
      "Je n'ai pas pu venir, j'étais malade.",
      "Vous avez reçu mon message ?"
    ]
  },
  {
    "id": 236,
    "title": "Passé Composé avec Être : je suis allé(e)",
    "emoji": "🏠",
    "lang": "fr",
    "verbs": [
      "Aller",
      "Venir",
      "Partir",
      "Arriver",
      "Rester"
    ],
    "vocab": [
      {
        "en": "Je suis allé",
        "pt": "Eu fui (homem)"
      },
      {
        "en": "Je suis allée",
        "pt": "Eu fui (mulher)"
      },
      {
        "en": "Tu es venu ?",
        "pt": "Você veio?"
      },
      {
        "en": "Il est parti",
        "pt": "Ele partiu / foi embora"
      },
      {
        "en": "Elle est arrivée",
        "pt": "Ela chegou"
      },
      {
        "en": "Nous sommes restés",
        "pt": "Nós ficamos"
      },
      {
        "en": "Vous êtes sortis ?",
        "pt": "Vocês saíram?"
      },
      {
        "en": "Ils sont entrés",
        "pt": "Eles entraram"
      },
      {
        "en": "Elles sont montées",
        "pt": "Elas subiram"
      },
      {
        "en": "Il est descendu",
        "pt": "Ele desceu"
      },
      {
        "en": "Je suis tombé",
        "pt": "Eu caí"
      },
      {
        "en": "Elle est née en 1990",
        "pt": "Ela nasceu em 1990"
      },
      {
        "en": "Il est mort",
        "pt": "Ele morreu"
      },
      {
        "en": "Je suis rentré",
        "pt": "Eu voltei para casa"
      },
      {
        "en": "Elle est devenue médecin",
        "pt": "Ela se tornou médica"
      },
      {
        "en": "Nous sommes passés par Lyon",
        "pt": "Passamos por Lyon"
      },
      {
        "en": "Je suis retourné à Paris",
        "pt": "Voltei a Paris"
      },
      {
        "en": "Ils sont revenus",
        "pt": "Eles voltaram"
      }
    ],
    "expressions": [
      {
        "expr": "Je suis tombé amoureux",
        "meaning": "Eu me apaixonei",
        "example": "Je suis tombé amoureux de Paris dès le premier jour."
      },
      {
        "expr": "Elle est née à…",
        "meaning": "Ela nasceu em…",
        "example": "Ma grand-mère est née à Porto en 1945."
      },
      {
        "expr": "Je suis rentré tard",
        "meaning": "Voltei tarde para casa",
        "example": "Je suis rentré tard hier, je suis fatigué."
      },
      {
        "expr": "Ils sont partis en vacances",
        "meaning": "Eles saíram de férias",
        "example": "Les voisins sont partis en vacances en Espagne."
      },
      {
        "expr": "Tu es passé(e) où ?",
        "meaning": "Por onde você andou?",
        "example": "Je t'ai cherché partout ! Tu es passé où ?"
      },
      {
        "expr": "Elle est devenue…",
        "meaning": "Ela se tornou…",
        "example": "Après dix ans d'études, elle est devenue chirurgienne."
      }
    ],
    "sentences": [
      "Le week-end dernier, je suis allé à la mer.",
      "Elle est arrivée à Paris lundi.",
      "Nous sommes restés à la maison, il pleuvait.",
      "Ils sont partis à six heures du matin.",
      "Tu es venu en voiture ou en train ?",
      "Je suis né à Salvador en 1998.",
      "Elle est tombée dans l'escalier.",
      "Vous êtes sortis hier soir ?",
      "Mes parents sont rentrés de vacances.",
      "Elle est devenue professeure de français."
    ],
    "grammar": {
      "title": "A casa do ÊTRE: verbos que usam ÊTRE no passé composé",
      "rules": [
        "<b>Verbos de ir, vir, entrar, sair, nascer e morrer:</b> Aller, venir, arriver, partir, entrer, sortir, monter, descendre, tomber, rester, naître, mourir, retourner, rentrer, devenir, revenir, passer: \"je suis allé\", \"elle est née\".",
        "<b>O particípio concorda como um adjetivo:</b> Feminino + E, plural + S: \"il est allé\", \"elle est allée\", \"ils sont allés\", \"elles sont allées\". Na fala, as quatro formas soam iguais.",
        "<b>Verbos com SE também usam ÊTRE:</b> \"Je me suis levé(e)\", \"Elle s'est réveillée\". Todo verbo pronominal (com me, te, se) usa ÊTRE no passé composé."
      ],
      "table": {
        "headers": [
          "Sujeito",
          "Aller no passé composé",
          "Concordância"
        ],
        "rows": [
          [
            "Il",
            "est allé",
            "—"
          ],
          [
            "Elle",
            "est allée",
            "+ e"
          ],
          [
            "Ils",
            "sont allés",
            "+ s"
          ],
          [
            "Elles",
            "sont allées",
            "+ es"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu fui\" (mulher) é:",
        "a": "Je suis allée.",
        "opts": [
          "Je suis allée.",
          "J'ai allée.",
          "Je suis allé.",
          "J'ai allé."
        ],
        "why": "Aller usa ÊTRE e concorda: allée."
      },
      {
        "q": "\"Ela chegou\" é:",
        "a": "Elle est arrivée.",
        "opts": [
          "Elle a arrivé.",
          "Elle est arrivée.",
          "Elle est arrivé.",
          "Elle a arrivée."
        ],
        "why": "Arriver usa ÊTRE; feminino + e."
      },
      {
        "q": "Complete: \"Nous ___ restés à la maison.\"",
        "a": "sommes",
        "opts": [
          "avons",
          "êtes",
          "sommes",
          "sont"
        ],
        "why": "Rester usa ÊTRE."
      },
      {
        "q": "\"Eles partiram\" é:",
        "a": "Ils sont partis.",
        "opts": [
          "Ils ont parti.",
          "Ils sont parti.",
          "Ils ont partis.",
          "Ils sont partis."
        ],
        "why": "Partir usa ÊTRE; plural + s."
      },
      {
        "q": "\"Eu nasci em 1998\" é:",
        "a": "Je suis né en 1998.",
        "opts": [
          "Je suis né en 1998.",
          "J'ai né en 1998.",
          "J'ai été né en 1998.",
          "Je suis naître en 1998."
        ],
        "why": "Naître → né, com ÊTRE."
      },
      {
        "q": "Qual verbo usa ÊTRE no passé composé?",
        "a": "Tomber",
        "opts": [
          "Manger",
          "Tomber",
          "Parler",
          "Faire"
        ],
        "why": "Tomber está na casa do être."
      },
      {
        "q": "\"Je suis tombé amoureux\" significa:",
        "a": "Eu me apaixonei.",
        "opts": [
          "Eu caí de amor.",
          "Eu me casei.",
          "Eu me apaixonei.",
          "Eu fiquei triste."
        ],
        "why": "Tomber amoureux = apaixonar-se."
      },
      {
        "q": "Complete: \"Elles sont ___.\" (sortir)",
        "a": "sorties",
        "opts": [
          "sorti",
          "sortis",
          "sortie",
          "sorties"
        ],
        "why": "Elles = feminino plural: + es."
      },
      {
        "q": "\"Je me suis levé\" usa ÊTRE porque:",
        "a": "É um verbo pronominal (com \"me\")",
        "opts": [
          "É um verbo pronominal (com \"me\")",
          "É um verbo de movimento",
          "Está no plural",
          "É um verbo irregular"
        ],
        "why": "Pronominais usam ÊTRE."
      },
      {
        "q": "\"Elle est devenue médecin\" significa:",
        "a": "Ela se tornou médica.",
        "opts": [
          "Ela veio ao médico.",
          "Ela se tornou médica.",
          "Ela é médica de novo.",
          "Ela voltou ao médico."
        ],
        "why": "Devenir = tornar-se."
      }
    ],
    "speak": [
      "Le week-end dernier, je suis allé à la mer.",
      "Elle est arrivée à Paris lundi.",
      "Nous sommes restés à la maison.",
      "Ils sont partis à six heures du matin.",
      "Je suis né à Salvador.",
      "Tu es venu en voiture ou en train ?",
      "Je suis tombé amoureux de Paris !",
      "Elle est devenue professeure de français."
    ]
  },
  {
    "id": 237,
    "title": "Avoir ou Être ? Le Grand Choix",
    "emoji": "⚖️",
    "lang": "fr",
    "verbs": [
      "Avoir",
      "Être",
      "Sortir",
      "Monter",
      "Passer"
    ],
    "vocab": [
      {
        "en": "J'ai mangé",
        "pt": "Comi (avoir)"
      },
      {
        "en": "Je suis sorti",
        "pt": "Saí (être)"
      },
      {
        "en": "J'ai sorti le chien",
        "pt": "Levei o cachorro para fora (avoir)"
      },
      {
        "en": "Je suis monté",
        "pt": "Subi (être)"
      },
      {
        "en": "J'ai monté les valises",
        "pt": "Subi as malas (avoir)"
      },
      {
        "en": "Je suis passé chez toi",
        "pt": "Passei na sua casa (être)"
      },
      {
        "en": "J'ai passé un bon week-end",
        "pt": "Passei um bom fim de semana (avoir)"
      },
      {
        "en": "J'ai passé un examen",
        "pt": "Fiz uma prova (avoir)"
      },
      {
        "en": "Je suis descendu",
        "pt": "Desci (être)"
      },
      {
        "en": "J'ai descendu l'escalier",
        "pt": "Desci a escada (avoir)"
      },
      {
        "en": "Je suis rentré",
        "pt": "Voltei para casa (être)"
      },
      {
        "en": "J'ai rentré la voiture",
        "pt": "Guardei o carro (avoir)"
      },
      {
        "en": "J'ai fait",
        "pt": "Fiz (avoir)"
      },
      {
        "en": "Je suis venu",
        "pt": "Vim (être)"
      },
      {
        "en": "J'ai été",
        "pt": "Fui / fiquei (avoir)"
      },
      {
        "en": "Je me suis lavé",
        "pt": "Me lavei (être)"
      },
      {
        "en": "J'ai dormi",
        "pt": "Dormi (avoir)"
      },
      {
        "en": "J'ai couru",
        "pt": "Corri (avoir)"
      }
    ],
    "expressions": [
      {
        "expr": "J'ai passé une excellente soirée",
        "meaning": "Passei uma noite excelente",
        "example": "Merci pour l'invitation, j'ai passé une excellente soirée !"
      },
      {
        "expr": "Je suis passé te voir",
        "meaning": "Passei para te ver",
        "example": "Je suis passé te voir, mais tu n'étais pas là."
      },
      {
        "expr": "J'ai sorti la poubelle",
        "meaning": "Levei o lixo para fora",
        "example": "Ne t'inquiète pas, j'ai sorti la poubelle."
      },
      {
        "expr": "Tu as passé ton permis ?",
        "meaning": "Você fez a prova de habilitação?",
        "example": "Tu as passé ton permis ? Tu l'as eu ?"
      },
      {
        "expr": "Le temps est passé vite",
        "meaning": "O tempo passou rápido",
        "example": "Déjà minuit ? Le temps est passé vite !"
      },
      {
        "expr": "J'ai monté un projet",
        "meaning": "Montei um projeto",
        "example": "Avec deux amis, j'ai monté un projet de café solidaire."
      }
    ],
    "sentences": [
      "Hier, je suis sorti avec des amis.",
      "Ce matin, j'ai sorti le chien.",
      "Elle est montée au cinquième étage.",
      "Il a monté les valises dans la chambre.",
      "J'ai passé une semaine à Lisbonne.",
      "Je suis passé à la boulangerie.",
      "Nous sommes descendus du train à Lyon.",
      "J'ai été très surpris par la nouvelle.",
      "Elle s'est levée à sept heures.",
      "Il a couru dix kilomètres dimanche."
    ],
    "grammar": {
      "title": "O teste: o verbo tem um objeto direto?",
      "rules": [
        "<b>A maioria usa AVOIR:</b> Todos os verbos usam AVOIR, menos os da casa do être (movimento, nascer, morrer, ficar) e os pronominais. Até être e avoir usam AVOIR: \"j'ai été\", \"j'ai eu\".",
        "<b>Seis verbos usam os dois:</b> Sortir, monter, descendre, rentrer, passer, retourner: sem objeto direto usam ÊTRE (\"je suis sorti\"); com objeto direto usam AVOIR (\"j'ai sorti le chien\").",
        "<b>\"Passer\" no sentido de tempo:</b> \"J'ai passé une semaine à Lisbonne\" (avoir, a semana é o objeto). \"Je suis passé à la boulangerie\" (être, só movimento)."
      ],
      "table": {
        "headers": [
          "Verbo",
          "Sem objeto (être)",
          "Com objeto (avoir)"
        ],
        "rows": [
          [
            "Sortir",
            "Je suis sorti",
            "J'ai sorti le chien"
          ],
          [
            "Monter",
            "Elle est montée",
            "Elle a monté les valises"
          ],
          [
            "Passer",
            "Je suis passé chez toi",
            "J'ai passé un bon week-end"
          ],
          [
            "Rentrer",
            "Il est rentré",
            "Il a rentré la voiture"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Saí com amigos\" é:",
        "a": "Je suis sorti avec des amis.",
        "opts": [
          "J'ai sorti avec des amis.",
          "Je suis sorti avec des amis.",
          "Je suis sortie des amis.",
          "J'ai été sorti avec des amis."
        ],
        "why": "Sem objeto direto: ÊTRE."
      },
      {
        "q": "\"Levei o cachorro para fora\" é:",
        "a": "J'ai sorti le chien.",
        "opts": [
          "Je suis sorti le chien.",
          "J'ai sortie le chien.",
          "J'ai sorti le chien.",
          "Je suis sortie au chien."
        ],
        "why": "Com objeto direto (le chien): AVOIR."
      },
      {
        "q": "Complete: \"Elle ___ montée au cinquième étage.\"",
        "a": "est",
        "opts": [
          "a",
          "ai",
          "sont",
          "est"
        ],
        "why": "Sem objeto: ÊTRE."
      },
      {
        "q": "Complete: \"Il ___ monté les valises.\"",
        "a": "a",
        "opts": [
          "a",
          "est",
          "sont",
          "as"
        ],
        "why": "Com objeto (les valises): AVOIR."
      },
      {
        "q": "\"Passei uma semana em Lisboa\" é:",
        "a": "J'ai passé une semaine à Lisbonne.",
        "opts": [
          "Je suis passé une semaine à Lisbonne.",
          "J'ai passé une semaine à Lisbonne.",
          "J'ai passée une semaine à Lisbonne.",
          "Je suis passée une semaine Lisbonne."
        ],
        "why": "O tempo é objeto: AVOIR."
      },
      {
        "q": "Qual destes usa AVOIR no passé composé?",
        "a": "Dormir",
        "opts": [
          "Aller",
          "Venir",
          "Dormir",
          "Naître"
        ],
        "why": "Dormir não é da casa do être."
      },
      {
        "q": "\"Être\" no passé composé usa qual ajudante?",
        "a": "Avoir: j'ai été",
        "opts": [
          "Être: je suis été",
          "Os dois",
          "Nenhum",
          "Avoir: j'ai été"
        ],
        "why": "J'ai été."
      },
      {
        "q": "\"Elle s'est levée\" usa ÊTRE porque:",
        "a": "O verbo é pronominal.",
        "opts": [
          "O verbo é pronominal.",
          "Levantar é movimento.",
          "É feminino.",
          "É irregular."
        ],
        "why": "Pronominais usam ÊTRE."
      },
      {
        "q": "\"Tu as passé ton permis ?\" pergunta se:",
        "a": "A pessoa fez a prova de habilitação",
        "opts": [
          "A pessoa passou na rua",
          "A pessoa fez a prova de habilitação",
          "A pessoa perdeu a carteira",
          "A pessoa passou na casa de alguém"
        ],
        "why": "Passer un examen = fazer uma prova."
      },
      {
        "q": "\"Le temps est passé vite\" significa:",
        "a": "O tempo passou rápido.",
        "opts": [
          "Passei o tempo correndo.",
          "O tempo vai passar.",
          "O tempo passou rápido.",
          "O tempo está bom."
        ],
        "why": "Sem objeto: ÊTRE."
      }
    ],
    "speak": [
      "Hier, je suis sorti avec des amis.",
      "Ce matin, j'ai sorti le chien.",
      "J'ai passé une semaine à Lisbonne.",
      "Je suis passé à la boulangerie.",
      "Elle est montée au cinquième étage.",
      "Il a monté les valises dans la chambre.",
      "Merci, j'ai passé une excellente soirée !",
      "Déjà minuit ? Le temps est passé vite !"
    ]
  },
  {
    "id": 238,
    "title": "L'Imparfait d'Être : j'étais, c'était",
    "emoji": "🕰️",
    "lang": "fr",
    "verbs": [
      "J'étais",
      "Tu étais",
      "Il était",
      "Nous étions",
      "Ils étaient"
    ],
    "vocab": [
      {
        "en": "J'étais",
        "pt": "Eu era / estava"
      },
      {
        "en": "Tu étais",
        "pt": "Você era / estava"
      },
      {
        "en": "Il était",
        "pt": "Ele era / estava"
      },
      {
        "en": "Elle était",
        "pt": "Ela era / estava"
      },
      {
        "en": "Nous étions",
        "pt": "Nós éramos / estávamos"
      },
      {
        "en": "Vous étiez",
        "pt": "Vocês eram / estavam"
      },
      {
        "en": "Ils étaient",
        "pt": "Eles eram / estavam"
      },
      {
        "en": "C'était",
        "pt": "Era / Foi (comentário)"
      },
      {
        "en": "C'était génial",
        "pt": "Foi genial"
      },
      {
        "en": "Quand j'étais petit",
        "pt": "Quando eu era pequeno"
      },
      {
        "en": "Il était une fois…",
        "pt": "Era uma vez…"
      },
      {
        "en": "J'étais fatigué",
        "pt": "Eu estava cansado"
      },
      {
        "en": "La maison était grande",
        "pt": "A casa era grande"
      },
      {
        "en": "Nous étions voisins",
        "pt": "Éramos vizinhos"
      },
      {
        "en": "Avant",
        "pt": "Antes / Antigamente"
      },
      {
        "en": "Autrefois",
        "pt": "Antigamente"
      },
      {
        "en": "À l'époque",
        "pt": "Naquela época"
      },
      {
        "en": "C'était comment ?",
        "pt": "Como foi?"
      }
    ],
    "expressions": [
      {
        "expr": "C'était comment ?",
        "meaning": "Como foi?",
        "example": "— Je suis rentré de Rome. — Ah oui ? C'était comment ?"
      },
      {
        "expr": "C'était génial !",
        "meaning": "Foi genial!",
        "example": "Le concert ? C'était génial, il y avait une ambiance incroyable !"
      },
      {
        "expr": "Quand j'étais petit(e)…",
        "meaning": "Quando eu era pequeno(a)…",
        "example": "Quand j'étais petite, j'étais très timide."
      },
      {
        "expr": "Il était une fois…",
        "meaning": "Era uma vez…",
        "example": "Il était une fois une princesse qui habitait dans un château."
      },
      {
        "expr": "À l'époque, c'était différent",
        "meaning": "Naquela época era diferente",
        "example": "À l'époque, c'était différent : il n'y avait pas de portables."
      },
      {
        "expr": "J'étais sur le point de t'appeler",
        "meaning": "Eu estava prestes a te ligar",
        "example": "Ah, c'est toi ! J'étais sur le point de t'appeler."
      }
    ],
    "sentences": [
      "Quand j'étais petit, j'étais très timide.",
      "La maison de mes grands-parents était grande.",
      "C'était génial, merci pour tout !",
      "Nous étions voisins à l'époque.",
      "Il était tard et j'étais fatigué.",
      "Le film était long, mais c'était intéressant.",
      "Les rues étaient vides le dimanche.",
      "Vous étiez où hier soir ?",
      "Il était une fois un petit village au bord de la mer.",
      "Avant, la ville était plus calme."
    ],
    "grammar": {
      "title": "O imparfait de ÊTRE: o radical ÉT- + terminação",
      "rules": [
        "<b>A conjugação:</b> J'étais · tu étais · il était · nous étions · vous étiez · ils étaient. As terminações são as mesmas de todo imparfait: -ais, -ais, -ait, -ions, -iez, -aient.",
        "<b>Para que serve:</b> Descrever como as coisas eram ou estavam no passado: \"La maison était grande\", \"J'étais fatigué\", \"Quand j'étais petit…\". É o pano de fundo da história.",
        "<b>\"C'était\" para dar opinião:</b> Para comentar algo que já passou: \"C'était génial\", \"C'était comment ?\". É uma das frases mais usadas na conversa."
      ],
      "table": {
        "headers": [
          "Pronome",
          "Être (imparfait)",
          "Exemplo"
        ],
        "rows": [
          [
            "Je / Tu",
            "étais",
            "J'étais timide"
          ],
          [
            "Il / Elle / On",
            "était",
            "C'était génial"
          ],
          [
            "Nous / Vous",
            "étions / étiez",
            "Nous étions voisins"
          ],
          [
            "Ils / Elles",
            "étaient",
            "Les rues étaient vides"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu era tímido\" é:",
        "a": "J'étais timide.",
        "opts": [
          "J'ai été timide.",
          "Je suis timide.",
          "J'étais timide.",
          "J'avais timide."
        ],
        "why": "Descrição no passado: imparfait."
      },
      {
        "q": "Complete: \"Nous ___ voisins.\"",
        "a": "étions",
        "opts": [
          "étaient",
          "étiez",
          "sommes été",
          "étions"
        ],
        "why": "Nous → étions."
      },
      {
        "q": "Complete: \"Les rues ___ vides.\"",
        "a": "étaient",
        "opts": [
          "étaient",
          "était",
          "étions",
          "étais"
        ],
        "why": "Ils/Elles → étaient."
      },
      {
        "q": "\"Foi genial!\" (sobre um show) é:",
        "a": "C'était génial !",
        "opts": [
          "C'est été génial !",
          "C'était génial !",
          "Il était génial de !",
          "C'avait génial !"
        ],
        "why": "\"C'était\" para comentar algo passado."
      },
      {
        "q": "\"Il était une fois…\" significa:",
        "a": "Era uma vez…",
        "opts": [
          "Ele estava uma vez…",
          "Foi só uma vez…",
          "Era uma vez…",
          "Ele era uma vez por semana…"
        ],
        "why": "Abertura de contos."
      },
      {
        "q": "Complete: \"Vous ___ où hier soir ?\"",
        "a": "étiez",
        "opts": [
          "étais",
          "étaient",
          "êtes été",
          "étiez"
        ],
        "why": "Vous → étiez."
      },
      {
        "q": "\"C'était comment ?\" pergunta:",
        "a": "Como foi?",
        "opts": [
          "Como foi?",
          "O que era?",
          "Quando foi?",
          "Quem era?"
        ],
        "why": "Pergunta por uma experiência passada."
      },
      {
        "q": "O imparfait serve para:",
        "a": "Descrever como algo era no passado",
        "opts": [
          "Contar uma ação que terminou num momento",
          "Descrever como algo era no passado",
          "Falar do futuro",
          "Dar ordens"
        ],
        "why": "O imparfait é o pano de fundo."
      },
      {
        "q": "\"À l'époque\" significa:",
        "a": "Naquela época",
        "opts": [
          "Na hora certa",
          "De vez em quando",
          "Naquela época",
          "Hoje em dia"
        ],
        "why": "Expressão de tempo passado."
      },
      {
        "q": "Complete: \"Il ___ tard et j'étais fatigué.\"",
        "a": "était",
        "opts": [
          "étais",
          "a été",
          "est",
          "était"
        ],
        "why": "Il → était."
      }
    ],
    "speak": [
      "Quand j'étais petit, j'étais très timide.",
      "La maison de mes grands-parents était grande.",
      "Le concert ? C'était génial !",
      "Nous étions voisins à l'époque.",
      "Il était tard et j'étais fatigué.",
      "Tu es rentré de Rome ? C'était comment ?",
      "Il était une fois un petit village.",
      "Avant, la ville était plus calme."
    ]
  },
  {
    "id": 239,
    "title": "L'Imparfait d'Avoir : j'avais, il y avait",
    "emoji": "🧸",
    "lang": "fr",
    "verbs": [
      "J'avais",
      "Tu avais",
      "Il avait",
      "Nous avions",
      "Il y avait"
    ],
    "vocab": [
      {
        "en": "J'avais",
        "pt": "Eu tinha"
      },
      {
        "en": "Tu avais",
        "pt": "Você tinha"
      },
      {
        "en": "Il avait",
        "pt": "Ele tinha"
      },
      {
        "en": "Elle avait",
        "pt": "Ela tinha"
      },
      {
        "en": "Nous avions",
        "pt": "Nós tínhamos"
      },
      {
        "en": "Vous aviez",
        "pt": "Vocês tinham"
      },
      {
        "en": "Ils avaient",
        "pt": "Eles tinham"
      },
      {
        "en": "Il y avait",
        "pt": "Havia / Tinha"
      },
      {
        "en": "Quand j'avais dix ans",
        "pt": "Quando eu tinha dez anos"
      },
      {
        "en": "J'avais un chien",
        "pt": "Eu tinha um cachorro"
      },
      {
        "en": "J'avais peur du noir",
        "pt": "Eu tinha medo do escuro"
      },
      {
        "en": "Il y avait beaucoup de monde",
        "pt": "Tinha muita gente"
      },
      {
        "en": "Nous avions une petite maison",
        "pt": "Tínhamos uma casinha"
      },
      {
        "en": "Elle avait les cheveux longs",
        "pt": "Ela tinha cabelo comprido"
      },
      {
        "en": "J'avais faim",
        "pt": "Eu estava com fome"
      },
      {
        "en": "Il n'y avait pas de wifi",
        "pt": "Não tinha wifi"
      },
      {
        "en": "Tu avais raison",
        "pt": "Você tinha razão"
      },
      {
        "en": "J'avais l'habitude de…",
        "pt": "Eu costumava…"
      }
    ],
    "expressions": [
      {
        "expr": "Quand j'avais … ans",
        "meaning": "Quando eu tinha … anos",
        "example": "Quand j'avais douze ans, j'ai déménagé à Rio."
      },
      {
        "expr": "Il y avait une fois…",
        "meaning": "Havia uma vez…",
        "example": "Il y avait une fois un roi très riche."
      },
      {
        "expr": "Tu avais raison !",
        "meaning": "Você tinha razão!",
        "example": "Le restaurant était fermé. Tu avais raison !"
      },
      {
        "expr": "J'avais l'habitude de…",
        "meaning": "Eu costumava…",
        "example": "J'avais l'habitude de jouer au foot après l'école."
      },
      {
        "expr": "Il y avait du monde ?",
        "meaning": "Tinha muita gente?",
        "example": "Tu es allé au festival ? Il y avait du monde ?"
      },
      {
        "expr": "Je n'avais pas le choix",
        "meaning": "Eu não tinha escolha",
        "example": "J'ai travaillé dimanche, je n'avais pas le choix."
      }
    ],
    "sentences": [
      "Quand j'avais dix ans, j'avais un chien.",
      "Il y avait beaucoup de monde au concert.",
      "Nous avions une petite maison à la campagne.",
      "Elle avait les cheveux longs à l'époque.",
      "J'avais peur du noir quand j'étais petit.",
      "Il n'y avait pas de wifi dans l'hôtel.",
      "Tu avais raison, le film était excellent.",
      "J'avais l'habitude de lire avant de dormir.",
      "Ils avaient trois enfants et un grand jardin.",
      "Je n'avais pas le choix, j'ai dû partir."
    ],
    "grammar": {
      "title": "O imparfait de AVOIR: o radical AV- + terminação",
      "rules": [
        "<b>A conjugação:</b> J'avais · tu avais · il avait · nous avions · vous aviez · ils avaient. Mesmas terminações do imparfait de être.",
        "<b>Idade e posse no passado:</b> \"Quand j'avais dix ans\" (quando eu tinha dez anos), \"J'avais un chien\". Sensações também: \"J'avais faim\", \"J'avais peur\".",
        "<b>\"Il y avait\" = havia / tinha:</b> É o \"il y a\" no passado, para descrever o cenário: \"Il y avait beaucoup de monde\", \"Il n'y avait pas de wifi\"."
      ],
      "table": {
        "headers": [
          "Presente",
          "Imparfait",
          "Exemplo"
        ],
        "rows": [
          [
            "J'ai",
            "J'avais",
            "J'avais un chien"
          ],
          [
            "Il a",
            "Il avait",
            "Il avait dix ans"
          ],
          [
            "Nous avons",
            "Nous avions",
            "Nous avions une maison"
          ],
          [
            "Il y a",
            "Il y avait",
            "Il y avait du monde"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Quando eu tinha dez anos\" é:",
        "a": "Quand j'avais dix ans.",
        "opts": [
          "Quand j'étais dix ans.",
          "Quand j'ai eu dix ans de.",
          "Quand j'avais dix années vieux.",
          "Quand j'avais dix ans."
        ],
        "why": "Idade com AVOIR, no imparfait."
      },
      {
        "q": "\"Havia muita gente\" é:",
        "a": "Il y avait beaucoup de monde.",
        "opts": [
          "Il y avait beaucoup de monde.",
          "Il était beaucoup de monde.",
          "Il y a eu beaucoup monde.",
          "Il avait beaucoup de monde."
        ],
        "why": "Il y a → il y avait."
      },
      {
        "q": "Complete: \"Nous ___ une petite maison.\"",
        "a": "avions",
        "opts": [
          "avaient",
          "avions",
          "aviez",
          "étions"
        ],
        "why": "Nous → avions."
      },
      {
        "q": "Complete: \"Ils ___ trois enfants.\"",
        "a": "avaient",
        "opts": [
          "avait",
          "avions",
          "avaient",
          "étaient"
        ],
        "why": "Ils → avaient."
      },
      {
        "q": "\"Tu avais raison !\" significa:",
        "a": "Você tinha razão!",
        "opts": [
          "Você vai ter razão!",
          "Você tem razão!",
          "Você não tinha razão!",
          "Você tinha razão!"
        ],
        "why": "Avoir raison no imparfait."
      },
      {
        "q": "\"J'avais l'habitude de lire\" significa:",
        "a": "Eu costumava ler.",
        "opts": [
          "Eu costumava ler.",
          "Eu tinha que ler.",
          "Eu li uma vez.",
          "Eu gosto de ler."
        ],
        "why": "Hábito no passado."
      },
      {
        "q": "Negue: \"Il y avait du wifi.\"",
        "a": "Il n'y avait pas de wifi.",
        "opts": [
          "Il n'y avait pas du wifi.",
          "Il n'y avait pas de wifi.",
          "Il y avait pas wifi ne.",
          "Il n'avait pas de wifi y."
        ],
        "why": "Du vira \"de\" na negação."
      },
      {
        "q": "\"J'avais peur du noir\" significa:",
        "a": "Eu tinha medo do escuro.",
        "opts": [
          "Tenho medo do escuro.",
          "Tive um susto no escuro.",
          "Eu tinha medo do escuro.",
          "Eu gostava do escuro."
        ],
        "why": "Sensação no imparfait."
      },
      {
        "q": "\"Je n'avais pas le choix\" significa:",
        "a": "Eu não tinha escolha.",
        "opts": [
          "Eu não escolhi.",
          "Eu não gostei da escolha.",
          "Não tenho escolha agora.",
          "Eu não tinha escolha."
        ],
        "why": "Avoir le choix."
      },
      {
        "q": "Complete: \"Elle ___ les cheveux longs.\"",
        "a": "avait",
        "opts": [
          "avait",
          "était",
          "avais",
          "avaient"
        ],
        "why": "Elle → avait."
      }
    ],
    "speak": [
      "Quand j'avais dix ans, j'avais un chien.",
      "Il y avait beaucoup de monde au concert.",
      "Nous avions une petite maison à la campagne.",
      "J'avais peur du noir quand j'étais petit.",
      "Il n'y avait pas de wifi dans l'hôtel.",
      "Tu avais raison, le film était excellent !",
      "J'avais l'habitude de lire avant de dormir.",
      "Je n'avais pas le choix, j'ai dû partir."
    ]
  },
  {
    "id": 240,
    "title": "J'ai eu ou J'avais ? Passé Composé ou Imparfait",
    "emoji": "🎬",
    "lang": "fr",
    "verbs": [
      "J'étais",
      "J'ai été",
      "J'avais",
      "J'ai eu",
      "Il y avait"
    ],
    "vocab": [
      {
        "en": "J'étais malade",
        "pt": "Eu estava doente (cenário)"
      },
      {
        "en": "J'ai été malade trois jours",
        "pt": "Fiquei doente três dias (fato fechado)"
      },
      {
        "en": "J'avais peur",
        "pt": "Eu tinha medo (estado)"
      },
      {
        "en": "J'ai eu peur",
        "pt": "Levei um susto (momento)"
      },
      {
        "en": "Il y avait du soleil",
        "pt": "Fazia sol"
      },
      {
        "en": "Il y a eu un orage",
        "pt": "Caiu uma tempestade"
      },
      {
        "en": "J'avais vingt ans",
        "pt": "Eu tinha vinte anos"
      },
      {
        "en": "J'ai eu vingt ans",
        "pt": "Fiz vinte anos"
      },
      {
        "en": "Soudain",
        "pt": "De repente"
      },
      {
        "en": "Tout à coup",
        "pt": "De repente"
      },
      {
        "en": "Pendant que",
        "pt": "Enquanto"
      },
      {
        "en": "Un jour",
        "pt": "Um dia"
      },
      {
        "en": "D'habitude",
        "pt": "Normalmente"
      },
      {
        "en": "Tous les jours",
        "pt": "Todos os dias"
      },
      {
        "en": "Ce jour-là",
        "pt": "Naquele dia"
      },
      {
        "en": "Il était midi quand…",
        "pt": "Era meio-dia quando…"
      },
      {
        "en": "Je dormais quand…",
        "pt": "Eu estava dormindo quando…"
      },
      {
        "en": "C'était le jour où…",
        "pt": "Foi o dia em que…"
      }
    ],
    "expressions": [
      {
        "expr": "J'étais en train de… quand…",
        "meaning": "Eu estava… quando…",
        "example": "J'étais en train de cuisiner quand le téléphone a sonné."
      },
      {
        "expr": "Tout à coup, il y a eu…",
        "meaning": "De repente, houve…",
        "example": "Tout à coup, il y a eu une panne d'électricité."
      },
      {
        "expr": "J'ai eu une peur bleue",
        "meaning": "Levei um susto enorme",
        "example": "Un chien est sorti de nulle part, j'ai eu une peur bleue !"
      },
      {
        "expr": "Ce jour-là, il faisait…",
        "meaning": "Naquele dia, estava…",
        "example": "Ce jour-là, il faisait très beau."
      },
      {
        "expr": "D'habitude… mais ce jour-là…",
        "meaning": "Normalmente… mas naquele dia…",
        "example": "D'habitude, j'étais à l'heure, mais ce jour-là, j'ai raté le bus."
      },
      {
        "expr": "Ça a été le plus beau jour",
        "meaning": "Foi o dia mais bonito",
        "example": "Notre mariage, ça a été le plus beau jour de ma vie."
      }
    ],
    "sentences": [
      "Il était midi et il y avait du soleil.",
      "J'étais à la plage quand tout à coup il y a eu un orage.",
      "J'avais vingt ans quand je suis arrivé en France.",
      "J'ai eu vingt ans à Paris.",
      "J'avais peur des chiens, mais un jour j'ai eu un chiot.",
      "Il y avait beaucoup de monde, et soudain la musique a commencé.",
      "Je dormais quand le téléphone a sonné.",
      "J'ai été malade pendant trois jours.",
      "D'habitude, il était calme, mais ce jour-là il a crié.",
      "C'était le jour où j'ai eu mon diplôme."
    ],
    "grammar": {
      "title": "Imparfait = o cenário · Passé composé = o que aconteceu",
      "rules": [
        "<b>Imparfait: descrição, estado, hábito:</b> Como as coisas eram ou estavam, o que se fazia sempre: \"Il y avait du soleil\", \"J'étais à la plage\", \"D'habitude, j'avais cours le lundi\".",
        "<b>Passé composé: o acontecimento:</b> Uma ação que aconteceu num momento ou durou um tempo fechado: \"Il y a eu un orage\", \"J'ai eu peur\" (levei um susto), \"J'ai été malade trois jours\".",
        "<b>Os dois juntos:</b> O imparfait abre a cena, o passé composé corta a cena: \"J'étais en train de cuisiner QUAND le téléphone a sonné\". Palavras como \"soudain\", \"tout à coup\" e \"un jour\" pedem passé composé."
      ],
      "table": {
        "headers": [
          "Imparfait (cenário)",
          "Passé composé (acontecimento)",
          "Diferença"
        ],
        "rows": [
          [
            "J'avais peur",
            "J'ai eu peur",
            "Medo constante x susto"
          ],
          [
            "J'avais vingt ans",
            "J'ai eu vingt ans",
            "Idade que tinha x fazer anos"
          ],
          [
            "J'étais malade",
            "J'ai été malade trois jours",
            "Estado x período fechado"
          ],
          [
            "Il y avait du vent",
            "Il y a eu un orage",
            "Cenário x fato"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Eu tinha vinte anos quando cheguei à França\" é:",
        "a": "J'avais vingt ans quand je suis arrivé en France.",
        "opts": [
          "J'avais vingt ans quand je suis arrivé en France.",
          "J'ai eu vingt ans quand j'arrivais en France.",
          "J'avais vingt ans quand j'arrivais en France.",
          "J'ai eu vingt ans quand je suis arrivé en France."
        ],
        "why": "A idade é o cenário (imparfait), a chegada é o fato (passé composé)."
      },
      {
        "q": "\"Levei um susto\" (num momento) é:",
        "a": "J'ai eu peur.",
        "opts": [
          "J'avais peur.",
          "J'ai eu peur.",
          "J'étais peur.",
          "J'ai été peur."
        ],
        "why": "Momento pontual: passé composé."
      },
      {
        "q": "\"Fazia sol\" (descrevendo o dia) é:",
        "a": "Il y avait du soleil.",
        "opts": [
          "Il y a eu du soleil.",
          "Il a eu du soleil.",
          "Il y avait du soleil.",
          "Il était du soleil."
        ],
        "why": "Cenário: imparfait."
      },
      {
        "q": "Complete: \"Je dormais quand le téléphone ___.\"",
        "a": "a sonné",
        "opts": [
          "sonnait",
          "sonne",
          "sonnera",
          "a sonné"
        ],
        "why": "A ação que interrompe: passé composé."
      },
      {
        "q": "\"Soudain\" pede qual tempo?",
        "a": "Passé composé",
        "opts": [
          "Passé composé",
          "Imparfait",
          "Presente",
          "Futuro"
        ],
        "why": "De repente = acontecimento."
      },
      {
        "q": "\"J'ai été malade pendant trois jours\" usa passé composé porque:",
        "a": "É um período fechado, com começo e fim",
        "opts": [
          "É uma descrição",
          "É um período fechado, com começo e fim",
          "É um hábito",
          "É um estado sem fim"
        ],
        "why": "Duração fechada → passé composé."
      },
      {
        "q": "\"D'habitude\" pede qual tempo?",
        "a": "Imparfait",
        "opts": [
          "Passé composé",
          "Futuro",
          "Imparfait",
          "Nenhum"
        ],
        "why": "Hábito no passado → imparfait."
      },
      {
        "q": "\"J'ai eu vingt ans à Paris\" significa:",
        "a": "Fiz vinte anos em Paris.",
        "opts": [
          "Eu tinha vinte anos em Paris.",
          "Morei vinte anos em Paris.",
          "Faz vinte anos que fui a Paris.",
          "Fiz vinte anos em Paris."
        ],
        "why": "Avoir X ans no passé composé = fazer anos."
      },
      {
        "q": "Complete: \"Il ___ beaucoup de monde, et soudain la musique a commencé.\"",
        "a": "y avait",
        "opts": [
          "y avait",
          "y a eu",
          "avait eu",
          "était"
        ],
        "why": "O cenário: imparfait."
      },
      {
        "q": "\"J'ai eu une peur bleue\" significa:",
        "a": "Levei um susto enorme.",
        "opts": [
          "Eu tinha medo de azul.",
          "Levei um susto enorme.",
          "Fiquei triste.",
          "Eu tinha muito frio."
        ],
        "why": "Expressão: susto enorme."
      }
    ],
    "speak": [
      "Il était midi et il y avait du soleil.",
      "J'étais à la plage quand il y a eu un orage.",
      "J'avais vingt ans quand je suis arrivé en France.",
      "Je dormais quand le téléphone a sonné.",
      "J'ai été malade pendant trois jours.",
      "D'habitude, j'étais à l'heure, mais ce jour-là j'ai raté le bus.",
      "Un chien est sorti de nulle part, j'ai eu une peur bleue !",
      "Notre mariage, ça a été le plus beau jour de ma vie."
    ]
  },
  {
    "id": 241,
    "title": "Le Futur : je serai, j'aurai",
    "emoji": "🔮",
    "lang": "fr",
    "verbs": [
      "Je serai",
      "J'aurai",
      "Il sera",
      "Nous aurons",
      "Il y aura"
    ],
    "vocab": [
      {
        "en": "Je serai",
        "pt": "Eu serei / estarei"
      },
      {
        "en": "Tu seras",
        "pt": "Você será / estará"
      },
      {
        "en": "Il sera",
        "pt": "Ele será / estará"
      },
      {
        "en": "Nous serons",
        "pt": "Nós seremos / estaremos"
      },
      {
        "en": "Vous serez",
        "pt": "Vocês serão / estarão"
      },
      {
        "en": "Ils seront",
        "pt": "Eles serão / estarão"
      },
      {
        "en": "J'aurai",
        "pt": "Eu terei"
      },
      {
        "en": "Tu auras",
        "pt": "Você terá"
      },
      {
        "en": "Il aura",
        "pt": "Ele terá"
      },
      {
        "en": "Nous aurons",
        "pt": "Nós teremos"
      },
      {
        "en": "Vous aurez",
        "pt": "Vocês terão"
      },
      {
        "en": "Ils auront",
        "pt": "Eles terão"
      },
      {
        "en": "Il y aura",
        "pt": "Haverá / Vai ter"
      },
      {
        "en": "Demain",
        "pt": "Amanhã"
      },
      {
        "en": "L'année prochaine",
        "pt": "No ano que vem"
      },
      {
        "en": "Dans cinq ans",
        "pt": "Daqui a cinco anos"
      },
      {
        "en": "Bientôt",
        "pt": "Em breve"
      },
      {
        "en": "Je vais être",
        "pt": "Eu vou ser / estar"
      }
    ],
    "expressions": [
      {
        "expr": "Je serai là",
        "meaning": "Estarei lá / Pode contar comigo",
        "example": "Ne t'inquiète pas, je serai là à huit heures."
      },
      {
        "expr": "Tu auras de mes nouvelles",
        "meaning": "Você vai ter notícias minhas",
        "example": "Je t'écris de Paris, tu auras de mes nouvelles !"
      },
      {
        "expr": "Il y aura du monde",
        "meaning": "Vai ter muita gente",
        "example": "Viens tôt, il y aura du monde au concert."
      },
      {
        "expr": "On verra bien",
        "meaning": "A gente vê / Veremos",
        "example": "Il va pleuvoir demain ? On verra bien !"
      },
      {
        "expr": "Je vais être en retard",
        "meaning": "Vou me atrasar",
        "example": "Il y a des embouteillages, je vais être en retard."
      },
      {
        "expr": "Dans dix ans, j'aurai…",
        "meaning": "Daqui a dez anos, terei…",
        "example": "Dans dix ans, j'aurai ma propre entreprise !"
      }
    ],
    "sentences": [
      "Demain, je serai à Paris.",
      "L'année prochaine, j'aurai trente ans.",
      "Nous serons en vacances en juillet.",
      "Il y aura une fête samedi chez Marie.",
      "Tu auras le temps de m'aider ?",
      "Ils seront contents de te voir.",
      "Dans cinq ans, nous aurons une grande maison.",
      "Je vais être en retard, désolé !",
      "Vous serez libres ce week-end ?",
      "Ne t'inquiète pas, je serai là."
    ],
    "grammar": {
      "title": "O futuro de ÊTRE (SER-) e de AVOIR (AUR-)",
      "rules": [
        "<b>Futur simple de être:</b> Radical SER- + terminações: je serai, tu seras, il sera, nous serons, vous serez, ils seront. \"Je serai là\" (estarei lá).",
        "<b>Futur simple de avoir:</b> Radical AUR- + as mesmas terminações: j'aurai, tu auras, il aura, nous aurons, vous aurez, ils auront. \"Il y a\" vira \"il y aura\".",
        "<b>O futuro próximo da conversa:</b> Na fala, o mais comum é \"aller + infinitivo\": \"Je vais être en retard\", \"On va avoir froid\". O futur simple soa mais firme, como promessa ou plano."
      ],
      "table": {
        "headers": [
          "Pronome",
          "Être",
          "Avoir"
        ],
        "rows": [
          [
            "Je",
            "serai",
            "j'aurai"
          ],
          [
            "Tu / Il",
            "seras / sera",
            "auras / aura"
          ],
          [
            "Nous / Vous",
            "serons / serez",
            "aurons / aurez"
          ],
          [
            "Ils",
            "seront",
            "auront"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Amanhã eu estarei em Paris\" é:",
        "a": "Demain, je serai à Paris.",
        "opts": [
          "Demain, j'aurai à Paris.",
          "Demain, je serai à Paris.",
          "Demain, je suis été à Paris.",
          "Demain, je sera à Paris."
        ],
        "why": "Être no futuro: je serai."
      },
      {
        "q": "\"No ano que vem terei trinta anos\" é:",
        "a": "L'année prochaine, j'aurai trente ans.",
        "opts": [
          "L'année prochaine, je serai trente ans.",
          "L'année prochaine, j'aura trente ans.",
          "L'année prochaine, j'aurai trente ans.",
          "L'année prochaine, j'avais trente ans."
        ],
        "why": "Idade com AVOIR no futuro: j'aurai."
      },
      {
        "q": "Complete: \"Nous ___ en vacances en juillet.\"",
        "a": "serons",
        "opts": [
          "aurons",
          "seront",
          "serez",
          "serons"
        ],
        "why": "Nous → serons."
      },
      {
        "q": "Complete: \"Il y ___ une fête samedi.\"",
        "a": "aura",
        "opts": [
          "aura",
          "sera",
          "avait",
          "a eu"
        ],
        "why": "Il y a → il y aura."
      },
      {
        "q": "Complete: \"Ils ___ contents de te voir.\"",
        "a": "seront",
        "opts": [
          "auront",
          "seront",
          "serons",
          "sera"
        ],
        "why": "Ils → seront."
      },
      {
        "q": "\"Je vais être en retard\" é:",
        "a": "O futuro próximo, comum na fala",
        "opts": [
          "Um erro: tem que ser \"je serai en retard\"",
          "O passado",
          "O futuro próximo, comum na fala",
          "O imparfait"
        ],
        "why": "Aller + infinitivo."
      },
      {
        "q": "\"On verra bien\" significa:",
        "a": "A gente vê. / Veremos.",
        "opts": [
          "A gente viu bem.",
          "Vamos ver um filme.",
          "Enxergamos bem.",
          "A gente vê. / Veremos."
        ],
        "why": "Expressão de espera."
      },
      {
        "q": "Complete: \"Tu ___ le temps de m'aider ?\"",
        "a": "auras",
        "opts": [
          "auras",
          "seras",
          "aura",
          "auront"
        ],
        "why": "Ter tempo: AVOIR → tu auras."
      },
      {
        "q": "Qual é o radical do futuro de \"avoir\"?",
        "a": "aur-",
        "opts": [
          "av-",
          "aur-",
          "ser-",
          "ai-"
        ],
        "why": "J'aurai, tu auras…"
      },
      {
        "q": "\"Je serai là\" significa:",
        "a": "Estarei lá. / Pode contar comigo.",
        "opts": [
          "Eu estava lá.",
          "Eu sou de lá.",
          "Estarei lá. / Pode contar comigo.",
          "Fui lá."
        ],
        "why": "Promessa de presença."
      }
    ],
    "speak": [
      "Demain, je serai à Paris.",
      "L'année prochaine, j'aurai trente ans.",
      "Nous serons en vacances en juillet.",
      "Il y aura une fête samedi chez Marie.",
      "Ne t'inquiète pas, je serai là !",
      "Il y a des embouteillages, je vais être en retard.",
      "Dans dix ans, j'aurai ma propre entreprise !",
      "Il va pleuvoir demain ? On verra bien !"
    ]
  },
  {
    "id": 242,
    "title": "Grande Révision : Être & Avoir dans Tous les Temps",
    "emoji": "🏆",
    "lang": "fr",
    "verbs": [
      "Je suis",
      "J'ai été",
      "J'étais",
      "Je serai",
      "J'aurai"
    ],
    "vocab": [
      {
        "en": "Je suis",
        "pt": "Eu sou / estou (presente)"
      },
      {
        "en": "J'ai été",
        "pt": "Eu fui / fiquei (passé composé)"
      },
      {
        "en": "J'étais",
        "pt": "Eu era / estava (imparfait)"
      },
      {
        "en": "Je serai",
        "pt": "Eu serei / estarei (futuro)"
      },
      {
        "en": "J'ai",
        "pt": "Eu tenho (presente)"
      },
      {
        "en": "J'ai eu",
        "pt": "Eu tive (passé composé)"
      },
      {
        "en": "J'avais",
        "pt": "Eu tinha (imparfait)"
      },
      {
        "en": "J'aurai",
        "pt": "Eu terei (futuro)"
      },
      {
        "en": "Il y a",
        "pt": "Há (presente)"
      },
      {
        "en": "Il y a eu",
        "pt": "Houve (passé composé)"
      },
      {
        "en": "Il y avait",
        "pt": "Havia (imparfait)"
      },
      {
        "en": "Il y aura",
        "pt": "Haverá (futuro)"
      },
      {
        "en": "Aujourd'hui",
        "pt": "Hoje"
      },
      {
        "en": "Hier",
        "pt": "Ontem"
      },
      {
        "en": "Demain",
        "pt": "Amanhã"
      },
      {
        "en": "Maintenant",
        "pt": "Agora"
      },
      {
        "en": "Avant",
        "pt": "Antes"
      },
      {
        "en": "Plus tard",
        "pt": "Mais tarde"
      }
    ],
    "expressions": [
      {
        "expr": "Avant, j'étais… maintenant je suis…",
        "meaning": "Antes eu era… agora sou…",
        "example": "Avant, j'étais timide ; maintenant, je suis plus confiant."
      },
      {
        "expr": "J'ai toujours eu…",
        "meaning": "Sempre tive…",
        "example": "J'ai toujours eu envie de visiter le Québec."
      },
      {
        "expr": "Un jour, je serai…",
        "meaning": "Um dia eu serei…",
        "example": "Un jour, je serai bilingue !"
      },
      {
        "expr": "Il y a eu un changement",
        "meaning": "Houve uma mudança",
        "example": "Il y a eu un changement de programme, la réunion est à midi."
      },
      {
        "expr": "Quand j'aurai le temps",
        "meaning": "Quando eu tiver tempo",
        "example": "Je t'appellerai quand j'aurai le temps."
      },
      {
        "expr": "Ça a été un plaisir",
        "meaning": "Foi um prazer",
        "example": "Merci pour tout, ça a été un plaisir de travailler avec vous."
      }
    ],
    "sentences": [
      "Aujourd'hui, je suis content ; hier, j'étais fatigué.",
      "Quand j'avais quinze ans, je n'avais pas de portable.",
      "L'année dernière, j'ai eu un accident, mais j'ai eu de la chance.",
      "Demain, nous serons à Lyon et nous aurons une réunion.",
      "Avant, il y avait un cinéma ici ; maintenant, il y a un supermarché.",
      "Un jour, je serai bilingue !",
      "Il y a eu un problème, mais tout est réglé.",
      "Quand j'aurai le temps, je t'appellerai.",
      "Elle a été très gentille avec nous.",
      "Ça a été un plaisir, à bientôt !"
    ],
    "grammar": {
      "title": "Être e Avoir em quatro tempos",
      "rules": [
        "<b>Presente e passé composé:</b> Être: je suis → j'ai été. Avoir: j'ai → j'ai eu. \"Il y a\" → \"il y a eu\". O passé composé conta o fato que aconteceu.",
        "<b>Imparfait:</b> Être: j'étais. Avoir: j'avais. \"Il y avait\". Para descrever, contar a idade que tinha e o que se fazia sempre.",
        "<b>Futur simple:</b> Être: je serai. Avoir: j'aurai. \"Il y aura\". Depois de \"quand\" falando do futuro, o francês usa o futuro: \"Quand j'aurai le temps\" (quando eu tiver tempo)."
      ],
      "table": {
        "headers": [
          "Tempo",
          "Être",
          "Avoir"
        ],
        "rows": [
          [
            "Presente",
            "je suis",
            "j'ai"
          ],
          [
            "Passé composé",
            "j'ai été",
            "j'ai eu"
          ],
          [
            "Imparfait",
            "j'étais",
            "j'avais"
          ],
          [
            "Futur",
            "je serai",
            "j'aurai"
          ]
        ]
      }
    },
    "quiz": [
      {
        "q": "\"Ontem eu estava cansado\" é:",
        "a": "Hier, j'étais fatigué.",
        "opts": [
          "Hier, je suis fatigué.",
          "Hier, je serai fatigué.",
          "Hier, j'étais fatigué.",
          "Hier, j'avais fatigué."
        ],
        "why": "Descrição no passado: imparfait de être."
      },
      {
        "q": "\"Quando eu tinha quinze anos\" é:",
        "a": "Quand j'avais quinze ans.",
        "opts": [
          "Quand j'étais quinze ans.",
          "Quand j'aurai quinze ans.",
          "Quand j'ai quinze ans.",
          "Quand j'avais quinze ans."
        ],
        "why": "Idade no passado: imparfait de avoir."
      },
      {
        "q": "\"Amanhã teremos uma reunião\" é:",
        "a": "Demain, nous aurons une réunion.",
        "opts": [
          "Demain, nous aurons une réunion.",
          "Demain, nous serons une réunion.",
          "Demain, nous avions une réunion.",
          "Demain, nous avons eu une réunion."
        ],
        "why": "Futuro de avoir: nous aurons."
      },
      {
        "q": "\"Houve um problema\" é:",
        "a": "Il y a eu un problème.",
        "opts": [
          "Il a eu un problème.",
          "Il y a eu un problème.",
          "Il était un problème.",
          "Il y aura un problème."
        ],
        "why": "Fato pontual: il y a eu."
      },
      {
        "q": "\"Antes havia um cinema aqui\" é:",
        "a": "Avant, il y avait un cinéma ici.",
        "opts": [
          "Avant, il y a eu un cinéma ici.",
          "Avant, il était un cinéma ici.",
          "Avant, il y avait un cinéma ici.",
          "Avant, il y aura un cinéma ici."
        ],
        "why": "Cenário antigo: il y avait."
      },
      {
        "q": "\"Quando eu tiver tempo, te ligo\" é:",
        "a": "Quand j'aurai le temps, je t'appellerai.",
        "opts": [
          "Quand j'ai le temps, je t'appellerai.",
          "Quand j'avais le temps, je t'appellerai.",
          "Quand je serai le temps, je t'appellerai.",
          "Quand j'aurai le temps, je t'appellerai."
        ],
        "why": "Depois de \"quand\" no futuro: futuro."
      },
      {
        "q": "\"Elle a été très gentille\" significa:",
        "a": "Ela foi muito gentil.",
        "opts": [
          "Ela foi muito gentil.",
          "Ela é muito gentil.",
          "Ela era sempre gentil.",
          "Ela será muito gentil."
        ],
        "why": "Passé composé de être."
      },
      {
        "q": "Qual forma é o futuro de \"être\" para \"eu\"?",
        "a": "je serai",
        "opts": [
          "j'étais",
          "je serai",
          "j'ai été",
          "j'aurai"
        ],
        "why": "Je serai."
      },
      {
        "q": "\"J'ai toujours eu envie de visiter le Québec\" significa:",
        "a": "Sempre tive vontade de visitar o Québec.",
        "opts": [
          "Vou ter vontade de visitar o Québec.",
          "Visitei o Québec sempre.",
          "Sempre tive vontade de visitar o Québec.",
          "Tenho vontade agora de visitar o Québec."
        ],
        "why": "Avoir envie no passé composé."
      },
      {
        "q": "\"Ça a été un plaisir\" é dito:",
        "a": "Ao se despedir, agradecendo pelo tempo junto",
        "opts": [
          "Ao chegar num lugar",
          "Ao pedir um favor",
          "Ao reclamar",
          "Ao se despedir, agradecendo pelo tempo junto"
        ],
        "why": "Foi um prazer."
      }
    ],
    "speak": [
      "Aujourd'hui, je suis content ; hier, j'étais fatigué.",
      "Quand j'avais quinze ans, je n'avais pas de portable.",
      "L'année dernière, j'ai eu de la chance.",
      "Demain, nous serons à Lyon et nous aurons une réunion.",
      "Avant, il y avait un cinéma ici.",
      "Un jour, je serai bilingue !",
      "Quand j'aurai le temps, je t'appellerai.",
      "Merci pour tout, ça a été un plaisir !"
    ]
  }
];

if (typeof window !== 'undefined') window.LESSONS_FR = LESSONS_FR;
