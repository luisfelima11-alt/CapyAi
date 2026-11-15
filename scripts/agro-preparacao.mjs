// ══════════════════════════════════════════════════════════════════════════════
// Preparação de aula — conteúdo escrito à mão para o Agro English (aulas 11 a 15)
// ══════════════════════════════════════════════════════════════════════════════
// O resto (diálogo, palavras, frases para repetir) sai dos dados da própria aula
// (scripts/agroNN-dialogo.json e agroNN-conteudo.json). Aqui fica só o que a
// aula não tem:
//   compreensao — 3 perguntas sobre o diálogo, para responder SÓ OUVINDO as
//                 falas principais (as `extra` não tocam na Preparação);
//                 a certa é sempre a primeira; a página embaralha;
//   perceber    — 2 "noticing": um trecho de uma fala principal para o aluno
//                 reparar (o build acha a fala pelo trecho);
//   pergunta    — a pergunta que o professor faz na aula, para o aluno
//                 responder em voz antes (en, pt e um exemplo de resposta).
// Regra: nada das palavras "gramática"/"grammar" para o aluno. O build confere.
// Aula nova na Preparação? Acrescente o número aqui e rode:
//   node scripts/build-preparacao.mjs && node scripts/build-agro-aula.mjs NN
// ══════════════════════════════════════════════════════════════════════════════

