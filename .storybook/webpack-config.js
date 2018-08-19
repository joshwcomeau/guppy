const path = require('path');
const webpackConfig = require('../config/webpack.config.dev');

module.exports = (baseConfig, configType, defaultConfig) => {
  // Storybook uses its own Webpack config. For consistency, we want to use
  // the same JS config as we use in Guppy's Webpack config.
  const guppyJsConfig = webpackConfig.module.rules[1];

  defaultConfig.module.rules.shift();
  defaultConfig.module.rules.unshift(guppyJsConfig);

  return defaultConfig;
};
