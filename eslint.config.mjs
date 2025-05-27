import tseslint from 'typescript-eslint';

import eslint from '@eslint/js';
import pluginSecurity from 'eslint-plugin-security';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    pluginSecurity.configs.recommended,
    {
        ignores: ['tests/**', 'dist/**'],
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-extraneous-class': 'off',
        },
    },
);
