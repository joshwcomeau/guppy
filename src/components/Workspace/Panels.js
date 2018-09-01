// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import Resizer from './Resizer';

// TODO: this should be a prop!
const RESIZER_WIDTH = 5;

type PanelWidths = { [id: string]: number };

type Props = {
  size: number,
  orientation: 'horizontal' | 'vertical',
  style: Object,
  children: React$Node,
};

type State = {
  panelWidths: PanelWidths,
};

class HorizontalPanels extends Component<Props, State> {
  node: HTMLElement;
  parentBox: ClientRect;
  startClientX: ?number;
  startClientY: ?number;
  startPanelWidths: PanelWidths;
  resizerIndex: ?number;

  static defaultProps = {
    style: {},
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const isFirstRender = !state;

    if (isFirstRender) {
      return { panelWidths: HorizontalPanels.calculateInitialSizes(props) };
    }

    // If new panels are introduced, it's not really clear what should happen.
    // For now, we're just having it split up the right-most panel
    const panelIds = Object.keys(state.panelWidths);
    const childrenArray = React.Children.toArray(props.children);

    // For now, we are assuming that no more than 1 child will be added
    // or removed per update. This assumption makes life easier, and fits
    // the currently-planned usecase.

    // Is a panel removed in this update?
    if (panelIds.length > childrenArray.length) {
      const disappearingPanelIndex = panelIds.findIndex(
        id => !childrenArray.find(child => child.props.id === id)
      );
      const disappearingPanelId = panelIds[disappearingPanelIndex];
      const disappearingPanelWidth = state.panelWidths[disappearingPanelId];

      const siblingIndexToGiveSizeTo =
        disappearingPanelIndex === 0 ? 0 : disappearingPanelIndex - 1;
      const siblingId = panelIds[siblingIndexToGiveSizeTo];

      const nextPanelWidths = panelIds.reduce((panelWidths, id) => {
        if (id === disappearingPanelId) {
          return panelWidths;
        }

        let width;
        if (id === siblingId) {
          width =
            state.panelWidths[id] + disappearingPanelWidth + RESIZER_WIDTH;
        } else {
          width = state.panelWidths[id];
        }

        return {
          ...panelWidths,
          [id]: width,
        };
      }, {});

      return {
        panelWidths: nextPanelWidths,
      };
    }

    // Is a panel added in this update?
    if (panelIds.length < childrenArray.length) {
      const newChildIndex = childrenArray.findIndex(
        child => !panelIds.includes(child.props.id)
      );
      const newChildId = childrenArray[newChildIndex].props.id;

      // This new child will steal half of the width of its left-most sibling.
      // If this is the first child, it steals from its right-most sibling.
      const siblingIndexToStealFrom =
        newChildIndex === 0 ? 0 : newChildIndex - 1;

      const siblingPanelId = panelIds[siblingIndexToStealFrom];
      const siblingPanelWidth = state.panelWidths[siblingPanelId];

      const nextPanelWidths = props.children.reduce((panelWidths, child) => {
        const { id } = child.props;

        let width;
        if (id === newChildId) {
          width = Math.floor(siblingPanelWidth / 2) - RESIZER_WIDTH;
        } else if (id === siblingPanelId) {
          width = Math.ceil(siblingPanelWidth / 2);
        } else {
          width = state.panelWidths[id];
        }

        return {
          ...panelWidths,
          [id]: width,
        };
      }, {});

      return {
        panelWidths: nextPanelWidths,
      };
    }
  }

  static calculateInitialSizes = ({ width, children }: Props) => {
    const childrenArray = React.Children.toArray(children);

    const numOfResizers = childrenArray.length - 1;
    const availableWidth = width - numOfResizers * RESIZER_WIDTH;

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
      (availableWidth - totalClaimedSpace) /
      childrenWithoutSpecifiedSize.length;

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
    this.startPanelWidths = { ...this.state.panelWidths };

    this.resizerIndex = resizerIndex;
  };

  dragResize = (ev: any) => {
    const { startClientX, startClientY, startPanelWidths, resizerIndex } = this;
    const { panelWidths } = this.state;

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
      startPanelWidths[firstAffectedPanelId] - delta;

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
      [firstAffectedPanelId]: startPanelWidths[firstAffectedPanelId] - delta,
      [secondAffectedPanelId]: startPanelWidths[secondAffectedPanelId] + delta,
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
