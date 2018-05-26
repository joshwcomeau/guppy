import React, { Component, Fragment } from 'react';
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

import ProjectName from './ProjectName';
import SubmitButton from './SubmitButton';

const icons = importAll.sync('../../assets/images/icons/icon_*.jpg');

const iconSrcs = Object.values(icons);

const STEPS = ['projectName', 'projectType', 'projectIcon'];

class CreateNewProjectWizard extends Component {
  state = {
    activeField: 'projectName',
    folded: false,
    projectName: '',
    projectType: null,
    projectIcon: null,
    currentStep: 'projectName',
  };

  iconSubset = sampleMany(iconSrcs, 10);

  componentDidMount() {
    window.setTimeout(this.showRandomizationHint, 2000);
  }

  updateProjectName = projectName =>
    this.setState({ projectName, activeField: 'projectName' });
  updateProjectType = projectType =>
    this.setState({ projectType, activeField: 'projectType' });
  updateProjectIcon = projectIcon =>
    this.setState({ projectIcon, activeField: 'projectIcon' });

  handleFocusProjectName = () => this.setState({ activeField: 'projectName' });

  showRandomizationHint = () => this.setState({ hasBeenAWhile: true });

  handleSubmit = () => {
    console.log('habndke submit');
  };

  attemptStepIncrement = () => {
    console.log('handle next');
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
      <RightPaneWrapper>
        <ProjectName
          name={projectName}
          isFocused={activeField === 'projectName'}
          handleFocus={this.handleFocusProjectName}
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

        <Spacer size={20} />

        <SubmitButtonWrapper>
          <SubmitButton
            readyToBeSubmitted={
              currentStepIndex >= STEPS.indexOf('projectIcon')
            }
            handleNext={this.attemptStepIncrement}
            handleSubmit={this.handleSubmit}
          />
        </SubmitButtonWrapper>
      </RightPaneWrapper>
    );
  }

  renderLeftPane() {
    return <LeftPaneWrapper>{this.renderGuidanceText()}</LeftPaneWrapper>;
  }

  renderGuidanceText = () => {
    const { currentStep, activeField, hasBeenAWhile } = this.state;

    // If we're still in the first step, we want to show our intro details.
    if (currentStep === 'projectName') {
      return (
        <IntroWrapper>
          <FadeIn key="intro-t">
            <IconBase size={96} icon={fish} />
            <Spacer size={30} />
            <StepTitle>Welcome to Guppy!</StepTitle>
            <Paragraph>
              Let's start by giving your new project a name.
            </Paragraph>
          </FadeIn>
          {hasBeenAWhile && (
            <FadeIn key="intro-addendum">
              <Spacer size={50} />
              <Paragraph>
                Can't think of anything? Click the{' '}
                <InlineSparkles>
                  <IconBase size={26} icon={sparkles} />
                </InlineSparkles>{' '}
                to generate a temporary code-name.
              </Paragraph>
            </FadeIn>
          )}
        </IntroWrapper>
      );
    }

    // After that first step, there's a "default" display for each step,
    // but that can be overridden with active focus.

    switch (activeField) {
      case null: {
      }

      case 'projectName': {
        return (
          <Fragment>
            <FadeIn key="s1-1">
              <StepTitle>Project Name</StepTitle>
              <Paragraph>
                Don't stress too much about your project's name! You can always
                change this later.
              </Paragraph>
            </FadeIn>
            <Spacer size={20} />

            {hasBeenAWhile && (
              <FadeIn key="s1-2">
                <Paragraph>
                  Let the universe decide by using the{' '}
                  <InlineSparkles>
                    <IconBase size={26} icon={sparkles} />
                  </InlineSparkles>{' '}
                  to generate a random code-name for your project.
                </Paragraph>
              </FadeIn>
            )}
          </Fragment>
        );
      }

      case 'projectType': {
        return (
          <Fragment>
            <FadeIn key="s2t">
              <StepTitle>Project Type</StepTitle>
              <Paragraph>
                Guppy interfaces with several external tools to manage your
                projects.
              </Paragraph>
              <Paragraph>
                React.js uses create-react-app, a flexible development
                environment for building web applications of all types.
              </Paragraph>
              <Paragraph>
                Gatsby is a static site generator for React.js, and is an
                awesome choice
              </Paragraph>
            </FadeIn>
          </Fragment>
        );
      }

      case 'projectIcon': {
        return (
          <Fragment>
            <FadeIn key="s3t">
              <StepTitle>Project Icon</StepTitle>

              <Paragraph>
                Choose an icon, to help you recognize this project from a list.
              </Paragraph>
            </FadeIn>
          </Fragment>
        );
      }
    }
  };

  render() {
    return (
      <TwoPaneModal
        isFolded={false}
        leftPane={this.renderLeftPane()}
        rightPane={this.renderRightPane()}
        backface={"I'm in the back"}
      />
    );
  }
}

const LeftPaneWrapper = styled.div`
  text-shadow: 1px 1px 0px rgba(13, 37, 170, 0.1);
`;

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const FadeIn = styled(Paragraph)`
  animation: ${fadeIn} 500ms;
`;

const RightPaneWrapper = styled.div`
  height: 470px;
`;

const StepTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
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

const IntroWrapper = styled.div`
  text-align: center;
  padding-top: 20px;
`;

const InlineSparkles = styled.span`
  display: inline-block;
  transform: translateY(5px);
`;

export default CreateNewProjectWizard;
