// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import PixelShifter from '../PixelShifter';
import Heading from '../Heading';

type Props = {
  title: string,
  description?: string,
  action?: React$Node,
};

class ModalHeader extends Component<Props> {
  render() {
    const { title, description, action } = this.props;

    return (
      <Wrapper>
        <PixelShifter y={-5}>
          <PixelShifter x={-1}>
            <Heading>{title}</Heading>
          </PixelShifter>
          <Description>{description}</Description>
        </PixelShifter>
        {action}
      </Wrapper>
    );
  }
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 25px 25px 15px 25px;
  background: ${COLORS.gray[100]};
  border-radius: 8px 8px 0 0;
`;

const Description = styled.div`
  font-size: 24px;
  color: ${COLORS.gray[600]};
`;

export default ModalHeader;
