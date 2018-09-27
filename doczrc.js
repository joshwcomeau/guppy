import { COLORS } from './src/constants';

export default {
  title: 'Guppy',
  description: 'A friendly application manager and task runner for React.js',
  src: './src',
  theme: 'docz-theme-default',
  themeConfig: {
    colors: {
      primary: COLORS.blue[700],
    },
  },
  modifyBundlerConfig: config => {
    config.module.rules.push({
      test: /\.css/i,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
          },
        },
      ],
    });

    return config;
  },
};
