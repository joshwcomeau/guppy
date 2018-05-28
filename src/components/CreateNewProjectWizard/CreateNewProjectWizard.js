// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';

import { addProject } from '../../actions';

import TwoPaneModal from '../TwoPaneModal';

import MainPane from './MainPane';
import SummaryPane from './SummaryPane';
import BuildPane from './BuildPane';

import type { Field, Status, Step } from './types';

import type { ProjectType, Project } from '../../types';

const FORM_STEPS: Array<Field> = ['projectName', 'projectType', 'projectIcon'];

type Props = {
  isVisible: boolean,
  addProject: (project: Project) => void,
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
    this.props.addProject(project);

    window.setTimeout(() => {
      this.setState(initialState);
    }, 1000);
  };

  render() {
    const { isVisible } = this.props;
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

const mapStateToProps = state => ({
  isVisible: state.modal === 'new-project-wizard',
});

const mapDispatchToProps = {
  addProject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewProjectWizard);
