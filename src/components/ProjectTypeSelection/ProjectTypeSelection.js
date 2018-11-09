// @flow
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';

import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';
import nextjsIconSrc from '../../assets/images/nextjs_small.png';

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

const ReactIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const GatsbyIcon = styled.img`
  width: 22px;
  height: 22px;
`;

const NextjsIcon = styled.img`
  width: 22px;
  height: 22px;
`;

const ProjectTypeTogglesWrapper = styled.div`
  margin-top: 8px;
  margin-left: -8px;
`;

const mapProjectTypeToComponent = [
  {
    type: 'create-react-app',
    Component: <ReactIcon src={reactIconSrc} />,
    caption: 'Vanilla React',
  },
  {
    type: 'gatsby',
    Component: <GatsbyIcon src={gatsbyIconSrc} />,
    caption: 'Gatsby',
  },
  {
    type: 'nextjs',
    Component: <NextjsIcon src={nextjsIconSrc} />,
    caption: 'Next.js',
  },
];

export default ProjectTypeSelection;
