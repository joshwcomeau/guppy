// @flow
// import path from 'path';
import { remote } from 'electron';
import React, { PureComponent } from 'react';
// import { connect } from 'react-redux';
// import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

// import { changeProjectHomePath } from '../../actions';
// import { getProjectHomePath } from '../../reducers/paths.reducer';
// import { getProjectNameSlug } from '../../services/create-project.service';
import { COLORS } from '../../constants';

import TextButton from '../TextButton';
// import TextInput from '../TextInput';

type Props = {
  path: string,
  pathToSelectMessage: ?string,
  onSelect: () => void,
};

class DirectoryPicker extends PureComponent<Props, State> {
  static defaultProps = {
    pathToSelectMessage: 'Select the directory',
  };

  updatePath = () => {
    remote.dialog.showOpenDialog(
      {
        message: this.props.pathToSelectMessage,
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
        this.props.onSelect(firstPath);
        // this.props.changeProjectHomePath(firstPath);
        // this.setState({
        //   selectedPath: firstPath,
        // });
      }
    );
  };

  render() {
    const { path } = this.props;

    // Join the projectHome with the prospective project ID
    // Hide the leading forward-slash, on Mac/Linux
    const fullProjectPath = path.replace(/^\//, '');

    return (
      <Wrapper>
        <DirectoryButton onClick={() => this.updatePath()} hideCursor={true}>
          {fullProjectPath}
        </DirectoryButton>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  color: ${COLORS.gray[400]};
`;

const DirectoryButton = styled(TextButton)`
  // text-align: left;
  color: ${COLORS.gray[600]};
  text-decoration: none;

  &:after {
    content: '';
    display: block;
    padding-top: 6px;
    border-bottom: 2px solid ${COLORS.gray[600]};
  }

  &:hover:after {
    content: '';
    display: block;
    border-bottom: 2px solid ${COLORS.purple[700]};
  }
`;

export default DirectoryPicker;
