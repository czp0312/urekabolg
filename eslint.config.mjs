import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  astro: true,
  ignores: ['src/content/**', 'public/**'],
  rules: {
    'e18e/prefer-static-regex': 'off',
  },
})
