const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['security.spec.js', 'turkish.spec.js', 'gramatica-slides.spec.js', 'analytics.spec.js', 'licao-de-casa.spec.js', 'homework-plus.spec.js', 'preparacao.spec.js', 'typing.spec.js', 'trilha-teste-de-nivel.spec.js', 'quadro-chat.spec.js'],
  timeout: 30_000,
  // Na CI, a falha também vira anotação no PR (o log bruto nem sempre é acessível).
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: { baseURL: 'http://127.0.0.1:8765', trace: 'retain-on-failure' },
  webServer: {
    command: 'node scripts/dev-server.js',
    url: 'http://127.0.0.1:8765',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
