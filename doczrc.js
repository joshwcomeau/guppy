// @flow
import { RAW_COLORS } from './src/constants';
import { css } from 'docz-plugin-css';

export default {
  title: 'Guppy',
  description: 'A friendly application manager and task runner for React.js',
  src: './src',
  public: './public',
  theme: 'docz-theme-default',
  themeConfig: {
    logo: {
      src: '/public/icon.png',
      width: 70,
    },
    colors: {
      primary: RAW_COLORS.blue[700],
    },
    styles: {
      // docz-theme-default global body styles (specifically, line-height) is interfering with
      // xsmall btn component. This is a hacky override so btns get a line-height of 1.
      body: `
        font-family: "Source Sans Pro", sans-serif;
        font-size: 16px;
        line-height: 1;
        p, a, h1, h2, h3, h4, table {
          line-height: 1.6;
        }
      `,
    },
  },
  plugins: [css()],
  menu: ['Guppy Style Guide', 'Components', 'Reusable Components', 'Colors'],
};
