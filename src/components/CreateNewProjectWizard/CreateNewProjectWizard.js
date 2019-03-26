// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import { remote } from 'electron';

import * as actions from '../../actions';
import {
  getAppSettings,
  getDefaultProjectPath,
} from '../../reducers/app-settings.reducer';
import { getById } from '../../reducers/projects.reducer';
import { getOnlineState } from '../../reducers/app-status.reducer';
import { getOnboardingCompleted } from '../../reducers/onboarding-status.reducer';
import { getProjectNameSlug } from '../../services/create-project.service';
import { checkIfProjectExists } from '../../services/create-project.service';
import { urlExists } from '../../services/check-if-url-exists.service';
import { replaceProjectStarterStringWithUrl } from './helpers';

import TwoPaneModal from '../TwoPaneModal';
import Debounced from '../Debounced';

import MainPane from './MainPane';
import SummaryPane from './SummaryPane';
import BuildPane from './BuildPane';

import type { Field, Status, Step } from './types';

import type { ProjectType, ProjectInternal, AppSettings } from '../../types';
import type { Dispatch } from '../../actions/types';

export const FORM_STEPS: Array<Field> = [
  'projectName',
  'projectType',
  'projectIcon',
  'projectStarter',
];

export const dialogOptionsFolderExists = {
  type: 'warning',
  title: 'Project directory exists',
  message:
    "Looks like there's already a project with that name. Did you mean to import it instead?",
  buttons: ['OK'],
};

export const dialogCallbackFolderExists = (
  resolve: (result: any) => void,
  reject: (error: any) => void
) => (result: number) => {
  if (result === 0) {
    return reject();
  }

  resolve();
};

export const dialogStarterNotFoundErrorArgs = (projectStarter: string) => [
  `Starter ${projectStarter} not found`,
  'Please check your starter url or use the starter selection to pick a starter.',
];

const { dialog } = remote;

type Props = {
  settings: AppSettings,
  projects: {
    [projectId: string]: ProjectInternal,
  },
  projectHomePath: string,
  isVisible: boolean,
  isOnboardingCompleted: boolean,
  addProject: Dispatch<typeof actions.addProject>,
  createNewProjectCancel: Dispatch<typeof actions.createNewProjectCancel>,
  createNewProjectFinish: Dispatch<typeof actions.createNewProjectFinish>,
  isOnline: boolean,
};

type State = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  projectStarter: string,
  activeField: ?Field,
  settings: ?AppSettings,
  status: Status,
  currentStep: Step,
  isProjectNameTaken: boolean,
};

const initialState = {
  projectName: '',
  projectType: null,
  projectIcon: null,
  projectStarter: '',
  activeField: 'projectName',
  status: 'filling-in-form',
  currentStep: 'projectName',
  isProjectNameTaken: false,
  settings: null,
};

export class CreateNewProjectWizard extends PureComponent<Props, State> {
  state = initialState;
  timeoutId: number;

  componentDidMount() {
    this.reinitialize(); // needed to load app settings
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  }

  updateFieldValue = (field: Field, value: any) => {
    this.setState({
      [field]: value,
      activeField: field,
    });

    if (field === 'projectName') {
      this.verifyProjectNameUniqueness(value);
    }
  };

  focusField = (field: ?Field) => {
    this.setState({
      activeField: field,
    });
  };

  verifyProjectNameUniqueness = (name: string) => {
    const { projects } = this.props;

    // Check to see if this name is already taken
    const slug = getProjectNameSlug(name);
    const isAlreadyTaken = !!Object.keys(this.props.projects).some(
      id => projects[id].name === slug
    );

    if (isAlreadyTaken) {
      this.setState({
        isProjectNameTaken: true,
      });
      return;
    }

    // If this update fixes the problem, unset the error status
    if (!isAlreadyTaken && this.state.isProjectNameTaken) {
      this.setState({
        isProjectNameTaken: false,
      });
    }
  };

  checkProjectLocationUsage = () => {
    return new Promise<any>((resolve, reject) => {
      const projectName = getProjectNameSlug(this.state.projectName);
      if (checkIfProjectExists(this.props.projectHomePath, projectName)) {
        // show warning that the project folder already exists & stop creation
        dialog.showMessageBox(
          dialogOptionsFolderExists,
          dialogCallbackFolderExists(resolve, reject)
        );
      } else {
        resolve();
      }
    });
  };

  checkIfStarterUrlExists = async () => {
    const { projectStarter: projectStarterInput } = this.state;
    // Add url to starter if not passed & not an empty string
    const projectStarter = replaceProjectStarterStringWithUrl(
      projectStarterInput
    );

    if (projectStarter === '') {
      return;
    }

    const exists = await urlExists(projectStarter);

    if (!exists) {
      // starter not found
      dialog.showErrorBox(...dialogStarterNotFoundErrorArgs(projectStarter));
      throw new Error('starter-not-found');
    }
  };

  handleSubmit = () => {
    const currentStepIndex = FORM_STEPS.indexOf(this.state.currentStep);
    const nextStep = FORM_STEPS[currentStepIndex + 1];
    const lastStep = this.state.projectType === 'gatsby' ? 3 : 2;

    if (currentStepIndex >= lastStep) {
      return Promise.all([
        this.checkProjectLocationUsage(),
        this.checkIfStarterUrlExists(),
      ])
        .then(() => {
          // not in use & starter exists (if Gatsby project)
          this.setState({
            activeField: null,
            status: 'building-project',
          });
        })
        .catch(() => {
          // Swallow any errors, as the promise above will have shown the appropriate dialog on error
        });
    }

    this.setState({
      currentStep: nextStep,
      activeField: nextStep,
    });
  };

  finishBuilding = (project: ProjectInternal) => {
    const { isOnboardingCompleted, projectHomePath } = this.props;
    const { projectType } = this.state;

    // Should be impossible
    if (!projectType) {
      throw new Error('Project created without projectType');
    }

    this.props.createNewProjectFinish();

    this.timeoutId = window.setTimeout(() => {
      this.props.addProject(
        project,
        projectHomePath,
        projectType,
        isOnboardingCompleted
      );

      this.timeoutId = window.setTimeout(this.reinitialize, 500);
    }, 500);
  };

  reinitialize = () => {
    const { settings } = this.props;

    this.setState({
      ...initialState,
      projectType: settings.general.defaultProjectType,
    });
  };

  render() {
    const {
      isVisible,
      createNewProjectCancel,
      projectHomePath,
      isOnline,
    } = this.props;
    const {
      projectName,
      projectType,
      projectIcon,
      projectStarter,
      activeField,
      status,
      currentStep,
      isProjectNameTaken,
    } = this.state;

    const project = {
      projectName,
      projectType,
      projectIcon,
      projectStarter,
    };

    const readyToBeBuilt = status !== 'filling-in-form';

    return (
      <Transition in={isVisible} timeout={300}>
        {transitionState => (
          <Fragment>
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
                  isOnline={isOnline}
                />
              }
              backface={
                <BuildPane
                  {...project}
                  status={status}
                  projectHomePath={projectHomePath}
                  handleCompleteBuild={this.finishBuilding}
                />
              }
            />
          </Fragment>
        )}
      </Transition>
    );
  }
}

const mapStateToProps = state => ({
  projects: getById(state),
  projectHomePath: getDefaultProjectPath(state),
  isVisible: state.modal === 'new-project-wizard',
  isOnboardingCompleted: getOnboardingCompleted(state),
  settings: getAppSettings(state),
  isOnline: getOnlineState(state),
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
