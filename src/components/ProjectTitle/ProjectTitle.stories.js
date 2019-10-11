// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import ProjectTitle from './ProjectTitle';
import Showcase from '../../../.storybook/components/Showcase';

storiesOf('ProjectTitle', module).add(
  'default',
  withInfo()(() => (
    <Fragment>
      <Showcase label="With react icon">
        <ProjectTitle
          projectType="create-react-app"
          title="Test Title"
          tooltip="z:/some/path"
        />
      </Showcase>

      <Showcase label="With Gatsby icon">
        <ProjectTitle
          projectType="gatsby"
          title="Test Title"
          tooltip="z:/some/path"
        />
      </Showcase>

      <Showcase label="With Nextjs icon">
        <ProjectTitle
          projectType="nextjs"
          title="Test Title"
          tooltip="z:/some/path"
        />
      </Showcase>
      <Showcase label="Without icon">
        <ProjectTitle title="Test Title" tooltip="z:/some/path" />
      </Showcase>
    </Fragment>
  ))
);
