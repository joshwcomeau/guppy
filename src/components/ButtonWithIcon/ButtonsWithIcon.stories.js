// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { check, settings } from 'react-icons-kit/feather';

import reactIconSrc from '../../assets/images/react-icon.svg';
import Showcase from '../Showcase';
import Paragraph from '../Paragraph';
import ButtonWithIcon from './ButtonWithIcon';

storiesOf('ButtonWithIcon', module).add(
  'default',
  withInfo()(() => (
    <React.Fragment>
      <Showcase label="React">
        <ButtonWithIcon
          icon={<ReactIcon src={reactIconSrc} />}
          onClick={action('clicked')}
        >
          Check Button
        </ButtonWithIcon>
      </Showcase>
      <Showcase label="Settings">
        <ButtonWithIcon
          icon={<IconBase icon={settings} />}
          onClick={action('clicked')}
        >
          Settings
        </ButtonWithIcon>
      </Showcase>
      <br />
      <br />
      <Paragraph>
        <em>icon</em> is an arbitrary React element, although you may wish to
        use one of{' '}
        <a href="http://wmira.github.io/react-icons-kit/#/iconset/feather">
          the Feather icons
        </a>{' '}
        from react-icons-kit.
      </Paragraph>
    </React.Fragment>
  ))
);

const ReactIcon = styled.img`
  width: 32px;
  height: 32px;
`;
