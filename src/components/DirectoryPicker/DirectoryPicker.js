// @flow
import { remote } from 'electron';
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { folder } from 'react-icons-kit/feather/folder';

import { COLORS } from '../../constants';

import TextButton from '../TextButton';
import TextInput from '../TextInput';

type Props = {
  path: string,
  pathToSelectMessage: ?string,
  inputEditable: ?boolean,
  isFocused: ?boolean,
  onFocus: string => void,
  onSelect: string => void,
};

class DirectoryPicker extends PureComponent<Props> {
  static defaultProps = {
    pathToSelectMessage: 'Select the directory',
  };

  updatePath = (ev: SyntheticEvent<*>) => {
    ev.preventDefault();
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
      }
    );
  };

  getFullProjectPath(path: string) {
    return path.replace(/^\//, '');
  }

  render() {
    const { path, inputEditable, onFocus, onSelect, isFocused } = this.props;

    // Join the projectHome with the prospective project ID
    // Hide the leading forward-slash, on Mac/Linux
    const fullProjectPath = this.getFullProjectPath(path);

    return (
      <Wrapper>
        {!inputEditable ? (
          <DirectoryButton onClick={this.updatePath} hideCursor={true}>
            {fullProjectPath}
          </DirectoryButton>
        ) : (
          <FlexRow>
            <DirectoryInput
              onFocus={onFocus}
              isFocused={isFocused}
              value={fullProjectPath}
              onChange={ev => onSelect(ev.target.value)}
              autoFocus
            />
            <FolderIcon size={32} icon={folder} onClick={this.updatePath} />
          </FlexRow>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  color: ${COLORS.gray[400]};
`;

const DirectoryButton = styled(TextButton)`
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

const DirectoryInput = styled(TextInput)``;

const FolderIcon = styled(IconBase)`
  color: ${COLORS.gray[400]};
  cursor: pointer;
  padding-left: 10px;
  :hover {
    color: ${COLORS.purple[500]};
  }
`;
const FlexRow = styled.div`
  display: flex;
`;

export default DirectoryPicker;
