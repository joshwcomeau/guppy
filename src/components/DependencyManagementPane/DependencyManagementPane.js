// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { getOnlineState } from '../../reducers/app-status.reducer';
import { RAW_COLORS, COLORS, GUPPY_REPO_URL } from '../../constants';

import Module from '../Module';
import AddDependencyModal from './AddDependencyModal';
import AddDependencySearchProvider from './AddDependencySearchProvider';
import DependencyDetails from './DependencyDetails';
import DependencyInstalling from './DependencyInstalling';
import Card from '../Card';
import Spacer from '../Spacer';
import Spinner from '../Spinner';
import OnlyOn from '../OnlyOn';
import MountAfter from '../MountAfter';

import type { Dependency, Project } from '../../types';

type Props = {
  project: Project,
  isOnline: boolean,
};

type State = {
  selectedDependencyIndex: number,
  addingNewDependency: boolean,
};

export class DependencyManagementPane extends PureComponent<Props, State> {
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

    // If we just added a dependency, select it.
    if (
      nextProps.project.dependencies.length >
      this.props.project.dependencies.length
    ) {
      const newDependencyIndex = nextProps.project.dependencies.findIndex(
        dependency =>
          !this.props.project.dependencies.some(
            existingDependency => existingDependency.name === dependency.name
          )
      );

      this.setState({
        selectedDependencyIndex: newDependencyIndex,
      });
    }

    // If the last dependency was deleted, we need to shift focus to the new last dependency
    // in the list. It's possible that a group of dependencies was deleted from the end of
    // the list as a batch, so check >= and not just ===.
    if (
      this.state.selectedDependencyIndex >=
      nextProps.project.dependencies.length
    ) {
      this.setState({
        selectedDependencyIndex: nextProps.project.dependencies.length - 1,
      });
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
    this.setState({
      selectedDependencyIndex: index,
    });
  };

  openAddNewDependencyModal = () => {
    this.setState({
      addingNewDependency: true,
    });
  };

  closeAddNewDependencyModal = () => {
    this.setState({
      addingNewDependency: false,
    });
  };

  renderListAddon = (dependency: Dependency, isSelected: boolean) => {
    if (
      dependency.status === 'installing' ||
      dependency.status.match(/^queued-/)
    ) {
      return (
        <Spinner
          size={20}
          color={isSelected ? COLORS.textOnBackground : undefined}
        />
      );
    }

    return (
      <DependencyVersion isSelected={isSelected}>
        {dependency.version}
      </DependencyVersion>
    );
  };

  renderMainContents = (
    selectedDependency: Dependency,
    projectId: string,
    isOnline: boolean
  ) => {
    if (
      selectedDependency.status === 'installing' ||
      selectedDependency.status === 'queued-install'
    ) {
      return (
        <DependencyInstalling
          name={selectedDependency.name}
          queued={selectedDependency.status === 'queued-install'}
        />
      );
    }

    return (
      <DependencyDetails
        isOnline={isOnline}
        projectId={projectId}
        dependency={selectedDependency}
      />
    );
  };

  render() {
    const { id, dependencies } = this.props.project;
    const { selectedDependencyIndex, addingNewDependency } = this.state;
    const selectedDependency = dependencies[selectedDependencyIndex];
    const { isOnline } = this.props;
    return (
      <Module
        title="Dependencies"
        moreInfoHref={`${GUPPY_REPO_URL}/blob/master/docs/getting-started.md#dependencies`}
      >
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
                  {this.renderListAddon(
                    dependency,
                    selectedDependencyIndex === index
                  )}
                </DependencyButton>
              ))}
            </Dependencies>
            <MountAfter
              delay={1000}
              reason={`
                A _really weird_ Chrome bug means that for a brief moment
                during initial mount, a large grey rectangle shows up on the
                screen.

                I traced it back to AddDependencyButton, and the fact that it
                has a "dashed" border. If I change that border to "solid", it
                fixes the bug o_O

                For reasons unknown, if I delay the rendering of this component,
                the bug is fixed. And because this component isn't needed
                immediately, that's ok!

                See the bug in action: https://imgur.com/a/SanrY61
              `}
            >
              <AddDependencyButton
                isOnline={this.props.isOnline}
                onClick={this.openAddNewDependencyModal}
              >
                <IconBase icon={plus} size={20} />
                <Spacer size={6} />
                Add New
                <OnlyOn
                  size="mdMin"
                  style={{
                    paddingLeft: 3,
                  }}
                >
                  Dependency
                </OnlyOn>
              </AddDependencyButton>
            </MountAfter>
          </DependencyList>
          <MainContent>
            {this.renderMainContents(selectedDependency, id, isOnline)}
          </MainContent>
        </Wrapper>
        <AddDependencySearchProvider>
          <AddDependencyModal
            isVisible={addingNewDependency}
            onDismiss={this.closeAddNewDependencyModal}
          />
        </AddDependencySearchProvider>
      </Module>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  max-height: 475px;
`;

export const DependencyList = Card.extend`
  flex: 6;
  display: flex;
  flex-direction: column;
`;

export const Dependencies = styled.div`
  overflow: auto;
  /*
    flex-shrink is needed to ensure that the list doesn't clobber the
    "Add New Dependency" button below.
  */
  flex-shrink: 8;
`;

export const DependencyButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  margin: 8px 0px;
  border: none;
  background: ${props =>
    props.isSelected
      ? `linear-gradient(10deg, ${RAW_COLORS.blue[700]}, ${
          RAW_COLORS.blue[500]
        })`
      : RAW_COLORS.gray[100]};
  color: ${props => (props.isSelected ? COLORS.textOnBackground : COLORS.text)};
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
        ? `linear-gradient(10deg, ${RAW_COLORS.blue[700]}, ${
            RAW_COLORS.blue[500]
          })`
        : RAW_COLORS.gray[200]};
  }

  &:active,
  &:focus {
    outline: none;
    background: ${props =>
      props.isSelected
        ? `linear-gradient(10deg, ${RAW_COLORS.blue[700]}, ${
            RAW_COLORS.blue[500]
          })`
        : RAW_COLORS.gray[300]};
  }

  &:first-of-type {
    margin-top: 0;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const AddDependencyButton = styled.button`
  width: 100%;
  height: 42px;
  padding: 8px 10px;
  margin-top: 10px;
  border: 2px dashed ${RAW_COLORS.gray[300]};
  border-radius: 6px;
  color: ${RAW_COLORS.gray[500]};
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  cursor: pointer;
  opacity: ${props => (props.isOnline ? 1 : 0.5)};
  pointer-events: ${props => (props.isOnline ? 'auto' : 'none')};
  &:hover {
    border: 2px dashed ${RAW_COLORS.gray[400]};
    color: ${COLORS.text};
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
    props.isSelected
      ? RAW_COLORS.transparentWhite[400]
      : RAW_COLORS.transparentBlack[400]}};
`;

export const MainContent = Card.extend`
  flex: 12;
  margin-left: 15px;
  padding: 0;
  overflow: auto;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
  isOnline: getOnlineState(state),
});

export default connect(mapStateToProps)(DependencyManagementPane);
