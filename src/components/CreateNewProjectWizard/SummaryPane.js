// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { RAW_COLORS, COLORS } from '../../constants';

import Paragraph from '../Paragraph';
import FadeIn from '../FadeIn';
import Spacer from '../Spacer';
import Logo from '../Logo';
import ExternalLink from '../ExternalLink';

import ImportExisting from './ImportExisting';

import type { ProjectType } from '../../types';
import type { Field, Step } from './types';

type Props = {
  currentStep: Step,
  activeField: ?Field,
  projectType: ?ProjectType,
};

class SummaryPane extends PureComponent<Props> {
  renderPaneContents() {
    const { currentStep, activeField, projectType } = this.props;

    // If we're still in the first step, we want to show our intro details.
    if (currentStep === 'projectName') {
      return (
        <IntroWrapper>
          <FadeIn key="intro-t">
            <Logo size="large" />

            <Spacer size={30} />
            <StepTitle>Create new project</StepTitle>
            <Paragraph>
              Let's start by giving your new project a name.
            </Paragraph>

            <Spacer size={130} />
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
        let details;

        switch (projectType) {
          default: {
            details = (
              <Paragraph>
                Guppy can create projects of different types. Click a type to
                learn more about it.
              </Paragraph>
            );
            break;
          }
          case 'create-react-app': {
            details = (
              <Fragment>
                <Paragraph>
                  <strong>Vanilla React</strong>
                </Paragraph>
                <Paragraph>
                  Vanilla React projects use create-react-app, an official
                  command-line tool built by Facebook for bootstrapping React
                  applications.
                </Paragraph>
                <Paragraph>
                  It's a fantastic general-purpose tool, and is the recommended
                  approach if you're looking to become a skilled React
                  developer.
                </Paragraph>
                <Paragraph>
                  <ExternalLink
                    color={COLORS.textOnBackground}
                    hoverColor={COLORS.textOnBackground}
                    href="https://github.com/facebook/create-react-app"
                  >
                    <strong>Learn more about create-react-app.</strong>
                  </ExternalLink>
                </Paragraph>
              </Fragment>
            );
            break;
          }
          case 'gatsby': {
            details = (
              <Fragment>
                <Paragraph>
                  <strong>Gatsby</strong>
                </Paragraph>
                <Paragraph>
                  Gatsby is a blazing fast static site generator for React.
                </Paragraph>
                <Paragraph>
                  It's great for building blogs and personal websites, and
                  provides amazing performance out-of-the-box. A great choice
                  for quickly getting products built.
                </Paragraph>
                <Paragraph>
                  <ExternalLink
                    color={COLORS.textOnBackground}
                    hoverColor={COLORS.textOnBackground}
                    href="https://www.gatsbyjs.org/"
                  >
                    <strong>Learn more about Gatsby.</strong>
                  </ExternalLink>
                </Paragraph>
              </Fragment>
            );
            break;
          }
          case 'nextjs': {
            details = (
              <Fragment>
                <Paragraph>
                  <strong>Next.js</strong>
                </Paragraph>
                <Paragraph>
                  Next.js is a lightweight framework for static and
                  server-rendered applications.
                </Paragraph>
                <Paragraph>
                  Server-rendered by default. No need to worry about routing. A
                  great choice for quickly getting products built with
                  server-side rendering by a Node.js server.
                </Paragraph>
                <Paragraph>
                  <ExternalLink
                    color={COLORS.textOnBackground}
                    hoverColor={COLORS.textOnBackground}
                    href="https://nextjs.org/learn/"
                  >
                    <strong>Learn more about Next.js.</strong>
                  </ExternalLink>
                </Paragraph>
              </Fragment>
            );
            break;
          }
        }
        return (
          <Fragment>
            <FadeIn key="s2t">
              <StepTitle>Project Type</StepTitle>
              {details}
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
      case 'projectStarter': {
        // todo: why is a key needed on FadeIn? Was s3t.
        // todo: should we rename projectStarter to be mores specific as this is Gatsby only.
        return (
          <Fragment>
            <FadeIn>
              <StepTitle>Gatsby Starter</StepTitle>

              <Paragraph>
                Please enter a starter for your project (e.g.
                gatsby-starter-blog or repo. url) or pick one from the starters
                list.
              </Paragraph>
              <Paragraph>
                This step is optional. Just leave the field empty to use the
                default Gatsby starter. But picking a starter will help to
                bootstrap your project e.g. you can easily create your own blog
                by picking one of the blog starter templates.
              </Paragraph>
              <Paragraph>
                For a better overview you can also have a look at the{' '}
                <ExternalLink
                  color={RAW_COLORS.white}
                  hoverColor={RAW_COLORS.white}
                  href="https://www.gatsbyjs.org/starters/"
                >
                  Gatsby starters library
                </ExternalLink>
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
