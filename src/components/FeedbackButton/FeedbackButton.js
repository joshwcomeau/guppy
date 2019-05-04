// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { messageSquare } from 'react-icons-kit/feather/messageSquare';
import { Spring, animated, interpolate } from 'react-spring';
import { shell } from 'electron';

import { IN_APP_FEEDBACK_URL } from '../../config/app';
import { RAW_COLORS, COLORS } from '../../constants';

type Props = {
  size: number,
  color: string,
  hoverColor: string,
};

type State = {
  isHovered: boolean,
};

class FeedbackButton extends PureComponent<Props, State> {
  static defaultProps = {
    size: 28,
    color: COLORS.lightText,
    hoverColor: RAW_COLORS.purple[500],
  };

  state = {
    isHovered: false,
  };

  handleMouseEnter = () => {
    this.setState({
      isHovered: true,
    });
  };
  handleMouseLeave = () => {
    this.setState({
      isHovered: false,
    });
  };

  render() {
    const { color, hoverColor, size, ...delegatedProps } = this.props;
    const { isHovered } = this.state;

    return (
      <Spring
        native
        config={{
          tension: 190,
          friction: 40,
        }}
        to={{ hovered: isHovered ? 1.0 : 0 }}
      >
        {interpolated => (
          <Wrapper
            native
            {...delegatedProps}
            onClick={() => shell.openExternal(IN_APP_FEEDBACK_URL)}
            onMouseLeave={this.handleMouseLeave}
          >
            <SliderWrapper
              style={{
                cursor: isHovered ? 'pointer' : 'auto',
                width: interpolate(
                  [interpolated.hovered],
                  pos => pos * 100 + 45 + 'px'
                ),
              }}
            >
              <SliderBox
                hovered={interpolated.hovered}
                style={{
                  transform: interpolate(
                    [interpolated.hovered],
                    scale => `scale(${Math.max(scale * 200, 1)}, 1)`
                  ),
                  opacity: interpolate(
                    [interpolated.hovered],
                    opacity => opacity
                  ),
                }}
              />
              <Text
                style={{
                  transform: interpolate(
                    [interpolated.hovered],
                    pos => `translateX(-${Math.max(pos * 110, 5)}px)`
                  ),
                }}
              >
                Feedback
              </Text>
            </SliderWrapper>
            <Icon
              size={size}
              icon={messageSquare}
              style={{
                transform: interpolate(
                  [interpolated.hovered],
                  scale => `scale(${scale / 5 + 1}, ${scale / 5 + 1})`
                ),
              }}
              color={!!isHovered ? hoverColor : color}
              onMouseEnter={this.handleMouseEnter}
            />
          </Wrapper>
        )}
      </Spring>
    );
  }
}

const Wrapper = styled.div`
  position: fixed;
  right: 15px;
  bottom: 15px;
  width: 50px;
  height: 50px;
  text-align: center;
  z-index: 1;
`;

const SliderBox = animated(styled.div`
  position: absolute;
  right: -25px;
  width: 1px; /* small width so it hides behind wrapper - not 0 because we need something to scale*/
  height: 50px;
  background: ${RAW_COLORS.gray[200]};
  z-index: -1;
  transform-origin: center right;
`);

const SliderWrapper = animated(styled.div`
  position: absolute;
  right: 0;
  width: 45px;
  height: 50px;
  overflow: hidden;
  border-radius: 25px;
  user-select: none; /* diable text-selection */
`);

const Text = animated(styled.div`
  position: absolute;
  right: -50px;
  padding-left: 10px;
  font-size: 18px;
  line-height: 50px;
`);

const Icon = animated(styled(IconBase)`
  width: 50px;
  height: 50px;
  background: ${RAW_COLORS.white};
  color: ${props => props.color};
  border-radius: 50% 50%;
  border: 2px solid ${RAW_COLORS.gray[200]};
  cursor: pointer;
`);

export default FeedbackButton;
