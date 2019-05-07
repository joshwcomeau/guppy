// @flow
import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { RAW_COLORS, COLORS } from '../../constants';

type Props = {
  isFocused?: boolean,
  hasError?: boolean,
  children?: React$Node,
};

const getBorderColor = (props: Props) => {
  if (props.hasError) {
    return COLORS.error;
  } else if (props.isFocused) {
    return RAW_COLORS.purple[700];
  } else {
    return RAW_COLORS.gray[700];
  }
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 2px solid ${getBorderColor};
`;

const TextInput = forwardRef<Props, Wrapper>(
  ({ isFocused, hasError, children, ...delegated }: Props, ref) => (
    <Wrapper ref={ref} isFocused={isFocused} hasError={hasError}>
      <InputElem {...delegated} />
      {children}
    </Wrapper>
  )
);

const InputElem = styled.input`
  flex: 1;
  padding: 8px 0px;
  border: none;
  border-radius: 0px;
  outline: none;
  font-size: 21px;

  &::placeholder {
    color: ${RAW_COLORS.gray[300]};
  }
`;

export default TextInput;
