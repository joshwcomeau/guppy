// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';

import * as actions from '../../actions';
import { COLORS, GRADIENTS } from '../../constants';

import { FillButton } from '../Button';
import Spinner from '../Spinner';
import PixelShifter from '../PixelShifter';

import type { Dispatch } from '../../actions/types';

const { dialog } = remote;

const DEPENDENCY_DELETE_COPY = {
  idle: 'Delete',
  'queued-delete': 'Queued for Delete…',
};

type Props = {
  projectId: string,
  dependencyName: string,
  dependencyStatus: string,
  // From redux:
  deleteDependency: Dispatch<typeof actions.deleteDependency>,
};

// TODO: Wouldn't it be neat if it parsed your project to see if it was being
// required or imported anywhere, and warned you if you were about to delete
// an actively-used dependency?
class DeleteDependencyButton extends PureComponent<Props> {
  handleClick = () => {
    const {
      projectId,
      dependencyName,
      deleteDependency,
      dependencyStatus,
    } = this.props;

    // if the dependency is currently changing/queued for change,
    // this button shouldn't do anything
    if (dependencyStatus !== 'idle') return;

    dialog.showMessageBox(
      {
        type: 'warning',
        buttons: ['Yeah', 'Nope'],
        defaultId: 1,
        cancelId: 1,
        title: 'Are you sure?',
        message: 'Are you sure you want to delete this dependency?',
      },
      (response: number) => {
        // The response will be the index of the chosen option, from the
        // `buttons` array above.
        const isConfirmed = response === 0;

        if (isConfirmed) {
          deleteDependency(projectId, dependencyName);
        }
      }
    );
  };

  render() {
    const { dependencyStatus } = this.props;

    return (
      <FillButton
        size="small"
        colors={GRADIENTS.error}
        onClick={this.handleClick}
      >
        {dependencyStatus === 'deleting' ? (
          <PixelShifter
            y={2}
            reason="visually center the spinner within the button"
          >
            <Spinner size={18} color={COLORS.textOnBackground} />
          </PixelShifter>
        ) : (
          DEPENDENCY_DELETE_COPY[dependencyStatus]
        )}
      </FillButton>
    );
  }
}

export default connect(
  null,
  { deleteDependency: actions.deleteDependency }
)(DeleteDependencyButton);
