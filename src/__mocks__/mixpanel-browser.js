module.exports = {
  init: jest.fn(),
  identify: jest.fn(),
  track: jest.fn(),
  has_opted_out_tracking: jest.fn(() => false),
};
