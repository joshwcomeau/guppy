// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import IconBase from 'react-icons-kit';
import { edit2 } from 'react-icons-kit/feather/edit2';
import importAll from 'import-all.macro';
import { sampleMany } from '../../utils';

import {
  runTask,
  abortTask,
  hideModal,
  changeProjectName,
} from '../../actions';
import type { HideModalAction, ChangeProjectNameAction } from '../../actions';

import { COLORS, BREAKPOINTS } from '../../constants';
import { capitalize } from '../../utils';
import { getTaskById } from '../../reducers/tasks.reducer';
import { getSelectedProject } from '../../reducers/projects.reducer';

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

const icons: Array<mixed> = importAll.sync(
  '../../assets/images/icons/icon_*.*'
);
const iconSrcs: string[] = Object.values(icons).map(src => String(src));
const path = window.require('path');

type Props = {
  project: Project,
  isVisible: boolean,
  onDismiss: () => void,
  hideModal: () => HideModalAction,
  changeProjectName: () => ChangeProjectNameAction,
  // From Redux:
  // task: Task,
  // runTask: (task: Task, timestamp: Date) => any,
  // abortTask: (task: Task, timestamp: Date) => any,
};

type State = {
  newName: string,
  projectIcon: string,
  activeField: string,
};

class ProjectConfigurationModal extends Component<Props, State> {
  state = {
    newName: this.props.project.name,
    projectIcon: this.props.project.icon,
    activeField: 'projectName',
  };

  //iconSubset = sampleMany(iconSrcs, 10);
  //   .unshift(
  //     importAll.sync(this.props.project.icon)
  // );

  saveSettings = () => {
    // check if settings changed
    const { hideModal, changeProjectName, project } = this.props;
    const { newName } = this.state;
    console.log('Rename project folder (if name changed)');
    console.log('update store with new name');

    changeProjectName(newName);
    // finally hide settings after saving
    hideModal();
  };

  changeProjectname = e => {
    console.log('e', e.target.value);
    this.setState({
      newName: e.target.value,
    });
  };

  updateProjectIcon = (src: string) => {
    this.setState(prevState => ({
      ...prevState,
      projectIcon: src,
    }));
  };

  setActive = (name: string) => {
    this.setState(state => ({
      ...state,
      activeField: name,
    }));
  };

  render() {
    const { project } = this.props;
    const { activeField } = this.state;

    console.log('render modal', project);
    const { name } = project;
    const { projectIcon } = this.state;

    // NOTE: No isVisible check as this is used as the ModalContent component --> maybe rename the component so this is clear
    return (
      <Fragment>
        <ModalHeader title="Project settings">
          <Description>Change the settings of project {name}</Description>
        </ModalHeader>

        <MainContent>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
          <FormField
            label="Project name"
            focusOnClick={false}
            isFocused={activeField === 'projectName'}
          >
            <input
              type="text"
              onFocus={() => this.setActive('projectName')}
              value={this.state.newName}
              onChange={this.changeProjectname}
              autoFocus
            />
          </FormField>
          <Spacer size={25} />
          <FadeIn>
            <FormField
              label="Project Icon"
              focusOnClick={false}
              isFocused={activeField === 'projectIcon'}
            >
              <ProjectIconWrapper>
                {iconSrcs.map((src: string) => (
                  <SelectableImageWrapper key={src}>
                    <SelectableImage
                      src={src}
                      size={60}
                      onClick={() => this.updateProjectIcon(String(src))}
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
            <Button
              icon={<IconBase icon={edit2} />}
              onClick={this.saveSettings}
            >
              Save
            </Button>
          </FadeIn>
          {/*todo add icon pickert from create new wizard here and select current icon */}
        </MainContent>
      </Fragment>
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
  project: getSelectedProject(state),
});

export default connect(
  mapStateToProps,
  { runTask, abortTask, hideModal, changeProjectName }
)(ProjectConfigurationModal);
