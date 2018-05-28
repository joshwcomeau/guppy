// @flow
import React, { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition';

import TwoPaneModal from '../TwoPaneModal';

import MainPane from './MainPane';
import SummaryPane from './SummaryPane';
import BuildPane from './BuildPane';

import type { Field, Status, Step } from './types';

import type { ProjectType, SubmittedProject, Project } from '../../types';

const FORM_STEPS: Array<Field> = ['projectName', 'projectType', 'projectIcon'];

type Props = {
  isVisible: boolean,
  onDismiss: () => void,
  onCreateProject: (project: SubmittedProject) => void,
};

type State = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  activeField: ?Field,
  status: Status,
  currentStep: Step,
  shouldShowRandomizationHint: boolean,
};

const initialState = {
  projectName: '',
  projectType: null,
  projectIcon: null,
  activeField: 'projectName',
  status: 'filling-in-form',
  currentStep: 'projectName',
  shouldShowRandomizationHint: false,
};

class CreateNewProjectWizard extends PureComponent<Props, State> {
  state = initialState;

  componentDidMount() {
    window.setTimeout(this.enableRandomizationHint, 2000);
  }

  updateFieldValue = (field: Field, value: any) => {
    this.setState({ [field]: value, activeField: field });
  };

  focusField = (field: ?Field) => {
    this.setState({ activeField: field });
  };

  enableRandomizationHint = () =>
    this.setState({ shouldShowRandomizationHint: true });

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

  finishBuilding = (project: Project) => {
    this.setState(initialState);

    this.props.onCreateProject(project);
  };

  render() {
    const { isVisible, onDismiss } = this.props;
    const {
      projectName,
      projectType,
      projectIcon,
      activeField,
      status,
      currentStep,
      shouldShowRandomizationHint,
    } = this.state;

    const project = { projectName, projectType, projectIcon };

    const readyToBeBuilt = status !== 'filling-in-form';

    return (
      <Transition in={isVisible} timeout={1000}>
        {state => (
          <TwoPaneModal
            isFolded={readyToBeBuilt}
            state={state}
            onDismiss={onDismiss}
            leftPane={
              <SummaryPane
                currentStep={currentStep}
                activeField={activeField}
                shouldShowRandomizationHint={shouldShowRandomizationHint}
              />
            }
            rightPane={
              <MainPane
                {...project}
                activeField={activeField}
                currentStepIndex={FORM_STEPS.indexOf(currentStep)}
                updateFieldValue={this.updateFieldValue}
                focusField={this.focusField}
                handleSubmit={this.handleSubmit}
                hasBeenSubmitted={status !== 'filling-in-form'}
              />
            }
            backface={
              readyToBeBuilt && (
                <BuildPane
                  project={project}
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

export default CreateNewProjectWizard;
