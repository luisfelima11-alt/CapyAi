// A mini-lição da trilha tem que fechar sozinha ao terminar o último passo,
// e a tela final de cada atividade não pode tirar o aluno do fluxo guiado.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'lessons.html'), 'utf8');

test('markToolDone conclui a mini no último passo (inclui o passo game)', () => {
  const m = html.match(/function markToolDone\([\s\S]*?\n\}\n/);
  assert.ok(m, 'markToolDone existe');
  assert.match(m[0], /Store\.completeMini\(/);
  assert.match(m[0], /passo === 'game'/);
});

test('telas finais usam botaoSeguir, sem switchTool fixo', () => {
  for (const fn of ['renderScrambleFinish', 'renderSpeedFinish', 'renderTypingFinish', 'renderListenFinish']) {
    const m = html.match(new RegExp('function ' + fn + '\\([\\s\\S]*?\\n\\}\\n'));
    assert.ok(m, fn + ' existe');
    assert.ok(!/onclick="switchTool\(/.test(m[0]), fn + ' não pode ter switchTool fixo');
  }
  assert.match(html, /function botaoSeguir\(/);
});

test('"Concluir" dos flashcards avança a trilha', () => {
  assert.match(html, /markToolDone\(currentLesson\.id,'vocab'\); if \(GUIDED_MODE\) guidedNextStep\(\)/);
});
