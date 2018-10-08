// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { Toggle as ToggleState } from 'react-powerplug';

import Showcase from '../../../.storybook/components/Showcase';
import CircularOutline from './CircularOutline';
import FillButton from '../Button/FillButton';
import styled from 'styled-components';

type Props = {
  size: number,
  background?: string,
  children: (isShown: boolean) => React$Node,
};
const Toggleable = ({ size, background = '#EEE', children }: Props) => (
  <ToggleState>
    {({ on, toggle }) => (
      <Fragment>
        <Wrapper background={background} size={size}>
          {children(on)}
        </Wrapper>
        <br />
        <br />
        <FillButton colors={['#333']} onClick={toggle}>
          Toggle
        </FillButton>
      </Fragment>
    )}
  </ToggleState>
);

storiesOf('CircularOutline', module).add(
  'default',
  withInfo()(() => (
    <Fragment>
      <Showcase label="Default">
        <Toggleable size={40}>
          {isShown => <CircularOutline size={40} isShown={isShown} />}
        </Toggleable>
      </Showcase>
      <Showcase label="Larger">
        <Toggleable size={70}>
          {isShown => (
            <CircularOutline size={70} strokeWidth={4} isShown={isShown} />
          )}
        </Toggleable>
      </Showcase>
      <Showcase label="Single color">
        <Toggleable size={40} background="#555">
          {isShown => (
            <CircularOutline colors={['yellow']} size={40} isShown={isShown} />
          )}
        </Toggleable>
      </Showcase>
      <Showcase label="Two colors">
        <Toggleable size={40} background="#555">
          {isShown => (
            <CircularOutline
              colors={['yellow', 'hotpink']}
              size={40}
              isShown={isShown}
            />
          )}
        </Toggleable>
      </Showcase>
      <Showcase label="Three colors">
        <Toggleable size={40} background="#555">
          {isShown => (
            <CircularOutline
              colors={['yellow', 'hotpink', 'purple']}
              size={40}
              isShown={isShown}
            />
          )}
        </Toggleable>
      </Showcase>
    </Fragment>
  ))
);

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.background};
  border-radius: 50%;
`;
