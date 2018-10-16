// @flow
import React, { PureComponent, Fragment } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';
import { connect } from 'react-redux';

import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';

import FormField from '../FormField';
import ProjectIconSelection from '../ProjectIconSelection';
import ButtonWithIcon from '../ButtonWithIcon';
import Spacer from '../Spacer';
import FadeIn from '../FadeIn';
import ProjectTypeSelection from '../ProjectTypeSelection';
import {
  getDefaultProjectType,
  getDefaultProjectPath,
} from '../../reducers/app-settings.reducer';

import ProjectName from './ProjectName';
import ProjectPath from './ProjectPath';
import SubmitButton from './SubmitButton';

import type { Field, Status } from './types';
import type { ProjectType } from '../../types';

type Props = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  activeField: ?Field,
  status: Status,
  currentStepIndex: number,
  hasBeenSubmitted: boolean,
  isProjectNameTaken: boolean,
  updateFieldValue: (field: Field, value: any) => void,
  focusField: (field: ?Field) => void,
  handleSubmit: () => Promise<any> | void,
};

class MainPane extends PureComponent<Props> {
  handleFocusProjectName = () => this.props.focusField('projectName');
  handleBlurProjectName = () => this.props.focusField(null);

  updateProjectName = (projectName: string) =>
    this.props.updateFieldValue('projectName', projectName);
  updateProjectType = (projectType: ProjectType) =>
    this.props.updateFieldValue('projectType', projectType);
  updateProjectIcon = (projectIcon: string) =>
    this.props.updateFieldValue('projectIcon', projectIcon);

  render() {
    const {
      projectHome,
      projectName,
      projectType,
      projectIcon,
      activeField,
      currentStepIndex,
      hasBeenSubmitted,
      isProjectNameTaken,
      handleSubmit,
    } = this.props;

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
              <ProjectPath
                projectName={projectName}
                projectHome={projectHome}
              />

              {currentStepIndex > 0 && (
                <ProjectTypeSelection
                  activeField={activeField}
                  projectType={projectType}
                  onSelect={this.updateProjectType}
                />
              )}

              {currentStepIndex > 1 && (
                <FadeIn>
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
                </FadeIn>
              )}
            </Wrapper>
          )}
        </Motion>
        <SubmitButtonWrapper>
          <SubmitButton
            isDisabled={
              isProjectNameTaken ||
              !projectName ||
              (currentStepIndex > 0 && !projectType) ||
              (currentStepIndex > 1 && !projectIcon)
            }
            readyToBeSubmitted={currentStepIndex >= 2}
            hasBeenSubmitted={hasBeenSubmitted}
            onSubmit={handleSubmit}
          />
        </SubmitButtonWrapper>
      </Fragment>
    );
  }
}

const Wrapper = styled.div`
  height: 500px;
  will-change: transform;
`;

const SubmitButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  text-align: center;
`;

const mapStateToProps = state => ({
  projectType: getDefaultProjectType(state),
  projectHome: getDefaultProjectPath(state),
});

export default connect(mapStateToProps)(MainPane);
