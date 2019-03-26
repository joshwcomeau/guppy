import React from 'react';
import { shallow } from 'enzyme';
import { Spring } from 'react-spring';
import lolex from 'lolex';

import MainPane from '../MainPane';
import ProjectName from '../ProjectName';
import ProjectPath from '../ProjectPath';
import { FORM_STEPS } from '../CreateNewProjectWizard';

describe('MainPane component', () => {
  let wrapper;
  let instance;
  let mockActions;

  const project = {
    projectName: 'Project name',
    projectType: 'gatsby',
    projectIcon: 'an-icon',
    projectStarter: null,
  };

  const shallowRenderMainPane = (
    step,
    isProjectNameTaken = false,
    status = 'filling-in-form'
  ) => {
    mockActions = {
      updateFieldValue: jest.fn(),
      focusField: jest.fn(),
      handleSubmit: jest.fn(),
    };
    return shallow(
      <MainPane
        {...project}
        status={status}
        activeField={FORM_STEPS[step]}
        currentStepIndex={step}
        {...mockActions}
        hasBeenSubmitted={status !== 'filling-in-form'}
        isProjectNameTaken={isProjectNameTaken}
      />
    );
  };

  lolex.install();

  describe('Rendering', () => {
    const checkConditionalSteps = i => {
      wrapper = shallowRenderMainPane(i);
      instance = wrapper.instance();
      expect(instance.renderConditionalSteps(i)).toMatchSnapshot();
    };

    it('should render ProjectName & ProjectPath', () => {
      wrapper = shallowRenderMainPane(0)
        .find(Spring)
        .renderProp('children')({ offset: 50 });
      expect(wrapper.find(ProjectName).exists()).toBe(true);
      expect(wrapper.find(ProjectPath).exists()).toBe(true);
    });

    for (let i = 0; i < FORM_STEPS.length; i++) {
      it(`should render step ${FORM_STEPS[i]}`, () => checkConditionalSteps(i));
    }
  });
  describe('Component logic', () => {
    beforeEach(() => {
      wrapper = shallowRenderMainPane(0);
      instance = wrapper.instance();
    });

    it('should trigger projectName focus', () => {
      instance.handleFocusProjectName();
      expect(mockActions.focusField).toHaveBeenCalledWith('projectName');
    });

    it('should trigger projectName blur', () => {
      instance.handleBlurProjectName();
      expect(mockActions.focusField).toHaveBeenCalledWith(null);
    });

    it('should trigger projectStarter focus', () => {
      instance.handleFocusStarter();
      expect(mockActions.focusField).toHaveBeenCalledWith('projectStarter');
    });

    it('should update projectName', () => {
      instance.updateProjectName('New name');
      expect(mockActions.updateFieldValue).toHaveBeenCalledWith(
        'projectName',
        'New name'
      );
    });

    it('should update projectType', () => {
      instance.updateProjectType('create-react-app');
      expect(mockActions.updateFieldValue).toHaveBeenCalledWith(
        'projectType',
        'create-react-app'
      );
    });

    it('should update projectIcon', () => {
      instance.updateProjectIcon('new-icon');
      expect(mockActions.updateFieldValue).toHaveBeenCalledWith(
        'projectIcon',
        'new-icon'
      );
    });

    it('should update projectStarter', () => {
      instance.updateGatsbyStarter('gatsby-blog-starter');
      expect(mockActions.updateFieldValue).toHaveBeenCalledWith(
        'projectStarter',
        'gatsby-blog-starter'
      );
    });

    it('should disable submit if form not ready', () => {
      // Clear props
      wrapper.setProps({
        projectType: null,
        projectIcon: null,
      });

      let disabled = instance.isSubmitDisabled(3, 3);
      expect(disabled).toBeTruthy();
    });
  });
});
