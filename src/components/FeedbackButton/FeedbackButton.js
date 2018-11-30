// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { messageSquare } from 'react-icons-kit/feather/messageSquare';
import { Spring, animated, interpolate } from 'react-spring';

import { openWindow } from '../../services/shell.service';
import { IN_APP_FEEDBACK_URL } from '../../config/app';
import { COLORS } from '../../constants';

type Props = {
  size: number,
  color: string,
  hoverColor: string,
};

type State = {
  hovered: boolean,
};

class FeedbackButton extends PureComponent<Props, State> {
  static defaultProps = {
    size: 28,
    color: COLORS.gray[400],
    hoverColor: COLORS.purple[500],
  };

  state = {
    hovered: false,
  };

  handleMouseOver = () => {
    this.setState({
      hovered: true,
    });
  };
  handleMouseLeave = () => {
    this.setState({
      hovered: false,
    });
  };

  render() {
    const { color, hoverColor, size } = this.props;
    return (
      <Spring
        config={{
          tension: 200,
          friction: 25,
          precision: 0.01,
        }}
        to={{ hovered: this.state.hovered ? 1.0 : 0 }}
      >
        {({ hovered }) => (
          <Wrapper
            onMouseLeave={this.handleMouseLeave}
            onMouseOver={this.handleMouseOver}
            onClick={() => openWindow(IN_APP_FEEDBACK_URL)}
          >
            <Text hovered={hovered}>Feedback</Text>
            <Icon
              size={size}
              icon={messageSquare}
              hovered={hovered}
              color={color}
              hovercolor={hoverColor}
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
  z-index: +1;
`;

const Text = styled.div.attrs(props => ({
  style: {
    paddingRight: `${props.hovered * 125 + 5}px`,
    opacity: props.hovered ? 1.0 : 0,
  },
}))`
  position: absolute;
  display: inline-block;
  right: 1px;
  padding-left: 10px;
  width: 50px;
  bottom: 0;
  font-size: 16px;
  line-height: 50px;
  border-radius: 25px;
  background: ${COLORS.gray[200]};
  z-index: -1;
  transform-origin: center right;
  overflow: hidden;
  cursor: pointer;
  user-select: none; /* diable text-selection */
`;

const Icon = styled(IconBase).attrs(props => ({
  size: props.size,
  style: {
    transform: `scale(${props.hovered / 5 + 1}, ${props.hovered / 5 + 1})`,
  },
}))`
  width: 50px;
  height: 50px;
  line-height: 50px;
  background: ${COLORS.white};
  color: ${props => (!!props.hovered ? props.hovercolor : props.color)};
  border-radius: 50% 50%;
  border: 2px solid ${COLORS.gray[200]};
  cursor: pointer;
  & > svg {
    transform-origin: center center;
    transform: translateY(-2px); /* slightly move icon up */
  }
`;

export default FeedbackButton;
