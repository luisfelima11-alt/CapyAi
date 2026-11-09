// Atalho para a Preparação de aula: preenche o <a id="prep-atalho"> da home e
// da página do curso de francês com a próxima aula a preparar.
// Na home ele só aparece para quem já estuda francês (aula feita ou preparação
// feita); com data-sempre (página do curso) aparece para todos.
(function () {
  'use strict';
  const el = document.getElementById('prep-atalho');
  if (!el || !window.CapyPrep) return;
  const P = window.CapyPrep;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  P.carregarCursos().then(dados => {
    const curso = (dados.cursos || [])[0];
    if (!curso) return;
    const nums = P.concluidas(curso), prep = P.feitas();
    const estuda = nums.length > 0 || Object.keys(prep).some(k => curso.aulas.some(a => a.aula === k));
    if (!estuda && !el.hasAttribute('data-sempre')) return;
    const prox = P.proxima(curso, nums, prep);
    if (!prox) return;
    const alvo = prox.preparada && prox.seguinte ? prox.seguinte : prox.aula;
    const titulo = prox.preparada
      ? (prox.seguinte ? `✓ Pronto para a aula ${prox.aula.num} · adiantar a aula ${alvo.num}` : `✓ Pronto para a aula ${prox.aula.num}`)
      : `Prepare a próxima aula de ${curso.nome.toLowerCase()}`;
    el.href = `preparacao.html?aula=${encodeURIComponent(alvo.aula)}`;
    el.querySelector('[data-prep-titulo]').textContent = titulo;
    el.querySelector('[data-prep-sub]').innerHTML = `${esc(curso.bandeira)} Aula ${alvo.num} · ${esc(alvo.titulo)} · ${alvo.minutos} min`;
    // Escondido pela classe `hidden` do Tailwind (o atributo hidden perde para `flex`).
    el.classList.remove('hidden');
    el.classList.add(el.dataset.mostrar || 'block');
  }).catch(() => { /* sem dados: o atalho fica escondido */ });
})();
