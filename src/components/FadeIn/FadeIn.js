// @flow
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
  `;

const FadeIn = styled.div`
  animation: ${fadeIn} ${props => props.duration || 500}ms;
`;

export default FadeIn;
