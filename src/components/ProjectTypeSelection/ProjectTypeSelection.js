import React, { PureComponent } from 'react';
import styled from 'styled-components';

import reactIconSrc from '../../assets/images/react-icon.svg';
import gatsbyIconSrc from '../../assets/images/gatsby_small.png';

import FormField from '../FormField';
import ButtonWithIcon from '../ButtonWithIcon';
import Spacer from '../Spacer';
import FadeIn from '../FadeIn';

import { ProjectType } from '../../types';
type Props = {
  activeField: string,
  label?: string,
  projectType: string,
  onSelect: string => void,
};

class ProjectTypeSelection extends PureComponent<Props> {
  static defaultProps = {
    label: 'Project Type',
  };

  select = (ev: SyntheticEvent<*>, projectType: ProjectType) => {
    ev.preventDefault();
    this.props.onSelect(projectType);
  };

  render() {
    const { activeField, projectType, label } = this.props;
    return (
      <FadeIn>
        <FormField label={label} isFocused={activeField === 'projectType'}>
          <ProjectTypeTogglesWrapper>
            <ButtonWithIcon
              showStroke={projectType === 'create-react-app'}
              icon={<ReactIcon src={reactIconSrc} />}
              onClick={(ev: SyntheticEvent<*>) =>
                this.select(ev, 'create-react-app')
              }
            >
              Vanilla React
            </ButtonWithIcon>
            <Spacer inline size={10} />
            <ButtonWithIcon
              showStroke={projectType === 'gatsby'}
              icon={<GatsbyIcon src={gatsbyIconSrc} />}
              onClick={(ev: SyntheticEvent<*>) => this.select(ev, 'gatsby')}
            >
              Gatsby
            </ButtonWithIcon>
          </ProjectTypeTogglesWrapper>
        </FormField>
      </FadeIn>
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

const ProjectTypeTogglesWrapper = styled.div`
  margin-top: 8px;
  margin-left: -8px;
`;

export default ProjectTypeSelection;
