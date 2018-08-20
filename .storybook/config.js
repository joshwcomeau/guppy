/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import React from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import '../src/global-styles';
import { COLORS } from '../src/constants';
import Wrapper from './components/Wrapper';

const WrapperDecorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

addDecorator(WrapperDecorator);

// This project colocates stories and other files with their original
// components. Structured like:
//
// - Button
// --- Button.js
// --- Button.helpers.js
// --- Button.stories.js
function loadStories() {
  const components = require.context('../src/components', true, /.stories.js$/);
  components.keys().forEach(filename => components(filename));
}

configure(loadStories, module);
