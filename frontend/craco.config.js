const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
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
    },
  },
};
