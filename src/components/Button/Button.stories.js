import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
// import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import Button from './Button';

const targetAction = decorateAction([
  args => {
    console.log(args[0].target);
    return [args[0].target];
  },
]);
console.log('decorate', decorateAction, targetAction);

const SIZES = ['small', 'medium', 'large'];

storiesOf('Button', module)
  .add(
    'default',
    withInfo(`
    Basic usage of Button Component
    `)(() => <Button onClick={targetAction('clicked')}>Hello Button</Button>)
  )
  .add(
    'with size',
    withInfo(`
    The button can be resized with the \`size\` prop.
    `)(() => (
      <React.Fragment>
        {SIZES.map((size, i) => (
          <Button onClick={targetAction('button-clicked')} size={size} key={i}>
            Button {size}
          </Button>
        ))}
      </React.Fragment>
    ))
  )
  .add(
    'with type',
    withInfo(`
    Type will change the appearance of the button.
    `)(() => (
      <React.Fragment>
        <Button onClick={targetAction('button-clicked')}>Button normal</Button>
        <Button onClick={targetAction('button-clicked')} type="fill">
          Button fill
        </Button>
        <Button onClick={targetAction('button-clicked')} type="stroke">
          Button stroke
        </Button>
      </React.Fragment>
    ))
  );
