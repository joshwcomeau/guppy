// @flow
import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { check, settings } from 'react-icons-kit/feather';

import reactIconSrc from '../../assets/images/react-icon.svg';
import Showcase from '../Showcase';
import Button from '../Button';
import ProgressBar from './ProgressBar';
import { COLORS } from '../../constants';

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
    return this.props.children({
      progress: this.state.progress,
      updateProgress: this.updateProgress,
    });
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
          {({ progress, updateProgress }) => (
            <Fragment>
              <ProgressBar progress={progress} />
              <br />
              <Button size="small" onClick={updateProgress}>
                Generate new value
              </Button>
            </Fragment>
          )}
        </ProgressManager>
      </Showcase>
      <Showcase label="Dynamic (tighter)">
        <ProgressManager>
          {({ progress, updateProgress }) => (
            <Fragment>
              <ProgressBar progress={progress} stiffness={170} damping={16} />
              <br />
              <Button size="small" onClick={updateProgress}>
                Generate new value
              </Button>
            </Fragment>
          )}
        </ProgressManager>
      </Showcase>
      <Showcase label="Dynamic (tall + rainbow)">
        <ProgressManager>
          {({ progress, updateProgress }) => (
            <Fragment>
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
              <br />
              <Button size="small" onClick={updateProgress}>
                Generate new value
              </Button>
            </Fragment>
          )}
        </ProgressManager>
      </Showcase>
    </Fragment>
  ))
);
