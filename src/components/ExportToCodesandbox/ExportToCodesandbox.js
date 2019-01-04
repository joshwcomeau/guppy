// @flow
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { getCodesandboxToken } from '../../reducers/app-settings.reducer';
import { getExportingActiveStatus } from '../../reducers/project-status.reducer';

import ExternalLink from '../ExternalLink';
import FormField from '../FormField';
import TokenInput from '../TokenInput';
import StrokeButton from '../Button/StrokeButton';
import DisabledText from '../DisabledText';
import Spacer from '../Spacer';
import Spinner from '../Spinner';

import type { Project } from '../../types';
import type { Dispatch } from '../../actions/types';

type Props = {
  exportingActive: boolean,
  codesandboxToken: string,
  isFocused: boolean,
  project: Project,
  exportToCodesandbox: Dispatch<typeof actions.exportToCodesandboxStart>,
  updateToken: Dispatch<typeof actions.updateCodesandboxToken>,
  setCodesandboxUrl: Dispatch<typeof actions.setCodesandboxUrl>,
  logout: Dispatch<typeof actions.logoutCodesandbox>,
  onFocus: () => void,
  onBlur: () => void,
};

class ExportToCodesandbox extends PureComponent<Props> {
  logout = (evt: any) => {
    evt.preventDefault();
    const { logout, project } = this.props;

    logout(project.path);
  };
  handleExport = (evt: any) => {
    const { project, exportToCodesandbox } = this.props;
    evt.preventDefault();

    exportToCodesandbox(project.id);
  };
  // todo: Change flow:
  //       1. Token always available before running the code - so no need to opne codesandbox page
  //       2. After export click display External link to created sandbox & store link in project
  render() {
    const {
      codesandboxToken,
      project,
      isFocused,
      onFocus,
      onBlur,
      exportingActive,
    } = this.props;
    const { codesandboxUrl } = project;

    return (
      <ExportToCodesandboxWrapper>
        <FormField size="small" label="Export to Codesandbox.io" spacing={5}>
          <InfoText>
            Go to the Codesandbox website by clicking the link and copy the
            token. Then paste the token in the token field.{' '}
          </InfoText>
          <ExternalLink href="https://codesandbox.io/cli/login">
            Get new token
          </ExternalLink>
        </FormField>
        <Wrapper>
          <FormField label="Codesandbox token" spacing={0}>
            <TokenRow>
              <TokenInput
                token={codesandboxToken}
                onChange={this.props.updateToken}
                onFocus={onFocus}
                onBlur={onBlur}
                focused={isFocused}
                disabled={codesandboxToken !== ''}
              />
              {codesandboxToken &&
                !isFocused && (
                  <Fragment>
                    <Spacer size={10} />
                    <StrokeButton size="small" onClick={this.logout}>
                      Logout
                    </StrokeButton>
                  </Fragment>
                )}
            </TokenRow>
          </FormField>
          <Action>
            <StrokeButton
              onClick={this.handleExport}
              size="small"
              strokeColors={[COLORS.green[700], COLORS.lightGreen[500]]}
              disabled={!codesandboxToken || exportingActive}
            >
              <ButtonCaption>
                {exportingActive && (
                  <Fragment>
                    <Spinner size={24} />
                    <Spacer size={6} />
                  </Fragment>
                )}
                Export to Codesandbox
              </ButtonCaption>
            </StrokeButton>
            {!codesandboxToken && (
              <DisabledText>
                Export disabled because token is missing.
              </DisabledText>
            )}

            {codesandboxUrl && (
              <Fragment>
                <Spacer size={5} />
                <InfoText>
                  Codesandbox created <strong>{codesandboxUrl}</strong>
                  <ExternalLink href={codesandboxUrl}>
                    Open sandbox
                  </ExternalLink>
                </InfoText>
              </Fragment>
            )}
          </Action>
        </Wrapper>
      </ExportToCodesandboxWrapper>
    );
  }
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const ButtonCaption = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const ExportToCodesandboxWrapper = styled.div`
  margin-top: 16px;
`;

const Action = styled.div`
  margin: auto 0;
  padding-top: 5px;
`;

const InfoText = styled.div``;

const TokenRow = styled.div`
  display: flex;
  align-items: center;
`;

const mapStateToProps = state => {
  const project = getSelectedProject(state);

  return {
    project,
    exportingActive: getExportingActiveStatus(state, project && project.id),
    codesandboxToken: getCodesandboxToken(state),
  };
};

const mapDispatchToProps = {
  exportToCodesandbox: actions.exportToCodesandboxStart,
  logout: actions.logoutCodesandbox,
  updateToken: actions.updateCodesandboxToken,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportToCodesandbox);
