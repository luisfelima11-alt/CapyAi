# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Capy Yara Adventures is a gamified English-learning platform for Brazilian students, centered on a capybara mascot named Yara 🐾. Built with vanilla HTML/CSS/JS (Tailwind CDN) + a Node.js dev server with OpenAI integration. No build step — all files are static except the API layer.

## Sessão mestre: só ela revisa e publica (regra do Luis, 18/out/2026)

Uma sessão do Claude é a **mestre** (a "capy na nuvem"). Toda funcionalidade feita por outra
sessão passa pela revisão dela antes de ir ao ar, para não quebrar o site.

**Toda outra sessão:**
1. Cria o ramo a partir da `sync/estado-producao` (o que está no ar), nunca do `main`, que está parado em maio.
2. Abre o PR para a `sync/estado-producao`, preenche o modelo `.github/pull_request_template.md` e para ali.
3. **Nunca:** `vercel --prod`, `vercel promote`, push ou merge na `sync/estado-producao` ou no `main`, nem SQL
   na produção. Isso é da mestre.
4. Se a mestre pedir correção no PR, corrige no mesmo ramo.

**A mestre:**
- revisa o PR:
  - CI, a suíte inteira com `PLAYWRIGHT_BROWSERS_PATH`, o e2e, o `scripts/audit.js` e o gitleaks;
  - a mescla simulada com os outros PRs abertos;
  - as regras deste arquivo e o SQL rodando antes do código;
  - as etiquetas `?v=` e o Preview;
- marca o PR com uma etiqueta:
  - 🟢 **mestre: publicar** (correção de bug ou de segurança, verde e sem SQL): a mestre mescla sozinha;
  - 🟡 **mestre: esperando** (o aluno vê a mudança, falta SQL, ou depende de outro PR): só vai ao ar depois
    do ok do Luis no Preview ou da condição cumprida;
  - 🔴 **mestre: corrigir**: volta para a sessão que fez, com o que corrigir no comentário;
- **publica mesclando na `sync/estado-producao`**: a Production Branch do Vercel publica e promove sozinha,
  e os crons vão junto;
- confere o site no ar depois de publicar.

Se der errado, a mestre volta pelo Vercel → Deployments → Instant Rollback, e depois abre um PR de revert.

## Antes de investigar um bug: leia BUGS-APRENDIDOS.md

`BUGS-APRENDIDOS.md` guarda cada bug já consertado neste projeto, com a **causa raiz**
e um **comando que denuncia o mesmo defeito em 5 segundos**. Vários bugs daqui já
voltaram por não terem sido registrados. Consulte antes de diagnosticar, e registre
depois de corrigir.

O ciclo: **capy-bughunter** acha o sintoma → **capy-debugger** prova a causa raiz →
**capy-fixer** corrige e escreve a lição de volta no arquivo.

## Toda aula nova sai com a Folha da aula em PDF (regra do Luis, 12/out/2026)

Toda aula nova de curso vem com uma **folha de apoio em PDF** para o aluno imprimir e
acompanhar a aula. A aula só está pronta quando a folha existe.

- **Uma página A4, e só uma.** O aluno vai imprimir, então é enxuto.
- **Preto no branco.** Cor só nos títulos das partes (a cor do curso). Sem fundo colorido, sem
  emoji, sem enfeite.
- **O que vai, nesta ordem:**
  1. cabeçalho com curso, número e título;
  2. vocabulário (palavra, tradução e uma frase curta de exemplo);
  3. o padrão da aula em 3–4 exemplos, nunca regra;
  4. as frases-chave;
  5. **Minhas frases**, com 3 linhas para o aluno escrever os próprios exemplos antes da aula;
  6. **Notas**, com o espaço que sobrar.
- **Gerada por script, nunca à mão:** `node scripts/gera-folha-aula.mjs <aula>.html`. Ela sai
  em `assets/pdf/<slug>-folha.pdf`. O script falha se passar de 1 página.
- **Na aula,** depois do Homework, entra o cartão "📄 Folha da aula" com o botão de baixar (que
  funciona no celular). O link também aparece no hub do curso.
- `assets/**/*.pdf` tem que estar nos builds do `vercel.json`. Fora da lista, o PDF dá 404 sem
  nenhum erro.

## Botão "Tela cheia" para dar aula (pedido do Luis, 01/nov/2026)

Só nas aulas do **GPS Tronic** e do **Agro English**:
`<script src="tela-cheia.js?v=tc1"></script>`, logo antes do script da folha.

- O botão coloca a página inteira em tela cheia, para projetar a aula. Ele não aumenta o texto.
- Para sair, o mesmo botão ou o Esc.
- Ele é flutuante, no canto inferior esquerdo.
- Não aparece onde não há API de tela cheia (iPhone).
- Os geradores (`build-gpstronic-aula.mjs` e `build-agro-aula.mjs`) usam `gpstronic_aula_09.html`
  como molde, e o molde já tem a tag. Por isso aula nova desses cursos nasce com o botão.
- `tests/tela-cheia.test.js` garante:
  - a tag uma vez em cada aula desses dois cursos;
  - nenhuma outra página com o botão.

## Padrão das aulas de 12/nov/2026: Listening curto, Expressions em slides e 2 exercícios novos

Vale para toda aula do molde novo (o desenho da `gpstronic_aula_09.html`):

- **Listening com no máximo 15 áudios.** Quem decide é o `listening-lab.js` (`MAX_ITENS`):
  1. primeiro as frases do Speak;
  2. depois as falas principais do diálogo;
  3. as falas extras só entram se faltar.
- **Key Expressions em slides, no visual do Patterns.** É uma expressão por slide, com 🔊, tradução,
  "quando usar" e exemplo, com tela cheia.
  - O `aula-molde.js` monta o deck a partir do `EXPR_DATA` da aula. As aulas do molde ganham os slides
    só por carregar o script (`node scripts/aplica-padrao-novo.mjs`).
  - O comportamento vem do mesmo motor do Patterns: `gramatica-slides.js`, `CapySlides.montar`.
  - **O que não pode mudar:**
    - o contêiner continua `#expr-grid` (o `self-study.js` usa);
    - o array continua `EXPR_DATA`, com `expr`/`pt` (a folha em PDF lê esses campos);
    - nada de classe `flip-card`.
- **"How do you say it in English?"** (`#tab-traducao`, logo depois do Patterns): 6 frases em PT com
  o vocabulário da aula, que o aluno escreve em inglês.
  - A conferência é tolerante (`CapyFala`) e aceita as variações em `aceitas`.
  - A resposta certa aparece escrita sempre, no acerto e no erro.
- **Texto com lacunas** (`#tab-lacunas`, logo depois do Practice): um texto de 60 palavras ou mais,
  com 6 a 8 `[[pedaços]]`.
  - Os pedaços ficam numa caixa, junto com 2 de distração. O aluno toca para encaixar.
  - "Conferir" revela a palavra certa de cada lacuna errada.
- **Dados das seções novas:** vêm do conteudo.json (`traducao`, `lacunas`). O construtor grava
  `const TRAD_DATA` e `const LACUNAS_DATA`, e o `aula-molde.js` monta as duas seções.
