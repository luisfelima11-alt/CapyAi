# Bugs aprendidos — Capy Yara English

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

**Correcao:** `<script src="auth-secure.js?v=c52d7db"></script>` antes do
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
**Correção:** inserida `<script src="auth-secure.js?v=c52d7db"></script>` imediatamente
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
`<script src="auth-secure.js?v=c52d7db"></script>` imediatamente antes de `store.js`,
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
**Correção:** `<script src="auth-secure.js?v=...">` antes do `store.js` em
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
