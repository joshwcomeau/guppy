// @flow
import React, { Fragment, Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import { COLORS } from '../../constants';

import Showcase from '../../../.storybook/components/Showcase';
import { StrokeButton } from '../Button';
import ProgressBar from './ProgressBar';

type Props = { children: (data: any) => React$Node };
type State = { progress: number };

class ProgressManager extends Component<Props, State> {
  state = {
    progress: 0.5,
  };

  updateProgress = () => {
    const { progress } = this.state;

    const nextProgress = progress === 1 ? 0 : progress + 0.25;

    this.setState({ progress: nextProgress });
  };

  render() {
    const { children } = this.props;
    const { progress } = this.state;

    return (
      <Fragment>
        {children({
          progress,
          updateProgress: this.updateProgress,
        })}
        <br />
        <StrokeButton size="small" onClick={this.updateProgress}>
          Generate new value
        </StrokeButton>
      </Fragment>
    );
  }
}

storiesOf('ProgressBar', module).add(
  'default',
  withInfo()(() => (
    <Fragment>
      <Showcase label="Empty">
        <ProgressBar progress={0} />
      </Showcase>

      <Showcase label="Half full">
        <ProgressBar progress={0.5} />
      </Showcase>

      <Showcase label="Full">
        <ProgressBar progress={1} />
      </Showcase>

      <Showcase label="Dynamic">
        <ProgressManager>
          {({ progress }) => <ProgressBar progress={progress} />}
        </ProgressManager>
      </Showcase>

      <Showcase label="Dynamic (tighter)">
        <ProgressManager>
          {({ progress }) => (
            <ProgressBar progress={progress} stiffness={170} damping={16} />
          )}
        </ProgressManager>
      </Showcase>

      <Showcase label="Dynamic (tall + rainbow)">
        <ProgressManager>
          {({ progress }) => (
            <ProgressBar
              height={16}
              progress={progress}
              colors={[
                COLORS.red[500],
                COLORS.orange[500],
                COLORS.lime[500],
                COLORS.teal[500],
                COLORS.blue[700],
                COLORS.purple[500],
              ]}
            />
          )}
        </ProgressManager>
      </Showcase>
    </Fragment>
  ))
);
