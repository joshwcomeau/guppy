// @flow
import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import Button from './Button';

const targetAction = decorateAction([args => [args[0].target]]);

const SIZES = ['small', 'medium', 'large'];

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
        <Button onClick={targetAction('button-clicked')} size={size} key={i}>
          Button {size}
        </Button>
      ))
    )
  )
  .add(
    'types (visual styles)',
    withInfo()(() => (
      <React.Fragment>
        <Button onClick={targetAction('button-clicked')}>
          Default (stroke)
        </Button>
        <Button onClick={targetAction('button-clicked')} type="fill">
          Button fill
        </Button>
      </React.Fragment>
    ))
  );
