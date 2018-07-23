import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
  `;

const fadeOut = keyframes`
  from { opacity: 1 }
  to { opacity: 0 }
`;

const FadeIn = styled.div`
  animation: ${props => (props.out ? fadeOut : fadeIn)}
    ${props => props.duration || 500}ms;
  animation-fill-mode: forwards;
`;

export default FadeIn;
