// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import Logo from './Logo';

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
