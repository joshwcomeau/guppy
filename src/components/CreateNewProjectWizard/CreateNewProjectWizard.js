import React, { Component, Fragment } from 'react';
import { Motion, spring } from 'react-motion';
import styled, { keyframes } from 'styled-components';
import importAll from 'import-all.macro';
import IconBase from 'react-icons-kit';
import { u1F423 as hatching } from 'react-icons-kit/noto_emoji_regular/u1F423';
import { u2728 as sparkles } from 'react-icons-kit/noto_emoji_regular/u2728';
import { u1F421 as fish } from 'react-icons-kit/noto_emoji_regular/u1F421';

import { sampleMany } from '../../utils';
import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';

import TwoPaneModal from '../TwoPaneModal';
import Paragraph from '../Paragraph';
import FormField from '../FormField';
import TextInput from '../TextInput';
import SelectableImage from '../SelectableImage';
import Button from '../Button';
import ButtonWithIcon from '../ButtonWithIcon';
import Spacer from '../Spacer';
import FadeIn from '../FadeIn';

import ProjectName from './ProjectName';
import SubmitButton from './SubmitButton';
import SummaryPane from './SummaryPane';

const icons = importAll.sync('../../assets/images/icons/icon_*.jpg');

const iconSrcs = Object.values(icons);

const STEPS = ['projectName', 'projectType', 'projectIcon', 'done'];

class CreateNewProjectWizard extends Component {
  state = {
    projectName: '',
    projectType: null,
    projectIcon: null,
    activeField: 'projectName',
    currentStep: 'projectName',
    shouldShowRandomizationHint: false,
  };

  iconSubset = sampleMany(iconSrcs, 10);

  componentDidMount() {
    window.setTimeout(this.enableRandomizationHint, 2000);
  }

  updateProjectName = projectName =>
    this.setState({ projectName, activeField: 'projectName' });
  updateProjectType = projectType =>
    this.setState({ projectType, activeField: 'projectType' });
  updateProjectIcon = projectIcon =>
    this.setState({ projectIcon, activeField: 'projectIcon' });

  handleFocusProjectName = () => this.setState({ activeField: 'projectName' });
  handleBlurProjectName = () => this.setState({ activeField: null });

  enableRandomizationHint = () =>
    this.setState({ shouldShowRandomizationHint: true });

  handleSubmit = () => {
    this.setState({ currentStep: 'done' });
  };

  attemptStepIncrement = () => {
    const currentStepIndex = STEPS.indexOf(this.state.currentStep);
    const nextStep = STEPS[currentStepIndex + 1];

    if (nextStep) {
      this.setState({
        currentStep: nextStep,
        activeField: nextStep,
      });
    }
  };

  renderRightPane() {
    const {
      projectName,
      projectType,
      projectIcon,
      activeField,
      currentStep,
    } = this.state;

    const currentStepIndex = STEPS.indexOf(currentStep);

    return (
      <Fragment>
        <Motion style={{ offset: spring(currentStepIndex === 0 ? 50 : 0) }}>
          {({ offset }) => (
            <RightPaneWrapper style={{ transform: `translateY(${offset}px)` }}>
              <ProjectName
                name={projectName}
                isFocused={activeField === 'projectName'}
                handleFocus={this.handleFocusProjectName}
                handleBlur={this.handleBlurProjectName}
                handleChange={this.updateProjectName}
              />

              {currentStepIndex > STEPS.indexOf('projectName') && (
                <FadeIn>
                  <FormField
                    label="Project Type"
                    isFocused={activeField === 'projectType'}
                  >
                    <ProjectTypeTogglesWrapper>
                      <ButtonWithIcon
                        showOutline={projectType === 'react'}
                        icon={<ReactIcon src={reactIconSrc} />}
                        onClick={() => this.updateProjectType('react')}
                      >
                        React.js
                      </ButtonWithIcon>
                      <Spacer inline size={10} />
                      <ButtonWithIcon
                        showOutline={projectType === 'gatsby'}
                        icon={<GatsbyIcon src={gatsbyIconSrc} />}
                        onClick={() => this.updateProjectType('gatsby')}
                      >
                        Gatsby
                      </ButtonWithIcon>
                    </ProjectTypeTogglesWrapper>
                  </FormField>
                </FadeIn>
              )}

              {currentStepIndex > STEPS.indexOf('projectType') && (
                <FadeIn>
                  <FormField
                    label="Project Icon"
                    focusOnClick={false}
                    isFocused={activeField === 'projectIcon'}
                  >
                    <ProjectIconWrapper>
                      {this.iconSubset.map(src => (
                        <SelectableImageWrapper key={src}>
                          <SelectableImage
                            src={src}
                            size={60}
                            onClick={() => this.updateProjectIcon(src)}
                            status={
                              projectIcon === null
                                ? 'default'
                                : projectIcon === src
                                  ? 'highlighted'
                                  : 'faded'
                            }
                          />
                        </SelectableImageWrapper>
                      ))}
                    </ProjectIconWrapper>
                  </FormField>
                </FadeIn>
              )}
            </RightPaneWrapper>
          )}
        </Motion>
        <SubmitButtonWrapper>
          <SubmitButton
            isDisabled={
              !projectName ||
              (currentStepIndex > 0 && !projectType) ||
              (currentStepIndex > 1 && !projectIcon)
            }
            readyToBeSubmitted={
              currentStepIndex >= STEPS.indexOf('projectIcon')
            }
            handleNext={this.attemptStepIncrement}
            handleSubmit={this.handleSubmit}
          />
        </SubmitButtonWrapper>
      </Fragment>
    );
  }

  renderLeftPane() {
    return;
  }

  renderGuidanceText = () => {
    const {
      currentStep,
      activeField,
      shouldShowRandomizationHint,
    } = this.state;
  };

  render() {
    const {
      currentStep,
      activeField,
      shouldShowRandomizationHint,
    } = this.state;
    const isFolded = this.state.currentStep === 'done';

    return (
      <TwoPaneModal
        isFolded={isFolded}
        leftPane={
          <LeftPaneWrapper>
            <SummaryPane
              currentStep={currentStep}
              activeField={activeField}
              shouldShowRandomizationHint={shouldShowRandomizationHint}
            />
          </LeftPaneWrapper>
        }
        rightPane={this.renderRightPane()}
        backface={"I'm in the back"}
      />
    );
  }
}

const LeftPaneWrapper = styled.div`
  text-shadow: 1px 1px 0px rgba(13, 37, 170, 0.1);
`;
const RightPaneWrapper = styled.div`
  height: 470px;
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

const ProjectIconWrapper = styled.div`
  margin-top: 16px;
`;

const ProjectIconImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
`;

const SelectableImageWrapper = styled.div`
  display: inline-block;
  margin: 0px 10px 10px 0px;
`;

const SubmitButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  text-align: center;
`;

export default CreateNewProjectWizard;
