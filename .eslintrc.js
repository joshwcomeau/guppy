module.exports = {
  extends: ['react-app', 'plugin:jest/recommended'],
  parserOptions: {
    ecmaVersion: 2015,
  },
  rules: {
    'no-unused-vars': 1,
    'no-shadow': 2,
    'flowtype/require-valid-file-annotation': [
      2,
      'always',
      {
        annotationStyle: 'line',
      },
    ],
    'flowtype/space-after-type-colon': 0,
    'flowtype/generic-spacing': 0,
    'jest/no-large-snapshots': ['warn', { maxSize: 100 }],
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'flowtype/require-valid-file-annotation': 0,
      },
    },
  ],
};
