// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';

// import { COLORS } from '../../constants';

import TextInputWithButton from '../../TextInputWithButton';

import * as actions from '../../../actions';
import type { Dispatch } from '../../../actions/types';

type State = {
  gatsbyStarter: string,
};

type Props = {
  projectStarter: string,
  isFocused: boolean,
  onSelect: string => void,
  onFocus: () => void,
  showStarterSelection: Dispatch<typeof actions.showStarterSelectionModal>,
};

class ProjectStarter extends PureComponent<Props, State> {
  state = {
    gatsbyStarter: '',
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return {
      gatsbyStarter: nextProps.projectStarter,
    };
  }

  // Change method needed so we can dismiss the selection on close click of toastr
  changeGatsbyStarter = (selectedStarter: string) => {
    console.log('change starter', selectedStarter, this);
    this.setState(
      {
        gatsbyStarter: selectedStarter,
      },
      () => {
        console.log('updated', this.state);
      }
    );
  };

  handleSelect = () => {
    this.props.onSelect(this.state.gatsbyStarter);

    // clear temporary state value
    // this.setState({
    //   gatsbyStarter: '',
    // });
  };

  render() {
    const {
      projectStarter,
      isFocused,
      onSelect,
      showStarterSelection,
    } = this.props;

    return (
      <TextInputWithButton
        isFocused={isFocused}
        value={projectStarter}
        onChange={onSelect}
        onClick={showStarterSelection}
      />
    );
  }
}
const mapDispatchToProps = {
  showStarterSelection: actions.showStarterSelectionModal,
};

export default connect(
  null,
  mapDispatchToProps
)(ProjectStarter);