export const AGRO_PREPARACAO = {
  11: {
    compreensao: [
      { q: 'O que o Luan está fazendo agora?', opts: ['Verificando a lavoura de soja', 'Dirigindo o trator', 'Consertando o pivô'] },
      { q: 'Quem está dirigindo o trator?', opts: ['O Tiago', 'O Pedro', 'O Jack'] },
      { q: 'Por que eles não estão usando o drone hoje?', opts: ['A bateria está carregando', 'Está chovendo', 'O drone quebrou'] },
    ],
    perceber: [
      { trecho: "I'm checking", pergunta: 'O Luan fala do que está fazendo neste momento. Como ele monta a frase?',
        opts: ["I'm + verbo com -ing", 'I + verbo sem mudar nada', 'I will + verbo'],
        explica: "Para o que está acontecendo agora, o inglês usa am / is / are + verbo com -ing: I'm checking, he's fixing, we're waiting." },
      { trecho: "No, we aren't", pergunta: 'O Jack pergunta "Are you using the drone today?". Como o Luan responde "não" do jeito curto?',
        opts: ["No, we aren't.", "No, we don't.", 'No, we not.'],
        explica: "A resposta curta repete o começo da pergunta: Are you…? No, we aren't. Is Pedro…? Yes, he is." },
    ],
    pergunta: { en: 'What are you doing now?', pt: 'O que você está fazendo agora?', exemplo: "I'm studying English. My brother is working on the farm." },
  },
  12: {
    compreensao: [
      { q: 'Quando eles colheram a soja?', opts: ['No sábado', 'No domingo', 'Na segunda-feira'] },
      { q: 'Quantos caminhões eles carregaram?', opts: ['Seis', 'Dois', 'Dez'] },
      { q: 'Que problema a colheitadeira teve?', opts: ['Uma correia quebrou', 'Acabou o combustível', 'O pneu furou'] },
    ],
    perceber: [
      { trecho: 'We harvested', pergunta: 'O Luan conta o que já aconteceu. O que muda no verbo harvest?',
        opts: ['Ganha -ed no final: harvested', 'Ganha -ing no final: harvesting', 'Não muda nada: harvest'],
        explica: 'Para contar o que já aconteceu, a maioria dos verbos ganha -ed: harvested, finished, loaded, cleaned.' },
      { trecho: 'Did you finish', pergunta: 'Na pergunta sobre o passado, o Jack diz "Did you finish…?". Como fica o verbo depois de did?',
        opts: ['Na forma simples: finish', 'Com -ed: finished', 'Com -ing: finishing'],
        explica: 'Na pergunta, quem mostra o passado é o did. O verbo volta à forma simples: Did you finish? Yes, we did.' },
    ],
    pergunta: { en: 'What did you do last weekend?', pt: 'O que você fez no último fim de semana?', exemplo: 'I worked on Saturday. On Sunday I visited my family.' },
  },
  13: {
    compreensao: [
      { q: 'De qual trator o Luan gosta?', opts: ['Do verde', 'Do vermelho', 'Do azul'] },
      { q: 'Qual trator é mais barato?', opts: ['O vermelho', 'O verde', 'Os dois custam igual'] },
      { q: 'No fim, qual eles acham o melhor para a fazenda?', opts: ['O verde, o melhor para talhões grandes', 'O vermelho, porque é mais barato', 'Nenhum dos dois'] },
    ],
    perceber: [
      { trecho: 'bigger than', pergunta: 'Para comparar os dois tratores, que palavrinha vem depois de bigger?',
        opts: ['than', 'that', 'of'],
        explica: 'Na comparação, depois de bigger, stronger ou cheaper vem than: bigger than the red one (maior do que o vermelho).' },
      { trecho: 'more expensive', pergunta: 'Com big, o inglês diz bigger. E com uma palavra comprida, como expensive?',
        opts: ['more expensive', 'expensiver', 'expensive more'],
        explica: 'Palavra curta ganha -er: bigger, cheaper. Palavra comprida usa more antes: more expensive, more comfortable.' },
    ],
    pergunta: { en: 'Which is better for a farm: a big tractor or a small tractor? Why?', pt: 'O que é melhor para uma fazenda: um trator grande ou um pequeno? Por quê?', exemplo: "A big tractor is better. It's stronger than a small one." },
  },
  14: {
    compreensao: [
      { q: 'Qual é o problema no curral?', opts: ['Uma vaca está doente', 'Uma vaca fugiu', 'Acabou a água'] },
      { q: 'Quem o Jack manda chamar?', opts: ['O veterinário', 'O mecânico', 'O fornecedor'] },
      { q: 'O Luan deve dar remédio para a vaca?', opts: ['Não, deve esperar o veterinário', 'Sim, agora mesmo', 'Sim, depois do almoço'] },
    ],
    perceber: [
      { trecho: 'What should I do', pergunta: 'O Luan quer um conselho. Que palavra ele usa para perguntar o que deve fazer?',
        opts: ['should', 'do', 'will'],
        explica: "Should serve para pedir e dar conselho: What should I do? (o que eu devo fazer?). You shouldn't give her medicine (você não deve dar remédio)." },
      { trecho: 'Call the vet', pergunta: 'O Jack dá uma ordem direta: "Call the vet right now". Como a frase começa?',
        opts: ['Direto com o verbo: Call…', 'Com You: You call…', 'Com To: To call…'],
        explica: 'Para dizer a alguém o que fazer, a frase começa direto com o verbo: Call the vet. Keep her away. Wait for the vet.' },
    ],
    pergunta: { en: 'Your animal is sick. What should you do?', pt: 'O seu animal está doente. O que você deve fazer?', exemplo: 'I should call the vet. I should give the animal water and shade.' },
  },
  15: {
    compreensao: [
      { q: 'O que eles vão plantar no talhão A?', opts: ['Soja', 'Milho', 'Algodão'] },
      { q: 'Quando eles vão começar a plantar?', opts: ['Em outubro, quando a chuva começar', 'Em janeiro', 'Na semana que vem'] },
      { q: 'Como o Luan vai mandar o plano para o Jack?', opts: ['Por e-mail, hoje', 'Por telefone, amanhã', 'Pessoalmente, no mês que vem'] },
    ],
    perceber: [
      { trecho: "We're going to plant", pergunta: 'O plantio da soja já está decidido. Como o Jack fala desse plano?',
        opts: ["We're going to plant", 'We plant', 'We planted'],
        explica: "Plano já decidido: am / is / are + going to + verbo. We're going to plant soy (vamos plantar soja)." },
      { trecho: "I'll call", pergunta: 'O Jack diz que faltam sementes e adubo, e o Luan decide na hora: "I\'ll call the supplier". O que é I\'ll?',
        opts: ['I will: decisão tomada agora', 'I am: algo acontecendo agora', 'I did: algo que já aconteceu'],
        explica: "I'll é I will. Serve para o que você decide na hora da conversa: I'll call the supplier, I'll send it by email." },
    ],
    pergunta: { en: 'What are you going to do next season?', pt: 'O que você vai fazer na próxima safra?', exemplo: "Next season I'm going to plant corn. I'll buy new seeds." },
  },
};
