// @flow
import React, { Fragment, PureComponent } from 'react';
import { shell } from 'electron';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { Terminal } from 'xterm';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as fit from 'xterm/lib/addons/fit/fit';

import xtermCss from 'xterm/dist/xterm.css';

import * as actions from '../../actions';
import { COLORS } from '../../constants';

import { FillButton } from '../Button';
import Heading from '../Heading';
import PixelShifter from '../PixelShifter';

import type { Task } from '../../types';
import type { Dispatch } from '../../actions/types';

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
  renderedLogs: any = {}; // used to avoid clearing & only add new lines

  componentDidMount() {
    Terminal.applyAddon(webLinks);
    Terminal.applyAddon(fit);
    this.xterm = new Terminal({
      convertEol: true,
      fontFamily: `'Fira Mono', monospace`,
      fontSize: 15,
      rendererType: 'dom', // default is canvas
    });

    this.xterm.setOption('theme', {
      background: COLORS.blue[900],
      foreground: COLORS.white,
    });

    this.xterm.open(this.node);
    this.xterm.fit(); // todo: onResize needs to be handled
    this.xterm.webLinksInit.call(this.xterm, (evt, uri) => {
      shell.openExternal(uri);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.logs !== this.state.logs) {
      for (const log of this.state.logs) {
        /*
        We need to track what we have added to xterm - feels hacky but it's working.
        `this.xterm.clear()` and re-render everything caused screen flicker that's why I decided to not use it.
        Todo: Check if there is a react-xterm wrapper that is not using xterm.clear or 
              create a wrapper component that can render the logs array (with-out flicker).
        */
        if (!this.renderedLogs[log.id]) {
          this.writeln(log.text);
          this.renderedLogs[log.id] = true;
        }
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

  handleClear = () => {
    const { task, clearConsole } = this.props;

    if (!task) {
      return;
    }

    this.renderedLogs = {};
    this.xterm.clear();

    clearConsole(task);
  };

  write(data: any) {
    this.xterm && this.xterm.write(data);
  }

  writeln(data: any) {
    this.xterm && this.xterm.writeln(data);
  }

  render() {
    const { width, height, title } = this.props;

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
        <XtermContainer
          width={width}
          height={height}
          innerRef={node => (this.node = node)}
        />
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

const XtermContainer = styled.div`
  ${css(xtermCss)}

  width: ${props =>
    typeof props.width === 'number' ? `${props.width}px` : props.width};
  height: ${props => props.height}px;
  
  .terminal {
    /* Colors set with js-API as xterm.js is using style on element */
    padding: 15px;
  }
  
  .xterm .xterm-viewport {
    border-radius: 4px;
    overflow-y: hidden;
  }
`;

export default connect(
  null,
  { clearConsole: actions.clearConsole }
)(TerminalOutput);
