// Confere TODO badge "N aulas" dos hubs contra a fonte de verdade de cada curso.
// Rode antes de publicar sempre que criar ou remover aula.
//   node scripts/checa-badges.mjs
import fs from 'fs';

const arquivos = fs.readdirSync('.');
const porPrefixo = p => arquivos.filter(f => f.startsWith(p) && f.endsWith('.html')).length;

// Fonte de verdade por curso. Turco e a excecao: as licoes vivem num array JS,
// nao em arquivos soltos — por isso a contagem nao pode sair so de `ls`.
const CURSOS = {
    Starter:      () => porPrefixo('aula_'),
    Business:     () => porPrefixo('business_aula_'),
    Travel:       () => porPrefixo('travel_aula_'),
    Intermediate: () => porPrefixo('intermediate_aula_'),
    Advanced:     () => porPrefixo('advanced_aula_'),
    'GPS Tronic': () => porPrefixo('gpstronic_aula_'),
    'Agro English': () => porPrefixo('agro_aula_'),
    'Entrevista': () => porPrefixo('interview_aula_'),
    'Français':   () => porPrefixo('fr_aula_'),
    'Türkçe':     () => (fs.readFileSync('lessons_tr_data.js', 'utf8').match(/\bid:\s*\d+/g) || []).length,
};

const reais = Object.fromEntries(Object.entries(CURSOS).map(([k, f]) => [k, f()]));
const badges = (fs.readFileSync('classes.html', 'utf8').match(/(\d+) aulas?</g) || [])
    .map(b => Number(b.match(/\d+/)[0]));
const contados = [...new Set(Object.values(reais))];

let problema = false;
for (const [curso, n] of Object.entries(reais)) {
    const ok = badges.includes(n);
    if (!ok) problema = true;
    console.log(`${ok ? 'ok  ' : 'FALTA'} ${curso.padEnd(13)} ${String(n).padStart(3)} aulas reais`);
}
const orfaos = badges.filter(b => !contados.includes(b));
if (orfaos.length) { problema = true; console.log('BADGE SEM CURSO:', orfaos.join(', ')); }
console.log(problema ? '\n=> DIVERGENCIA: confira classes.html e o hero do curso' : '\n=> todos os badges batem');
process.exit(problema ? 1 : 0);
