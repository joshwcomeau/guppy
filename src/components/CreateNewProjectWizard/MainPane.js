// @flow
import React, { PureComponent, Fragment } from 'react';
import { Spring, animated } from 'react-spring';
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
  projectStarter: string,
  activeField: ?Field,
  status: Status,
  currentStepIndex: number,
  hasBeenSubmitted: boolean,
  isProjectNameTaken: boolean,
  updateFieldValue: (field: Field, value: any) => void,
  focusField: (field: ?Field) => void,
  handleSubmit: () => Promise<any> | void,
  isOnline: boolean,
};

class MainPane extends PureComponent<Props> {
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

  projectSpecificGatsbyStep() {
    const { activeField, projectStarter } = this.props;
    return (
      <FadeIn key="step-starter">
        <FormField
          label="Project Starter"
          isFocused={activeField === 'projectStarter'}
          spacing={15}
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
  }

  renderConditionalSteps(currentStepIndex: number) {
    const { activeField, projectType, projectIcon } = this.props;
    const steps: Array<?React$Node> = [];
    let lastIndex = 2;

    if (projectType === 'gatsby') {
      lastIndex = 3;
    }

    if (currentStepIndex > 0) {
      // currentStepIndex = 1
      steps.push(
        <FadeIn key="step-type">
          <FormField
            label="Project Type"
            isFocused={activeField === 'projectType'}
            spacing={10}
          >
            <ProjectTypeSelection
              projectType={projectType}
              onProjectTypeSelect={selectedProjectType =>
                this.updateProjectType(selectedProjectType)
              }
            />
          </FormField>
        </FadeIn>
      );
    }
    if (currentStepIndex > 1) {
      steps.push(
        // 2
        <FadeIn key="step-icon">
          <FormField
            label="Project Icon"
            focusOnClick={false}
            isFocused={activeField === 'projectIcon'}
            spacing={10}
          >
            <ProjectIconSelection
              selectedIcon={projectIcon}
              randomize={true}
              limitTo={9}
              onSelectIcon={this.updateProjectIcon}
            />
          </FormField>
        </FadeIn>
      );
    }

    if (currentStepIndex > 2 && projectType === 'gatsby') {
      // 3
      steps.push(this.projectSpecificGatsbyStep());
    }

    return {
      lastIndex,
      steps,
    };
  }
  isSubmitDisabled(currentStepIndex: number, lastIndex: number) {
    // No validation for projectStarter as it is optional
    const { projectIcon, projectType } = this.props;

    const needsProjectType = !projectType && currentStepIndex > 1;
    const needsProjectIcon = !projectIcon && currentStepIndex >= 2;

    return needsProjectType || needsProjectIcon;
  }
  render() {
    const {
      projectName,
      activeField,
      currentStepIndex,
      hasBeenSubmitted,
      isProjectNameTaken,
      handleSubmit,
      isOnline,
    } = this.props;

    const { lastIndex, steps } = this.renderConditionalSteps(currentStepIndex);
    return (
      <Fragment>
        <Spring
          from={{
            offset: currentStepIndex === 0 ? 0 : 50,
          }}
          to={{
            offset: currentStepIndex === 0 ? 50 : 0,
          }}
          native
        >
          {({ offset }) => (
            <Wrapper translateY={offset}>
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
        </Spring>
        <SubmitButtonWrapper>
          <SubmitButton
            isDisabled={
              isProjectNameTaken ||
              !projectName ||
              this.isSubmitDisabled(currentStepIndex, lastIndex)
            }
            isOnline={isOnline}
            readyToBeSubmitted={currentStepIndex >= lastIndex}
            hasBeenSubmitted={hasBeenSubmitted}
            onSubmit={handleSubmit}
          />
        </SubmitButtonWrapper>
      </Fragment>
    );
  }
}

const Wrapper = animated(styled.div.attrs({
  style: props => ({
    transform: `translateY(${props.translateY}px)`,
  }),
})`
  height: 75vh;
  will-change: transform;
`);

const SubmitButtonWrapper = styled.div`
  text-align: center;
`;

export default MainPane;
