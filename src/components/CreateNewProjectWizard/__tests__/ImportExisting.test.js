import React from 'react';
import { shallow } from 'enzyme';
import { ImportExisting } from '../ImportExisting';

describe('ImportExisting component', () => {
  let wrapper;

  it('should render (after onboarding)', () => {
    wrapper = shallow(<ImportExisting isOnboarding={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it(`shouldn't render (during onboarding)`, () => {
    wrapper = shallow(<ImportExisting isOnboarding={true} />);
    expect(wrapper.html()).toBeNull();
  });
});
