// @flow
import React from 'react';
import styled, { keyframes } from 'styled-components';
import IconBase from 'react-icons-kit';
import { loader } from 'react-icons-kit/feather/loader';

import { RAW_COLORS } from '../../constants';

type Props = {
  size: number,
  color?: string,
};

const Spinner = ({ size, color = RAW_COLORS.gray[500] }: Props) => (
  <Icon size={size} color={color} icon={loader} />
);

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Icon = styled(IconBase)`
  animation: ${spin} 2s linear infinite;
  color: ${props => props.color};
`;

export default Spinner;
