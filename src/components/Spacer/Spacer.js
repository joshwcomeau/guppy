import styled from 'styled-components';

export default styled.div`
  display: ${props => (props.inline ? 'inline-block' : 'block')};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;
