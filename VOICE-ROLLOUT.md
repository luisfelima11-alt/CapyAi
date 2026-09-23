# Ligação com IA — implementação e validação

## Escopo

- Reaproveitar conversa.html, entrevista.html e o motor conversa-core.js iniciado no projeto.
- Entrada pelo botão de telefone do ai_chat.html.
- Microfone somente após ação de Ligar e autorização do navegador; áudio enviado à OpenAI, com aviso antes da chamada.
- Um motor compartilhado: conexão, cancelamento pendente, silenciar, desligar, liberação do microfone e tratamento de falhas.
- Servidor gera credencial temporária sem enviar a chave principal ao navegador; transcrição habilitada para permitir devolutiva.

## Segurança e limites

- Manter autenticação/CSRF e cotas existentes. Não alterar planos comerciais nesta entrega.
- Credenciais temporárias expiram em 60 segundos, mas isso NÃO encerra uma sessão já aberta nem garante uso único.
- Limites no navegador são uma proteção de experiência, não controle antifraude ou faturamento autoritativo.
- Estimativas de custo são diagnósticas; não representam cobrança ao aluno nem fatura verificada.
- Não gravar microfone real durante testes automatizados. Simular mídia, conexão e respostas da API.

## Verificação

1. `node --test tests/realtime-voice.test.js` — 44 testes: núcleo, porteiro de cota, personas por nível, palavras fracas, sanitização de prompt, e as páginas reais em mobile e desktop com microfone e transporte simulados.
2. node --test tests/security.test.js
3. Navegador: conversa e entrevista em desktop/mobile, iniciar, silenciar, cancelar pendente, encerrar; verificar liberação das faixas de áudio.
4. Produção: publicar apenas com autorização para o conjunto de arquivos locais; conferir CSP permitindo https://api.openai.com e configuração OPENAI_API_KEY no servidor.
5. Teste humano após publicação: usuário permite o próprio microfone, confirma ouvir a resposta, interrompe a fala, silencia e encerra. Testes simulados não comprovam qualidade/latência do áudio real.

## Entregue

### 19/set — a ligação passou a funcionar e passou a ter freio

- **CSP**: `connect-src` não listava `https://api.openai.com`. O token saía 200 e o
  passo seguinte (`fetch` para `api.openai.com/v1/realtime/calls`) morria no navegador.
  Enquanto isso não foi corrigido, a voz **nunca** funcionou em produção.
- **Custo gravado sempre**: `POST /api/conversa-uso` por `sendBeacon`, em todo
  desligamento, inclusive quando o aluno fecha a aba. Linha `__voz_<id>_<ISO>`,
  append-only. `GET /api/admin/voz` agrega por mês e por aluno.
- **Porteiro**: login obrigatório → plano (`VOZ_MINUTOS_MES`) → teto global de USD
  → cota individual. Admin passa sempre. Falha de leitura do consumo **libera** a
  ligação: derrubar aluno pagante por erro nosso de leitura é pior do que deixar
  passar uma chamada, e o teto global segura o pior caso.
- **Limite de chamada de 20 para 15 min**: uma simulação de entrevista real dura
  10–15 min, e 20 min estourava o dobro da cota mensal que a landing vende.
- **Nível do aluno**: `user_profiles.english_level` lido do BANCO. Iniciante abre a
  conversa em português e migra aos poucos; na entrevista o recrutador segue em
  inglês mas dá uma frase de enquadramento antes. Sem nível no perfil, calibra na
  primeira fala.

### 20/set — o front-end e o contexto

- **Transcrição progressiva**: o núcleo escutava 9 tipos de evento e descartava o
  resto **em silêncio**. Passou a escutar os três deltas de transcrição. A armadilha
  é que o `response.done` já insere a fala inteira: sem tratar, o texto aparece duas
  vezes. Cada turno tem uma "linha viva" chaveada por `item_id`, e o `.done`
  **finaliza** essa linha em vez de criar outra. Modelo que não manda delta continua
  funcionando pelo `.done`.
- **Palco nas duas páginas**: `entrevista.html` recorta por CSS a ilustração que já
  existia (`assets/img/interview01-dialogue.jpg`) — nenhum arquivo novo;
  `conversa.html` mostra o `yara-chat.mp4`, que **só entra na rede quando a chamada
  conecta** (`preload="none"` + `HEAD` antes + poster de 45 KB gerado pelo
  `scripts/gera-arte-persona.js`). Medido: 69 KB antes do primeiro clique.
- **Os 7 estados ganharam movimento próprio** (antes "você falando" e "ele falando"
  eram a mesma tela parada com bolinha de outra cor), medidor de voz por
  `AnalyserNode` sobre o microfone real, legenda grande, cronômetro e **minutos
  restantes** — que o `/api/realtime-token` já devolvia e ninguém mostrava.
