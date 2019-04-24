/* eslint-disable flowtype/require-valid-file-annotation */
jest.mock('child_process');

const createOsMock = osName => {
  jest.doMock('os', () => ({
    homedir: jest.fn(),
    platform: () => osName,
  }));
};

const createPsTreeMock = (id, err, children) => {
  jest.doMock('ps-tree', () => jest.fn((doomedId, cb) => cb(err, children)));
};

describe('killProcessId', () => {
  const id = '12345';
  beforeEach(() => {
    jest.resetModules(); // reset os mock
  });

  it('should spawn taskkill on Windows', async () => {
    createOsMock('win32');

    const killProcessId = await import('./kill-process-id.service');
    const childProcess = await import('child_process');

    await killProcessId(id);
    expect(childProcess.spawnSync).toHaveBeenCalledWith('taskkill', [
      '/pid',
      id,
      '/f',
      '/t',
    ]);
  });

  it('should call psTree & kill children on Linux', async () => {
    const children = [{ PID: 1 }, { PID: 2 }, { PID: 3 }];
    createPsTreeMock(id, null, children);
    createOsMock('linux');

    const killProcessId = await import('./kill-process-id.service');
    const childProcess = await import('child_process');
    const psTree = await import('ps-tree');

    await killProcessId(id);
    expect(psTree).toHaveBeenCalledWith(id, expect.any(Function));
    expect(childProcess.spawnSync).toHaveBeenCalledWith('kill', [
      '-9',
      id,
      ...children.map(child => child.PID),
    ]);
  });

  it('should log to console on error (Linux)', async () => {
    const errorText = 'children-not-found';
    const errorMock = jest.fn();
    global.console = {
      error: errorMock,
    };
    createPsTreeMock(id, errorText, [{ PID: 0 }]);
    createOsMock('linux');

    const killProcessId = await import('./kill-process-id.service');

    killProcessId(id);
    expect(errorMock).toHaveBeenCalledWith(
      expect.stringMatching(/could not/i),
      errorText
    );
  });
});
