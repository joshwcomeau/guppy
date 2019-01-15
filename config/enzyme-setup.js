const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
