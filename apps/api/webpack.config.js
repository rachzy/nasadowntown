const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config, { options }) => {
  // Environment file replacement
  const isProduction =
    options.optimization || process.env.NODE_ENV === 'production';

  config.resolve.alias = {
    ...config.resolve.alias,
    './environments/environment': path.resolve(
      __dirname,
      `src/environments/environment${isProduction ? '.prod' : ''}.ts`
    ),
  };

  return config;
});
