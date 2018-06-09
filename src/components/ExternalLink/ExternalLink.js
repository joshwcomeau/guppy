// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const { shell } = window.require('electron');

type Props = {
  href: string,
  children: React$Node,
  color: string,
  hoverColor?: string,
  showUnderline: boolean,
};

class ExternalLink extends Component<Props> {
  static defaultProps = {
    color: COLORS.blue[700],
    hoverColor: COLORS.blue[500],
  };

  handleClick = (ev: SyntheticMouseEvent<*>) => {
    const { href } = this.props;

    ev.preventDefault();
    shell.openExternal(href);
  };

  render() {
    const { href, color, hoverColor, children } = this.props;

    return (
      <Anchor
        href={href}
        color={color}
        hoverColor={hoverColor}
        onClick={this.handleClick}
      >
        {children}
      </Anchor>
    );
  }
}

const Anchor = styled.a`
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: ${props => props.color};

  &:hover {
    color: ${props => props.hoverColor};
  }
`;

export default ExternalLink;