- **Construtor de referência:** `scripts/build-intermediate-aula.mjs`. É o primeiro com as duas
  seções novas e foi feito para as aulas 19 e 20 do Intermediate. Os construtores do GPS, do Agro,
  da Entrevista e do Medical ganham as seções quando cada curso for refeito.

## Proibido: "gramática" e "grammar" (regra do Luis, 12/out/2026)

O foco do site não é gramática, é **aprender com exemplos**. Por isso, as palavras
"gramática", "gramatical" e "grammar" **não aparecem em nada que o aluno vê**: texto, título,
botão, SEO, PDF ou fala da Yara.

- O nome da seção é **🧩 Patterns** (em português, "padrão"). O botão é "Entendi o padrão! (+20 XP)".
  "Corrija o erro gramatical" vira "Corrija a frase".
- Na seção Patterns, o ensino vem dos exemplos: 3–4 frases do diálogo, o contraste
  certo/errado e, no máximo, uma linha de explicação. Nada de tabela de regra.
- Os ids internos (`tab-grammar`, `'grammar'` na `ROTA`) continuam como estão: o aluno não os
  vê, e o `self-study.js` e o `listening-lab.js` dependem deles.
- Os prompts da Yara mandam ensinar com exemplos e nunca dizer "grammar" ou "gramática".
- O `grammar_lab.html` se chama **Laboratório de Padrões** (30/out/2026); a categoria de jogos do pavilhão
  é "Padrões". O nome do arquivo e os ids (`grammarDone`, `grammar_star`, `data-filter="grammar"`) ficam.

## SEO e página 404 (30/out/2026)

- Toda página do `sitemap.xml` tem `<meta name="description">` própria (50+ caracteres, sem repetir e sem
  "gramática"/"grammar"); `og:description` e `twitter:description` repetem o mesmo texto. Página nova no
  sitemap sem descrição faz o `npm run test:security` falhar.
- Nas metas, `&` vira `&amp;` **uma vez** (`&amp;amp;` aparecia literal no WhatsApp) e aspas dentro do texto
  são curvas (“ ”): uma aspa reta fecha o `content` no meio.
- Endereço que não existe mostra o `404.html` (últimas rotas do `vercel.json`: `handle: filesystem` e depois o
  404; o dev-server faz o mesmo). Ele usa só caminhos absolutos, porque aparece em qualquer pasta.

## Curso de francês: sem pronúncia escrita, e voz da OpenAI (regra do Luis, 19/out/2026)

O curso de francês **não mostra a pronúncia escrita** ("Bonjour [bon-JUR]"): nem nos cards de vocabulário,
nem na tabela de verbos, na aba Speak, nos padrões, nos quizzes, na trilha diária ou nas folhas em PDF.
O aluno aprende ouvindo (botão 🔊) e vendo o francês escrito.

- **Os HTML e a trilha são gerados.** Nunca edite `fr_aula_XX.html` nem `lessons_fr_data.js` à mão: a próxima
  geração desfaz. Edite `scripts/fr-lessons-part1.mjs` / `part2.mjs` e rode:
  `node scripts/build-fr-aulas.mjs && node scripts/build-fr-trail.mjs && node scripts/build-lesson-data.js`
  (a trilha lê `data/lessons/201..212.json`, não o `lessons_fr_data.js`). Depois as folhas:
  `node scripts/gera-folha-aula.mjs --curso fr_aula`.
- `scripts/fr-sem-pronuncia.mjs` tira os colchetes de tudo que os geradores produzem e **falha a geração**
  se sobrar um. Quiz que perguntava "como se pronuncia?" com a pronúncia escrita nas alternativas foi
  reescrito com palavras ("O E soa como A"). Aula nova de francês não leva campo `phon`.
- Mudou dado da trilha? Troque a etiqueta `?v=` do `fetch('data/lessons/…')` em `lessons.html` e `quadro.html`
  (o `/data/` fica em cache por 1 dia).
- **Voz:** `tts-fr.js` usa a voz da OpenAI com sotaque francês (`/api/tts?lang=fr`, `gpt-4o-mini-tts`) pelo
  `CapyAudio` (funciona no iPhone) e cai na voz do navegador só se a OpenAI falhar. Ela lê só a frase em
  francês: o que está entre parênteses (tradução, "(e)" de Enchanté(e)) fica na tela e a voz pula.
- Teste: `tests/frances-sem-pronuncia.test.js`.

## Lição de casa chega ao professor (18/out/2026)

Toda aula com aba `#tab-homework` envia a entrega para `POST /api/homework` sozinha: o
`components.js` (`autoEnviarLicaoDeCasa`) observa o clique no botão `onclick="submit…()"` da aba
e, **se o botão ficou desabilitado**, manda as respostas escritas (inputs de texto e textareas).
O professor vê tudo em `teacher_homework.html` (papel teacher/admin, com verificação em duas etapas).

- Aula nova: basta um botão `submit…()` (`submitHomework12`, `submitReviewDone`…) dentro de `#tab-homework`, que se desabilita quando
  a entrega vale. Não chame `fetch('/api/homework')` na página: o envio sairia duas vezes.
- Visitante sem conta vê "Entre na sua conta para o professor ver"; erro de rede mostra "Tentar de novo".
- Tabela `homework_submissions` (`202611010003_licao_de_casa.sql`, RLS com `private.current_account_id()`): o aluno grava e lê só as dele,
  o painel lê pelo servidor. Até 18/out ela não existia e a entrega se perdia em silêncio.

## GPS Tronic e Agro: homework maior, card para o teacher e 🎯 Prepare (07/nov/2026)

Tudo sai dos geradores (`build-gpstronic-aula.mjs` e `build-agro-aula.mjs`). Depois de mudar o
`conteudo.json`, gere a aula de novo.

- **Homework novo** (`scripts/lib/homework-plus.mjs` + `homework-plus.js`):
  - vale nas aulas cujo `conteudo.json` tem `homework.completar`, `compreensao`, `voz`, `livre` e
    `escrita`. Por enquanto: GPS 23–27 e Agro 11–15;
  - são 8 tarefas. A 8 (escrita guiada, `#texto-guiado`) é obrigatória para entregar;
  - na entrega, o campo `#placar` é o primeiro das respostas que o `components.js` manda ao professor;
  - depois da entrega, o aluno ganha um card PNG 1080×1350 para compartilhar (Web Share; sem
    ele, a imagem é baixada).
- **Aulas sem o homework novo:** a escrita é um pedido neutro com os padrões da aula. O validador
  falha se o texto fixo da aula 09 ("reiniciar o monitor", "imperativo") voltar.
- **🎯 Prepare** (`scripts/lib/preparacao.mjs` + `preparacao.js`):
  - é o primeiro passo da rota de toda aula gerada;
  - mostra 6 palavras, o começo do diálogo, um quiz de 5 perguntas e um aquecimento
    (`conteudo.json` → `preparacao.aquecimento`/`exemplo`; sem eles, uma pergunta neutra);
  - ao terminar, manda `POST /api/homework` com `lessonId: "<aula>-prep"`. É a única chamada
    direta ao endpoint numa aula. Ela fica fora do `#tab-homework`, e por isso não duplica a entrega.
