// @flow
/**
 * NOTE: This component is meant to be used within React Storybook.
 * It's a dev-only component, not meant to be used within Guppy.
 */
import React, { Fragment, Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../../src/constants';

import Heading from '../../../src/components/Heading';

type Props = {
  label: string,
  children: React$Node,
};

class Showcase extends Component<Props> {
  render() {
    const { label, children } = this.props;

    return (
      <Wrapper>
        <Label size="xsmall">{label}</Label>
        <MainContent>{children}</MainContent>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);

  &:last-of-type {
    border-bottom: none;
  }
`;

const Label = styled(Heading)`
  display: flex;
  width: 150px;
  padding: 1rem 0;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
`;

const MainContent = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

export default Showcase;
