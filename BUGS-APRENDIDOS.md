# Bugs aprendidos — Capy Yara English

## 2026-11-20 — No celular, a Yara cobria o "Verificar" das lições

**Sintoma:** no celular, em `lessons.html` (Build, Quiz, Scramble, Speed), o último botão de cada ferramenta ficava metade embaixo dos botões flutuantes da Yara e da lousa, mesmo com a página rolada até o fim. O toque no "✓ Verificar" abria a Yara.

**Causa raiz:** é a única página com o widget da Yara que não tem o menu de baixo. Sem o menu, os botões flutuantes ficam a 16 px do fundo (~74 px de altura), e o `<main>` só tinha `py-8` (32 px) de folga embaixo.

**Correção:** `pb-28 md:pb-8` no `<main>` de `lessons.html`: no celular sobra espaço para rolar o último botão para cima dos flutuantes.

**Como pegar isso de novo:** `tests/celular.spec.js` (iPhone 13) mede, com a página rolada até o fim, quanto do botão fica embaixo de `#yw-fab`/`#yw-board`.

**Por que aconteceu:** as outras páginas com a Yara têm o menu de baixo e `pb-32`; a folga foi pensada para o menu, não para os flutuantes.

---

## 2026-11-16 — "Ouvir o diálogo" quebrado no Agro 11 a 15 e no GPS 15 a 27

**Sintoma:** nas aulas mais novas do Agro English e do GPS Tronic, o botão de ouvir o diálogo falava frases repetidas, uma por cima da outra, ou cortava no meio, tudo com a mesma voz.

**Causa raiz:** o gerador apontava cada fala para um mp3 gravado (`/assets/audio/<aula>/sNN.mp3`), mas esses arquivos só existem para Agro 1 a 10 e GPS 9 a 14. O 404 caía num plano B do tocador (na aula-molde, `gpstronic_aula_09.html`) que disparava duas vezes (`onerror` e `play().catch`) e andava a fila por um tempo fixo de 2,6 s.

**Correção:** o tocador usa o `speakEnEnd` (`tts-en.js`), que avisa quando a fala termina: arquivo gravado, depois a voz da IA na voz do personagem, depois a do navegador. O gerador só escreve `mp3` na fala se o arquivo existir e sempre escreve a voz do personagem. O `speakEnEnd` também ganhou guarda contra a falha em dobro. Etiqueta do `tts-en.js` trocada para `som2`.

**Como pegar isso de novo:** `tests/dialogo-audio.spec.js` (cada fala uma vez, em ordem, sem pedir mp3 que não existe). A validação dos geradores recusa aula sem áudio gravado que aponte para arquivo.

**Por que aconteceu:** as aulas novas foram geradas sem a chave da OpenAI para gravar o áudio, e o plano B nunca tinha sido testado com o arquivo faltando.

---

## 2026-11-13 — Quando a IA falhava, a resposta era "200 OK" e sem prazo

**Sintoma:** com a OpenAI fora do ar (ou sem crédito), as rotas de IA de texto (`/api/chat`, quiz, tradução,
história…) respondiam **200** com `{error:{…}}`. O widget da Yara guarda na conversa toda resposta 200: a
mensagem "A IA não respondeu agora" voltava para a IA no próximo pedido como se a Yara tivesse dito aquilo. E
com a OpenAI travada, sem responder, a função ficava pendurada até a Vercel matar.

**Causa raiz:** o `callOpenAI` respondia `res.status(200)` no erro do provedor e não passava `timeout` ao
`https.request` (o `chatComplete` sempre teve 45 s).

**Correção:** erro do provedor responde **502** (mesmo corpo, mesma mensagem genérica), e o pedido à IA tem
prazo de 45 s; vencido, o pedido é desfeito e o aluno recebe 502. As páginas já liam a mensagem do corpo em
qualquer status. A cota do dia continua gasta quando a IA falha (ver relatório da caça).

**Como pegar isso de novo:** `node --test tests/seguranca-api.test.js` (IA com 500 → resposta não é 200 e não
vaza o texto do provedor; IA travada → 502 quando o prazo vence).

**Por que aconteceu:** "não quebrar a tela" virou "dizer que deu certo". Erro precisa de status de erro: é
o que o navegador usa para decidir o que guardar.

---

## 2026-11-13 — O envio de lição de casa não tinha limite nenhum

**Sintoma:** um aluno logado (ou um script com a sessão dele) podia mandar `POST /api/homework` sem parar:
cada envio grava até 20 KB na `homework_submissions` e aparece na lista do professor, que só mostra as 500
mais recentes.

**Causa raiz:** o balde `homework` existia em `RATE_LIMITS` (20 por dia no grátis, 100 no Pro, 200 no Super),
mas a rota nunca chamava o `checkRateLimit`.

**Correção:** a rota consulta o balde `homework` (por aluno, depois de validar o pedido) e responde 429 quando
estoura. Na aula, o `components.js` já mostra "Tentar de novo" para qualquer erro que não seja de login.

**Como pegar isso de novo:** `node --test tests/seguranca-api.test.js` (balde estourado: 429 e nada gravado;
balde livre: 200, contado por aluno).

**Por que aconteceu:** criar o limite e ligar o limite na rota eram dois passos, e só o primeiro foi feito.
Balde em `RATE_LIMITS` que nenhuma rota usa é sinal de rota sem limite.

---

## 2026-11-13 — Um POST com XP inventado punha qualquer aluno no topo do ranking

**Sintoma:** um aluno logado mandava `POST /api/db` com `xp: 10000000` e aparecia em 1º no ranking público
(`leaderboard.html`) na hora. Nada limitava quantas vezes por dia.

**Causa raiz:** o estado do aluno inteiro vem do navegador. O servidor só cortava o XP em 10 milhões, e o
`public_leaderboard` lê esse número direto do `user_state`.

**Correção:** cada salvar sobe o XP no máximo 2.000 acima do que estava guardado (`XP_MAX_POR_SALVAR`), e o dia
inteiro no máximo 20.000 (`XP_MAX_POR_DIA`, somado na `atividade_diaria`). Descer continua livre (recomeçar o
progresso). Uma aula inteira dá ~300 XP. Quem passa do teto não perde nada no aparelho: o `store.js` mescla pelo
MAIOR e manda o total de novo; o servidor alcança aos poucos. Se o estado anterior não pôde ser lido, nada é
cortado. O cálculo do XP continua no navegador (ver relatório da caça).

**Como pegar isso de novo:** `node --test tests/seguranca-api.test.js` (um salvar com 10 milhões e 40
salvares seguidos no mesmo dia).

**Por que aconteceu:** número que o aluno controla e que todo mundo vê (ranking) precisa de teto no servidor.

---

## 2026-11-13 — Qualquer professor lia a lição de casa de todos os alunos do site

**Sintoma:** uma conta com papel `teacher` abria `teacher_homework.html` (ou chamava `GET /api/homework`) e
recebia as últimas 500 lições de casa do site inteiro: nome, id e respostas de alunos que nunca entraram na
turma dele. Com `?userId=<id>` lia qualquer aluno.

**Causa raiz:** a rota só conferia o papel (`requireRole(['admin','teacher'])`) e consultava a tabela com a
chave de serviço, sem filtro. O painel novo do professor (`/api/professor/*`, 19/out) recorta tudo pela
`turma_alunos`; esta rota mais antiga ficou de fora.

**Correção:** o admin continua vendo tudo. O professor vê só quem está na turma dele (`turma_alunos` com o
`professor_id` da sessão); pedir um `userId` de fora da turma devolve lista vazia.

**Como pegar isso de novo:** `node --test tests/seguranca-api.test.js` (professor com uma aluna na turma não
vê a outra, nem pedindo pelo id; admin vê as duas; aluno recebe 403).

**Por que aconteceu:** quando uma regra de acesso nova entra ("o servidor filtra sempre pela turma"), toda
rota que lê a mesma tabela precisa ser revista, não só as rotas novas.

---

## 2026-11-13 — A entrevista por voz gastava o dobro dos minutos do aluno

**Sintoma:** um aluno Super que fazia uma simulação de entrevista de 2 minutos (`entrevista.html`) perdia 4
minutos da cota do mês. O freio de gasto do site também via o dobro.

**Causa raiz:** ao desligar, a página manda o `/api/conversa-uso` (que liquida a reserva da ligação) e logo
depois pede a devolutiva em `/api/conversa-feedback` com o mesmo uso. A rota da devolutiva gravava o custo de
novo, numa linha nova (`gravarUsoVoz`). O comentário dizia "se o aluno ficou na página, esta é a via", mas a
página manda o relato em todo desligamento. De quebra, a devolutiva gravava o custo que o navegador mandasse,
mesmo sem ligação nenhuma.

**Correção:** a devolutiva não grava mais custo. Quem mede a ligação é só o `/api/conversa-uso`.

**Como pegar isso de novo:** `node --test tests/seguranca-api.test.js` (token, relato de 2 minutos e
devolutiva: a cota conta 2 minutos; devolutiva com custo inventado não grava nada).

**Por que aconteceu:** duas rotas gravando a mesma medição. Cada número precisa de um único caminho até o
banco.

---

## 2026-11-13 — Um relato de voz inventado desligava a voz do site inteiro

**Sintoma:** qualquer aluno logado (até do plano grátis, que nunca ligou) mandava um `POST /api/conversa-uso`
dizendo ter gasto 5 milhões de tokens de cada tipo. O servidor gravava US$ 166 de custo, o freio mensal do
site (`VOZ_TETO_USD_MES`, US$ 50) disparava e todo aluno Super recebia "A voz está temporariamente
indisponível" até o mês seguinte.

**Causa raiz:** os tokens e a duração da ligação vêm do navegador. O `liquidarReservaVoz` usava
`Math.max(custo do navegador, piso)` sem teto, e os segundos do navegador (até 2 h) passavam por cima da
reserva. Sem reserva aberta, o relato era gravado do jeito que veio (`gravarUsoVoz`), mesmo que nenhum token
tivesse sido emitido.

**Correção:** a liquidação nunca passa do tempo reservado, e o custo do navegador conta até
`VOZ_USD_POR_MIN_TETO` (padrão US$ 1 por minuto reservado, 50 vezes o piso). Relato sem reserva aberta só é
gravado para o admin (o único que liga sem reserva). Assim, a ligação de teste de 3 minutos vale no máximo
US$ 3.

**Como pegar isso de novo:** `node --test tests/seguranca-api.test.js` (relato forjado sem ligação e com
reserva de 3 minutos; depois a aluna Super ainda consegue o token).

**Por que aconteceu:** número que vem do navegador e entra numa conta que trava o site inteiro precisa de
teto no servidor, não só de piso. O piso protegia contra quem informa pouco; ninguém pensou em quem informa
demais.

---

## 2026-11-13 — As letras de música pulavam o limite com uma barra no fim do endereço

**Sintoma:** `GET /api/lyrics-search/?q=…` (com barra) ou `/api/lyricsX?…` respondia 200 e chamava o
lyrics.ovh quantas vezes alguém quisesse, mesmo com o limite do dia estourado.

**Causa raiz:** o portão de limite procura a rota pelo endereço EXATO (`AI_ROUTE_KEYS.get(url)`), mas as
duas rotas de letra casavam com `url.startsWith('/api/lyrics-search')` e `url.startsWith('/api/lyrics')`.
Qualquer endereço que só começasse igual passava pelo handler sem passar pelo portão.

**Correção:** as duas rotas comparam o endereço exato (`url === '/api/lyrics-search'`, `url === '/api/lyrics'`).
O Music Lab já chamava exatamente esses endereços.

**Como pegar isso de novo:** `node --test tests/seguranca-api.test.js` (com todo balde estourado, nenhuma
variante do endereço chega ao lyrics.ovh).

**Por que aconteceu:** rota com limite e o portão de limite precisam casar o endereço do mesmo jeito. Rota que
custa (IA ou serviço de fora) nunca usa `startsWith`.

---

## 2026-11-13 — Story Time: palavra digitada com apóstrofo ou HTML quebrava a tela

**Sintoma:** no Story Time, o aluno digitava "don't" em "Add your own word": a palavra aparecia, mas o ✕
não a tirava mais (erro de JavaScript no clique). Digitando `<b>oi</b>` ou uma tag de imagem, o HTML
entrava na página, na lista escolhida e na linha "palavras usadas" da história.

**Causa raiz:** `updateSelectedDisplay()` e `showStory()` montavam o `innerHTML` com a palavra crua, e o
✕ era `onclick="toggleWord('${w}')"`: o apóstrofo fechava a string do onclick.

