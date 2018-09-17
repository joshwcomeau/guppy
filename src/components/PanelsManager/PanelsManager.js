import React, { PureComponent, Fragment } from 'react';
import GridLayout from 'react-grid-layout';
import { FillButton } from '../Button';
import Spacer from '../Spacer';
// import { Responsive, WidthProvider } from 'react-grid-layout';

import type { Panel } from '../../types';

type Props = {
  panels: Array<Panel>,
  simpleMode: boolean, // if true -> render with-out panels
  addPanel: panel => void,
};

class Panels extends PureComponent<Props> {
  renderSimpleMode(panels) {
    return panels.map(({ key, Component }) => (
      <div key={key}>
        {Component}
        <Spacer size={15} />
      </div>
    ));
  }

  render() {
    const { panels, simpleMode, addPanel } = this.props;
    return simpleMode ? (
      <Fragment>{this.renderSimpleMode(panels)}</Fragment>
    ) : (
      <Fragment>
        <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
          {panels.map(({ key, grid, Component }) => (
            <div key={key} data-grid={grid}>
              {Component}
            </div>
          ))}
        </GridLayout>
        <FillButton onClick={addPanel}>Add panel</FillButton>
      </Fragment>
    );
  }
}

// todo connect to redux & create panels reducer --> for now we're passing the default props to Panels
export default Panels;
