// const MillionLint = require('@million/lint').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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

      webpackConfig.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'disabled',
        })
      );

      return webpackConfig;
    }
  }
};