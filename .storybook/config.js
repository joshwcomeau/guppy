/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import React from 'react';
import { configure, addDecorator } from '@storybook/react';

import { COLORS } from '../src/constants';
import Wrapper from './components/Wrapper';

import '../src/global-styles';

const WrapperDecorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

addDecorator(WrapperDecorator);

function loadStories() {
  const stories = require.context('../src', true, /.stories.js$/);

  stories.keys().forEach(filename => stories(filename));
}

configure(loadStories, module);
