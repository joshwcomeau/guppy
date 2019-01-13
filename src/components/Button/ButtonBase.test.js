/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow, mount } from 'enzyme';
import ButtonBase, {
  XSmallButton,
  SmallButton,
  MediumButton,
  LargeButton,
} from './ButtonBase';

const sizes = ['xsmall', 'small', 'medium', 'large'];
const sizeComponents = {
  xsmall: XSmallButton,
  small: SmallButton,
  medium: MediumButton,
  large: LargeButton,
};

describe('ButtonBase component', () => {
  describe('Button with size prop', () => {
    const wrapper = shallow(<ButtonBase />);
    const instance = wrapper.instance();

    for (const size of sizes) {
      it(`should return sized button component for size = ${size}`, () => {
        const component = instance.getButtonElem(size);
        expect(component).toBe(sizeComponents[size]);
      });
      it(`should render button for ${size} size`, () => {
        // Using mount so the styles are available in the snapshot
        const wrapperSizedButton = mount(<ButtonBase size={size} />);
        expect(wrapperSizedButton).toMatchSnapshot();
      });
      it(`should render button for ${size} size with-out padding`, () => {
        // Using mount so the styles are available in the snapshot
        const wrapperSizedButton = mount(<ButtonBase size={size} noPadding />);
        expect(wrapperSizedButton).toMatchSnapshot();
      });
    }

    it('should return default size medium', () => {
      const componentDefault = instance.getButtonElem();
      expect(componentDefault).toBe(sizeComponents['medium']);
    });
  });
});
