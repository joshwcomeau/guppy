// @flow
import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  isFocused?: boolean,
  hasError?: boolean,
  children?: React$Node,
};

const TextInput = ({ isFocused, hasError, children, ...delegated }: Props) => (
  <Wrapper isFocused={isFocused} hasError={hasError}>
    <InputElem {...delegated} />
    {children}
  </Wrapper>
);

const getBorderColor = (props: Props) => {
  if (props.hasError) {
    return COLORS.pink[500];
  } else if (props.isFocused) {
    return COLORS.purple[700];
  } else {
    return COLORS.gray[700];
  }
};

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  border-bottom: 2px solid ${getBorderColor};
`;

const InputElem = styled.input`
  flex: 1;
  padding: 8px 0px;
  border: none;
  border-radius: 0px;
  outline: none;
  font-size: 21px;

  &::placeholder {
    color: ${COLORS.gray[300]};
  }
`;

export default TextInput;
