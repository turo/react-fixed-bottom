module.exports = {
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
    '~test/(.*)': '<rootDir>/test/$1',
  },
  preset: 'ts-jest',
};