**Correção:** a palavra passa por `escStory()` antes do `innerHTML`, e o ✕ remove pela posição
(`toggleWord(selectedWords[i])`), sem colocar o texto do aluno dentro do atributo.

**Como pegar isso de novo:** `tests/story-time.spec.js` adiciona "don't" e tira pelo ✕, e adiciona HTML
e confere que nenhuma tag nasce na escolha nem na história.

**Por que aconteceu:** o padrão `onclick="fn('${texto}')"` foi copiado de onde o texto era fixo (as
palavras sugeridas) para onde o texto vem do aluno. Texto do aluno ou da IA nunca vai cru para
`innerHTML` nem para dentro de um atributo `onclick`: use o índice ou `data-*` escapado.

---

## 2026-11-13 — A Preparação só deixava gravar 3 vezes por dia no plano grátis

**Sintoma:** na página de Preparação, o aluno do plano grátis gravava 3 frases e, na 4ª gravação do
dia, recebia "Muitas mensagens seguidas" / "Limite diário do plano grátis atingido". O PR #41 prometia
40 gravações por dia. Quem paga gastava duas cotas por gravação.

**Causa raiz:** o portão de IA (o bloco do `api/index.js` que conta o uso antes de toda rota de IA)
contava o `/api/transcribe` no balde `transcribe` (grátis: 3/dia), sem ler o corpo. Depois o handler lia
`uso: 'preparacao'` e contava de novo, no balde `transcribe-prep` (grátis: 40). O `checkRateLimit` só
evita contar duas vezes quando o nome do balde é o mesmo; aqui eram dois nomes. O teste do PR #41
só conferia o texto do código com regex, então não viu o portão.

**Correção:** o portão continua conferindo CSRF e identidade no `/api/transcribe`, mas não conta: quem
conta é o handler, que já sabe o `uso`. A Preparação gasta só o `transcribe-prep`; as outras gravações,
só o `transcribe`.

**Como pegar isso de novo:** `tests/cota-da-ia.test.js` roda o `api/index.js` com um Supabase falso que
conta os baldes de verdade: 4 gravações da Preparação passam e só o `transcribe-prep` é gasto; quem paga
gasta uma cota; a 4ª gravação comum ainda recebe 429.

**Por que aconteceu:** o portão foi posto depois dos handlers e supõe que cada rota usa o mesmo balde
que ele. Toda rota cujo handler escolhe outro balde (pelo corpo ou por conta própria) gasta em dobro.
Rota nova com balde próprio: confira o `AI_ROUTE_KEYS` e teste com contagem de verdade, não com regex.

---

## 2026-11-13 — O Dia 2 da trilha (Game) não fechava em inglês, francês e nos cursos

**Sintoma:** no Dia 2 de uma lição da Trilha (fora do turco), o aluno jogava o jogo da lição (Speed, Scramble ou
Typing) até o fim e ficava preso na tela de resultado: só havia "Refazer", o botão para outro jogo e "Learning
Path". O "✅ Continue to Next Step" nunca aparecia, o Dia 2 nunca era gravado e, com a regra dos 4 dias, nenhuma
lição de inglês, francês ou dos cursos podia ser concluída pela trilha.

**Causa raiz:** desde que o Game passou a usar o vocabulário da lição (`showGameStep`), o passo do dia se chama
`game`, mas o jogo avisa o fim com o nome dele (`markToolDone(id, 'speed')`). O `markToolDone` só mostrava o
"Continue" quando os dois nomes eram iguais. O turco não tinha o problema porque o jogo dele chama
`guidedGameDone()`. Antes de 12/nov o Dia 4 sozinho fechava a lição, e isso escondia o buraco.

**Correção:** no modo guiado, quando o passo é `game` e termina um dos jogos da lição (speed, scramble, typing), o
`markToolDone` marca o game como feito e mostra o "Continue", como nos outros passos.

**Como pegar isso de novo:** `tests/trilha-dias.spec.js` (joga o Speed do Dia 2 da lição 3 até o fim e fecha o dia).

**Por que aconteceu:** o passo e a ferramenta que o executa deixaram de ter o mesmo nome, e não havia teste que
fizesse um dia da trilha do começo ao fim.

---

## 2026-11-13 — O "Plano de hoje" mandava refazer lições que a Trilha já dava como feitas

**Sintoma:** quem terminou lições no formato antigo (a lição inteira de uma vez, antes das minilições) via na home
e no `study_plan.html` "Trilha: mini-lição 1 · Aula 1", enquanto a Trilha (`learn.html`) mostrava essas lições
concluídas e retomava na primeira pendente.

**Causa raiz:** o `proximaMini` do `plano-hoje.js` só olhava a lista `completedMinis`. Lição terminada no formato
antigo não tem os dias gravados, só o `completedLessons`, e a regra da trilha (`Store.isTrailLessonDone`) conta
essas lições como feitas.

**Correção:** o `proximaMini` recebe a regra da trilha (`Store.isTrailLessonDone(id, 'en')`) e pula a lição que a
trilha dá como concluída. Sem o `Store` na página, continua como era.

**Como pegar isso de novo:** `tests/plano-hoje.test.js` (roda o `store.js` e o `plano-hoje.js` de verdade com um
aluno do formato antigo; está no `npm run test:security`).

**Por que aconteceu:** a "próxima lição" é calculada em três lugares (trilha, cartão "Continue" e plano da home), e
só a trilha foi atualizada quando a regra dos 4 dias entrou. Quem calcula progresso pergunta ao `store.js`.

---

## 2026-11-13 — Desafio da Yara colava como HTML o que o aluno e a IA escreviam

**Sintoma:** no Desafio da Yara (o chefe no fim de cada capítulo da Trilha, `lessons.html?boss=…`), uma mensagem
com `<img src=x onerror=…>` virava uma imagem de verdade e o código rodava. O mesmo valia para a resposta da IA
e para o texto final de avaliação ("Capítulo dominado!" / "Quase lá!").

**Causa raiz:** o `appendBossMsg` montava o balão com `innerHTML` e `${text}` cru, e o `finishBossChallenge`
fazia o mesmo com o `feedback` da IA. O chat do Dia 4 (`appendChatMsg`) já usava `textContent`; o do chefe ficou
de fora.

**Correção:** os balões e o texto da avaliação entram por `textContent`. O HTML fixo (ícone, classes) continua igual.

**Como pegar isso de novo:** `tests/trilha-dias.spec.js` (manda `<img onerror>` como aluno e como IA, até a
avaliação final, e confere que nada vira HTML).

**Por que aconteceu:** cada chat da página tinha a sua função de balão, e a regra "texto do usuário ou da IA
nunca vai cru para `innerHTML`" foi aplicada em uma e esquecida na outra.

---

## 2026-11-13 — Trilhas de curso ignoravam a regra dos 4 dias

**Sintoma:** nas trilhas de curso (Agro, GPS Tronic, Intermediário, Entrevista e Medicina), quem tinha feito só
o Dia 4 de uma lição antes de 12/nov via os 4 dias com ✓, a barra contava 4 dias e o "Começar" pulava para a
lição seguinte. Na trilha de inglês (`learn.html`) e na de francês, a mesma lição aparecia com só o Dia 4 feito.

**Causa raiz:** o `miniDone` dessas 5 páginas olhava a lista crua `completedLessons` antes dos dias. Até 12/nov,
o Dia 4 sozinho gravava a lição nessa lista. A regra dos 4 dias entrou no `store.js` (`isTrailLessonDone`)
e no `learn.html`/`learn_fr.html`, mas as páginas de curso ficaram com a lógica antiga.

**Correção:** o `miniDone` das 5 páginas usa `Store.isTrailLessonDone(id) || Store.isMiniDone(id, dia)`, igual
ao `learn_fr.html`. Quem terminou a lição no formato antigo (sem nenhum dia gravado) continua com os 4 dias feitos.

**Como pegar isso de novo:** `tests/trilha-dias.spec.js` (abre as 5 trilhas com o registro antigo do Dia 4).

**Por que aconteceu:** a mesma regra estava copiada em 7 páginas. Regra de progresso mora num lugar só
(`store.js`) e as páginas só perguntam a ele.

---

## 2026-11-13 — Fazer só o Dia 1 da trilha fechava a lição inteira

**Sintoma:** o aluno fazia o Dia 1 (Listen & Quiz) de uma lição da Trilha, acertava 60% ou mais do quiz e via
"🏆 Lesson Complete!" no lugar de "Day 1 Complete". De volta à trilha, os Dias 2, 3 e 4 apareciam feitos, a
lição contava como concluída e a retomada pulava para a lição seguinte.

**Causa raiz:** o `renderQuizFinish` do `lessons.html` chamava `Store.completeLesson` sempre que o quiz passava
de 60%, também no modo guiado. Logo depois, o `guidedLessonComplete` chamava `Store.completeMini(id, 1)`. Como
ainda não havia nenhum dia gravado, o `isTrailLessonDone` caía no marcador antigo (`completedLessons`), achava
que era uma lição terminada no formato antigo e o `completeMini` gravava os 4 dias de uma vez.

**Correção:** no modo guiado o quiz não marca mais a lição (nem mostra "Lição concluída!"): quem fecha a lição
é o `guidedLessonComplete`, com os 4 dias. O modo livre (sem `guided=1`) continua como era.

**Como pegar isso de novo:** `tests/trilha-dias.spec.js` (faz o Dia 1 no modo guiado e volta para a trilha).

**Por que aconteceu:** a regra dos 4 dias entrou no `store.js` com uma ponte para o progresso antigo
("sem nenhum dia gravado, vale o `completedLessons`"), mas o quiz continuava escrevendo esse mesmo marcador.
Marcador de compatibilidade não pode continuar sendo escrito pelo fluxo novo.

---

## 2026-11-13 — O lembrete diário prometia salvar uma sequência que já tinha acabado

**Sintoma:** aluna que parou de estudar há duas semanas com 12 dias seguidos recebia todo dia, às 19h, o
e-mail "🔥 Sua streak está em perigo! (streak de 12 dias!) … Sua streak de 12 dias expira à meia-noite!".
Quando voltava ao app, a sequência estava em 0.

**Causa raiz:** a sequência só é recalculada no navegador (`resolverStreak` no `store.js`). O banco guarda o
`streakDays` do último dia em que o aluno abriu o app. O `/api/send-reminders` lia esse número cru, sem olhar
a data da última prática, e ainda sorteava mensagens que falam de streak para quem não tem mais nenhuma.

**Correção:** `sequenciaParaSalvarHoje(d, hoje)` aplica no servidor as regras do `resolverStreak` (última
prática ou dia coberto ontem; com um dia de falta, só com 🧊). O assunto e a frase "expira à meia-noite" usam
esse número. Quem já perdeu a sequência recebe só a mensagem que não fala de streak.

**Como pegar isso de novo:** `tests/lembrete-streak.test.js` roda o cron com relógio falso e quatro alunas
(sumida, praticou ontem, faltou com 🧊, faltou sem 🧊), em várias rodadas por causa do sorteio.

**Por que aconteceu:** número derivado (a sequência) salvo como se fosse fato. Quem lê o `streakDays` do banco
precisa reavaliá-lo contra a data, do mesmo jeito que o navegador faz ao abrir.

---

## 2026-11-13 — Quem usava a IA à noite ficava bloqueado na manhã seguinte

**Sintoma:** o visitante usava os 3 usos de IA às 22h. Na manhã seguinte o app mostrava "3 chats left today",
mas toda mensagem para a Yara falhava ("A conversa está indisponível") até as 21h.

**Causa raiz:** dois relógios para o mesmo limite. O navegador zera o contador (`aiUsageToday`) à meia-noite
de Brasília (`capyHojeBR`). O servidor (`checkRateLimit` no `api/index.js`) montava o balde com o dia UTC,
que vira às 21h de Brasília: os usos das 21h às 24h caíam no balde do dia seguinte.

**Correção:** o balde do servidor usa `diaBrasil()`, o mesmo dia do navegador. O tempo de espera do contador
em memória (`retryAfter`) passou a contar até a meia-noite de Brasília. **Mudança de regra:** o limite do
servidor renova à meia-noite de Brasília, não mais às 21h.

**Como pegar isso de novo:** `tests/limite-ia-dia-br.test.js` (relógio falso: uso às 22h e volta de manhã;
21h30 ainda é o mesmo dia; tempo de espera até a meia-noite).

**Por que aconteceu:** `toISOString().slice(0, 10)` é o dia de Greenwich. Todo "dia" que o aluno sente
(limite, sequência, desafio do dia) tem que ser o dia de Brasília, nos dois lados.

---

## 2026-11-13 — Com a página aberta na virada do dia, o freeze não protegia a sequência

