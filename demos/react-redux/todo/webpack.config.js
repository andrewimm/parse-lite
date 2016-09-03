const path = require('path');

module.exports = {
  entry: './index',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
}
