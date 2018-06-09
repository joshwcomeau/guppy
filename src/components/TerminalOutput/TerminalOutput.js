// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import type { Log } from '../../types';

var Convert = require('ansi-to-html');
var convert = new Convert();

type Props = {
  width?: number,
  height?: number,
  logs: Array<Log>,
};

class TerminalOutput extends PureComponent<Props> {
  static defaultProps = {
    logs: [],
    width: '100%',
    height: 200,
  };

  node: ?HTMLElement;

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    // TODO: can element.scrollIntoView(false) be used instead?
    if (!this.node) {
      return;
    }

    const scrollHeight = this.node.scrollHeight;
    const height = this.node.clientHeight;
    const maxScrollTop = scrollHeight - height;

    this.node.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  render() {
    const { width, height, logs } = this.props;

    return (
      <Wrapper
        width={width}
        height={height}
        innerRef={node => (this.node = node)}
      >
        <TableWrapper height={height}>
          <LogWrapper>
            {logs.map(log => (
              <LogRow
                key={log.id}
                dangerouslySetInnerHTML={{
                  __html: convert.toHtml(log.text),
                }}
              />
            ))}
          </LogWrapper>
        </TableWrapper>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: ${props =>
    typeof props.width === 'number' ? `${props.width}px` : props.width};
  height: ${props => props.height}px;
  overflow: auto;
  padding: 15px;
  color: ${COLORS.white};
  background-color: ${COLORS.blue[900]};
  border-radius: 4px;
  font-family: 'Fira Mono', monospace;
  font-size: 13px;
`;

// NOTE: I have a loooot of nested elements here, to try and align things
// to the bottom. Flexbox doesn't play nicely with overflow: scroll :/
// There's almost certainly a better way to do this, just haven't spent time.
const TableWrapper = styled.div`
  display: table;
  width: 100%;
  height: 100%;
`;

const LogWrapper = styled.div`
  display: table-cell;
  vertical-align: bottom;
  width: 100%;
  height: 100%;
`;

const LogRow = styled.div`
  min-height: 0;
  margin-top: 10px;
  white-space: pre;
`;

export default TerminalOutput;
