module.exports = function override(config) {
    config.devServer = {
        ...config.devServer,
        allowedHosts: [".railway.app"],
        port: process.env.PORT || 8080,
    };

    return config;
};