- **No painel:**
  - o `professor.js` mostra "🎯 preparou a aula N" à parte das lições de casa;
  - o `resumoAluno` não conta a preparação no alerta de lição atrasada.
- **Testes:** `tests/homework-plus.{test,spec}.js`, `tests/preparacao.{test,spec}.js`.

## Página de Preparação de aula (piloto: francês, 09/nov/2026)

`preparacao.html` é o lugar próprio da preparação para a aula ao vivo. Ela segue o método do Luis
(o da Influx): ouvir antes de ler, palavras com repetição, noticing e falar.

- **Sessão** (`preparacao.html?aula=fr_aula_03`, 10 a 15 min, uma tela por vez):
  1. 🎧 Ouvir: o diálogo na voz, **sem texto**, e 3 perguntas;
  2. 🔤 Palavras: 8 cartões "ainda não sei / já sabia"; as difíceis voltam na sessão e na revisão;
  3. 📖 Ler: o texto, com as palavras do passo 2 sublinhadas;
  4. 👀 Reparar: 2 trechos do diálogo para o aluno notar como se diz algo (noticing);
  5. 🗣️ Falar: repetir 3 frases no microfone (`CapyMic`, `uso: 'preparacao'`, balde `transcribe-prep`)
     e responder em voz a pergunta da aula;
  6. ✅ Pronto: placar, +30 XP na primeira vez e `POST /api/homework` com `lessonId: "<aula>-prep"`.
     O professor recebe o placar, a resposta transcrita e as palavras difíceis.
- **Lista** (`preparacao.html`):
  - a próxima aula é a primeira que o aluno não terminou (`capyFrCompleted`);
  - se ele já se preparou, a página oferece adiantar a seguinte;
  - "Palavras para revisar" usa repetição espaçada no aparelho (`capyPrepPalavras_fr`: amanhã,
    depois 3, 7 e 14 dias).
- **Atalhos:**
  - o botão "🎯 Preparar esta aula" em cada `fr_aula_XX` (vem do gerador `build-fr-aulas.mjs`);
  - o card no `classes_fr.html`;
  - o card na home, só para quem já estuda francês (`preparacao-atalho.js`).
  - Ainda sem item no menu: ele aparece quando a página tiver mais cursos.
- **Conteúdo:**
  - o diálogo, as palavras e as frases saem da própria aula;
  - o que a aula não tem (compreensão, "repare" e a pergunta) fica em `scripts/fr-preparacao.mjs`;
  - depois de editar, rode `node scripts/build-preparacao.mjs`, que gera `data/preparacao/*.json`
    e confere: sem pronúncia escrita, sem "gramática", o trecho existe no diálogo e a resposta está
    entre as opções;
  - mudou algum dado? Troque `VERSAO_DADOS` em `preparacao-core.js`.
- **Curso novo na preparação:** um arquivo de conteúdo como o `fr-preparacao.mjs`, uma entrada em
  `cursos.json` (o build) e o atalho na página do curso.
- **Testes:** `tests/preparacao-pagina.{test,spec}.js`.

## Jogo novo? Registre no game-celebra.js

O fim de partida dos jogos dispara a comemoração da Yara por meio do `game-celebra.js`,
que envolve a função de fim de cada jogo listada no `MAPA` dele (`finishGame`,
`showGameOver`, `showFinished`...). **Jogo que não está no mapa não comemora — em silêncio.**
Ao criar um jogo: (1) acrescente `pagina: { fn: 'nomeDaFuncaoDeFim' }` no `MAPA`;
(2) a função tem que ser uma declaração `function` global (não `const`/`let`, e não dentro de IIFE);
(3) carregue `celebration.js` e depois `game-celebra.js` imediatamente antes de `</body>`.
Confira no console da página: `window.__capyGameCelebra.instalado` tem que ser `true`.
O `flappy_yara` fica fora de propósito (a partida termina numa colisão seguida de quiz).

## Dev Server

```bash
node scripts/dev-server.js   # http://localhost:8765 — pages + every /api/* through api/index.js
```

`scripts/dev-server.js` serves the pages and hands every `/api/*` request to the production
handler (`api/index.js`); change the API there, never by adding routes to the dev server.
Local `.env` (never committed): `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SECRET_KEY`, `SESSION_COOKIE_SECRET`, `APP_ORIGIN`; optional `OPENAI_MODEL`
(default `gpt-4o-mini`), `OPENROUTER_API_KEY`, `PORT`.

Tests: `npm run test:security` (node --test, no network or keys needed); `npm run security:check`
adds `scripts/audit.js`, which the CI runs too: `npm audit` at high, where the production dependencies
get no exception and an advisory only the dev tools reach (Tailwind, Playwright) can get a dated one in
`EXCECOES`. Add a case to `tests/security.test.js` for every security-relevant change.

## Deployment and branches

Vercel project `capy-yara-adventures`, production https://capyenglish.com.br. **Only the master
session publishes** (see "Sessão mestre"): `sync/estado-producao` is the production branch, so merging
into it is publishing. Every other session works on a branch and opens a PR.

- `vercel.json` sends `/api/*` to `api/index.js` and `/` to `landing.html`, and sets the security
  headers and two CSPs: strict for the hardened pages (login, set-password, account, admin,
  admin-antigo, admin-metrics, teacher_homework, professor, turma — no inline script, local
  Tailwind), compatibility for the rest. The strict rule's page list and the compatibility rule's
  exclusion must stay equal (`tests/security.test.js` checks it).
- **Headers are written in `headers` but only `routes` reach production.** With `builds` + `routes`,
  Vercel ignores the `headers` block (until 02/nov/2026 no static page got the CSP or X-Frame-Options).
  After editing `headers`, run `npm run headers`: it regenerates the `continue: true` routes at the top of
  `routes` (a test fails if they are stale). Never add a key Vercel doesn't know to a route: the deploy fails.
  `source` there can't match a query string (`?v=`), so long-cache rules for versioned files don't exist.
- SQL in `supabase/migrations/` runs in the Supabase SQL editor **before** the code that needs it.
  Release steps and owner actions live in `SECURITY-ROLLOUT.md`.
- `scripts/`, `tests/`, `supabase/` and `*.md` never ship (`.vercelignore`).

Só a sessão mestre publica, mesclando na `sync/estado-producao` (veja "Sessão mestre"). Os comandos abaixo
ficam para emergência, com o Luis, se a publicação pelo merge falhar:
```bash
npx vercel --prod --force                 # always use --force to bypass cache
npx vercel promote <deployment-url>       # OBRIGATORIO: sem isto o deploy nao vira producao oficial
npx vercel crons ls --format json         # conferir: os 2 crons com host = o deploy novo, "undeployed": []
```

**Por que o promote (26/set/2026):** neste projeto o `vercel --prod` cria o deploy mas NAO o promove.
Os dominios e os **crons** ficam presos no ultimo deploy promovido. O `alias set` manual movia so
os dominios, entao os crons ficaram num deploy antigo por semanas:
- o `/api/teacher-brief` (resumo da aba Agente) nunca foi registrado;
- o `/api/send-reminders` rodava codigo velho.

