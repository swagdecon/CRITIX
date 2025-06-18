// const MillionLint = require('@million/lint').default;

module.exports = {
  // plugins: [MillionLint.craco()],
  babel: {
    plugins: [
      ['babel-plugin-react-compiler', { target: '18' }]
    ]
  },
  webpack: {
    configure: (webpackConfig) => {
      // Patch all .mjs/.js files to relax "fullySpecified"
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      return webpackConfig;
    }
  }
};
