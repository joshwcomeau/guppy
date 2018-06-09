// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Label from '../Label';

type Props = {
  label: string,
  useLabelTag: boolean,
  isFocused: boolean,
  children: React$Node,
};

class FormField extends Component<Props> {
  render() {
    const { label, useLabelTag, isFocused, children } = this.props;

    const Wrapper = useLabelTag ? WrapperLabel : WrapperDiv;

    return (
      <Wrapper>
        <LabelText isFocused={isFocused}>{label}</LabelText>
        <Children>{children}</Children>
      </Wrapper>
    );
  }
}

const WrapperLabel = styled.label`
  display: block;
  margin-bottom: 30px;
`;

const WrapperDiv = styled.div`
  margin-bottom: 30px;
`;

const LabelText = styled(Label)`
  flex-basis: ${props => props.width}px;
  color: ${props => (props.isFocused ? COLORS.purple[700] : COLORS.gray[500])};
  padding: 0px 5px;
`;

const Children = styled.div`
  flex: 1;
  padding: 0px 5px 5px;
`;

export default FormField;
