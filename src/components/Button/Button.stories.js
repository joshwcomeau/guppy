import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from './Button';

const SIZES = ['small', 'medium', 'large'];

storiesOf('Button', module)
  .add('Default', () => <Button onClick={action('clicked')}>Button</Button>)
  .add('with size', () => (
    <div>
      {SIZES.map((size, i) => (
        <Button onClick={action('clicked')} size={size} key={i}>
          Button {size}
        </Button>
      ))}
    </div>
  ));
