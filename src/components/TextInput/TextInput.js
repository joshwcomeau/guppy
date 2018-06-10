import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const TextInput = ({ children, focused, ...delegated }) => (
  <Wrapper focused={focused}>
    <InputElem {...delegated} />
    {children}
  </Wrapper>
);

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  border-bottom: 2px solid
    ${props => (props.focused ? COLORS.purple[700] : COLORS.gray[700])};
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
