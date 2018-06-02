// @flow
import React from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

import { COLORS } from '../../constants';

type Props = {
  isToggled: boolean,
  size: number,
  padding: number,
  onToggle: (isToggled: boolean) => void,
};

const Toggle = ({ isToggled, size, padding, onToggle }: Props) => {
  const doublePadding = padding * 2;
  return (
    <Wrapper
      height={size + doublePadding}
      width={size * 2 + doublePadding}
      padding={padding}
      onClick={() => onToggle(!isToggled)}
    >
      <OnBackground isVisible={isToggled} />
      <Motion style={{ translate: spring(isToggled ? 100 : 0) }}>
        {({ translate }) => <Ball size={size} translate={translate} />}
      </Motion>
    </Wrapper>
  );
};

Toggle.defaultProps = {
  size: 24,
  padding: 2,
};

const Wrapper = styled.button`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  padding: ${props => props.padding}px;
  border: none;
  border-radius: ${props => props.height / 2}px;
  background-color: ${COLORS.gray[200]};
  overflow: hidden; /* Hide 'OnBackground' corners */
  outline: none; /* TODO: better a11y story */
`;

const OnBackground = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    15deg,
    ${COLORS.blue[700]},
    ${COLORS.teal[500]}
  );
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transition: opacity 300ms;
`;

const Ball = styled.div`
  position: relative;
  z-index: 2;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${COLORS.white};
  border-radius: 50%;
  transform: translateX(${props => props.translate}%);
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
`;

export default Toggle;
