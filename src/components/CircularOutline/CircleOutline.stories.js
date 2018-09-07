// @flow
import React, { Fragment, Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import Button from '../Button';

type Props = { children: (data: any) => React$Node };
type State = { copyIndex: number };

const BUTTON_COPY = [
  'hello',
  'hello world',
  '!',
  'Wow this is so long why is it so long ahhhhhhhhhhhh',
];
class CopyManager extends Component<Props, State> {
  state = {
    copyIndex: 0,
  };

  cycleCopy = () => {
    // This line means we always get a value between 0-3:
    const nextCopyIndex = (this.state.copyIndex + 1) % BUTTON_COPY.length;

    this.setState({ copyIndex: nextCopyIndex });
  };

  render() {
    const { children } = this.props;
    const { copyIndex } = this.state;

    const copy = BUTTON_COPY[copyIndex];

    return (
      <Fragment>
        <button onClick={this.cycleCopy}>Change Size</button>
        <br />
        <br />
        {children(copy)}
      </Fragment>
    );
  }
}

storiesOf('CircleOutline', module).add(
  'dynamicSizing',
  withInfo()(() => (
    <Fragment>
      <Showcase label="Dynamic Sizing">
        <CopyManager>{copy => <Button type="fill">{copy}</Button>}</CopyManager>
      </Showcase>
    </Fragment>
  ))
);
