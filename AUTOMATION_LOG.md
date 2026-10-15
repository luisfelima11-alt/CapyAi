# Automation Log

## [2026-09-28T00:00:00-04:00] — SUCESSO
- Capítulo: 36 "Global English & Register"
- Lições criadas: 111 "British, American & Australian English", 112 "Formal vs Informal Register"
- Validação: todas passaram (sintaxe 3+2 blocos <script> via new Function; ids únicos em TRAIL/CHAPTERS/índice (248 lições); paridade TRAIL<->data/lessons EN 112 lições; TRAIL_GAMES cobre 111/112; schema exato 4/30/4/8/4 regras/4 linhas/5 quiz (com `why`)/5 speak; resposta do quiz dentro das opções; títulos inéditos; zero mojibake; dev-server na porta 8791 respondeu 200 em learn.html, lessons.html e nos JSON novos; lição 111 abriu no navegador com o conteúdo certo; servidor encerrado pelo PID)
- Deploy: publicado em produção, confirmado (www e apex servem os novos títulos; lessons.html com ?v=en112). NOTAS: (1) a arquitetura mudou — as lições EN agora são data/lessons/<id>.json + `node scripts/build-lesson-data.js`, não mais JADSON_LESSONS no lessons.html; (2) seguido o ritual novo do CLAUDE.md: `vercel promote` depois do deploy — crons conferidos com host = deploy novo e undeployed = []; (3) outra sessão tinha publicado 8 min antes o próprio working tree com WIP não commitado (components.js?v=nav320 em ~200 HTMLs); o deploy saiu da pasta inteira, então leva esse WIP junto, igual ao que já estava no ar. As mudanças desta rodada NÃO foram commitadas.
---

## [2026-08-13T11:45:00-04:00] — SUCESSO
- Capítulo: 34 "Digital Storytelling & Media"
- Lições criadas: 107 "Content Creation & Influencer English", 108 "Podcasting & Video Scripts"
- Validação: todas passaram (sintaxe 3+2 blocos via new Function, IDs únicos sem colisão com FR 201+/GPS 301+/TR, paridade TRAIL<->JADSON_LESSONS 108 lições EN, TRAIL_GAMES cobre 107/108, schema exato 4 verbs/30 vocab/4 expressions/8 sentences/4 grammar rows/5 quiz/5 speak, temas inéditos, zero mojibake, dev-server respondeu 200 em learn.html e lessons.html)
- Deploy: publicado em produção, confirmado (novos títulos presentes em www.capyenglish.com.br/learn.html e /lessons.html). NOTA: mesmo problema do log anterior — `vercel --prod --force` NÃO reaponta o domínio custom; foi necessário rodar `vercel alias set <deployment-url> www.capyenglish.com.br` e o mesmo para o apex capyenglish.com.br.
---

## [2026-07-23T00:00:00-04:00] — SUCESSO
- Capítulo: 22 "Academic & Legal English"
- Lições criadas: 101 "Academic English & Essay Writing", 102 "Legal English for Everyday Life"
- Validação: todas passaram (sintaxe 3+2 blocos, IDs únicos, paridade TRAIL<->JADSON_LESSONS 102 lições, TRAIL_GAMES ok, schema 4 verbs/30 vocab/4 expressions/8 sentences/4 grammar rows/5 quiz/5 speak, sem duplicidade de título, zero mojibake, dev-server respondeu 200 em learn.html e lessons.html)
- Deploy: publicado em produção, confirmado (www.capyenglish.com.br/learn.html e lessons.html contêm os novos títulos; alias de domínio precisou ser reapontado manualmente para o novo deployment via `vercel alias set`, pois `vercel --prod --force` não atualizou www.capyenglish.com.br/capyenglish.com.br automaticamente — ficaram presos a um deployment de 73 dias atrás)
---

