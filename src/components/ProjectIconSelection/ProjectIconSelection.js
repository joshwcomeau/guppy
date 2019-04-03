// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import importAll from 'import-all.macro';

import { shuffle } from '../../utils';

import SelectableImage from '../SelectableImage';

const icons: Array<mixed> = importAll.sync(
  '../../assets/images/icons/icon_*.*'
);
const iconSrcs: Array<string> = Object.values(icons).map(src => String(src));

const DEFAULT_SUBSET_LENGTH = 21;
const DEFAULT_ICON_SIZE = 60;

type Props = {
  selectedIcon: ?string,
  limitTo?: number,
  randomize?: boolean,
  onSelectIcon: (src: string, ev: SyntheticMouseEvent<*>) => void,
};

class ProjectIconSelection extends Component<Props> {
  static defaultProps = {
    limitTo: DEFAULT_SUBSET_LENGTH,
  };

  randomizedIcons = shuffle<string>(iconSrcs);

  render() {
    const { selectedIcon, limitTo, randomize } = this.props;

    const iconSet = randomize ? this.randomizedIcons : iconSrcs;
    const shownIconSubset = iconSet.slice(0, limitTo);

    return (
      <ProjectIconWrapper>
        {shownIconSubset.map((src: string) => (
          <SelectableImageWrapper key={src}>
            <SelectableImage
              src={src}
              size={DEFAULT_ICON_SIZE}
              onClick={ev => this.props.onSelectIcon(src, ev)}
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
`;

export default ProjectIconSelection;
