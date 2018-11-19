// @flow
import React, { PureComponent, Fragment } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';
import { toastr } from 'react-redux-toastr';

import FormField from '../FormField';
import FadeIn from '../FadeIn';
import TextInput from '../TextInput'; // todo: move to SelectStarter Component
import FillButton from '../Button/FillButton'; // dito

import ProjectName from './ProjectName';
import ProjectPath from './ProjectPath';
import SubmitButton from './SubmitButton';
import ProjectIconSelection from '../ProjectIconSelection';
import ProjectTypeSelection from '../ProjectTypeSelection';
import SelectStarterDialog from './Gatsby/SelectStarterDialog';

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
  gatsbyStarter: string, // temporary value during selection in selection toast
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

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('MainPane new props', nextProps, prevState);
    return prevState;
  }

  // Change method needed so we can dismiss the selection on close click of toastr
  changeGatsbyStarter = (selectedStarter: string) => {
    console.log('change starter', selectedStarter, this);
    this.setState(
      {
        gatsbyStarter: selectedStarter,
      },
      () => {
        console.log('updated', this.state);
      }
    );
  };

  projectSpecificSteps(projectType: ProjectType) {
    const { activeField, projectStarter } = this.props;
    switch (projectType) {
      case 'gatsby':
        return (
          <FadeIn key="step-starter">
            <FormField
              label="Project Starter"
              isFocused={activeField === 'projectStarter'}
            >
              {/* <ProjectTypeSelection
                projectType={projectType}
                onProjectTypeSelect={selectedProjectType =>
                  this.updateProjectType(selectedProjectType)
                }
              /> */}
              <TextInput
                onChange={evt => this.updateGatsbyStarter(evt.target.value)}
                value={projectStarter}
                onFocus={this.handleFocusStarter}
                placeholder="Enter a starter"
              />
              <FillButton
                onClick={() =>
                  toastr.confirm('Select starter', {
                    component: () => (
                      <SelectStarterDialog
                        onSelect={this.changeGatsbyStarter}
                        selectedStarter={this.state.gatsbyStarter}
                      />
                    ),
                    okText: 'Use selected',
                    onOk: () =>
                      this.updateGatsbyStarter(this.state.gatsbyStarter),
                  })
                }
              >
                Select Starter
              </FillButton>
            </FormField>
          </FadeIn>
        );
      default:
        return null;
    }
  }

  renderConditionalSteps(currentStepIndex: number) {
    const { activeField, projectType, projectIcon } = this.props;
    const buildSteps: Array<?React$component> = [
      // currentStepIndex > 0 -- > 1
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
      this.projectSpecificSteps(projectType), // currentStepIndex > 1
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
    ];

    const renderedSteps: Array<React$component> = buildSteps
      .filter(step => !!step)
      .slice(0, currentStepIndex);

    console.log('render steps', renderedSteps);
    return {
      lastIndex: projectType === 'gatsby' ? 3 : 2, //buildSteps.length, // Todo: Use buildSteps array to find last index
      steps: renderedSteps,
    };
  }
  validateField(currentStepIndex: number) {
    // todo: Refactor - Move buildsteps to component scope & use an array method to check current validation
    //       --> For now we're doing a different check for Gatsby flow
    const { projectIcon, projectStarter, projectType } = this.props;
    return projectType === 'gatsby'
      ? (currentStepIndex > 0 && !projectType) ||
          (currentStepIndex > 1 && projectStarter === '') ||
          (currentStepIndex > 2 && !projectIcon)
      : (currentStepIndex > 0 && !projectType) ||
          (currentStepIndex > 1 && !projectIcon);
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
        {/* <pre>{JSON.stringify(this.props, null, 2)}</pre> */}
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
              this.validateField(currentStepIndex)
            }
            readyToBeSubmitted={currentStepIndex >= lastIndex}
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
