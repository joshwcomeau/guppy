/**
 * Utility component that reports on the available width of the parent
 * container. Helpful when you absolutely need to provide a pixel value for
 * something that lives within a container without one.
 */
// @flow

import React, { Component } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type Props = {
  children: (width: number) => React$Node,
};

type State = {
  width?: number,
};

class AvailableWidth extends Component<Props, State> {
  state = {};

  containerElem: ?HTMLElement;
  observer: ResizeObserver;

  componentDidMount() {
    const { containerElem } = this;

    // We ought to always have the element, but Flow doesn't believe me.
    if (!containerElem) {
      return;
    }

    // Set the width based on the DOM size on-mount.
    // This is necessary because the 'autofiring' behaviour of ResizeObserver
    // appears to be inconsistent on mobile.
    const { width } = containerElem.getBoundingClientRect();
    this.setState({ width });

    // We want to be notified of any changes to the size of this element.
    // Enter 'ResizeObserver'!
    // Using a polyfill atm since it's only in Chrome 65+. Polyfill's only
    // 2.4kb though, so I don't feel the need to import() it.
    // Also, this will also report on mount, which'll set the initial value.
    this.observer = new ResizeObserver(([entry]) => {
      const observedWidth = entry.contentRect.width;

      // This observer fires on mount, even though the size hasn't changed.
      // Ignore this case.
      if (observedWidth === this.state.width) {
        return;
      }

      this.setState({ width: observedWidth });
    });

    this.observer.observe(containerElem);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    const { width } = this.state;
    const { children } = this.props;

    return (
      <div ref={elem => (this.containerElem = elem)}>
        {/*
          For the very first render, `width` will be undefined; this data is
          only collected _after_ mount. So, a frame needs to pass with the
          container being empty. Immediately after we collect the width and
          re-render, invoking the children function.
        */}
        {width !== undefined && children(width)}
      </div>
    );
  }
}

export default AvailableWidth;
