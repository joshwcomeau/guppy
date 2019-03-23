/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow } from 'enzyme';
import { remote } from 'electron'; // Mocked
import EjectButton, { dialogOptions, dialogCallback } from './EjectButton';
import BigClickableButton from '../BigClickableButton';

const { dialog } = remote;

describe('EjectButton component', () => {
  let wrapper;
  let clickHandler;

  beforeEach(() => {
    clickHandler = jest.fn();
    wrapper = shallow(<EjectButton onClick={clickHandler} />);
  });

  it('should render without being pressed (not running)', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as pressed (running)', () => {
    wrapper.setProps({ isRunning: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('Confirm dialog', () => {
    let ejectButton;
    beforeEach(() => {
      ejectButton = wrapper.find(BigClickableButton);
      ejectButton.simulate('click');
    });

    it('should display dialog', () => {
      expect(dialog.showMessageBox).toHaveBeenCalledWith(
        dialogOptions,
        expect.anything()
      );
    });

    it('should call clickHandler if confirmed', () => {
      dialogCallback.call(wrapper.instance(), 0);
      expect(clickHandler.mock.calls.length).toBe(1);
    });

    it('should dismiss with-out calling clickHandler', () => {
      dialogCallback.call(wrapper.instance(), 1);
      expect(clickHandler.mock.calls.length).toBe(0);
    });
  });
});
