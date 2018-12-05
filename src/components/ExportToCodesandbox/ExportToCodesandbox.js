// @flow
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { getCodesandboxToken } from '../../reducers/app-settings.reducer';

import ExternalLink from '../ExternalLink';
import FormField from '../FormField';
import TokenInput from '../TokenInput';
import StrokeButton from '../Button/StrokeButton';
import DisabledText from '../DisabledText';
import Spacer from '../Spacer';

import type { Project } from '../../types';
import type { Dispatch } from '../../actions/types';

type State = {
  focusTokenInput: boolean,
};

type Props = {
  codesandboxToken: string,
  isFocused: boolean,
  project: Project,
  updateCodesandboxToken: Dispatch<typeof actions.updateCodesandboxToken>,
  setCodesandboxUrl: Dispatch<typeof actions.setCodesandboxUrl>,
  onFocus: () => void,
  onBlur: () => void,
};

class ExportToCodesandbox extends PureComponent<Props, State> {
  // todo: rename as export is a reserved keyword!
  export = (evt: any) => {
    const { export: exportSandbox, project } = this.props;
    evt.preventDefault();

    exportSandbox(project.path);
  };

  logout = (evt: any) => {
    evt.preventDefault();
    const { logout, project } = this.props;

    logout(project.path);
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
    } = this.props;
    const { codesandboxUrl } = project;

    return (
      <ExportToCodesandboxWrapper>
        <FormField size="small" label="Export to Codesandbox.io">
          <InfoText>
            Goto Codesandbox website by clicking the link and copy the token.
            Then paste the token in the token field.{' '}
          </InfoText>
          <ExternalLink href="https://codesandbox.io/cli/login">
            Get new token
          </ExternalLink>
        </FormField>
        <Wrapper>
          <FormField label="Codesandbox token">
            <TokenRow>
              <TokenInput
                token={codesandboxToken}
                onChange={this.props.updateToken}
                onFocus={onFocus}
                onBlur={onBlur}
                focused={isFocused}
                disabled={codesandboxToken !== ''}
              />
              {codesandboxToken && (
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
              onClick={this.export}
              size="small"
              strokeColors={[COLORS.green[700], COLORS.lightGreen[500]]}
              disabled={!codesandboxToken}
            >
              Export to Codesandbox
            </StrokeButton>
            {!codesandboxToken && (
              <DisabledText>
                Export disabled because token is missing.
              </DisabledText>
            )}
            <Spacer size={5} />
            <InfoText>
              {codesandboxUrl && (
                <div>
                  Codesandbox created <strong>{codesandboxUrl}</strong>
                  <ExternalLink href={codesandboxUrl}>
                    Open sandbox
                  </ExternalLink>
                </div>
              )}
            </InfoText>
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

const ExportToCodesandboxWrapper = styled.div`
  margin-top: 16px;
`;

const Action = styled.div``;

const InfoText = styled.div``;

const TokenRow = styled.div`
  display: flex;
  align-items: center;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
  codesandboxToken: getCodesandboxToken(state),
});

const mapDispatchToProps = {
  export: actions.exportToCodesandbox,
  logout: actions.logoutCodesandbox,
  updateToken: actions.updateCodesandboxToken,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportToCodesandbox);
