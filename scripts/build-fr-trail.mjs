import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FR_LESSONS_1_6 } from './fr-lessons-part1.mjs';
import { FR_LESSONS_7_12 } from './fr-lessons-part2.mjs';
import { semPronuncia, limpaDeep, limpaTabela, confere } from './fr-sem-pronuncia.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ALL_LESSONS = semPronuncia([...FR_LESSONS_1_6, ...FR_LESSONS_7_12]);

const VERB_LISTS = {
  1: ['Saluer', "S'appeler", 'Parler', 'Venir', 'Remercier'],
  2: ['Compter', 'Avoir', 'Coûter', 'Payer', 'Additionner'],
  3: ['Aimer', 'Préférer', 'Voir', 'Choisir', 'Décrire'],
  4: ['Habiter', 'Présenter', 'Travailler', 'Aimer', 'Appeler'],
  5: ['Être', 'Avoir', 'Aller', 'Sentir', 'Vouloir'],
  6: ['Manger', 'Boire', 'Prendre', 'Commander', 'Aimer'],
  7: ['Commencer', 'Fêter', 'Travailler', 'Planifier', 'Se reposer'],
  8: ['Se réveiller', 'Se lever', 'Partir', 'Arriver', 'Se coucher'],
  9: ['Faire', 'Pleuvoir', 'Neiger', 'Sortir', 'Voyager'],
  10: ['Aller', 'Tourner', 'Traverser', 'Continuer', 'Prendre'],
  11: ['Porter', 'Essayer', 'Acheter', 'Payer', 'Choisir'],
  12: ['Avoir mangé', 'Avoir fait', 'Avoir vu', 'Avoir pris', 'Être allé(e)'],
};

const GRAMMAR_TABLES = {
  1: {
    headers: ['Situação', 'Pronome', 'Exemplo em Francês'],
    rows: [
      ['Amigo / Família', 'Tu', "Salut ! Comment tu t'appelles ?"],
      ['Desconhecido / Formal', 'Vous', 'Bonjour ! Comment vous appelez-vous ?'],
      ['Ao chegar (dia / noite)', '—', 'Bonjour ! / Bonsoir !'],
      ['Ao sair (dia / noite)', '—', 'Bonne journée ! / Bonne soirée !'],
    ],
  },
  2: {
    headers: ['Número', 'Francês & Pronúncia', 'Exemplo Prático'],
    rows: [
      ['1 a 5', 'un, deux, trois, quatre, cinq', 'Deux cafés, ça fait cinq euros.'],
      ['6 a 10', 'six, sept [sét], huit, neuf, dix', "Le cours commence à huit heures."],
      ['11 a 16', 'onze, douze, treize, quatorze, quinze, seize', 'Elle a seize ans.'],
      ['17 a 20', 'dix-sept, dix-huit, dix-neuf, vingt [vã]', "J'ai vingt ans."],
    ],
  },
  3: {
    headers: ['Masculino', 'Feminino', 'Exemplo'],
    rows: [
      ['vert [vér]', 'verte [vért]', 'un pull vert / une robe verte'],
      ['blanc [blã]', 'blanche [blãch]', 'un vin blanc / une maison blanche'],
      ['rouge / jaune / rose', 'rouge / jaune / rose', 'un sac rouge / une fleur rouge'],
      ['orange / marron', 'orange / marron (invariáveis!)', 'des chaussures marron'],
    ],
  },
  4: {
    headers: ['Dono', 'Masculino Sing.', 'Feminino Sing.', 'Plural (Masc./Fem.)'],
    rows: [
      ['Je (meu/minha)', 'mon père / mon amie*', 'ma mère / ma sœur', 'mes parents / mes sœurs'],
      ['Tu (teu/tua)', 'ton frère / ton amie*', 'ta tante / ta cousine', 'tes frères / tes amies'],
      ['Il / Elle (dele/dela)', 'son fils / son amie*', 'sa fille / sa femme', 'ses enfants / ses cousins'],
    ],
  },
  5: {
    headers: ['Pronome', 'ÊTRE (Ser / Estar)', 'AVOIR (Ter / Sensações)'],
    rows: [
      ["je / j'", 'je suis brésilien(ne)', "j'ai faim / j'ai froid"],
      ['tu', 'tu es prêt(e)', 'tu as soif / tu as raison'],
      ['il / elle / on', 'il/elle/on est à Paris', "il/elle/on a besoin d'aide"],
      ['nous', 'nous sommes contents', 'nous avons vingt ans'],
      ['vous', 'vous êtes en vacances', 'vous avez chaud'],
      ['ils / elles', 'ils/elles sont ici [il SÔN]', 'ils/elles ont deux enfants [il ZÔN]'],
    ],
  },
  6: {
    headers: ['Partitivo', 'Quando usar', 'Exemplo no Restaurante'],
    rows: [
      ['du', 'Masculino singular', 'Je mange du pain et du fromage.'],
      ['de la', 'Feminino singular', 'Elle mange de la salade et de la soupe.'],
      ["de l'", 'Antes de vogal ou H mudo', "Je bois de l'eau minérale."],
      ['des / pas de', 'Plural / Forma negativa', 'Des fruits · Je ne mange pas de viande.'],
    ],
  },
  7: {
    headers: ['Estrutura', 'Significado', 'Exemplo'],
    rows: [
      ['lundi (sem artigo)', 'Nesta segunda-feira', 'Lundi, je vais chez le médecin.'],
      ['le lundi (com le)', 'Toda segunda-feira (hábito)', 'Le lundi, je fais du sport.'],
      ['le premier / le dix', 'Datas (1º = premier; 2..31 = cardinal)', 'Le premier mai · Le quatorze juillet.'],
      ['en + mês', 'Em + mês do ano', 'Mon anniversaire est en août [ÚT].'],
    ],
  },
  8: {
    headers: ['Horário', 'Em Francês (Sempre "Il est...")', 'Pronúncia'],
    rows: [
      ['8h00 / 12h00 / 00h00', 'Il est huit heures / midi / minuit', '[i-lé uí-TŒR / mi-DI / mi-NUÍ]'],
      ['8h15', 'Il est huit heures et quart', '[i-lé uí-TŒR ê KÁR]'],
      ['8h30', 'Il est huit heures et demie', '[i-lé uí-TŒR ê dã-MI]'],
      ['8h45', 'Il est neuf heures moins le quart', '[i-lé nœ-VŒR muã lã KÁR]'],
    ],
  },
  9: {
    headers: ['Estrutura', 'Exemplo em Francês', 'Tradução'],
    rows: [
      ['Il fait + adjetivo', 'Il fait beau / chaud / froid / frais.', 'O tempo está bom / quente / frio / fresco.'],
      ['Il y a + partitivo', 'Il y a du soleil / du vent / des nuages.', 'Está fazendo sol / ventando / nublado.'],
      ['Verbo direto', 'Il pleut / Il neige.', 'Está chovendo / Está nevando.'],
      ['Estações', 'Au printemps · En été / automne / hiver', 'Na primavera · No verão / outono / inverno'],
    ],
  },
  10: {
    headers: ['Gênero do Lugar', 'Aller (Ir a)', 'À côté / En face (Ao lado / Em frente)'],
    rows: [
      ['Masculino (le parc)', 'Je vais au parc.', 'C\'est en face du parc.'],
      ['Feminino (la gare)', 'Je vais à la gare.', 'C\'est à côté de la gare.'],
      ["Vogal / H (l'hôtel)", "Je vais à l'hôtel.", "C'est près de l'hôtel."],
      ['Direções', 'Allez tout droit !', 'Tournez à droite / à gauche !'],
    ],
  },
  11: {
    headers: ['Demonstrativo', 'Uso', 'Exemplos de Compras'],
    rows: [
      ['ce [sã]', 'Masc. sing. + consoante', 'ce pantalon, ce pull, ce manteau'],
      ['cet [sét]', 'Masc. sing. + vogal / H mudo', 'cet imperméable, cet hôtel'],
      ['cette [sét]', 'Feminino singular (todas)', 'cette robe, cette chemise, cette écharpe'],
      ['ces [sê]', 'Plural (masculino e feminino)', 'ces chaussures, ces vêtements'],
    ],
  },
  12: {
    headers: ['Grupo de Verbos', 'Auxiliar + Particípio', 'Exemplo no Passé Composé'],
    rows: [
      ['Verbos em -ER → -É', 'avoir + parlé / mangé / visité', "Hier, j'ai mangé une crêpe."],
      ['Irregulares com AVOIR', 'fait (faire), vu (voir), pris (prendre), bu (boire)', "J'ai vu la Tour Eiffel et j'ai pris des photos."],
      ['Movimento com ÊTRE', 'être + allé(e), venu(e), arrivé(e), parti(e)', 'Samedi, je suis allé(e) au musée du Louvre.'],
      ['Negativa', 'ne + auxiliar + pas + particípio', "Je n'ai pas compris · Je ne suis pas sorti(e)."],
    ],
  },
};

