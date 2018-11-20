// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import fetch from 'node-fetch'; // Note: This is using net.request from Node. Browser fetch throws CORS error.
import styled from 'styled-components';
import yaml from 'js-yaml';
import Scrollbars from 'react-custom-scrollbars';

import Divider from '../../Divider';
import Spacer from '../../Spacer';
import ExternalLink from '../../ExternalLink';

// import { SearchBox } from 'react-instantsearch/dom';
// import {
//   InstantSearch,
//   InfiniteHits,
//   Configure,
// } from 'react-instantsearch/dom';

import FillButton from '../../Button/FillButton';
import Paragraph from '../../Paragraph';
import Heading from '../../Heading';
import Modal from '../../Modal';
import ModalHeader from '../../ModalHeader';

import * as actions from '../../../actions';

// import { ALGOLIA_KEYS } from '../../../constants';
import { COLORS } from '../../../constants';
import type { Dispatch } from '../../../actions/types';

type Props = {
  updateFieldValue: (string, string) => void,
  selectedStarter: string,
  isVisible: boolean,
  hideModal: Dispatch<typeof actions.hideStarterSelectionModal>,
};

type State = {
  loading: boolean,
  starters: Array<any>,
  selectedStarterInModal: string,
};

/*
Gatsby starter selection dialog.
A starter object from starter.yml contains the following data:
[
   {
      "url": "https://wonism.github.io/",
      "repo": "https://github.com/wonism/gatsby-advanced-blog",
      "description": "n/a",
      "tags": [
        "Portfolio",
        "Redux"
      ],
      "features": [
        "feature items"
      ]
  }, ... 
]
*/
class SelectStarterDialog extends PureComponent<Props, State> {
  state = {
    loading: true,
    starters: [],
    selectedStarterInModal: '',
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return {
      selectedStarterInModal: nextProps.selectedStarter,
    };
  }

  componentDidMount() {
    fetch(
      'https://raw.githubusercontent.com/gatsbyjs/gatsby/master/docs/starters.yml'
    )
      .then(response => response.text())
      .then(yamlText => {
        const starters = yaml.safeLoad(yamlText);

        this.setState({
          loading: false,
          starters,
        });
      });
  }

  prepareUrlForCodesandbox(repoUrl: string) {
    // Remove http protocol
    const sandboxUrl = `https://codesandbox.io/s/${repoUrl.replace(
      /(^\w+:|^)\/\//,
      ''
    )}`;
    // Remove .com from github.com --> to have /s/github/repo
    return sandboxUrl.replace(/\.com/, '');
  }

  handleDialogOK = () => {
    this.props.updateFieldValue(
      'projectStarter',
      this.state.selectedStarterInModal
    );
    this.props.hideModal();
  };

  setStarter = starter => {
    this.setState({
      selectedStarterInModal: starter,
    });
  };

  render() {
    const { isVisible, hideModal } = this.props;
    const { starters, selectedStarterInModal } = this.state;
    console.log('render dialog', selectedStarterInModal);
    return (
      <Modal isVisible={isVisible} onDismiss={hideModal}>
        <ModalHeader title="Select starter" />

        <MainContent>
          <Paragraph>
            Please select a starter template for your new project.
          </Paragraph>
          <ScrollContainer>
            <StarterList>
              {starters.slice(0, 10).map((starter, index) => (
                <Fragment>
                  <StarterItem
                    selected={selectedStarterInModal === starter.repo}
                    key={index}
                    onClick={() => this.setStarter(starter.repo)}
                  >
                    <Heading size="small">{starter.repo}</Heading>
                    {starter.description !== 'n/a' && (
                      <Paragraph>{starter.description}</Paragraph>
                    )}
                    <ExternalLink
                      href={this.prepareUrlForCodesandbox(starter.repo)}
                    >
                      Preview in Codesandbox
                    </ExternalLink>
                    <Spacer size={25} />
                  </StarterItem>
                  <Divider />
                </Fragment>
              ))}
            </StarterList>

            {/* We could add Algolia here --> Setup at Algolia required */}
            {/* <InstantSearch {...ALGOLIA_KEYS}>
          <Configure
            attributesToRetrieve={[
              'name',
              'version',
              'description',
              'modified',
              'humanDownloadsLast30Days',
              'license',
            ]}
            hitsPerPage={10}
          />
          <SearchBox onChange={value => console.log(value)} />
          <InfiniteHits
            hitComponent={({ hit }) => (
              <div onClick={() => onSelect(hit.name)}>
                {hit.name}
              </div>
            )}
          />
        </InstantSearch> */}
          </ScrollContainer>
          <FillButton onClick={this.handleDialogOK}>Use selected</FillButton>
          <FillButton onClick={hideModal}>Cancel</FillButton>
        </MainContent>
      </Modal>
    );
  }
}

const ScrollContainer = styled(Scrollbars)`
  min-height: 60vh;
`;

const StarterList = styled.div``;
const StarterItem = styled.div`
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 6px;
  border: 2px solid
    ${props => (props.selected ? COLORS.purple[500] : 'transparent')};
`;

const MainContent = styled.div`
  padding: 25px;
`;
const mapStateToProps = state => {
  return {
    isVisible: state.modal === 'new-project-wizard/select-starter',
  };
};

export default connect(
  mapStateToProps,
  {
    hideModal: actions.hideStarterSelectionModal,
  }
)(SelectStarterDialog);
