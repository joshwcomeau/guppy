import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(15px);
  }
  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(15px); }
`;

const SlideIn = styled.div`
  animation: ${props => (props.out ? slideOut : slideIn)}
    ${props => props.duration || 500}ms;
  animation-fill-mode: forwards;
`;

export default SlideIn;
