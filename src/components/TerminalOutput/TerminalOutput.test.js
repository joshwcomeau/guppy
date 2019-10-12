/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import { clearConsole } from '../../actions';

import TerminalOutput from './TerminalOutput';

// Create any initial state needed
const initialState = {
  projects: {
    byId: {
      'a-project': {
        path: 'path/to/project',
        guppy: {
          id: 'a-project',
          name: 'example',
          type: 'create-react-app',
          color: '#fff',
        },
      },
    },
    selectedId: 'a-project',
  },
  tasks: {
    'a-project': {},
  },
  dependencies: {
    loadedDependencies: {
      'a-project': {},
    },
  },
  paths: {
    byId: {
      'a-project': 'path/to/project',
    },
  },
};

const mockLogs = {
  task: {
    logs: [
      {
        id: 0,
        text: 'First line',
      },
      {
        id: 1,
        text: 'Second line',
      },
    ],
  },
};
// Here it is possible to pass in any middleware if needed into configureStore
const mockStore = configureStore();

jest.mock('xterm', () => {
  function Terminal() {
    return {
      clear: jest.fn(),
      destroy: jest.fn(),
      open: jest.fn(),
      scrollToBottom: jest.fn(),
      setOption: jest.fn(),
      write: jest.fn(),
      writeln: jest.fn(),

      // mock addons
      fit: jest.fn(),
      webLinksInit: jest.fn(),
      localLinksInit: jest.fn(),
    };
  }

  Terminal.applyAddon = jest.fn();
  return {
    Terminal,
  };
});

describe('TerminalOutput component', () => {
  let wrapper;
  let instance;
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(<TerminalOutput store={store} task={mockLogs.task} />);
    instance = wrapper
      .children()
      .first()
      .instance();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render terminal', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should write to console', () => {
    instance.write();
    instance.writeln();
    expect(instance.xterm.write).toHaveBeenCalled();
    expect(instance.xterm.writeln).toHaveBeenCalled();
  });

  it('should clear console', () => {
    instance.handleClear();
    expect(instance.renderedLogs).toEqual({});
    expect(store.getActions()[0]).toEqual(clearConsole(mockLogs.task));
  });

  it('should not clear console (no task object)', () => {
    wrapper = mount(<TerminalOutput store={store} />);
    instance = wrapper
      .children()
      .first()
      .instance();
    instance.handleClear();

    expect(store.getActions().length).toBe(0);
  });

  it('should update terminal on new log message', () => {
    wrapper.setProps({
      task: {
        logs: [
          ...mockLogs.task.logs,
          {
            id: mockLogs.task.logs.length,
            text: 'Third line',
          },
        ],
      },
    });

    expect(Object.keys(instance.renderedLogs)).toHaveLength(3);
    expect(instance.xterm.writeln).toHaveBeenCalledTimes(3);
    expect(instance.xterm.scrollToBottom).toHaveBeenCalledTimes(3);
  });

  it('should reset logs in local state & clear terminal', () => {
    wrapper.setProps({
      task: {
        logs: [],
      },
    });
    instance = wrapper
      .children()
      .first()
      .instance();
    expect(instance.state.logs).toHaveLength(0);
    expect(instance.xterm.clear).toHaveBeenCalled();
  });

  it('should call fit on size change', () => {
    wrapper.setProps({ width: 200 });
    expect(instance.xterm.fit).toHaveBeenCalled();
    wrapper.setProps({ height: 100 });
    expect(instance.xterm.fit).toHaveBeenCalled();
  });
});
