/** @type {import("stylelint").Config} */
const config = {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: {
    // Disabled to prevent conflicts with stylelint-config-clean-order
    // when formatting multi-line declarations.
    'declaration-empty-line-before': null,
  },
};

export default config;
