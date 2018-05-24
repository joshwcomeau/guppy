import React from 'react';
import styled, { keyframes } from 'styled-components';
import IconBase from 'react-icons-kit';
import { loadC } from 'react-icons-kit/ionicons/loadC';

import { COLORS } from '../../constants';

const Spinner = ({ size }) => <Icon size={size} icon={loadC} />;

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
  color: ${COLORS.gray[500]};
`;

export default Spinner;
