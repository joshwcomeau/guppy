// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';

import * as actions from '../../actions';
import { getById } from '../../reducers/projects.reducer';
import { getProjectHomePath } from '../../reducers/paths.reducer';
import { getOnboardingCompleted } from '../../reducers/onboarding-status.reducer';
import { getProjectNameSlug } from '../../services/create-project.service';

import TwoPaneModal from '../TwoPaneModal';
import Debounced from '../Debounced';

import MainPane from './MainPane';
import SummaryPane from './SummaryPane';
import BuildPane from './BuildPane';

import type { Field, Status, Step } from './types';

import type { ProjectType, ProjectInternal } from '../../types';

const FORM_STEPS: Array<Field> = ['projectName', 'projectType', 'projectIcon'];

type Props = {
  projects: { [projectId: string]: ProjectInternal },
  projectHomePath: string,
  isVisible: boolean,
  isOnboardingCompleted: boolean,
  addProject: (
    project: ProjectInternal,
    isOnboardingCompleted: boolean
  ) => void,
  createNewProjectCancel: () => void,
  createNewProjectFinish: () => void,
};

type State = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  activeField: ?Field,
  status: Status,
  currentStep: Step,
  isProjectNameTaken: boolean,
};

const initialState = {
  projectName: '',
  projectType: null,
  projectIcon: null,
  activeField: 'projectName',
  status: 'filling-in-form',
  currentStep: 'projectName',
  isProjectNameTaken: false,
};

class CreateNewProjectWizard extends PureComponent<Props, State> {
  state = initialState;
  timeoutId: number;

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  }

  updateFieldValue = (field: Field, value: any) => {
    this.setState({ [field]: value, activeField: field });

    if (field === 'projectName') {
      this.verifyProjectNameUniqueness(value);
    }
  };

  focusField = (field: ?Field) => {
    this.setState({ activeField: field });
  };

  verifyProjectNameUniqueness = (name: string) => {
    const { projects } = this.props;

    // Check to see if this name is already taken
    const slug = getProjectNameSlug(name);
    const isAlreadyTaken = !!Object.keys(this.props.projects).some(
      id => projects[id].name === slug
    );

    if (isAlreadyTaken) {
      this.setState({ isProjectNameTaken: true });
      return;
    }

    // If this update fixes the problem, unset the error status
    if (!isAlreadyTaken && this.state.isProjectNameTaken) {
      this.setState({ isProjectNameTaken: false });
    }
  };

  handleSubmit = () => {
    const currentStepIndex = FORM_STEPS.indexOf(this.state.currentStep);
    const nextStep = FORM_STEPS[currentStepIndex + 1];

    if (!nextStep) {
      this.setState({
        activeField: null,
        status: 'building-project',
      });
      return;
    }

    this.setState({
      currentStep: nextStep,
      activeField: nextStep,
    });
  };

  finishBuilding = (project: ProjectInternal) => {
    const { isOnboardingCompleted } = this.props;

    this.props.createNewProjectFinish();

    this.timeoutId = window.setTimeout(() => {
      this.props.addProject(project, isOnboardingCompleted);

      this.timeoutId = window.setTimeout(this.reinitialize, 500);
    }, 500);
  };

  reinitialize = () => {
    this.setState(initialState);
  };

  render() {
    const { isVisible, createNewProjectCancel, projectHomePath } = this.props;
    const {
      projectName,
      projectType,
      projectIcon,
      activeField,
      status,
      currentStep,
      isProjectNameTaken,
    } = this.state;

    const project = { projectName, projectType, projectIcon };

    const readyToBeBuilt = status !== 'filling-in-form';

    return (
      <Transition in={isVisible} timeout={300}>
        {transitionState => (
          <TwoPaneModal
            isFolded={readyToBeBuilt}
            transitionState={transitionState}
            isDismissable={status !== 'building-project'}
            onDismiss={createNewProjectCancel}
            leftPane={
              <Debounced on={activeField} duration={40}>
                <SummaryPane
                  currentStep={currentStep}
                  activeField={activeField}
                  projectType={projectType}
                />
              </Debounced>
            }
            rightPane={
              <MainPane
                {...project}
                status={status}
                activeField={activeField}
                currentStepIndex={FORM_STEPS.indexOf(currentStep)}
                updateFieldValue={this.updateFieldValue}
                focusField={this.focusField}
                handleSubmit={this.handleSubmit}
                hasBeenSubmitted={status !== 'filling-in-form'}
                isProjectNameTaken={isProjectNameTaken}
              />
            }
            backface={
              readyToBeBuilt && (
                <BuildPane
                  // Ugh. For some reason, even when I conditionally render
                  // this <BuildPane> when `project` is complete, Flow doesn't
                  // like it.
                  // $FlowFixMe
                  project={project}
                  projectHomePath={projectHomePath}
                  handleCompleteBuild={this.finishBuilding}
                />
              )
            }
          />
        )}
      </Transition>
    );
  }
}

const mapStateToProps = state => ({
  projects: getById(state),
  projectHomePath: getProjectHomePath(state.paths),
  isVisible: state.modal === 'new-project-wizard',
  isOnboardingCompleted: getOnboardingCompleted(state),
});

const mapDispatchToProps = {
  addProject: actions.addProject,
  createNewProjectCancel: actions.createNewProjectCancel,
  createNewProjectFinish: actions.createNewProjectFinish,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewProjectWizard);
