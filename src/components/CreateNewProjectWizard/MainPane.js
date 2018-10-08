// @flow
import React, { PureComponent, Fragment } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';

import FormField from '../FormField';
import ProjectIconSelection from '../ProjectIconSelection';
import ButtonWithIcon from '../ButtonWithIcon';
import Spacer from '../Spacer';
import FadeIn from '../FadeIn';

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
              <ProjectPath projectName={projectName} />

              {currentStepIndex > 0 && (
                <FadeIn>
                  <FormField
                    label="Project Type"
                    isFocused={activeField === 'projectType'}
                  >
                    <ProjectTypeTogglesWrapper>
                      <ButtonWithIcon
                        showStroke={projectType === 'create-react-app'}
                        icon={<ReactIcon src={reactIconSrc} />}
                        onClick={() =>
                          this.updateProjectType('create-react-app')
                        }
                      >
                        Vanilla React
                      </ButtonWithIcon>
                      <Spacer inline size={10} />
                      <ButtonWithIcon
                        showStroke={projectType === 'gatsby'}
                        icon={<GatsbyIcon src={gatsbyIconSrc} />}
                        onClick={() => this.updateProjectType('gatsby')}
                      >
                        Gatsby
                      </ButtonWithIcon>
                    </ProjectTypeTogglesWrapper>
                  </FormField>
                </FadeIn>
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

const ReactIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const GatsbyIcon = styled.img`
  width: 22px;
  height: 22px;
`;

const ProjectTypeTogglesWrapper = styled.div`
  margin-top: 8px;
  margin-left: -8px;
`;

const SubmitButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  text-align: center;
`;

export default MainPane;
