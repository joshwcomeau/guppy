import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u2728 as shuffle } from 'react-icons-kit/noto_emoji_regular/u2728';

import { COLORS } from '../../constants';
import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';

import TwoPaneModal from '../TwoPaneModal';
import Paragraph from '../Paragraph';
import FormField from '../FormField';
import TextInput from '../TextInput';
import ButtonWithIcon from '../ButtonWithIcon';
import OutlineButton from '../OutlineButton';
import CircularOutlineButton from '../CircularOutlineButton';
import Spacer from '../Spacer';

import ProjectName from './ProjectName';

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

  updateProjectName = projectName => this.setState({ projectName });
  updateProjectType = projectType =>
    this.setState({ projectType, activeField: 'projectType' });

  renderRightPane() {
    const { projectName, projectType, activeField } = this.state;

    return (
      <Fragment>
        <ProjectName
          name={projectName}
          isFocused={activeField === 'projectName'}
          handleFocus={() => this.setState({ activeField: 'projectName' })}
          handleBlur={() => this.setState({ activeField: null })}
          handleChange={this.updateProjectName}
        />

        <FormField
          label="Project Type"
          isFocused={activeField === 'projectType'}
        >
          <ProjectTypeTogglesWrapper>
            <OutlineButton
              color1={projectType === 'react' ? '#146AB5' : '#FFF'}
              color2={projectType === 'react' ? '#61DAFB' : '#FFF'}
              icon={<ReactIcon src={reactIconSrc} />}
              onClick={() => this.updateProjectType('react')}
            >
              React.js
            </OutlineButton>
            <Spacer size={10} />
            <OutlineButton
              color1={projectType === 'gatsby' ? '#663399' : '#FFF'}
              color2={projectType === 'gatsby' ? '#c700ff' : '#FFF'}
              icon={<GatsbyIcon src={gatsbyIconSrc} />}
              onClick={() => this.updateProjectType('gatsby')}
            >
              Gatsby
            </OutlineButton>
          </ProjectTypeTogglesWrapper>
        </FormField>

        <FormField
          label="Project Icon"
          isFocused={activeField === 'projectIcon'}
        >
          <ProjectTypeTogglesWrapper>
            <OutlineButton
              color1={projectType === 'react' ? '#146AB5' : '#FFF'}
              color2={projectType === 'react' ? '#61DAFB' : '#FFF'}
              icon={<ReactIcon src={reactIconSrc} />}
              onClick={() => this.updateProjectType('react')}
            >
              React.js
            </OutlineButton>
            <Spacer size={10} />
            <OutlineButton
              color1={projectType === 'gatsby' ? '#663399' : '#FFF'}
              color2={projectType === 'gatsby' ? '#c700ff' : '#FFF'}
              icon={<GatsbyIcon src={gatsbyIconSrc} />}
              onClick={() => this.updateProjectType('gatsby')}
            >
              Gatsby
            </OutlineButton>
          </ProjectTypeTogglesWrapper>
        </FormField>
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
  width: 21px;
  height: 21px;
`;

const ProjectTypeTogglesWrapper = styled.div`
  margin-top: 8px;
  margin-left: -8px;
`;

export default CreateNewProjectWizard;
