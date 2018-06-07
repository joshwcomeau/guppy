// @flow
import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

type Props = {
  label: string,
  value: string,
  width: number,
  children: React$Node,
};

const SquareStatus = ({ label, value, width, children }: Props) => {
  return (
    <Wrapper style={{ width }}>
      {children}
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  text-transform: uppercase;
  color: ${COLORS.gray[600]};
`;

const Value = styled.div`
  font-size: 22px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  color: ${COLORS.gray[900]};
`;

export default SquareStatus;
