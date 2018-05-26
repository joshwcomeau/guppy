import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import importAll from 'import-all.macro';
import IconBase from 'react-icons-kit';
import { u2728 as shuffle } from 'react-icons-kit/noto_emoji_regular/u2728';

import { COLORS } from '../../constants';
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

const icons = importAll.sync('../../assets/images/icons/icon_*.jpg');

const iconSrcs = Object.values(icons);

class CreateNewProjectWizard extends Component {
  state = {
    activeField: null,
    folded: false,
    projectName: '',
    projectType: null,
    projectIcon: null,
    status: 'idle',
    currentBuildStep: null,
  };

  iconSubset = sampleMany(iconSrcs, 10);

  updateProjectName = projectName =>
    this.setState({ projectName, activeField: 'projectName' });
  updateProjectType = projectType =>
    this.setState({ projectType, activeField: 'projectType' });
  updateProjectIcon = projectIcon =>
    this.setState({ projectIcon, activeField: 'projectIcon' });

  handleFocusProjectName = () => this.setState({ activeField: 'projectName' });

  renderRightPane() {
    const { projectName, projectType, projectIcon, activeField } = this.state;

    return (
      <Fragment>
        <ProjectName
          name={projectName}
          isFocused={activeField === 'projectName'}
          handleFocus={this.handleFocusProjectName}
          handleChange={this.updateProjectName}
        />

        <FormField
          label="Project Type"
          isFocused={activeField === 'projectType'}
        >
          <ProjectTypeTogglesWrapper>
            <ButtonWithIcon
              showOutline={projectType === 'react'}
              color1="#61DAFB"
              color2="#61DAFB"
              icon={<ReactIcon src={reactIconSrc} />}
              onClick={() => this.updateProjectType('react')}
            >
              React.js
            </ButtonWithIcon>
            <Spacer inline size={10} />
            <ButtonWithIcon
              showOutline={projectType === 'gatsby'}
              color1="#663399"
              color2="#663399"
              icon={<GatsbyIcon src={gatsbyIconSrc} />}
              onClick={() => this.updateProjectType('gatsby')}
            >
              Gatsby
            </ButtonWithIcon>
          </ProjectTypeTogglesWrapper>
        </FormField>

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

        <Spacer size={20} />

        <SubmitButtonWrapper>
          <Button
            color1={COLORS.pink[300]}
            color2={COLORS.red[500]}
            style={{ color: COLORS.pink[500], width: 200 }}
            size="large"
          >
            Create
          </Button>
        </SubmitButtonWrapper>
      </Fragment>
    );
  }

  render() {
    return (
      <TwoPaneModal
        isFolded={false}
        leftPane={
          <Fragment>
            <Title>Create New Project</Title>

            <Paragraph>Hello World</Paragraph>
          </Fragment>
        }
        rightPane={this.renderRightPane()}
        backface={"I'm in the back"}
      />
    );
  }
}

const Title = styled.h1`
  font-size: 36px;
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
  text-align: center;
`;

export default CreateNewProjectWizard;
