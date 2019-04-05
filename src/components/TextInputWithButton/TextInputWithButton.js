// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { moreHorizontal } from 'react-icons-kit/feather/moreHorizontal';

import { RAW_COLORS } from '../../constants';

import TextInput from '../TextInput';
import HoverableOutlineButton from '../HoverableOutlineButton';

type Props = {
  value: string,
  handleFocus: string => void,
  onChange: string => void,
  onClick: () => void,
  onFocus: string => void,
  isFocused?: boolean,
  icon: React$Node,
};

class TextInputWithButton extends PureComponent<Props> {
  static defaultProps = {
    value: '',
    onFocus: () => {},
    icon: moreHorizontal,
  };

  render() {
    const { onChange, onClick, icon, ...delegated } = this.props;

    return (
      <Wrapper>
        <TextInput {...delegated} onChange={ev => onChange(ev.target.value)}>
          <HoverableOutlineButton
            noPadding
            onMouseDown={() =>
              window.requestAnimationFrame(delegated.handleFocus)
            }
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
  color: ${RAW_COLORS.gray[400]};
`;

const ButtonPositionAdjuster = styled.div`
  transform: translateY(2px);
`;

export default TextInputWithButton;
