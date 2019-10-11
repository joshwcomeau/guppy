// @flow
import React from 'react';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';
import { RAW_COLORS } from '../../constants';
import Heading from '../Heading';
import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';
import nextjsIconSrc from '../../assets/images/nextjs_small.png';
import type { ProjectType } from '../../types';

const TitleIcon = styled.img`
  display: inline-block;
  vertical-align: text-top;
  filter: grayscale(100%);
  :hover {
    filter: grayscale(0%);
  }
`;

const ProjectTitleIcon = styled(TitleIcon)`
  width: 3rem;
  height: 3rem;
  margin-left: 1rem;
  margin-top: 1rem;
`;

const ProjectTitleIconReact = styled(TitleIcon)`
  width: 5rem;
  height: 5rem;
`;

const TitleWrapper = styled.div`
  display: flex;
`;

const TypeIcon = ({ type }: { type: ProjectType }) => {
  switch (type) {
    case 'create-react-app':
      return <ProjectTitleIconReact src={reactIconSrc} />;
    case 'gatsby':
      return <ProjectTitleIcon src={gatsbyIconSrc} />;
    case 'nextjs':
      return <ProjectTitleIcon src={nextjsIconSrc} />;
    default:
      return null;
  }
};

const ProjectTitle = ({
  tooltip,
  title,
  projectType,
}: {
  tooltip: string,
  title: string,
  projectType?: ProjectType,
}) => {
  return (
    <TitleWrapper>
      <Tooltip title={tooltip} position="bottom">
        <Heading size="xlarge" style={{ color: RAW_COLORS.purple[500] }}>
          {title}
        </Heading>
      </Tooltip>

      {projectType && (
        <Tooltip title={`A ${projectType} project`} position="bottom">
          {projectType && <TypeIcon type={projectType} />}
        </Tooltip>
      )}
    </TitleWrapper>
  );
};

export default ProjectTitle;
