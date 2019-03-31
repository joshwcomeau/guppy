import React from 'react';
import { mount } from 'enzyme';

import SidebarProjectIcon, { ProjectNameIcon } from './SidebarProjectIcon';
import SelectableImage from './../SelectableImage/SelectableImage';
import SelectableItem from '../SelectableItem';

describe('SidebarProjectIcon component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<SidebarProjectIcon size={22} name="my-project" />);
  });

  it('should render projectIcon with first letter', () => {
    expect(wrapper.find(ProjectNameIcon).text()).toEqual('M');
  });

  it('should render projectIcon as SeletableImage', () => {
    wrapper.setProps({ iconSrc: 'icon' });
    expect(wrapper.find(SelectableImage).exists()).toBe(true);
  });

  it('should set faded status if not selected', () => {
    expect(wrapper.find(SelectableItem).prop('status')).toEqual('faded');
  });

  it('should set highlighted status if selected', () => {
    wrapper.setProps({
      isSelected: true,
    });
    expect(wrapper.find(SelectableItem).prop('status')).toEqual('highlighted');
  });
});
