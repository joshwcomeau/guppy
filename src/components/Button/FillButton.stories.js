// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import FillButton from './FillButton';

const targetAction = decorateAction([args => [args[0].target]]);

const SIZES = ['xsmall', 'small', 'medium', 'large'];

storiesOf('Button / Fill', module)
  .add(
    'default',
    withInfo()(() => (
      <FillButton onClick={targetAction('clicked')}>FillButton</FillButton>
    ))
  )
  .add(
    'sizes',
    withInfo()(() =>
      SIZES.map((size, i) => (
        <Showcase label={size} key={i}>
          <FillButton onClick={targetAction('button-clicked')} size={size}>
            FillButton
          </FillButton>
        </Showcase>
      ))
    )
  )
  .add(
    'disabled',
    withInfo()(() => (
      <FillButton disabled onClick={targetAction('clicked')}>
        FillButton
      </FillButton>
    ))
  );
