/**
 * Gera os dados da trilha diária em arquivos por lição.
 *
 * POR QUÊ: hoje `lessons.html` carrega ~1,37 MB para abrir UMA lição de ~4 KB —
 * as 108 lições de inglês vêm embutidas no HTML (646 KB, JSON indentado) e os
 * outros quatro cursos vêm em arquivos próprios, todos baixados sempre. Este
 * script quebra isso em:
 *
 *   data/lessons/<id>.json   uma lição, JSON compacto
 *   data/lessons-index.json  {id, title, emoji, lang} de todas as lições
 *
 * A página passa a baixar o índice (~15 KB) + a lição pedida.
 *
 * Rode depois de mexer em qualquer fonte de lição:
 *   node scripts/build-lesson-data.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'lessons');
const INDEX_FILE = path.join(ROOT, 'data', 'lessons-index.json');

// Relê as lições que só existem como JSON gerado (as de inglês, 1-108).
// Só entram as que nenhuma outra fonte produz, para não duplicar id.
function lerDoDiretorioGerado() {
  const dir = path.join(ROOT, 'data', 'lessons');
  if (!fs.existsSync(dir)) return [];
  const idsDeOutrasFontes = new Set();
  // Curso que produz lições aqui mas falta nesta lista volta a ser lido de
  // data/lessons/ na rodada seguinte, e o id colide com ele mesmo.
  for (const [arq, v] of [['lessons_fr_data.js', 'LESSONS_FR'], ['lessons_gps_data.js', 'LESSONS_GPS'],
                          ['lessons_int_data.js', 'LESSONS_INT'], ['lessons_tr_data.js', 'LESSONS_TR'],
                          ['lessons_interview_data.js', 'LESSONS_INTERVIEW'],
                          ['lessons_agro_data.js', 'LESSONS_AGRO'],
                          ['lessons_med_data.js', 'LESSONS_MED']]) {
    for (const l of lerArquivoDeDados(arq, v)) idsDeOutrasFontes.add(l.id);
  }
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    if (!/^\d+\.json$/.test(f)) continue;
    const id = Number(f.replace('.json', ''));
    if (idsDeOutrasFontes.has(id)) continue;
    try { out.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))); } catch (e) { }
  }
  out.sort((a, b) => a.id - b.id);
  console.log('  (lições de inglês relidas de data/lessons: ' + out.length + ')');
  return out;
}

// ── Fonte 1: as lições de inglês ────────────────────────────────────────────
// Elas moravam num array JADSON_LESSONS dentro de lessons.html. Depois que a
// trilha passou a carregar lição por lição, esse array saiu de lá e os próprios
// data/lessons/<id>.json viraram a fonte. Se o array ainda existir (versão
// antiga do HTML) a gente lê dele; senão, relê os JSON já gerados — nunca
// devolve lista vazia em silêncio, senão o índice perde 108 lições.
function lerJadson() {
  const html = fs.readFileSync(path.join(ROOT, 'lessons.html'), 'utf8');
  const i = html.indexOf('const JADSON_LESSONS');
  if (i < 0) return lerDoDiretorioGerado();
  // acha o fechamento do array contando colchetes (o array tem strings com
  // colchetes dentro, então indexOf(']') não serve)
  const abre = html.indexOf('[', i);
  let nivel = 0, fim = -1, dentroDeString = false, aspa = '';
  for (let k = abre; k < html.length; k++) {
    const c = html[k];
    if (dentroDeString) {
      if (c === '\\') { k++; continue; }
      if (c === aspa) dentroDeString = false;
      continue;
    }
    if (c === '"' || c === "'") { dentroDeString = true; aspa = c; continue; }
    if (c === '[') nivel++;
    else if (c === ']') { nivel--; if (nivel === 0) { fim = k + 1; break; } }
  }
  if (fim < 0) throw new Error('não achei o fim do JADSON_LESSONS');
  return JSON.parse(html.slice(abre, fim));
}

// ── Fonte 2: os arquivos lessons_*_data.js ──────────────────────────────────
function lerArquivoDeDados(arquivo, variavel) {
  const p = path.join(ROOT, arquivo);
  if (!fs.existsSync(p)) return [];
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox);
  return sandbox.window[variavel] || [];
}

const fontes = [
  { lessons: lerJadson(), lang: 'en', origem: 'lessons.html (JADSON_LESSONS)' },
  { lessons: lerArquivoDeDados('lessons_fr_data.js', 'LESSONS_FR'), lang: 'fr', origem: 'lessons_fr_data.js' },
  { lessons: lerArquivoDeDados('lessons_gps_data.js', 'LESSONS_GPS'), lang: 'en', origem: 'lessons_gps_data.js' },
  { lessons: lerArquivoDeDados('lessons_int_data.js', 'LESSONS_INT'), lang: 'en', origem: 'lessons_int_data.js' },
  { lessons: lerArquivoDeDados('lessons_tr_data.js', 'LESSONS_TR'), lang: 'tr', origem: 'lessons_tr_data.js' },
  { lessons: lerArquivoDeDados('lessons_interview_data.js', 'LESSONS_INTERVIEW'), lang: 'en', origem: 'lessons_interview_data.js' },
  { lessons: lerArquivoDeDados('lessons_agro_data.js', 'LESSONS_AGRO'), lang: 'en', origem: 'lessons_agro_data.js' },
  { lessons: lerArquivoDeDados('lessons_med_data.js', 'LESSONS_MED'), lang: 'en', origem: 'lessons_med_data.js' },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const indice = [];
const vistos = new Map();
let bytesTotal = 0;

for (const fonte of fontes) {
  for (const licao of fonte.lessons) {
    if (!licao || typeof licao.id !== 'number') continue;
    if (vistos.has(licao.id)) {
      console.warn(`⚠️  id ${licao.id} duplicado: ${vistos.get(licao.id)} e ${fonte.origem} — mantendo o primeiro`);
      continue;
    }
    vistos.set(licao.id, fonte.origem);

    // `lang` fica explícito no arquivo: a página usa isso para achar a próxima
    // lição do mesmo idioma sem precisar carregar os outros cursos.
    const completa = { ...licao, lang: licao.lang || fonte.lang };
    const json = JSON.stringify(completa);
    fs.writeFileSync(path.join(OUT_DIR, licao.id + '.json'), json, 'utf8');
    bytesTotal += json.length;

    indice.push({
      id: completa.id,
      title: completa.title || '',
      emoji: completa.emoji || '',
      lang: completa.lang,
    });
  }
}

indice.sort((a, b) => a.id - b.id);

// Rede de segurança: se o índice novo vier bem menor que o anterior, é sinal de
// fonte quebrada — avisa alto em vez de publicar uma trilha pela metade.
try {
  if (fs.existsSync(INDEX_FILE)) {
    const anterior = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    if (Array.isArray(anterior) && indice.length < anterior.length * 0.9) {
      console.error(`\n⚠️  ATENÇÃO: o índice caiu de ${anterior.length} para ${indice.length} lições.`);
      console.error('   Alguma fonte não carregou. Confira antes de publicar.\n');
      process.exitCode = 1;
    }
  }
} catch (e) { }

const indiceJson = JSON.stringify(indice);
fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });
fs.writeFileSync(INDEX_FILE, indiceJson, 'utf8');

const porIdioma = indice.reduce((acc, l) => { acc[l.lang] = (acc[l.lang] || 0) + 1; return acc; }, {});
console.log(`lições geradas: ${indice.length} (${JSON.stringify(porIdioma)})`);
console.log(`data/lessons/: ${(bytesTotal / 1024).toFixed(0)} KB no total, média ${(bytesTotal / indice.length / 1024).toFixed(1)} KB por lição`);
console.log(`data/lessons-index.json: ${(indiceJson.length / 1024).toFixed(0)} KB`);
