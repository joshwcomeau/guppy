// @flow
import React, { Component } from 'react';

type Props = {
  children: (isActive: boolean) => React$Node,
};

type State = {
  isActive: boolean,
};

class DetectActive extends Component<Props, State> {
  state = {
    isActive: false,
  };

  handleMouseDown = (ev: SyntheticEvent<*>) => {
    this.setState({ isActive: true });
  };

  handleMouseUp = (ev: SyntheticEvent<*>) => {
    this.setState({ isActive: false });
  };

  handleMouseLeave = (ev: SyntheticEvent<*>) => {
    this.setState({ isActive: false });
  };

  render() {
    return (
      <span
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children(this.state.isActive)}
      </span>
    );
  }
}

export default DetectActive;
