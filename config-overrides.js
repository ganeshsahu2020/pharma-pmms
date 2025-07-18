const { override, addPostCssPlugins } = require('customize-cra');

module.exports = override(
  addPostCssPlugins([
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ])
);
