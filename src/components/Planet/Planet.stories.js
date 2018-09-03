import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import Planet from './Planet';
import Earth from '../Earth';

storiesOf('Planet', module)
  .add('Basic', () => (
    <Space>
      <Planet
        atmosphere={0.25}
        background="linear-gradient(0deg, red, yellow)"
      />
    </Space>
  ))
  .add('Earth', () => (
    <Space>
      <Earth />
    </Space>
  ));

const Space = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(26, 17, 81);
`;
