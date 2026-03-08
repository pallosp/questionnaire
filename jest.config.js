import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });
const config = createJestConfig({
  testEnvironment: 'jest-environment-jsdom',
  clearMocks: true,
});

export default config;
