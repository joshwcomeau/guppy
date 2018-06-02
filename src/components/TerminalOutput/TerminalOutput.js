// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

var Convert = require('ansi-to-html');
var convert = new Convert();

var AU = require('ansi_up');
var ansi_up = new AU.default();

type Props = {
  height?: number,
  logs: Array<string>,
};

class TerminalOutput extends PureComponent<Props> {
  static defaultProps = {
    logs: [],
    height: 200,
  };

  componentDidUpdate() {
    if (!this.node) {
      return;
    }

    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const scrollHeight = this.node.scrollHeight;
    const height = this.node.clientHeight;
    const maxScrollTop = scrollHeight - height;

    this.node.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  render() {
    const { height, logs } = this.props;

    return (
      <Wrapper height={height} innerRef={node => (this.node = node)}>
        <TableWrapper height={height}>
          <LogWrapper>
            {logs.map(log => (
              <Log
                dangerouslySetInnerHTML={{
                  __html: convert.toHtml(
                    log
                      .replace(/^[\ ]/gm, '&nbsp;&nbsp;')
                      .replace(/(\r\n|\r|\n)/g, '<br />')
                  ),
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

const Log = styled.div`
  min-height: 0;
  margin-top: 10px;
`;

export default TerminalOutput;
