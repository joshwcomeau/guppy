// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import fetch from 'node-fetch'; // Note: This is using net.request from Node. Browser fetch throws CORS error.
import styled from 'styled-components';
import yaml from 'js-yaml';
import Scrollbars from 'react-custom-scrollbars';
import { Tooltip } from 'react-tippy';

import Divider from '../../Divider';
import Spacer from '../../Spacer';
import ExternalLink from '../../ExternalLink';
import TextInput from '../../TextInput';
import Spinner from '../../Spinner';
import CodesandboxLogo from '../../CodesandboxLogo';

import StrokeButton from '../../Button/StrokeButton';
import Paragraph from '../../Paragraph';
import Heading from '../../Heading';
import Modal from '../../Modal';
import ModalHeader from '../../ModalHeader';

import * as actions from '../../../actions';

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
  paginationIndex: number,
  filterString: '',
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
    paginationIndex: 10,
    filterString: '',
  };

  PAGINATION_STEP = 10;

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // Clear search string on modal open display
    return {
      ...prevState,
      filterString: '',
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

    this.setState({
      selectedStarterInModal: '',
    });
    this.props.hideModal();
  };

  setStarter = starter => {
    this.setState({
      selectedStarterInModal: starter,
    });
  };

  handleShowMore = () => {
    let newIndex = this.state.paginationIndex + this.PAGINATION_STEP;
    newIndex = Math.min(this.state.starters.length, newIndex); // limit
    this.setState({
      paginationIndex: newIndex,
    });
  };

  updateSearchString = evt => {
    this.setState({
      filterString: evt.target.value,
    });
  };

  render() {
    const { isVisible, hideModal } = this.props;
    const {
      loading,
      starters,
      selectedStarterInModal,
      paginationIndex,
      filterString,
    } = this.state;
    const filteredStarters = starters.filter(
      starter => filterString === '' || starter.repo.includes(filterString)
    );
    const disabledUseSelect = selectedStarterInModal === '';

    return (
      <Modal isVisible={isVisible} onDismiss={hideModal}>
        <ModalHeader title="Select starter" />

        <MainContent>
          <Paragraph>
            For a better overview you can also have a look at the Gatsby
            starters library{' '}
            <ExternalLink href="https://www.gatsbyjs.org/starters/">
              here.
            </ExternalLink>
          </Paragraph>
          <TextInput
            placeholder="What are you looking for? E.g. type blog to see all blog-starters ..."
            onChange={this.updateSearchString}
          />
          <Spacer size={10} />
          <ScrollContainer>
            <StarterList>
              {loading && (
                <center>
                  <Spinner size={22} />
                </center>
              )}
              {filteredStarters
                .slice(0, paginationIndex)
                .map((starter, index) => (
                  <StarterItem key={index}>
                    <StarterItemTitle>
                      <StarterItemHeading
                        size="small"
                        selected={selectedStarterInModal === starter.repo}
                        onClick={() => this.setStarter(starter.repo)}
                      >
                        {starter.repo.split('/').pop()}
                      </StarterItemHeading>
                      <ExternalLink
                        href={this.prepareUrlForCodesandbox(starter.repo)}
                      >
                        <Tooltip title="Preview in Codesandbox">
                          <CodesandboxLogo />
                        </Tooltip>
                      </ExternalLink>
                    </StarterItemTitle>

                    <Spacer size={10} />
                    <Paragraph>
                      {starter.description !== 'n/a' && starter.description}
                    </Paragraph>
                    <Divider />
                  </StarterItem>
                ))}
            </StarterList>

            {/* Show more button if we're having more starters to display */}
            {paginationIndex < filteredStarters.length && (
              <ShowMoreWrapper>
                <StrokeButton
                  strokeColors={[COLORS.gray[200], COLORS.gray[500]]}
                  onClick={this.handleShowMore}
                >
                  Show more...
                </StrokeButton>
              </ShowMoreWrapper>
            )}
          </ScrollContainer>
          <Actions>
            {/* Todo: Refactor OK/Cancel buttons into a component. So this is reusable. */}
            <StrokeButton
              fillColor={disabledUseSelect ? COLORS.gray[400] : COLORS.white}
              strokeColors={
                !disabledUseSelect
                  ? [COLORS.green[700], COLORS.lightGreen[500]]
                  : [COLORS.gray[400], COLORS.gray[400]]
              }
              onClick={this.handleDialogOK}
              disabled={disabledUseSelect}
              children={
                disabledUseSelect ? (
                  <Tooltip title="Select a starter from the list">
                    Use Selection
                  </Tooltip>
                ) : (
                  'Use Selection'
                )
              }
            />
            <Spacer size={15} />
            <StrokeButton onClick={hideModal}>Cancel</StrokeButton>
          </Actions>
        </MainContent>
      </Modal>
    );
  }
}

/*
  Actions could be refactored in a component 
  used here and in ProjectConfigurationModal
*/
const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
`;

const ScrollContainer = styled(Scrollbars)`
  min-height: 60vh;
`;

const ShowMoreWrapper = styled.div`
  padding: 10px;
`;

const StarterList = styled.div`
  padding: 15px;
`;
const StarterItem = styled.div`
  padding: 8px 10px;
`;

const StarterItemHeading = styled(Heading)`
  cursor: pointer;
  border-radius: 6px;
  border: 2px solid
    ${props => (props.selected ? COLORS.purple[500] : COLORS.gray[200])};
  padding: 6px;
`;

const StarterItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
