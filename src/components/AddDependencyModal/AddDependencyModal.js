// @flow
import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import { SearchBox, Hits, PoweredBy } from 'react-instantsearch/dom';
import { connectStateResults } from 'react-instantsearch/connectors';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Paragraph from '../Paragraph';
import Spacer from '../Spacer';
import AddDependencySearchBox from '../AddDependencySearchBox';
import AddDependencySearchResult from '../AddDependencySearchResult';

type Props = {
  isVisible: boolean,
  onDismiss: () => void,
  // Provided by `connectStateResults`:
  searchResults: {
    query?: string,
  },
};

class AddDependencyModal extends Component<Props> {
  render() {
    const { isVisible, onDismiss, searchResults } = this.props;

    const hasSearchQuery = searchResults && !!searchResults.query;

    return (
      <Modal
        width={620}
        height={800}
        isVisible={isVisible}
        onDismiss={onDismiss}
      >
        <Wrapper>
          <ModalHeader title="Add New Dependency" theme="blueish">
            <AddDependencySearchBox />
          </ModalHeader>

          <HitsWrapper>
            {hasSearchQuery ? (
              <Hits hitComponent={AddDependencySearchResult} />
            ) : (
              <EmptyState>
                <Logo>🐠</Logo>
                <Paragraph>
                  You can use the input above to search the Node Package Manager
                  (NPM) registry for packages that have been published.
                </Paragraph>
                <Paragraph>
                  Search by package name, description, keyword, or author.
                </Paragraph>
                <PoweredByWrapper>
                  <PoweredBy />
                </PoweredByWrapper>
              </EmptyState>
            )}
          </HitsWrapper>
          <Spacer size={25} />
        </Wrapper>
      </Modal>
    );
  }
}

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HitsWrapper = styled.div`
  flex: 1;
  padding: 25px;
  padding-top: 0;
  overflow: auto;
`;

const EmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 100px 40px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 96px;
  filter: grayscale(100%);
`;

const PoweredByWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 25px;
  text-align: center;
`;

injectGlobal`
  .ais-PoweredBy {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ais-PoweredBy-text {
    margin-right: 10px;
  }
`;

export default connectStateResults(AddDependencyModal);
