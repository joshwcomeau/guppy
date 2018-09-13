// @flow
import React, { Fragment, Component } from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import Showcase from '../../../.storybook/components/Showcase';
import CircularOutline from './CircularOutline';
import styled from 'styled-components';

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
        <ButtonElem>
          <OutlineWrapper>{children(copy)}</OutlineWrapper>
          {copy}
        </ButtonElem>
      </Fragment>
    );
  }
}

storiesOf('CircularOutline', module).add(
  'dynamicSizing',
  withInfo()(() => (
    <Fragment>
      <Showcase label="Dynamic Sizing">
        <CopyManager>
          {copy => (
            <CircularOutline
              color1={'red'}
              color2={'blue'}
              strokeWidth={2}
              isShown={true}
              animateChanges={true}
            >
              {copy}
            </CircularOutline>
          )}
        </CopyManager>
      </Showcase>
    </Fragment>
  ))
);

const ButtonElem = styled.button`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: none;
  background: none;
  outline: none;
  padding: 0;
  cursor: pointer;

  &:active rect {
    stroke-width: 4;
  }
`;

const OutlineWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  pointer-events: none;
`;
