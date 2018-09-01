// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import Resizer from './Resizer';

type PanelWidths = { [id: string]: number };

type Props = {
  width: number,
  style: Object,
  children: React$Node,
};

type State = {
  panelWidths: ?PanelWidths,
};

class HorizontalPanels extends Component<Props, State> {
  node: HTMLElement;
  parentBox: ClientRect;
  startClientX: ?number;
  startClientY: ?number;
  startPanelFlexMap: FlexMap;
  resizerIndex: ?number;

  static defaultProps = {
    style: {},
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const isFirstRender = !state;

    if (isFirstRender) {
      return { panelWidths: HorizontalPanels.calculateInitialSizes(props) };
    }

    // This can happen when the actual number of childen changes (say, if
    // a panel is toggled off, or a new one is added). We want to recalculate
    // the flex values, to normalize them.

    /**
     * TODO:
     * We need to iterate through the children, get the ID, and look up
     * the ID in our state. Need to change the state from an array to a map.
     */

    // const totalFlex = sum(
    //   childrenArray.map(child => state.panelWidths[child.props.id])
    // );

    // const panelWidths = childrenArray.reduce((acc, child) => {
    //   // Normalize the flex from 0-100, using cross-multiplication.
    //   //
    //   //    flex            newFlex
    //   // -----------   =   ---------
    //   //  totalFlex           100
    //   //
    //   const normalizedFlex =
    //     (state.panelWidths[child.props.id] * 100) / totalFlex;

    //   return {
    //     ...acc,
    //     [child.props.id]: normalizedFlex,
    //   };
    // }, {});

    // return { panelWidths };
  }

  static calculateInitialSizes = ({ width, children }) => {
    const childrenArray = React.Children.toArray(children);

    // TODO: vertical
    const childrenWithSpecifiedSize = childrenArray.filter(
      child => typeof child.props.initialWidth === 'number'
    );
    const childrenWithoutSpecifiedSize = childrenArray.filter(
      child => typeof child.props.initialWidth === 'undefined'
    );

    const totalClaimedSpace = childrenWithSpecifiedSize.reduce(
      (acc, child) => acc + child.props.initialWidth,
      0
    );

    const widthPerUnspecifiedChildren =
      (width - totalClaimedSpace) / childrenWithoutSpecifiedSize.length;

    return childrenArray.reduce((panelWidths, child) => {
      const { id, initialWidth } = child.props;

      if (typeof initialWidth === 'number') {
        return {
          ...panelWidths,
          [id]: initialWidth,
        };
      }

      return {
        ...panelWidths,
        [id]: widthPerUnspecifiedChildren,
      };
    }, {});
  };

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragResize);
    document.removeEventListener('mouseup', this.endResize);
  }

  startResize = (ev: any, resizerIndex: number) => {
    document.addEventListener('mousemove', this.dragResize);
    document.addEventListener('mouseup', this.endResize);

    // TODO: Clean these up, make them all part of 1 property, Flow-tracked
    this.startClientX = ev.clientX;
    this.startClientY = ev.clientY;
    this.startPanelFlexMap = { ...this.state.panelWidths };

    this.resizerIndex = resizerIndex;
  };

  dragResize = (ev: any) => {
    const {
      startClientX,
      startClientY,
      startPanelFlexMap,
      resizerIndex,
    } = this;
    const { width } = this.props;

    // Impossible conditions for Flow
    if (
      typeof startClientX !== 'number' ||
      typeof startClientY !== 'number' ||
      typeof resizerIndex !== 'number'
    ) {
      console.error('Missing required variables to do panel resizing', this);
      return;
    }

    // We need to convert the window coordinates to the relative positions
    // within this box.
    // Start by getting the raw window coordinates
    const { clientX } = ev;

    const { panelWidths } = this.state;

    const panelIds = Object.keys(panelWidths);

    // Check and see if this change would push us below our min-width
    const childrenArray = React.Children.toArray(this.props.children);

    let delta = startClientX - clientX;

    const firstAffectedPanelId = panelIds[resizerIndex];
    const secondAffectedPanelId = panelIds[resizerIndex + 1];

    const firstAffectedPanel = childrenArray.find(
      child => child.props.id === firstAffectedPanelId
    );
    const secondAffectedPanel = childrenArray.find(
      child => child.props.id === secondAffectedPanelId
    );

    if (!firstAffectedPanel || !secondAffectedPanel) {
      return;
    }

    const firstAffectedPanelMinWidth = firstAffectedPanel.props.style.minWidth;
    const firstAffectedPanelMaxWidth = firstAffectedPanel.props.style.maxWidth;

    const prospectiveFirstPanelWidth =
      startPanelFlexMap[firstAffectedPanelId] - delta;

    if (prospectiveFirstPanelWidth < firstAffectedPanelMinWidth) {
      const overshotBy =
        firstAffectedPanelMinWidth - prospectiveFirstPanelWidth;

      delta -= overshotBy;
    }

    if (prospectiveFirstPanelWidth > firstAffectedPanelMaxWidth) {
      const overshotBy =
        prospectiveFirstPanelWidth - firstAffectedPanelMaxWidth;

      delta += overshotBy;
    }

    const nextPanelWidths = {
      ...panelWidths,
      [firstAffectedPanelId]: startPanelFlexMap[firstAffectedPanelId] - delta,
      [secondAffectedPanelId]: startPanelFlexMap[secondAffectedPanelId] + delta,
    };

    this.setState({
      panelWidths: nextPanelWidths,
    });
  };

  endResize = (ev: any) => {
    ev.preventDefault();

    document.removeEventListener('mouseup', this.endResize);
    document.removeEventListener('mousemove', this.dragResize);
  };

  render() {
    const { width, children, style, ...delegated } = this.props;
    const { panelWidths } = this.state;

    console.log(panelWidths.dependencies);

    const childrenArray = React.Children.toArray(children).filter(
      child => child
    );

    // Interleave components with Resizer elements
    const interleavedChildren =
      this.state &&
      childrenArray.map(
        (child, index) =>
          index === childrenArray.length - 1
            ? React.cloneElement(child, {
                width: Math.round(panelWidths[child.props.id]),
              })
            : [
                React.cloneElement(child, {
                  width: Math.round(panelWidths[child.props.id]),
                }),
                <Resizer
                  key={index}
                  index={index}
                  startResize={this.startResize}
                />,
              ]
      );

    return (
      <Wrapper
        {...delegated}
        style={{ ...style, width }}
        innerRef={node => (this.node = node)}
      >
        {interleavedChildren}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 100%;
  overflow: hidden;
  user-select: none;
`;

export default HorizontalPanels;