O `vercel promote` move os dominios e os crons de uma vez. O `vercel alias set` nos dois dominios
fica so como reforco, se o `curl` no www nao mostrar o conteudo novo.

A Preview runs in production mode from its own `*.vercel.app` URLs. Writes accept `APP_ORIGIN` and,
only when `VERCEL_ENV=preview`, the deployment's `VERCEL_URL` / `VERCEL_BRANCH_URL` (`PREVIEW_ORIGINS`
in `api/security.js`). Sign in there with a password: magic links and e-mails point to `APP_ORIGIN`.

## GitHub

```
https://github.com/luisfelima11-alt/CapyAi.git
```

Fluxo de toda sessão (menos a mestre): ramo novo a partir da `sync/estado-producao`, commit, push do
ramo e PR para a `sync/estado-producao`. Nada de push no `main` nem de `vercel --prod`.
```bash
git fetch origin sync/estado-producao
git checkout -b claude/<assunto> origin/sync/estado-producao
git add <arquivos>
git commit -m "descrição"
git push -u origin claude/<assunto>     # depois, abrir o PR para sync/estado-producao
```

## Architecture

### Navigation & Components (`components.js`)

Every page injects nav via placeholder divs:
```html
<div id="top-nav-placeholder"></div>
<div id="side-nav-placeholder"></div>
<div id="mobile-nav-placeholder"></div>
```
```js
Components.mount('top-nav-placeholder', Components.renderTopNav('classes'));
Components.mount('side-nav-placeholder', Components.renderSideNav('classes'));
Components.mount('mobile-nav-placeholder', Components.renderMobileNav('classes'));
```
Valid `activeTab` values: `'home'`, `'classes'`, `'lessons'`, `'games'`, `'chat'`.

**Cache busting:** pages load shared files as `name.js?v=<tag>`. After changing a shared JS/CSS file
(`components.js`, `store.js`, `auth-secure.js`…), give it a new tag on every page that loads it (a
Node `fs` loop over the `.html` files, not sed); `npm run bump` rewrites every tag to the commit SHA
if you prefer. Hardened pages use the prebuilt `assets/css/security-pages.css`: after adding
Tailwind classes to them, rebuild it (`npm run build:security-assets`, or only its `tailwindcss` step).

**⚠️ Sound on iPhone:** any audio that waits for the network must play through `CapyAudio.play(src, {onended, onerror, rate})` (components.js), never a `new Audio()` created after an `await`: iOS only plays an element first unlocked inside a tap. See BUGS-APRENDIDOS.md (2026-10-18).

**⚠️ Chrome Auto-Translate:** The nav container uses `translate="no"` to prevent Chrome from auto-translating nav labels (e.g. "Cursos" → "Lessons"). Never remove this attribute.

### State Management (`store.js`)

Global state in `localStorage` key `capyYaraState_{userId}`:
- `xp`, `badges[]`, `completedLessons[]`, `completedMinis[]`
- `planType`: `'free'` | `'pro'` | `'super'` — a UI hint synced from `/api/me`; the server enforces plans
- `starBerries`, `streakDays`, `aiUsageToday`

Key methods: `Store.addXP(n)`, `Store.completeLesson(id)`, `Store.completeMini(lessonId, miniNum)`, `Store.consumeAI()`.

Fires DOM events: `stateChanged`, `levelUp`, `badgeUnlocked`, `streakMilestone`.

### Auth and sessions (`auth-secure.js` + `/api/auth/*`)

Supabase Auth behind the API: tokens live only in HttpOnly `__Host-` cookies set by `api/security.js`.
`localStorage.capySession` is a display cache, never proof of identity.

- `auth-secure.js` wraps `window.fetch`: same-origin writes carry `X-CSRF-Token` (double-submit with
  the `__Host-capy-csrf` cookie), so pages just call `fetch('/api/...')`.
- `Auth.login / signUp / logout / refreshSession / ready / continueAsGuest` → `/api/auth/*`. Magic link,
  e-mail confirmation and password recovery come back through `/api/auth/callback`. Passwords are
  Supabase's (bcrypt), 12+ characters, checked against HaveIBeenPwned.
- Guests get a signed session cookie (`/api/auth/guest`). Plans are `free | pro | super`, written only
  by the Kiwify webhook and admin routes.
- Roles come from `app_metadata.role` (set with the Supabase admin API). Admin routes accept only an
  admin session (`isAdminReq`); with `ADMIN_REQUIRE_MFA=true` it must be `aal2` (TOTP enrolled at
  `/admin.html`). `CRON_SECRET` only opens the two cron routes.

### Data (Supabase Postgres, from `api/index.js`)

The API calls Supabase REST with the service key (`sb()`, `SUPABASE_SECRET_KEY`), server-side only.
RLS is on for every table, and column grants keep plan/role out of the browser's reach. Main tables:
`accounts` (`auth_user_id` → Supabase Auth), `user_state` (jsonb per user, plus server rows such as
`__voz_*`), `user_profiles` (level, goals, plan), `webhook_events`, `rate_limit_*`,
`api_metrics_daily` (requests and tokens per endpoint/day), `security_audit_log`,
`homework_submissions`, `push_subscriptions`.

### Security rules (keep them when adding features)

- Identity only from the session (`getRequestIdentity` / `resolveSecurityIdentity`), never from a
  `userId` sent by the browser.
- Text a student or an outside service controls (names, AI output, song titles) goes into HTML escaped
  or through `textContent`, never inside `onclick="…"` strings: use listeners with indexes / `data-*`.
- Student text going into a prompt passes `textoLivreParaPrompt` / `listaParaPrompt` (`textoParaPrompt`
  for titles and slugs); AI responses leave through `sanitizeAiOutput`.
- Every AI route is listed in `AI_ROUTE_KEYS`: the central gate identifies the student and applies the
  plan's daily limit (guests: 3 AI uses a day). The lyrics proxies (`ROTAS_SEM_IA`) use their own limit
  and never spend a guest's AI uses.
- Writes need an allowed `Origin` and, with session cookies, the CSRF token. Reads (GET) never get
  either: a same-origin fetch sends no `Origin`, so a GET route with cookies is checked by
  `Sec-Fetch-Site` instead (`assertLeituraDoProprioSite`). Test such rules in production mode
  (`NODE_ENV=production`): outside production a missing `Origin` passes and hides the bug.
- No per-handler `Access-Control-Allow-Origin`; provider errors go to the log, not to the response.
- Pure helpers are exported for tests as `module.exports._internos`.

**AI routes: reads vs writes (28/set/2026).** Writes need an allowed `Origin` and, with session cookies,
the CSRF token. A same-origin GET sends neither, so a GET AI route with cookies (lyrics search, lyrics,
TTS, daily challenge, word of the day) is checked by `Sec-Fetch-Site` instead (`assertLeituraDoProprioSite`).
Test such rules with `NODE_ENV=production`: outside production a missing `Origin` passes and hides the bug.
The lyrics proxies (`ROTAS_SEM_IA`) have their own limit and never spend a guest's AI uses.

### Lesson Architecture

Trail defined in `learn.html` (`TRAIL` array, 24 lessons, 4 chapters). Each lesson has 4 mini-lessons × 6 steps (Listen, Quiz, Game, Build, Speak, Chat). Progress key: `localStorage.capyGuidedStep_{lessonId}_m{miniNum}`.

