// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import importAll from 'import-all.macro';

import { sampleMany } from '../../utils';
import { BREAKPOINTS } from '../../constants';

import SelectableImage from '../SelectableImage';

const icons: Array<mixed> = importAll.sync(
  '../../assets/images/icons/icon_*.*'
);
const iconSrcs: Array<string> = Object.values(icons).map(src => String(src));

const DEFAULT_SUBSET = 10;
const DEFAULT_ICON_SIZE = 60;

type Props = {
  selectedIcon: ?string,
  showRandomSubset: boolean | number,
  onSelectIcon: (src: string) => void,
};

type State = {
  selectableIcons: Array<string>,
};

class ProjectIconSelection extends Component<Props, State> {
  state = {
    selectableIcons: [],
  };
  componentDidMount() {
    const { showRandomSubset } = this.props;
    const selectableIcons = !showRandomSubset
      ? iconSrcs
      : typeof showRandomSubset === 'number'
        ? sampleMany(iconSrcs, showRandomSubset)
        : sampleMany(iconSrcs, DEFAULT_SUBSET);

    this.setState({
      selectableIcons,
    });
  }
  render() {
    const { selectedIcon } = this.props;
    const { selectableIcons } = this.state;

    return (
      <ProjectIconWrapper>
        {selectableIcons.map((src: string) => (
          <SelectableImageWrapper key={src}>
            <SelectableImage
              src={src}
              size={DEFAULT_ICON_SIZE}
              onClick={() => this.props.onSelectIcon(src)}
              status={
                selectedIcon === null
                  ? 'default'
                  : selectedIcon === src
                    ? 'highlighted'
                    : 'faded'
              }
            />
          </SelectableImageWrapper>
        ))}
      </ProjectIconWrapper>
    );
  }
}

const ProjectIconWrapper = styled.div`
  margin-top: 16px;
`;

const SelectableImageWrapper = styled.div`
  display: inline-block;
  margin: 0px 10px 10px 0px;
  @media ${BREAKPOINTS.sm} {
    &:nth-of-type(n + 9) {
      display: none;
    }
  }
`;

export default ProjectIconSelection;
