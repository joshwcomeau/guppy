// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Heading from '../Heading';

import type { Dependency } from '../../types';

type Props = {
  dependency: Dependency,
};

class DependencyDetails extends PureComponent<Props> {
  render() {
    const { dependency } = this.props;

    return (
      <Fragment>
        <Heading size="medium">{dependency.name}</Heading>
        <Description>{dependency.description}</Description>
      </Fragment>
    );
  }
}

const Description = styled.div`
  font-size: 22px;
  color: ${COLORS.gray[500]};
`;

export default DependencyDetails;
