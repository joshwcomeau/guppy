// @flow
import React, { PureComponent } from 'react';
import { shell } from 'electron';
import { connect } from 'react-redux';
import * as path from 'path';
import * as os from 'os';
import styled, { css } from 'styled-components';
import { Terminal } from 'xterm';
import ResizeObserver from 'react-resize-observer';

import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as localLinks from './localLinksAddon.js';

import xtermCss from 'xterm/dist/xterm.css';

import { getSelectedProject } from '../../reducers/projects.reducer';
import * as actions from '../../actions';
import { RAW_COLORS, COLORS } from '../../constants';

import { FillButton } from '../Button';
import Heading from '../Heading';
import PixelShifter from '../PixelShifter';
import { openProjectInEditor } from '../../services/shell.service';

import type { Task } from '../../types';
import type { Dispatch } from '../../actions/types';

type Props = {
  width?: number,
  height?: number,
  title: string,
  task: Task,
  clearConsole: Dispatch<typeof actions.clearConsole>,
  projectPath: string,
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
  termWrapperRef: ?HTMLElement = null;
  renderedLogs: any = {}; // used to avoid clearing & only add new lines
  resizeTimeout: TimeoutID;

  componentDidMount() {
    Terminal.applyAddon(webLinks);
    Terminal.applyAddon(localLinks);
    Terminal.applyAddon(fit);

    this.xterm = new Terminal({
      convertEol: true,
      fontFamily: `'Fira Mono', monospace`,
      fontSize: 15,
      rendererType: 'dom', // default is canvas
    });

    this.xterm.setOption('theme', {
      background: RAW_COLORS.blue[900],
      foreground: COLORS.textOnBackground,
    });

    this.xterm.open(this.termWrapperRef);
    this.xterm.fit();

    // Init addons
    this.xterm.webLinksInit.call(this.xterm, (evt, uri) => {
      shell.openExternal(uri);
    });
    this.xterm.localLinksInit.call(
      this.xterm,
      (evt, uri) => {
        const { projectPath } = this.props;
        openProjectInEditor(path.resolve(projectPath, uri));
      },
      {
        platform: os.platform(),
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.task.logs !== this.state.logs) {
      if (this.state.logs.length === 0) {
        this.xterm.clear();
      }
      for (const log of this.state.logs) {
        /*
        We need to track what we have added to xterm - feels hacky but it's working.
        `this.xterm.clear()` and re-render everything caused screen flicker that's why I decided to not use it.
        Todo: Check if there is a react-xterm wrapper that is not using xterm.clear or 
              create a wrapper component that can render the logs array (with-out flicker).
        */
        if (!this.renderedLogs[log.id]) {
          this.writeln(log.text);
          this.xterm.scrollToBottom();
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
    if (nextProps.task) {
      if (nextProps.task.logs !== prevState.logs) {
        return {
          logs: nextProps.task.logs,
        };
      }
      if (nextProps.task.logs.length === 0) {
        return {
          logs: [],
        };
      }
    }

    return null;
  }

  handleClear = () => {
    const { task, clearConsole } = this.props;

    if (!task) {
      return;
    }

    this.renderedLogs = {};

    clearConsole(task);
  };

  handleResize = evt => {
    if (!this.xterm) return;

    if (this.resizeTimeout) {
      return;
    }

    this.resizeTimeout = setTimeout(() => {
      delete this.resizeTimeout;
      this.xterm.fit();
    }, 0);
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
      <Wrapper>
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
              colors={[RAW_COLORS.pink[300], RAW_COLORS.red[500]]}
              onClick={this.handleClear}
            >
              Clear
            </FillButton>
          </PixelShifter>
        </Header>
        <XtermContainer
          width={width}
          height={height}
          innerRef={node => (this.termWrapperRef = node)}
        />
        <ResizeObserver onResize={this.handleResize} />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  ${css(xtermCss)};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const XtermContainer = styled.div`
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

const mapStateToProps = state => {
  if (state === null) {
    return;
  }

  const project = getSelectedProject(state);

  return {
    projectPath: project && project.path,
  };
};

export default connect(
  mapStateToProps,
  { clearConsole: actions.clearConsole }
)(TerminalOutput);
