// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import { getPackageJsonLockedForProjectId } from '../../reducers/package-json-locked.reducer';

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
  // From redux:
  isPackageJsonLocked: boolean,
  updateDependencyStart: (
    projectId: string,
    dependencyName: string,
    latestVersion: string
  ) => void,
};

class DependencyUpdateRow extends Component<Props> {
  renderActionColumn() {
    const {
      projectId,
      dependency,
      isLoadingNpmInfo,
      latestVersion,
      updateDependencyStart,
      isPackageJsonLocked,
    } = this.props;

    if (isLoadingNpmInfo || !latestVersion) {
      return (
        <FadeIn duration={500}>
          <Spinner size={22} />
        </FadeIn>
      );
    }

    const isUpToDate = dependency.version === latestVersion;
    const isUpdating = dependency.status === 'updating';

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
        style={{ width: 80 }}
        disabled={isPackageJsonLocked}
        onClick={() =>
          updateDependencyStart(projectId, dependency.name, latestVersion)
        }
      >
        {isUpdating ? <Spinner size={16} color={COLORS.white} /> : 'Update'}
      </Button>
    );
  }

  render() {
    const { dependency, latestVersion } = this.props;

    return (
      <Wrapper>
        <Col>
          <VersionLabel>Latest Version</VersionLabel>
          <VersionNum>{latestVersion || '--'}</VersionNum>
        </Col>

        <Col>
          <VersionLabel>Installed Version</VersionLabel>
          <VersionNum>{dependency.version}</VersionNum>
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

const mapStateToProps = (state, ownProps) => ({
  isPackageJsonLocked: getPackageJsonLockedForProjectId(
    state,
    ownProps.projectId
  ),
});

export default connect(
  mapStateToProps,
  { updateDependencyStart: actions.updateDependencyStart }
)(DependencyUpdateRow);
