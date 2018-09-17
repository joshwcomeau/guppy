// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { COLORS } from '../../constants';
import * as actions from '../../actions';

import MainContentWrapper from '../MainContentWrapper';
import Heading from '../Heading';
import PixelShifter from '../PixelShifter';
import Spacer from '../Spacer';
import { FillButton } from '../Button';
import DevelopmentServerPane from '../DevelopmentServerPane';
import TaskRunnerPane from '../TaskRunnerPane';
import DependencyManagementPane from '../DependencyManagementPane';
import SettingsButton from '../SettingsButton';
import PanelsManager from '../PanelsManager';
import {
  openProjectInEditor,
  openProjectInFolder,
} from '../../services/shell.service';
import { getCopyForOpeningFolder } from '../../services/platform.service';

import type { Project, Panel } from '../../types';

// const ResponsiveGridLayout = WidthProvider(Responsive);

type Props = {
  project: Project,
  loadDependencyInfoFromDisk: (projectId: string, projectPath: string) => any,
};

type State = {
  panels: Array<Panel>,
};

const defaultPanels = [
  {
    key: 'dev-server-panel',
    Component: <DevelopmentServerPane leftSideWidth={300} />, // todo: check if leftSideWidth is required
    grid: { x: 0, y: 0, w: 8, h: 12, minW: 4, maxW: 8 },
  },
  {
    key: 'task-runner-panel',
    Component: <TaskRunnerPane leftSideWidth={200} />,
    grid: { x: 0, y: 13, w: 8, h: 8, minW: 4, maxW: 8 },
  },
  {
    key: 'dependencies-panel', // component: project.dependencies.length > 0 && (
    Component: <DependencyManagementPane />, // todo: add check `project.dependencies.length > 0 && (<DependencyManagementPane />)` to component - was in render
    grid: { x: 0, y: 21, w: 8, h: 14, minW: 6, maxW: 12 },
  },
];

const createPanel = (key, panels, Component) => {
  const prevPanel = panels[panels.length - 1];
  return {
    // static panel for now --> later new panel selection required before addding
    key: key + panels.length,
    Component,
    grid: {
      x: 0,
      y: prevPanel.grid.y + prevPanel.grid.h,
      w: 8,
      h: 8,
      minW: 8,
      maxW: 12,
    },
  };
};
class ProjectPage extends React.Component<Props, State> {
  state = {
    panels: defaultPanels,
  };

  addPanel = () => {
    // todo: More business logic required here --> for now just add a static panel
    //       later, we need to check the advancedPanels for the projectType and if there are panels remaining that are not already added
    //       also selection of panelToAdd required before calling addPanel
    // todo: Check if this requires a Saga for managing panels.
    this.setState(({ panels }) => ({
      panels: [
        ...panels,
        createPanel('test', panels, <p>{'test' + panels.length}</p>),
      ],
    }));
  };

  openIDE = () => {
    const { project } = this.props;
    openProjectInEditor(project);
  };

  openFolder = () => {
    const { project } = this.props;
    // Show a folder in the file manager
    openProjectInFolder(project);
  };

  componentDidMount() {
    const { project, loadDependencyInfoFromDisk } = this.props;

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    loadDependencyInfoFromDisk(project.id, project.path);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.project.id !== nextProps.project.id) {
      this.props.loadDependencyInfoFromDisk(
        nextProps.project.id,
        nextProps.project.path
      );
    }
  }

  render() {
    const { project } = this.props;
    const { panels } = this.state;
    return (
      <FadeIn>
        <MainContentWrapper>
          <FlexRow>
            <PixelShifter
              x={-2}
              reason="Align left edge of title with the modules on page"
            >
              <Heading size="xlarge" style={{ color: COLORS.purple[500] }}>
                {project.name}
              </Heading>
            </PixelShifter>
            <SettingsButton />
          </FlexRow>

          <ProjectActionBar>
            <FillButton
              colors={COLORS.gray[200]}
              hoverColors={COLORS.gray[300]}
              textColor={COLORS.gray[900]}
              size="small"
              onClick={this.openFolder}
            >
              {getCopyForOpeningFolder()}
            </FillButton>
            <Spacer size={15} />
            <FillButton
              colors={COLORS.gray[200]}
              hoverColors={COLORS.gray[300]}
              textColor={COLORS.gray[900]}
              size="small"
              onClick={this.openIDE}
            >
              Open in Editor
            </FillButton>
          </ProjectActionBar>

          <PanelsManager
            panels={panels}
            addPanel={this.addPanel}
            simpleMode={false}
          />
        </MainContentWrapper>
      </FadeIn>
    );
  }
}

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectActionBar = styled.div`
  display: flex;
`;

const fadeIn = keyframes`
  from { opacity: 0.5 }
  to { opacity: 1 }
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 400ms;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(
  mapStateToProps,
  {
    loadDependencyInfoFromDisk: actions.loadDependencyInfoFromDisk,
  }
)(ProjectPage);
