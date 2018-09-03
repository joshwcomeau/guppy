// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import StrokeButton from './StrokeButton';

const targetAction = decorateAction([args => [args[0].target]]);

const SIZES = ['xsmall', 'small', 'medium', 'large'];

storiesOf('Button / Stroke', module)
  .add(
    'default',
    withInfo()(() => (
      <StrokeButton onClick={targetAction('clicked')}>
        StrokeButton
      </StrokeButton>
    ))
  )
  .add(
    'sizes',
    withInfo()(() =>
      SIZES.map((size, i) => (
        <Showcase label={size} key={i}>
          <StrokeButton onClick={targetAction('button-clicked')} size={size}>
            StrokeButton
          </StrokeButton>
        </Showcase>
      ))
    )
  )
  .add(
    'disabled',
    withInfo()(() => (
      <StrokeButton disabled onClick={targetAction('clicked')}>
        StrokeButton
      </StrokeButton>
    ))
  );
