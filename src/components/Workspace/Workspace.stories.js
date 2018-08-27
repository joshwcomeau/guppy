// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import Workspace from './Workspace';
import Panel from './Panel';

storiesOf('Workspace', module).add(
  'Horizontal split',
  withInfo()(() => (
    <div style={{ height: 600 }}>
      <Workspace orientation="horizontal" style={{ border: '1px solid' }}>
        <Panel initialFlex={2}>foo</Panel>
        <Panel>bar</Panel>
        <Panel>baz</Panel>
        <Panel>boo</Panel>
      </Workspace>
    </div>
  ))
);
