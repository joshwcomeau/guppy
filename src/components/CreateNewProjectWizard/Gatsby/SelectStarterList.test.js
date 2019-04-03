/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow, mount } from 'enzyme';
import yaml from 'js-yaml';

import SelectStarterList, {
  StarterItem,
  StarterItemHeading,
  ShowMoreWrapper,
} from './SelectStarterList';
import mockStartersYaml from './MockStarterYaml';

describe('ProjectStarterSelection component', () => {
  let wrapper;
  let instance;
  const starters = yaml.safeLoad(mockStartersYaml);
  const mockHandleShowMore = jest.fn();
  const mockUpdateStarter = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <SelectStarterList
        starters={starters}
        paginationIndex={4}
        lastIndex={starters.length}
        handleShowMore={mockHandleShowMore}
        updateStarter={mockUpdateStarter}
        isVisible={true}
      />
    );
    instance = wrapper.instance();
  });

  it('should render a list with 6 items', () => {
    expect(wrapper.find(StarterItem)).toHaveLength(6);
  });

  it('should render ShowMoreWrapper', () => {
    expect(wrapper.find(ShowMoreWrapper)).toBeDefined();
  });

  it('should add node reference to ScrollContainer', () => {
    // Mount required so innerRef will be set
    const mountedWrapper = mount(
      <SelectStarterList
        starters={starters}
        selectedStarter={starters[0].repo}
        isVisible={true}
      />
    );
    expect(mountedWrapper.instance().node).toBeDefined();
  });

  it('should call handleShowMore', () => {
    const showMoreButton = wrapper
      .find(ShowMoreWrapper)
      .children()
      .first();
    showMoreButton.simulate('click');
    expect(mockHandleShowMore).toHaveBeenCalled();
  });

  it('should call updateStarter', () => {
    // mock this.node
    instance.node = {
      scrollTop: jest.fn(),
    };
    wrapper
      .find(StarterItemHeading)
      .first()
      .simulate('click');
    expect(mockUpdateStarter).toHaveBeenCalledWith(starters[0].repo, false);
    // check scrollTop call
    expect(instance.node.scrollTop).toHaveBeenCalledWith(0);
  });

  it('should replace github.com with github in Codesandbox url', () => {
    const url = 'https://github.com/wonism/gatsby-advanced-blog';
    const expectedSandboxUrl =
      'https://codesandbox.io/s/github/wonism/gatsby-advanced-blog';

    expect(instance.prepareUrlForCodesandbox(url)).toBe(expectedSandboxUrl);
  });
});
