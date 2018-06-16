// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { importExistingProjectStart } from '../../actions';

import TextButton from '../TextButton';

const { dialog } = window.require('electron').remote;

type Props = {
  color: string,
  children: React$Node,
  importExistingProjectStart: (path: string) => any,
};

class ImportProjectButton extends Component<Props> {
  handleImportExisting = () => {
    const { importExistingProjectStart } = this.props;

    dialog.showOpenDialog(
      {
        message: 'Select the directory of an existing React app',
        properties: ['openDirectory'],
      },
      paths => {
        // The user might cancel out without selecting a directory.
        // In that case, do nothing.
        if (!paths) {
          return;
        }

        // Only a single path should be selected
        const [path] = paths;

        importExistingProjectStart(path);
      }
    );
  };

  render() {
    const { color, children } = this.props;

    return (
      <TextButton style={{ color }} onClick={this.handleImportExisting}>
        {children}
      </TextButton>
    );
  }
}

export default connect(
  null,
  { importExistingProjectStart }
)(ImportProjectButton);
