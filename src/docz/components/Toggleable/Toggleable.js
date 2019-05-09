// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Toggle as ToggleState } from 'react-powerplug';
import FillButton from '../../../components/Button/FillButton';

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

export default Toggleable;

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.background};
  border-radius: 50%;
`;
