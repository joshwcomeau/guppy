// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { moreHorizontal } from 'react-icons-kit/feather/moreHorizontal';

import { COLORS } from '../../constants';

import TextInput from '../TextInput';

type Props = {
  value: string,
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
    const { onChange, onClick, icon, ...props } = this.props;

    return (
      <Wrapper>
        <TextInput {...props} onChange={ev => onChange(ev.target.value)}>
          <ButtonPositionAdjuster>
            <IconWrapper onClick={onClick}>
              <IconBase size={22} icon={icon} />
            </IconWrapper>
          </ButtonPositionAdjuster>
        </TextInput>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  color: ${COLORS.gray[400]};
`;

const ButtonPositionAdjuster = styled.div`
  transform: translateY(-2px);
`;

// const DirectoryButton = styled(TextButton)`
//   color: ${COLORS.gray[600]};
//   text-decoration: none;

//   &:after {
//     content: '';
//     display: block;
//     padding-top: 6px;
//     border-bottom: 2px solid ${COLORS.gray[600]};
//   }

//   &:hover:after {
//     content: '';
//     display: block;
//     border-bottom: 2px solid ${COLORS.purple[700]};
//   }
// `;

const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${COLORS.gray[400]};
  border-radius: 50%;
  color: ${COLORS.gray[400]};
  cursor: pointer;

  &:hover {
    color: ${COLORS.purple[500]};
    border-color: ${COLORS.purple[500]};
  }
`;

export default TextInputWithButton;
