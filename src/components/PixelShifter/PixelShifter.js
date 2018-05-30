import styled from 'styled-components';

export default styled.div`
  transform: translate(${props => props.x || 0}px, ${props => props.y || 0}px);
`;
