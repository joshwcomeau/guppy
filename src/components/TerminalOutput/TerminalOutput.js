// @flow
import React, { PureComponent } from 'react';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import styled from 'styled-components';
import { COLORS } from '../../constants';

Terminal.applyAddon(fit);
Terminal.applyAddon(webLinks);
Terminal.applyAddon(winptyCompat);

type Props = {
  height?: number,
  output: Array<string>,
};

class TerminalOutput extends PureComponent<Props> {
  static defaultProps = {
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
    // window.removeEventListener('resize', this.fitResize, {
    //   passive: true,
    // });
    // this.fitResize();
  }

  fitResize() {
    if (!this.wrapperNode) {
      return;
    }
    this.term.fit();
  }

  render() {
    const { height } = this.props;

    return (
      <Wrapper innerRef={node => (this.wrapperNode = node)} height={height}>
        <div ref={node => (this.node = node)} />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: ${props => props.height}px;
  color: ${COLORS.white};
  background-color: ${COLORS.blue[900]};
  border-radius: 4px;
`;

export default TerminalOutput;
