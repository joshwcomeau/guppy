// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS, RAW_COLORS } from '../../constants';

import Heading from '../Heading';
import PixelShifter from '../PixelShifter';
import DependencyDetailsTable from './DependencyDetailsTable';
import DependencyInfoFromNpm from './DependencyInfoFromNpm';
import DependencyUpdateRow from './DependencyUpdateRow';

import type { Dependency } from '../../types';
import type { NpmResult } from './DependencyInfoFromNpm';

type Props = {
  projectId: string,
  dependency: Dependency,
  isOnline: boolean,
};

class DependencyDetails extends PureComponent<Props> {
  render() {
    const { projectId, dependency, isOnline } = this.props;

    return (
      <DependencyInfoFromNpm packageName={dependency.name}>
        {({ name, latestVersion, lastUpdatedAt, isLoading }: NpmResult) => (
          <Fragment>
            <Header>
              <PixelShifter
                y={-4}
                reason="Optical symmetry between top and left edge of parent"
              >
                <HeaderText>
                  <Name size="small">{dependency.name}</Name>
                  <Description>{dependency.description}</Description>
                </HeaderText>
              </PixelShifter>
            </Header>
            <VersionsWrapper>
              <DependencyUpdateRow
                projectId={projectId}
                dependency={dependency}
                isLoadingNpmInfo={isLoading}
                latestVersion={latestVersion}
              />
            </VersionsWrapper>
            <MainContent>
              <DependencyDetailsTable
                projectId={projectId}
                dependency={dependency}
                lastUpdatedAt={lastUpdatedAt}
                isOnline={isOnline}
              />
            </MainContent>
          </Fragment>
        )}
      </DependencyInfoFromNpm>
    );
  }
}

const Header = styled.header`
  position: relative;
  background-image: linear-gradient(
    45deg,
    ${RAW_COLORS.blue[700]},
    ${RAW_COLORS.violet[700]}
  );
  border-radius: 8px 8px 0 0;
  color: ${COLORS.textOnBackground};
`;

const HeaderText = styled.div`
  padding: 15px;
`;

const Name = styled(Heading)`
  color: ${COLORS.textOnBackground};
`;

const Description = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: ${RAW_COLORS.transparentWhite[300]};
  -webkit-font-smoothing: antialiased;
`;

const VersionsWrapper = styled.div`
  padding: 15px;
  height: 72px;
  background: ${RAW_COLORS.gray[100]};
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const MainContent = styled.div`
  padding: 15px;
`;

export default DependencyDetails;
