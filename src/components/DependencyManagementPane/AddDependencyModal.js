// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { InfiniteHits } from 'react-instantsearch/dom';
import { connectStateResults } from 'react-instantsearch/connectors';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Spacer from '../Spacer';
import FadeOnChange from '../FadeOnChange';
import AddDependencySearchBox from './AddDependencySearchBox';
import AddDependencySearchResult from './AddDependencySearchResult';
import AddDependencyInitialScreen from './AddDependencyInitialScreen';

type Props = {
  isVisible: boolean,
  onDismiss: () => void,
  // Provided by `connectStateResults`:
  searchResults: {
    query?: string,
  },
};

export class AddDependencyModal extends Component<Props> {
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
            <FadeOnChange changeKey={!!hasSearchQuery}>
              {hasSearchQuery ? (
                <InfiniteHits hitComponent={AddDependencySearchResult} />
              ) : (
                <AddDependencyInitialScreen />
              )}
            </FadeOnChange>
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

export default connectStateResults(AddDependencyModal);
