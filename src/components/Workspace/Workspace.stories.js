// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import Workspace from './Workspace';
import Panel from './Panel';

class PanelToggler extends Component {
  state = {
    renderThirdPanel: true,
  };

  togglePanel = () => {
    this.setState(state => ({
      renderThirdPanel: !state.renderThirdPanel,
    }));
  };

  render() {
    const { renderThirdPanel } = this.state;
    return (
      <Fragment>
        <button onClick={this.togglePanel}>Toggle Panel</button>

        <div>
          <Workspace
            orientation="horizontal"
            style={{ height: 600, border: '1px solid' }}
          >
            <Panel
              id="sidebar"
              initialFlex={40}
              style={{ minWidth: 100, maxWidth: 300 }}
            >
              foo
            </Panel>
            <Panel id="server" initialFlex={20}>
              bar
            </Panel>
            {renderThirdPanel && (
              <Panel id="dependencies" initialFlex={40}>
                baz
              </Panel>
            )}
          </Workspace>
        </div>
      </Fragment>
    );
  }
}

storiesOf('Workspace', module)
  .add(
    'Horizontal split',
    withInfo()(() => (
      <Workspace
        orientation="horizontal"
        style={{ height: 600, border: '1px solid' }}
      >
        <Panel id="sidebar" initialFlex={40}>
          foo
        </Panel>
        <Panel id="server" initialFlex={20}>
          bar
        </Panel>
        <Panel id="dependencies" initialFlex={40}>
          baz
        </Panel>
      </Workspace>
    ))
  )
  .add(
    'Horizontal split with toggleable third',
    withInfo()(() => <PanelToggler />)
  );
