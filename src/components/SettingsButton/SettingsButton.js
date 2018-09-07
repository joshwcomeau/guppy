import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { settings } from 'react-icons-kit/feather/settings';
import { COLORS } from '../../constants';

import * as actions from '../../actions';

type Props = {
  size: number,
  color: ?string,
  hoverColor: ?string,
  settingsFor: 'project' | 'app',
};

type State = {
  rotations: number,
  scale: number,
  color: number,
  hovered: boolean,
};

class SettingsButton extends Component<Props, State> {
  static defaultProps = {
    size: 30,
    color: COLORS.gray[600],
    hoverColor: COLORS.purple[700], // purple or violet 500/700
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

  handleShowModal = () => {
    const { settingsFor, showModal } = this.props;
    showModal(settingsFor);
  };

  render() {
    const { hovered } = this.state;
    return (
      <Motion
        style={{
          rotations: spring(hovered ? 0.3 : 0),
          scale: spring(hovered ? 1.3 : 1),
        }}
      >
        {({ rotations, scale, color }) => (
          <Wrapper onClick={this.handleShowModal}>
            <IconBase
              size={this.props.size}
              icon={settings}
              style={{
                transform: `rotate(${rotations *
                  360}deg) scale(${scale}, ${scale})`,
                color: hovered ? this.props.hoverColor : this.props.color,
              }}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.props.action}
            />
          </Wrapper>
        )}
      </Motion>
    );
  }
}

const Wrapper = styled.div`
  cursor: pointer;
`;

export default connect(
  null,
  {
    showModal: actions.showModal,
  }
)(SettingsButton);
