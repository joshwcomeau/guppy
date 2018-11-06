import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { spawn } from 'child_process';

import * as actions from '../../actions';
import { stripEscapeChars } from '../../utils';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { getAppSettings } from '../../reducers/app-settings.reducer';

import {
  loadPackageJson,
  writePackageJson,
} from '../../services/read-from-disk.service';
import { getBaseProjectEnvironment } from '../../services/platform.service';
import { processLogger } from '../../services/process-logger.service';
import { sendCommandToProcess } from '../../sagas/task.saga'; // todo move command to shell.service?

import ExternalLink from '../ExternalLink';
// import Heading from '../Heading';
import FormField from '../FormField';
import TokenInput from '../TokenInput';
import FillButton from '../Button/FillButton';
import DisabledText from '../DisabledText';

const { dialog } = remote;

class ExportToCodesandbox extends PureComponent {
  export = async evt => {
    const {
      project: { path: projectPath, codesandboxUrl },
      codesandboxToken,
      setCodesandboxUrl,
    } = this.props;
    let args = ['.'];
    evt.preventDefault();

    const result = await dialog.showMessageBox({
      type: 'warning',
      title: 'Exported code will be public',
      message:
        'By deploying to CodeSandbox, the code of your project will be made public.',
      buttons: ['OK, export project', 'Cancel'],
    });

    if (result === 1) {
      // abort export
      return;
    }

    // deploying to existing sandbox not supported by CLI
    // --> deploy option is picked by default and there is no option to overwrite an existing sandbox.
    // if (codesandboxUrl) {
    //   // deploy to existing sandbox --> todo add a way to create a new sandbox
    //   args.push(['deploy', codesandboxUrl]);
    // }

    // todo: Move this to a saga
    const child = spawn('codesandbox', args, {
      cwd: projectPath,
      env: { ...getBaseProjectEnvironment(projectPath) },
      shell: true,
    });

    child.stdout.on('data', async out => {
      const data = out.toString();
      if (data.includes('Do you want to sign in using GitHub')) {
        sendCommandToProcess(child, 'Y');
      }
      if (data.includes('Token')) {
        sendCommandToProcess(child, codesandboxToken.toString());
      }
      if (data.includes('proceed with the deployment')) {
        // todo: add a prompt before executing the export -->  By deploying to CodeSandbox, the code of your project will be made public
        sendCommandToProcess(child, 'y');
      }
      // grep url from [success] http
      if (data.includes('[success]')) {
        const strippedText = stripEscapeChars(data);

        const newCodesandboxUrl = (/(http|https|ftp|ftps):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/gim.exec(
          strippedText
        ) || [])[0];

        console.log('result url', codesandboxUrl);

        // info: Check that url changed not needed as it is always changing
        setCodesandboxUrl(this.props.project.id, newCodesandboxUrl);

        let json;
        try {
          // Let's load the basic project info for the path specified, if possible.
          json = await loadPackageJson(projectPath);
        } catch (err) {
          console.log('error', err);
        }

        await writePackageJson(projectPath, {
          ...json,
          guppy: {
            ...(json && json.guppy),
            codesandboxUrl: newCodesandboxUrl,
          },
        });
      }
    });

    child.on('exit', code => {
      if (code) {
        // todo handle errors e.g. no network connection
      }
    });

    child.stderr.on('error', out => {
      dialog.showErrorMessage('Error', 'Please check your token and try again');
    });

    processLogger(child, 'EXPORT_CODESANDBOX');
  };

  updateToken = token => {
    // evt.preventDefault();
    this.props.updateCodesandboxToken(token); //evt.target.value);
  };

  // todo: Change flow:
  //       1. Check if token is availble
  //          y --> enable export to codesandbox button
  //          n --> display button with link to token page @codesandbox
  //       2. After export click display External link to created sandbox & store link in project
  render() {
    const { codesandboxToken, project } = this.props;
    const { codesandboxUrl } = project;
    console.log('export project', project);
    return (
      <Wrapper>
        <FormField size="small" label="Export to Codesandbox.io">
          <InfoText>
            Goto Codesandbox website by clicking the link and copy the token.
            Then paste the token in the token field.{' '}
          </InfoText>
          <ExternalLink href="https://codesandbox.io/cli/login">
            Get new token
          </ExternalLink>
        </FormField>

        <FormField label="Codesandbox token">
          <TokenInput value={codesandboxToken} onBlur={this.updateToken} />
        </FormField>
        <Action>
          <FillButton
            onClick={this.export}
            size="small"
            disabled={!codesandboxToken}
          >
            Export to Codesandbox
          </FillButton>
          {!codesandboxToken && (
            <DisabledText>
              Export disabled because token is missing.
            </DisabledText>
          )}
        </Action>
        <InfoText>
          {codesandboxUrl && (
            <div>
              Codesandbox created {codesandboxUrl}:{' '}
              <ExternalLink href={codesandboxUrl}>Open sandbox</ExternalLink>
            </div>
          )}
        </InfoText>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Action = styled.div``;

const InfoText = styled.span``;

const mapStateToProps = state => ({
  codesandboxToken: getAppSettings(state).export.codesandboxToken,
  project: getSelectedProject(state),
});

const mapDispatchToProps = {
  updateCodesandboxToken: actions.updateCodesandboxToken,
  setCodesandboxUrl: actions.setCodesandboxUrl,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportToCodesandbox);
