// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

type Props = {
  height?: number,
  output: Array<string>,
};

class TerminalOutput extends PureComponent<Props> {
  static defaultProps = {
    height: 200,
  };

  render() {
    const { height } = this.props;

    return <Wrapper height={height} />;
  }
}

const Wrapper = styled.div`
  height: ${props => props.height}px;
  color: ${COLORS.white};
  background-color: ${COLORS.blue[900]};
  border-radius: 4px;
`;

export default TerminalOutput;
