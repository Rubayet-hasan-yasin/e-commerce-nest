module.exports = {
  preset: 'ts-jest',                // Use ts-jest for TypeScript
  testEnvironment: 'node',          // Node environment
  rootDir: '.',                     // Project root
  testRegex: '.*\\.spec\\.ts$',     // Match all .spec.ts files
  moduleFileExtensions: ['js', 'json', 'ts'],
  collectCoverageFrom: ['src/**/*.(t|j)s'], // Coverage only from src
  coverageDirectory: './coverage',  // Output coverage here
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Map 'src/...' imports
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