**Sintoma:** aluno com 🧊 Streak Freeze (80 🫐) faltou um dia, deixou a página aberta desde a noite anterior e
estudou depois da meia-noite: a sequência recomeçou em 1 e o freeze continuou no bolso, sem uso.

**Causa raiz:** o freeze só é conferido no `resolverStreak`, que roda ao ABRIR o app (`checkDailyReset`). O
`activateStreak` olhava o buraco entre a última prática e hoje e, com dois dias de distância, recomeçava em 1
sem passar pelo freeze.

**Correção:** o `activateStreak` chama o `resolverStreak` (que é idempotente) antes de contar o dia. Com
freeze, a sequência continua; sem freeze, recomeça em 1 como antes.

**Como pegar isso de novo:** `tests/sequencia-xp.test.js` ("página aberta na virada do dia"), com o relógio
falso avançando no meio do teste.

**Por que aconteceu:** regra de "virada do dia" amarrada ao carregamento da página. Quem estuda à noite deixa
a aba aberta; toda regra que depende do dia tem que valer também no momento da ação.

---

## 2026-11-13 — Relógio adiantado zerava a sequência de quem estudou

**Sintoma:** aluno com o celular alguns minutos adiantado estudava às 23h55. O celular gravava a prática
como "amanhã". Quando o relógio voltava ao certo, ou quando o estado chegava ao computador (que está com a
hora certa), a sequência de dias ia a zero, e praticar de novo recomeçava em 1.

**Causa raiz:** `resolverStreak` tratava data de prática no futuro (`gap < 0`) como dado inválido e zerava
`streakDays`. O `activateStreak` também recomeçava em 1 nesse caso. O merge entre aparelhos leva a data mais
recente, então a data do futuro se espalhava para os outros aparelhos do aluno.

**Correção:** `trazerDatasParaHoje(hoje)`, chamado no `resolverStreak` e no `activateStreak`: data de prática
(ou de freeze) depois de hoje vira hoje. A prática aconteceu de verdade, no máximo agora, então conta como
"praticou hoje". A migração antiga já fazia o mesmo com o rótulo UTC.

**Como pegar isso de novo:** `tests/sequencia-xp.test.js` (3 testes de relógio adiantado, com o `store.js`
real e relógio falso).

**Por que aconteceu:** data que vem do relógio do aparelho não é confiável. Toda conta de "quantos dias
desde" precisa decidir o que fazer com uma data no futuro em vez de tratá-la como erro e apagar progresso.

---

## 2026-11-13 — Trocar de aba na lição pagava o XP do Quiz e do Listen de novo

**Sintoma:** no `lessons.html`, depois de terminar o Quiz (ou o Listen), bastava clicar em outra aba e
voltar: a tela "Quiz Concluído!" aparecia de novo e o XP da rodada era somado outra vez, a cada clique.
Três idas e voltas transformavam 20 XP em 80. Dava para subir de nível sem responder nada.

**Causa raiz:** quem pagava o XP era a função que DESENHA a tela de fim (`renderQuizFinish`,
`renderListenFinish`). Trocar de aba chama `renderQuiz()`/`renderListen()`, que, com a rodada já
terminada, redesenham a tela de fim, e com ela o pagamento.

**Correção:** as duas telas de fim recebem `concluiuAgora`. Só o momento em que a última resposta é dada
passa `true` e paga (XP, `markToolDone`, streak, lição concluída, comemoração). Redesenhar só mostra.
O "🔄 Refazer" continua pagando a nova rodada, porque é prática de verdade.

**Como pegar isso de novo:** `tests/xp-uma-vez.spec.js` termina o Quiz e o Listen e troca de aba três
vezes, conferindo que o XP não muda.

**Por que aconteceu:** função de desenhar com efeito colateral. Tela que pode ser redesenhada (troca de
aba, voltar, atualizar) não pode pagar nada; o pagamento fica no evento que só acontece uma vez.

---

## 2026-11-14 — "Zerar progresso" não zerava (e, para quem tem conta, voltava)

**Sintoma:** em Configurações, o pai respondia a conta, confirmava "All XP, badges, and streaks will be lost",
via "Progress reset!" e o XP continuava lá. Na página de Progresso, quem tem conta zerava e, ao recarregar,
tudo voltava (às vezes sim, às vezes não).

**Causa raiz:** as duas páginas só apagavam `capyYaraState` do aparelho. O `settings.html` chamava
`Store.init()` em seguida, e o `init()` sem estado salvo regravava o estado que ainda estava na memória: não
zerava nada. No `progress.html`, o recarregar postava um estado zerado ao mesmo tempo em que o merge lia o
servidor; se a leitura chegasse antes, o merge trazia tudo de volta. Com o servidor agora recusando baixar o
progresso sem pedido explícito, nem essa corrida sobraria.

**Correção:** `Store.resetProgress()` zera a memória e o aparelho e manda `reset: true` ao servidor (o único
jeito de baixar o progresso salvo); as duas páginas usam ela e avisam o aluno se o servidor não confirmar.

**Como pegar isso de novo:** `node --test tests/sincronizacao.test.js` ("zerar progresso de quem tem conta"),
no `npm run test:security`.

**Por que aconteceu:** "zerar" foi escrito como "apagar a chave do localStorage", que só funcionava quando o
progresso morava apenas no aparelho. Com servidor no meio, zerar é uma operação do servidor.

---

## 2026-11-13 — Abrir o app num aparelho novo podia zerar o progresso salvo na conta

**Sintoma:** o aluno com conta abria o site num aparelho novo (ou depois de limpar o navegador) e o XP, as
frutinhas, os freezes e as aulas criadas por ele voltavam ao começo, inclusive nos outros aparelhos.

**Causa raiz:** o `store.js` postava o estado inteiro antes de ler o servidor. Sem estado salvo, o `init()`
chamava `save()` com envio ligado e mandava o estado zerado; o `syncPlanFromServer()` também chamava `save()`
assim que o `/api/me` respondia, muitas vezes antes do `GET /api/db` do merge. O merge depois só recuperava o
que entra por MAIOR/UNIÃO; frutinhas gastas, freezes, aulas criadas e metas ficavam zerados. Só escapava
quando o CSRF da aba ainda não tinha carregado (o POST levava 403).

**Correção:** até o merge terminar, o `save()` grava só no aparelho e marca `_postPendente`; o merge espera o
`Auth.ready()` (sessão verificada e CSRF da aba), lê o servidor e só então posta. Aparelho sem estado próprio
usa o estado do servidor como base (o plano continua vindo do `/api/me`). Se o merge falhar, o próximo
`save()` tenta de novo (no máximo a cada 15 s). Visitante não posta mais (o servidor respondia 401).

