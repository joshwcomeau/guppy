// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { moreHorizontal } from 'react-icons-kit/feather/moreHorizontal';

import { COLORS } from '../../constants';

import TextInput from '../TextInput';
import HoverableOutlineButton from '../HoverableOutlineButton';

type Props = {
  value: string,
  handleFocus: string => void,
  onClick: () => void,
  onChange: string => void,
  isFocused?: boolean,
  onFocus: string => void,
  icon: React$Node,
};

class TextInputWithButton extends PureComponent<Props> {
  static defaultProps = {
    value: '',
    onFocus: () => {},
    icon: moreHorizontal,
  };

  render() {
    const { onChange, onClick, icon, handleFocus, ...props } = this.props;

    return (
      <Wrapper>
        <TextInput {...props} onChange={ev => onChange(ev.target.value)}>
          <HoverableOutlineButton
            noPadding
            onMouseDown={() => window.requestAnimationFrame(handleFocus)}
            onClick={onClick}
            style={{ width: 32, height: 32 }}
          >
            <ButtonPositionAdjuster>
              <IconBase size={22} icon={icon} />
            </ButtonPositionAdjuster>
          </HoverableOutlineButton>
        </TextInput>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  color: ${COLORS.gray[400]};
`;

const ButtonPositionAdjuster = styled.div`
  transform: translateY(2px);
`;

export default TextInputWithButton;
