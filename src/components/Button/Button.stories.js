// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import Button from './Button';

const targetAction = decorateAction([args => [args[0].target]]);

const SIZES = ['xsmall', 'small', 'medium', 'large'];

storiesOf('Button', module)
  .add(
    'default',
    withInfo()(() => (
      <Button onClick={targetAction('clicked')}>Hello Button</Button>
    ))
  )
  .add(
    'sizes',
    withInfo()(() =>
      SIZES.map((size, i) => (
        <Showcase label={size} key={i}>
          <Button onClick={targetAction('button-clicked')} size={size}>
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
