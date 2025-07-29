import tseslint from 'typescript-eslint';

import pluginSecurity from 'eslint-plugin-security';

export default tseslint.config(tseslint.configs.strict, tseslint.configs.stylistic, pluginSecurity.configs.recommended, {
    extends: ['../../configs/eslint/base.js'],
    ignores: ['tests/**', 'dist/**'],
    rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-require-imports': 'off',
    },
});
