module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js', 'jest-canvas-mock'],
  testEnvironmentOptions: { resources: 'usable' },
};
