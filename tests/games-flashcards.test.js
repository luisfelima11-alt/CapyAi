const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('game pavilion exposes all game tiles and the expanded game set', () => {
  const pavilion = read('5_Game_Pavilion_Forest_Edition.html');
  assert.equal((pavilion.match(/data-category=/g) || []).length, 25);
  assert.match(pavilion, /listening_sprint_game\.html/);
  assert.match(pavilion, /phrase_path_game\.html/);
  assert.match(pavilion, /rapid_translate_game\.html/);
  assert.match(pavilion, /dialogue_quest_game\.html/);
  assert.match(pavilion, /verb_voyage_game\.html/);
  assert.match(pavilion, /preposition_picnic_game\.html/);
  assert.match(pavilion, />25 games</);
  assert.match(pavilion, /id="game-search"/);
  assert.match(pavilion, /id="daily-mission-btn"/);
  assert.match(pavilion, /id="surprise-game-btn"/);
});

test('new game pages contain playable rounds and reward progress', () => {
  for (const file of ['listening_sprint_game.html', 'phrase_path_game.html', 'rapid_translate_game.html', 'dialogue_quest_game.html', 'verb_voyage_game.html', 'preposition_picnic_game.html']) {
    const page = read(file);
    assert.match(page, /Store\.addXP/);
    assert.match(page, /Store\.completeActivity\('games'\)/);
    for (const match of page.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
      new vm.Script(match[1], { filename: file });
    }
  }
});

test('new grammar games provide enough varied content and accessibility safeguards', () => {
  const verbs = read('verb_voyage_game.html');
  const prepositions = read('preposition_picnic_game.html');
  assert.ok((verbs.match(/signal:/g) || []).length >= 15);
  assert.ok((prepositions.match(/visual:/g) || []).length >= 14);
  for (const page of [verbs, prepositions]) {
    assert.match(page, /prefers-reduced-motion/);
    assert.match(page, /focus-visible/);
    assert.match(page, /speechSynthesis/);
    assert.match(page, /capyGameStats/);
  }
});

test('game pavilion only completes the games mission after a real game ends', () => {
  const pavilion = read('5_Game_Pavilion_Forest_Edition.html');
  const legacyPavilion = read('9_Game_Pavilion_Yaras_Expedition.html');
  const flappy = read('flappy_yara_game.html');
  const ticTacToe = read('tictactoe_game.html');
  assert.doesNotMatch(pavilion, /Store\.completeActivity\('games'\)/);
  assert.doesNotMatch(legacyPavilion, /Store\.completeActivity\('games'\)/);
  for (const game of [flappy, ticTacToe]) {
    assert.match(game, /Store\.completeActivity\('games'\)/);
    assert.match(game, /5_Game_Pavilion_Forest_Edition\.html/);
    assert.doesNotMatch(game, /9_Game_Pavilion_Yaras_Expedition\.html/);
  }
});

test('word search initializes directions before starting the first round', () => {
  const page = read('word_search_game.html');
  assert.ok(page.indexOf('const DIRS') < page.indexOf('startRound(0)'));
});

test('pavilion search provides a recoverable empty state', () => {
  const pavilion = read('5_Game_Pavilion_Forest_Edition.html');
  assert.match(pavilion, /id="games-empty"/);
  assert.match(pavilion, /id="clear-game-search"/);
  assert.match(pavilion, /visible !== 0/);
});

test('flashcards include expanded decks and personal review controls', () => {
  const data = read('flashcards.js');
  const page = read('2_Flashcard_Journey_Expedition_Edition.html');
  for (const id of ['travel', 'school', 'conversation']) assert.match(data, new RegExp(`\\b${id}: \\{`));
  assert.match(data, /function rateCard\(status\)/);
  assert.match(data, /function reviewLearningCards\(\)/);
  assert.match(data, /function toggleFavoriteCard\(\)/);
  assert.match(data, /function startQuickSession\(\)/);
  assert.match(page, /Ainda aprendendo/);
  assert.match(page, /Já sei/);
  assert.match(page, /5 cartões/);
  assert.match(page, /Favoritos/);
});
