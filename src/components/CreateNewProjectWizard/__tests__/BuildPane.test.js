import React from 'react';
import { shallow } from 'enzyme';

import BuildPane, { BUILD_STEP_KEYS } from '../BuildPane';
import createProject from '../../../services/create-project.service';

jest.mock('../../../services/create-project.service');

describe('BuildPane component', () => {
  let wrapper;
  let instance;
  const newProject = {
    projectName: 'New project',
    projectType: 'create-react-app',
    projectIcon: 'icon',
    projectStarter: '',
  };

  const mockHandleCompleteBuild = jest.fn();

  jest.useFakeTimers();

  const shallowRenderBuildPane = project =>
    shallow(
      <BuildPane
        {...project}
        status="filling-in-form"
        handleCompleteBuild={mockHandleCompleteBuild}
      />
    );

  const testOutputs = ['Installing packages', 'Dependencies installed'];

  beforeEach(() => {
    wrapper = shallowRenderBuildPane(newProject);
    instance = wrapper.instance();

    // Mock console errors so they don't output while running the test
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  BUILD_STEP_KEYS.forEach(buildStep => {
    it(`should render build step ${buildStep}`, () => {
      wrapper.setProps({
        currentBuildStep: buildStep,
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should call createProject', () => {
    wrapper.setProps({
      status: 'building-project',
    });
    jest.runAllTimers();
    expect(createProject).toHaveBeenCalled();
  });

  it('should throw error if a project prop is missing', () => {
    wrapper = shallowRenderBuildPane();
    instance = wrapper.instance();
    expect(instance.buildProject).toThrow(/insufficient data/i);
  });

  it('should handle status updated', () => {
    // Note: Instance.handleStatusUpdate is called from createProject service
    //       with data from stdout we're testing this here with a mock array of output strings
    testOutputs.forEach(output => {
      instance.handleStatusUpdate(output);
      expect(instance.state.currentBuildStep).toMatchSnapshot();
    });
  });

  it('should call handleComplete', () => {
    // Note: HandleComplete is also called from createProject service
    //       so it's OK to call this here directly as it's triggered
    //       once the service finished the work.
    instance.handleComplete(newProject);
    jest.runAllTimers();
    expect(mockHandleCompleteBuild).toHaveBeenCalledWith(newProject);
  });

  it('should handle error message', () => {
    instance.handleError('npx: installed');
    expect(instance.state.currentBuildStep).toEqual(BUILD_STEP_KEYS[1]);
  });
});
