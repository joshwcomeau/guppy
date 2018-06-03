// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

import { COLORS } from '../../constants';

type Props = {
  isToggled: boolean,
  size: number,
  padding: number,
  onToggle: (isToggled: boolean) => void,
};

class Toggle extends PureComponent<Props> {
  static defaultProps = {
    size: 32,
    padding: 2,
  };

  lastTranslateVal: ?number = null;
  lastFrameTime: ?number = null;

  renderBall = ({ translate }: { translate: number }) => {
    const { size } = this.props;

    if (this.lastTranslateVal == null || this.lastFrameTime == null) {
      this.lastTranslateVal = translate;
      this.lastFrameTime = performance.now();
      return <Ball size={size} translate={translate} stretch={1} />;
    }

    const now = performance.now();

    const translateDelta = Math.abs(this.lastTranslateVal - translate);
    const timeDelta = now - this.lastFrameTime;

    this.lastTranslateVal = translate;
    this.lastFrameTime = now;

    const timeAdjustment = 1 / (timeDelta / 16.666);

    const stretch = translateDelta / 40;

    return (
      <Ball
        size={size}
        translate={translate}
        stretch={1 + stretch * timeAdjustment}
      />
    );
  };

  render() {
    const { isToggled, size, padding, onToggle } = this.props;
    const doublePadding = padding * 2;

    return (
      <Wrapper
        height={size + doublePadding}
        width={size * 2 + doublePadding}
        padding={padding}
        onClick={() => onToggle(!isToggled)}
      >
        <OnBackground isVisible={isToggled} />
        <Motion
          style={{
            translate: spring(isToggled ? 100 : 0, {
              stiffness: 220,
              damping: 19,
            }),
          }}
        >
          {this.renderBall}
        </Motion>
      </Wrapper>
    );
  }
}

const Wrapper = styled.button`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  padding: ${props => props.padding}px;
  border: none;
  border-radius: ${props => props.height / 2}px;
  background-image: linear-gradient(
    45deg,
    ${COLORS.gray[400]},
    ${COLORS.gray[200]}
  );
  overflow: hidden; /* Hide 'OnBackground' corners */
  outline: none; /* TODO: better a11y story */
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
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
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.2);
`;

const Ball = styled.div.attrs({
  style: props => ({
    transform: `
      translateX(${props.translate}%)
      scaleX(${props.stretch})
    `,
  }),
})`
  position: relative;
  z-index: 2;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${COLORS.white};
  border-radius: 50%;

  transform-origin: center center;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
`;

export default Toggle;
