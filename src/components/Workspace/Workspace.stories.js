// @flow
import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import HorizontalPanels from './HorizontalPanels';
import VerticalPanels from './VerticalPanels';
import Panel from './Panel';

class PanelToggler extends Component<{}, { renderThirdPanel: boolean }> {
  state = {
    renderThirdPanel: false,
  };

  togglePanel = () => {
    this.setState(state => ({
      renderThirdPanel: !state.renderThirdPanel,
    }));
  };

  render() {
    const { renderThirdPanel } = this.state;

    const centerStyles = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };

    return (
      <Fragment>
        <button onClick={this.togglePanel}>Toggle Panel</button>

        <div>
          <HorizontalPanels
            width={650}
            style={{
              height: 600,
              boxSizing: 'content-box',
              border: '1px solid',
            }}
          >
            <Panel
              id="sidebar"
              initialWidth={200}
              style={{ ...centerStyles, minWidth: 100, background: '#a0fc20' }}
            >
              foo
            </Panel>
            <Panel
              id="server"
              style={{ ...centerStyles, background: '#ff416c' }}
            >
              bar
            </Panel>
            {renderThirdPanel && (
              <Panel
                id="dependencies"
                style={{ ...centerStyles, background: '#3f6cff' }}
              >
                baz
              </Panel>
            )}
          </HorizontalPanels>
        </div>
      </Fragment>
    );
  }
}

storiesOf('Workspace', module)
  .add(
    'Horizontal split',
    withInfo()(() => (
      <HorizontalPanels
        width={650}
        style={{ height: 600, boxSizing: 'content-box', border: '1px solid' }}
      >
        <Panel id="sidebar" initialWidth={200} style={{ minWidth: 150 }}>
          foo
        </Panel>
        <Panel id="server" style={{ minWidth: 50 }}>
          bar
        </Panel>
        <Panel id="dependencies">baz</Panel>
      </HorizontalPanels>
    ))
  )
  .add(
    'Vertical split',
    withInfo()(() => (
      <VerticalPanels
        height={650}
        style={{ width: 600, boxSizing: 'content-box', border: '1px solid' }}
      >
        <Panel id="sidebar" initialWidth={200} style={{ minWidth: 150 }}>
          foo
        </Panel>
        <Panel id="server" style={{ minWidth: 50 }}>
          bar
        </Panel>
        <Panel id="dependencies">baz</Panel>
      </VerticalPanels>
    ))
  )
  .add(
    'Nested',
    withInfo()(() => (
      <HorizontalPanels
        width={900}
        style={{
          boxSizing: 'content-box',
          border: '1px solid',
        }}
      >
        <Panel id="hello">Hello</Panel>
        <Panel id="world">World</Panel>
        <Panel id="vert">
          <VerticalPanels
            height={650}
            style={{
              width: 600,
            }}
          >
            <Panel id="sidebar" initialWidth={200} style={{ minWidth: 150 }}>
              foo
            </Panel>
            <Panel id="server" style={{ minWidth: 50 }}>
              bar
            </Panel>
          </VerticalPanels>
        </Panel>
      </HorizontalPanels>
    ))
  )
  .add(
    'Horizontal split with toggleable third',
    withInfo()(() => <PanelToggler />)
  );
