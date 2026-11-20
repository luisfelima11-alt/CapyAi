// Jogos do pavilhão e da lição: placar, fim de jogo e XP pago uma vez só.
// Cada teste nasceu de um bug real (ver BUGS-APRENDIDOS.md, caça de 20/nov/2026).
const { test, expect } = require('playwright/test');

const ALUNA = { id: 'aluna-jogos', name: 'Ana Souza', email: 'ana@example.test', role: 'student' };

async function entrarComoAluna(page) {
  await page.addInitScript(aluna => localStorage.setItem('capySession', JSON.stringify(aluna)), ALUNA);
  await page.route('**/api/**', route => {
    const caminho = new URL(route.request().url()).pathname;
    if (caminho === '/api/auth/session') return route.fulfill({ status: 200, json: { ok: true, user: ALUNA, csrfToken: 'csrf-teste' } });
    if (caminho === '/api/profile') return route.fulfill({ status: 200, json: { onboarding_complete: true } });
    return route.fulfill({ status: 200, json: {} });
  });
}

const xpDaAluna = page => page.evaluate(() => window.Store.state.xp);

test.describe('Grammar Lab (grammar_lab.html)', () => {
  test('clicar numa alternativa responde a pergunta (a explicação tem aspas)', async ({ page }) => {
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));
    await entrarComoAluna(page);
    await page.goto('/grammar_lab.html');
    await page.click('text=Praticar Agora!');
    await page.locator('.q-opt').first().click();
    await expect(page.locator('#q-feedback')).toBeVisible();
    await expect(page.locator('#next-btn')).toBeVisible();
    expect(erros).toEqual([]);
  });

  test('a explicação do erro aparece inteira, com as aspas', async ({ page }) => {
    await entrarComoAluna(page);
    await page.goto('/grammar_lab.html');
    await page.click('text=Praticar Agora!');
    const certa = await page.evaluate(() => LESSONS[currentLesson].questions[0].correct);
    const exp = await page.evaluate(() => LESSONS[currentLesson].questions[0].exp);
    await page.locator('.q-opt', { hasNotText: new RegExp(`^\\s*${certa}\\s*$`) }).first().click();
    await expect(page.locator('#fb-text')).toHaveText(exp);
  });
});

test.describe('Jogos da lição (lessons.html): trocar de aba logo depois de responder', () => {
  async function abrirLicao(page) {
    await entrarComoAluna(page);
    await page.goto('/lessons.html?lesson=1');
    await page.waitForFunction(() => typeof currentLesson !== 'undefined' && currentLesson
      && currentLesson.quiz && currentLesson.quiz.length > 1 && currentLesson.vocab && currentLesson.vocab.length > 3
      && window.Store);
  }

  test('Quiz: errar a última, ir aos Flashcards e voltar não deixa responder de novo nem paga 2x', async ({ page }) => {
    await abrirLicao(page);
    await page.click('.tool-tab[data-tool="quiz"]');
    await page.evaluate(() => {
      const qs = shuffledQuiz.length ? shuffledQuiz : currentLesson.quiz;
      quizIdx = qs.length - 1; quizScore = 3; quizDone = false;
      renderQuiz();
    });
    const certa = await page.evaluate(() => (shuffledQuiz.length ? shuffledQuiz : currentLesson.quiz)[quizIdx].a);
    const antes = await xpDaAluna(page);
    const exato = new RegExp('^\\s*' + certa.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$');
    await page.locator('#quiz-opts button').filter({ hasNotText: exato }).first().click();
    await page.click('.tool-tab[data-tool="vocab"]');
    await page.click('.tool-tab[data-tool="quiz"]');
    const abertas = page.locator('#quiz-opts button:not([disabled])');
    if (await abertas.count()) await abertas.filter({ hasText: exato }).click();
    await page.waitForTimeout(3500);
    await expect(page.locator('#panel-quiz')).toContainText('Quiz Concluído!');
    expect(await xpDaAluna(page) - antes).toBe(3 * 5);
  });

  test('Speed: responder e trocar de aba não deixa o relógio correndo escondido', async ({ page }) => {
    await abrirLicao(page);
    await page.click('.tool-tab[data-tool="speed"]');
    await page.locator('#speed-opts button[data-correct="true"]').click();
    await page.click('.tool-tab[data-tool="vocab"]');
    await page.waitForTimeout(9000);
    expect(await page.evaluate(() => ({ idx: speedIdx, relogio: !!speedTimer })))
      .toEqual({ idx: 1, relogio: false });
  });

  test('Scramble: acertar, trocar de aba e voltar não paga a mesma palavra de novo', async ({ page }) => {
    await abrirLicao(page);
    await page.click('.tool-tab[data-tool="scramble"]');
    const montar = () => page.evaluate(() => {
      const palavra = getScrambleWords()[scrambleIdx].en;
      const usadas = new Set();
      for (const letra of palavra) {
        const t = [...document.querySelectorAll('.scramble-tile')].find(b => b.dataset.letter === letra && !usadas.has(b.id));
        usadas.add(t.id);
        t.click();
      }
    });
    const primeira = await page.evaluate(() => getScrambleWords()[0].en);
    await montar();
    await page.waitForTimeout(600);   // o auto-check confere e paga
    const pago = await page.evaluate(() => getLessonProgress(currentLesson.id).xpEarned);
    await page.click('.tool-tab[data-tool="vocab"]');
    await page.click('.tool-tab[data-tool="scramble"]');
    const naTela = await page.evaluate(() => getScrambleWords()[scrambleIdx].en);
    if (naTela === primeira) { await montar(); await page.waitForTimeout(600); }
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => scrambleIdx)).toBe(1);
    expect(await page.evaluate(() => getLessonProgress(currentLesson.id).xpEarned)).toBe(pago);
  });
});

