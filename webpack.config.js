'use strict';
var path = require('path');
var resolve = path.resolve;
module.exports = env => {
  return {
    entry: './app.ts',
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      pathinfo: !env.prod,
    },
    context: resolve(__dirname, 'src'),
    resolve: {
     extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    devtool: env.prod ? 'source-map' : 'eval',
    bail: env.prod,
    module: {
      loaders: [
        {
          test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
          loader : 'url?prefix=font/&limit=10000'
        },
        {
          test: /\.(jpg|png)$/,
          loader: 'url?limit=100000'
        },
        { test: /\.ts$/, loader: 'ts-loader' },
        { test: /\.css$/, loader: 'style-loader!css-loader' }
      ],
    },
  };
};
