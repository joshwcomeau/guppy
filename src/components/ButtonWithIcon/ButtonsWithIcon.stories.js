// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { check, settings } from 'react-icons-kit/feather';

import ButtonWithIcon from './ButtonWithIcon';

storiesOf('ButtonWithIcon', module).add(
  'default',
  withInfo(`
    Basic usage of Button Component.
    A list of all icons can be found [here](http://wmira.github.io/react-icons-kit/#/iconset/feather)
    `)(() => (
    <React.Fragment>
      <ButtonWithIcon
        icon={<IconBase icon={check} />}
        onClick={action('clicked')}
      >
        Check Button
      </ButtonWithIcon>
      <ButtonWithIcon
        icon={<IconBase icon={settings} />}
        onClick={action('clicked')}
      >
        Gear Button
      </ButtonWithIcon>
    </React.Fragment>
  ))
);
