// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import { NodeConsumer } from '../NodeProvider';

console.log(NodeConsumer);

type Props = {
  id: string,
  href: string,
  isSelected: boolean,
  children: React$Node,
};

const Tab = ({ id, href, isSelected, children }: Props) => {
  return (
    <NodeConsumer>
      {({ refCapturer }) => (
        <TabWrapper innerRef={node => refCapturer(id, node)}>
          <TabLink to={href} isSelected={isSelected}>
            {children}
          </TabLink>
        </TabWrapper>
      )}
    </NodeConsumer>
  );
};

const TabWrapper = styled.div`
  margin: 0 10px;

  &:first-of-type {
    margin-left: 0;
  }
`;

const TabLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  padding: 0 25px;
  font-size: 22px;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: -0.5px;
  -webkit-font-smoothing: antialiased;
  color: ${props => (props.isSelected ? COLORS.blue[700] : COLORS.gray[800])};
`;

export default Tab;
