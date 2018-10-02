/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import React, { Fragment } from 'react';
import { configure, addDecorator } from '@storybook/react';

import { COLORS } from '../src/constants';
import Wrapper from './components/Wrapper';

import GlobalStyles from '../src/components/GlobalStyles';

const WrapperDecorator = storyFn => (
  <Fragment>
    <GlobalStyles />
    <Wrapper>{storyFn()}</Wrapper>
  </Fragment>
);

addDecorator(WrapperDecorator);

function loadStories() {
  const stories = require.context('../src', true, /.stories.js$/);

  stories.keys().forEach(filename => stories(filename));
}

configure(loadStories, module);
