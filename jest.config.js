import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });
const config = createJestConfig({ testEnvironment: 'jest-environment-jsdom' });

export default config;
