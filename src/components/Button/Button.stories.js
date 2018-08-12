import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from './Button';

const SIZES = ['small', 'medium', 'large'];

storiesOf('Button', module)
  .addWithDoc('with label', Button,
    'It should render a button',
    () => <Button onClick={action('clicked')}>Hello Button</Button>
  ));
  // .add('Default', () => <Button onClick={action('clicked')}>Button</Button>)

  // .add('with size', () => (
  //   <Wrapper>
  //     {SIZES.map((size, i) => (
  //       <Button onClick={action('clicked')} size={size} key={i}>
  //         Button {size}
  //       </Button>
  //     ))}
  //   </Wrapper>
  // ))
  // .add('with type', () => (
  //   <Wrapper>
  //     <Button onClick={action('clicked')}>Button normal</Button>
  //     <Button onClick={action('clicked')} type="fill">
  //       Button fill
  //     </Button>
  //     <Button onClick={action('clicked')} type="stroke">
  //       Button stroke
  //     </Button>
  //   </Wrapper>
  // ));

const Wrapper = styled.div`
  padding: 1em;
`;
