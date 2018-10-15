module.exports = {
  extends: 'react-app',
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
  },
};
