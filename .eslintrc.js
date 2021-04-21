// eslint-disable-next-line no-undef
module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'plugins': ['react'],
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'camelcase': 'error',
        'eol-last': 'error',
        'eqeqeq': 'error',
        'jsx-quotes': ['error', 'prefer-single'],
        'no-var': 'error',
        'no-tabs': 'error',
        'newline-before-return': 'error',
        'arrow-body-style': 'error',
        'array-bracket-newline': 'error',
        'array-bracket-spacing': 'error',
        'prefer-const': 'error',
        'arrow-spacing': 'error',
        'space-before-blocks': 'error',
        'spaced-comment': 'error',
        'keyword-spacing': 'error'
    }
};
