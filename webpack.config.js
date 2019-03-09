const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = [
  {
    mode: 'production',
    entry: `./src/index.js`,
    output: {
      path: `${__dirname}/dist`,
      filename: 'bundle.js'
    },
    devServer: {
      port: 3000,
      contentBase: 'dist'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['env', { 'modules': false }],
                  'react'
                ]
              }
            }
          ],
          exclude: /node_modules/,
        }
      ]
    }
  },
  {
    mode: 'production',
    entry: {
      style: __dirname + "/stylesheets/style.scss",
    },
    output: {
      path: `${__dirname}/dist`,
      filename: '[name].css'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css'),
    ],
  },
];