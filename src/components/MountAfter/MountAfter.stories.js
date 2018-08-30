// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import MountAfter from './MountAfter';

storiesOf('MountAfter', module).add(
  'default',
  withInfo()(() => (
    <Fragment>
      <Showcase label="Mount after 0ms">
        <MountAfter reason="" delay={0}>
          Hello World
        </MountAfter>
      </Showcase>

      <Showcase label="Mount after 500ms">
        <MountAfter reason="" delay={500}>
          Hello World
        </MountAfter>
      </Showcase>

      <Showcase label="Mount after 1000ms">
        <MountAfter reason="" delay={1000}>
          Hello World
        </MountAfter>
      </Showcase>

      <Showcase label="Mount after 1500ms">
        <MountAfter reason="" delay={1500}>
          Hello World
        </MountAfter>
      </Showcase>

      <Showcase label="Mount after 2000ms">
        <MountAfter reason="" delay={2000}>
          Hello World
        </MountAfter>
      </Showcase>
    </Fragment>
  ))
);
