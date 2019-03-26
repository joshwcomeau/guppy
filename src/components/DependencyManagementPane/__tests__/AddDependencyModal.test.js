import React from 'react';
import { shallow } from 'enzyme';
import { InfiniteHits } from 'react-instantsearch/dom';

import { AddDependencyModal } from '../AddDependencyModal';
import AddDependencyInitialScreen from '../AddDependencyInitialScreen';

describe('AddDependencyModal component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<AddDependencyModal isVisible={true} />);
  });

  it('should render initial screen', () => {
    expect(wrapper.find(AddDependencyInitialScreen)).toHaveLength(1);
  });

  it('should render hits', () => {
    wrapper.setProps({
      searchResults: {
        query: 'React',
      },
    });
    expect(wrapper.find(InfiniteHits)).toHaveLength(1);
  });
});
