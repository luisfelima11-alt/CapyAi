// Atalho para a Preparação de aula: preenche o <a id="prep-atalho"> da home e
// das páginas de curso com a próxima aula a preparar.
//   data-curso="agro"  → o atalho é desse curso (página do curso);
//   sem data-curso     → o curso preferido entre os que o aluno estuda (home).
// Na home ele só aparece para quem já estuda um curso com Preparação (aula feita
// ou preparação feita); com data-sempre (página do curso) aparece para todos.
(function () {
  'use strict';
  const el = document.getElementById('prep-atalho');
  if (!el || !window.CapyPrep) return;
  const P = window.CapyPrep;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  P.carregarCursos().then(dados => {
    const cursos = dados.cursos || [];
    const sempre = el.hasAttribute('data-sempre');
    const pedido = el.dataset.curso;
    const curso = pedido ? cursos.find(c => c.id === pedido)
      : sempre ? cursos[0]                                   // página de curso antiga, sem data-curso: o primeiro
      : P.cursoPreferido(cursos.filter(c => P.estuda(c)));
    if (!curso || !(curso.aulas || []).length) return;
    if (!sempre && !P.estuda(curso)) return;

    let href, titulo, sub;
    if (!P.sabeAProxima(curso)) {
      // A Preparação começa no meio do curso e o aluno ainda não chegou lá: leva à lista.
      const aulas = curso.aulas;
      href = `preparacao.html?curso=${encodeURIComponent(curso.id)}`;
      titulo = `Preparação das aulas ${aulas[0].num} a ${aulas[aulas.length - 1].num}`;
      sub = `${esc(curso.bandeira)} ${esc(curso.nome)} · ${aulas[0].minutos} min por aula`;
    } else {
      const prox = P.proxima(curso, P.concluidas(curso), P.feitas());
      if (!prox) return;
      const alvo = prox.preparada && prox.seguinte ? prox.seguinte : prox.aula;
      href = `preparacao.html?aula=${encodeURIComponent(alvo.aula)}`;
      titulo = prox.preparada
        ? (prox.seguinte ? `✓ Pronto para a aula ${prox.aula.num} · adiantar a aula ${alvo.num}` : `✓ Pronto para a aula ${prox.aula.num}`)
        : `Prepare a próxima aula ${curso.naFrase || 'de ' + curso.nome}`;
      sub = `${esc(curso.bandeira)} Aula ${alvo.num} · ${esc(alvo.titulo)} · ${alvo.minutos} min`;
    }
    el.href = href;
    el.querySelector('[data-prep-titulo]').textContent = titulo;
    el.querySelector('[data-prep-sub]').innerHTML = sub;
    // Escondido pela classe `hidden` do Tailwind (o atributo hidden perde para `flex`).
    el.classList.remove('hidden');
    el.classList.add(el.dataset.mostrar || 'block');
  }).catch(() => { /* sem dados: o atalho fica escondido */ });
})();
