// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { externalLink } from 'react-icons-kit/feather/externalLink';
import { settings } from 'react-icons-kit/feather/settings';

import { COLORS, BREAKPOINTS } from '../../constants';
import { capitalize } from '../../utils';

import ExternalLink from '../ExternalLink';
import LargeLED from '../LargeLED';
import Spacer from '../Spacer';

import type { TaskStatus } from '../../types';

type Props = {
  status: TaskStatus,
};

const DevelopmentServerStatus = ({ status }: Props) => {
  const isRunning = status !== 'idle';

  return (
    <Wrapper>
      <LargeLED status={status} />
      <StatusTextWrapper>
        <Status>{capitalize(status)}</Status>
        <StatusCaption>
          {isRunning ? (
            <ExternalLink
              color={COLORS.gray[700]}
              hoverColor={COLORS.gray[900]}
              href="http://localhost:3000"
            >
              <IconLinkContents>
                <IconBase icon={externalLink} />
                <Spacer inline size={5} />
                Open App
              </IconLinkContents>
            </ExternalLink>
          ) : (
            <ExternalLink
              color={COLORS.gray[700]}
              hoverColor={COLORS.gray[900]}
              href="http://localhost:3000"
            >
              <IconLinkContents>
                <IconBase icon={settings} />
                <Spacer inline size={5} />
                Configure Server
              </IconLinkContents>
            </ExternalLink>
          )}
        </StatusCaption>
      </StatusTextWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid ${COLORS.gray[200]};
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 24px;

  @media ${BREAKPOINTS.sm} {
    flex-direction: column;
    width: 250px;
    text-align: center;
  }

  @media ${BREAKPOINTS.mdMin} {
    margin-top: 20px;
  }
`;

const StatusTextWrapper = styled.div`
  position: relative;

  @media ${BREAKPOINTS.sm} {
    margin-top: 5px;
  }

  @media ${BREAKPOINTS.mdMin} {
    margin-left: 10px;
  }
`;

const StatusCaption = styled.div`
  margin-top: 4px;
  font-size: 14px;
  font-weight: 400;
`;

const IconLinkContents = styled.div`
  display: flex;
  align-items: center;
`;

const Status = styled.div`
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  -webkit-font-smoothing: antialiased;
  color: ${COLORS.gray[900]};
  line-height: 28px;
`;

export default DevelopmentServerStatus;
