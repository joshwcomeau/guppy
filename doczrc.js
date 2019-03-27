// @flow
import { COLORS } from './src/constants';
import { css } from 'docz-plugin-css';

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
  plugins: [css()],
  menu: ['Guppy Style Guide', 'Components', 'Reusable Components', 'Shared'],
};
