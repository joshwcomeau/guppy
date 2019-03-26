import React from 'react';
import { shallow } from 'enzyme';

import AddDependencySearchBox from '../AddDependencySearchBox';

describe('AddDependencySearchBox component', () => {
  const wrapper = shallow(<AddDependencySearchBox />);

  it('should render SearchBox', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
