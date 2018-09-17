// @flow
import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import Toggle from './Toggle';

class StatefulToggle extends Component<any, any> {
  state = {
    isToggled: true,
  };

  toggle = () => {
    this.setState(state => ({ isToggled: !state.isToggled }));
  };

  render() {
    return (
      <Toggle
        onToggle={this.toggle}
        isToggled={this.state.isToggled}
        {...this.props}
      />
    );
  }
}

storiesOf('Toggle', module).add(
  'default',
  withInfo()(() => (
    <Fragment>
      <Showcase label="default">
        <StatefulToggle />
      </Showcase>

      <Showcase label="Small">
        <StatefulToggle size={24} />
      </Showcase>

      <Showcase label="Large">
        <StatefulToggle size={64} />
      </Showcase>

      <Showcase label="Extra padding">
        <StatefulToggle padding={6} />
      </Showcase>

      <Showcase label="Disabled">
        <StatefulToggle isDisabled />
      </Showcase>
    </Fragment>
  ))
);