- **Contexto do aluno**: as palavras que ele erra (`mem_<id>`) entram na persona. A
  Yara puxa duas ou três e corrige de leve; o recrutador usa só para escolher o
  assunto das perguntas, sem virar professor.
- **`vocab` sanitizado**: entrava no prompt com `String(v).slice()` cru. Agora passa
  pelo `textoParaPrompt()` como o resto.

### O que ainda depende de teste humano

Nenhum teste automatizado prova latência, qualidade do áudio, ou que a transcrição
cresce **durante** a fala sem duplicar no fim. Isso precisa de uma ligação real, nos
dois sentidos (fala do aluno e da IA). O caminho autenticado do
`/api/realtime-token` também só roda com uma conta de verdade: sem sessão ele
responde 401 antes de chegar na persona.

---

## Fase 5 — os clipes, quando o Higgsfield destravar

O palco das duas páginas já funciona com imagem parada. Os clipes trocam o
`<img>`/`<video>` do palco e nada mais — nenhuma mudança de lógica.

### O bloqueio real é um só

O conector do Higgsfield precisa ser **autorizado pelo Luis** nas configurações de
conector do claude.ai. Sessão não-interativa não faz OAuth.

**O segundo "bloqueio" não existia.** O plano dizia que Element `b36e13b8…` (memória)
e Soul `f5dc782c-…` (skill) estavam em conflito. Não estão: são mecanismos diferentes
do Higgsfield para a MESMA Yara, e quem escolhe é o modelo.

| Modelo | Referência que aceita |
|---|---|
| `nano_banana_2`, `nano_banana_pro` | **Element** `b36e13b8-6e8e-4e1f-b558-4e9d25715b4d` |
| `soul_2` | **Soul ID** `f5dc782c-8282-45d6-820a-d11d6320e4cc` (param top-level) |

Passar o Soul no `nano_banana_2` responde *"Media input not found"* — é erro de API,
não capivara errada. Os IDs a evitar seguem sendo Element `946a8046` (capelina de
palha) e Soul `5bbe2713` (treinado errado).

⚠️ **O recrutador não tem Element nem Soul.** Ele só existe nas 8 ilustrações
`assets/img/interviewNN-dialogue.jpg`. O clipe dele sai de image-to-video a partir de
uma delas — ou de uma referência nova, que é outro custo e outra aprovação.

### Conjunto mínimo: 3 estados por personagem

Ocioso, falando, escutando. Três cobrem a ilusão; mais que isso é custo sem retorno
percebido. O prompt segue as 3 regras da memória do projeto — Element primeiro,
`3D Pixar style animation render, NOT photorealistic`, e **nunca** descrever chapéu
ou óculos (descrever compete com a referência em vez de reforçá-la).

### Regras de publicação que já morderam o projeto duas vezes

1. **Root, não `assets/`.** O `builds` do `vercel.json` é lista branca: `*.mp4` está
   liberado **só na raiz**. Não existe `assets/**/*.mp4`, e `.webm` não está liberado
   em lugar nenhum — um vídeo em `assets/` volta 200 com HTML no corpo, em silêncio.
   Os 7 vídeos que já existem estão todos na raiz.
2. **Versão no nome do arquivo.** O `sw.js` faz cache-first de `.mp4`/`.jpg` partindo
   do princípio de que "asset muda de nome quando muda". Regravar pedindo o mesmo
   nome deixa o aluno com o clipe velho para sempre — foi o incidente do
   `/icon-192.png`. Use `yara-fala-v1.mp4`; a v2 vira arquivo novo.
   (As artes das personas já seguem essa regra: `yara-quadrado-v1.jpg`,
   `yara-travel-v1.jpg`, `yara-business-v1.jpg`.)
3. **Peso.** Os clipes de comemoração têm 55–104 KB a 440×440. Esse é o alvo — não
   os 3,8 MB do `yara-chat.mp4`, que só é tolerável porque carrega depois do clique.
4. **Movimento reduzido.** O `ligarVideo()` da `conversa.html` já não carrega nada
   quando `prefers-reduced-motion: reduce` está ligado. Qualquer clipe novo entra
   pelo mesmo caminho — não repetir o `streak-overlay.js`, que não pausa o vídeo.
5. **Custo.** Regra do projeto: pedir permissão com o valor antes de gerar.

---

## Configuração

OPENAI_API_KEY é necessária para voz mesmo quando o chat usa OpenRouter. OPENAI_REALTIME_MODEL pode sobrescrever o modelo configurado no servidor; não trocar silenciosamente.
