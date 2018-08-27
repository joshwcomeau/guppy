// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { sum } from '../../utils';

const Resizer = ({ between, startResize }) => (
  <div
    style={{ width: 5, background: '#AAA' }}
    onMouseDown={ev => startResize(ev, ...between)}
  />
);

type Props = {
  orientation: 'horizontal' | 'vertical',
  children: React$Node,
};

type State = {
  panelFlexList: Array<number>,
};

const getLocalCoordinates = (parentBox, clientX, clientY) => {};

class Workspace extends Component<Props, State> {
  node: HTMLElement;
  parentBox: ClientRect;

  constructor(props: Props) {
    super(props);

    const childrenArray = React.Children.toArray(props.children);

    const initialFlexValues = childrenArray.map(
      child => child.props.initialFlex
    );

    const totalFlex = sum(initialFlexValues);

    const panelFlexList = childrenArray.map(child => child.props.initialFlex);

    this.state = { panelFlexList };
  }

  componentDidMount() {
    this.parentBox = this.node.getBoundingClientRect();
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragResize);
    document.removeEventListener('mouseup', this.endResize);
  }

  startResize = (ev: any, first: number, second: number) => {
    document.addEventListener('mousemove', this.dragResize);
    document.addEventListener('mouseup', this.endResize);

    this.startClientX = ev.clientX;
    this.startClientY = ev.clientY;

    this.resizerIndex = first;
    this.snapshot = [...this.state.panelFlexList];
  };

  dragResize = (ev: any) => {
    // We need to convert the window coordinates to the relative positions
    // within this box.
    // Start by getting the raw window coordinates
    const { clientX, clientY } = ev;
    // Get them relative to the box they're in
    const relativeX = clientX - this.parentBox.left;
    const relativeY = clientY - this.parentBox.top;

    // TODO: Generalize for vertical
    // Convert them to work in the Flex system we've defined.
    // This is cross-multiplication, solving for Y:
    //
    //     clientX               X
    //  -------------   = -------------
    //   parentWidth        totalFlex
    //
    const totalFlex = sum(this.state.panelFlexList);

    // Get the flex for all the space left of the cursor:
    //  ___________________________________
    // |        |                |        |
    // |        |                |        |
    // |        |                |        |
    // |________|________________|________|
    //                           ^ Cursor
    // <------------------------>
    //    newProportionOfSpace
    //
    const newProportionOfSpace = (relativeX * totalFlex) / this.parentBox.width;

    // Now, get the actual flex for the left-hand element
    //  ___________________________________
    // |        |                |        |
    // |        |                |        |
    // |        |                |        |
    // |________|________________|________|
    //                           ^ Cursor
    //          <--------------->
    //               newFlex
    //
    const sumOfEarlierFlex = sum(
      this.state.panelFlexList.filter((_, i) => i < this.resizerIndex)
    );
    const newFlex = newProportionOfSpace - sumOfEarlierFlex;

    const difference = newFlex - this.state.panelFlexList[this.resizerIndex];

    const regionalFlexTotal = sum([
      this.state.panelFlexList[this.resizerIndex],
      this.state.panelFlexList[this.resizerIndex + 1],
    ]);

    const nextPanelFlexList = this.state.panelFlexList.map((flex, index) => {
      if (index === this.resizerIndex) {
        return newFlex;
      }
      return flex;
    });

    // console.log(this.state.panelFlexList, nextPanelFlexList);

    this.setState({
      panelFlexList: nextPanelFlexList,
    });
  };

  endResize = (ev: any) => {
    ev.preventDefault();

    document.removeEventListener('mouseup', this.endResize);
    document.removeEventListener('mousemove', this.dragResize);
  };

  render() {
    const { orientation, children, ...delegated } = this.props;
    const { panelFlexList } = this.state;

    const childrenArray = React.Children.toArray(children);

    // Interleave components with Resizer elements
    const numOfChildren = React.Children.count(children);
    const interleavedChildren = childrenArray.map(
      (child, index) =>
        index === numOfChildren - 1
          ? React.cloneElement(child, { flex: panelFlexList[index] })
          : [
              React.cloneElement(child, { flex: panelFlexList[index] }),
              <Resizer
                key={index}
                between={[index, index + 1]}
                startResize={this.startResize}
              />,
            ]
    );

    return (
      <Wrapper
        {...delegated}
        innerRef={node => (this.node = node)}
        orientation={orientation}
      >
        {interleavedChildren}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: ${props =>
    props.orientation === 'horizontal' ? 'row' : 'column'};
  flex: 1;
  height: 100%;
`;

export default Workspace;
