/* Cartão "Seu plano de hoje" (study_plan.html; a home nova reusa no PR 3).
 * Tudo por textContent: título e detalhe vêm de dados do aluno (nome de lição). */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!$('plano-hoje') || !window.CapyPlano) return;

  function atualizarAgenda() {
    const h = CapyPlano.horario();
    $('ph-hora').value = h;
    $('ph-google').href = CapyPlano.linkGoogle(h);
    $('ph-ics').href = CapyPlano.linkIcs(h);
  }

  async function desenhar() {
    const p = await CapyPlano.hoje();
    $('ph-resumo').textContent = `${p.feitos} de ${p.itens.length} · ${p.minutos} min`;
    const ul = $('ph-itens');
    ul.textContent = '';
    for (const it of p.itens) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = it.href;
      a.className = 'flex items-center gap-3 py-3';
      const ck = document.createElement('span');
      ck.className = 'w-6 h-6 rounded-full grid place-items-center text-xs font-black flex-none ' + (it.feito ? 'bg-emerald-500 text-white' : 'bg-white');
      ck.textContent = it.feito ? '✓' : '';
      ck.setAttribute('aria-label', it.feito ? 'feito' : 'a fazer');
      const t = document.createElement('span');
      t.className = 'flex-1';
      const tt = document.createElement('span');
      tt.className = 'block text-sm font-bold ' + (it.feito ? 'text-slate-400 line-through' : 'text-navy');
      tt.textContent = it.titulo;
      const d = document.createElement('small');
      d.className = 'block text-xs font-semibold text-slate-500';
      d.textContent = it.detalhe;
      t.append(tt, d);
      const m = document.createElement('span');
      m.className = 'text-xs font-black text-slate-500';
      m.textContent = `${it.min} min`;
      a.append(ck, t, m);
      li.appendChild(a);
      ul.appendChild(li);
    }
  }

  $('ph-hora').addEventListener('change', e => { if (CapyPlano.salvarHorario(e.target.value)) atualizarAgenda(); });
  atualizarAgenda();
  desenhar();
})();
