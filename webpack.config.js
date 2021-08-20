const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const conf_dev = {
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: 'Space'
  },
  module: {
    rules: [{
      test: /\.dat/,
      type: 'asset/resource',
      generator: {
        filename: '[name][ext]'
      }
    }, {
      test: /\.png/,
      type: 'asset/resource',
      generator: {
        filename: '[name][ext]'
      }
    }]
  }
};

const conf_prod = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: 'Space'
  },
  module: {
    rules: [{
      test: /\.dat/,
      type: 'asset/resource',
      generator: {
        filename: '[name][ext]'
      }
    }, {
      test: /\.png/,
      type: 'asset/resource',
      generator: {
        filename: '[name][ext]'
      }
    }]
  }
};

module.exports = function (env, argv) {
  return argv.mode === 'production' ? conf_prod:conf_dev;
};
