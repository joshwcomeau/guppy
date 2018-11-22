// @flow
import React, { PureComponent, Fragment } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import FormField from '../FormField';
import FadeIn from '../FadeIn';

import ProjectName from './ProjectName';
import ProjectPath from './ProjectPath';
import SubmitButton from './SubmitButton';
import ProjectIconSelection from '../ProjectIconSelection';
import ProjectTypeSelection from '../ProjectTypeSelection';
import ProjectStarterSelection from './Gatsby/ProjectStarterSelection';

import type { Field, Status } from './types';
import type { ProjectType } from '../../types';

type Props = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  projectStarter: ?string,
  activeField: ?Field,
  status: Status,
  currentStepIndex: number,
  hasBeenSubmitted: boolean,
  isProjectNameTaken: boolean,
  updateFieldValue: (field: Field, value: any) => void,
  focusField: (field: ?Field) => void,
  handleSubmit: () => Promise<any> | void,
};

type State = {
  gatsbyStarter: string, // Temporary value during selection in selection toast
};

class MainPane extends PureComponent<Props, State> {
  state = {
    gatsbyStarter: '',
  };

  handleFocusProjectName = () => this.props.focusField('projectName');
  handleBlurProjectName = () => this.props.focusField(null);
  handleFocusStarter = () => this.props.focusField('projectStarter');

  updateProjectName = (projectName: string) =>
    this.props.updateFieldValue('projectName', projectName);
  updateProjectType = (projectType: ProjectType) =>
    this.props.updateFieldValue('projectType', projectType);
  updateProjectIcon = (projectIcon: string) =>
    this.props.updateFieldValue('projectIcon', projectIcon);
  updateGatsbyStarter = (selectedStarter: string) =>
    this.props.updateFieldValue('projectStarter', selectedStarter);

  projectSpecificSteps() {
    const { activeField, projectType, projectStarter } = this.props;
    switch (projectType) {
      case 'gatsby':
        return (
          <FadeIn key="step-starter">
            <FormField
              label="Project Starter"
              isFocused={activeField === 'projectStarter'}
            >
              <ProjectStarterSelection
                isFocused={activeField === 'projectStarter'}
                handleFocus={this.handleFocusStarter}
                onSelect={this.updateGatsbyStarter}
                projectStarter={projectStarter}
              />
            </FormField>
          </FadeIn>
        );
      default:
        return null;
    }
  }

  renderConditionalSteps(currentStepIndex: number) {
    const { activeField, projectType, projectIcon } = this.props;
    const buildSteps: Array<?React$Node> = [
      // currentStepIndex = 0
      <FadeIn key="step-type">
        <FormField
          label="Project Type"
          isFocused={activeField === 'projectType'}
        >
          <ProjectTypeSelection
            projectType={projectType}
            onProjectTypeSelect={selectedProjectType =>
              this.updateProjectType(selectedProjectType)
            }
          />
        </FormField>
      </FadeIn>,
      this.projectSpecificSteps(), // currentStepIndex = 1
      <FadeIn key="step-icon">
        <FormField
          label="Project Icon"
          focusOnClick={false}
          isFocused={activeField === 'projectIcon'}
        >
          <ProjectIconSelection
            selectedIcon={projectIcon}
            randomize={true}
            limitTo={8}
            onSelectIcon={this.updateProjectIcon}
          />
        </FormField>
      </FadeIn>,
    ].filter(step => !!step);

    const renderedSteps: Array<?React$Node> = buildSteps.slice(
      0,
      currentStepIndex
    );

    // Todo: Fix index or change to a better model. At the moment, difficult to handle.
    return {
      lastIndex: buildSteps.length,
      steps: renderedSteps,
    };
  }
  validateField(currentStepIndex: number, lastIndex: number) {
    // No validation for projectStarter as it is optional
    const { projectIcon, projectType } = this.props;

    return (
      (currentStepIndex > 0 && !projectType) ||
      (currentStepIndex > lastIndex && !projectIcon)
    );
  }
  render() {
    const {
      projectName,
      activeField,
      currentStepIndex,
      hasBeenSubmitted,
      isProjectNameTaken,
      handleSubmit,
    } = this.props;

    const { lastIndex, steps } = this.renderConditionalSteps(currentStepIndex);
    return (
      <Fragment>
        <Motion style={{ offset: spring(currentStepIndex === 0 ? 50 : 0) }}>
          {({ offset }) => (
            <Wrapper style={{ transform: `translateY(${offset}px)` }}>
              <ProjectName
                name={projectName}
                isFocused={activeField === 'projectName'}
                handleFocus={this.handleFocusProjectName}
                handleBlur={this.handleBlurProjectName}
                handleChange={this.updateProjectName}
                handleSubmit={handleSubmit}
                isProjectNameTaken={isProjectNameTaken}
              />
              <ProjectPath projectName={projectName} />

              {steps}
            </Wrapper>
          )}
        </Motion>
        <SubmitButtonWrapper>
          <SubmitButton
            isDisabled={
              isProjectNameTaken ||
              !projectName ||
              this.validateField(currentStepIndex, lastIndex)
            }
            readyToBeSubmitted={currentStepIndex > lastIndex}
            hasBeenSubmitted={hasBeenSubmitted}
            onSubmit={handleSubmit}
          />
        </SubmitButtonWrapper>
      </Fragment>
    );
  }
}

const Wrapper = styled.div`
  height: 80vh;
  will-change: transform;
`;

const SubmitButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  text-align: center;
`;

export default MainPane;
