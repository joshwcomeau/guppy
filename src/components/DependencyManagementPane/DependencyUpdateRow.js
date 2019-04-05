// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';

import * as actions from '../../actions';
import { COLORS, GRADIENTS } from '../../constants';

import { getOnlineState } from '../../reducers/app-status.reducer';

import { FillButton } from '../Button';
import Label from '../Label';
import Spinner from '../Spinner';
import Spacer from '../Spacer';
import FadeIn from '../FadeIn';

import type { Dependency } from '../../types';
import type { Dispatch } from '../../actions/types';

type Props = {
  projectId: string,
  dependency: Dependency,
  isLoadingNpmInfo: boolean,
  latestVersion: string,
  isOnline: boolean,
  // From redux:
  updateDependency: Dispatch<typeof actions.updateDependency>,
};

class DependencyUpdateRow extends Component<Props> {
  renderActionColumn() {
    const {
      projectId,
      dependency,
      isLoadingNpmInfo,
      latestVersion,
      updateDependency,
      isOnline,
    } = this.props;

    if (isOnline) {
      if (isLoadingNpmInfo || !latestVersion) {
        return (
          <FadeIn duration={500}>
            <Spinner size={22} />
          </FadeIn>
        );
      }
    }

    const isUpToDate = dependency.version === latestVersion;
    const isUpdating = dependency.status === 'updating';

    return isUpToDate ? (
      <UpToDate>
        <IconBase
          icon={check}
          size={24}
          style={{ color: COLORS.lightSuccess }}
        />
        <Spacer size={6} />
        Up-to-date
      </UpToDate>
    ) : (
      <FillButton
        size="small"
        colors={GRADIENTS.success}
        style={{ width: 80 }}
        onClick={() =>
          updateDependency(projectId, dependency.name, latestVersion)
        }
      >
        {isUpdating ? (
          <Spinner size={16} color={COLORS.textOnBackground} />
        ) : (
          'Update'
        )}
      </FillButton>
    );
  }

  render() {
    const { dependency, latestVersion, isOnline } = this.props;

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
        <UpdateCol isOnline={isOnline}> {this.renderActionColumn()} </UpdateCol>
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

const UpdateCol = styled.div`
  width: 150px;
  text-align: center;
  opacity: ${props => (props.isOnline ? 1 : 0.5)};
  pointer-events: ${props => (props.isOnline ? 'auto' : 'none')};
`;

// eslint-disable-next-line no-unexpected-multiline
const VersionLabel = styled(Label)`
  color: ${COLORS.lightText};
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
  color: ${COLORS.success};
  font-weight: 500;
`;

const mapStateToProps = state => ({
  isOnline: getOnlineState(state),
});

export default connect(
  mapStateToProps,
  {
    updateDependency: actions.updateDependency,
  }
)(DependencyUpdateRow);
