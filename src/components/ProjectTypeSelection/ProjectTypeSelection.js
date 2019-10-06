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
};

class ProjectTypeSelection extends PureComponent<Props> {
  select = (ev: SyntheticEvent<*>, projectType: ProjectType) => {
    ev.preventDefault();
    this.props.onProjectTypeSelect(projectType);
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
  },
  {
    type: 'gatsby',
    Component: GatsbyIcon,
    caption: 'Gatsby',
  },
  {
    type: 'nextjs',
    Component: NextjsIcon,
    caption: 'Next.js',
  },
];

export default ProjectTypeSelection;