### Aula Pages (`aula_XX.html`)

The course has **44 lessons total**. The grid in `classes.html` displays them in logical order — file names and display numbers do not always match (see navigation chain below).

**Navigation chain (in lesson order):**
`aula_01 → ... → aula_32 → aula_43 → aula_44 → aula_33 → aula_34 → ... → aula_42`

`classes.html` LESSONS array maps display positions 33/34 → `aula_43.html`/`aula_44.html`, positions 35–44 → `aula_33.html` through `aula_42.html`.

---

### Three Lesson Templates

#### Template 1 — New/Standard (aulas 01–19, 33–42)
7-tab pattern, fully self-contained inline JS, no `lesson-engine.js`.

Tabs: `vocab → expressions → grammar → practice → speak → homework`
(Some aulas use a dialogue tab instead of grammar.)

```js
// markSection takes a string arg
const SECTIONS = ['vocab','expressions','grammar','practice','speak','homework'];
const _done = new Set();
function markSection(s) {
  if (_done.has(s)) return;
  _done.add(s);
  Store.addXP(20);
  showXP('+20 XP 🔥');
  updateDots();
}
```

**Reference file:** `aula_33.html`

---

#### Template 2 — Old/Engine (aulas 20–32, 34)
Uses `lesson-engine.js` — `initLesson({tabs, totalSections, vocab, expressions, practice, speak})`.

```js
// markSection takes NO args — lesson-engine.js handles it
markSection();           // increments internal counter
Store.addXP(75);        // called SEPARATELY for homework (not automatic)

initLesson({
  tabs: ['vocab','expressions','grammar','practice','speak','homework'],
  totalSections: 6,    // increment when adding a new tab
  vocab: [...],
  ...
});
```

The `result-overlay` (practice quiz result modal) in old-template aulas is rendered by `lesson-engine.js`.

**Reference file:** `aula_28.html`

---

#### Template 3 — Communicative (aulas 43, 44)
6-tab pattern focused on real-life conversation scenarios, NOT grammar drilling. Uses new-template inline JS.

Tabs: `situation → dialogue → chunks → practice → speak → homework`

| Tab | Content |
|-----|---------|
| 🎬 Situation | Context card, character cards, grammar focus grid |
| 💬 Dialogue | JS-rendered chat bubbles, color-coded grammar, per-line TTS (`speakLine43(i)`) |
| 🔑 Chunks | 8 key phrases with PT translation, usage note, TTS buttons; Mark button unlocks after 4 listened |
| ✏️ Practice | MCQ (`opt-btn`) + fill-in-blank (`fill-inp`) |
| 🗣️ Speak | Roleplay prompts with toggle-reveal example answers |
| 📋 Homework | Standard wo/mp/err/free-writing pattern |

```js
// markSection pattern (same as new template):
const SECTIONS43 = ['situation','dialogue','chunks','practice','speak','homework'];
const _done43 = new Set();
function markSection(s) {
  if (_done43.has(s)) return;
  _done43.add(s);
  if (typeof Store !== 'undefined') Store.addXP(20);
  showXP('+20 XP 🔥');
  updateDots43();
}
```

CSS used by communicative aulas: copy `.opt-btn`, `.fill-inp`, `.wo-tile`, `.wo-bank`, `.wo-ans`, `.mp-btn`, `.prog-dot.done` from `aula_40.html`.

**Files:**
- `aula_43.html` — "Let's Make Plans!" 🗓️ (Will vs Going To + Making Plans, scenario: planning trip to Rio)
- `aula_44.html` — "Tell Me About Yourself" 🎤 (Present Perfect + Will/Going To, scenario: job interview)

---

#### Template 4 — Verb-Enhanced (Travel 06+, Business 06+, Intermediate 01–04)

8-tab pattern. Identical to Template 1 (new/standard) but adds a dedicated **Verbs** tab between Vocab and Expressions. Use for all new lessons going forward.

```
Tabs: vocab → verbs → expressions → grammar → dialogue → practice → speak → homework
SECTIONS = ['vocab','verbs','expressions','grammar','dialogue','practice','speak','homework']
8 × +20 XP + +75 homework = 235 XP total
```

**Tab Verbs content:**
- 3–5 key verbs from the lesson topic
- Conjugation table per verb (6 forms): Present · Past · Past Continuous · Present Perfect · Past Perfect · Future
- 3 real-life example sentences per tense form
- Mini conjugation quiz: 5–8 fill-in-blank inputs (`data-ans` attribute) + "Check Answers" button
- `markSection('verbs')` + `Store.addXP(20)` when student completes the quiz

```js
// Verbs tab mini-quiz pattern:
function checkVerbQuiz() {
  const inputs = document.querySelectorAll('.verb-check');
  let correct = 0;
  inputs.forEach(inp => {
    const ok = inp.value.toLowerCase().trim() === inp.dataset.ans;
    inp.classList.toggle('!border-emerald-400', ok);
    inp.classList.toggle('!border-red-400', !ok);
    if (ok) correct++;
  });
  document.getElementById('verb-result').textContent = `${correct}/${inputs.length} correct`;
  if (correct >= Math.floor(inputs.length * 0.7)) markSection('verbs'); // ≥70% to pass
}
```

**Reference files:** `travel_aula_06.html`, `business_aula_06.html`, `intermediate_aula_01.html`

**Intermediate course specifics:** Verbs tab shows 4–5 verbs with ALL 6 tenses (because verb mastery is the course focus). Quiz has 8 fill-in-blank. `markSection('verbs')` requires ≥6/8 correct.

---

#### Template 5 — Conversation (Intermediate conversation lessons)

6-tab pattern focused on real-world listening, reading, and free production. NO flip cards, NO grammar accordion.

```
Tabs: reading → listening → questions → speaking → writing → homework
SECTIONS = ['reading','listening','questions','speaking','writing','homework']
6 × +20 XP + +75 homework = 195 XP total
```

| Tab | Content |
|-----|---------|
| 📖 Reading | Long text (350–400 words), keywords bolded in accent color, expandable glossary (8 words) |
| 🎧 Listening | Audio via browser `speechSynthesis` (rate 0.85), NO transcript shown; textarea "write what you heard"; word counter; "Reveal Transcript" button appears at ≥20 words |
| ❓ Questions | 10 questions: 3 comprehension (radio Y/N + feedback), 4 open-ended (textarea), 3 personal opinion (textarea) |
| 🗣️ Speaking | 5 roleplay prompts, each with toggle-reveal model answer + TTS button |
| ✏️ Writing | Textarea + tense checklist (student marks which tenses they used); `markSection('writing')` when ≥2 tenses checked |
| 📋 Homework | Word Order (3) + Error Correction (3) + Free Writing paragraph (8–10 sentences, 3+ tenses) |

