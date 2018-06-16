// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import Paragraph from '../Paragraph';
import FadeIn from '../FadeIn';
import Spacer from '../Spacer';
import Logo from '../Logo';
import Swimming from '../Swimming';

import ImportExisting from './ImportExisting';

import type { Field, Step } from './types';

type Props = {
  currentStep: Step,
  activeField: ?Field,
};

class SummaryPane extends PureComponent<Props> {
  renderPaneContents() {
    const { currentStep, activeField } = this.props;

    // If we're still in the first step, we want to show our intro details.
    if (currentStep === 'projectName') {
      return (
        <IntroWrapper>
          <FadeIn key="intro-t">
            <Swimming>
              <Logo size="large" />
            </Swimming>

            <Spacer size={30} />
            <StepTitle>Create new project</StepTitle>
            <Paragraph>
              Let's start by giving your new project a name.
            </Paragraph>

            <Spacer size={100} />
            <ImportExisting />
          </FadeIn>
        </IntroWrapper>
      );
    }

    // After that first step, there's a "default" display for each step,
    // but that can be overridden with active focus.
    const focusField = activeField || currentStep;

    switch (focusField) {
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

      default:
        throw new Error('Unrecognized `focusField`: ' + focusField);
    }
  }

  render() {
    return <Wrapper>{this.renderPaneContents()}</Wrapper>;
  }
}

const Wrapper = styled.div`
  text-shadow: 1px 1px 0px rgba(13, 37, 170, 0.1);
`;

const StepTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
`;

const IntroWrapper = styled.div`
  text-align: center;
  padding-top: 20px;
`;

export default SummaryPane;
