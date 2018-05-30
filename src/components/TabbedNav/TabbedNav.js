// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import { NodeConsumer } from '../NodeProvider';
import Scoocher from '../Scoocher';
import Tab from './Tab';

type TabProps = {
  id: string,
  label: string,
  href: string,
};

type Props = {
  tabs: Array<TabProps>,
  selectedTabId: string,
};

class TabbedNav extends PureComponent<Props> {
  render() {
    const { tabs, selectedTabId } = this.props;

    const tabIds = tabs.map(tab => tab.id);

    return (
      <Wrapper>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            id={tab.id}
            href={tab.href}
            isSelected={selectedTabId === tab.id}
          >
            {tab.label}
          </Tab>
        ))}
        <NodeConsumer>
          {({ nodes, boundingBoxes }) => {
            return (
              <Scoocher
                nodeIds={tabIds}
                selectedNodeId={selectedTabId}
                boundingBoxes={boundingBoxes}
              />
            );
          }}
        </NodeConsumer>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  border-bottom: 1px solid ${COLORS.gray[800]};
`;

export default TabbedNav;
