// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import TextInputWithButton from '../../TextInputWithButton';

import * as actions from '../../../actions';
import type { Dispatch } from '../../../actions/types';

type State = {
  gatsbyStarter: string,
};

type Props = {
  projectStarter: string,
  isFocused: boolean,
  handleFocus: string => void,
  onSelect: string => void,
  onFocus: () => void,
  showStarterSelection: Dispatch<typeof actions.showStarterSelectionModal>,
};

class ProjectStarter extends PureComponent<Props, State> {
  // state = {
  //   gatsbyStarter: '',
  // };

  // static getDerivedStateFromProps(nextProps: Props, prevState: State) {
  //   return {
  //     gatsbyStarter: nextProps.projectStarter,
  //   };
  // }

  // Change method needed so we can dismiss the selection on close click of toastr
  // changeGatsbyStarter = (selectedStarter: string) => {
  //   this.setState({
  //     gatsbyStarter: selectedStarter,
  //   });
  // };

  // handleSelect = () => {
  //   this.props.onSelect(this.state.gatsbyStarter);
  // };

  render() {
    const {
      handleFocus,
      projectStarter,
      isFocused,
      onSelect,
      showStarterSelection,
    } = this.props;

    return (
      <TextInputWithButton
        handleFocus={handleFocus}
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
