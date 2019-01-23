/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { mount } from 'enzyme';
import Icon from 'react-icons-kit';
import { settings } from 'react-icons-kit/feather';
import ButtonWithIcon from './ButtonWithIcon';

describe('ButtonWithIcon component', () => {
  it('should render button with icon', () => {
    const icon = <Icon icon={settings} />;
    const wrapper = mount(<ButtonWithIcon icon={icon} />);
    expect(wrapper).toMatchSnapshot();
  });
});
