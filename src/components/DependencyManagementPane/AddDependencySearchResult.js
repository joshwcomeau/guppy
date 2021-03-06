// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';
import moment from 'moment';
import IconBase from 'react-icons-kit';
import { u1F4C8 as barGraphIcon } from 'react-icons-kit/noto_emoji_regular/u1F4C8';
import { u1F553 as clockIcon } from 'react-icons-kit/noto_emoji_regular/u1F553';
import { check } from 'react-icons-kit/feather/check';

import * as actions from '../../actions';
import {
  getSelectedProjectId,
  getDependencyMapForSelectedProject,
} from '../../reducers/projects.reducer';
import { RAW_COLORS, COLORS, GRADIENTS } from '../../constants';

import Divider from '../Divider';
import Spacer from '../Spacer';
import Spinner from '../Spinner';
import ExternalLink from '../ExternalLink';
import License from '../License';
import Middot from '../Middot';
import { StrokeButton } from '../Button';
import CustomHighlight from '../CustomHighlight';

import type { DependencyStatus } from '../../types';
import type { Dispatch } from '../../actions/types';

const DEPENDENCY_ACTIONS_COPY = {
  idle: 'Installed',
  installing: 'Installing…',
  updating: 'Updating…',
  deleting: 'Deleting…',
  'queued-install': 'Queued for Install',
  'queued-update': 'Queued for Update',
  'queued-delete': 'Queued for Delete',
};

type Props = {
  projectId: string,
  currentStatus: ?DependencyStatus,
  addDependency: Dispatch<typeof actions.addDependency>,
  hit: {
    name: string,
    description: string,
    downloadsLast30Days: number,
    humanDownloadsLast30Days: string,
    githubRepo: {
      user: string,
      project: string,
    },
    homepage: string,
    modified: number,
    keywords: Array<string>,
    owner: {
      avatar: string,
      name: string,
      link: string,
    },
    license: string,
    version: string,
  },
};

export const StatsItem = ({
  icon,
  children,
}: {
  icon: React$Node,
  children: React$Node,
}) => (
  <StatsItemElem>
    <IconBase icon={icon} size={24} />
    <Spacer size={6} />
    {children}
  </StatsItemElem>
);

export const getColorForDownloadNumber = (num: number) => {
  if (num < 5000) {
    return COLORS.error;
  } else if (num < 50000) {
    return COLORS.lightWarning;
  } else {
    return COLORS.success;
  }
};

export class AddDependencySearchResult extends PureComponent<Props> {
  renderActionArea() {
    const { hit, projectId, currentStatus, addDependency } = this.props;
    const isAlreadyInstalled = currentStatus === 'idle';

    if (isAlreadyInstalled) {
      return (
        <NoActionAvailable>
          <IconBase
            icon={check}
            size={24}
            style={{ color: COLORS.lightSuccess }}
          />
          <Spacer size={6} />
          Installed
        </NoActionAvailable>
      );
    }

    if (currentStatus) {
      return (
        <NoActionAvailable>
          <Spinner size={24} />
          <Spacer size={6} />
          {DEPENDENCY_ACTIONS_COPY[currentStatus]}
        </NoActionAvailable>
      );
    }

    return (
      <StrokeButton
        size="small"
        strokeColors={GRADIENTS.success}
        textColor={COLORS.success}
        onClick={() => addDependency(projectId, hit.name, hit.version)}
      >
        Add To Project
      </StrokeButton>
    );
  }

  render() {
    const { hit } = this.props;

    const npmLink = `https://www.npmjs.org/package/${hit.name}`;

    const downloadNumColor = getColorForDownloadNumber(hit.downloadsLast30Days);

    return (
      <Wrapper>
        <Header>
          <Title>
            <ExternalLink display="inline" href={npmLink}>
              <Name size="small">{hit.name}</Name>
            </ExternalLink>
            <Spacer inline size={15} />
            <Version>v{hit.version}</Version>
          </Title>
          {this.renderActionArea()}
        </Header>

        <Description>
          <CustomHighlight attribute="description" hit={hit} />
        </Description>
        <Spacer size={20} />

        <StatsRow>
          <StatsItem icon={barGraphIcon}>
            <StatsItemHighlight style={{ color: downloadNumColor }}>
              {hit.humanDownloadsLast30Days}
            </StatsItemHighlight>{' '}
            downloads a month
          </StatsItem>
          <Middot />
          <License withIcon license={hit.license} />
          <Middot />
          <StatsItem icon={clockIcon}>
            Published {moment(hit.modified).fromNow()}
          </StatsItem>
        </StatsRow>

        <Spacer size={25} />
        <Divider />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  padding-top: 25px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.div``;

const Name = styled.span`
  font-size: 26px;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  color: ${COLORS.link};
`;

const Version = styled.span`
  color: ${RAW_COLORS.gray[400]};
  font-weight: 400;
  font-size: 20px;
`;

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${RAW_COLORS.gray[500]};
`;

const StatsItemElem = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const Description = styled.div`
  font-size: 18px;
  margin-right: 120px;
`;

const StatsItemHighlight = styled.span`
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  margin-right: 3px;
`;

const NoActionAvailable = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 135px;
  font-size: 15px;
  color: ${RAW_COLORS.gray[400]};
`;

// TODO: I should be able to reuse the existing button component with
// `connectInfiniteHits`
injectGlobal`
  .ais-InfiniteHits-loadMore {
    padding: 10px 30px;
    margin-top: 45px;
    margin-left: 50%;
    background: transparent;
    border: 2px solid ${COLORS.link};
    border-radius: 60px;
    font-size: 18px;
    transform: translateX(-50%);
    cursor: pointer;
    &--disabled {
      display: none;
    }
  }
  .ais-Highlight-highlighted {
    background: none;
    color: inherit;
    font-weight: 700;
  }
`;

const mapStateToProps = (state, ownProps) => {
  const dependencyName = ownProps.hit.name;
  const dependencyMap = getDependencyMapForSelectedProject(state);

  const currentStatus = dependencyMap[dependencyName]
    ? dependencyMap[dependencyName].status
    : null;

  const selectedProjectId = getSelectedProjectId(state);

  if (!selectedProjectId) {
    throw new Error('Trying to add dependencies for a deleted project?');
  }

  return {
    currentStatus,
    projectId: selectedProjectId,
  };
};

const mapDispatchToProps = { addDependency: actions.addDependency };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDependencySearchResult);
