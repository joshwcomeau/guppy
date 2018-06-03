// @flow
/**
 * Utility component that lets its children take up the full screen width,
 * even when within a fixed-width parent.
 */
import styled from 'styled-components';

export default styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`;
