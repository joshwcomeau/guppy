// @flow
import React, { PureComponent } from 'react';
import IconBase from 'react-icons-kit';
import { ic_eject as ejectIcon } from 'react-icons-kit/md/ic_eject';

import { COLORS } from '../../constants';

import BigClickableButton from '../BigClickableButton';

type Props = {
  width: number,
  height: number,
  isRunning: boolean,
  onClick: () => void,
};

class EjectButton extends PureComponent<Props> {
  render() {
    const { width, height, isRunning, onClick } = this.props;

    return (
      <BigClickableButton
        width={40}
        height={34}
        colors={[COLORS.purple[500], COLORS.blue[700]]}
        isOn={isRunning}
        onClick={onClick}
      >
        <IconBase size={24} icon={ejectIcon} />
      </BigClickableButton>
    );
  }
}

export default EjectButton;
