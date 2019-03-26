import React from 'react';
import { shallow } from 'enzyme';

import DependencyInstalling from '../DependencyInstalling';
import { mockReactHit } from '../__mocks__/dependency';

describe('DependencyInstalling component', () => {
  const wrapper = shallow(<DependencyInstalling name={mockReactHit.name} />);

  it('should render (queued)', () => {
    wrapper.setProps({
      queued: true,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render (installing)', () => {
    wrapper.setProps({
      queued: false,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
