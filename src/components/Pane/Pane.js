// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import Card from '../Card';
import Heading from '../Heading';

type Props = {
  title: string,
  primaryActionChildren: React$Node,
  leftSideChildren: React$Node,
  rightSideChildren: React$Node,
  leftSideWidth: number,
};

class Pane extends Component<Props> {
  render() {
    const {
      title,
      primaryActionChildren,
      leftSideChildren,
      rightSideChildren,
      leftSideWidth,
    } = this.props;

    return (
      <Wrapper>
        <LeftSide>
          <Header>
            <Heading>{title}</Heading>
            <ActionWrapper>{primaryActionChildren}</ActionWrapper>
          </Header>
          {leftSideChildren}
        </LeftSide>
        <RightSide>{rightSideChildren}</RightSide>
      </Wrapper>
    );
  }
}

const Wrapper = Card.extend`
  display: flex;
`;

const LeftSide = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ActionWrapper = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const RightSide = styled.div`
  padding-left: 20px;
  flex: 1;
`;

export default Pane;
