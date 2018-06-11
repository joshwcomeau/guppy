// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';

import { runTask, abortTask } from '../../actions';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getTaskByProjectIdAndTaskName } from '../../reducers/tasks.reducer';
import { COLORS } from '../../constants';
import HoverableOutlineButton from '../HoverableOutlineButton';

import Module from '../Module';
import Modal from '../Modal';
import AddDependency from '../AddDependency';
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
  selectedDependencyIndex: number,
  addingNewDependency: boolean,
};

class DependencyManagementPane extends PureComponent<Props, State> {
  state = {
    selectedDependencyIndex: 0,
    addingNewDependency: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    // If the user just deleted the last dependency, throw an error
    // TODO: Handle this case
    if (nextProps.project.dependencies.length === 0) {
      throw new Error(
        "Looks like all the dependencies were deleted. Sorry, we aren't set " +
          'up to handle this case yet :('
      );
    }

    // TODO: when a selected dependency is deleted, the focus shifts to the
    // next one in the list. This is great!
    // However, if the user clicks a different dependency while the focused one
    // is being deleted, once the deletion finishes, it shouldn't affect the
    // user's focus.
    // To fix this, we'll need to check to see if one was just deleted (compare
    // length), and then find the index of the current dependency in the new
    // list.

    // TODO: Auto-select newly-added dependencies, by finding the difference
    // between the two lists and setting its index to selected.
  }

  selectDependency = (dependencyName: string) => {
    const index = this.props.project.dependencies.findIndex(
      ({ name }) => name === dependencyName
    );
    this.setState({ selectedDependencyIndex: index });
  };

  openAddNewDependencyModal = () => {
    this.setState({ addingNewDependency: true });
  };

  closeAddNewDependencyModal = () => {
    this.setState({ addingNewDependency: false });
  };

  render() {
    const { id, dependencies } = this.props.project;
    const { selectedDependencyIndex, addingNewDependency } = this.state;

    return (
      <Module title="Dependencies">
        <Wrapper>
          <DependencyList>
            <Dependencies>
              {dependencies.map((dependency, index) => (
                <DependencyButton
                  key={dependency.name}
                  isSelected={selectedDependencyIndex === index}
                  onClick={() => this.selectDependency(dependency.name)}
                >
                  <DependencyName>{dependency.name}</DependencyName>
                  <DependencyVersion
                    isSelected={selectedDependencyIndex === index}
                  >
                    {dependency.version}
                  </DependencyVersion>
                </DependencyButton>
              ))}
            </Dependencies>
            <AddDependencyButton onClick={this.openAddNewDependencyModal}>
              <IconBase icon={plus} size={20} />
              <Spacer size={6} />
              Add New Dependency
            </AddDependencyButton>
          </DependencyList>
          <MainContent>
            <DependencyDetails
              projectId={id}
              dependency={dependencies[selectedDependencyIndex]}
            />
          </MainContent>
        </Wrapper>

        <Modal
          width={620}
          isVisible={addingNewDependency}
          onDismiss={this.closeAddNewDependencyModal}
        >
          <AddDependency />
        </Modal>
      </Module>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  max-height: 475px;
`;

const DependencyList = Card.extend`
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const Dependencies = styled.div`
  flex: 1;
  overflow: auto;
`;

const DependencyButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  margin: 8px 0px;
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

  &:hover {
    outline: none;
    background: ${props =>
      props.isSelected
        ? `linear-gradient(10deg, ${COLORS.blue[700]}, ${COLORS.blue[500]})`
        : COLORS.gray[200]};
  }

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

const AddDependencyButton = styled.button`
  width: 100%;
  padding: 8px 10px;
  margin-top: 10px;
  border: 2px dashed ${COLORS.gray[300]};
  border-radius: 6px;
  color: ${COLORS.gray[500]};
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  cursor: pointer;

  &:hover {
    border: 2px dashed ${COLORS.gray[400]};
    color: ${COLORS.gray[600]};
  }
`;

const DependencyName = styled.span`
  font-size: 18px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  overflow: auto;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependencyManagementPane);
