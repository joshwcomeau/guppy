// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import IconBase from 'react-icons-kit';
import { edit2 } from 'react-icons-kit/feather/edit2';
import importAll from 'import-all.macro';
import { sampleMany } from '../../utils';

import { runTask, abortTask } from '../../actions';
import { COLORS, BREAKPOINTS } from '../../constants';
import { capitalize } from '../../utils';
import { getTaskById } from '../../reducers/tasks.reducer';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Toggle from '../Toggle';
import LargeLED from '../LargeLED';
import EjectButton from '../EjectButton';
import TerminalOutput from '../TerminalOutput';
import Spacer from '../Spacer';
import Button from '../ButtonWithIcon';
import FormField from '../FormField';
import SelectableImage from '../SelectableImage';
import FadeIn from '../FadeIn';

import type { Task, Project } from '../../types';

const icons = importAll.sync('../../assets/images/icons/icon_*.*');
const iconSrcs = Object.values(icons);
const path = window.require('path');

type Props = {
  project: Project,
  isVisible: boolean,
  onDismiss: () => void,
  // From Redux:
  // task: Task,
  // runTask: (task: Task, timestamp: Date) => any,
  // abortTask: (task: Task, timestamp: Date) => any,
};

type State = {
  newName: string,
  projectIcon: string,
};

class ProjectSettingsModal extends Component<Props, State> {
  state = {
    newName: this.props.project.name,
    projectIcon: this.props.project.icon,
  };

  iconSubset = sampleMany(iconSrcs, 10);
  //   .unshift(
  //     importAll.sync(this.props.project.icon)
  // );

  handleRename = () => {
    console.log('Rename project folder');
    console.log('update store with new name');
  };

  changeProjectname = e => {
    console.log('e', e.target.value);
    this.setState({
      newName: e.target.value,
    });
  };

  updateProjectIcon = src => {
    this.setState(prevState => ({
      ...prevState,
      projectIcon: src,
    }));
  };

  renderContents() {
    const { project, isVisible } = this.props;

    if (!isVisible) {
      return null;
    }

    console.log('render modal', project);
    const { name } = project;
    const { projectIcon } = this.state;
    const activeField = 'projectIcon';

    return (
      <Fragment>
        <ModalHeader title="Project settings">
          <Description>Change the settings of project {name}</Description>
        </ModalHeader>

        <MainContent>
          <h1>Change project name</h1>
          <input
            type="text"
            value={this.state.newName}
            onChange={this.changeProjectname}
          />
          <Button icon={<IconBase icon={edit2} />} onClick={this.handleRename}>
            Rename
          </Button>
          <Spacer size={25} />
          <FadeIn>
            <FormField
              label="Project Icon"
              focusOnClick={false}
              isFocused={activeField === 'projectIcon'}
            >
              <ProjectIconWrapper>
                {this.iconSubset.map(src => (
                  <SelectableImageWrapper key={src}>
                    <SelectableImage
                      src={src}
                      size={60}
                      onClick={() => this.updateProjectIcon(src)}
                      status={
                        projectIcon === null
                          ? 'default'
                          : projectIcon === src
                            ? 'highlighted'
                            : 'faded'
                      }
                    />
                  </SelectableImageWrapper>
                ))}
              </ProjectIconWrapper>
            </FormField>
          </FadeIn>
          {/*todo add icon pickert from create new wizard here and select current icon */}
        </MainContent>
      </Fragment>
    );
  }

  render() {
    const { isVisible, onDismiss } = this.props;

    return (
      <Modal width={620} isVisible={isVisible} onDismiss={onDismiss}>
        {this.renderContents()}
      </Modal>
    );
  }
}

const MainContent = styled.section`
  padding: 25px;
`;

const ProjectIconWrapper = styled.div`
  margin-top: 16px;
`;

const SelectableImageWrapper = styled.div`
  display: inline-block;
  margin: 0px 10px 10px 0px;

  @media ${BREAKPOINTS.sm} {
    &:nth-of-type(n + 9) {
      display: none;
    }
  }
`;
const Description = styled.div`
  font-size: 24px;
  color: ${COLORS.gray[600]};
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
`;

const StatusLabel = styled.div`
  margin-left: 10px;
`;

const LastRunText = styled.span`
  margin-left: 10px;
  color: ${COLORS.gray[400]};
`;

const mapStateToProps = (state, ownProps) => ({
  task: getTaskById(ownProps.taskId, state),
});

export default connect(
  mapStateToProps,
  { runTask, abortTask }
)(ProjectSettingsModal);
