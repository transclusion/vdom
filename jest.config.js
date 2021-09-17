module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'esbuild-jest',
      {
        jsxFactory: 'createVElement',
        sourcemap: true,
      },
    ],
  },
}
