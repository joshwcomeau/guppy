const path = require('path');
const webpackConfig = require('../config/webpack.config.dev');

module.exports = (baseConfig, configType, defaultConfig) => {
  defaultConfig.module.rules.shift();

  defaultConfig.module.rules.unshift(webpackConfig.module.rules[1]);

  // defaultConfig.module.rules.push({
  //   test: /\.scss$/,
  //   loaders: ['style-loader', 'css-loader', 'sass-loader'],
  //   include: path.resolve(__dirname, '../')
  // });

  return defaultConfig;
};