**Listening pattern — critical details:**
```js
// Different text from Reading tab (oral, shorter ~150 words)
const LISTEN_TEXT = `...`;
let listenPlayed = false;

function playListening() {
  const u = new SpeechSynthesisUtterance(LISTEN_TEXT);
  u.lang = 'en-US'; u.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  listenPlayed = true;
  document.getElementById('listen-field').classList.remove('hidden');
}

function checkReveal() {
  const words = document.getElementById('listen-textarea').value.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('word-count').textContent = `${words} words`;
  if (words >= 20) document.getElementById('reveal-btn').classList.remove('hidden');
}

function revealTranscript() {
  document.getElementById('transcript').classList.remove('hidden');
  document.getElementById('reveal-btn').disabled = true;
  markSection('listening');
  Store.addXP(20);
}
```

**Reference file:** `intermediate_aula_05.html`

---

**Template pattern** (use `aula_33.html` or `aula_28.html` as reference):
```html
<div id="top-nav-placeholder"></div>
<div id="side-nav-placeholder"></div>
<main class="md:pl-24 pb-32 md:pb-10">
  <!-- HERO: bg-gradient-to-br from-navy via-[dark] to-[accent], floating emojis -->
  <!-- STICKY TAB BAR: .tab-btn buttons with data-tab attribute -->
  <!-- content divs: id="tab-{name}" class="tab-content fade-in" -->
</main>
<script src="store.js"></script>
<script src="components.js"></script>
<script>
  Components.mount('top-nav-placeholder', Components.renderTopNav('classes'));
  Components.mount('side-nav-placeholder', Components.renderSideNav('classes'));
  Components.mount('mobile-nav-placeholder', Components.renderMobileNav('classes'));
</script>
```

Back link in hero goes to `classes.html`. Prev/Next navigation links in hero must follow the **navigation chain** above.

**Key CSS classes (defined inline in each aula):**
- `.flip-card` / `.flip-card.flipped` — 3D perspective flip
- `.tab-btn` / `.tab-btn.active` — gradient underline via `::after`
- `.fade-in` — opacity + translateY entrance animation
- `.prog-dot` — 10×10px circle for section progress indicator
- `.xp-pop` — floating "+XP" animation on reward

**Section progress (new/communicative template):**
```js
const SECTIONS = [...];
const _done = new Set();
function markSection(s) { if (_done.has(s)) return; _done.add(s); Store.addXP(20); showXP('+20 XP 🔥'); updateDots(); }
```

---

### Old-template aulas (`lesson-engine.js`): two required fixes

- `#result-overlay` needs `onclick="if(event.target===this){this.classList.add('hidden')}"` on the outer
  div. Without it, the `z-50` overlay stays over the `z-40` tab bar after the practice quiz and the
  student can't click anything.
- Add the correct-answer animation after `@keyframes shake{...}` (`answerPrac()` adds `.correct`):
```css
@keyframes correct-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
.opt-btn.correct{animation:correct-pulse .3s ease}
```

## Escuta sem texto: a resposta certa SEMPRE aparece escrita

**Regra do Luis, 13/set/2026. Vale para o site inteiro, daqui em diante.**

Em toda atividade que é **só de escutar** — o aluno ouve um áudio e não há
nada escrito na tela — assim que ele responde, **a resposta certa tem que
aparecer por escrito**. Vale tanto quando acerta quanto quando erra; quem
errou é justamente quem mais precisa ver como se escreve.

**Por quê:** uma atividade que cobra escuta e nunca devolve a grafia ensina o
aluno a reconhecer o som e a continuar sem saber escrever a palavra. Ele
termina o exercício com 100% de acerto e sem ter aprendido a forma escrita.

**Onde isso já vale (verificado):**

| Atividade | Situação |
|---|---|
| `lessons.html` → `renderListen()` / `answerListen()` | **corrigido em 13/set.** O `<p id="listen-reveal">` embaixo do botão de áudio troca "Toque para ouvir" pela palavra ouvida + a tradução. O avanço automático subiu de 700/1200ms para **1600/2400ms**, senão não dá tempo de ler. |
| `listening-lab.js` (ditado das aulas de curso) | já cumpria: o `pintar()` revela a frase-alvo inteira, palavra a palavra, depois do "Conferir". |

**Ao criar atividade de escuta nova, o checklist é:**
1. Depois da resposta, a palavra/frase **ouvida** aparece escrita — não só a opção que o aluno clicou.
2. Aparece também no erro.
3. O tempo até avançar dá para ler (≥1,5s; no erro, mais).
4. Use `textContent`, não `innerHTML`, para escrever a palavra revelada.

## Confirmação de acerto e de erro (regra do Luis, 13/set/2026)

Toda atividade tem que dizer **em texto** o que aconteceu. Cor sozinha não serve:
daltônico não enxerga verde/vermelho, e quem errou precisa **ler qual era a certa**.

| Onde | Acerto | Erro |
|---|---|---|
| `answerQuiz` (trilha) | `✅ Isso!` | `💡 Quase — a resposta é X` + o `why`, se a lição tiver |
| `answerListen` (trilha) | `✅ Isso!` + a grafia | `💡 Quase — você ouviu:` + a grafia |
| `buildCheck` (trilha) | `✨ Correto!` | `🔄 Tente novamente!`; **na 3ª tentativa revela a frase** |
| aula de curso (`answerQ`) | `✅ Correct!` + `q.rule` | `❌ Not quite.` + `q.rule` |

Os tempos de avanço subiram para dar tempo de LER: quiz 1100/2600ms,
listen 1600/2400ms (antes 600/1200 e 700/1200).

**Campo `why` no quiz da trilha:** opcional, uma linha dizendo por que aquela é a
certa. As 218 lições que já existem **não têm** — por isso a caixa degrada sozinha
para só a resposta. Lição nova deve trazer `why`.

## O dia 2 da trilha usa o vocabulário da lição (13/set/2026)

`showGameStep()` roteia o mini 2 para **speed / scramble / typing** in-page
(`id % 3`), todos montados de `currentLesson.vocab`. Antes ele abria um jogo
standalone com lista de palavras própria — nenhum dos jogos lê parâmetro de URL
ou sabe qual é a lição, então o dia 2 era desconexo por construção.

Se for mexer: **não crie jogo novo**. Os painéis que já leem o vocabulário da
lição são `panel-listen`, `panel-typing`, `panel-speed`, `panel-scramble` e
`panel-build`.

## Quiz de IA do modo guiado

`loadAIQuiz()` troca o quiz estático da lição por 5 perguntas de `POST /api/lesson-quiz`. O nível vem de
`nivelDaLicao(lesson)` (faixa de id = curso), a gramática da lição vai junto e o `explain` alimenta a
caixa de feedback. Cache no navegador: `capyAIQuiz_v2_<id>_<data>`; mude o `v2` quando o formato das
perguntas mudar.

Limitação: mesmo pedindo 2 de 5 perguntas de gramática, o modelo tende a perguntar sobre o tema. Se
incomodar, misture 2–3 perguntas estáticas de gramática com 2–3 da IA.

Prompts do site: o público é **brasileiro de 16+**. Descreva os campos do JSON em vez de dar um exemplo
com valores reais — este modelo copia o exemplo (já aconteceu com opções "A/B/C/D"). Rota que responde
um objeto usa o modo JSON da API (`callOpenAI(..., { json: true })`); rota que responde uma lista não pode.

## Custo da ligação por voz

