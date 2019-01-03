// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import TextButton from '../TextButton';

import type { Dispatch } from '../../actions/types';

type Props = {
  color: string,
  children: React$Node,
  showImportExistingProjectPrompt: Dispatch<
    typeof actions.showImportExistingProjectPrompt
  >,
};

class ImportProjectButton extends Component<Props> {
  render() {
    const { color, children, showImportExistingProjectPrompt } = this.props;

    return (
      <TextButton style={{ color }} onClick={showImportExistingProjectPrompt}>
        {children}
      </TextButton>
    );
  }
}

export default connect(
  null,
  { showImportExistingProjectPrompt: actions.showImportExistingProjectPrompt }
)(ImportProjectButton);
