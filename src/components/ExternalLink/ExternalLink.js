// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { shell } from 'electron';

import { COLORS } from '../../constants';

type Props = {
  href: string | null,
  children: React$Node,
  color: string,
  hoverColor?: string,
  showUnderline?: boolean,
  display: string,
};

class ExternalLink extends Component<Props> {
  static defaultProps = {
    color: COLORS.link,
    hoverColor: COLORS.lightLink,
    display: 'inline-block',
  };

  handleClick = (ev: SyntheticMouseEvent<*>) => {
    const { href } = this.props;

    ev.preventDefault();
    shell.openExternal(href);
  };

  render() {
    const { href, color, hoverColor, children, display } = this.props;

    return (
      <Anchor
        style={{ display }}
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
  text-decoration: none;
  color: ${props => props.color};

  &:hover {
    color: ${props => props.hoverColor};
  }
`;

export default ExternalLink;
