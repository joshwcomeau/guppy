// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Terminal } from 'xterm';

import * as actions from '../../actions';
import { COLORS } from '../../constants';

import { FillButton } from '../Button';
import Heading from '../Heading';
import PixelShifter from '../PixelShifter';

import type { Task } from '../../types';
import type { Dispatch } from '../../actions/types';

var Convert = require('ansi-to-html');
var convert = new Convert();

type Props = {
  width?: number,
  height?: number,
  title: string,
  task: Task,
  clearConsole: Dispatch<typeof actions.clearConsole>,
};

type State = {
  logs: any,
};

class TerminalOutput extends PureComponent<Props, State> {
  static defaultProps = {
    width: '100%',
    height: 200,
  };

  state = {
    logs: [],
  };

  xterm: Terminal;
  node: ?HTMLElement;

  componentDidMount() {
    this.xterm = new Terminal();
    this.xterm.open(this.node);
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    //this.scrollToBottom();
    console.log('update', this.state.logs);
    if (prevState.logs !== this.state.logs) {
      this.xterm.clear();
      for (const log in this.state.logs) {
        console.log('item', log.text);
        this.writeln(log.text);
      }
    }
  }

  componentWillUnmount() {
    if (this.xterm) {
      this.xterm.destroy();
      this.xterm = null;
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.task && nextProps.task.logs !== prevState.logs) {
      return {
        logs: nextProps.task.logs,
      };
    }

    return null;
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

  handleClear = () => {
    const { task, clearConsole } = this.props;

    if (!task) {
      return;
    }

    clearConsole(task);
  };

  write(data: any) {
    this.xterm && this.xterm.write(data);
  }

  writeln(data: any) {
    this.xterm && this.xterm.writeln(data);
  }

  render() {
    const { width, height, title, task } = this.props;

    return (
      <Fragment>
        <Header>
          <Heading size="xsmall">{title}</Heading>
          <PixelShifter
            x={-1}
            style={{ display: 'inherit' }}
            reason={`
              Buttons have a slightly-extruding stroke we want to
              offset.
            `}
          >
            <FillButton
              size="xsmall"
              colors={[COLORS.pink[300], COLORS.red[500]]}
              onClick={this.handleClear}
            >
              Clear
            </FillButton>
          </PixelShifter>
        </Header>
        <Wrapper width={width} height={height}>
          <TableWrapper height={height}>
            <LogWrapper innerRef={node => (this.node = node)}>
              {/* {task.logs.map(log => (
                <LogRow
                  key={log.id}
                  dangerouslySetInnerHTML={{
                    __html: convert.toHtml(log.text),
                  }}
                />
              ))} */}
            </LogWrapper>
          </TableWrapper>
        </Wrapper>
      </Fragment>
    );
  }
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

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

export default connect(
  null,
  { clearConsole: actions.clearConsole }
)(TerminalOutput);
