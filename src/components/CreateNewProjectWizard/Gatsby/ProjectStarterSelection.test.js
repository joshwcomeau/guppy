/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow } from 'enzyme';
import ProjectStarterSelection from './ProjectStarterSelection';
import fetch from 'node-fetch';

import mockStartersYaml from './MockStarterYaml';

describe('ProjectStarterSelection component', () => {
  let wrapper;
  let instance;
  let mockedOnSelect;

  fetch.mockResponse(mockStartersYaml);

  beforeEach(() => {
    mockedOnSelect = jest.fn();
    wrapper = shallow(<ProjectStarterSelection onSelect={mockedOnSelect} />);
    instance = wrapper.instance();
  });

  it('should render two elements', () => {
    expect(wrapper.children()).toHaveLength(2);
  });

  it('should use all starters (paginated)', () => {
    // const wrapperAllStarters = shallow(<ProjectStarterSelection />);
    expect(instance.state.starters).toHaveLength(6);
    wrapper.setProps({ projectStarter: '' });
    expect(
      wrapper
        .children()
        .at(1)
        .props().starters
    ).toHaveLength(instance.PAGINATION_STEP);
  });

  it('should fetch starters (mocked)', () => {
    expect(instance.state.starters).toHaveLength(6);
  });

  it('should increment paginationIndex with limiting', () => {
    instance.PAGINATION_STEP = 1; // reduce pagination step for testing
    expect(instance.state.paginationIndex).toBe(4);
    instance.handleShowMore();
    expect(instance.state.paginationIndex).toBe(5);
    instance.handleShowMore();
    instance.handleShowMore(); // check limiting to length
    expect(instance.state.paginationIndex).toBe(6);
  });

  it('should toggle list visibility', () => {
    expect(instance.state.starterListVisible).toBeFalsy();
    instance.toggleStarterSelection();
    expect(instance.state.starterListVisible).toBeTruthy();
  });

  it('should update search string & call onSelect', () => {
    const starter = 'blog';
    instance.updateSearchString(starter);
    expect(instance.state.starterListVisible).toBeTruthy();
    expect(mockedOnSelect.mock.calls).toHaveLength(1);
    expect(mockedOnSelect).toBeCalledWith(starter);
  });
});
