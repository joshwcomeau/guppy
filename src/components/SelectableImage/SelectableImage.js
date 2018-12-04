// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import SelectableItem from '../SelectableItem';
import type { Props as SelectableItemProps, Status } from '../SelectableItem';

type Props = $Rest<
  SelectableItemProps,
  {| children: (status: Status) => React$Node |}
> & {
  src: string,
};

class SelectableImage extends PureComponent<Props> {
  render() {
    const { src, ...delegated } = this.props;

    return (
      <SelectableItem {...delegated}>
        {status => <Image src={src} status={status} />}
      </SelectableItem>
    );
  }
}

const Image = styled.img`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: ${props => (props.status === 'faded' ? 0.55 : 1)};
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`;

export default SelectableImage;
