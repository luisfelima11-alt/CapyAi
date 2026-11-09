// ══════════════════════════════════════════════════════════════════════════════
// Preparação de aula — conteúdo escrito à mão para as 12 aulas de francês
// ══════════════════════════════════════════════════════════════════════════════
// O resto (diálogo, palavras, frases para repetir) sai dos dados da própria aula
// (fr-lessons-part1/2.mjs). Aqui fica só o que a aula não tem:
//   compreensao — 3 perguntas sobre o diálogo, para responder SÓ OUVINDO
//                 (a certa é sempre a primeira; a página embaralha);
//   perceber    — 2 "noticing": um trecho do diálogo para o aluno reparar
//                 (linha = índice em dialogueLines; trecho tem que existir nela);
//   pergunta    — a pergunta que o professor faz na aula, para o aluno
//                 responder em voz antes (fr, pt e um exemplo de resposta).
// Regras do curso: nada de pronúncia escrita e nada das palavras
// "gramática"/"grammar" para o aluno. O build confere as duas.
// ══════════════════════════════════════════════════════════════════════════════

export const FR_PREPARACAO = {
  1: {
    compreensao: [
      { q: 'Onde a Yara está?', opts: ['Num café em Paris', 'Numa padaria', 'Num museu'] },
      { q: 'De onde a Yara vem?', opts: ['Do Brasil', 'Da França', 'De Portugal'] },
      { q: 'O que a Yara pede ao garçom?', opts: ['Um café e um croissant', 'Um suco de laranja', 'Uma garrafa de água'] },
    ],
    perceber: [
      { linha: 1, trecho: 'et vous', pergunta: 'Léo e Yara acabaram de se conhecer. Que palavra o Léo usa para dizer "você"?',
        opts: ['vous', 'tu', 'toi'], explica: 'Com quem você acabou de conhecer, o francês usa vous, o jeito educado. Tu fica para amigos e família.' },
      { linha: 7, trecho: 'Bonne journée', pergunta: 'No fim da conversa, o Léo diz "Bonne journée". Quando se usa?',
        opts: ['Na despedida: tenha um bom dia', 'Na chegada: bom dia', 'À noite, antes de dormir'], explica: 'Bonjour é para chegar. Bonne journée é para ir embora, desejando um bom dia.' },
    ],
    pergunta: { fr: "Comment vous appelez-vous ? D'où venez-vous ?", pt: 'Como você se chama? De onde você vem?', exemplo: 'Je m\'appelle Ana. Je viens du Brésil. Enchantée !' },
  },
  2: {
    compreensao: [
      { q: 'Quantos croissants a Yara pede?', opts: ['Três', 'Dois', 'Nove'] },
      { q: 'Quanto dá a conta?', opts: ['Nove euros', 'Dez euros', 'Um euro'] },
      { q: 'Quantos anos tem a irmã da Yara?', opts: ['Dezesseis', 'Dezenove', 'Vinte'] },
    ],
    perceber: [
      { linha: 6, trecho: "J'ai dix-neuf ans", pergunta: 'Para dizer a idade, que verbo a Yara usa?',
        opts: ["J'ai (eu tenho)", 'Je suis (eu sou)', 'Je fais (eu faço)'], explica: "Em francês a idade é com avoir (ter) + ans: j'ai dix-neuf ans. Nunca je suis dix-neuf." },
      { linha: 1, trecho: 'Ça fait neuf euros', pergunta: 'Repare como a padeira diz o total: "Ça fait neuf euros". O que "ça fait" quer dizer aqui?',
        opts: ['Dá (o total é)', 'Faz frio', 'Eu faço'], explica: 'Ça fait + preço é o jeito natural de dizer o total da compra: ça fait neuf euros, dá nove euros.' },
    ],
    pergunta: { fr: 'Quel âge avez-vous ?', pt: 'Quantos anos você tem?', exemplo: "J'ai dix-neuf ans. Et mon frère a seize ans." },
  },
  3: {
    compreensao: [
      { q: 'Onde a Yara e a Camille estão?', opts: ['Numa loja', 'Num café', 'Num museu'] },
      { q: 'Para quem a Yara procura um presente?', opts: ['Para a mãe', 'Para a Camille', 'Para o irmão'] },
      { q: 'O que a Yara decide levar?', opts: ['O lenço violeta', 'O vestido branco', 'Os sapatos marrons'] },
    ],
    perceber: [
      { linha: 2, trecho: 'cette petite robe blanche', pergunta: 'Em "cette petite robe blanche", qual palavra vem DEPOIS de robe?',
        opts: ['blanche (a cor)', 'petite (o tamanho)', 'as duas'], explica: 'A cor vem depois da coisa (robe blanche). Tamanho e beleza costumam vir antes (petite robe).' },
      { linha: 3, trecho: 'ces chaussures marron', pergunta: 'Chaussures é feminino e plural, mas a cor fica "marron", sem -e e sem -s. Por quê?',
        opts: ['Marron nunca muda', 'É um erro de digitação', 'Porque é sapato'], explica: 'Marron e orange são as cores que nunca mudam: des chaussures marron, une robe orange.' },
    ],
    pergunta: { fr: 'Quelle est ta couleur préférée ?', pt: 'Qual é a sua cor favorita?', exemplo: "Ma couleur préférée, c'est le bleu. J'aime aussi le vert." },
  },
  4: {
    compreensao: [
      { q: 'O que a Chloé vê no celular da Yara?', opts: ['Uma foto da família', 'Um vídeo de Paris', 'Uma mensagem'] },
      { q: 'Onde mora o irmão da Yara?', opts: ['No Rio', 'Em Paris', 'Em São Paulo'] },
      { q: 'Quem é Pipoca?', opts: ['O cachorro dos avós', 'A prima da Yara', 'A amiga da Yara'] },
    ],
    perceber: [
      { linha: 5, trecho: 'mon amie Bia', pergunta: 'Amie é feminino (amiga), mas a Yara diz "mon amie", e não "ma amie". Por quê?',
        opts: ['Porque amie começa com vogal', 'Porque a Bia é homem', 'Tanto faz'], explica: 'Antes de vogal, ma vira mon para soar bem: mon amie, mon école.' },
      { linha: 1, trecho: 'mon père', pergunta: 'Mon père, ma mère, mes parents. O que decide entre mon, ma e mes?',
        opts: ['A palavra que vem depois', 'Se quem fala é homem ou mulher', 'A idade da pessoa'], explica: 'Mon, ma e mes combinam com a palavra que vem depois: mon (masculino), ma (feminino), mes (plural), seja quem for que fala.' },
    ],
    pergunta: { fr: 'Tu as des frères et sœurs ?', pt: 'Você tem irmãos e irmãs?', exemplo: "Oui, j'ai un frère et une sœur. Mon frère s'appelle Pedro." },
  },
  5: {
    compreensao: [
      { q: 'Em que cidade a Yara e o Thomas estão?', opts: ['Lyon', 'Paris', 'Nice'] },
      { q: 'Como está o tempo?', opts: ['Frio', 'Calor', 'Chuva forte'] },
      { q: 'Aonde eles decidem ir?', opts: ['A um bistrô', 'Ao hotel', 'A um museu'] },
    ],
    perceber: [
      { linha: 1, trecho: "j'ai un peu froid", pergunta: '"Estou com frio" e "estou com fome": que verbo o francês usa?',
        opts: ["avoir: j'ai froid, j'ai faim", 'être: je suis froid', 'faire: je fais faim'], explica: "O que o corpo sente vai com avoir (ter): j'ai froid, j'ai faim, j'ai soif." },
      { linha: 5, trecho: 'je suis prête', pergunta: '"Estou pronta" e "estou cansada": aqui a Yara usa qual verbo?',
        opts: ['je suis (être)', "j'ai (avoir)", 'je fais (faire)'], explica: 'Être serve para ser e para estar: je suis prête, je suis fatiguée.' },
    ],
    pergunta: { fr: 'Comment ça va aujourd\'hui ? Tu as faim ? Tu es fatigué(e) ?', pt: 'Como você está hoje? Está com fome? Está cansado(a)?', exemplo: 'Ça va bien ! J\'ai un peu faim, mais je ne suis pas fatiguée.' },
  },
  6: {
    compreensao: [
      { q: 'Qual é o prato do dia?', opts: ['Frango assado com arroz e salada', 'Sopa de cebola', 'Crepe de queijo'] },
      { q: 'O que a Yara pede para beber?', opts: ['Água e suco de laranja', 'Vinho tinto', 'Café com leite'] },
      { q: 'O que ela pede no final?', opts: ['Um café e a conta', 'Uma sobremesa', 'O cardápio de novo'] },
    ],
    perceber: [
      { linha: 2, trecho: 'du riz et de la salade', pergunta: '"Du riz", "de la salade". Essas palavrinhas antes da comida indicam:',
        opts: ['Uma parte, um pouco de', 'Que é do garçom', 'O preço'], explica: 'Du (masculino) e de la (feminino) falam de uma quantidade que não se conta: du riz, de la salade, du pain.' },
      { linha: 7, trecho: 'je voudrais', pergunta: 'No fim, a Yara pede com "je voudrais". É um jeito:',
        opts: ['Educado de pedir: eu gostaria', 'Mandão: eu quero já', 'De recusar'], explica: 'Je voudrais quer dizer eu gostaria. É o jeito mais educado de pedir em restaurante e loja.' },
    ],
    pergunta: { fr: "Qu'est-ce que vous mangez au petit-déjeuner ?", pt: 'O que você come no café da manhã?', exemplo: 'Au petit-déjeuner, je mange du pain avec du beurre et je bois un café.' },
  },
  7: {
    compreensao: [
      { q: 'Quando é o aniversário do Antoine?', opts: ['Sexta, 14 de maio', 'Quarta, 12 de maio', '1º de agosto'] },
      { q: 'O que o Antoine vai fazer no aniversário?', opts: ['Um jantar no restaurante com amigos', 'Uma viagem', 'Uma festa em casa'] },
      { q: 'Quando é o aniversário da Yara?', opts: ['1º de agosto', '14 de maio', 'Em março'] },
    ],
    perceber: [
      { linha: 5, trecho: 'Le vendredi', pergunta: '"Le vendredi, j\'ai mon cours de français." Com "le" antes do dia, quer dizer:',
        opts: ['Toda sexta-feira', 'Só nesta sexta', 'Na sexta passada'], explica: 'Le vendredi é às sextas, sempre. Vendredi sem le é esta sexta.' },
      { linha: 7, trecho: 'le premier août', pergunta: 'Na data "le premier août", o dia 1º é dito com:',
        opts: ['premier (primeiro)', 'un (um)', 'le un'], explica: 'O dia 1º é le premier. Os outros dias usam o número: le douze mai, le quatorze mai.' },
    ],
    pergunta: { fr: 'Quand est ton anniversaire ?', pt: 'Quando é o seu aniversário?', exemplo: 'Mon anniversaire est le dix-huit mars.' },
  },
  8: {
    compreensao: [
      { q: 'Por que a Yara pergunta as horas?', opts: ['O celular dela está sem bateria', 'Ela perdeu o relógio', 'Ela está atrasada'] },
      { q: 'A que horas parte o trem?', opts: ['Nove e meia', 'Nove e dez', 'Quinze para as nove'] },
      { q: 'O que a Yara faz no domingo?', opts: ['Dorme até o meio-dia', 'Acorda às seis e meia', 'Trabalha cedo'] },
    ],
    perceber: [
      { linha: 1, trecho: 'neuf heures moins le quart', pergunta: '"Il est neuf heures moins le quart." Que horas são?',
        opts: ['8h45', '9h15', '9h45'], explica: 'Moins le quart é "menos quinze": neuf heures moins le quart = 8h45. Et quart = e quinze, et demie = e meia.' },
      { linha: 4, trecho: 'je me réveille', pergunta: '"Je me réveille", "je me lève". O "me" mostra que:',
        opts: ['A Yara faz a ação nela mesma', 'Alguém acorda a Yara', 'Já aconteceu'], explica: 'Os verbos da rotina levam me, te, se: je me lève (eu me levanto), tu te couches (você se deita).' },
    ],
    pergunta: { fr: 'À quelle heure tu te lèves le matin ?', pt: 'A que horas você se levanta de manhã?', exemplo: 'Je me lève à six heures et demie.' },
  },
  9: {
    compreensao: [
      { q: 'Que estação é em Paris?', opts: ['Outono', 'Primavera', 'Verão'] },
      { q: 'Quantos graus faz em Paris?', opts: ['Doze', 'Vinte e oito', 'Vinte'] },
      { q: 'O que a Yara quer muito ver?', opts: ['A neve', 'O mar', 'A Torre Eiffel'] },
    ],
    perceber: [
      { linha: 1, trecho: 'il y a du vent', pergunta: '"Il fait frais, il y a du vent et il pleut un peu." Qual parte usa "il y a"?',
        opts: ['O vento: il y a du vent', 'O fresquinho', 'A chuva'], explica: 'Il fait + como está (il fait frais), il y a + o que existe (il y a du vent, du soleil) e o verbo direto (il pleut, il neige).' },
      { linha: 7, trecho: 'il va neiger', pergunta: '"En janvier, il va neiger." "Va neiger" fala de:',
        opts: ['O futuro: vai nevar', 'O passado: nevou', 'Agora: está nevando'], explica: 'Aller + verbo é o futuro de logo mais, igual ao "vai nevar" do português: il va neiger, il va pleuvoir.' },
    ],
    pergunta: { fr: "Quel temps fait-il aujourd'hui chez toi ?", pt: 'Como está o tempo hoje aí onde você está?', exemplo: "Aujourd'hui, il fait beau et il fait trente degrés !" },
  },
  10: {
    compreensao: [
      { q: 'O que a Yara está procurando?', opts: ['O Museu do Louvre', 'A Torre Eiffel', 'Uma padaria'] },
      { q: 'O museu fica longe?', opts: ['Não, a dez minutos a pé', 'Sim, precisa de metrô', 'Fica a uma hora'] },
      { q: 'O que ela faz no semáforo?', opts: ['Vira à esquerda', 'Vira à direita', 'Segue em frente'] },
    ],
    perceber: [
      { linha: 5, trecho: 'tournez à gauche et traversez', pergunta: 'Allez, tournez, traversez: as instruções da moradora terminam em -ez. Por quê?',
        opts: ['É o jeito educado de dar instruções (vous)', 'Falam do passado', 'São só para homens'], explica: 'Com vous, a instrução termina em -ez: allez (vá), tournez (vire), traversez (atravesse).' },
      { linha: 7, trecho: 'à côté du grand jardin', pergunta: '"En face du pont", "à côté du grand jardin". Aqui "du" é:',
        opts: ['de + le (do)', 'um pouco de', 'dois'], explica: 'Depois de en face, à côté e près, de + le vira du: à côté du jardin, en face du pont.' },
    ],
    pergunta: { fr: "Excusez-moi, la gare, c'est loin d'ici ?", pt: 'Com licença, a estação fica longe daqui? (Responda dando o caminho.)', exemplo: "Non, c'est à cinq minutes à pied. Allez tout droit et tournez à droite." },
  },
  11: {
    compreensao: [
      { q: 'O que a Yara procura na loja?', opts: ['Um casaco quente', 'Um vestido', 'Sapatos'] },
      { q: 'Qual é o tamanho da Yara?', opts: ['38 (M)', '42 (G)', '36 (P)'] },
      { q: 'Como ela paga?', opts: ['Com cartão', 'Em dinheiro', 'Pelo celular'] },
    ],
    perceber: [
      { linha: 7, trecho: 'ce manteau et cette écharpe', pergunta: '"Ce manteau" e "cette écharpe": os dois querem dizer este/esta. Por que mudam?',
        opts: ['Manteau é masculino, écharpe é feminino', 'Um é caro e o outro barato', 'Tanto faz'], explica: 'Ce vai com masculino (ce manteau), cette com feminino (cette écharpe) e ces com plural (ces chaussures).' },
      { linha: 3, trecho: 'Je fais du 38', pergunta: 'Para dizer o tamanho, a Yara diz "je fais du 38". Quer dizer:',
        opts: ['Eu visto 38', 'Eu tenho 38 anos', 'Custa 38 euros'], explica: 'Je fais du 38 é o jeito natural de dizer o seu tamanho de roupa.' },
    ],
    pergunta: { fr: "Qu'est-ce que tu portes aujourd'hui ?", pt: 'O que você está vestindo hoje?', exemplo: "Aujourd'hui, je porte un jean bleu et un t-shirt blanc." },
  },
  12: {
    compreensao: [
      { q: 'Aonde a Yara foi no sábado de manhã?', opts: ['Ao Museu do Louvre', 'À Torre Eiffel', 'A um parque'] },
      { q: 'O que ela comeu no almoço?', opts: ['Um crepe de queijo', 'Um croissant', 'Frango assado'] },
      { q: 'Com quem ela subiu na Torre Eiffel?', opts: ['Com o Léo', 'Com a Camille', 'Sozinha'] },
    ],
    perceber: [
      { linha: 3, trecho: "j'ai vu la Joconde", pergunta: 'Para dizer "fui", a Yara usa "je suis allée". E para dizer "vi"?',
        opts: ["j'ai vu (avoir)", 'je suis vu (être)', 'je vais voir'], explica: "A maioria dos verbos usa avoir: j'ai vu, j'ai mangé. Os de ir, vir, sair e subir usam être: je suis allée, je suis sortie." },
      { linha: 3, trecho: 'je suis allée', pergunta: 'A Yara diz "allée", com -e no fim. Por quê?',
        opts: ['A Yara é mulher e o verbo vai com être', 'É um erro', 'Porque é plural'], explica: 'Com être, o fim muda com quem fala: il est allé, elle est allée.' },
    ],
    pergunta: { fr: "Qu'est-ce que tu as fait le week-end dernier ?", pt: 'O que você fez no fim de semana passado?', exemplo: 'Samedi, j\'ai mangé une pizza avec mes amis et dimanche, je suis allée au parc.' },
  },
};
