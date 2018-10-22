// @flow
import React, { Component } from 'react';
import { StrokeButton } from '../Button';

type Props = {
  handleMouseEnter: () => void,
  handleMouseLeave: () => void,
  children: React$Node,
};

type State = {
  isHovered: boolean,
};

class HoverableOutlineButton extends Component<Props, State> {
  state = {
    isHovered: false,
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
    this.props.handleMouseEnter && this.props.handleMouseEnter();
  };
  handleMouseLeave = () => {
    this.setState({ isHovered: false });
    this.props.handleMouseLeave && this.props.handleMouseLeave();
  };

  render() {
    const { children, ...delegated } = this.props;
    const { isHovered } = this.state;

    return (
      <StrokeButton
        showStroke={isHovered}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...delegated}
      >
        {children}
      </StrokeButton>
    );
  }
}

export default HoverableOutlineButton;
