import React from 'react';
import { shallow } from 'enzyme';

import AddDependencySearchProvider from '../AddDependencySearchProvider';

describe('AddDependencySearchProvider component', () => {
  const wrapper = shallow(
    <AddDependencySearchProvider>
      <div />
    </AddDependencySearchProvider>
  );

  it('should render SearchBox', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
