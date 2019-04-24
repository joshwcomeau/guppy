// @flow
import React, { PureComponent } from 'react';
import IconBase from 'react-icons-kit';
import { ic_eject as ejectIcon } from 'react-icons-kit/md/ic_eject';
import { remote } from 'electron';

import BigClickableButton from '../BigClickableButton';

const { dialog } = remote;

type Props = {
  width: number,
  height: number,
  isRunning: boolean,
  onClick: () => void,
};

export const dialogOptions = {
  type: 'warning',
  buttons: ['Yes, light this candle', "Ahhh no don't do that"],
  defaultId: 1,
  cancelId: 1,
  title: 'Are you sure?',
  message:
    'Ejecting is a permanent one-time task that unwraps the create-react-app environment.',
  detail:
    "It's recommended for users comfortable with Webpack, who need to make tweaks not possible without ejecting.",
};

export function dialogCallback(response: number) {
  // The response will be the index of the chosen option, from the
  // `buttons` array above.
  const isConfirmed = response === 0;

  if (isConfirmed) {
    this.props.onClick();
  }
}

class EjectButton extends PureComponent<Props> {
  render() {
    const { isRunning } = this.props;

    return (
      <BigClickableButton
        width={40}
        height={34}
        isOn={isRunning}
        onClick={() =>
          dialog.showMessageBox(dialogOptions, dialogCallback.bind(this))
        }
      >
        <IconBase size={24} icon={ejectIcon} />
      </BigClickableButton>
    );
  }
}

export default EjectButton;
