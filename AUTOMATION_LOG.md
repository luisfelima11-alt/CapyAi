# Automation Log

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

