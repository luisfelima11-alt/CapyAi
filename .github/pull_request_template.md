## O que muda
<!-- Para o aluno e para o Luis, em 2–4 linhas. -->

## Por quê
<!-- Se for bug: a causa raiz, e se ela entrou no BUGS-APRENDIDOS.md. -->

## Como testei
<!-- Comandos e resultados. A suíte roda com PLAYWRIGHT_BROWSERS_PATH apontando para o Chromium. -->

## SQL
<!-- "Não precisa" ou o arquivo em supabase/migrations/. Quem roda na produção é a sessão mestre, antes do merge. -->

## O aluno vê?
<!-- "Não" ou o que olhar no Preview (página e passo a passo). Se o aluno vê, a mudança espera o ok do Luis. -->

## Riscos e conflitos
<!-- Arquivos compartilhados que o PR mexe (components.js, store.js, auth-secure.js, api/index.js, etiquetas ?v=) e outros PRs abertos que mexem neles. -->

## Checklist
- [ ] O ramo saiu da `sync/estado-producao` e o PR aponta para ela
- [ ] `npm run test:security` e os testes do que mudou passam
- [ ] Segue as regras do CLAUDE.md: sem "gramática"/"grammar" para o aluno, folha em PDF na aula nova, jogo novo no `game-celebra.js`, regras de segurança
- [ ] Não publiquei nem rodei SQL na produção: isso é da sessão mestre
