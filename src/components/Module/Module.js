// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u2753 as questionMarkIcon } from 'react-icons-kit/noto_emoji_regular/u2753';

import { COLORS } from '../../constants';

import Heading from '../Heading';

const { shell } = window.require('electron');

type Props = {
  title: string,
  moreInfoHref: string,
  primaryActionChildren: React$Node,
  children: React$Node,
};

class Pane extends Component<Props> {
  render() {
    const { title, moreInfoHref, primaryActionChildren, children } = this.props;

    return (
      <Fragment>
        <Header>
          <Heading>
            {title}
            {moreInfoHref && (
              <HelpButton
                onClick={() => {
                  shell.openExternal(moreInfoHref);
                }}
              >
                <IconBase icon={questionMarkIcon} />
              </HelpButton>
            )}
          </Heading>
          <ActionWrapper>{primaryActionChildren}</ActionWrapper>
        </Header>
        {children}
      </Fragment>
    );
  }
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const HelpButton = styled.button`
  margin-left: 15px;
  width: 18px;
  height: 18px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50%;
  color: ${COLORS.white};
  background: ${COLORS.gray[500]};
  padding: 0;
  cursor: pointer;

  &:hover {
    background: ${COLORS.blue[700]};
  }
`;

const ActionWrapper = styled.div``;

export default Pane;
