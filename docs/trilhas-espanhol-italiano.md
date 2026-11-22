# Trilhas diárias — espanhol e italiano

Primeira etapa A1: oito unidades por idioma, quatro mini-lições por unidade.

- Espanhol: `learn.html?lang=es`, IDs 901–908, capítulos 100–101.
- Italiano: `learn.html?lang=it`, IDs 1001–1008, capítulos 200–201.
- Cada unidade: 10 entradas de vocabulário com tradução, 3 expressões com exemplos, 6 frases, explicações e tabela de padrões, 5 perguntas de múltipla escolha e 4 frases de fala.
- Mini 1: escuta e quiz; mini 2: jogo com o vocabulário da unidade; mini 3: montagem de frases e fala; mini 4: conversa com a Yara.

## Separação e limites

As conclusões usam as chaves do Store já existentes: `es:901_1`, `it:1001_1` etc. Retomada, passos e conclusão da unidade também usam o idioma. XP e streak continuam sendo os totais da conta. Nenhuma migração de banco, alteração de login ou mudança de cota/plano foi feita.

O teste de nível de inglês continua disponível para inglês; não é exigido para entrar nas outras trilhas. O resultado de inglês não é sobrescrito. As novas trilhas mostram seu próprio rótulo A1.

O desafio de capítulo e os desvios de notícias/música/história que ainda são específicos de inglês não aparecem nestas duas primeiras trilhas. A revisão global que mistura idiomas também não é apresentada nestes mapas. As 32 mini-lições de cada idioma usam conteúdo próprio.

## Construção e expansão

Fontes: `lessons_es_data.js` e `lessons_it_data.js`.

Após editar:

1. Rodar `node scripts/build-lesson-data.js`. Gera os JSON individuais, o índice e o catálogo leve `trail-language-catalog.js`. Não apaga as unidades anteriores.
2. Rodar `node scripts/gera-contexto-aulas.js`. Gera os materiais canônicos que a Yara recebe no servidor, inclusive `trilha_es` e `trilha_it`.
3. Atualizar os nomes de blocos no gerador ao acrescentar unidades. As faixas de capítulos foram afastadas para permitir expansão sem misturar idiomas.
4. A primeira etapa de ES/IT está fixada em iniciante no chat da mini-lição; ao lançar etapas B1/B2, revisar essa seleção de nível.

Áudio: mapas es-ES e it-IT, com pedidos de leitura nativa no serviço de voz e fallback do navegador no mesmo idioma. Números escritos e transcritos como dígitos são normalizados na prática de fala. Referência: [documentação de voz da OpenAI](https://developers.openai.com/api/docs/guides/text-to-speech).

## Verificação

- `node --test tests/romance-trails.test.js tests/romance-api.test.js`
- `node tests/romance-trails.e2e.js` com Playwright e Chromium instalados.
- Testes de regressão: francês, turco, microfone, streak, contextos das aulas e segurança.

O teste de navegador usa somente perfil, transcrição e IA fictícios. Verifica os quatro tipos de mini-lição, os 16 conteúdos, navegação, idioma do áudio/microfone/chat, conclusão sem misturar idiomas e layout de 320 px.
