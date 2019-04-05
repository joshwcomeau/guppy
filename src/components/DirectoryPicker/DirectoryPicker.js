// @flow
import { remote } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { folderPlus } from 'react-icons-kit/feather/folderPlus';

import { RAW_COLORS, COLORS } from '../../constants';

import TextButton from '../TextButton';
import TextInput from '../TextInput';

type Props = {
  path: string,
  pathToSelectMessage: ?string,
  inputEditable?: boolean,
  isFocused?: boolean,
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

  render() {
    const { path, inputEditable, onFocus, onSelect, isFocused } = this.props;

    return (
      <Wrapper>
        {!inputEditable ? (
          <DirectoryButton onClick={this.updatePath} hideCursor={true}>
            {path}
          </DirectoryButton>
        ) : (
          <TextInput
            onFocus={onFocus}
            isFocused={isFocused}
            value={path}
            onChange={ev => onSelect(ev.target.value)}
          >
            <ButtonPositionAdjuster>
              <IconWrapper onClick={this.updatePath}>
                <IconBase size={22} icon={folderPlus} />
              </IconWrapper>
            </ButtonPositionAdjuster>
          </TextInput>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  color: ${RAW_COLORS.gray[400]};
`;

const ButtonPositionAdjuster = styled.div`
  transform: translateY(-2px);
`;

const DirectoryButton = styled(TextButton)`
  color: ${COLORS.lightText};
  text-decoration: none;

  &:after {
    content: '';
    display: block;
    padding-top: 6px;
    border-bottom: 2px solid ${COLORS.lightText};
  }

  &:hover:after {
    content: '';
    display: block;
    border-bottom: 2px solid ${RAW_COLORS.purple[700]};
  }
`;

const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${RAW_COLORS.gray[400]};
  border-radius: 50%;
  color: ${RAW_COLORS.gray[400]};
  cursor: pointer;

  &:hover {
    color: ${RAW_COLORS.purple[500]};
    border-color: ${RAW_COLORS.purple[500]};
  }
`;

export default DirectoryPicker;
