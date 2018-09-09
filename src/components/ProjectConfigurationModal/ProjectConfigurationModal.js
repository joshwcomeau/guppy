// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { edit2 } from 'react-icons-kit/feather/edit2';
import importAll from 'import-all.macro';

import * as actions from '../../actions';

import { COLORS, BREAKPOINTS } from '../../constants';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { isQueueEmpty } from '../../reducers/queue.reducer';

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
const iconSrcs: Array<string> = Object.values(icons).map(src => String(src));

type Props = {
  project: Project,
  isVisible: boolean,
  queueEmpty: boolean,
  hideModal: () => void,
  saveProjectSettings: (string, string, Project) => void,
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

  saveSettings = e => {
    e.preventDefault();
    const { saveProjectSettings, project } = this.props;
    const { newName, projectIcon } = this.state;

    saveProjectSettings(newName, projectIcon, project);
  };

  changeProjectname = e => {
    this.setState({
      newName: e.target.value,
    });
  };

  updateProjectIcon = (src: string) => {
    this.setState(prevState => ({
      projectIcon: src,
    }));
  };

  setActive = (name: string) => {
    this.setState(state => ({
      activeField: name,
    }));
  };

  render() {
    const { project, hideModal, isVisible, queueEmpty } = this.props;
    const { activeField } = this.state;
    const { projectIcon } = this.state;
    const { name } = project || { name: '' };

    return (
      <Modal isVisible={isVisible} onDismiss={hideModal}>
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
              disabled={!queueEmpty}
            >
              Save
            </Button>
            {!queueEmpty && 'Waiting for pending tasks to finish.'}
          </FadeIn>
        </MainContent>
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
    /* Reduce amount of displayed icons on smaller screens.
       Todo: Check if this is really a good idea, as the currently selected icon could be hidden.
    */
    &:nth-of-type(n + 9) {
      display: none;
    }
  }
`;
const Description = styled.div`
  font-size: 24px;
  color: ${COLORS.gray[600]};
`;

const mapStateToProps = (state, ownProps) => {
  const project = getSelectedProject(state);
  const projectId = project && project.id;
  return {
    project,
    isVisible: state.modal === 'project', // todo: refactor this so we're having each modal-string in a constant 'project' | 'app' | 'new-project-wizard'
    queueEmpty: isQueueEmpty(state, projectId || ''),
  };
};

export default connect(
  mapStateToProps,
  {
    hideModal: actions.hideModal,
    saveProjectSettings: actions.saveProjectSettingsStart,
  }
)(ProjectConfigurationModal);
