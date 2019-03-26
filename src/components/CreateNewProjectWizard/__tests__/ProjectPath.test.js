import React from 'react';
import { shallow } from 'enzyme';
import path from 'path';
import { remote } from 'electron'; // Mocked

import {
  ProjectPath,
  DirectoryButton,
  CLAMP_AT,
  dialogOptions,
  dialogCallback,
} from '../ProjectPath';
import { getProjectNameSlug } from '../../../services/create-project.service';

jest.mock('path', () => ({
  join: (...args) => args.join('/').concat('/'),
  resolve: () => '/',
}));

const { dialog } = remote;

describe('ProjectPath component', () => {
  let wrapper;
  let mockChangeDefaultProjectPath;
  const projectHome = 'homedir/user/guppy-dev'; // 22 chars
  const shallowRender = name => {
    mockChangeDefaultProjectPath = jest.fn();
    return shallow(
      <ProjectPath
        projectName={name}
        projectHome={projectHome}
        changeDefaultProjectPath={mockChangeDefaultProjectPath}
      />
    );
  };
  const shortName = 'Demo';
  const longName = 'Magical Summer Fox';

  describe('Rendering', () => {
    it('should render path with-out clamping', () => {
      wrapper = shallowRender(shortName);
      expect(wrapper).toMatchSnapshot();
      expect(
        wrapper
          .find(DirectoryButton)
          .children()
          .text()
      ).toEqual(path.join(projectHome, getProjectNameSlug(shortName)));
    });

    it('should render clamped', () => {
      wrapper = shallowRender(longName);
      expect(wrapper).toMatchSnapshot();

      expect(
        wrapper
          .find(DirectoryButton)
          .children()
          .text()
      ).toHaveLength(CLAMP_AT);
    });
  });

  describe('Component logic', () => {
    beforeEach(() => {
      wrapper = shallowRender(shortName);
    });

    it('should show dialog', () => {
      wrapper.find(DirectoryButton).simulate('click');

      expect(dialog.showOpenDialog).toHaveBeenCalledWith(
        dialogOptions,
        expect.anything()
      );
    });

    it('should change default project path if picked a path', () => {
      dialogCallback.call(wrapper.instance(), ['/some/path']);
      expect(mockChangeDefaultProjectPath).toHaveBeenCalledWith('/some/path');
    });

    it(`shouldn't change default project path if no path selected`, () => {
      dialogCallback.call(wrapper.instance(), null);
      expect(mockChangeDefaultProjectPath).not.toHaveBeenCalled();
    });
  });
});
