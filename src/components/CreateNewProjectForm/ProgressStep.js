// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { iosCheckmarkEmpty } from 'react-icons-kit/ionicons/iosCheckmarkEmpty';

import Spinner from '../Spinner';
import { COLORS } from '../../constants';

type Status = 'upcoming' | 'in-progress' | 'done';

type Props = {
  status: Status,
  children: React$Node,
};

export default ({ status, children }: Props) => (
  <Wrapper>
    <IconWrapper>
      {status === 'in-progress' && <Spinner size={24} />}
      {status === 'done' && <Checkmark size={24} icon={iosCheckmarkEmpty} />}
    </IconWrapper>
    <ChildWrapper>{children}</ChildWrapper>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  padding: 10px;
`;

const IconWrapper = styled.div``;

const ChildWrapper = styled.div`
  flex: 1;
`;

const Checkmark = styled(IconBase)`
  color: ${COLORS.green[500]};
`;
