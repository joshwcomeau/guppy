// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import Card from '../Card';
import Heading from '../Heading';

type Props = {
  title: string,
  primaryActionChildren: React$Node,
  children: React$Node,
};

class Pane extends Component<Props> {
  render() {
    const { title, primaryActionChildren, children } = this.props;

    return (
      <Fragment>
        <Header>
          <Heading>{title}</Heading>
          <ActionWrapper>{primaryActionChildren}</ActionWrapper>
        </Header>
        {children}
      </Fragment>
    );
  }
}

const Wrapper = Card.extend`
  display: flex;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const ActionWrapper = styled.div``;

export default Pane;
