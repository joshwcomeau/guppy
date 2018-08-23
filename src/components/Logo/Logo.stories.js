// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { decorateAction } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import Logo from './Logo';

const targetAction = decorateAction([args => [args[0].target]]);

const SIZES = ['small', 'medium', 'large'];

storiesOf('Logo', module)
  .add(
    'default',
    withInfo()(() => (
      <Fragment>
        <Showcase label="small">
          <Logo size="small" />
        </Showcase>

        <Showcase label="medium (default)">
          <Logo size="medium" />
        </Showcase>

        <Showcase label="large">
          <Logo size="large" />
        </Showcase>

        <Showcase label="grayscale">
          <Logo size="large" grayscale />
        </Showcase>
      </Fragment>
    ))
  )
  .add(
    'unrecognized size',
    withInfo()(() => (
      // $FlowFixMe - intentional error
      <Logo size="humongous" />
    ))
  );
