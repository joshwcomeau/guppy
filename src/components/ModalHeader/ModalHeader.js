// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import PixelShifter from '../PixelShifter';
import Heading from '../Heading';

type Props = {
  title: string,
  action?: React$Node,
  theme: 'standard' | 'blueish',
  children?: React$Node,
};

class ModalHeader extends Component<Props> {
  static defaultProps = {
    theme: 'standard',
  };

  static Controls = ({ children = null, ...delegated }: any) => {
    const Wrapped = () => {
      return children;
    };
    Wrapped.displayName = 'ModalHeader.Controls';
    return <Wrapped {...delegated} />;
  };

  render() {
    const { title, action, theme, children } = this.props;

    const colors =
      theme === 'standard'
        ? [COLORS.gray[100], COLORS.gray[100]]
        : [COLORS.blue[700], COLORS.teal[500]];

    return (
      <Wrapper colors={colors}>
        <MainContent>
          <PixelShifter y={-2} reason="line-height fix">
            <Heading
              style={{
                color: theme === 'standard' ? COLORS.gray[900] : COLORS.white,
              }}
            >
              {title}
            </Heading>
            <ModalHeader.Controls />
          </PixelShifter>

          {children}
        </MainContent>

        <ActionWrapper>{action}</ActionWrapper>
      </Wrapper>
    );
  }
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 25px 25px 15px 25px;
  background-image: linear-gradient(15deg, ${props => props.colors.join(', ')});
  border-radius: 8px 8px 0 0;
`;

const MainContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
`;

const ActionWrapper = styled.div`
  padding-left: 10px;
`;

export default ModalHeader;
