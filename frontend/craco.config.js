// const MillionLint = require('@million/lint').default;

module.exports = {
  // plugins: [MillionLint.craco()],
  babel: {
    plugins: [
      ['babel-plugin-react-compiler', { target: '18' }]
    ]
  }
};
