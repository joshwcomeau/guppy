// @flow
import path from 'path';
import { remote } from 'electron';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

import { changeProjectHomePath } from '../../actions';
import { getProjectHomePath } from '../../reducers/paths.reducer';
import { getProjectNameSlug } from '../../services/create-project.service';
import { COLORS } from '../../constants';

import TextButton from '../TextButton';

type Props = {
  projectHome: string,
  projectName: string,
  changeProjectHomePath: (path: string) => void,
};

class ProjectPath extends PureComponent<Props> {
  updatePath = () => {
    remote.dialog.showOpenDialog(
      {
        message: 'Select the directory of Project',
        properties: ['openDirectory'],
      },
      (paths: ?[string]) => {
        // The user might cancel out without selecting a directory.
        // In that case, do nothing.
        if (!paths) {
          return;
        }

        // Only a single path should be selected
        const [firstPath] = paths;
        this.props.changeProjectHomePath(firstPath);
      }
    );
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
    const CLAMP_AT = 29;
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
  color: ${COLORS.gray[400]};
`;

const DirectoryButton = styled(TextButton)`
  font-family: 'Fira Mono';
  font-size: 12px;
  color: ${COLORS.gray[600]};
  text-decoration: none;
`;

const mapStateToProps = state => {
  return {
    projectHome: getProjectHomePath(state),
  };
};

const mapDispatchToProps = {
  changeProjectHomePath,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectPath);
