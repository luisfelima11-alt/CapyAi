// "🎯 Prepare": a preparação antes da aula ao vivo (07/nov/2026, pedido do Luis).
//
// Usado pelos dois geradores (GPS Tronic e Agro). Põe o passo "Prepare" no
// começo da rota da aula, o painel vazio #tab-prepare e o preparacao.js, que
// monta tudo com o que a aula já tem (VOCAB_DATA, DIALOGO). Do conteudo.json
// só vem a pergunta de aquecimento (preparacao.aquecimento / .exemplo), que é
// opcional: sem ela, o preparacao.js faz uma pergunta neutra sobre o tema.
//
// paginaNova (14/nov/2026): a aula tem a Preparação nova (preparacao.html, com
// dados em data/preparacao/<aula>.json). O passo continua na rota, mas o
// preparacao.js mostra só o cartão que leva à página: o aluno se prepara num
// lugar só, e o XP e o aviso ao teacher saem de lá.

const jsonNoScript = v => JSON.stringify(v).replace(/</g, '\\u003c');

function trocar(t, de, para, rotulo) {
    if (!t.includes(de)) throw new Error(`preparacao: não achei ${rotulo} no molde`);
    return t.split(de).join(para);
}

export function aplicarPreparacao(t, { c, paginaNova = false }) {
    t = trocar(t, "const ROTA=[\n  {id:'dialogue',", "const ROTA=[\n  {id:'prepare',     rotulo:'🎯 Prepare'},\n  {id:'dialogue',", 'a ROTA');
    t = trocar(t, '<div id="tab-dialogue" class="tab-content fade-in">',
        '<div id="tab-prepare" class="tab-content fade-in hidden"><div id="prep-raiz"></div></div>\n\n<div id="tab-dialogue" class="tab-content fade-in">',
        'o painel do diálogo');
    const p = c.preparacao || {};
    const dados = {};
    if (p.aquecimento) dados.aquecimento = p.aquecimento;
    if (p.exemplo) dados.exemplo = p.exemplo;
    if (paginaNova) dados.paginaNova = true;
    if ((t.match(/<\/body>/g) || []).length !== 1) throw new Error('preparacao: </body> ambíguo');
    return t.replace('</body>', `<script>window.PREP=${jsonNoScript(dados)};</script>\n<script src="preparacao.js?v=prep1"></script>\n</body>`);
}

export function checarPreparacao(c, t, ok, { paginaNova = false } = {}) {
    ok(/"paginaNova":true/.test(t) === paginaNova, paginaNova ? 'o Prepare abre a página de Preparação (paginaNova)' : 'o Prepare é o da própria aula (sem paginaNova)');
    ok(/const ROTA=\[\n {2}\{id:'prepare'/.test(t), 'a rota começa no 🎯 Prepare');
    ok(t.includes('<div id="tab-prepare"') && (t.match(/preparacao\.js\?v=/g) || []).length === 1, 'preparação ligada (#tab-prepare e preparacao.js uma vez)');
    const p = c.preparacao;
    if (p) ok(p.aquecimento && p.exemplo && !/</.test(p.aquecimento + p.exemplo), 'aquecimento com pergunta e exemplo, sem HTML');
}
