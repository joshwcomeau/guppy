// @flow
import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import Showcase from '../../../.storybook/components/Showcase';
import ProjectIconSelection from './ProjectIconSelection';

storiesOf('ProjectIconSelection', module).add(
  'default',
  withInfo()(() => (
    <Fragment>
      <Showcase label="Image selected">
        <ProjectIconSelection
          selectedIcon={'/static/media/icon_pineapple.5d31b188.jpg'}
          showRandomSubset={false}
          onSelectIcon={action('click')}
        />
      </Showcase>
      <Showcase label="All available icons">
        <ProjectIconSelection
          selectedIcon={null}
          showRandomSubset={false}
          onSelectIcon={action('click')}
        />
      </Showcase>
      <Showcase label="Show a default subset of icons (10)">
        <ProjectIconSelection
          selectedIcon={null}
          showRandomSubset={true}
          onSelectIcon={action('click')}
        />
      </Showcase>
      <Showcase label="Show a custom subset of icons">
        <ProjectIconSelection
          selectedIcon={null}
          showRandomSubset={5}
          onSelectIcon={action('click')}
        />
      </Showcase>
    </Fragment>
  ))
);
