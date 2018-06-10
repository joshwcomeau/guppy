// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import IconBase from 'react-icons-kit';
import { u1F4C3 as billIcon } from 'react-icons-kit/noto_emoji_regular/u1F4C3';
import { u1F516 as tagIcon } from 'react-icons-kit/noto_emoji_regular/u1F516';
import { u1F4C8 as barGraphIcon } from 'react-icons-kit/noto_emoji_regular/u1F4C8';
import { u1F553 as clockIcon } from 'react-icons-kit/noto_emoji_regular/u1F553';

import Heading from '../Heading';
import Spacer from '../Spacer';
import ExternalLink from '../ExternalLink';
import Middot from '../Middot';
import { COLORS } from '../../constants';
import Button from '../Button';

type Props = {
  hit: {
    name: string,
    description: string,
    humanDownloadsLast30Days: number,
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

class AddDependencySearchResult extends Component<Props> {
  render() {
    const { hit } = this.props;

    const npmLink = `https://www.npmjs.org/package/${hit.name}`;

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
          <Button
            size="small"
            color1={COLORS.green[700]}
            color2={COLORS.lightGreen[500]}
            textColor={COLORS.green[700]}
          >
            Add To Project
          </Button>
        </Header>

        <Description>{hit.description}</Description>
        <Spacer size={20} />

        <StatsRow>
          <StatsItem icon={barGraphIcon}>2.3k downloads a month</StatsItem>
          <Middot />
          <StatsItem icon={billIcon}>MIT License</StatsItem>
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

const Avatar = styled.img`
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

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

const CreatorRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
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
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.gray[100]};
`;

const LastUpdated = styled.span`
  padding-left: 10px;
  color: ${COLORS.gray[500]};
  font-size: 0.9em;
`;

export default AddDependencySearchResult;