- Voz em tempo real só para o plano Super (`VOZ_MINUTOS_MES`) e para o admin; teto global em dólar no
  mês (`VOZ_TETO_USD_MES`).
- Ao emitir o token (`/api/realtime-token`), o servidor **reserva** `min(minutos restantes, 30 min)`
  numa linha `__voz_<aluno>_<data>_reserva` (`reservarVoz`).
- Ao desligar, o navegador manda `uso` + `duracaoMs` para `/api/conversa-uso` (via `sendBeacon`); o
  servidor **liquida** a reserva com o maior valor entre o relato e o relógio dele desde a emissão
  (`liquidarReservaVoz`). Sem relato, a reserva inteira fica cobrada.
- Preço por token na tabela `PRECO_VOZ` do servidor; o `/api/conversa-feedback` (entrevista) calcula com
  a mesma função (`calcularCustoVoz`).

## Home nova (29/out/2026)

- `6_Home_Forest_Expedition.html` + `assets/js/pages/home.js` (`window.CapyHome`): saudação, 🔥 sequência e ⭐ nível,
  semana (seg-dom), cartão da ligação, plano de hoje e "Continuar o curso". O resto do site foi para "Mais para praticar".
- A semana marca os dias da **sequência atual** (`streakDays` terminando em `lastPracticeDate`); o app não guarda o
  histórico de dias. O ⚡ de créditos da maquete ficou de fora: o `aiUsageLimit` do Store (3) não bate com o servidor (20/dia).
- Cartão da ligação: `teste` (vozTeste disponível, "1ª ligação: 3 min grátis"), `super`, `convite` (teste usado → Super)
  e `normal`. Os dados vêm do evento `capyPlanoHoje` do `plano-hoje-cartao.js` (sem 2º `/api/me`).
  O botão abre `ai_chat.html#ligar`: o telefone pulsa e espera o toque (o navegador exige o gesto para microfone e som).
  Nunca prometer "sem limite" no Super: ele tem `VOZ_MINUTOS_MES`.
- "Continuar o curso" = última aula aberta no `classes.html` (`localStorage.capyUltimaAula`); as aulas não marcam conclusão.
  Aula > 5 para quem é grátis volta para o `classes.html` (paywall).
- Menu de baixo: Início · Trilha · Cursos · Jogos · Mais (Yara AI foi para o Mais). Eventos `home_*` no `/api/track`.

## Plano de hoje e "Pôr na agenda" (29/out/2026)

- `plano-hoje.js` (`window.CapyPlano`) monta 3 tarefas de 5 min **sem IA**: próxima mini-lição da trilha
  (`capyLastMini_en` ou a 1ª incompleta), conversa com a Yara (ligação no Super ou teste grátis; senão chat) e
  revisão (`/api/memory`, `lessons.html?review=1`). O "Meu Plano" semanal com IA continua no `study_plan.html`.
- "Feito" vem de marcas com data gravadas onde a coisa acontece: `capyLastMini_en.at` + mini concluída,
  `capyConversaDia` (`ai_chat.html`) e `capyRevisaoDia` (modo revisão). Nunca de uma foto tirada na home.
- Horário em `Store.state.horarioEstudo` (padrão 19:00). Google: link `calendar.google.com/...&recur=RRULE:FREQ=DAILY`.
  iPhone/Outlook: `GET /api/agenda.ics?hora=HH:MM` (evento diário de 15 min com alarme; só aceita HH:MM).
- O cartão (`assets/js/plano-hoje-cartao.js`) monta tudo por `textContent`.

## Ligação de teste: 3 minutos grátis, uma vez só (28/out/2026)

- Quem não é Super (free e pro) liga **uma vez**, por 3 minutos (`VOZ_TESTE_MIN`), e só com e-mail
  confirmado (`liberarTesteDeVoz` em `api/index.js`). O teto global de US$ é checado antes, para nunca gastar o teste.
- A marca `__vozteste_<aluno>` no `user_state` nasce no 1º token. Dentro desses 3 minutos o aluno religa com o
  que sobrou (até 3 tokens); depois, `403 plano_sem_voz` com `teste: 'usado'` (ou `'confirmar_email'`).
- O token responde `teste: true`, e o `conversa-core.js` desliga quando acabam os minutos liberados (motivo
  `teste` ou `cota`), não só aos 15 min. `/api/me` devolve `vozTeste: 'disponivel' | 'usado'` para a home.


## Google Analytics e aviso de cookies (19/out/2026)

- `analytics.js` entra em toda página pública (`<script src="analytics.js?v=…" defer>` no `<head>`), nunca nas
  páginas endurecidas (login, conta, admin, professor). Página nova pública: copie a tag; um teste falha sem ela.
- Nada do Google carrega antes do "Aceitar" do aviso (LGPD). A escolha fica em `localStorage.capyCookies`, e a
  política (`privacidade.html#cookies`) tem o botão que reabre o aviso.
- O ID fica em `GA_ID` dentro do `analytics.js`. Com o ID provisório, ou fora de `capyenglish.com.br` (Preview,
  localhost), o arquivo não faz nada.
- Os eventos do `capyTrack` vão também para o GA, com o mesmo nome; cliques na Kiwify viram `begin_checkout`, e no
  WhatsApp, `generate_lead`. Nunca mande dado pessoal ao GA: só nome do evento e id da lição.

## Painel do professor e turma (19/out/2026)

- O professor (papel `teacher` ou `admin` no `app_metadata`) abre `professor.html` e manda o link
  `turma.html?c=<código>` aos alunos. O aluno só entra aceitando compartilhar o progresso (LGPD) e sai quando quiser.
- O servidor só devolve alunos de `turma_alunos` do professor da sessão (`requireProfessor`); nunca aceite id de
  professor vindo do navegador. Lição de casa abre só se o aluno é da turma.
- `atividade_diaria` (mini-lições e XP por dia) sai da diferença entre o estado salvo e o anterior no `POST /api/db`
  (`deltaAtividade`), sem nada novo no navegador. SQL: `202610190003_turmas.sql`, antes do código.
- `professor.html` e `turma.html` são páginas endurecidas (CSP estrita): JS em `assets/js/pages/`, só `textContent`.

## Design System

Full spec in `1_Design_System.md`. Key constraints:

- **Font:** Plus Jakarta Sans (400–900) via Google Fonts
- **Navy** `#001f3f` — hero backgrounds, deep containers
- **Pink** `#ec4899` — CTAs, active state, energy
- **Green** `#10b981` — success, forest theme
- **No 1px borders** — separate sections via background color shifts only
- **No yellow** — use `error` `#ba1a1a` for warnings
- **Rounded:** `3rem` for top-level containers, `1.5rem` for nested items
- **Hero gradient:** `bg-gradient-to-br from-navy via-violet-950 to-[chapter-accent]`
- **Glassmorphism nav:** surface @ 70% opacity + `backdrop-blur-[20px]`
- **Buttons:** `border-radius: 9999px`, `scale(0.98)` on press

Chapter accent colors (hero gradients):
| Chapter | Colors |
|---|---|
| 1 — Beginner | `from-emerald-600 to-emerald-500` |
| 2 — Elementary | `from-blue-600 to-blue-500` |
| 3 — Pre-Intermediate | `from-violet-600 to-violet-500` |
| 4 — Intermediate | `from-amber-600 to-amber-500` |

