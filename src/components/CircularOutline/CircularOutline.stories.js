// @flow
import React, { Fragment, Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { Toggle as ToggleState } from 'react-powerplug';

import Showcase from '../../../.storybook/components/Showcase';
import CircularOutline from './CircularOutline';
import FillButton from '../Button/FillButton';
import styled from 'styled-components';

storiesOf('CircularOutline', module).add(
  'default',
  withInfo()(() => (
    <Showcase label="Toggleable">
      <ToggleState>
        {({ on, toggle }) => (
          <Fragment>
            <Wrapper>
              <CircularOutline size={40} strokeWidth={2} isShown={on} />
            </Wrapper>

            <br />
            <br />
            <FillButton colors={['#333']} onClick={toggle}>
              Toggle
            </FillButton>
          </Fragment>
        )}
      </ToggleState>
    </Showcase>
  ))
);

const Wrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  background: #eee;
  border-radius: 50%;
`;
