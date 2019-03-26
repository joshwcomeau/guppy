import React from 'react';
import { shallow } from 'enzyme';
import SubmitButton, { ChildWrapper } from '../SubmitButton';

describe('SubmitButton component', () => {
  let wrapper;
  let mockSubmit;

  const shallowRender = (hasBeenSubmitted, ready, isDisabled = false) =>
    shallow(
      <SubmitButton
        readyToBeSubmitted={ready}
        hasBeenSubmitted={hasBeenSubmitted}
        isDisabled={isDisabled}
        onSubmit={mockSubmit}
      />
    );
  beforeEach(() => {
    mockSubmit = jest.fn();
  });

  it(`should render 'Building...' button text`, () => {
    wrapper = shallowRender(true, true);
    expect(
      wrapper
        .find(ChildWrapper)
        .children()
        .text()
    ).toEqual('Building...');
  });

  it(`should render 'Lets do this' button text`, () => {
    wrapper = shallowRender(false, true);
    expect(
      wrapper
        .find(ChildWrapper)
        .children()
        .text()
    ).toEqual(`Let's do this`);
  });

  it(`should render 'Next' button text`, () => {
    wrapper = shallowRender(false, false);
    expect(
      wrapper
        .find(ChildWrapper)
        .children()
        .text()
    ).toEqual(`Next`);
  });

  it('should submit', () => {
    wrapper = shallowRender(true, true);
    wrapper.simulate('click');
    expect(mockSubmit).toHaveBeenCalled();
  });
});
