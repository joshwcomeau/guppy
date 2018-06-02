// @flow
import React, { PureComponent } from 'react';
// import { Terminal } from 'xterm';
// import * as fit from 'xterm/lib/addons/fit/fit';
// import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
// import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import styled from 'styled-components';

import { COLORS } from '../../constants';

var Convert = require('ansi-to-html');
var convert = new Convert();

var AU = require('ansi_up');
var ansi_up = new AU.default();

// Terminal.applyAddon(fit);
// Terminal.applyAddon(webLinks);
// Terminal.applyAddon(winptyCompat);

type Props = {
  height?: number,
  logs: Array<string>,
};

class TerminalOutput extends PureComponent<Props> {
  static defaultProps = {
    logs: [],
    height: 200,
  };

  wrapperNode: HTMLElement;
  node: HTMLElement;
  term: any; // Terminal instance

  componentDidMount() {
    // this.term = new Terminal();
    // this.term.open(this.node);
    // window.setInterval(() => {
    //   this.term.write('Hello World\n');
    // }, 1000);
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.fitResize, {
  //     passive: true,
  //   });
  // }

  // fitResize() {
  //   if (!this.wrapperNode) {
  //     return;
  //   }
  //   this.term.fit();
  // }

  render() {
    const { height, logs } = this.props;

    return (
      <Wrapper height={height}>
        {logs.map(log => (
          <Log
            dangerouslySetInnerHTML={{
              __html: convert.toHtml(log.replace(/(\r\n|\r|\n)/g, '<br />')),
            }}
          />
        ))}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  /* display: flex;
  flex-direction: column;
  justify-content: flex-end; */
  width: 500px;
  height: ${props => props.height}px;
  padding: 15px;
  color: ${COLORS.white};
  background-color: ${COLORS.blue[900]};
  border-radius: 4px;
  font-family: monospace;
  overflow: auto;
`;

const Log = styled.div`
  min-height: 0;
  margin-top: 20px;
`;

export default TerminalOutput;
