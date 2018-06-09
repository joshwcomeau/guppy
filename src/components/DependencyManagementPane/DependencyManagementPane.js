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
          </DependencyList>
          <CardWrapper>
            <MainContent>
              {selectedDependency ? (
                <PixelShifter y={-8}>
                  <DependencyDetails dependency={selectedDependency} />
                </PixelShifter>
              ) : (
                'TODO: Add something here'
              )}
            </MainContent>
          </CardWrapper>
        </Wrapper>
      </Module>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
`;

const CardWrapper = Card.extend`
  /* display: flex; */
  flex: 1;
  margin-left: 12px;
`;

const DependencyList = styled.div`
  width: 220px;
  /* background: ${COLORS.gray[100]};
  border-radius: 4px;
  padding: 4px 10px;
  margin: 4px; */
`;

const DependencyButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 14px;
  margin: 12px 0px;
  border: none;
  background: ${props =>
    props.isSelected
      ? `linear-gradient(10deg, ${COLORS.purple[700]}, ${COLORS.blue[700]})`
      : COLORS.white};
  color: ${props => (props.isSelected ? COLORS.white : COLORS.gray[900])};
  border-radius: 8px;
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);

  &:active,
  &:focus {
    outline: none;
    background: ${props =>
      props.isSelected
        ? `linear-gradient(10deg, ${COLORS.purple[700]}, ${COLORS.blue[700]})`
        : COLORS.gray[200]};
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

const MainContent = styled.div`
  flex: 1;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependencyManagementPane);
