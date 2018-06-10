// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import AddDependencySearchBox from '../AddDependencySearchBox';
import AddDependencySearchResult from '../AddDependencySearchResult';
import Spacer from '../Spacer';

type Props = {
  isVisible: boolean,
  onDismiss: () => void,
};

type State = {
  searchTerm: string,
};

class AddDependencyModal extends Component<Props, State> {
  state = {
    searchTerm: '',
  };

  updateSearchTerm = (ev: SyntheticInputEvent<*>) => {
    this.setState({ searchTerm: ev.target.value });
  };

  render() {
    const { isVisible, onDismiss } = this.props;
    const { searchTerm } = this.state;

    return (
      <InstantSearch
        appId="OFCNCOG2CU"
        apiKey="f54e21fa3a2a0160595bb058179bfb1e"
        indexName="npm-search"
      >
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
              <Hits hitComponent={AddDependencySearchResult} />
            </HitsWrapper>
            <Spacer size={25} />
          </Wrapper>
        </Modal>
      </InstantSearch>
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

export default AddDependencyModal;
