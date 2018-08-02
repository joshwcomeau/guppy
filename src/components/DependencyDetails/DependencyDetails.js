// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Heading from '../Heading';
import PixelShifter from '../PixelShifter';
import DependencyDetailsTable from '../DependencyDetailsTable';
import DependencyInfoFromNpm from '../DependencyInfoFromNpm';
import DependencyUpdateRow from '../DependencyUpdateRow';

import type { Dependency } from '../../types';
import type { NpmResult } from '../DependencyInfoFromNpm';

type Props = {
  projectId: string,
  dependency: Dependency,
};

class DependencyDetails extends PureComponent<Props> {
  render() {
    const { projectId, dependency } = this.props;

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
    ${COLORS.blue[700]},
    ${COLORS.violet[700]}
  );
  border-radius: 8px 8px 0 0;
  color: ${COLORS.white};
`;

const HeaderText = styled.div`
  padding: 15px;
`;

const Name = styled(Heading)`
  color: ${COLORS.white};
`;

const Description = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: ${COLORS.transparentWhite[300]};
  -webkit-font-smoothing: antialiased;
`;

const VersionsWrapper = styled.div`
  padding: 15px;
  height: 72px;
  background: ${COLORS.gray[100]};
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const MainContent = styled.div`
  padding: 15px;
`;

export default DependencyDetails;
