// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Label from '../Label';

type Props = {
  label: string,
  useLabelTag?: boolean,
  isFocused?: boolean,
  hasError?: boolean,
  children: React$Node,
};

class FormField extends PureComponent<Props> {
  render() {
    const { label, useLabelTag, isFocused, hasError, children } = this.props;

    const Wrapper = useLabelTag ? WrapperLabel : WrapperDiv;

    return (
      <Wrapper>
        <LabelText isFocused={isFocused} hasError={hasError}>
          {label}
        </LabelText>
        <Children>{children}</Children>
      </Wrapper>
    );
  }
}

const getTextColor = (props: Props) => {
  if (props.hasError) {
    return COLORS.pink[500];
  } else if (props.isFocused) {
    return COLORS.purple[700];
  } else {
    return COLORS.gray[500];
  }
};

const WrapperLabel = styled.label`
  display: block;
  margin-bottom: 30px;
`;

const WrapperDiv = styled.div`
  margin-bottom: 30px;
`;

const LabelText = styled(Label)`
  flex-basis: ${props => props.width}px;
  color: ${getTextColor};
  padding: 0px 5px;
`;

const Children = styled.div`
  flex: 1;
  padding: 0px 5px 5px;
`;

export default FormField;
