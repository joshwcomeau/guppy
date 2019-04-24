// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spring, animated, interpolate } from 'react-spring';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { settings } from 'react-icons-kit/feather/settings';
import { RAW_COLORS } from '../../constants';

import * as actions from '../../actions';

import type { Dispatch } from '../../actions/types';

type Props = {
  size: number,
  color: ?string,
  hoverColor: ?string,
  // Currently, only a 'project-configuration' modal exists, but we may
  // support an 'app' modal in the future
  settingsFor: 'project',
  showProjectSettings: Dispatch<typeof actions.showProjectSettings>,
  action: () => void,
};

type State = {
  hovered: boolean,
};

class SettingsButton extends Component<Props, State> {
  static defaultProps = {
    size: 36,
    color: RAW_COLORS.gray[400],
    hoverColor: RAW_COLORS.purple[500],
    settingsFor: 'project',
  };

  state = {
    hovered: false,
  };

  handleMouseEnter = () => {
    this.setState(state => ({
      hovered: true,
    }));
  };

  handleMouseLeave = () => {
    // I wonder if we should "unwind" it on mouseout?
    // I'm not sure... maybe try it with/without this?
    this.setState({ hovered: false });
  };

  handleClick = () => {
    const { showProjectSettings } = this.props;

    // NOTE: If we support app settings, use the `settingsFor` prop here to
    // select which modal to open.
    showProjectSettings();
  };

  render() {
    const { hovered } = this.state;

    return (
      <Spring
        native
        config={{
          tension: 70,
          friction: 8,
        }}
        to={{
          rotations: hovered ? 0.2 : 0,
          scale: hovered ? 1.15 : 1,
        }}
      >
        {({ rotations, scale }) => (
          <Wrapper onClick={this.handleClick}>
            <animated.div
              style={{
                width: this.props.size,
                height: this.props.size,
                transform: interpolate(
                  [rotations, scale],
                  // eslint-disable-next-line no-shadow
                  (rotations, scale) => `
                    rotate(${rotations * 360}deg)
                    scale(${scale}, ${scale})
                  `
                ),
                color: hovered ? this.props.hoverColor : this.props.color,
              }}
            >
              <IconBase
                size={this.props.size}
                icon={settings}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onClick={this.props.action}
              />
            </animated.div>
          </Wrapper>
        )}
      </Spring>
    );
  }
}

const Wrapper = styled.div`
  cursor: pointer;
`;

export default connect(
  null,
  { showProjectSettings: actions.showProjectSettings }
)(SettingsButton);
