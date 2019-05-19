var path = require('path');
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/serviceWorker.js'),
    })],
};