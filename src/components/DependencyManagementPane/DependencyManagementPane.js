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
import PixelShifter from '../PixelShifter';
import Spacer from '../Spacer';

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
      <Module title="Dependencies">
        <Wrapper>
          <DependencyList>
            {dependencies.map(dependency => (
              <DependencyButton
                key={dependency.name}
                isSelected={selectedDependency === dependency}
                onClick={() => this.selectDependency(dependency)}
              >
                <DependencyName>{dependency.name}</DependencyName>
                <DependencyVersion
                  isSelected={selectedDependency === dependency}
                >
                  {dependency.version}
                </DependencyVersion>
              </DependencyButton>
            ))}
            <Spacer size={15} />
            <Button>Add New Dependency</Button>
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

const Wrapper = styled.div`
  display: flex;
`;

const DependencyList = Card.extend`
  width: 300px;
`;

const DependencyButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  margin: 6px 0px;
  border: none;
  background: ${props =>
    props.isSelected
      ? `linear-gradient(10deg, ${COLORS.blue[700]}, ${COLORS.blue[500]})`
      : COLORS.gray[100]};
  color: ${props => (props.isSelected ? COLORS.white : COLORS.gray[900])};
  border-radius: 4px;
  border-bottom: ${props =>
    props.isSelected
      ? '2px solid rgba(0, 0, 0, 0.5)'
      : '2px solid rgba(0, 0, 0, 0.1)'};
  cursor: pointer;

  &:active,
  &:focus {
    outline: none;
    background: ${props =>
      props.isSelected
        ? `linear-gradient(10deg, ${COLORS.blue[700]}, ${COLORS.blue[500]})`
        : COLORS.gray[300]};
  }

  &:first-of-type {
    margin-top: 0;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const DependencyName = styled.span`
  font-size: 18px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
`;

const DependencyVersion = styled.span`
  padding-left: 10px;
  font-size: 16px;
  color: ${props =>
    props.isSelected ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
`;

const MainContent = Card.extend`
  flex: 1;
  margin-left: 15px;
  padding: 0;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependencyManagementPane);
