/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import React from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import styled from 'styled-components';
import '../src/global-styles';

const Wrapper = styled.div`
  padding: 1em;
`;

const WrapperDecorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

addDecorator(WrapperDecorator);

const components = require.context('../src/components', true, /.stories.js$/);

function loadStories() {
  components.keys().forEach(filename => components(filename));
}

configure(loadStories, module);
