/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import React from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import styled from 'styled-components';

import '../src/global-styles';
import { COLORS } from '../src/constants';

const OuterWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const InnerWrapper = styled.div`
  background: ${COLORS.white};
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin: 2rem;
  padding: 1.5rem;
  max-width: 1100px;
  border-radius: 4px;
`;

const WrapperDecorator = storyFn => (
  <OuterWrapper>
    <InnerWrapper>{storyFn()}</InnerWrapper>
  </OuterWrapper>
);

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
