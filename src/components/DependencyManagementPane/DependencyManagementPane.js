// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { runTask, abortTask } from '../../actions';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getTaskByProjectIdAndTaskName } from '../../reducers/tasks.reducer';
import { COLORS } from '../../constants';

import Module from '../Module';
import Card from '../Card';
import Button from '../Button';
import DependencyDetails from '../DependencyDetails';

import type { Project, Dependency } from '../../types';

type Props = {
  project: Project,
};

type State = {
  selectedDependency: ?Dependency,
};

// TODO: blank state?
class DependencyManagementPane extends PureComponent<Props, State> {
  state = {
    selectedDependency: null,
  };

  selectDependency = (dependency: Dependency) => {
    this.setState({ selectedDependency: dependency });
  };

  render() {
    const { dependencies } = this.props.project;
    const { selectedDependency } = this.state;

    return (
      <Module title="Dependencies" primaryActionChildren={'Action'}>
        <Wrapper>
          <DependencyList>
            {dependencies.map(dependency => (
              <DependencyButton
                key={dependency.name}
                showOutline={selectedDependency === dependency}
                onClick={() => this.selectDependency(dependency)}
              >
                <DependencyName>{dependency.name}</DependencyName>
                <DependencyVersion>{dependency.version}</DependencyVersion>
              </DependencyButton>
            ))}
          </DependencyList>
          <MainContent>
            {selectedDependency ? (
              <DependencyDetails dependency={selectedDependency} />
            ) : (
              'TODO: Add something here'
            )}
          </MainContent>
        </Wrapper>
      </Module>
    );
  }
}

const Wrapper = Card.extend`
  display: flex;
`;

const DependencyList = styled.div`
  width: 220px;
  background: ${COLORS.gray[100]};
  border-radius: 4px;
  padding: 4px 10px;
  margin: 4px;
`;

const DependencyButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 5px 0px;
`;

const DependencyName = styled.span`
  font-size: 18px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
`;

const DependencyVersion = styled.span`
  padding-left: 10px;
  font-size: 16px;
  color: ${COLORS.gray[500]};
`;

const MainContent = styled.div`
  flex: 1;
  padding: 14px;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependencyManagementPane);