const builtTrail = ALL_LESSONS.map(l => {
  const id = 200 + l.num;
  const sentences = [
    ...l.speak.map(s => s.fr),
    ...l.dialogueLines.slice(0, 4).map(d => d.fr),
  ].slice(0, 10);

  return {
    id,
    title: l.title,
    emoji: l.emoji,
    lang: 'fr',
    verbs: VERB_LISTS[l.num],
    vocab: l.vocab.map(v => ({ en: v.en, pt: v.pt })),
    expressions: l.expressions.map(e => ({
      expr: e.expr,
      meaning: e.pt,
      example: e.example,
    })),
    sentences,
    grammar: {
      title: `${l.patterns[0].title}`,
      rules: l.patterns.map(p => `<b>${p.title}:</b> ${p.certo[0].replace(/^✅\s*/, '')} (${p.tip})`),
      table: limpaTabela(GRAMMAR_TABLES[l.num]),
    },
    quiz: l.quiz.map(q => ({
      q: q.q,
      a: q.a,
      opts: q.opts,
      why: q.rule,
    })),
    speak: l.speak.map(s => s.fr),
  };
});

const FINAL = limpaDeep(builtTrail);
const ERROS = confere(FINAL);
if (ERROS.length) { console.error(ERROS.join('\n')); process.exit(1); }

const outJs = `// Capy Yara Adventures — French Daily-Trail Lessons (12 Units · IDs 201–212)
// Renovado em Português (BR) -> Francês (fr-FR), alinhado com fr_aula_01..12.html.
const LESSONS_FR = ${JSON.stringify(FINAL, null, 2)};

if (typeof window !== 'undefined') window.LESSONS_FR = LESSONS_FR;
`;

fs.writeFileSync(path.join(ROOT, 'lessons_fr_data.js'), outJs, 'utf8');
console.log(`✓ Updated lessons_fr_data.js with ${builtTrail.length} enriched French units (201–212).`);
