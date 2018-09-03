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
  .add('components', () => (
    <Fragment>
      <Showcase label="File">
        <Wrapper width={100} height={100}>
          <File id="file" x={50} y={50} />
        </Wrapper>
      </Showcase>
      <Showcase label="Folder">
        <Wrapper width={100} height={100}>
          <Folder size={60} />
        </Wrapper>
      </Showcase>
    </Fragment>
  ))
  .add('All together', () => (
    <Wrapper width={600} height={200}>
      <WhimsicalInstaller width={600} />
    </Wrapper>
  ));

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: ${COLORS.blue[700]};
`;
