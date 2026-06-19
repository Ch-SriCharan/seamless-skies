export default {
  testEnvironment: 'jsdom',
  // Run the polyfill setup before tests
  setupFiles: ['<rootDir>/src/__mocks__/setupTests.cjs'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|ico)$': '<rootDir>/src/__mocks__/fileMock.cjs',
    '^leaflet(.*)$': '<rootDir>/src/__mocks__/leafletMock.cjs',
    '^react-leaflet(.*)$': '<rootDir>/src/__mocks__/leafletMock.cjs',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: ['/node_modules/(?!(.*\\.mjs$))'],
};
