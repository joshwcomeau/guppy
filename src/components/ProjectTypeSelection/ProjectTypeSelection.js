// @flow
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';

import { GatsbyIcon, NextjsIcon, ReactIcon } from '../Icons';
import ButtonWithIcon from '../ButtonWithIcon';
import Spacer from '../Spacer';

import type { ProjectType } from '../../types';
type Props = {
  projectType: ?ProjectType,
  onProjectTypeSelect: (projectType: ProjectType) => void,
  handleIncorrectNodeVersion: (str: string | null) => void,
};

const INCORRECT_NODE_STRING =
  'You do not have the correct version of node installed, node version required:';

class ProjectTypeSelection extends PureComponent<Props> {
  componentDidMount() {
    const { projectType, handleIncorrectNodeVersion } = this.props;
    if (projectType && !this.testNodeVersion(projectType)) {
      const [project] = mapProjectTypeToComponent.filter(
        x => x.type === projectType
      );
      handleIncorrectNodeVersion(`${INCORRECT_NODE_STRING} ${project.nodeReq}`);
    }
  }

  testNodeVersion = (projectType: ProjectType) => {
    const currentNode = window.process.env.npm_config_node_version
      .split('.')
      .map(Number);
    const [project] = mapProjectTypeToComponent.filter(
      x => x.type === projectType
    );
    const requiredNode = project.nodeReq.split('.').map(Number);

    for (let i = 0; i < currentNode.length; i += 1) {
      if (currentNode[i] > requiredNode[i]) {
        return true;
      }
      if (currentNode[i] < requiredNode[i]) {
        return false;
      }
    }

    return true;
  };

  select = (ev: SyntheticEvent<*>, projectType: ProjectType) => {
    ev.preventDefault();
    const { onProjectTypeSelect, handleIncorrectNodeVersion } = this.props;

    const [project] = mapProjectTypeToComponent.filter(
      x => x.type === projectType
    );

    if (!this.testNodeVersion(projectType)) {
      handleIncorrectNodeVersion(`${INCORRECT_NODE_STRING} ${project.nodeReq}`);
    } else {
      handleIncorrectNodeVersion(null);
    }

    onProjectTypeSelect(projectType);
  };

  render() {
    const { projectType } = this.props;
    return (
      <ProjectTypeTogglesWrapper>
        {mapProjectTypeToComponent.map((curProjectType, index) => (
          <Fragment key={index}>
            <ButtonWithIcon
              showStroke={projectType === curProjectType.type}
              icon={curProjectType.Component}
              onClick={(ev: SyntheticEvent<*>) =>
                this.select(ev, curProjectType.type)
              }
            >
              {curProjectType.caption}
            </ButtonWithIcon>
            <Spacer inline size={10} />
          </Fragment>
        ))}
      </ProjectTypeTogglesWrapper>
    );
  }
}

const ProjectTypeTogglesWrapper = styled.div`
  margin-top: 8px;
  margin-left: -8px;
`;

const mapProjectTypeToComponent = [
  {
    type: 'create-react-app',
    Component: ReactIcon,
    caption: 'Vanilla React',
    nodeReq: '8.16.0',
  },
  {
    type: 'gatsby',
    Component: GatsbyIcon,
    caption: 'Gatsby',
    nodeReq: '8.0.0',
  },
  {
    type: 'nextjs',
    Component: NextjsIcon,
    caption: 'Next.js',
    nodeReq: '10.0.0',
  },
];

export default ProjectTypeSelection;
