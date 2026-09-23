const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['security.spec.js', 'turkish.spec.js'],
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:8765', trace: 'retain-on-failure' },
  webServer: {
    command: 'node scripts/dev-server.js',
    url: 'http://127.0.0.1:8765',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