## Existing Aula Files

Present: `aula_01` – `aula_44` (**44 lessons total**). All lessons are available and linked in `classes.html`.


All 44 aulas have a homework tab (new, old and communicative templates).

## Homework Tab Pattern (standard for all aula pages)

Every aula page must include a `📋 Homework` tab as the **last tab**, after `🗣️ Speak`. Homework takes 10–15 minutes and is based on the lesson content. **All 44 aulas already have homework** — this section is for creating new aulas.

### Adding Homework to a new aula

**1. Tab button** — append after the Speak button in the sticky tab bar:
```html
<button class="tab-btn px-5 py-4 text-sm text-slate-500 whitespace-nowrap" data-tab="homework">📋 Homework</button>
```

**2. Content div** — place after the Speak section:
```html
<div id="tab-homework" class="fade-in hidden">
  <!-- Amber header banner -->
  <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-6 text-white">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-2xl font-black mb-1">📋 Homework</h2>
        <p class="text-white/80 text-sm">Aula XX — [Lesson Title]</p>
      </div>
      <div class="bg-white/20 rounded-full px-4 py-2 text-sm font-black">⏱️ 10–15 min</div>
    </div>
  </div>
  <!-- task cards, then submit button -->
  <button onclick="submitHomeworkXX()" class="mt-6 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-4 rounded-2xl hover:scale-105 transition-all shadow-sm text-base">
    ✓ Submit Homework &nbsp;+75 XP
  </button>
  <div id="hw-done-XX" class="hidden mt-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
    <div class="text-3xl mb-2">🏆</div>
    <p class="font-black text-emerald-700">Homework complete! +75 XP earned!</p>
    <a href="aula_YY.html" class="mt-3 inline-block bg-emerald-500 text-white font-black px-6 py-2.5 rounded-full hover:scale-105 transition-all text-sm">Continue to Aula YY →</a>
  </div>
</div>
```

**3. Script — NEW template** (standalone, no lesson-engine.js):
```js
function submitHomeworkXX() {
  markSection('homework');  // ← NEW template: pass section name
  Store.addXP(75);
  document.getElementById('hw-done-XX').classList.remove('hidden');
  event.target.disabled = true;
}
// Update SECTIONS array to include 'homework'
const SECTIONS = ['vocab','expressions','grammar','practice','speak','homework'];
```

**3. Script — OLD template** (uses lesson-engine.js / `initLesson`):
```js
function submitHomeworkXX() {
  markSection();           // ← OLD template: NO args
  Store.addXP(75);        // ← must call SEPARATELY
  document.getElementById('hw-done-XX').classList.remove('hidden');
  event.target.disabled = true;
}
// Add to initLesson call:
initLesson({
  tabs: ['vocab','expressions','grammar','practice','speak','homework'], // add 'homework'
  totalSections: 6, // increment by 1 from previous
  ...
});
```

### Homework interactive task types (use 4–5 per lesson)

**1. Word Order (Duolingo-style)** — shuffle word tiles, drag/tap to reconstruct a sentence.
```js
const WO_DATA = [
  { s: 'I will achieve my goals this year', w: ['I','will','achieve','my','goals','this','year'] },
  ...
];
const wo = WO_DATA.map(d => ({ ans:[], bank: shuffle(d.w) }));
// wo[i].ans = built sentence, wo[i].bank = remaining tiles
// woRender() → click tile to move between bank↔ans
// woCheck(i) → compare ans.join(' ').toLowerCase() to s.toLowerCase()
// woReset(i) → restore bank, clear ans
```

**2. Match Pairs** — two columns; tap left then right to connect pairs.
```js
const MP = [
  { l:'GET UP ⬆️', r:'Levantar da cama' },
  ...
];
const mpR = shuffle(MP.map((p,i) => ({ label:p.r, pid:i })));
let mpSelL = null; const mpDone = new Set();
// mpClickL(i) → sets mpSelL
// mpClickR(i) → if mpR[i].pid === mpSelL, add to mpDone
// Wrong match: flash red border for 700ms then reset
```

**3. Error Correction** — show sentence with underlined error; student rewrites in `<input>`.
```js
const ERR_CHECKS = [
  v => v.includes('correct form') && !v.includes('wrong form'),
  ...
];
const ERR_HINTS = ['wrong form → correct form (reason)'];
function checkErrors() {
  const v = input.value.toLowerCase().replace(/[?.!,]/g,'').trim();
  if (check(v)) show '✅ Correto!'; else show `❌ Dica: "${hint}"`;
}
```

**4. Multiple-choice identification** — radio buttons per scenario (e.g. WILL use identification).
```js
// Build with WILL_USES array: { sentence, opts[], ans }
// Radio inputs name="will-use-{i}", check on button click
```

**5. Fill-in-blank** — inline `<input>` with `data-ans` attribute; verify on button click.
```js
document.querySelectorAll('.fill-check').forEach(inp => {
  const correct = inp.value.toLowerCase().trim() === inp.dataset.ans;
});
```

**6. Free writing (always last)** — `<textarea>` for open-ended composition. Submit button calls `submitHomework{N}()`.

### XP rewards
- Practice quiz completion: **+50 XP**
- Dialogue read button: **+20 XP**
- Homework submission: **+75 XP**

---

## API endpoints (`api/index.js`)

Source of truth: the `if (req.method === … && url === …)` blocks in `api/index.js`.

- **Auth:** `POST /api/auth/signup | login | logout | guest | magic-link | request-reset | set-password`,
  `GET /api/auth/session`, `GET /api/auth/callback`, `GET /api/auth/mfa/status`,
  `POST /api/auth/mfa/enroll | verify`.
- **Student data (session):** `/api/db` (state), `/api/profile`, `/api/me`, `/api/homework`,
  `POST /api/track`, `GET /api/db/leaderboard` (public, names without markup).
- **AI (per-plan limits, `AI_ROUTE_KEYS`):** `/api/chat`, `/api/lesson-chat`, `/api/quiz`,
  `/api/lesson-quiz`, `/api/translate`, `/api/story`, `/api/flashcard-deck`, `/api/dialogue-scene`,
  `/api/word-of-day`, `/api/daily-challenge`, `/api/newsline`, `/api/historyline`,
  `/api/youtube`, `/api/personalize`, `/api/correct-writing`, `/api/study-plan`, `/api/music`,
  `/api/lyrics-search`, `/api/lyrics`, `/api/transcribe`, `GET /api/tts`.
- **Voice:** `POST /api/realtime-token`, `/api/conversa-uso`, `/api/conversa-feedback`, `GET /api/personas`.
- **Admin (admin session, aal2 with `ADMIN_REQUIRE_MFA=true`):** `/api/admin/*` — overview, students,
  courtesies, grant-plan, revoke-plan, login-link, set-password, broadcast, campaign, funnel, voz,
  brief, stats, gpstronic-results, email-test.
- **Server-to-server:** `POST /api/kiwify-webhook` (HMAC signature in `?signature=` or header);
  crons `GET /api/send-reminders` and `GET /api/teacher-brief` (`Authorization: Bearer $CRON_SECRET`).
