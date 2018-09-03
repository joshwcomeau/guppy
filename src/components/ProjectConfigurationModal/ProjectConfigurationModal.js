// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
// import moment from 'moment';
import IconBase from 'react-icons-kit';
import { edit2 } from 'react-icons-kit/feather/edit2';
import importAll from 'import-all.macro';

import * as actions from '../../actions';

import { COLORS, BREAKPOINTS } from '../../constants';
import { getSelectedProject } from '../../reducers/projects.reducer';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Spacer from '../Spacer';
import Button from '../ButtonWithIcon';
import FormField from '../FormField';
import SelectableImage from '../SelectableImage';
import FadeIn from '../FadeIn';
import TextInput from '../TextInput';

import type { Project } from '../../types';

const icons: Array<mixed> = importAll.sync(
  '../../assets/images/icons/icon_*.*'
);
const iconSrcs: string[] = Object.values(icons).map(src => String(src));

type Props = {
  project: Project,
  isVisible: boolean,
  hideModal: () => void,
  saveProjectSettings: (string, string, Project) => void,
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
    newName: '',
    projectIcon: '',
    activeField: 'projectName',
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      newName: nextProps.project.name,
      projectIcon: nextProps.project.icon,
    });
  }

  //iconSubset = sampleMany(iconSrcs, 10);
  //   .unshift(
  //     importAll.sync(this.props.project.icon)
  // );

  saveSettings = e => {
    e.preventDefault();
    const { saveProjectSettings, project } = this.props;
    const { newName, projectIcon } = this.state;

    saveProjectSettings(newName, projectIcon, project);
  };

  changeProjectname = e => {
    // console.log('e', e.target.value);
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
    const { project, hideModal: hide, isVisible } = this.props; // todo: how to properly handle 'hideModal' is already declared in the upper scope  no-shadow  --- renaming feels hacky but works
    const { activeField } = this.state;

    // const { name } = project;
    const { projectIcon } = this.state;
    const { name } = project || { name: '' };

    // NOTE: No isVisible check as this is used as the ModalContent component --> maybe rename the component so this is clear
    return (
      <Modal isVisible={isVisible} onDismiss={hide}>
        <Fragment>
          <ModalHeader title="Project settings">
            <Description>Change the settings of project {name}</Description>
          </ModalHeader>

          <MainContent>
            <form onSubmit={this.saveSettings}>
              <FormField label="Project name" focusOnClick={false}>
                <TextInput
                  onFocus={() => this.setActive('projectName')}
                  value={this.state.newName}
                  onChange={this.changeProjectname}
                  isFocused={activeField === 'projectName'}
                  autoFocus
                />
              </FormField>
            </form>
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
          </MainContent>
        </Fragment>
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

// const Status = styled.div`
//   display: flex;
//   align-items: center;
//   font-size: 20px;
// `;

// const StatusLabel = styled.div`
//   margin-left: 10px;
// `;

// const LastRunText = styled.span`
//   margin-left: 10px;
//   color: ${COLORS.gray[400]};
// `;

const mapStateToProps = (state, ownProps) => {
  const project = getSelectedProject(state);
  // console.log('map config modal', project, state);
  return {
    project,
    isVisible: state.modal === 'project-configuration',
  };
};

export default connect(
  mapStateToProps,
  {
    hideModal: actions.hideModal,
    saveProjectSettings: actions.saveProjectSettings,
  }
)(ProjectConfigurationModal);
