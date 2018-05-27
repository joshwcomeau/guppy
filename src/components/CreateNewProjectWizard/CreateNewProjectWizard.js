// @flow
import React, { PureComponent } from 'react';

import TwoPaneModal from '../TwoPaneModal';

import MainPane from './MainPane';
import SummaryPane from './SummaryPane';

import type { Field, Step, ProjectType, SubmittedProject } from './types';

const STEPS: Array<Step> = [
  'projectName',
  'projectType',
  'projectIcon',
  'done',
];

type Props = {
  onCreateProject: (project: SubmittedProject) => void,
};

type State = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  activeField: ?Field,
  currentStep: Step,
  shouldShowRandomizationHint: boolean,
};

class CreateNewProjectWizard extends PureComponent<Props, State> {
  state = {
    projectName: '',
    projectType: null,
    projectIcon: null,
    activeField: 'projectName',
    currentStep: 'projectName',
    shouldShowRandomizationHint: false,
  };

  componentDidMount() {
    window.setTimeout(this.enableRandomizationHint, 2000);
  }

  updateFieldValue = (field: Field, value: any) => {
    this.setState({ [field]: value });
  };

  focusField = (field: ?Field) => {
    this.setState({ activeField: field });
  };

  enableRandomizationHint = () =>
    this.setState({ shouldShowRandomizationHint: true });

  handleSubmit = () => {
    const currentStepIndex = STEPS.indexOf(this.state.currentStep);
    const nextStep = STEPS[currentStepIndex + 1];

    if (nextStep) {
      this.setState({
        currentStep: nextStep,
        activeField: nextStep,
      });
    } else {
      this.setState({ currentStep: 'done' });
    }
  };

  render() {
    const {
      projectName,
      projectType,
      projectIcon,
      activeField,
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
            currentStepIndex={STEPS.indexOf(currentStep)}
            updateFieldValue={this.updateFieldValue}
            focusField={this.focusField}
            handleSubmit={this.handleSubmit}
          />
        }
        backface={"I'm in the back"}
      />
    );
  }
}

export default CreateNewProjectWizard;
