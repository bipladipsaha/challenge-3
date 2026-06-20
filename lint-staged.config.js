module.exports = {
  'frontend/**/*.{js,jsx,ts,tsx}': ['npm run lint --workspace=frontend', 'prettier --write'],
  'backend/**/*.{js,ts}': ['npm run lint --workspace=backend', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
