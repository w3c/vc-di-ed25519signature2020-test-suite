module.exports = {
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    'eslint-config-digitalbazaar',
    'eslint-config-digitalbazaar/jsdoc',
    'digitalbazaar/module',
  ],
  rules: {
    'jsdoc/check-examples': 0
  }
};
