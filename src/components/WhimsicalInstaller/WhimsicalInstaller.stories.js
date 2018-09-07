// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Showcase from '../../../.storybook/components/Showcase';
import File from './File';
import Folder from './Folder';
import WhimsicalInstaller from './WhimsicalInstaller';

storiesOf('WhimsicalInstaller', module)
  .add('default (600px)', () => (
    <Wrapper width={600} height={300}>
      <WhimsicalInstaller width={600} />
    </Wrapper>
  ))
  .add('Tiny (200px)', () => (
    <Wrapper width={200} height={100}>
      <WhimsicalInstaller width={200} />
    </Wrapper>
  ))
  .add('Large (1000px)', () => (
    <Wrapper width={1000} height={500}>
      <WhimsicalInstaller width={1000} />
    </Wrapper>
  ));

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: ${COLORS.blue[700]};
`;
