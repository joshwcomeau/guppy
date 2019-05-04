// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Scrollbars from 'react-custom-scrollbars';
import { Tooltip } from 'react-tippy';

import Divider from '../../Divider';
import ExternalLink from '../../ExternalLink';
import CodesandboxLogo from '../../CodesandboxLogo';
import StrokeButton from '../../Button/StrokeButton';

import { RAW_COLORS } from '../../../constants';

type Props = {
  updateStarter: (string, boolean) => void,
  handleShowMore: () => void,
  selectedStarter: string,
  isVisible: boolean,
  starters: Array<any>,
  paginationIndex: number,
  lastIndex: number,
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
class SelectStarterList extends PureComponent<Props> {
  node: any;

  handleUpdateStarter = (starter: string, removeSelection: boolean) => {
    const { updateStarter } = this.props;

    updateStarter(starter, removeSelection);

    // Scroll to top as the selected starter will be the first entry
    this.node.scrollTop(0);
  };

  prepareUrlForCodesandbox(repoUrl: string) {
    // Remove http protocol
    const sandboxUrl = `https://codesandbox.io/s/${repoUrl.replace(
      /(^\w+:|^)\/\//,
      ''
    )}`;
    // Remove .com from github.com --> to have /s/github/repo
    return sandboxUrl.replace(/\.com/, '');
  }

  render() {
    const {
      isVisible,
      starters,
      selectedStarter,
      paginationIndex,
      lastIndex,
      handleShowMore,
    } = this.props;

    return (
      <MainContent isVisible={isVisible}>
        <ScrollContainer innerRef={node => (this.node = node)}>
          <StarterList>
            {starters.map((starter, index) => (
              <StarterItem key={index}>
                <StarterItemTitle>
                  <StarterItemHeading
                    selected={selectedStarter === starter.repo}
                    onClick={() =>
                      this.handleUpdateStarter(
                        starter.repo,
                        selectedStarter === starter.repo
                      )
                    }
                  >
                    {starter.repo.split('/').pop()}
                  </StarterItemHeading>
                  <SelectionInfo visible={selectedStarter === starter.repo}>
                    selected
                  </SelectionInfo>
                  <ExternalLink
                    href={this.prepareUrlForCodesandbox(starter.repo)}
                  >
                    <Tooltip title="Preview in Codesandbox">
                      <CodesandboxLogo />
                    </Tooltip>
                  </ExternalLink>
                </StarterItemTitle>

                <Description>
                  {starter.description === 'n/a'
                    ? 'No description'
                    : starter.description}
                </Description>
                <Divider />
              </StarterItem>
            ))}

            {/* Show more button if we're having more starters to display */}
            {paginationIndex < lastIndex && (
              <ShowMoreWrapper>
                <StrokeButton
                  size="small"
                  strokeColors={[RAW_COLORS.gray[200], RAW_COLORS.gray[500]]}
                  onClick={handleShowMore}
                >
                  Show more...
                </StrokeButton>
              </ShowMoreWrapper>
            )}
          </StarterList>
        </ScrollContainer>
      </MainContent>
    );
  }
}

const Description = styled.p`
  font-size: 15px;
  padding: 0 5px 2px;
  hyphens: auto;
  text-align: justify;
`;

const SelectionInfo = styled.div`
  background: ${RAW_COLORS.gray[200]};
  border-radius: 5px;
  padding: 5px;
  ${({ visible }) => !visible && 'display: none;'};
`;

const ScrollContainer = styled(Scrollbars)`
  min-height: 120px;
  border: 1px solid ${RAW_COLORS.gray[400]};
  border-radius: 4px;
`;

export const ShowMoreWrapper = styled.div`
  padding: 4px;
`;

const StarterList = styled.div`
  padding: 10px;
`;

export const StarterItem = styled.div`
  font-size: 15px;
  padding: 4px;
  padding-right: 10px;
`;

export const StarterItemHeading = styled.div`
  cursor: pointer;
  border-radius: 6px;
  border: 2px solid
    ${props =>
      props.selected ? RAW_COLORS.purple[500] : RAW_COLORS.gray[200]};
  padding: 2px 5px;
  font-size 15px;
  font-weight: bold;
`;

const StarterItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MainContent = styled.div`
  padding: 5px 0;
  opacity: ${({ isVisible }) => (isVisible ? 1.0 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'all' : 'none')};
  z-index: 1;
`;

export default SelectStarterList;
