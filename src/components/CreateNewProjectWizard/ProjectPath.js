// @flow
import path from 'path';
import { remote } from 'electron';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

import { changeDefaultProjectPath } from '../../actions';
import { getDefaultProjectPath } from '../../reducers/app-settings.reducer';
import { getProjectNameSlug } from '../../services/create-project.service';
import { RAW_COLORS } from '../../constants';

import TextButton from '../TextButton';

import type { Dispatch } from '../../actions/types';

type Props = {
  projectHome: string,
  projectName: string,
  changeDefaultProjectPath: Dispatch<typeof changeDefaultProjectPath>,
};

export const CLAMP_AT = 29;

export const dialogOptions = {
  message: 'Select the directory of Project',
  properties: ['openDirectory'],
};

export function dialogCallback(paths: ?[string]) {
  // The user might cancel out without selecting a directory.
  // In that case, do nothing.
  if (!paths) {
    return;
  }

  // Only a single path should be selected
  const [firstPath] = paths;
  this.props.changeDefaultProjectPath(firstPath);
}

export class ProjectPath extends PureComponent<Props> {
  updatePath = () => {
    remote.dialog.showOpenDialog(dialogOptions, dialogCallback.bind(this));
  };

  render() {
    const { projectHome, projectName } = this.props;

    const projectNameSlug = getProjectNameSlug(projectName);

    // Join the projectHome with the prospective project ID
    // Hide the leading forward-slash, on Mac/Linux
    const fullProjectPath = path
      .join(projectHome, projectNameSlug)
      .replace(/^\//, '');

    // Using CSS text-overflow is proving challenging, so we'll just crop it
    // with JS.
    let displayedProjectPath = fullProjectPath;
    if (displayedProjectPath.length > CLAMP_AT) {
      displayedProjectPath = `${displayedProjectPath.slice(0, CLAMP_AT - 1)}…`;
    }

    return (
      <MainText>
        Project will be created in{' '}
        <Tooltip title={fullProjectPath} position="bottom">
          <DirectoryButton onClick={() => this.updatePath()}>
            {displayedProjectPath}
          </DirectoryButton>
        </Tooltip>
      </MainText>
    );
  }
}

const MainText = styled.div`
  text-align: left;
  margin: -20px 0 30px 5px;
  font-size: 15px;
  color: ${RAW_COLORS.gray[400]};
`;

export const DirectoryButton = styled(TextButton)`
  font-family: 'Fira Mono';
  font-size: 12px;
  color: ${RAW_COLORS.gray[600]};
  text-decoration: none;
`;

const mapStateToProps = state => ({
  projectHome: getDefaultProjectPath(state),
});

const mapDispatchToProps = {
  changeDefaultProjectPath,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectPath);
