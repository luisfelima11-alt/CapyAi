// ════════════════════════════════════════════════════════════════════════════
// game-celebra.js — a mesma comemoração da trilha, no fim dos jogos
// ════════════════════════════════════════════════════════════════════════════
// Os jogos davam XP e a tela não reagia. Em vez de editar 20 arquivos, este
// script envolve a função de FIM de cada jogo (mapeada à mão, abaixo) e dispara
// o CapyCelebra quando a partida realmente rendeu XP.
//
// Depende de celebration.js (carregado antes) e de window.Store.
//
// Por que medir XP antes/depois em vez de celebrar sempre: assim a festa só
// acontece quando o aluno de fato ganhou alguma coisa, e o número mostrado é o
// XP real creditado — não um rótulo solto. (Foi exatamente um rótulo solto que
// escondeu, por meses, que a trilha não dava XP nenhum.)
//
// Precisa ser carregado DEPOIS dos scripts do jogo: as funções de fim são
// declarações `function` globais, e só existem quando o script da página rodou.
//
// FORA DE PROPÓSITO: flappy_yara. A partida termina numa colisão seguida de um
// quiz de inglês — morrer não é momento de festa, e o overlay atropelaria o quiz.
// ════════════════════════════════════════════════════════════════════════════
(function () {
    'use strict';

    // página → função que encerra a partida. Conferido arquivo por arquivo:
    // todas são `function` declaradas no escopo global. As 6 que são chamadas
    // por setTimeout(finishGame, 1200) resolvem o nome na hora da chamada, então
    // também passam pelo invólucro.
    const MAPA = {
        berry_math_game: { fn: 'finishGame' },
        color_catch_game: { fn: 'finishGame' },
        dialogue_quest_game: { fn: 'finish' },
        fill_blank_game: { fn: 'showFinished' },
        forest_puzzle_game: { fn: 'finishGame' },
        hangman_game: { fn: 'showGameOver' },
        listening_sprint_game: { fn: 'finish' },
        matching_pairs_game: { fn: 'showRoundEnd' },
        phrase_path_game: { fn: 'finish' },
        preposition_picnic_game: { fn: 'finish' },
        rapid_translate_game: { fn: 'finish' },
        sentence_builder_game: { fn: 'showResults' },
        sound_seekers_game: { fn: 'finishGame' },
        spelling_bee_game: { fn: 'showFinished' },
        verb_voyage_game: { fn: 'finish' },
        word_match_game: { fn: 'finishGame' },
        word_scramble_game: { fn: 'showGameOver' },
        word_search_game: { fn: 'showGameOver' },
        // Desafio é um por dia: o feedback É a conclusão.
        daily_challenge: { fn: 'showFeedback', titulo: 'Desafio do dia concluído!' },
        // awardXP(15) é vitória; 5 é derrota e 8 é empate. Só a vitória comemora.
        tictactoe_game: { fn: 'awardXP', so: args => Number(args[0]) >= 15, titulo: 'Você venceu!' },
    };

    // Rodadas curtas (tictactoe, matching_pairs) comemorariam a cada 20 segundos.
    // Uma festa por minuto, no máximo.
    const INTERVALO_MINIMO_MS = 60000;

    const pagina = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    const cfg = MAPA[pagina];
    const estado = { pagina, fn: cfg ? cfg.fn : null, instalado: false, motivo: '' };
    window.__capyGameCelebra = estado;   // para conferir no console
    if (!cfg) { estado.motivo = 'página fora do mapa'; return; }

    let ultimaFesta = 0;

    function xpAtual() {
        try { return window.Store && window.Store.state ? Number(window.Store.state.xp) || 0 : null; }
        catch (e) { return null; }
    }

    function nomeDoJogo() {
        return (document.title || '').replace(/\s*[—–-]\s*Capy.*$/i, '').trim();
    }

    function comemorar(xpGanho) {
        if (!window.CapyCelebra || typeof window.CapyCelebra.mostrar !== 'function') return;
        if (Date.now() - ultimaFesta < INTERVALO_MINIMO_MS) return;
        ultimaFesta = Date.now();
        window.CapyCelebra.mostrar({
            tipo: 'licao',
            titulo: cfg.titulo || 'Jogo concluído!',
            subtitulo: nomeDoJogo(),
            xp: xpGanho,
        });
    }

    function instalar() {
        const original = window[cfg.fn];
        if (typeof original !== 'function') return false;
        if (original.__capyEnvolvida) return true;

        const envolvida = function () {
            const antes = xpAtual();
            const resultado = original.apply(this, arguments);
            if (cfg.so && !cfg.so(arguments)) return resultado;
            // O addXP dos jogos é síncrono, mas alguns creditam logo depois de
            // desenhar o resultado. Confere agora e de novo num instante.
            const conferir = () => {
                const depois = xpAtual();
                if (antes === null || depois === null) return false;
                const ganho = depois - antes;
                if (ganho > 0) { comemorar(ganho); return true; }
                return false;
            };
            if (!conferir()) setTimeout(conferir, 150);
            return resultado;
        };
        envolvida.__capyEnvolvida = true;
        window[cfg.fn] = envolvida;
        return true;
    }

    if (instalar()) { estado.instalado = true; return; }
    // Se a função for definida só depois do load, tenta de novo.
    window.addEventListener('load', () => {
        estado.instalado = instalar();
        if (!estado.instalado) {
            estado.motivo = 'função ' + cfg.fn + ' não encontrada em window';
            console.warn('[game-celebra] ' + pagina + ': ' + estado.motivo);
        }
    });
})();
