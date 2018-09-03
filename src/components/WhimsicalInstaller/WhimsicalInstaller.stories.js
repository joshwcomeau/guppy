// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Showcase from '../../../.storybook/components/Showcase';
import File from './File';
import Folder from './Folder';

storiesOf('WhimsicalInstaller', module).add(
  'components',
  withInfo()(() => (
    <Fragment>
      <Showcase label="File">
        <Wrapper>
          <File x={10} y={10} />
        </Wrapper>
      </Showcase>
      <Showcase label="Folder">
        <Wrapper>
          <Folder size={60} />
        </Wrapper>
      </Showcase>
    </Fragment>
  ))
);

const Wrapper = styled.div`
  position: relative;
  padding: 10px;
  width: 100px;
  height: 100px;
  background: ${COLORS.blue[700]};
`;
