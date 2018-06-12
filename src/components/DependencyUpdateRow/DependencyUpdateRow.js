// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';

import { COLORS } from '../../constants';

import Button from '../Button';
import Label from '../Label';
import Spinner from '../Spinner';
import Spacer from '../Spacer';
import FadeIn from '../FadeIn';

import type { Dependency } from '../../types';

type Props = {
  projectId: string,
  dependency: Dependency,
  isLoadingNpmInfo: boolean,
  latestVersion: ?string,
  updateDependency: (projectId: string, dependency: Dependency) => void,
};

class DependencyUpdateRow extends Component<Props> {
  renderActionColumn() {
    const {
      projectId,
      dependency,
      isLoadingNpmInfo,
      latestVersion,
      updateDependency,
    } = this.props;

    if (isLoadingNpmInfo) {
      return (
        <FadeIn duration={500}>
          <Spinner size={22} />
        </FadeIn>
      );
    }

    const isUpToDate = dependency.version === latestVersion;

    return isUpToDate ? (
      <UpToDate>
        <IconBase icon={check} size={24} style={{ color: COLORS.green[500] }} />
        <Spacer size={6} />
        Up-to-date
      </UpToDate>
    ) : (
      <Button
        size="small"
        type="fill"
        color1={COLORS.green[700]}
        color2={COLORS.lightGreen[500]}
        onClick={() => updateDependency(projectId, dependency)}
      >
        Update
      </Button>
    );
  }

  render() {
    const { dependency, latestVersion } = this.props;

    return (
      <Wrapper>
        <Col>
          <VersionLabel>Installed Version</VersionLabel>
          <VersionNum>{dependency.version}</VersionNum>
        </Col>

        <Col>
          <VersionLabel>Latest Version</VersionLabel>
          <VersionNum>{latestVersion || '--'}</VersionNum>
        </Col>

        <Col>{this.renderActionColumn()}</Col>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Col = styled.div`
  width: 150px;
  text-align: center;
`;

const VersionLabel = styled(Label)`
  color: ${COLORS.gray[600]};
`;

const VersionNum = styled.div`
  margin-top: 3px;
  font-size: 22px;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  line-height: 22px;
`;

const UpToDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: ${COLORS.green[700]};
  font-weight: 500;
`;

export default DependencyUpdateRow;
