#!/usr/bin/env node
/**
 * build-prova-toeic.mjs — as partes no estilo TOEIC da prova final do Intermediate.
 *
 *   node scripts/build-prova-toeic.mjs            monta o JSON de áudio e escreve as questões
 *   node scripts/gen-dialogo-assets.mjs --audio provaintermediate01   (gera os mp3, centavos)
 *
 * Pedido do Luis (12/nov/2026): na prova, listening só com áudio, sem nada escrito,
 * perguntas de interpretação de imagem e de texto, e respostas como as do TOEIC:
 *   📷 Fotos (Parte 1)        foto + 4 frases SÓ em áudio; o texto aparece depois de responder
 *   💬 Pergunta e resposta    pergunta + 3 respostas SÓ em áudio
 *   🎧 Conversas (Parte 3)    conversa curta só em áudio; a pergunta é escrita, como no TOEIC
 *   📖 Leitura (Parte 7)      e-mail e folheto (com imagem) + perguntas
 *
 * Fonte: scripts/prova-intermediate-toeic.json. Os áudios reaproveitam o
 * gen-dialogo-assets.mjs: cada fala vira uma linha de scripts/provaintermediate01-dialogo.json
 * e um mp3 em assets/audio/provaintermediate01/sNN.mp3. As questões vão para o
 * intermediate_prova.html entre os marcadores TOEIC:inicio e TOEIC:fim.
 */
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const FONTE = path.join(RAIZ, 'scripts/prova-intermediate-toeic.json');
const DIALOGO = path.join(RAIZ, 'scripts/provaintermediate01-dialogo.json');
const PROVA = path.join(RAIZ, 'intermediate_prova.html');
const PASTA = '/assets/audio/provaintermediate01/';

const f = JSON.parse(fs.readFileSync(FONTE, 'utf8'));
const linhas = [];
// quem → a chave de voz do gen-dialogo-assets (yara/client são só nomes de slot)
const SLOT = { narrador: 'narrador', mulher: 'mulher', homem: 'homem' };
function audio(quem, en) {
    linhas.push({ who: SLOT[quem], en, pt: '', extra: false });
    return PASTA + `s${String(linhas.length).padStart(2, '0')}.mp3`;
}
const comCerta = (opts, certa) => ({ opts, ans: opts[certa] });

const questoes = [];
for (const [i, p] of f.fotos.entries()) {
    const mp3 = {};
    for (const fr of p.frases) mp3[fr] = audio('narrador', fr);
    questoes.push({
        section: 'foto', sectionLabel: '📷 Fotos (estilo TOEIC)',
        promptPt: 'Olhe a foto e ouça as 4 frases. Escolha a que descreve a foto. Nada aparece escrito até você responder.',
        img: p.img, imgAlt: p.alt, sentence: '', audioOpts: true, mp3, ...comCerta(p.frases, p.certa), rule: p.explica,
    });
}
for (const r of f.respostas) {
    const mp3 = {};
    const mp3Pergunta = audio('mulher', r.pergunta);
    for (const o of r.opcoes) mp3[o] = audio('homem', o);
    questoes.push({
        section: 'resposta', sectionLabel: '💬 Pergunta e resposta (estilo TOEIC)',
        promptPt: 'Ouça a pergunta e as 3 respostas. Escolha a resposta que faz sentido. Nada aparece escrito até você responder.',
        audioText: r.pergunta, mp3Pergunta, sentence: '', audioOpts: true, mp3, ...comCerta(r.opcoes, r.certa), rule: r.explica,
    });
}
for (const c of f.conversas) {
    const dialogo = c.falas.map(fl => ({ quem: fl.quem, text: fl.en, mp3: audio(fl.quem, fl.en) }));
    for (const p of c.perguntas) {
        questoes.push({
            section: 'conversa', sectionLabel: '🎧 Conversas (estilo TOEIC)',
            promptPt: 'Ouça a conversa (sem transcrição) e responda à pergunta.',
            dialogo, sentence: p.q, ...comCerta(p.opts, p.certa), rule: p.explica,
        });
    }
}
for (const l of f.leituras) {
    const passagem = { tipo: l.tipo, titulo: l.titulo, texto: l.texto, img: l.img || '', alt: l.alt || '' };
    for (const p of l.perguntas) {
        questoes.push({
            section: 'leitura', sectionLabel: '📖 Leitura (estilo TOEIC)',
            promptPt: `Leia o ${l.tipo.toLowerCase()} e responda à pergunta.`,
            passagem, sentence: p.q, ...comCerta(p.opts, p.certa), rule: p.explica,
        });
    }
}

// Áudio: o mesmo formato dos diálogos das aulas, para o gen-dialogo-assets.mjs.
fs.writeFileSync(DIALOGO, JSON.stringify({
    aula: 1, curso: 'provaintermediate', titulo: 'Prova final Intermediate — partes TOEIC',
    imagem: { arquivo: 'assets/img/intermediate25-dialogue.jpg', alt: '', prompt: '' },
    vozes: { narrador: f.vozes.narrador, mulher: f.vozes.mulher, homem: f.vozes.homem },
    linhas,
}, null, 2) + '\n');

// Questões na prova, entre os marcadores.
const json = JSON.stringify(questoes, null, 1).replace(/</g, '\\u003c');
const bloco = `/* TOEIC:inicio (gerado por scripts/build-prova-toeic.mjs) */
const TOEIC_QUESTIONS = ${json};
(function () {
  const i = EXAM_QUESTIONS.findIndex(q => q.section === 'speaking');
  EXAM_QUESTIONS.splice(i < 0 ? EXAM_QUESTIONS.length : i, 0, ...TOEIC_QUESTIONS);
  EXAM_QUESTIONS.forEach((q, k) => { q.id = k + 1; });
})();
/* TOEIC:fim */`;
let html = fs.readFileSync(PROVA, 'utf8');
const a = html.indexOf('/* TOEIC:inicio');
if (a >= 0) {
    const b = html.indexOf('/* TOEIC:fim */', a) + '/* TOEIC:fim */'.length;
    html = html.slice(0, a) + bloco + html.slice(b);
} else {
    const ancora = 'const EXAM_DURATION_SEC';
    if (!html.includes(ancora)) throw new Error('âncora EXAM_DURATION_SEC não encontrada');
    html = html.replace(ancora, bloco + '\n\n' + ancora);
}
fs.writeFileSync(PROVA, html);
const por = questoes.reduce((m, q) => ({ ...m, [q.section]: (m[q.section] || 0) + 1 }), {});
console.log(`${questoes.length} questões TOEIC`, por, `· ${linhas.length} áudios em ${PASTA}`);
