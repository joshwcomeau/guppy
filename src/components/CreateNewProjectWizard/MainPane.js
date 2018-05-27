// @flow
import React, { PureComponent, Fragment } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';
import importAll from 'import-all.macro';

import { sampleMany } from '../../utils';
import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';

import FormField from '../FormField';
import TextInput from '../TextInput';
import SelectableImage from '../SelectableImage';
import Button from '../Button';
import ButtonWithIcon from '../ButtonWithIcon';
import Spacer from '../Spacer';
import FadeIn from '../FadeIn';

import ProjectName from './ProjectName';
import SubmitButton from './SubmitButton';

import type { Field, Step } from './types';

const icons = importAll.sync('../../assets/images/icons/icon_*.jpg');
const iconSrcs = Object.values(icons);

type Props = {
  projectName: string,
  projectType: ?ProjectType,
  projectIcon: ?string,
  activeField: ?Field,
  currentStepIndex: number,
  updateFieldValue: (field: Field, value: any) => void,
  focusField: (field: ?Field) => void,
  handleSubmit: () => void,
};

class MainPane extends PureComponent<Props> {
  iconSubset = sampleMany(iconSrcs, 10);

  handleFocusProjectName = () => this.props.focusField('projectName');
  handleBlurProjectName = () => this.props.focusField(null);

  updateProjectName = projectName =>
    this.props.updateFieldValue('projectName', projectName);
  updateProjectType = projectType =>
    this.props.updateFieldValue('projectType', projectType);
  updateProjectIcon = projectIcon =>
    this.props.updateFieldValue('projectIcon', projectIcon);

  render() {
    const {
      projectName,
      projectType,
      projectIcon,
      activeField,
      currentStepIndex,
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
              />

              {currentStepIndex > 0 && (
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

              {currentStepIndex > 1 && (
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
            </Wrapper>
          )}
        </Motion>
        <SubmitButtonWrapper>
          <SubmitButton
            isDisabled={
              !projectName ||
              (currentStepIndex > 0 && !projectType) ||
              (currentStepIndex > 1 && !projectIcon)
            }
            readyToBeSubmitted={currentStepIndex >= 2}
            onSubmit={handleSubmit}
          />
        </SubmitButtonWrapper>
      </Fragment>
    );
  }
}

const Wrapper = styled.div`
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

export default MainPane;
