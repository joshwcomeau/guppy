// @flow
import { PureComponent } from 'react';

class ScrollDisabler extends PureComponent<{}> {
  oldOverflow: string;
  oldPosition: string;
  oldWidth: string;
  oldHeight: string;
  oldTop: string;
  oldScrollY: string;

  componentDidMount() {
    if (document.body === null) {
      // that can't happen but let's make flow happy
      return;
    }
    this.oldOverflow = document.body.style.overflow;
    this.oldPosition = document.body.style.position;
    this.oldWidth = document.body.style.width;
    this.oldHeight = document.body.style.height;
    this.oldTop = document.body.style.top;

    this.oldScrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = `calc(100% + ${this.oldScrollY}px)`;
    document.body.style.top = `-${this.oldScrollY}px`;
  }

  componentWillUnmount() {
    if (document.body === null) {
      // that can't happen but let's make flow happy
      return;
    }
    document.body.style.overflow = this.oldOverflow;
    document.body.style.position = this.oldPosition;
    document.body.style.width = this.oldWidth;
    document.body.style.height = this.oldHeight;
    document.body.style.top = this.oldTop;

    window.scrollTo(0, this.oldScrollY);
  }

  render() {
    return null;
  }
}

export default ScrollDisabler;
