// @flow
import React, { Component } from 'react';

type Props = {
  children: (isActive: boolean, isHovered: boolean) => React$Node,
};

type State = {
  isActive: boolean,
  isHovered: boolean,
};

class DetectActive extends Component<Props, State> {
  state = {
    isActive: false,
    isHovered: false,
  };

  handleMouseDown = (ev: SyntheticEvent<*>) => {
    this.setState({ isActive: true });
  };

  handleMouseUp = (ev: SyntheticEvent<*>) => {
    this.setState({ isActive: false });
  };

  handleMouseOver = (ev: SyntheticEvent<*>) => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = (ev: SyntheticEvent<*>) => {
    this.setState({ isActive: false, isHovered: false });
  };

  render() {
    return (
      <span
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children(this.state.isActive, this.state.isHovered)}
      </span>
    );
  }
}

export default DetectActive;
