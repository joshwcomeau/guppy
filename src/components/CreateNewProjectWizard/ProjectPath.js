// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { changeProjectHomePath } from '../../actions';
import { getProjectHomePath } from '../../reducers/paths.reducer';
import TextButton from '../TextButton';
import { Tooltip } from 'react-tippy';
import { COLORS } from '../../constants';
const { dialog } = window.require('electron').remote;

type Props = {
  defaultProjectHome: string,
  changeProjectHomePath: (path: string) => void,
};

class ProjectPath extends PureComponent<Props> {
  updatePath = () => {
    dialog.showOpenDialog(
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
        const [path] = paths;
        this.props.changeProjectHomePath(path);
      }
    );
  };

  render() {
    const { defaultProjectHome } = this.props;
    return (
      <MainText>
        created in
        <Tooltip title={defaultProjectHome} position="bottom">
          <TextButton onClick={() => this.updatePath()}>
            {defaultProjectHome.length > 30
              ? `${defaultProjectHome.slice(0, 30)}...`
              : defaultProjectHome}
          </TextButton>
        </Tooltip>
      </MainText>
    );
  }
}

const MainText = styled.div`
  text-align: left;
  margin: -25px 0 30px 5px;
  font-size: 18px;
  color: ${COLORS.gray['500']};
`;

const mapStateToProps = state => {
  return {
    defaultProjectHome: getProjectHomePath(state.paths),
  };
};

const mapDispatchToProps = {
  changeProjectHomePath,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectPath);
