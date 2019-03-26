import React from 'react';
import { shallow } from 'enzyme';
import Icon from 'react-icons-kit';
import { u1F4C8 as barGraphIcon } from 'react-icons-kit/noto_emoji_regular/u1F4C8';
import lolex from 'lolex';

import {
  StatsItem,
  getColorForDownloadNumber,
  AddDependencySearchResult,
  Header,
  Description,
  StatsRow,
} from '../AddDependencySearchResult';
import Divider from '../../Divider';
import Spacer from '../../Spacer';
import { StrokeButton } from '../../Button';
import { mockReactHit } from '../__mocks__/dependency';

describe('AddDependencySearchResult component', () => {
  lolex.install();
  let wrapper;
  const projectId = 'a-project';
  const mockAddDependency = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <AddDependencySearchResult
        projectId={projectId}
        hit={mockReactHit}
        addDependency={mockAddDependency}
      />
    );
  });

  it('should render a StatsItem', () => {
    const StatsItemWrapper = shallow(
      <StatsItem icon={<Icon icon={barGraphIcon} />}>
        10 downloads a month
      </StatsItem>
    );
    expect(StatsItemWrapper).toMatchSnapshot();
  });

  // Todo: If we ever refactor the color method it would be good to create a limits constant.
  //       So we can use it here e.g. like limit[0] - 1
  //       Also exporting the color per limit would be good,
  //       so it's clear what color we expect for each limit
  // Cases to test:
  // number < 5000
  // number between 5000 & 50000
  // above 50000
  const limits = [4999, 49999, 50000];
  limits.forEach(limit => {
    it(`should create a colored download number ${limit}`, () => {
      expect(getColorForDownloadNumber(limit)).toMatchSnapshot();
    });
  });

  it('should add dependency on click', () => {
    const button = wrapper.find(Header).find(StrokeButton);
    button.simulate('click');
    expect(mockAddDependency).toHaveBeenCalledWith(
      projectId,
      mockReactHit.name,
      mockReactHit.version
    );
  });

  describe('Rendering', () => {
    it('should render a header (default)', () => {
      expect(wrapper.find(Header)).toMatchSnapshot();
    });

    it('should render a header (currentStatus idle)', () => {
      wrapper.setProps({
        currentStatus: 'idle',
      });
      expect(wrapper.find(Header)).toMatchSnapshot();
    });

    it('should render a header (currentStatus installing)', () => {
      wrapper.setProps({
        currentStatus: 'installing',
      });
      expect(wrapper.find(Header)).toMatchSnapshot();
    });

    it('should render a Description', () => {
      expect(wrapper.find(Description)).toMatchSnapshot();
    });

    it('should render a StatsRow', () => {
      expect(wrapper.find(StatsRow)).toMatchSnapshot();
    });

    it('should contain three spacers', () => {
      expect(wrapper.find(Spacer)).toHaveLength(3);
    });

    it('should contain one divider', () => {
      expect(wrapper.find(Divider)).toHaveLength(1);
    });
  });
});
