// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { messageSquare } from 'react-icons-kit/feather/messageSquare';

import DetectActive from '../DetectActive';

import { openWindow } from '../../services/shell.service';
import { IN_APP_FEEDBACK_URL } from '../../config/app';
import { COLORS } from '../../constants';

type Props = {
  size: number,
  color: string,
  hoverColor: string,
};

class FeedbackButton extends PureComponent<Props> {
  static defaultProps = {
    size: 36,
    color: COLORS.gray[400],
    hoverColor: COLORS.purple[500],
  };

  render() {
    const { color, hoverColor, size } = this.props;
    return (
      <DetectActive>
        {(_, isHovered) => (
          <Wrapper color={isHovered ? hoverColor : color}>
            <IconBase
              size={size}
              icon={messageSquare}
              onClick={() => openWindow(IN_APP_FEEDBACK_URL)}
            />
          </Wrapper>
        )}
      </DetectActive>
    );
  }
}

const Wrapper = styled.div`
  position: fixed;
  width: 40px;
  height: 40px;
  right: 20px;
  bottom: 20px;
  color: ${props => props.color};
  z-index: 1;
`;

export default FeedbackButton;
