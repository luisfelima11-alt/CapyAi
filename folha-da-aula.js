// Cartão "Folha da aula" no fim do Homework (regra do Luis, 12/out/2026).
// Cada aula carrega este arquivo com o caminho do próprio PDF:
//   <script src="folha-da-aula.js?v=fa1" data-pdf="assets/pdf/<slug>-folha.pdf"></script>
// O PDF sai de scripts/gera-folha-aula.mjs. Montado só com textContent.
(function () {
    var script = document.currentScript;
    var pdf = script && script.getAttribute('data-pdf');
    if (!pdf || !/^assets\/pdf\/[a-z0-9_]+-folha\.pdf$/.test(pdf)) return;

    function el(tag, classe, texto) {
        var n = document.createElement(tag);
        if (classe) n.className = classe;
        if (texto) n.textContent = texto;
        return n;
    }

    function montar() {
        var destino = document.getElementById('tab-homework');
        if (!destino || document.getElementById('folha-da-aula')) return;

        var card = el('div', 'bg-white border-2 border-slate-200 rounded-2xl p-5 mt-6 mb-4');
        card.id = 'folha-da-aula';

        var topo = el('div', 'flex items-start gap-3 mb-4');
        topo.appendChild(el('span', 'text-3xl leading-none', '📄'));
        var textos = el('div');
        textos.appendChild(el('p', 'font-black text-navy text-base', 'Folha da aula'));
        textos.appendChild(el('p', 'text-slate-500 text-sm mt-1',
            'Uma página para imprimir e acompanhar a aula: o vocabulário, os padrões e espaço para as suas frases e anotações.'));
        topo.appendChild(textos);
        card.appendChild(topo);

        var baixar = el('a', 'inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-navy text-white font-black px-6 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-transform',
            'Baixar PDF para imprimir');
        baixar.href = pdf;
        baixar.setAttribute('download', pdf.split('/').pop());
        card.appendChild(baixar);

        var abrir = el('a', 'block mt-3 text-sm font-bold text-slate-500 underline', 'ou abrir no navegador');
        abrir.href = pdf;
        abrir.target = '_blank';
        abrir.rel = 'noopener';
        card.appendChild(abrir);

        destino.appendChild(card);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
    else montar();
})();
