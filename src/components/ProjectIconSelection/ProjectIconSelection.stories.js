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
          selectedIcon="/static/media/icon_pineapple.5d31b188.jpg"
          onSelectIcon={action('click')}
        />
      </Showcase>
      <Showcase label="All available icons by not passing a value to limitTo prop (max default number is 21)">
        <ProjectIconSelection
          selectedIcon={null}
          randomize={false}
          onSelectIcon={action('click')}
        />
      </Showcase>
      <Showcase label="Show a limited number of icons">
        <ProjectIconSelection
          selectedIcon={null}
          randomize={true}
          limitTo={10}
          onSelectIcon={action('click')}
        />
      </Showcase>
      <Showcase label="Show a random subset of icons">
        <ProjectIconSelection
          selectedIcon={null}
          randomize={true}
          limitTo={5}
          onSelectIcon={action('click')}
        />
      </Showcase>
    </Fragment>
  ))
);
