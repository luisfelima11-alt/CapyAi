// Botão "Tela cheia" para dar aula no projetor/TV (pedido do Luis, 01/nov/2026).
// Só nas aulas dos cursos GPS Tronic e Agro English:
//   <script src="tela-cheia.js?v=tc1"></script>
// Põe a página inteira em tela cheia, sem mudar o tamanho do texto. Sai pelo
// mesmo botão ou pelo Esc. É um botão flutuante no canto inferior esquerdo, em
// todas as aulas: a barra de passos (Índice ‹ ›) fica escondida atrás do menu
// fixo do topo quando a página rola, então um botão nela sumiria junto.
// Em navegador sem a API de tela cheia (Safari do iPhone) o botão não aparece.
// Montado só com createElement e textContent.
(function () {
    var doc = document;
    var pode = doc.fullscreenEnabled || doc.webkitFullscreenEnabled;
    if (!pode) return;

    function emTelaCheia() {
        return !!(doc.fullscreenElement || doc.webkitFullscreenElement);
    }
    function entrar() {
        var raiz = doc.documentElement;
        var p = raiz.requestFullscreen ? raiz.requestFullscreen() : raiz.webkitRequestFullscreen && raiz.webkitRequestFullscreen();
        if (p && p.catch) p.catch(function () {});
    }
    function sair() {
        var p = doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen && doc.webkitExitFullscreen();
        if (p && p.catch) p.catch(function () {});
    }

    var SVG = 'http://www.w3.org/2000/svg';
    // Cantos para fora (entrar) e para dentro (sair).
    var DESENHO = {
        entrar: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5',
        sair: 'M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5'
    };
    function icone() {
        var s = doc.createElementNS(SVG, 'svg');
        s.setAttribute('viewBox', '0 0 24 24');
        s.setAttribute('width', '18');
        s.setAttribute('height', '18');
        s.setAttribute('fill', 'none');
        s.setAttribute('stroke', 'currentColor');
        s.setAttribute('stroke-width', '2.4');
        s.setAttribute('stroke-linecap', 'round');
        s.setAttribute('stroke-linejoin', 'round');
        s.setAttribute('aria-hidden', 'true');
        var p = doc.createElementNS(SVG, 'path');
        s.appendChild(p);
        return { svg: s, path: p };
    }

    function montar() {
        if (doc.getElementById('tela-cheia-btn')) return;
        var btn = doc.createElement('button');
        btn.type = 'button';
        btn.id = 'tela-cheia-btn';
        var ic = icone();
        var texto = doc.createElement('span');
        btn.appendChild(ic.svg);
        btn.appendChild(texto);

        // No celular só o ícone (o texto aparece a partir de 640 px).
        btn.className = 'fixed z-40 left-4 md:left-28 bottom-24 md:bottom-6 flex items-center gap-1.5 bg-white/95 backdrop-blur border-2 border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 font-black text-xs px-3 py-2.5 rounded-full shadow-sm transition-colors';
        texto.className = 'hidden sm:inline';
        doc.body.appendChild(btn);

        function atualizar() {
            var on = emTelaCheia();
            ic.path.setAttribute('d', on ? DESENHO.sair : DESENHO.entrar);
            texto.textContent = on ? 'Sair da tela cheia' : 'Tela cheia';
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
            btn.setAttribute('aria-label', on ? 'Sair da tela cheia' : 'Tela cheia');
            btn.title = on ? 'Sair da tela cheia (Esc)' : 'Tela cheia, para dar a aula no projetor';
        }
        btn.addEventListener('click', function () { emTelaCheia() ? sair() : entrar(); });
        doc.addEventListener('fullscreenchange', atualizar);
        doc.addEventListener('webkitfullscreenchange', atualizar);
        atualizar();
    }

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', montar);
    else montar();
})();
