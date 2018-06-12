// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';
import moment from 'moment';
import IconBase from 'react-icons-kit';
import { u1F4C3 as billIcon } from 'react-icons-kit/noto_emoji_regular/u1F4C3';
import { u1F4C8 as barGraphIcon } from 'react-icons-kit/noto_emoji_regular/u1F4C8';
import { u1F553 as clockIcon } from 'react-icons-kit/noto_emoji_regular/u1F553';
import { check } from 'react-icons-kit/feather/check';

import { getDependencyMapForSelectedProject } from '../../reducers/projects.reducer';

import Spacer from '../Spacer';
import ExternalLink from '../ExternalLink';
import Middot from '../Middot';
import { COLORS } from '../../constants';
import Button from '../Button';

import type { Dependency } from '../../types';

type Props = {
  currentlyInstalledDependencies: {
    [name: string]: Dependency,
  },
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

const StatsItem = ({ icon, children }) => (
  <StatsItemElem>
    <IconBase icon={icon} size={24} />
    <Spacer size={6} />
    {children}
  </StatsItemElem>
);

const getColorForDownloadNumber = (num: number) => {
  if (num < 5000) {
    return COLORS.pink[700];
  } else if (num < 50000) {
    return COLORS.orange[500];
  } else {
    return COLORS.green[700];
  }
};

class AddDependencySearchResult extends Component<Props> {
  render() {
    const { currentlyInstalledDependencies, hit } = this.props;

    const npmLink = `https://www.npmjs.org/package/${hit.name}`;

    const downloadNumColor = getColorForDownloadNumber(hit.downloadsLast30Days);

    const isAlreadyInstalled = !!currentlyInstalledDependencies[hit.name];

    return (
      <Wrapper>
        <Header>
          <Title>
            <ExternalLink href={npmLink}>
              <Name size="small">{hit.name}</Name>
            </ExternalLink>
            <Spacer inline size={15} />
            <Version>v{hit.version}</Version>
          </Title>
          {isAlreadyInstalled ? (
            <AlreadyInstalledWrapper>
              <IconBase
                icon={check}
                size={24}
                style={{ color: COLORS.green[500] }}
              />{' '}
              Already installed
            </AlreadyInstalledWrapper>
          ) : (
            <Button
              size="small"
              color1={COLORS.green[700]}
              color2={COLORS.lightGreen[500]}
              textColor={COLORS.green[700]}
            >
              Add To Project
            </Button>
          )}
        </Header>

        <Description>{hit.description}</Description>
        <Spacer size={20} />

        <StatsRow>
          <StatsItem icon={barGraphIcon}>
            <StatsItemHighlight style={{ color: downloadNumColor }}>
              {hit.humanDownloadsLast30Days}
            </StatsItemHighlight>{' '}
            downloads a month
          </StatsItem>
          <Middot />
          <StatsItem icon={billIcon}>
            <StatsItemHighlight>{hit.license}</StatsItemHighlight> License
          </StatsItem>
          <Middot />
          <StatsItem icon={clockIcon}>
            Last updated {moment(hit.modified).fromNow()}
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

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Title = styled.div``;

const Name = styled.span`
  font-size: 26px;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  color: ${COLORS.blue[700]};
`;

const Version = styled.span`
  color: ${COLORS.gray[400]};
  font-weight: 400;
  font-size: 20px;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${COLORS.gray[500]};
`;

const StatsItemElem = styled.span`
  display: inline-flex;
  align-items: center;
`;

const Description = styled.div`
  font-size: 18px;
  margin-right: 120px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.gray[100]};
`;

const StatsItemHighlight = styled.span`
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  margin-right: 3px;
`;

const AlreadyInstalledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 125px;
  font-size: 15px;
  color: ${COLORS.gray[400]};
`;

// TODO: I should be able to reuse the existing button component with
// `connectInfiniteHits`
injectGlobal`
  .ais-InfiniteHits-loadMore {
    padding: 10px 30px;
    margin-top: 45px;
    margin-left: 50%;
    background: transparent;
    border: 2px solid ${COLORS.blue[700]};
    border-radius: 60px;
    font-size: 18px;
    transform: translateX(-50%);
    cursor: pointer;
  }
`;

const mapStateToProps = state => ({
  currentlyInstalledDependencies: getDependencyMapForSelectedProject(state),
});

export default connect(mapStateToProps)(AddDependencySearchResult);
