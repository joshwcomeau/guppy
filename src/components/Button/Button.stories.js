// @flow
import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Button from './Button';
import Showcase from '../Showcase';

const targetAction = decorateAction([args => [args[0].target]]);

const SIZES = ['small', 'medium', 'large'];

storiesOf('Button', module)
  .add(
    'default',
    withInfo()(({ story }) => (
      <Button onClick={targetAction('clicked')}>Hello Button</Button>
    ))
  )
  .add(
    'sizes',
    withInfo()(() =>
      SIZES.map((size, i) => (
        <Showcase label={size}>
          <Button onClick={targetAction('button-clicked')} size={size} key={i}>
            Button
          </Button>
        </Showcase>
      ))
    )
  )
  .add(
    'types (visual styles)',
    withInfo()(() => (
      <React.Fragment>
        <Showcase label="Default (stroke)">
          <Button onClick={targetAction('button-clicked')}>Button</Button>
        </Showcase>
        <Showcase label="Fill">
          <Button onClick={targetAction('button-clicked')} type="fill">
            Button
          </Button>
        </Showcase>
      </React.Fragment>
    ))
  );