test.describe('Phrase Path (phrase_path_game.html)', () => {
  async function montarFrase(page) {
    await page.evaluate(() => {
      const palavras = PHRASES[order[step]];
      palavras.forEach((_, i) => document.querySelector(`#bank button[data-i="${i}"]`).click());
    });
  }

  test('dois toques em "Conferir frase" pagam a frase uma vez e não pulam a próxima', async ({ page }) => {
    await entrarComoAluna(page);
    await page.goto('/phrase_path_game.html');
    await montarFrase(page);
    await page.dblclick('#check');
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => step)).toBe(1);
    expect(await page.evaluate(() => points)).toBe(12);
    await expect(page.locator('#round')).toHaveText('2 / 7');
  });

  test('na última frase, dois toques terminam a trilha com o XP uma vez', async ({ page }) => {
    await entrarComoAluna(page);
    await page.goto('/phrase_path_game.html');
    await page.evaluate(() => { step = 6; points = 72; render(); });
    const antes = await xpDaAluna(page);
    await montarFrase(page);
    await page.dblclick('#check');
    await expect(page.getByText('Trilha completa!')).toBeVisible();
    await page.waitForTimeout(1500);
    expect(await xpDaAluna(page) - antes).toBe(84);
  });
});

test.describe('Forest Puzzle (forest_puzzle_game.html)', () => {
  test('acertar e tocar em "Check" paga a palavra uma vez e não pula a próxima', async ({ page }) => {
    await entrarComoAluna(page);
    await page.goto('/forest_puzzle_game.html');
    await page.evaluate(() => {
      const usadas = new Set();
      for (const letra of currentWord) {
        const i = currentScramble.findIndex((l, k) => l === letra && !usadas.has(k));
        usadas.add(i);
        pickLetter(document.getElementById(`tile-${i}`));
      }
    });
    await page.click('button:has-text("Check")');
    await page.waitForTimeout(2500);
    expect(await page.evaluate(() => round)).toBe(1);
    expect(await page.evaluate(() => score)).toBe(15);
    await expect(page.locator('#round-display')).toContainText('Word 2 /');
  });
});

test.describe('Word Scramble (word_scramble_game.html)', () => {
  // Monta a palavra certa tocando nas peças, como o aluno faz.
  async function montarPalavra(page) {
    await page.evaluate(() => {
      const palavra = shuffledWords[wordIdx].word;
      const usadas = new Set();
      for (const letra of palavra) {
        const peca = [...document.querySelectorAll('#tiles-row .tile')]
          .find(t => t.textContent === letra && !usadas.has(t.id));
        usadas.add(peca.id);
        peca.click();
      }
    });
  }

  test('acertar e tocar em "Check" paga a palavra uma vez e não pula a próxima', async ({ page }) => {
    await entrarComoAluna(page);
    await page.goto('/word_scramble_game.html');
    await montarPalavra(page);
    await page.click('button:has-text("Check")');
    await page.waitForTimeout(2200);
    expect(await page.evaluate(() => wordIdx)).toBe(1);
    expect(await page.evaluate(() => score)).toBe(25);
  });

  test('na última palavra, "Check" depois do acerto termina o jogo uma vez só (XP uma vez)', async ({ page }) => {
    await entrarComoAluna(page);
    await page.goto('/word_scramble_game.html');
    await page.evaluate(() => { wordIdx = shuffledWords.length - 1; loadWord(); });
    const antes = await xpDaAluna(page);
    await montarPalavra(page);
    await page.click('button:has-text("Check")');
    await expect(page.locator('#fin')).toHaveCount(1);
    await page.waitForTimeout(2000);
    await expect(page.locator('#fin')).toHaveCount(1);
    expect(await xpDaAluna(page) - antes).toBe(10);
  });

  test('"Skip" tocado duas vezes pula uma palavra só', async ({ page }) => {
    await entrarComoAluna(page);
    await page.goto('/word_scramble_game.html');
    await page.click('button:has-text("Skip")');
    await page.click('button:has-text("Skip")');
    await page.waitForTimeout(2000);
    expect(await page.evaluate(() => wordIdx)).toBe(1);
  });
});