**Como pegar isso de novo:** `node --test tests/sincronizacao.test.js` ("aparelho sem estado salvo não manda
um estado zerado"), no `npm run test:security`.

**Por que aconteceu:** o `postar:false` foi colocado no reset diário e na migração, mas o `init()` e o
`syncPlanFromServer()` continuaram postando. Regra: com estado inteiro, ninguém escreve antes de ler.

---

## 2026-11-13 — Uma aba velha ou um aparelho atrasado apagava aulas e XP no servidor

**Sintoma:** o aluno estudava no celular e, depois de abrir o computador (ou uma aba esquecida aberta havia
dias), as aulas feitas no celular sumiam e o XP voltava atrás. Às vezes voltavam sozinhas no aparelho certo,
às vezes não voltavam mais.

**Causa raiz:** o `POST /api/db` grava o estado **inteiro** que o navegador manda, sem conferir versão. Quem
postasse por último ganhava: uma aba aberta com o estado de ontem, um aparelho que ainda não tinha lido o
servidor, ou dois POSTs que chegavam fora de ordem.

**Correção:** o servidor junta o que chega com o que já estava (`progressoQueSoSobe`): XP fica com o maior; as
aulas, mini-aulas, medalhas, chefes vencidos, baús e itens comprados ficam com a união. O resto continua "o
último vale" (frutinhas são saldo; a sequência pode zerar). Zerar o progresso de propósito manda `reset: true`.

**Como pegar isso de novo:** `node --test tests/sincronizacao.test.js` ("aparelho atrasado não apaga", "estado
zerado não apaga"), no `npm run test:security`.

**Por que aconteceu:** "o último vale" só é seguro com um aparelho e uma aba. O merge do navegador protegia a
leitura, mas a escrita continuava trocando tudo. Junção sem trava ainda pode perder um item se dois POSTs
chegarem no mesmo instante (ler e gravar não é atômico); para fechar isso de vez é preciso uma função no banco.

---

## 2026-11-13 — Da aula 26 em diante, o progresso da trilha não chegava ao servidor

**Sintoma:** quem fez mais de 25 aulas da trilha (100 mini-aulas) continuava vendo tudo no próprio aparelho,
mas noutro aparelho, ou depois de entrar de novo, as aulas novas tinham sumido. O painel do professor também
parava de mostrar a atividade desse aluno.

**Causa raiz:** o `POST /api/db` passa o estado pelo `sanitizeStoredJson`, que cortava **toda** lista em 100
itens e todo objeto em 100 chaves. As mini-aulas novas entram no fim do `completedMinis`, então eram justamente
elas que caíam. O aparelho não percebia: o merge junta o que o servidor tem com o que ele já tinha.

**Correção:** o `sanitizeStoredJson` ganhou um limite (`maxItens`, padrão 100 para formulários); o estado do
aluno usa 5000 (a trilha tem 319 aulas × 4 mini-aulas; o corpo já é limitado a 256 KB).

**Como pegar isso de novo:** `node --test tests/sincronizacao.test.js` ("lista de progresso com mais de 100
itens"), no `npm run test:security`.

**Por que aconteceu:** o limite foi pensado para texto de formulário e aplicado ao estado inteiro. Corte
silencioso de dado do aluno precisa de teste com um aluno avançado, não só com um aluno novo.

---

## 2026-11-07 — O chat da lousa nunca usou a resposta da IA

**Sintoma:** no `quadro.html`, o professor pedia "5 frases sobre viagem" e recebia sempre as mesmas
frases (as "VIAGEM 1, 2, 3…"), qualquer que fosse o pedido. Elas ainda eram coladas no quadro como se
fossem a resposta.

**Causa raiz:** desde que o chat entrou (18/out), a rota `/api/quadro-ai` respondia pelo `callOpenAI`,
que devolve o envelope antigo `{candidates:[{content:{parts:[{text}]}}]}`. A lousa procura `cards` e
`reply` no corpo; como não achava, caía no `generateLocalFallbackCards()` em silêncio. O fallback
escondia o erro: na tela, "funcionava".

**Correção:** a rota usa o `chatComplete` (modo JSON), confere o que o modelo mandou
(`cartoesDaLousa`: até 12 cartões, só texto) e responde `{ reply, cards }`. Se a IA falha, responde
502 com uma mensagem. A lousa mostra as frases prontas com um aviso e não cola sozinha. O texto da IA
no chat entra por `textContent`. Testes: `tests/quadro-ai.test.js` e `tests/quadro-chat.spec.js`.

**Regra:** rota que o navegador lê como JSON próprio não pode usar o `callOpenAI` (ele só serve a quem
lê o envelope `candidates`). E fallback silencioso precisa de aviso na tela: senão o erro nunca aparece.

---

## 2026-11-13 — A trilha mandava quem tem conta de volta para o teste de nível em outro aparelho

**Sintoma:** o aluno se cadastrava e fazia o onboarding no computador; ao abrir a Trilha (`learn.html`) no
celular, caía no teste de nível, toda vez, até refazer ou pular o teste (e aí o selo virava "Starter").
Quem acabava de criar a conta e ainda não tinha feito o onboarding também caía no teste, e não no onboarding.

**Causa raiz:** o `learn.html` decidia "já fez o teste?" só pelo `localStorage.capyPlacementDone`, que é do
aparelho, e decidia na hora, antes de o `Auth.checkOnboarding()` (assíncrono) responder. O perfil no
servidor (`onboarding_complete`, `english_level`) nunca entrava na conta.

**Correção:** visitante sem o teste continua indo direto para o teste. Quem tem conta espera o
`checkOnboarding()`: sem onboarding, vai para o onboarding; com onboarding, o perfil vale pelo teste. A
página marca o `capyPlacementDone` e, se o aparelho não tiver nível, usa o `english_level` do perfil para o selo.

**Como pegar isso de novo:** `tests/trilha-teste-de-nivel.spec.js` (aparelho novo com conta, nível já
salvo no aparelho, visitante, convidado antigo, conta sem onboarding).

**Por que aconteceu:** marca de "já fiz" guardada no `localStorage` vale por aparelho, não por pessoa. Toda
marca dessas que bloqueia uma página precisa olhar também o que o servidor sabe do aluno.

---

## 2026-11-13 — Provas finais do GPS e do Agro abriam sem estilo nenhum

**Sintoma:** `gpstronic_prova.html` e `agro_prova.html` abriam como texto cru, sem cores, sem layout e com
quadradinhos no lugar dos ícones. Na mesma varredura: a foto da Yara na barra lateral do `lessons.html` dava 404.

**Causa raiz:** as duas provas pediam `assets/css/tailwind.css`, arquivo que nunca existiu (entrou assim
em 3d71819), e o Font Awesome do cdnjs, que a CSP bloqueia (`style-src` só aceita o próprio site e o Google
Fonts). O `lessons.html` apontava para `capy Yara teacher generated pic.png`, que saiu do repositório na
sincronização com a produção (565f43a). Nada no build nem nos testes conferia se o arquivo pedido existe.

**Correção:** Tailwind do CDN, como as outras páginas; Font Awesome 6.4.0 servido pelo próprio site em
`assets/vendor/` (CSS + as duas fontes usadas); `assets/**/*.woff2` no `builds` do `vercel.json`, senão as
fontes não subiriam (mesma armadilha do favicon); a foto virou `yara-quadrado-v1.jpg`.

**Como pegar isso de novo:** `tests/arquivos-do-deploy.test.js` (no `npm run test:security`, roda no CI)
confere que todo `src`/`href` local das páginas e todo `url()` dos CSS existe **e** entra na lista branca
do `vercel.json`.

**Por que aconteceu:** um arquivo que falta não quebra nada na hora; a página só fica feia. E a varredura da
produção (`page.on('requestfailed')` + respostas 4xx) só roda quando alguém lembra.

---

## 2026-11-09 — Typing da lição cobrava outra palavra

**Sintoma:** no Typing da lição 1 (`lessons.html`), a tela pedia "Informação". O aluno digitava
"information" e levava erro; as letras da correção mostravam "w-a-t-e-r". O 💡 Hint também dava as
letras de outra palavra.

**Causa raiz:** o `renderTyping()` mostra os cartões embaralhados (`shuffledVocab`, até 15), mas o
`checkTyping()` e o `useTypeHint()` liam `currentLesson.vocab[typeIdx]`, na ordem original. Com
qualquer embaralhamento, a palavra da tela e a palavra cobrada eram diferentes. O fim do Typing
também usava a lista inteira: numa lição com mais de 15 palavras, ele tentaria um 16º cartão que não
existe. Estava assim desde o código original. Ouvir, Speed e Vocab já usavam a mesma lista para
mostrar e conferir.

**Correção:** `typingVocab()` é a lista única do Typing (mostrar, conferir, dica e fim).
`tests/typing.spec.js` embaralha de propósito e confere os três pontos. Os testes falham no código
antigo.

**Regra:** exercício que embaralha precisa ler a mesma lista em tudo: mostrar, conferir, dica e fim.

---

## 2026-11-07 — Toda aula gerada do GPS e do Agro pedia a escrita da aula 09

**Sintoma:** no homework da Agro 13 (comparativos), a última tarefa pedia "Escreva 5 passos para o
cliente reiniciar o monitor", e a Parte 2 do treino falava em "forma certa do imperativo". O mesmo
texto aparecia nas 33 aulas montadas pelos geradores (GPS 10–27, Agro 01–15).

**Causa raiz:** os dois geradores copiam o molde (`gpstronic_aula_09.html`) e trocam só o que conhecem.
O título da Parte 2, a dica e a tarefa de escrita eram textos fixos da aula 09 que nenhum passo trocava,
e a validação não olhava o texto do homework.

**Correção:** `scripts/lib/homework-plus.mjs` troca esses textos em todas as aulas (escrita da própria
aula ou um pedido neutro com os padrões dela) e o `validar()` dos dois geradores falha se o texto da
aula 09 voltar. `tests/homework-plus.test.js` confere as 33 aulas.

**Regra:** texto que vem do molde e não passa por nenhuma troca precisa de uma checagem no validador.

---

## 2026-11-02 — Os cabeçalhos de segurança do `vercel.json` nunca chegaram às páginas

**Sintoma:** depois de publicar o PR #1 (CSP estrita nas páginas de login, conta, admin e professor),
`curl -sD - https://www.capyenglish.com.br/account.html` não trazia CSP, `X-Frame-Options` nem
`nosniff`. Só o `/` trazia.

**Causa raiz:** o `vercel.json` usa `builds` + `routes`, o formato antigo. Nesse formato a Vercel
ignora o bloco `headers` sem avisar: o deploy passa e os cabeçalhos simplesmente não saem. O `/` tinha
os cabeçalhos porque a rota dele (`^/$` → `landing.html`) já os levava. Os testes liam o `headers` e
ficavam verdes; ninguém tinha olhado a resposta de verdade.

**Correção:**
- `npm run headers` (`scripts/cabecalhos-para-routes.js`) copia cada regra do `headers` para uma rota
  `continue: true` no começo de `routes`;
- um teste falha se as rotas ficarem desatualizadas;
- antes de ligar, as 259 páginas foram abertas no Chromium com a CSP que vão receber.

**Como pegar isso de novo:**
```bash
curl -s -D - -o /dev/null https://www.capyenglish.com.br/account.html | grep -iE 'content-security|x-frame'
npm run headers -- --check
```

**Regra:** cabeçalho de segurança só conta depois de visto na resposta da produção (ou do Preview),
não no arquivo de configuração.

---

## 2026-10-19 — Curso de francês: pronúncia escrita em todo canto e voz do navegador

**Sintoma:** as aulas de francês mostravam a pronúncia entre colchetes ("Bonjour [bon-JUR]") e a voz
variava de aparelho para aparelho (e ficava muda no iPhone com a chave de silencioso).

**Causa raiz:** a pronúncia estava em **cinco lugares** ao mesmo tempo: o campo `phon` (vocabulário e Speak),
colchetes dentro de textos (verbos, expressões, quizzes, padrões), uma coluna inteira da tabela de horas da
trilha, o texto fixo dos padrões e as folhas em PDF. A voz vinha do `tts-fr.js`, que usava a voz do navegador.
Quizzes de "como se pronuncia?" tinham a pronúncia escrita como alternativa.

**Correção:** `scripts/fr-sem-pronuncia.mjs` roda nos dois geradores e a geração falha se sobrar colchete.
O `tts-fr.js` usa a voz da OpenAI (`lang=fr`) e pula o que está entre parênteses.

**Armadilhas que me pegaram ao limpar (ficam aqui para a próxima vez):**
- Tirar colchete de texto **sem olhar a estrutura**: `WO1_DATA[si]` virou `WO1_DATA` e quebrou o JavaScript.
  O limpador só mexe em dados e em texto fixo, nunca em código.
- Limpar a resposta certa (`a`) e **esquecer as alternativas** (`opts`, uma lista de textos): o quiz ficava sem
  resposta certa. `confere()` valida resposta dentro das alternativas e alternativa vazia.
- Arrumar a pontuação junto: em francês o espaço antes de `?` e `!` é o correto, e não pode sumir.
- A trilha lê `data/lessons/<id>.json`, e não o `lessons_fr_data.js`: sem rodar `build-lesson-data.js` nada muda.

**Como pegar isso de novo:**
```bash
node --test tests/frances-sem-pronuncia.test.js
grep -rEc '\[[^]]*[A-ZÉ]{2,}[^]]*\]' data/lessons/20[1-9].json data/lessons/21[0-2].json   # só serve de olho; o teste é o juiz
```


---

## 2026-10-19 — `aulas-contexto.json` "desatualizado" só com a máquina carregada

**Sintoma:** com a CPU cheia, o teste `o api/aulas-contexto.json esta em dia com
as paginas das aulas` (`tests/aula-contexto.test.js`) falhou uma vez com
"rode `npm run aulas:contexto`", sem ninguém ter mexido em aula nenhuma.

**Causa raiz:** `scripts/gera-contexto-aulas.js` avalia cada array das páginas
com `vm.runInNewContext(..., { timeout: 200 })` e um `catch { continue; }` que
engolia **qualquer** erro. Estourar o tempo era tratado igual a "o array
referencia outra coisa, não é conteúdo": o array sumia em silêncio e o
catálogo gerado saía menor que o commitado. Com 200ms e a máquina ocupada, os
arrays grandes estouravam.

**Correção:** timeout de 5s (só protege de laço infinito) e estouro vira
**erro**, nunca saída menor.

**Como pegar isso de novo:**
```bash
# Com timeout de 1ms a saída muda — prova que tempo influencia o resultado:
sed 's/timeout: 5000 }/timeout: 1 }/' scripts/gera-contexto-aulas.js > scripts/_t.js && node -e "const g=require('./scripts/_t.js');try{g.gerar();console.log('nao estourou')}catch(e){console.log('erro alto, ok:',e.message)}"; rm scripts/_t.js
```

**Por que aconteceu:** `catch` genérico em gerador determinístico. Timeout é
falha de ambiente, não dado; não pode virar "pula este item".

---

## 2026-10-19 — Teste da trilha francesa no CapyMic falhava às vezes com `['en']`

**Sintoma:** o teste `trilha (lessons.html): a trava de 15s leva a fala para a
correção, no idioma da trilha` (`tests/capy-mic.test.js`) falhava de vez em
quando na suíte inteira com `expected ['fr'], actual ['en']`. Sozinho, passava
sempre.

**Causa raiz:** o teste abria `lessons.html` (lição 1, inglês), esperava só o
`window.CapyMic` existir e então escrevia `CUR_TTS_LANG = 'fr-FR'` na mão. Mas a
página ainda estava iniciando: o `DOMContentLoaded` da `lessons.html` é
`async`, espera `carregarIndice()` e `garantirLicao(1)` (dois `fetch`) e só
então chama `loadLesson(1)`, que **sobrescreve** `CUR_TTS_LANG = 'en-US'`. O
evento `load` não espera esses `fetch`. Com a máquina folgada, o init acabava
antes do teste escrever `fr-FR`; com a suíte inteira rodando, o init terminava
**depois**, entre o `fr-FR` do teste e a trava de 15s, e o `toggleMic` lia `en`.
Não era vazamento de estado: cada teste tem navegador e contexto próprios.

**Correção:** o teste abre a trilha francesa de verdade
(`lessons.html?lesson=201`) e espera a condição real,
`currentLesson.id === 201 && CUR_TTS_LANG === 'fr-FR'`, antes de tocar no
microfone. Sem `sleep`, e o teste agora cobre também o caminho
lição → idioma do `loadLesson`, que antes era pulado.

**Como pegar isso de novo:**
```bash
# Teste de página que mexe em global sem esperar o init async acabar:
grep -nE "^\s+[A-Z_]{4,} = " tests/*.test.js
# Prova determinística: segure o init até depois do ajuste manual, ex. esperar
# currentLesson antes de page.clock.runFor(15_000) — o teste antigo falha 100%.
```

**Por que aconteceu:** `waitUntil: 'load'` + "a lib carregou" não quer dizer
"a página terminou de iniciar". Se a página tem init `async` que escreve no
mesmo estado que o teste, espere o **resultado** do init (a lição carregada),
não um sinal vizinho.

---

## 2026-10-18 — "Traduzir palavras para" sempre voltava para Spanish

**Sintoma:** em Configurações, o Luis escolhia o idioma da tradução dos flashcards,
saía da página e, ao voltar, estava 🇪🇸 Spanish de novo. Em todos os usuários.

**Causa raiz:** o `<select id="lang-select">` da `settings.html` não tinha `onchange`.
O idioma só era gravado dentro de `saveAll()`, que é o botão "Salvar" **da skin**, e
esse botão ainda saía mais cedo se o `Auth.saveAvatar()` falhasse. O padrão era
`'Spanish'` (na `settings.html` e no `translateWord()` do flashcard), então todo
aparelho novo começava em espanhol. O mesmo valia para "Efeitos sonoros", "Leitura
em voz alta", "Recursos de IA" e a dificuldade: só o modo escuro gravava na hora.

**Correção:** `salvarConfig()` grava o `capySettings` no momento da troca (idioma,
interruptores e dificuldade) e mostra "✅ Ajustes salvos!". O padrão virou
`'Portuguese'`, que é a primeira opção da lista. O `saveAll()` grava as configurações
antes da skin.

**Como pegar isso de novo:**
```bash
grep -n 'onchange="setLang' settings.html          # o seletor grava na troca
grep -n "translateLang || 'Spanish'" *.html         # tem que voltar vazio
```

**Regra:** toda configuração grava na hora em que muda. Um botão "Salvar" de outra
seção não pode ser o único caminho para gravar nada.

**Fica para depois:** as configurações vivem só no `localStorage`. O
`GET /api/db?type=settings` devolve `null` em produção, então elas não acompanham a
conta entre aparelhos.

---

## 2026-10-18 — No iPhone, logado, nenhuma aula tinha som (computador e tablet sim)

**Sintoma:** o Luis e outro aluno, logados, no iPhone: o 🔊 não fazia som nenhum.
No computador e no tablet saía voz (a robótica do navegador, não a Nova).

**Causa raiz (duas camadas):**
1. O mesmo 403 `invalid_origin` de 28/09: a correção estava no PR do hotfix, mas
   nunca chegou à produção. Toda voz Nova falhava para quem tinha cookie.
2. A voz reserva (`speechSynthesis`) e o `CapyTTS` tocavam **depois** de esperar
   a rede, fora do toque. O iOS Safari só deixa tocar som que começa dentro de um
   toque, e silencia a voz do navegador com a chave de silencioso ligada. Por isso
   o iPhone ficava mudo e os outros aparelhos não.

**Correção:** além do portão do servidor, `CapyAudio` (`components.js`) libera um
único elemento de áudio no primeiro toque da página (clipe mudo + fala vazia) e
todas as vozes passam a usar esse elemento (`tts-en.js`, `CapyTTS`,
`listening-lab.js`). Antes de tocar, `navigator.audioSession.type = 'playback'`
faz a voz soar mesmo com a chave de silencioso.

**Como pegar isso de novo:** testar no iPhone de verdade, logado, com a chave de
silencioso ligada. Chromium/Playwright não reproduz a regra de toque do iOS.

**Regra:** som que depende de rede toca num elemento já liberado por toque, nunca
num `new Audio()` criado depois de um `await`.

---

## 2026-09-30 — O chat da lição (`/api/lesson-chat`) respondia 500 no PR #1 (não chegou à produção)

**Sintoma:** qualquer mensagem no chat de uma lição dava 500. Apareceu ao escrever o primeiro teste
que chama a rota de verdade, antes de a branch ser publicada.

**Causa raiz:** a rota montava o aluno com `nivelDoAluno()`. No merge com a produção (27/set), essa
função saiu, porque a produção já lia o aluno com `perfilDoAluno()`. Só que a chamada ficou.
`ReferenceError` dentro do handler, e daí o 500. O teste que existia só procurava o nome
`nivelDoAluno(` no código-fonte, então passava.

**Correção:** a rota usa `perfilDoAluno(appUserId, conta)`, igual ao `/api/chat`. Um teste chama a
rota inteira num processo separado e espera o 503 de "sem chave de IA", não o 500.

**Como pegar isso de novo:**
```bash
node --test --test-name-pattern="lesson chat runs end to end" tests/security.test.js
# e, para qualquer nome que um merge deixou sem definição:
npx eslint --no-config-lookup --rule '{"no-undef":"error"}' --global require,module,process,Buffer,__dirname,console,setTimeout,clearTimeout,setImmediate,URL,fetch,AbortController api/index.js api/security.js
```

**Por que aconteceu:** um teste que lê o código-fonte confere que o texto existe, não que ele roda.
Rota nova ou refeita ganha pelo menos um teste que a executa. Depois de um merge grande, rode o
`no-undef`.

---

## 2026-09-29 — Com a página aberta há mais de ~1 h, todo envio dava 403 "CSRF validation failed"

**Sintoma:** na fala da trilha (`lessons.html`, francês), o microfone mostrava "⚠️ Não deu para
ouvir — CSRF validation failed." Com a página aberta tempo suficiente, **todo POST** falhava: o
microfone, as rotas de IA e, em silêncio, o `POST /api/db` (XP e progresso, porque o `store.js`
engole o erro). Recarregar a página resolvia até a próxima hora.

**Causa raiz:** o access token dura cerca de 1 h. A primeira requisição depois disso (por exemplo,
"Ouvir exemplo", `GET /api/tts`) renova a sessão em `getAuthenticatedSession`, e o
`setSessionCookies` gerava ali um cookie `__Host-capy-csrf` **novo**. A aba tinha lido o token uma
vez só, ao abrir (`Auth.ready()` → `/api/auth/session` → `sessionStorage.capyCsrf`), e o
`auth-secure.js` continuou mandando o antigo. Cookie novo e cabeçalho velho: `assertCsrf` → 403.

**Correção:** na renovação silenciosa, `setSessionCookies(res, sessao, { keepCsrf })` regrava o
**mesmo** token que o navegador já tem. Login, cadastro, MFA e link de e-mail continuam gerando um
token novo: eles devolvem o token à página ou recarregam a página.

**Como pegar isso de novo:**
```bash
node --test --test-name-pattern="silent session refresh" tests/security.test.js
```

**Por que aconteceu:** a correção antiga "CSRF renovado acompanha os novos cookies" (entrada de
setembro sobre a tela de entrada) só entregava o token novo ao `/api/auth/session`, que a página
chama uma vez. Qualquer outra rota renovava a sessão e trocava o cookie sem a página saber. Quem
mexer na renovação de sessão tem que testar uma página que **continua aberta** depois dela.

---

## 2026-09-28 — No Preview da Vercel, login e "Entrar como visitante" davam 403

**Sintoma:** no Preview de um PR (`*.vercel.app`), o login e o botão de visitante
respondiam 403 `invalid_origin`. Nenhum PR podia ser testado logado antes de ir ao ar.

**Causa raiz:** o Preview roda em modo produção (`VERCEL=1`), e o `isAllowedOrigin`
(`api/security.js`) só aceitava o `APP_ORIGIN`, que é o domínio de produção. A página
do Preview manda `Origin: https://<preview>.vercel.app`.

**Correcao:** só quando `VERCEL_ENV=preview`, as URLs do próprio deploy (`VERCEL_URL`
e `VERCEL_BRANCH_URL`) também contam como origem do site (`PREVIEW_ORIGINS`). A
produção continua aceitando só o `APP_ORIGIN`. No Preview, entre com senha: o link
mágico e os e-mails levam ao `APP_ORIGIN`.

**Como pegar isso de novo:**
```bash
npm run test:security   # "a Vercel Preview accepts sign-in from its own URLs…"
```

---

## 2026-09-28 — Logado, o Music Lab dizia "Nenhuma música encontrada" para tudo

**Sintoma:** o Luis entrou com a conta dele e nenhuma busca achava música. O
mesmo defeito, sem ninguém notar: o Desafio Diário caía em erro, e a voz Nova
(TTS) virava a voz robótica do navegador para quem estava logado ou era visitante.

**Causa raiz:** o portão das rotas de IA (`AI_ROUTE_KEYS`, em `api/index.js`)
chamava `assertCsrf` em TODA rota quando havia cookie de sessão, inclusive nas
de GET (`/api/lyrics-search`, `/api/lyrics`, `/api/tts`, `/api/daily-challenge`,
`/api/word-of-day`). O `assertCsrf` começa pelo `assertOrigin`, e em produção
`isAllowedOrigin('')` é `false`. Só que o navegador **não manda `Origin` num GET
da mesma origem**, e o `auth-secure.js` só põe o token CSRF em escrita. Resultado:
403 `invalid_origin` para todo aluno com cookie. Sem cookie (anônimo) funcionava,
e nos testes também: fora de produção o `Origin` vazio passa.

**Correcao:** escrita continua exigindo CSRF. Leitura (GET/HEAD) com cookie passa
pelo `Sec-Fetch-Site` que o navegador manda sempre: `same-origin` ou `none` passam,
outro site leva 403. A página agora separa "o serviço não respondeu" de "nenhuma
música encontrada", e os proxies de letra ganharam prazo (7 s) e resposta validada.

**Como pegar isso de novo:** teste em modo produção, porque é lá que o `Origin`
vazio é recusado:
```bash
npm run test:security   # "in production, reads from our own pages pass the AI gate…"
# à mão: NODE_ENV=production node -e "…" chamando uma rota GET de IA com cookie e sem Origin
```

**Por que aconteceu:** a regra de CSRF foi escrita pensando em escrita, e ninguém
testou uma rota GET com cookie em modo produção. E a página transformava qualquer
falha em "Nenhuma música encontrada", o que escondeu o 403 por dias: **mensagem de
"não existe" só quando a resposta veio vazia de verdade.**

---

## 2026-09-20 — `\uXXXX` dentro de CSS vira `u00E7` na tela

**Sintoma:** a legenda vazia do palco de voz mostrava
*"A transcriu00E7u00E3o aparece aqui enquanto vocu00EAs falam."*

**Causa raiz:** o texto foi escrito por um script Node como `\u00E7` para nao
depender da codificacao do terminal. Isso funciona em **string de JavaScript**,
mas o valor caiu num `content:` de **CSS** — e CSS usa outra sintaxe de escape
(`\e7`, hexadecimal cru). O CSS comeu a barra invertida e imprimiu o resto
literalmente. O mesmo vale para **atributo HTML** (`alt="...v\u00EDdeo"`), que
nao interpreta escape nenhum.

**Correcao:** caractere acentuado literal no CSS e no HTML. O arquivo e UTF-8;
o escape so existia para proteger do shell, e so e valido dentro de `<script>`.

**Como pegar isso de novo:**
```bash
# escape \uXXXX so pode sobrar DENTRO de <script>. Fora dele e texto quebrado.
node -e "const t=require('fs').readFileSync('entrevista.html','utf8').replace(/<script[^>]*>[\s\S]*?<\/script>/g,''); console.log((t.match(/\\\\u00[0-9A-Fa-f]{2}/g)||[]).join(' ')||'limpo')"
```

**Por que aconteceu:** o gerador nao sabe em que linguagem o texto vai cair.
Escapar “por seguranca” so e seguro quando o destino e JavaScript.

---

## 2026-09-20 — `.passos b` pegava o `<b>` de enfase dentro do `<span>`

**Sintoma:** no passo 3 do “Como funciona” da `entrevista.html`, as palavras
**nao corrige** apareciam espremidas dentro de uma bolinha laranja, quebrando a
linha no meio da frase.

**Causa raiz:** o seletor `.passos b` estiliza **todo** `<b>` descendente como
a bolinha numerada do passo. O markup e
`<li><b>3</b><span>Ele <b>nao corrige</b> ...</span></li>` — o segundo `<b>`,
que e enfase de texto, herdava `width:26px;border-radius:50%`.

**Correcao:** `.passos > li > b` para a bolinha, mais `.passos span b` para a
enfase. Descendente virou filho direto.

**Como pegar isso de novo:** seletor de componente que mira uma tag generica
(`b`, `i`, `span`, `small`) precisa de `>`. A tag vai reaparecer dentro do
proprio componente mais cedo ou mais tarde.

**Por que aconteceu:** quando o CSS foi escrito, o passo 3 ainda nao tinha
enfase. O seletor nunca foi revisto quando o texto ganhou negrito.

---

## 2026-09-19 — O CSP bloqueava a OpenAI: a ligacao por voz nunca funcionou

**Sintoma:** o aluno clicava em ligar, autorizava o microfone, e recebia
*"Nao consegui conectar. Verifique sua internet."* — uma mensagem que culpa a
internet dele por um defeito de configuracao nosso.

**Causa raiz:** o `connect-src` do CSP global no `vercel.json` nao listava
`https://api.openai.com`. O token efemero era emitido normalmente (POST
same-origin, 200 com token real) — o que falhava era o passo SEGUINTE, o
`fetch` para `api.openai.com/v1/realtime/calls` que monta o WebRTC. O navegador
bloqueia antes de sair, e o try/catch engolia a violacao.

**Por que passou tanto tempo despercebido:** o endpoint respondia 200. Quem
testasse a API concluiria que estava tudo certo. O erro so existe no navegador,
no passo que a API nao ve.

**Como provei:**
```js
// no console da propria pagina em producao:
try { await fetch('https://api.openai.com/v1/realtime/calls', {method:'POST',body:'v=0'}); }
catch (e) { console.log(e.name, e.message); }   // TypeError: Failed to fetch
```
E o header: `curl -sSI <url> | grep -o "connect-src[^;]*"`.

⚠️ **Armadilha ao consertar:** `connect-src` aparece **3 vezes** no
`vercel.json` — no bloco de login/admin, no bloco global `/(.*)` e no header
inline da rota `^/ (landing). So a global precisa mudar. Editar por
`String.replace` sem contexto unico cai na errada.

**Consequencia que ninguem tinha ligado:** o custo por minuto da ligacao "nunca
foi medido" nao era desleixo — era impossivel. Nenhuma ligacao jamais aconteceu.

---
## 2026-09-18 — Login: cache antigo, retorno de e-mail e renovação

**Causas:** a tela de entrada confiava no cache local antes de validar a sessão; convidados eram confundidos com alunos; o endpoint de sessão rejeitava visitantes assinados; renovar tokens devolvia o CSRF antigo; a resposta inicial da sessão podia competir com uma nova entrada. O fallback de e-mail não usava PKCE e a ausência do Resend não acionava fallback.

**Correções:** redirecionamento aguarda o servidor; visitantes podem acessar o login e restauram apenas sua identidade limitada; rotas privadas continuam exigindo usuário cadastrado. CSRF renovado acompanha os novos cookies, autenticação aguarda a consulta inicial e atualiza ready(). Fallback de e-mail usa PKCE com cookie HttpOnly. Novo segredo de assinatura configurado somente na produção, sem baixar segredos existentes. Versões dos scripts de autenticação atualizadas.

**Verificação:** testes de navegador com APIs simuladas, sessão de convidado assinada e testes de e-mail/renovação com upstream simulado. Não alterar usuários ou templates para contornar erro sem prova. Fallback PKCE exige abrir o link no mesmo navegador; entrega real de e-mail e entrada de uma conta humana precisam de confirmação do usuário.

---

## 2026-09-17 — Ligação: CSP, motor duplicado e microfone após falhas

**Causas:** o chat ainda mostrava 'em breve'; a CSP não permitia o endpoint HTTPS da OpenAI; conversa.html tinha outro motor de voz, separado de conversa-core.js; falhas de oferta/SDP ou cancelamento durante a permissão não garantiam liberar o microfone. O servidor verificava CHAT_KEY (que pode ser OpenRouter), embora voz exija OPENAI_API_KEY, e não solicitava transcrição de entrada.

**Correção:** atalho de chamada real, domínio oficial permitido na conexão, motor compartilhado com recursos por tentativa e cancelamento, timeout, silenciar e limpeza de áudio. Servidor valida chave específica, usa transcrição e prazo de resposta; cotas existentes preservadas. Nenhum teste automatizado usa microfone real.

**Como pegar de novo:** `node --test tests/realtime-voice.test.js` e `node --test tests/security.test.js`. Validar conversa/entrevista com mídia simulada e conferir encerramento de todas as faixas de áudio. Produção ainda exige publicação e teste humano para confirmar áudio e latência reais.

---

## 2026-09-14 — A ligacao por voz estava morta em producao (as duas paginas)

**Sintoma:** a simulacao de entrevista por voz (`entrevista.html`) abria, mostrava
a tela, e a ligacao nunca comecava. O console acumulava 403. A `conversa.html`, que
existe ha mais tempo, tinha **exatamente** o mesmo problema — entao nao era defeito
da pagina nova.

**Causa raiz:** nenhuma das duas carregava o `auth-secure.js`. E o `auth-secure.js`
que remenda o `window.fetch` para mandar o header `X-CSRF-Token`. Sem ele,
`POST /api/realtime-token` cai no `assertCsrf` e devolve **403 invalid_csrf** — e o
token efemero da OpenAI nunca e emitido.

**Como provei antes de mexer:** no console da propria pagina, li o cookie
`__Host-capy-csrf` e refiz a chamada mandando o header a mao. O mesmo endpoint
respondeu **200** com o token. So depois disso toquei no HTML.

**Correcao:** `<script src="auth-secure.js?v=seg1"></script>` antes do
`conversa-core.js` em `conversa.html` e `entrevista.html`.

**Como pegar de novo:**
```bash
# em aba LIMPA (aba suja acumula 403 dos seus proprios testes e engana):
# abrir a pagina, esperar o boot, e conferir no console:
#   window.fetch.toString().includes("native code")  -> se TRUE, o remendo nao entrou
```

**Por que aconteceu:** e a mesma familia do bug que quebrou os links de cortesia.
Uma blindagem de seguranca (CSRF) entrou depois que as paginas ja existiam, e
ninguem procurou quem dependia do comportamento antigo. **Guard novo exige varrer
quem chama.** Pagina que faz POST para /api sem carregar o auth-secure.js esta
quebrada, e quebra em silencio — a tela abre normal.

**Achado vizinho, NAO corrigido:** `GET /api/realtime-config` chama
`assertOrigin(req)`, que exige o header `Origin`. Navegador **nao manda Origin em
GET same-origin**, entao esse endpoint responde 403 para sempre. **CORRIGIDO em 19/set: o que eu escrevi aqui estava errado.** Eu disse que
"ninguem o chama" depois de verificar so as 3 paginas de voz. O `quadro.html:339`
chama — e o quadro branco compartilhado estava com 403 permanente em producao
desde que essa linha foi escrita. **Verificar 3 arquivos nao e verificar o
projeto.** O certo era um grep no repositorio inteiro, que leva o mesmo tempo.
Conserto: `assertOrigin` passou a validar o Origin apenas quando o header vem.

---
## 2026-09-13 — PNG da OpenAI pesa 2MB e o `.jpg` nem estava na lista branca

**Sintoma:** nenhum — e é esse o problema. As 9 imagens de diálogo geradas pelo
`gpt-image-1` saíram com **~2MB cada, 18MB no total**, e cada uma é a PRIMEIRA coisa
que carrega numa aula (`loading="eager"`). Num 4G ruim, a aula não abre.
**Causa raiz:** a textura granulada do estilo arruína a compressão PNG. Medido em
`interview03`:

| formato | tamanho |
|---|---|
| PNG original 1536×1024 | 2668KB |
| PNG reduzido para 1200 | **2044KB** — reduzir não resolve |
| JPEG 1200 q92 | **229KB** |
| JPEG 1200 q85 | 153KB |

**Correção:** `scripts/otimiza-dialogo-img.js` converte para JPEG 1200/q92 usando o
Playwright que já estava no `package.json` (nenhuma dependência nova), e move o master
PNG para `scripts/masters/` — pasta que **nenhum padrão do `builds` do vercel.json
alcança**, então o master fica no repositório sem ser servido. 18MB → 1,5MB.
**A pegadinha que quase passou:** `assets/**/*.jpg` **não existia** na lista branca do
`vercel.json` (havia `*.jpg` só na raiz e `assets/**/*.png`). Sem acrescentar a
entrada, as imagens simplesmente não seriam servidas — em silêncio, com 200 e HTML no
corpo. **Trocar a extensão de um ativo obriga a conferir o `builds`.**
**Como pegar de novo:**
```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}
" https://www.capyenglish.com.br/assets/img/interview01-dialogue.jpg
# tem que responder "200 image/jpeg". Se vier text/html, a extensão não está na lista branca.
```
**Não confie em preview deployment para isso:** os previews estão atrás da proteção do
Vercel e respondem **302 → vercel.com/sso-api** em TODA URL, inclusive em arquivos que
existem. O `-L` do curl segue o redirect e devolve 200 com a tela de login — parece que
o arquivo está lá. Confira o `content-type`, não só o status.

---

## 2026-09-13 — Todo link de acesso de cortesia estava quebrado (verify.html é código morto)

**Sintoma:** o `/api/admin/grant-plan` devolvia um `loginUrl` apontando para
`verify.html?token=...`. O endpoint respondia **200** e o link parecia bom. Só que ao
clicar, o aluno via *"Não foi possível entrar"*. Provavelmente **todas** as cortesias
concedidas desde a blindagem de segurança entregaram um link morto.
**Causa raiz:** `verify.html` faz `POST /api/auth/verify`, e esse endpoint foi
**aposentado** — hoje responde `410 legacy_auth_retired` (`api/index.js`, procure
`legacy_auth_retired`). A tabela `magic_link_tokens` e o `verify.html` são do sistema
de login ANTIGO. Quem aposentou o endpoint não procurou quem ainda dependia dele, e o
`grant-plan` continuou gerando token para uma porta que não abre mais.
**Correção:** tanto o `grant-plan` quanto o novo `POST /api/admin/login-link` passaram
a usar o caminho vivo — `authRequest('/auth/v1/admin/generate_link')` do Supabase, que
devolve um `hashed_token`, montando
`/api/auth/callback?token_hash=...&type=magiclink&next=/learn.html`.
**Como pegar isso de novo:**
```bash
# gera um link e ABRE. Conferir só o status do POST nao pega nada: ele sempre deu 200.
node scripts/link-acesso.mjs <email-de-um-aluno>
```
Depois abra o link no navegador e confirme que `localStorage.capySession` existe com o
e-mail certo. Confirmado assim em 13/set: entrou como `luisfelima11@gmail.com`.
**Por que aconteceu:** o endpoint devolvia 200 com um link bem-formado; a falha só
acontecia no clique, do lado do aluno, dias depois. **Endpoint que MONTA uma URL não
está testado até alguém ABRIR a URL** — foi exatamente assim que eu mesmo entreguei um
link quebrado para uma aluna antes de testar.

**Cheiro relacionado, ainda não limpo:** `magic_link_tokens` continua sendo escrita em
outros pontos do `api/index.js` e o `verify.html` continua no ar. Enquanto existirem,
alguém vai reusá-los achando que funcionam.

---


## 2026-09-08 — A streak zerava às 21h de Brasília, não à meia-noite

**Sintoma:** aluno estudava segunda de manhã e terça às 22h, e na quarta a streak
estava zerada — tendo praticado dois dias seguidos. Ninguém no site sustentava uma
sequência: a foto antes da correção mostrava **8 alunos, ZERO com streak viva**.
**Causa raiz:** `store.js` datava o dia com `new Date().toISOString().slice(0,10)`,
que é **UTC**. Para UTC−3 o dia do aluno virava às 21h. Noite é justamente quando o
adulto brasileiro estuda — o app punia quem mais o usava. Pior: o servidor já datava
certo (`toLocaleDateString('en-CA', {timeZone:'America/Sao_Paulo'})`), então cliente e
servidor discordavam da data entre 21h e meia-noite.

**Segundo defeito, entrelaçado:** `lastQuestDate` era gravado por MERA VISITA. Mas o
Streak Freeze exigia que ele fosse "anteontem" — condição inalcançável para quem abre
o app. **O aluno pagava 80 🫐 por uma proteção que só valia se ele não abrisse o site.**

**Correção:** três helpers globais (`capyHojeBR`, `capyDiaBR`, `capyDiasEntre`) no topo
do `store.js` e do `components.js`, e 17 pontos trocados em 9 arquivos. Campos novos:
`lastPracticeDate` (praticou de verdade), `streakCoveredThrough` (dia coberto por
freeze), `streakSchema` (portão da migração). `checkDailyReset` passou a cuidar só da
rotação do dia; `resolverStreak()` nova e idempotente decide vida/morte/freeze.

**Como pegar isso de novo:**
```bash
npm run test:streak                                  # 16 casos, rode em 3 fusos
TZ=Asia/Tokyo npm run test:streak                    # prova que nao depende da maquina
node scripts/foto-streaks.mjs                        # antes de mexer em streak
node scripts/foto-streaks.mjs --comparar             # 24h depois; sai 1 se houver queda suspeita
grep -rn "toISOString()\.slice(0, *10)" *.html *.js  # deve dar 0 fora do capyDiaBR
```
**Por que aconteceu:** `toISOString()` PARECE certo quando você testa à tarde, na
máquina do dev, em BRT — o rótulo bate. Só quebra depois das 21h. É por isso que o
teste roda em `TZ=UTC`, `TZ=America/Sao_Paulo` e `TZ=Asia/Tokyo`: um teste que só
roda no fuso do dev nunca teria pego.

**Armadilha que quase invalidou tudo:** os helpers foram escritos como
`window.capyHojeBR`. Isso quebrou `tests/turkish-course.test.js`, cujo sandbox não
aliasa `window` para o global. Em navegador funcionaria — mas depender de
`window === globalThis` é frágil. Trocado por `globalThis`.

---


## 2026-09-07 — `/api/admin/stats` respondia 200 sem nenhuma autenticação

**Sintoma:** `curl http://.../api/admin/stats` sem qualquer header de sessão ou Bearer
devolvia `200` com as métricas de uso/erro por endpoint (`api_metrics_daily`, sem PII).
Qualquer visitante que descobrisse a URL via o dashboard de métricas.
**Causa raiz:** dos 13 endpoints `/api/admin/*` em `api/index.js`, os outros 12 começam
com `if (!(await isAdminReq(req, res))) { res.status(401).json({ error: 'unauthorized' }); return; }`
logo na primeira linha do handler. O de `/api/admin/stats` (linha ~3291) tinha só um
**comentário** dizendo "admin session + MFA only" acima do `if` da rota — a chamada real
a `isAdminReq()` nunca foi escrita. Comentário documentando uma intenção que o código
não cumpre.
**Correção:** `api/index.js:3292` — adicionada a mesma guarda usada nos outros 12
endpoints, antes de qualquer leitura do Supabase:
```js
if (!(await isAdminReq(req, res))) { res.status(401).json({ error: 'unauthorized' }); return; }
```
Confirmado ao vivo contra `node scripts/dev-server.js`: `GET /api/admin/stats` sem auth
agora responde `401 {"error":"unauthorized"}`, igual a `overview` e `students`.
**Como pegar isso de novo:** roda contra TODOS os endpoints `/api/admin/*` de uma vez —
não só o que já tem relatório — porque é assim que este bug foi achado num vizinho que
ninguém tinha suspeitado ainda:
```bash
node -e "
const src = require('fs').readFileSync('api/index.js','utf8');
const re = /(?:req\.method === '(GET|POST)'|\(req\.method === 'GET' \|\| req\.method === 'POST'.*?\)) && url === '(\/api\/admin\/[a-zA-Z0-9_\-\/]*)'/g;
const routes = []; let m;
while ((m = re.exec(src))) routes.push({method: m[1]||'GET', path: m[2]});
(async () => {
  const bad = [];
  for (const r of routes) {
    const resp = await fetch('http://127.0.0.1:8765' + r.path, { method: r.method,
      headers: r.method==='POST' ? {'Content-Type':'application/json'} : {},
      body: r.method==='POST' ? '{}' : undefined });
    if (resp.status >= 200 && resp.status < 300) bad.push(r.method+' '+r.path+' -> '+resp.status);
  }
  console.log(bad.length ? 'FALHOU (200 sem auth!): '+bad.join(', ') : 'OK: nenhum dos '+routes.length+' endpoints admin responde 2xx sem auth');
})();"
```
Rode com `node scripts/dev-server.js` ativo em `127.0.0.1:8765`. Aceita 401 (sem sessão
admin) ou 403 (CSRF barra antes do auth em rotas POST como `grant-plan`) como corretos —
só um `2xx` é falha. **Estado esperado: `OK: nenhum dos 13 endpoints admin responde 2xx
sem auth`.** Se o número de rotas cair abaixo de 13 ou aparecer um `FALHOU`, pare e
investigue — pode ser uma rota nova sem a guarda, igual a esta.
**Por que aconteceu:** o comentário acima do handler ("admin session + MFA only") deu a
falsa sensação de que a proteção já existia — quem lia o código por cima via a intenção
documentada e seguia em frente, sem notar que a chamada de fato nunca foi escrita.
Comentário sobre segurança sem o código correspondente é pior que não ter comentário
nenhum: ele engana quem revisa. A verificação anterior de "13 endpoints, 12 protegidos"
nunca existia como script — dependia de alguém contar na mão, e não é assim que se
audita uma superfície de 13 rotas.

---

## 2026-09-06 — Entrar desaparecia na landing em celulares

**Causa raiz:** o link `nav-session-link` usava `hidden sm:block`, ocultando o acesso abaixo de 640px. Além disso, a personalização de sessão substituía esse mesmo link por um destino de trilha, inclusive para visitantes com sessão guest.

**Correção:** manter o acesso de conta separado do CTA de estudo e visível em todas as larguras. A personalização deve atuar apenas no CTA de continuar os estudos.

**Como pegar isso de novo:** executar `node --test tests/landing-page.test.js` e verificar a visibilidade e o destino de Entrar em 320px, 390px, 768px e desktop, com e sem sessão.

---

Escrito pelo **capy-fixer** a cada correção. O **capy-bughunter** e o **capy-debugger**
leem isto ANTES de investigar. Mais novo primeiro.

O campo que importa é **"Como pegar isso de novo"**: um comando executável, não um
conselho. É o que transforma um bug consertado em um bug que não volta.

---

## 2026-09-03 — Domínio não verificado no Resend: TODO e-mail transacional falha em silêncio

**Sintoma:** aluno pede link de acesso por e-mail (login sem senha, único método do
site) e nunca chega. `/api/auth/magic-link` sempre responde `200 {"ok":true}` de
propósito — para não revelar quais e-mails têm conta — então a tela mostra "verifique
seu e-mail" mesmo quando o envio falhou por completo.
**Causa raiz:** o Resend recusa o envio com 403 porque `capyenglish.com.br` não está
verificado (SPF/DKIM). NÃO é bug de código — o `POST` para a API do Resend está
correto; é configuração de DNS que falta no domínio.
**Confirmado ao vivo:**
```
[magic-link] Resend error: 403 {"statusCode":403,"message":"The capyenglish.com.br
domain is not verified. Please, add and verify your domain on https://resend.com/domains"}
```
**Alcance:** todo `fetch('https://api.resend.com/emails', ...)` do projeto usa o mesmo
domínio remetente, então isto derruba TRÊS features, não uma: `/api/auth/magic-link`
(login), a rota legada de magic-link (`api/index.js:1819`, código mostrado inatingível
mas com o mesmo problema se algum dia virar o ativo), e `/api/send-reminders` (o
lembrete diário por e-mail de quem não tem push). O `/api/admin/grant-plan` sobrevive
porque tem um workaround deliberado: devolve o `loginUrl` direto na resposta da API em
vez de depender do e-mail (comentário no código já dizia "útil enquanto o Resend não
envia pra terceiros" — ou seja, isto já era sabido, só não tinha sido consertado).
**Correção:** fora do alcance de código. Luis precisa: entrar em resend.com/domains,
pegar os registros DNS (SPF/DKIM) do domínio `capyenglish.com.br`, adicionar no painel
de DNS onde o domínio é gerenciado, e verificar no Resend.
**Como pegar isso de novo:**
```bash
# dispara um envio real e lê o log de produção no mesmo minuto — só assim aparece o
# motivo. O endpoint SEMPRE responde 200, então testar só o status code nunca pega isto.
D=$(mktemp -d)
(timeout 25 npx vercel logs www.capyenglish.com.br --json > "$D/logs.json" 2>&1 &)
sleep 6
curl -s -X POST https://www.capyenglish.com.br/api/auth/magic-link \
  -H "Content-Type: application/json" -H "Origin: https://www.capyenglish.com.br" \
  -d '{"email":"algum@email.com"}' -o /dev/null
sleep 14
grep -i "resend" "$D/logs.json"
```
**Por que aconteceu:** o design "sempre responde 200" existe por boa razão (anti-
enumeração de e-mails cadastrados), mas tem o efeito colateral de esconder falha real
de infraestrutura do próprio time também, não só de um atacante.

---

## 2026-09-09 — O XP nunca foi creditado em 36 páginas: `window.Store` não existe

**Sintoma:** o aluno terminava uma lição da trilha ou um jogo, via a animação de
comemoração com "+50 XP" na tela, e o XP não subia. Nada no console, nada de erro.
**Causa raiz:** `store.js` declara `const Store = {...}` no topo de um script clássico.
`const`/`let` no topo de script criam binding **lexical** global — a variável existe,
mas **não é propriedade de `window`**. As 36 páginas guardavam as chamadas assim:

```js
if (window.Store) Store.addXP(amount);   // window.Store === undefined → morto
```

O "+50 XP" que aparecia era só o rótulo passado para a animação, não XP de verdade.
**Alcance:** 36 páginas — a trilha diária (`lessons.html`, 15 guardas), os 21 jogos,
`alphabet.html`, `grammar_lab.html`, `learn*.html`, `daily_challenge.html`. As outras
130 páginas usam `Store.x` direto, sem guarda, e sempre funcionaram — foi isso que
mascarou o problema.
**Correção:** uma linha no fim do `store.js`, antes do `Store.init()`:
```js
window.Store = Store;
```
Não trocar os 36 arquivos para usar `Store` direto: são ~90 pontos de chamada e uma
página esquecida volta a falhar em silêncio.
**Como pegar isso de novo:**
```bash
# no navegador, em QUALQUER pagina do site:
#   typeof Store          -> 'object'
#   typeof window.Store   -> tem que ser 'object' tambem
node -e "const t=require('fs').readFileSync('store.js','utf8');console.log(/window\.Store\s*=/.test(t)?'exposto ok':'NAO EXPOSTO — os guardas morrem');"
```
Medido em produção antes e depois: com o remendo, `if (window.Store) Store.addXP(8)`
passou a creditar 8 onde creditava 0. Testado na trilha e no hangman, com o XP
persistindo entre as páginas (8 → 16 → 56).
**Por que aconteceu:** `const` no escopo de script parece global e se comporta como
global em quase tudo — menos em `window.X`. O padrão defensivo `if (window.X)` foi
copiado de página em página assumindo que era equivalente a `if (X)`, e como falhar
significava "não faz nada" em vez de "quebra", ninguém percebeu. **Guarda defensiva que
falha em silêncio é pior que nenhuma guarda**: um `Store.addXP()` direto teria estourado
`ReferenceError` no console no primeiro teste.

---

## 2026-09-09 — Cliente NOVO pagava e não recebia acesso (webhook do Kiwify, mesmo bug do `id`)

**Sintoma:** nenhum, e é esse o problema. Para o Kiwify a cobrança dava certo. O cliente
pagava, não recebia conta nem plano, e ninguém era avisado.
**Causa raiz:** o insert em `/accounts` dentro do webhook não mandava o campo `id` —
**terceira ocorrência do mesmo defeito**, depois de `grant-plan` (corrigido em 03/09) e
de um `magic-link` que nunca teve o bug. `accounts.id` não tem default, o `sb()` estoura
`502 database_error`, o catch externo marca `webhook_events.status='failed'` e responde
502. A execução morre no insert: nunca chega no upsert de `user_profiles`.
**Não se cura sozinho:** `claim_webhook_event` permite reprocessar evento `failed`, então
o reenvio do Kiwify cai no mesmo insert e falha de novo, para sempre.
**Pior ainda:** se o cliente depois pedir link de acesso, o `magic-link` não acha o e-mail
em `accounts` e **cria uma conta nova com plano `free`** — ele pagou e vira usuário grátis.
**Correção:** `api/index.js`, bloco do webhook — gera
`userId = 'kiwify-' + crypto.randomBytes(8).toString('hex')` e manda no insert. Também
trocado `userId = created?.[0]?.id` por `... || userId`, senão uma resposta sem
representação zeraria o id e o upsert do plano gravaria em ninguém.
**Como pegar isso de novo:**
```bash
# todo insert em /accounts tem que mandar id — a coluna nao tem default
node -e "const t=require('fs').readFileSync('api/index.js','utf8');let i=-1,n=0;while((i=t.indexOf(\"sb('/accounts',\",i+1))>=0){n++;const c=t.slice(Math.max(0,i-700),i+700);console.log(n, /\bid:\s*(userId|authUser\.id)/.test(c)?'ok':'SEM ID');}"
```
Hoje são 4 inserts e os 4 passam. Qualquer `SEM ID` no futuro é um caminho que cria conta
sem id — e se for o do webhook, é dinheiro entrando sem entregar acesso.
**Por que aconteceu:** a correção de 03/09 consertou **um** lugar em vez de varrer a
tabela inteira. É literalmente a lição escrita na entrada dos 20 jogos — "sempre que a
correção for adicionar algo que outro depende, varra o arquivo inteiro" — e ela não foi
aplicada seis dias depois, no caminho do dinheiro. Ao consertar um insert, conferir
TODOS os inserts da mesma tabela no mesmo commit.

---

## 2026-09-03 — Conceder cortesia para e-mail NOVO sempre falhou (502 database_error)

**Sintoma:** `POST /api/admin/grant-plan` com um e-mail que ainda não tem conta devolvia
`502 {"error":"database_error"}`. Para quem já tinha conta, funcionava. Ou seja: dava
para promover aluno existente, mas **nunca** para convidar alguém novo.
**Causa raiz:** o insert em `/accounts` não mandava o campo `id`, e `accounts.id` não
tem default no banco. O comentário do endpoint dizia "mesmo fluxo do magic-link", mas o
magic-link gera `id: 'magic-' + hex` — essa parte não foi copiada. Pior: o `sb()`
converte qualquer falha de escrita em `HttpError(502,'database_error')`, escondendo a
mensagem real do PostgREST, então o erro não dizia qual coluna faltava.
**Correção:** no bloco do `grant-plan` em `api/index.js`, gerar
`userId = 'grant-' + crypto.randomBytes(8).toString('hex')` e mandar no insert.
Confirmado em produção: `aluna@exemplo.com → super (conta CRIADA agora)`.
**Como pegar isso de novo:**
```bash
node scripts/cortesias.mjs                         # lista, nao escreve
node scripts/cortesias.mjs --conceder <email-novo>  # o caminho que estava quebrado
```
O script relê do servidor depois de escrever e sai com código 1 se o plano não virou
super — não confia na resposta do POST.
**Por que aconteceu:** "mesmo fluxo do X" escrito em comentário sem ser o mesmo código.
E o `sb()` engolindo a mensagem do banco: um 502 genérico transformou "falta a coluna
id" em meia hora de adivinhação. Quando um insert falhar aqui, compare campo a campo
com outro insert na MESMA tabela que funciona — foi o que resolveu.

---

## 2026-09-01 — Os 20 jogos (`*_game.html`) não salvavam XP: mesmo 403 invalid_csrf, segunda família de arquivos

**Sintoma:** o aluno via "+N XP" na tela em qualquer um dos 20 jogos
(`word_match_game.html`, `hangman_game.html`, `flappy_yara_game.html` etc.), mas o
progresso sumia ao recarregar a página.
**Causa raiz:** exatamente o defeito já registrado abaixo ("Trilha diária não salvava:
403 invalid_csrf"), numa família de arquivos diferente. `POST /api/db` exige o header
`X-CSRF-Token`, que só é injetado pelo remendo em `window.fetch` dentro de
`auth-secure.js`. Os 20 `*_game.html` carregavam `store.js` mas nunca carregavam
`auth-secure.js` — todo save caía em 403, e o `.catch(e => {})` de `store.js` engolia
o erro em silêncio.
**Correção:** inserida `<script src="auth-secure.js?v=seg1"></script>` imediatamente
antes da tag de `store.js` nos 20 `*_game.html` (mesma versão que `lessons.html` já
usava). Feito por script node, idempotente — 20 alterados, 0 pulados (nenhum já tinha).
**Como pegar isso de novo:**
```bash
grep -L "auth-secure.js" $(grep -l "store.js" *.html)
```
Rode contra `*.html`, **não** só contra `*_game.html`. Qualquer arquivo na saída tem
o mesmo defeito latente até alguém tocar em `store.js` de novo.
**Por que aconteceu:** a correção original (ver entrada seguinte) consertou apenas
`lessons.html`, a página onde o sintoma tinha sido visto. Ninguém perguntou "que
outras páginas carregam `store.js` sem `auth-secure.js`?" — então o mesmo buraco
ficou aberto em 20 arquivos irmãos por semanas. A lição não é "conserte o
`invalid_csrf`", é "sempre que a correção for adicionar um script que outro depende,
varra `*.html` inteiro por essa dependência, não só o arquivo do relatório".

**⚠️ Leva 3, a que quase escapou: 5 páginas tinham o script na ORDEM ERRADA.**
`account.html`, `ai_chat.html`, `music_lab.html`, `settings.html`, `study_plan.html`
já carregavam o `auth-secure.js` — mas **depois** do `store.js`. O remendo em
`window.fetch` ainda não existe quando o `store.js` roda o `init()`.

Nenhuma varredura pegou, porque o comando de detecção pergunta *"tem o script?"* e a
resposta era sim. **Presença não é ordem.** O verificador correto compara posição:

```bash
node -e '
const fs=require("fs");
const ruim=fs.readdirSync(".").filter(f=>f.endsWith(".html"))
 .filter(f=>{const t=fs.readFileSync(f,"utf8");
   if(!t.includes("store.js")) return false;
   const a=t.indexOf("auth-secure.js"), s=t.indexOf("store.js");
   return a===-1 || a>s;});
console.log(ruim.length? "QUEBRADAS: "+ruim.join(", ") : "todas ok");'
```
Estado final esperado: **`todas ok`**. Qualquer outra saída é regressão.

**✅ Varredura de hoje (2026-09-01) encontrou uma TERCEIRA família quebrada, corrigida
em duas levas. Ambas concluídas — ver estado final logo abaixo.**

**Leva 1 — CORRIGIDA (2026-09-01):** as 18 páginas avulsas abaixo receberam
`<script src="auth-secure.js?v=seg1"></script>` imediatamente antes de `store.js`,
mesmo padrão dos 20 jogos:
`shop.html`, `daily_challenge.html`, `progress.html`, `pronun_practice.html`,
`story_time.html`, `grammar_lab.html`, `reading_room.html`, `number_quest.html`,
`alphabet.html`, `ai_quiz.html`, `historyline.html`, `newsline.html`,
`lesson_creator.html`, `lesson_runner.html`,
`2_Flashcard_Journey_Expedition_Edition.html`,
`3_Dialogue_Expedition_Yara_Turn.html`, `5_Game_Pavilion_Forest_Edition.html`,
`9_Game_Pavilion_Yaras_Expedition.html`. Atenção especial a `shop.html`: é a página
que gasta moeda do aluno (`Store.spendBerries` seguido de `Store.unlockItem`) — a
ordem `auth-secure.js` antes de `store.js` foi confirmada nesse arquivo
especificamente.

**Leva 2 — CORRIGIDA (2026-09-01):** os 139 arquivos restantes que a varredura
`grep -L "auth-secure.js" $(grep -l "store.js" *.html)` ainda devolvia — as 124 aulas
de curso (`aula_*.html`, `advanced_aula_*.html`, `business_aula_*.html`,
`intermediate_aula_*.html`, `travel_aula_*.html`, `fr_aula_*.html`,
`gpstronic_aula_*.html`), as 8 páginas `classes*.html` (`classes.html`,
`classes_advanced.html`, `classes_business.html`, `classes_fr.html`,
`classes_gpstronic.html`, `classes_intermediate.html`, `classes_tr.html`,
`classes_travel.html`), `learn_fr.html`, `learn_gpstronic.html`,
`learn_intermediate.html`, e três páginas que o debugger tinha classificado como
"só leem" — `leaderboard.html`, `termos.html`, `privacidade.html` — receberam a
mesma linha, injetada por script node antes da tag de `store.js`. Antes de escrever,
o script listou os formatos distintos da tag `store.js` no lote: só existia um,
`<script src="store.js?v=boss2"></script>`, em todos os 139 arquivos — sem variação
de aspas/atributos/`?v=` para se preocupar desta vez. 139 alterados, 0 pulados,
bate com o tamanho da lista.

**Estado final esperado (2026-09-01, as duas levas somadas):**
```bash
grep -L "auth-secure.js" $(grep -l "store.js" *.html)
```
Deve devolver **vazio**. Qualquer saída não-vazia no futuro é regressão — uma página
nova que carrega `store.js` sem copiar o `<script src="auth-secure.js...">` que vem
antes dela nos moldes existentes.

---

## 2026-09-01 — Badges de contagem de aulas desatualizados (Advanced e GPS Tronic)

**Sintoma:** o card "Advanced" no hub (`classes.html`) dizia "6 aulas" com 10
publicadas; o card "GPS Tronic" dizia "1 aula" com 8 publicadas, e o hero da própria
página do curso (`classes_gpstronic.html`) também dizia "1 aula" — enquanto o `<nav>`
SEO e o array `LESSONS` da mesma página já diziam 8. Também sobrava um comentário
morto em `learn.html` afirmando "22 lessons" num array de 122+ entradas.
**Causa raiz:** contagens de aulas escritas como texto estático em badges/heros, sem
nenhuma derivação de `LESSONS.length` ou da contagem real de arquivos. Cada curso
novo exige lembrar de atualizar N lugares na mão; ninguém lembrou.
**Correção:** `classes.html:187` (`6 aulas` → `10 aulas`), `classes.html:240`
(`1 aula` → `8 aulas`), `classes_gpstronic.html:75` (hero `1 aula` → `8 aulas`).
`classes_gpstronic.html:80` (`progress-label`) **não foi tocado** — é sobrescrito em
runtime por `LESSONS.length` (linha 189-192), então já estava correto de fato.
`learn.html:208` — comentário trocado para não carregar mais um número que desatualiza.
**Como pegar isso de novo:**
```bash
node scripts/checa-badges.mjs    # sai com código 1 se algum badge divergir
```
Rode antes de publicar sempre que criar ou remover aula. Testado reintroduzindo o
bug de propósito: acusa `FALTA Advanced 10 aulas reais` + `BADGE SEM CURSO: 6`.

Duas armadilhas que esse script já contorna, e que derrubaram a primeira versão dele:
- **Türkçe não tem arquivos.** As 36 lições vivem no array de `lessons_tr_data.js`.
  Contar por `ls turkce_aula_*` devolve 0 e o script diz "ok" achando que não há curso.
- **Francês é `fr_aula_*`, não `frances_aula_*`.** Prefixo errado = contagem 0 = falso
  "tudo certo". Um verificador que erra o prefixo é pior que não ter verificador:
  ele responde "limpo" com convicção.
**Por que aconteceu:** número escrito em texto solto em vez de derivado de uma fonte
única (array `LESSONS` ou contagem de arquivo). O bughunter original relatou os três
achados como estando em `learn.html` — proximidade de linha entre um `grep -n "aula"`
e o texto do relatório, sem confirmar o arquivo — quando na verdade eram
`classes.html` e `classes_gpstronic.html`; `learn.html` nem tem a palavra "aula".

---

## 2026-09-01 — Ícone do app congelado pelo service worker

**Sintoma:** trocamos o ícone do app, publicamos, e quem já tinha instalado continuava
vendo o ícone antigo — para sempre.
**Causa raiz:** o `sw.js` faz cache-first de imagens partindo do princípio de que
"imagem muda de nome quando muda". O `/icon-192.png` é a exceção: tem nome fixo e está
no `PRECACHE`. O `?v=` do HTML não alcança o service worker.
**Correção:** `sw.js:12` — `CACHE` de `capy-v2` para `capy-v3`.
**Como pegar isso de novo:**
```bash
grep -n "PRECACHE" sw.js          # todo arquivo aqui precisa de bump do CACHE ao mudar
curl -s https://www.capyenglish.com.br/sw.js | grep -o "capy-v[0-9]"
```
**Por que aconteceu:** o comentário no topo do `sw.js` afirma que imagens são seguras
porque mudam de nome. O `PRECACHE` logo abaixo contradiz isso e ninguém releu.

---

## 2026-09-01 — Foto de perfil usada como ícone tinha cantos pretos

**Sintoma:** o PNG parecia ter cantos arredondados transparentes, mas era `rgb24`:
os cantos eram preto sólido. Como iOS e Android arredondam o ícone por conta própria,
cada canto viraria uma cunha preta.
**Causa raiz:** arte exportada sem canal alfa.
**Correção:** máscara extraída por preenchimento a partir dos quatro cantos (só o preto
**ligado à borda** é fundo — assim as pupilas escuras não são tocadas), cantos
repintados com o degradê ajustado por mínimos quadrados.
**Como pegar isso de novo:**
```bash
ffprobe -v error -show_entries stream=pix_fmt -of csv qualquer-icone.png   # rgb24 = sem alfa
```
**Por que aconteceu:** confiei na aparência da miniatura. Fundo do visualizador de
imagem e canto preto da arte são indistinguíveis a olho.

---

## 2026-09-01 — Trilha diária não salvava: 403 invalid_csrf

**Sintoma:** aluno concluía atividade na lição e o progresso não chegava ao servidor.
Silencioso — o `.catch(e => {})` em `store.js` engolia o erro.
**Causa raiz:** `POST /api/db` exige `X-CSRF-Token`. Esse header só é injetado pelo
remendo em `window.fetch` dentro do `auth-secure.js`, e o `lessons.html` **não carregava
o `auth-secure.js`** (apenas 15 de 201 páginas carregam; 0 das 124 aulas de curso).
**Correção:** `<script src="auth-secure.js?v=seg1">` antes do `store.js` em
`lessons.html`, mais `Store.mergeFromServer()` para não retroceder progresso.
**Como pegar isso de novo:**
```bash
# toda pagina que chama Store.save() precisa carregar auth-secure.js antes
grep -L "auth-secure.js" $(grep -l "store.js" *.html)
```
**Por que aconteceu:** a proteção CSRF foi adicionada no servidor sem inventariar quais
páginas carregavam o cliente que a satisfaz.

---

## 2026-09-01 — `favicon.ico` e `.svg` davam 404 em produção

**Sintoma:** 198 páginas referenciavam `/favicon.ico`; todas davam 404. Funcionava local.
**Causa raiz:** o `vercel.json` usa `builds` legado, que é **lista branca de extensões**.
`.ico` e `.svg` não estavam lá, então os arquivos nunca subiam — **sem erro de build**.
**Correção:** entradas `favicon.ico` e `*.svg` no array `builds`.
**Como pegar isso de novo:**
```bash
# qualquer 404 em producao que funciona local: conferir a lista branca primeiro
node -e "console.log(require('./vercel.json').builds.map(b=>b.src).join('\n'))"
```
**Por que aconteceu:** falha silenciosa. Nada no build avisa que um arquivo foi ignorado.
