// @flow
/**
 * Utility component that delays rendering its children, to prevent against
 * "quick flashes".
 *
 * Used in the Onboarding Wizard to prevent the SummaryPane from updating
 * when the user clicks the "randomize" button (clicking on the button blurs
 * focus from the Project Name field, but then it immediately resets it. Without
 * the debounce, it causes the Project Name summary to flash)
 */
import { Component } from 'react';

type Props = {
  on: any,
  duration: number,
  children: React$Node,
};

type State = {
  props: any,
  children?: React$Node,
};

class Debounced extends Component<Props, State> {
  static defaultProps = {
    duration: 100,
  };

  state = { props: this.props };

  timeoutId: ?number;

  componentWillReceiveProps(nextProps: Props) {
    const { duration } = this.props;

    window.clearTimeout(this.timeoutId);

    this.timeoutId = window.setTimeout(() => {
      this.setState({ props: nextProps });
    }, duration);
  }

  shouldComponentUpdate(prevProps: Props, prevState: State) {
    return this.props !== this.state.props;
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  }

  render() {
    return this.props.children;
  }
}

export default Debounced;
