import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import Button from './Button';

const SIZES = ['small', 'medium', 'large'];

storiesOf('Button', module)
  .add(
    'default',
    withInfo(`
    Basic usage of Button Component
    `)(() => (
      <Wrapper>
        <Button onClick={action('clicked')}>Hello Button</Button>
      </Wrapper>
    ))
  )
  .add(
    'with size',
    withInfo(`
    The button can be resized with the \`size\` prop.
    `)(() => (
      <Wrapper>
        {SIZES.map((size, i) => (
          <Button onClick={action('clicked')} size={size} key={i}>
            Button {size}
          </Button>
        ))}
      </Wrapper>
    ))
  )
  .add(
    'with type',
    withInfo(`
    Type will change the appearance of the button.
    `)(() => (
      <Wrapper>
        <Button onClick={action('clicked')}>Button normal</Button>
        <Button onClick={action('clicked')} type="fill">
          Button fill
        </Button>
        <Button onClick={action('clicked')} type="stroke">
          Button stroke
        </Button>
      </Wrapper>
    ))
  );

const Wrapper = styled.div`
  padding: 1em;
`;
