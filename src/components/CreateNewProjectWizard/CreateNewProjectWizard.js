// @flow
import React, { PureComponent } from 'react';

import TwoPaneModal from '../TwoPaneModal';

import MainPane from './MainPane';
import SummaryPane from './SummaryPane';

import type {
  Field,
  Status,
  Step,
  ProjectType,
  SubmittedProject,
} from './types';

const FORM_STEPS: Array<Field> = ['projectName', 'projectType', 'projectIcon'];

type Props = {
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

class CreateNewProjectWizard extends PureComponent<Props, State> {
  state = {
    projectName: '',
    projectType: null,
    projectIcon: null,
    activeField: 'projectName',
    status: 'filling-in-form',
    currentStep: 'projectName',
    shouldShowRandomizationHint: false,
  };

  componentDidMount() {
    window.setTimeout(this.enableRandomizationHint, 2000);
  }

  componentDidUpdate(_: Props, prevState: State) {
    const { projectName, projectType, projectIcon, status } = this.state;

    if (
      prevState.status === 'filling-in-form' &&
      status === 'building-project'
    ) {
      // At this point, it should be impossible for the project fields to be
      // blank? Flow doesn't know that, though, and maybe it has a point.
      // Maybe we should add some sort of error toast here?
      if (!projectName || !projectType || !projectIcon) {
        return;
      }

      const project = { projectName, projectType, projectIcon };

      // TODO:
      this.props.onCreateProject(project);
    }
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
        currentStep: 'initializing',
        status: 'building-project',
      });
      return;
    }

    this.setState({
      currentStep: nextStep,
      activeField: nextStep,
    });
  };

  render() {
    const {
      projectName,
      projectType,
      projectIcon,
      activeField,
      status,
      currentStep,
      shouldShowRandomizationHint,
    } = this.state;
    const isFolded = this.state.currentStep === 'done';

    return (
      <TwoPaneModal
        isFolded={isFolded}
        leftPane={
          <SummaryPane
            currentStep={currentStep}
            activeField={activeField}
            shouldShowRandomizationHint={shouldShowRandomizationHint}
          />
        }
        rightPane={
          <MainPane
            projectName={projectName}
            projectType={projectType}
            projectIcon={projectIcon}
            activeField={activeField}
            currentStepIndex={FORM_STEPS.indexOf(currentStep)}
            updateFieldValue={this.updateFieldValue}
            focusField={this.focusField}
            handleSubmit={this.handleSubmit}
            hasBeenSubmitted={status !== 'filling-in-form'}
          />
        }
        backface={"I'm in the back"}
      />
    );
  }
}

export default CreateNewProjectWizard;
