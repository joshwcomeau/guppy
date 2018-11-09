// @flow
import React, { PureComponent } from 'react';

type Props = {
  changeKey: any,
  duration: number,
  children: React$Node,
};

type State = {
  children: React$Node,
};

class FadeOnChange extends PureComponent<Props, State> {
  static defaultProps = {
    duration: 300,
  };

  childElem: ?HTMLElement;
  state = {
    children: this.props.children,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.changeKey !== nextProps.changeKey) {
      // This is a pretty gross sequence of events.
      // TODO: Should probably use component state to sequence this, so that
      // it can be interruptible.
      //
      // We can't simply render the props, because then the text will change
      // RIGHT AWAY, before it even starts fading away. So instead we render
      // the state.children, and only do that swap when it's invisible.
      // This sequence of events is required to ensure that the swap happens at
      // the right time, and the animation works.
      requestAnimationFramePromise()
        .then(() => {
          if (this.childElem) {
            this.childElem.style.opacity = '0';
          }
        })
        .then(() => setTimeoutPromise(this.props.duration))
        .then(() => this.setStatePromise({ children: this.props.children }))
        .then(() => {
          if (this.childElem) {
            this.childElem.style.opacity = '1';
          }
        })
        .catch(() => {
          // Swallow errors. The most likely error here is that the component
          // unmounted during the delay between fades. This isn't a big deal.
          //
          // At any rate, this is just a presentational thing with no network
          // side effects, so it's safe to ignore whatever it wants to complain
          // about.
        });
    }
  }

  setStatePromise = (newState: State) =>
    new Promise<void>(resolve => this.setState(newState, resolve));

  render() {
    const { duration } = this.props;

    const transition = `opacity ${duration}ms`;

    return (
      <div
        style={{ transition, transitionTimingFunction: 'linear' }}
        ref={elem => {
          this.childElem = elem;
        }}
      >
        {this.state.children}
      </div>
    );
  }
}

function requestAnimationFramePromise() {
  return new Promise(resolve => window.requestAnimationFrame(resolve));
}

function setTimeoutPromise(duration: number) {
  return new Promise(resolve => window.setTimeout(resolve, duration));
}

export default FadeOnChange;
