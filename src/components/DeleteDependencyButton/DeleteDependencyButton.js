// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';

import * as actions from '../../actions';
import { COLORS } from '../../constants';

import Button from '../Button';
import Spinner from '../Spinner';
import PixelShifter from '../PixelShifter';

const { dialog } = remote;

type Props = {
  projectId: string,
  dependencyName: string,
  isBeingDeleted?: boolean,
  // From redux:
  deleteDependency: (projectId: string, dependencyName: string) => any,
};

// TODO: Wouldn't it be neat if it parsed your project to see if it was being
// required or imported anywhere, and warned you if you were about to delete
// an actively-used dependency?
class DeleteDependencyButton extends PureComponent<Props> {
  handleClick = () => {
    const { projectId, dependencyName, deleteDependency } = this.props;

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
    const { isBeingDeleted } = this.props;
    return (
      <Button
        size="small"
        type="fill"
        color1={COLORS.pink[300]}
        color2={COLORS.red[500]}
        onClick={this.handleClick}
        style={{ width: 75 }}
      >
        {isBeingDeleted ? (
          <PixelShifter
            y={2}
            reason="visually center the spinner within the button"
          >
            <Spinner size={18} color={COLORS.white} />
          </PixelShifter>
        ) : (
          'Delete'
        )}
      </Button>
    );
  }
}

export default connect(
  null,
  { deleteDependency: actions.deleteDependency }
)(DeleteDependencyButton);
