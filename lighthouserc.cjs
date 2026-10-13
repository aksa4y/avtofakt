module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node .output/server/index.mjs',
      startServerReadyPattern: 'Listening',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/stations',
        'http://localhost:3000/calculator',
      ],
      numberOfRuns: 3,
      settings: { formFactor: 'mobile', chromeFlags: '--no-sandbox' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './lighthouse-reports' },
  },
}
