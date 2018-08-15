/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure, setAddon, addDecorator } from '@storybook/react';
import '../src/global-styles';

const components = require.context('../src/components', true, /.stories.js$/);

function loadStories() {
  components.keys().forEach(filename => components(filename));
}

configure(loadStories, module);
