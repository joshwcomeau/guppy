// @flow
import React, { Fragment, Component } from 'react';
import { StrokeButton } from '../../../components/Button';

type Props = { children: (data: any) => React$Node };
type State = { progress: number };

// This component is currently only being used with Docz
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

export default ProgressManager;
