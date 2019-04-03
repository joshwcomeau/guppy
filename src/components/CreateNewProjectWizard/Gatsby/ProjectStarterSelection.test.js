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

  describe('Fetch starters', () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    it('should succeed', async done => {
      fetch.mockResponse(mockStartersYaml);
      wrapper = shallow(<ProjectStarterSelection />);
      instance = wrapper.instance();

      await instance.componentDidMount();
      expect(instance.state.starters).toHaveLength(6);
      done();
    });

    it('should fail', async done => {
      const error = new Error('ENOTFOUND');
      fetch.mockReject(error);
      wrapper = shallow(<ProjectStarterSelection />);
      instance = wrapper.instance();

      await instance.componentDidMount();
      expect(instance.state.error).toBe(error);
      done();
    });
  });

  beforeEach(() => {
    fetch.mockResponse(mockStartersYaml);
    mockedOnSelect = jest.fn();
    wrapper = shallow(<ProjectStarterSelection onSelect={mockedOnSelect} />);
    instance = wrapper.instance();
  });

  it('should render two elements', () => {
    expect(wrapper.children()).toHaveLength(2);
  });

  it('should use all starters (paginated)', () => {
    expect(instance.state.starters).toHaveLength(6);
    wrapper.setProps({ projectStarter: '' });
    expect(
      wrapper
        .children()
        .at(1)
        .props().starters
    ).toHaveLength(instance.PAGINATION_STEP);
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

    // Don't hide list if projectStarter selected
    wrapper.setProps({ projectStarter: 'blog' });
    instance.toggleStarterSelection();
    expect(instance.state.starterListVisible).toBeTruthy();
  });

  it('should deselect starter if selectedStarter clicked', () => {
    wrapper.setProps({ projectStarter: 'blog' });
    instance.handleOnSelect('blog', true);
    expect(mockedOnSelect).toHaveBeenCalledWith('');
  });

  it('should update projectStarter', () => {
    instance.handleOnSelect('blog', false);
    expect(mockedOnSelect).toHaveBeenCalledWith('blog');
  });

  it('should update search string & display starter list', () => {
    const starter = 'blog';
    instance.updateSearchString(starter);
    expect(instance.state.starterListVisible).toBeTruthy();
    expect(instance.state.filterString).toEqual(starter);

    wrapper.setProps({ projectStarter: 'blog' });
    instance.updateSearchString('');
    expect(instance.state.starterListVisible).toBeTruthy();

    wrapper.setProps({ projectStarter: '' });
    instance.updateSearchString('');
    expect(instance.state.starterListVisible).toBeFalsy();
  });

  it('should select starter (with https) from list', () => {
    const starter = 'https://github.com/wonism/gatsby-advanced-blog';
    instance.updateSearchString(starter);
    expect(mockedOnSelect).toHaveBeenCalledWith(starter);
  });

  it('should select starter (with repo name) in list', () => {
    const starter = 'https://github.com/wonism/gatsby-advanced-blog';
    instance.updateSearchString('gatsby-advanced-blog');
    expect(mockedOnSelect).toHaveBeenCalledWith(starter);
  });

  it('should select starter (with https) not in list', () => {
    const starter =
      'https://github.com/2manyprojects2littletime/gatsby-starter-blog';
    instance.updateSearchString(starter);
    expect(mockedOnSelect).toHaveBeenCalledWith(starter);
  });

  it('should move the selected starter to first entry of starter list', () => {
    const blogStarterUrl = 'https://github.com/dschau/gatsby-blog-starter-kit';
    wrapper.setProps({ projectStarter: blogStarterUrl });
    expect(
      instance.filteredStarters.findIndex(
        starter => starter.repo === blogStarterUrl
      )
    ).toBe(0);
  });
});
