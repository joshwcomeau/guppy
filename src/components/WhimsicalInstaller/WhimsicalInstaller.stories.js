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
  .add('default (400px)', () => (
    <Wrapper width={400} height={200}>
      <WhimsicalInstaller width={400} />
    </Wrapper>
  ))
  .add('Tiny (200px)', () => (
    <Wrapper width={200} height={100}>
      <WhimsicalInstaller width={200} />
    </Wrapper>
  ))
  .add('Large (600px)', () => (
    <Wrapper width={600} height={300}>
      <WhimsicalInstaller width={600} />
    </Wrapper>
  ));

const Wrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: ${COLORS.blue[700]};
`;
